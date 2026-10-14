/**
 * The clay material.
 *
 * One MeshPhysicalMaterial per shape, patched through `onBeforeCompile`. The
 * patch is three small additions to three's own physical shader rather than a
 * bespoke ShaderMaterial, because the shadows, the environment map and the
 * tone of the lighting all come from three's lighting chunks for free, and
 * reimplementing them to add surface noise would be a bad trade.
 *
 * Why triplanar sampling and not a UV lookup: none of these solids has usable
 * UVs. A LatheGeometry's UVs pinch to nothing at the poles, and an
 * ExtrudeGeometry's cap UVs are the raw shape coordinates while its wall UVs
 * are an unrelated arc-length parameterisation, so a texture crosses the seam
 * at a different scale on every face. Triplanar projection sidesteps the whole
 * problem: the grain is sampled from object space and blended by the normal,
 * so it is continuous across every seam and costs no authoring. The price is
 * three texture fetches per fragment instead of one, which is why the four
 * source scans are packed into one atlas (see assets.ts).
 *
 * No baked lightmaps are used. The matte read comes from a low env intensity,
 * roughness near 0.5 with zero metalness, and the bounce term below, which
 * lifts downward-facing normals toward the ground colour so undersides read as
 * clay in shade rather than as black holes.
 */

import type * as ThreeNS from "three";
import type { Three } from "./assets";
import type { ObjId } from "./poses";

/** Exact per-shape colours from the design. */
export const CLAY_COLORS: Record<ObjId, string> = {
  plinth: "#EFE7E4",
  arch: "#FD7A5C",
  ball: "#F5F2F2",
  half: "#F9C659",
  stairs: "#0350C8",
  quarter: "#E65AA4",
  cone: "#EBB52E",
  torus: "#F5F2F2",
  dot: "#0050CC",
  fCoral: "#FD7A5C",
  fNavy: "#0050CC",
  fWhite: "#F5F2F2",
  fPyr: "#F47AD2",
};

export type ClayOptions = {
  color: string | number;
  /** Shared clay atlas, or null for the plain matte fallback. */
  map?: ThreeNS.Texture | null;
  roughness?: number;
  /** Albedo grain depth, 0..1. */
  noise?: number;
  /** Normal perturbation depth. */
  normalStrength?: number;
  /** Object-space frequency of the grain. */
  grainScale?: number;
  /** How much ground colour the undersides pick up. */
  bounce?: number;
  bounceColor?: string | number;
  envIntensity?: number;
};

const VERTEX_VARYINGS = /* glsl */ `
varying vec3 vClayPos;
varying vec3 vClayNrm;
varying vec3 vClayWorldNrm;
`;

const FRAGMENT_BASE = /* glsl */ `
varying vec3 vClayPos;
varying vec3 vClayNrm;
varying vec3 vClayWorldNrm;

uniform float uClayScale;
uniform float uClayNoise;
uniform float uClayNormal;
uniform float uClayBounce;
uniform vec3 uClayBounceColor;
`;

const FRAGMENT_TRIPLANAR = /* glsl */ `
uniform sampler2D uClayMap;

// Sharp weights (pow 4) keep the three projections from cross-fading into a
// visible smear on the 45 degree facets of the stairs and the pyramid.
vec3 clayTriplanar( vec3 p, vec3 n ) {
  vec3 w = pow( abs( n ), vec3( 4.0 ) );
  w /= max( 1e-4, w.x + w.y + w.z );
  vec3 q = p * uClayScale;
  return texture2D( uClayMap, q.zy ).rgb * w.x
       + texture2D( uClayMap, q.xz ).rgb * w.y
       + texture2D( uClayMap, q.xy ).rgb * w.z;
}
`;

/**
 * Build one clay material.
 *
 * The uniforms are created once per material and handed to every compiled
 * program variant, so a later write to `material.userData.clayUniforms` would
 * reach the shader. Nothing animates them today, but keeping the handle costs
 * nothing and is the difference between tweakable and not.
 */
export const createClayMaterial = (
  THREE: Three,
  options: ClayOptions,
): ThreeNS.MeshPhysicalMaterial => {
  const {
    color,
    map = null,
    roughness = 0.5,
    noise = 0.13,
    normalStrength = 0.32,
    grainScale = 0.55,
    bounce = 0.34,
    bounceColor = "#e6d9d1",
    envIntensity = 0.32,
  } = options;

  const hasMap = map !== null;

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0,
    envMapIntensity: envIntensity,
    // A trace of sheen is what separates fired clay from matte paper. Any
    // clearcoat or specular above this starts reading as glossy plastic.
    sheen: 0.14,
    sheenRoughness: 0.9,
    sheenColor: new THREE.Color("#ffffff"),
    specularIntensity: 0.18,
    flatShading: false,
  });

  const uniforms = {
    uClayMap: { value: map },
    uClayScale: { value: grainScale },
    uClayNoise: { value: noise },
    uClayNormal: { value: normalStrength },
    uClayBounce: { value: bounce },
    uClayBounceColor: { value: new THREE.Color(bounceColor) },
  };
  material.userData.clayUniforms = uniforms;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${VERTEX_VARYINGS}`)
      .replace(
        "#include <begin_vertex>",
        /* glsl */ `
        #include <begin_vertex>
        // objectNormal is post-morph and pre-view-transform, which is exactly
        // the space the triplanar lookup wants.
        vClayPos = transformed;
        vClayNrm = normalize( objectNormal );
        vClayWorldNrm = normalize( mat3( modelMatrix ) * objectNormal );
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\n${FRAGMENT_BASE}${
          hasMap ? FRAGMENT_TRIPLANAR : ""
        }`,
      )
      // The grain is sampled here, in the albedo chunk, and reused by the
      // normal chunk below. Every chunk is inlined into one main(), so a local
      // declared in this one is still in scope there: three fetches, not six.
      //
      // The texture-dependent blocks are injected only in the textured
      // variant, rather than branched on a uniform, so the matte fallback
      // compiles with no sampler at all and cannot read an unbound one.
      .replace(
        "#include <map_fragment>",
        hasMap
          ? /* glsl */ `
        #include <map_fragment>
        vec3 clayGrain = clayTriplanar( vClayPos, vClayNrm );
        float clayLum = dot( clayGrain, vec3( 0.299, 0.587, 0.114 ) );
        diffuseColor.rgb *= 1.0 + ( clayLum - 0.5 ) * 2.0 * uClayNoise;
        `
          : "#include <map_fragment>",
      )
      .replace(
        "#include <normal_fragment_begin>",
        hasMap
          ? /* glsl */ `
        #include <normal_fragment_begin>
        {
          // Taper the perturbation off at grazing angles. Near the silhouette
          // a perturbed normal swings past the horizon and reads as hard
          // speckle rather than as surface, so it is faded out there.
          float clayFacing = abs( dot( normal, normalize( vViewPosition ) ) );
          // The gradient is object space and the normal is view space, which
          // is not strictly correct. It does not matter: this is low-amplitude
          // random signal, and projecting it out of the normal below keeps it
          // tangential either way.
          vec3 clayBump = clayGrain - 0.5;
          clayBump -= normal * dot( clayBump, normal );
          normal = normalize(
            normal + clayBump * uClayNormal * smoothstep( 0.0, 0.45, clayFacing )
          );
        }
        `
          : "#include <normal_fragment_begin>",
      )
      .replace(
        "#include <aomap_fragment>",
        /* glsl */ `
        #include <aomap_fragment>
        // Upward bounce: fold a little ground colour into the indirect term
        // for downward-facing normals. Without it the undersides of the arch
        // and the overhanging steps go to black, which no real clay does.
        float clayUp = clamp( -vClayWorldNrm.y, 0.0, 1.0 );
        reflectedLight.indirectDiffuse +=
          diffuseColor.rgb * uClayBounceColor * ( uClayBounce * clayUp * clayUp );
        `,
      );
  };

  // Textured and untextured compile to different programs. Without this three
  // would reuse one cached program across both and the fallback path would
  // sample a dead sampler.
  material.customProgramCacheKey = () => `clay-${hasMap ? 1 : 0}`;

  return material;
};
