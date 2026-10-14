/**
 * Procedural geometry for the clay sculptures.
 *
 * Everything is built from three's own primitives and extruded profiles rather
 * than loaded as a mesh. Two reasons: a glTF of thirteen simple solids is
 * heavier over the wire than the code that generates them, and the dimensions
 * stay readable and adjustable here instead of being baked into a binary.
 *
 * One convention runs through the whole file: the plinth's TOP sits at y = 0
 * and its body hangs down to -H. Every other solid is built with its base on
 * y = 0, so the rest poses in poses.ts can place things at y = 0 and have them
 * stand on the plinth rather than sink into it.
 *
 * Segment counts are deliberately modest. This renders on phones, and the
 * silhouettes here are large and smooth: doubling the tessellation costs real
 * frames and buys almost nothing visible.
 *
 * Note on normals: three's builders already emit the normals these shapes
 * want. Calling computeVertexNormals() on an ExtrudeGeometry or a
 * LatheGeometry would average across the bevel seams and the base rim, turning
 * the hard edges that read as "cast clay" into soft smears. So it is not
 * applied; bounding volumes are recomputed instead, which is what actually
 * goes stale after the translate() calls below.
 */

import type * as ThreeNS from "three";
import type { Three } from "./assets";

export type GeomKey =
  | "plinth"
  | "arch"
  | "ball"
  | "half"
  | "stairs"
  | "quarter"
  | "cone"
  | "torus"
  | "sphere"
  | "pyramid";

export type Geometries = Record<GeomKey, ThreeNS.BufferGeometry>;

/* ─── helpers ─────────────────────────────────────────────────────────── */

const EXTRUDE_BEVEL = {
  bevelEnabled: true,
  bevelThickness: 0.022,
  bevelSize: 0.022,
  bevelOffset: 0,
  bevelSegments: 2,
};

/**
 * Concatenate non-indexed geometries into one buffer.
 *
 * Hand-rolled rather than imported from three's BufferGeometryUtils, because
 * that module pulls a large grab-bag of unrelated helpers into the chunk for
 * the sake of one merge of one shape. ExtrudeGeometry is already non-indexed
 * and always carries position/normal/uv, so the merge is a plain array copy
 * and the original normals survive it untouched.
 */
const mergeExtruded = (
  THREE: Three,
  parts: ThreeNS.BufferGeometry[],
): ThreeNS.BufferGeometry => {
  const flat = parts.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = flat.reduce(
    (n, g) => n + (g.getAttribute("position") as ThreeNS.BufferAttribute).count,
    0,
  );
  const position = new Float32Array(total * 3);
  const normal = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);

  let offset = 0;
  for (const g of flat) {
    const p = g.getAttribute("position") as ThreeNS.BufferAttribute;
    const n = g.getAttribute("normal") as ThreeNS.BufferAttribute;
    const u = g.getAttribute("uv") as ThreeNS.BufferAttribute;
    position.set(p.array, offset * 3);
    normal.set(n.array, offset * 3);
    uv.set(u.array, offset * 2);
    offset += p.count;
  }
  // The sources are scratch, including any toNonIndexed() copies we just made.
  for (const g of parts) g.dispose();
  for (const g of flat) g.dispose();

  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(position, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return out;
};

/* ─── builders ────────────────────────────────────────────────────────── */

/** R 2.975, H 0.638, with a small fillet on the top edge. Top at y = 0. */
const buildPlinth = (THREE: Three): ThreeNS.BufferGeometry => {
  const R = 2.975;
  const H = 0.638;
  const fillet = 0.09;
  const pts: ThreeNS.Vector2[] = [];
  // Profile runs axis-bottom, out, up, around the fillet, back to axis-top, so
  // the lathe closes into a solid instead of an open tube.
  pts.push(new THREE.Vector2(0, -H));
  pts.push(new THREE.Vector2(R, -H));
  pts.push(new THREE.Vector2(R, -fillet));
  for (let i = 1; i <= 5; i++) {
    const a = (i / 5) * (Math.PI / 2);
    pts.push(
      new THREE.Vector2(
        R - fillet + Math.cos(a) * fillet,
        -fillet + Math.sin(a) * fillet,
      ),
    );
  }
  pts.push(new THREE.Vector2(0, 0));
  return new THREE.LatheGeometry(pts, 64);
};

/** Outer R 1.22, inner r 0.535, legs L 1.887, depth D 0.95. Base at y = 0. */
const buildArch = (THREE: Three): ThreeNS.BufferGeometry => {
  const R = 1.22;
  const r = 0.535;
  const L = 1.887;
  const D = 0.95;
  const shape = new THREE.Shape();
  shape.moveTo(-R, 0);
  shape.lineTo(-R, L);
  shape.absarc(0, L, R, Math.PI, 0, true);
  shape.lineTo(R, 0);
  shape.lineTo(r, 0);
  shape.lineTo(r, L);
  shape.absarc(0, L, r, 0, Math.PI, false);
  shape.lineTo(-r, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: D,
    curveSegments: 20,
    steps: 1,
    ...EXTRUDE_BEVEL,
  });
  // Extrude grows along +Z from the shape plane; recentre so rotations about
  // the pose's Y axis spin the arch on its own centre, not around its face.
  geo.translate(0, 0, -D / 2);
  return geo;
};

/** R 1.827, depth 0.36. Flat edge on y = 0, dome up. */
const buildHalf = (THREE: Three): ThreeNS.BufferGeometry => {
  const R = 1.827;
  const D = 0.36;
  const shape = new THREE.Shape();
  shape.moveTo(-R, 0);
  shape.absarc(0, 0, R, Math.PI, 0, true);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: D,
    curveSegments: 28,
    steps: 1,
    ...EXTRUDE_BEVEL,
  });
  geo.translate(0, 0, -D / 2);
  return geo;
};

/**
 * Four steps, depth D 1, plus a 1.25 deep slab off the first step.
 *
 * The side extension is a second extrusion at a different depth, which is why
 * this is the one shape that needs a merge: one ExtrudeGeometry cannot carry
 * two depths. It is flushed against the main block's +Z face, so the sculpture
 * reads as an L in plan rather than a symmetric wedding cake.
 */
const buildStairs = (THREE: Three): ThreeNS.BufferGeometry => {
  const D = 1;
  const ext = 1.25;
  const heights = [0.63, 0.437, 0.377, 0.416];
  const runs = [0.35, 0.28, 0.344, 0.476];
  const totalRun = runs.reduce((a, b) => a + b, 0);

  const profile = new THREE.Shape();
  profile.moveTo(0, 0);
  let x = 0;
  let y = 0;
  for (let i = 0; i < heights.length; i++) {
    y += heights[i];
    profile.lineTo(x, y);
    x += runs[i];
    profile.lineTo(x, y);
  }
  profile.lineTo(totalRun, 0);
  profile.closePath();

  const body = new THREE.ExtrudeGeometry(profile, {
    depth: D,
    curveSegments: 2,
    steps: 1,
    ...EXTRUDE_BEVEL,
  });
  body.translate(0, 0, -D / 2);

  const slab = new THREE.Shape();
  slab.moveTo(0, 0);
  slab.lineTo(runs[0], 0);
  slab.lineTo(runs[0], heights[0]);
  slab.lineTo(0, heights[0]);
  slab.closePath();
  const wing = new THREE.ExtrudeGeometry(slab, {
    depth: ext,
    curveSegments: 2,
    steps: 1,
    ...EXTRUDE_BEVEL,
  });
  wing.translate(0, 0, D / 2);

  const geo = mergeExtruded(THREE, [body, wing]);
  // Centre on the run so the pose offsets read as nudges off centre, and keep
  // the base on y = 0 like every other solid.
  geo.translate(-totalRun / 2, 0, 0);
  return geo;
};

/** Superellipse quarter, R 1.0697, Ry 1.26, depth 1.1425, exponent n 2. */
const buildQuarter = (THREE: Three): ThreeNS.BufferGeometry => {
  const R = 1.0697;
  const Ry = 1.26;
  const D = 1.1425;
  const n = 2;
  const steps = 24;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(R, 0);
  // |x/R|^n + |y/Ry|^n = 1, walked as the angle sweep so the point spacing
  // stays even for any exponent, not just the n = 2 ellipse case.
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2);
    shape.lineTo(
      R * Math.pow(Math.cos(t), 2 / n),
      Ry * Math.pow(Math.sin(t), 2 / n),
    );
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: D,
    curveSegments: 2,
    steps: 1,
    ...EXTRUDE_BEVEL,
  });
  geo.translate(0, 0, -D / 2);
  return geo;
};

/** r 0.43, h 0.913, tip rounded with a tangent fillet. Base at y = 0. */
const buildCone = (THREE: Three): ThreeNS.BufferGeometry => {
  const r = 0.43;
  const h = 0.913;
  const tip = 0.07;
  const alpha = Math.atan2(r, h); // half angle off the axis
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  // A sphere of radius `tip` tangent to both slant sides sits this far from
  // the apex along the axis. Rounding the tip this way keeps the cone's slope
  // exact: a ConeGeometry with a chamfer would not.
  const d = tip / sin;
  const cy = h - d;
  const tx = d * cos * sin;
  const ty = h - d * cos * cos;

  const pts: ThreeNS.Vector2[] = [];
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(r, 0));
  pts.push(new THREE.Vector2(tx, ty));
  const a0 = Math.atan2(ty - cy, tx);
  for (let i = 1; i <= 5; i++) {
    const a = a0 + (i / 5) * (Math.PI / 2 - a0);
    pts.push(new THREE.Vector2(Math.cos(a) * tip, cy + Math.sin(a) * tip));
  }
  pts.push(new THREE.Vector2(0, cy + tip));
  return new THREE.LatheGeometry(pts, 40);
};

/* ─── entry point ─────────────────────────────────────────────────────── */

export const buildGeometries = (THREE: Three): Geometries => {
  const geometries: Geometries = {
    plinth: buildPlinth(THREE),
    arch: buildArch(THREE),
    ball: new THREE.SphereGeometry(0.54, 28, 18),
    half: buildHalf(THREE),
    stairs: buildStairs(THREE),
    quarter: buildQuarter(THREE),
    cone: buildCone(THREE),
    torus: new THREE.TorusGeometry(0.575, 0.222, 14, 36),
    // Unit sphere, shared by the dot and the three floating spheres at
    // different scales. One buffer for four meshes.
    sphere: new THREE.SphereGeometry(1, 24, 16),
    pyramid: new THREE.ConeGeometry(1, 1.32, 3),
  };
  // ConeGeometry is built about its centre; every other solid stands on y = 0.
  geometries.pyramid.translate(0, 1.32 / 2, 0);

  // translate() invalidates the bounds three uses for frustum culling and for
  // sizing the shadow camera, so recompute them once here rather than paying
  // for it lazily on the first render.
  for (const geo of Object.values(geometries)) {
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
  }
  return geometries;
};

export const disposeGeometries = (geometries: Geometries): void => {
  for (const geo of Object.values(geometries)) geo.dispose();
};
