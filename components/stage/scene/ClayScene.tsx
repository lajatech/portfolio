"use client";

import { useEffect, useRef, useState } from "react";
import {
  approach,
  clamp,
  easeInOutCubic,
  hash,
  lerp,
  win,
  type ChapterId,
} from "@/lib/motion";
import { useStageFrame, type Stage } from "@/components/stage/ScrollStage";
import { loadClayTexture, type Three } from "./assets";
import {
  buildGeometries,
  disposeGeometries,
  type Geometries,
} from "./geometry";
import { CLAY_COLORS, createClayMaterial } from "./materials";
import {
  BURST,
  framing,
  GONE,
  OBJECTS,
  REST,
  RIGS,
  forPortrait,
  type CameraRig,
  type ObjId,
  type Pose,
} from "./poses";

import type * as ThreeNS from "three";

/**
 * The clay sculptures that sit behind the page.
 *
 * Three constraints shaped this file, and most of the awkward bits in it are
 * one of the three:
 *
 * 1. three.js is imported dynamically inside the effect. It is a large
 *    dependency with no business in the initial bundle and no business running
 *    during SSR, and an `await import` is the only thing that guarantees both.
 *    The cost is that setup is async, so everything has to tolerate being torn
 *    down before it finished starting.
 *
 * 2. There is exactly one rAF loop on this page and ScrollStage owns it. Per
 *    frame work hooks in through `useStageFrame`. A second loop would double
 *    the scheduling and desynchronise the canvas from the DOM choreography by
 *    up to a frame, which is visible when the sculpture is meant to sit
 *    behind text that is moving with it.
 *
 * 3. The canvas is decoration. If WebGL is missing, if the textures 404, if
 *    the device is too small to carry it, or if the visitor asked for reduced
 *    motion, the page has to be exactly as usable with no canvas at all. So
 *    every failure path ends in "unmount the canvas and say nothing".
 */

/** Live scene handles, owned by the effect and read by the frame callback. */
type SceneRig = {
  THREE: Three;
  renderer: ThreeNS.WebGLRenderer;
  scene: ThreeNS.Scene;
  camera: ThreeNS.PerspectiveCamera;
  meshes: Map<ObjId, ThreeNS.Mesh>;
  ground: ThreeNS.Mesh;
  groundMaterial: ThreeNS.ShadowMaterial;
  groundOpacity: number;
  geometries: Geometries;
  materials: ThreeNS.MeshPhysicalMaterial[];
  texture: ThreeNS.Texture | null;
  /** scratch, reused every frame so the loop never allocates */
  pose: Pose;
  rig: CameraRig;
  target: ThreeNS.Vector3;
  /** scratch for projecting the target when shifting the frustum */
  projected: ThreeNS.Vector3;
  /** CSS pixel size of the canvas, kept in sync by the resize handler */
  width: number;
  height: number;
  portrait: boolean;
  /** true when we render once and stop: reduced motion */
  frozen: boolean;
  /** smoothed pointer parallax weight, so it fades in instead of popping */
  parallax: number;
  /** rolling frame cost, for the pixel ratio governor */
  costSum: number;
  costCount: number;
  dpr: number;
  dprCap: number;
};

/** Chapters that paint their own opaque ground over the canvas. */
const COVERED: ReadonlySet<ChapterId> = new Set<ChapterId>([
  "work",
  "recognition",
]);

const GROUND_OPACITY = 0.2;

/** Frame cost thresholds for the pixel ratio governor, in milliseconds. */
const COST_WINDOW = 36;
const COST_DROP = 24;
const COST_RAISE = 14;
const DPR_FLOOR = 0.75;

const lerpPose = (out: Pose, a: Pose, b: Pose, t: number): Pose => {
  const p = out.p as [number, number, number];
  const r = out.r as [number, number, number];
  for (let i = 0; i < 3; i++) {
    p[i] = lerp(a.p[i], b.p[i], t);
    r[i] = lerp(a.r[i], b.r[i], t);
  }
  out.s = lerp(a.s, b.s, t);
  return out;
};

const lerpRig = (out: CameraRig, a: CameraRig, b: CameraRig, t: number) => {
  const target = out.t as [number, number, number];
  for (let i = 0; i < 3; i++) target[i] = lerp(a.t[i], b.t[i], t);
  out.d = lerp(a.d, b.d, t);
  out.az = lerp(a.az, b.az, t);
  out.el = lerp(a.el, b.el, t);
  out.fov = lerp(a.fov, b.fov, t);
  // the framing has to blend as well, or the sculpture jumps across the
  // layout at every chapter boundary instead of travelling with the camera
  out.sx = lerp(a.sx, b.sx, t);
  out.sy = lerp(a.sy, b.sy, t);
  out.psx = lerp(a.psx, b.psx, t);
  out.psy = lerp(a.psy, b.psy, t);
};

/**
 * Shift a 0..1 weight later by `offset` while keeping 1 as the end point.
 *
 * Staggering by delaying the start rather than by stretching the whole curve
 * matters: every object must still be exactly on its target pose when the
 * weight reaches 1, or the shapes would sit permanently off their marks at
 * the end of a transition.
 */
const stagger = (w: number, offset: number): number =>
  clamp((w - offset) / Math.max(0.0001, 1 - offset));

/**
 * Should we even try?
 *
 * A small viewport paired with a weak device is the one case where the scene
 * is a net negative: it is a decorative background, it is the single most
 * expensive thing on the page, and on a cheap phone the frames it eats come
 * straight out of scroll smoothness for text the visitor is actually reading.
 * Better to never create the context than to create it and throttle it to
 * nothing. `deviceMemory` is non-standard and widely absent, so a missing
 * value is read as "fine", never as "weak".
 */
const tooWeak = (): boolean => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (window.innerWidth >= 600) return false;
  const cores = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;
  return (
    (typeof cores === "number" && cores > 0 && cores < 4) ||
    (typeof memory === "number" && memory > 0 && memory < 4)
  );
};

/**
 * A procedural sky, pre-filtered into an environment map.
 *
 * The clay needs something to reflect or the roughness has no information to
 * work with and the shapes read as flat vector fills. A three-stop gradient is
 * enough: it is the gradient, not the detail, that gives the rounded solids
 * their falloff. Doing it procedurally also means no HDR download, which would
 * be larger than everything else on the page put together.
 */
const buildEnvironment = (
  THREE: Three,
  renderer: ThreeNS.WebGLRenderer,
): { texture: ThreeNS.Texture; dispose: () => void } => {
  const gradientScene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(10, 16, 12);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTop: { value: new THREE.Color("#f4f6ff") },
      uHorizon: { value: new THREE.Color("#cfd4e2") },
      uBottom: { value: new THREE.Color("#8d8279") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop;
      uniform vec3 uHorizon;
      uniform vec3 uBottom;
      varying vec3 vDir;
      void main() {
        float h = normalize( vDir ).y;
        vec3 c = mix( uHorizon, uBottom, smoothstep( 0.0, -0.65, h ) );
        c = mix( c, uTop, smoothstep( 0.0, 0.8, h ) );
        gl_FragColor = vec4( c, 1.0 );
      }
    `,
  });
  gradientScene.add(new THREE.Mesh(geometry, material));

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(gradientScene, 0, 0.1, 100);
  // The generator, the sphere and the shader are all scaffolding: the only
  // thing worth keeping past this point is the filtered render target.
  pmrem.dispose();
  geometry.dispose();
  material.dispose();

  return {
    texture: target.texture,
    dispose: () => target.dispose(),
  };
};

export default function ClayScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rigRef = useRef<SceneRig | null>(null);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    // Read reduced motion from the media query rather than from the stage.
    // Effects run child first, so ScrollStage has not populated the stage yet
    // at this point and `stage.reducedMotion` would still be its default.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let teardown: (() => void) | null = null;
    /** The renderer, from the moment it exists until teardown owns it. */
    let partial: ThreeNS.WebGLRenderer | null = null;

    const start = async () => {
      // Yield one microtask before anything that can bail out. Bailing out
      // means dropping the canvas, which means a setState, and a setState in
      // the synchronous body of an effect is a cascading render on every
      // mount. One microtask later it is an ordinary update, and nobody can
      // see an empty transparent canvas for one microtask.
      await Promise.resolve();
      if (cancelled) return;
      try {
        if (tooWeak()) {
          setDead(true);
          return;
        }

        const THREE = await import("three");
        if (cancelled) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          // The shapes are large, smooth and slow moving, so MSAA buys very
          // little here and costs a lot on mobile. The pixel ratio governor
          // below is a better use of the same budget.
          antialias: false,
          // Transparent, because the chapter background colour is painted by
          // the stylesheet on <body> and has to show through.
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        });
        partial = renderer;
        renderer.setClearAlpha(0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // No tone mapping on purpose: the design specifies exact hex values
        // per shape, and any tone curve shifts them.
        renderer.toneMapping = THREE.NoToneMapping;

        const dprCap = Math.min(window.devicePixelRatio || 1, 1.75);
        renderer.setPixelRatio(dprCap);
        // updateStyle false: globals.css already sizes and positions #gl, and
        // letting three write inline width/height would fight it.
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          24,
          window.innerWidth / Math.max(1, window.innerHeight),
          0.5,
          120,
        );

        const env = buildEnvironment(THREE, renderer);
        scene.environment = env.texture;

        const key = new THREE.DirectionalLight(0xffffff, 2.5);
        key.position.set(6.5, 11, 7.5);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        // The sculpture is about 8 units across at rest and 20 when it bursts.
        // The shadow camera is sized for rest, since nothing is standing on
        // the ground in the burst pose and the catcher is hidden there anyway.
        const shadowCam = key.shadow.camera;
        shadowCam.left = -9;
        shadowCam.right = 9;
        shadowCam.top = 9;
        shadowCam.bottom = -9;
        shadowCam.near = 0.5;
        shadowCam.far = 34;
        shadowCam.updateProjectionMatrix();
        key.shadow.bias = -0.0004;
        key.shadow.normalBias = 0.03;
        key.shadow.radius = 3;
        scene.add(key);

        const fill = new THREE.HemisphereLight(0xdce6ff, 0xcbb9ad, 0.42);
        scene.add(fill);

        const texture = await loadClayTexture(THREE);
        if (cancelled) {
          texture?.dispose();
          env.dispose();
          renderer.dispose();
          partial = null;
          return;
        }

        const geometries = buildGeometries(THREE);
        const materials: ThreeNS.MeshPhysicalMaterial[] = [];
        const meshes = new Map<ObjId, ThreeNS.Mesh>();

        for (const spec of OBJECTS) {
          const material = createClayMaterial(THREE, {
            color: CLAY_COLORS[spec.id],
            map: texture,
          });
          materials.push(material);
          const mesh = new THREE.Mesh(geometries[spec.geometry], material);
          if (spec.order) mesh.rotation.order = spec.order;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const rest = REST[spec.id];
          mesh.position.set(rest.p[0], rest.p[1], rest.p[2]);
          mesh.rotation.set(rest.r[0], rest.r[1], rest.r[2]);
          mesh.scale.setScalar(rest.s);
          scene.add(mesh);
          meshes.set(spec.id, mesh);
        }

        // Shadow catcher. A ShadowMaterial renders only the shadow term, so
        // the plinth appears to sit on a surface without that surface ever
        // being drawn over the chapter background.
        const groundGeometry = new THREE.CircleGeometry(26, 48);
        const groundMaterial = new THREE.ShadowMaterial({
          opacity: GROUND_OPACITY,
          transparent: true,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        // The plinth hangs from y = 0 down to -0.638, so its base is here.
        ground.position.y = -0.638;
        ground.receiveShadow = true;
        scene.add(ground);

        const sceneRig: SceneRig = {
          THREE,
          renderer,
          scene,
          camera,
          meshes,
          ground,
          groundMaterial,
          groundOpacity: GROUND_OPACITY,
          geometries,
          materials,
          texture,
          pose: { p: [0, 0, 0], r: [0, 0, 0], s: 1 },
          rig: { t: [0, 0, 0], d: 1, az: 0, el: 0, fov: 24, sx: 0.5, sy: 0.5, psx: 0.5, psy: 0.5 },
          target: new THREE.Vector3(),
          projected: new THREE.Vector3(),
          width: window.innerWidth,
          height: Math.max(1, window.innerHeight),
          portrait: window.innerWidth / Math.max(1, window.innerHeight) < 1,
          frozen: reduced,
          parallax: 0,
          costSum: 0,
          costCount: 0,
          dpr: dprCap,
          dprCap,
        };

        const applyViewport = () => {
          const w = window.innerWidth;
          const h = Math.max(1, window.innerHeight);
          sceneRig.dprCap = Math.min(window.devicePixelRatio || 1, 1.75);
          sceneRig.dpr = Math.min(sceneRig.dpr, sceneRig.dprCap);
          sceneRig.width = w;
          sceneRig.height = h;
          sceneRig.portrait = w / h < 1;
          renderer.setPixelRatio(sceneRig.dpr);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          // the frustum shift is sized in pixels, so it has to be rebuilt
          // against the new viewport rather than carried over
          camera.clearViewOffset();
          camera.updateProjectionMatrix();
        };

        const place = (rig: CameraRig) => {
          sceneRig.target.set(rig.t[0], rig.t[1], rig.t[2]);
          const ce = Math.cos(rig.el);
          camera.position.set(
            sceneRig.target.x + rig.d * ce * Math.sin(rig.az),
            sceneRig.target.y + rig.d * Math.sin(rig.el),
            sceneRig.target.z + rig.d * ce * Math.cos(rig.az),
          );
          camera.lookAt(sceneRig.target);
          camera.clearViewOffset();
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();
          const framed = framing(rig, sceneRig.width, sceneRig.height, sceneRig.portrait);
          sceneRig.projected.copy(sceneRig.target).project(camera);
          camera.setViewOffset(
            sceneRig.width,
            sceneRig.height,
            ((sceneRig.projected.x + 1) / 2 - framed.sx) * sceneRig.width,
            ((1 - sceneRig.projected.y) / 2 - framed.sy) * sceneRig.height,
            sceneRig.width,
            sceneRig.height,
          );
          camera.updateProjectionMatrix();
          if (camera.fov !== rig.fov) {
            camera.fov = rig.fov;
            camera.updateProjectionMatrix();
          }
        };

        const onResize = () => {
          applyViewport();
          // A frozen scene has no loop to pick the new size up, so the one
          // static frame has to be re-rendered here or it stays stretched.
          if (sceneRig.frozen) {
            const portrait = window.innerWidth < window.innerHeight;
            place(portrait ? forPortrait(RIGS.hero) : RIGS.hero);
            renderer.render(scene, camera);
          }
        };

        applyViewport();
        window.addEventListener("resize", onResize);
        // ScrollStage dispatches this after it remeasures, which is also when
        // the layout has genuinely settled (fonts, late images). Listening to
        // it as well as to resize covers the cases plain resize misses.
        window.addEventListener("stage:remeasure", onResize);

        rigRef.current = sceneRig;

        // First frame now, rather than waiting for the next stage tick, so
        // the sculpture is already there when the loader lifts. Under reduced
        // motion this is also the last frame.
        {
          const portrait = window.innerWidth < window.innerHeight;
          place(portrait ? forPortrait(RIGS.hero) : RIGS.hero);
          renderer.render(scene, camera);
        }

        teardown = () => {
          window.removeEventListener("resize", onResize);
          window.removeEventListener("stage:remeasure", onResize);
          rigRef.current = null;
          scene.environment = null;
          scene.clear();
          disposeGeometries(geometries);
          groundGeometry.dispose();
          groundMaterial.dispose();
          for (const material of materials) material.dispose();
          texture?.dispose();
          env.dispose();
          // The shadow map is a render target of its own and is not covered
          // by the light's dispose, nor by the renderer's.
          key.shadow.dispose();
          key.dispose();
          fill.dispose();
          renderer.dispose();
          partial = null;
        };

        // Lost the race with unmount while the texture was in flight.
        if (cancelled) {
          teardown();
          teardown = null;
        }
      } catch {
        // No WebGL, a blocked context, a driver that refuses the shader: all
        // of it ends the same way. Drop the canvas and let the page be a page.
        rigRef.current = null;
        // If we got far enough to hold a context, give it back. A leaked
        // context counts against the browser's small per-page limit, so a
        // failure here could otherwise poison a later retry.
        partial?.dispose();
        partial = null;
        if (!cancelled) setDead(true);
      }
    };

    void start();

    return () => {
      cancelled = true;
      teardown?.();
      teardown = null;
    };
  }, []);

  useStageFrame((stage: Stage) => {
    const rig = rigRef.current;
    if (!rig) return;

    // Reduced motion: one static frame was rendered at setup and that is the
    // whole contract. Nothing here may move it.
    if (rig.frozen || stage.reducedMotion) return;

    // The work and recognition chapters paint opaque backgrounds above the
    // canvas (z-index 3 against the canvas at 0), so anything drawn while one
    // of them is current is drawn where nobody can see it. Skipping is free
    // and it is where most of the mobile frame budget comes back: the poses
    // are pure functions of scroll, so the first frame after the skip is
    // already correct and there is nothing to catch up.
    if (COVERED.has(stage.current)) return;

    const t0 = performance.now();
    const { camera, scene, renderer, meshes, pose, rig: camRig } = rig;
    const s = stage.sections;
    const y = stage.sy;

    // Four sequential crossfades. Each one has run to 1 before the next
    // begins, so nesting the blends is equivalent to a timeline and far
    // cheaper than resolving a weighted set of five poses per object.
    const wBurst = easeInOutCubic(win(s, "manifesto", -0.55, 0.15, y));
    const wReform = easeInOutCubic(win(s, "capabilities", -0.75, -0.05, y));
    const wGone = easeInOutCubic(win(s, "recognition", -0.5, 0.1, y));
    const wReturn = easeInOutCubic(win(s, "contact", -0.55, -0.02, y));

    const standing = (1 - wBurst + wReform) * (1 - wGone + wReturn);

    for (let i = 0; i < OBJECTS.length; i++) {
      const id = OBJECTS[i].id;
      const mesh = meshes.get(id);
      if (!mesh) continue;

      // A small deterministic delay per object. Without it thirteen solids
      // start and stop on the same frame, which reads as one rigid body
      // rather than as thirteen pieces.
      const off = hash(i) * 0.17;
      const rest = REST[id];

      lerpPose(pose, rest, BURST[id], stagger(wBurst, off));
      lerpPose(pose, pose, rest, stagger(wReform, off));
      lerpPose(pose, pose, GONE[id], stagger(wGone, off));
      lerpPose(pose, pose, rest, stagger(wReturn, off));

      // Idle drift, scaled by displacement: a piece sitting in the assembled
      // sculpture should look set in place, while a piece adrift in the burst
      // should look adrift. Distance from rest is a free measure of which.
      const dx = pose.p[0] - rest.p[0];
      const dy = pose.p[1] - rest.p[1];
      const dz = pose.p[2] - rest.p[2];
      const drift = Math.min(1, Math.sqrt(dx * dx + dy * dy + dz * dz) / 8);
      const h1 = hash(i * 7.3 + 1);
      const h2 = hash(i * 13.1 + 5);
      const amp = 0.035 + drift * 0.42;
      const phase = stage.time * (0.33 + h1 * 0.4) + h1 * 6.2832;

      mesh.position.set(
        pose.p[0] + Math.cos(phase * 0.8 + h2 * 3) * amp * 0.5,
        pose.p[1] + Math.sin(phase) * amp,
        pose.p[2] + Math.sin(phase * 0.7 + h2 * 5) * amp * 0.5,
      );
      const spin = (0.02 + drift * 0.3) * Math.sin(phase * 0.6 + h2 * 6.2832);
      mesh.rotation.set(pose.r[0] + spin * 0.6, pose.r[1] + spin, pose.r[2]);
      mesh.scale.setScalar(pose.s);
    }

    // The catcher is a lie about a floor nobody can see. It is only true while
    // something is actually standing on that floor.
    rig.groundMaterial.opacity = rig.groundOpacity * clamp(standing);
    rig.ground.visible = rig.groundMaterial.opacity > 0.004;

    lerpRig(camRig, RIGS.hero, RIGS.burst, wBurst);
    lerpRig(camRig, camRig, RIGS.services, wReform);
    lerpRig(
      camRig,
      camRig,
      RIGS.process,
      easeInOutCubic(win(s, "process", -0.6, -0.05, y)),
    );
    lerpRig(camRig, camRig, RIGS.contact, wReturn);

    if (stage.isPortrait) {
      const portrait = forPortrait(camRig);
      camRig.d = portrait.d;
      camRig.fov = portrait.fov;
    }

    // Parallax only in the two chapters that are about the sculpture itself.
    // Elsewhere the camera is carrying a layout, and letting the pointer nudge
    // it there makes the shapes drift out from behind the type they belong to.
    const wants =
      (stage.current === "hero" || stage.current === "contact") &&
      stage.pointer.active
        ? 1
        : 0;
    // Approached rather than set, so entering or leaving those chapters fades
    // the parallax instead of snapping the camera.
    rig.parallax = approach(rig.parallax, wants, 4, stage.dt);
    camRig.az += stage.pointer.sx * 0.11 * rig.parallax;
    camRig.el += -stage.pointer.sy * 0.055 * rig.parallax;

    rig.target.set(camRig.t[0], camRig.t[1], camRig.t[2]);
    const ce = Math.cos(camRig.el);
    camera.position.set(
      rig.target.x + camRig.d * ce * Math.sin(camRig.az),
      rig.target.y + camRig.d * Math.sin(camRig.el),
      rig.target.z + camRig.d * ce * Math.cos(camRig.az),
    );
    camera.lookAt(rig.target);
    if (Math.abs(camera.fov - camRig.fov) > 0.001) {
      camera.fov = camRig.fov;
    }

    /**
     * Put the sculpture where the composition wants it.
     *
     * The camera keeps looking at the target, but the frustum is shifted so
     * that target lands at the rig's screen fraction. Doing it this way rather
     * than by moving the camera sideways preserves the perspective: panning
     * the camera would skew the shapes, where this just re-crops the same
     * projection. The target is projected first to find where it currently
     * falls, hence the clear and the two updates around it.
     */
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const { sx, sy } = framing(camRig, rig.width, rig.height, rig.portrait);
    rig.projected.copy(rig.target).project(camera);
    camera.setViewOffset(
      rig.width,
      rig.height,
      ((rig.projected.x + 1) / 2 - sx) * rig.width,
      ((1 - rig.projected.y) / 2 - sy) * rig.height,
      rig.width,
      rig.height,
    );
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);

    /**
     * Pixel ratio governor.
     *
     * A fixed pixel ratio is a bet on hardware we cannot see. Measuring the
     * real cost and backing off instead means a weak GPU gets a blurrier but
     * smooth scene, and a strong one is not punished for the weak one's sake.
     * The window is deliberately long (about half a second) so a single
     * expensive frame, a GC pause or a scroll-triggered relayout does not move
     * the resolution: only a sustained cost does.
     */
    rig.costSum += performance.now() - t0;
    rig.costCount++;
    if (rig.costCount >= COST_WINDOW) {
      const average = rig.costSum / rig.costCount;
      rig.costSum = 0;
      rig.costCount = 0;
      let next = rig.dpr;
      if (average > COST_DROP) next = Math.max(DPR_FLOOR, rig.dpr * 0.8);
      else if (average < COST_RAISE) next = Math.min(rig.dprCap, rig.dpr * 1.15);
      if (Math.abs(next - rig.dpr) > 0.01) {
        rig.dpr = next;
        renderer.setPixelRatio(next);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
    }
  });

  if (dead) return null;
  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
