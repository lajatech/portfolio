/**
 * The choreography, as data.
 *
 * Poses and camera rigs are plain records rather than code, for the same
 * reason lib/motion.ts keeps its progress functions pure: a pose can be
 * asserted, diffed and tweaked without a renderer. ClayScene.tsx owns the
 * blending, this file owns the targets, and nothing here imports three.
 *
 * Coordinate convention follows geometry.ts: the plinth's top is y = 0, so a
 * solid posed at y = 0 is standing on the plinth.
 */

import type { GeomKey } from "./geometry";

export type ObjId =
  | "plinth"
  | "arch"
  | "ball"
  | "half"
  | "stairs"
  | "quarter"
  | "cone"
  | "torus"
  | "dot"
  | "fCoral"
  | "fNavy"
  | "fWhite"
  | "fPyr";

export type Vec3 = readonly [number, number, number];

export type Pose = {
  /** position */
  p: Vec3;
  /** euler rotation, radians */
  r: Vec3;
  /** uniform scale */
  s: number;
};

/**
 * Which geometry and which euler order each object uses.
 *
 * The torus needs YZX: its rest rotation is a compound tilt, and in the
 * default XYZ order the same three numbers land it on a visibly different
 * axis. Everything else is a single-axis spin where the order cannot matter.
 */
export const OBJECTS: ReadonlyArray<{
  id: ObjId;
  geometry: GeomKey;
  order?: "YZX";
}> = [
  { id: "plinth", geometry: "plinth" },
  { id: "arch", geometry: "arch" },
  { id: "ball", geometry: "ball" },
  { id: "half", geometry: "half" },
  { id: "stairs", geometry: "stairs" },
  { id: "quarter", geometry: "quarter" },
  { id: "cone", geometry: "cone" },
  { id: "torus", geometry: "torus", order: "YZX" },
  { id: "dot", geometry: "sphere" },
  { id: "fCoral", geometry: "sphere" },
  { id: "fNavy", geometry: "sphere" },
  { id: "fWhite", geometry: "sphere" },
  { id: "fPyr", geometry: "pyramid" },
];

/* ─── rest ────────────────────────────────────────────────────────────── */

/**
 * The assembled sculpture, which is what the hero chapter shows.
 *
 * `ball` is the 0.54 sphere at scale 1, which is the same solid as the unit
 * sphere scaled to 0.54. It gets its own buffer rather than sharing the unit
 * sphere so the burst scales below multiply a sane base.
 */
export const REST: Record<ObjId, Pose> = {
  plinth: { p: [0, 0, 0], r: [0, 0, 0], s: 1 },
  arch: { p: [-0.708, 0, -0.934], r: [0, 0.581, 0], s: 1 },
  ball: { p: [-0.708, 3.627, -0.934], r: [0.2, 0.5, 0], s: 1 },
  half: { p: [0.503, 1.827, -1.5], r: [0, -0.92, 0], s: 1 },
  stairs: { p: [0.321, 0, -0.077], r: [0, -0.75, 0], s: 1 },
  quarter: { p: [-1.432, 0, -0.182], r: [0, 0.597, 0], s: 1 },
  cone: { p: [-0.3, 0, 1.304], r: [0, 0, 0], s: 1 },
  torus: { p: [1.786, 0.721, 0.897], r: [-1.053, -0.124, -0.803], s: 1 },
  dot: { p: [-1.243, 0.2, 2.063], r: [0, 0, 0], s: 0.19 },
  fCoral: { p: [-2.385, 2.05, 0.6], r: [0, 0, 0], s: 0.219 },
  fNavy: { p: [2.493, 3.025, -1.2], r: [0, 0, 0], s: 0.203 },
  fWhite: { p: [3.034, 1.064, 0.2], r: [0, 0, 0], s: 0.173 },
  fPyr: { p: [2.669, 1.814, -0.352], r: [-0.032, -0.201, -0.088], s: 0.428 },
};

/* ─── burst ───────────────────────────────────────────────────────────── */

/**
 * The sculpture taken apart and thrown wide, held while the manifesto is on
 * screen. The positions clear a column of readable text down the middle, which
 * is the only real constraint: the manifesto type sits on top of this.
 *
 * Scales run 0.8 to 1.9 so the pieces read at different depths without a
 * perspective change, and the rotations are arbitrary but fixed, since a
 * random layout that differs per reload is a layout nobody can art-direct.
 */
export const BURST: Record<ObjId, Pose> = {
  plinth: { p: [0, -9, -2], r: [0.12, 0.4, -0.08], s: 0.95 },
  arch: { p: [-6.4, 3.3, -1.5], r: [0.22, -0.95, 0.38], s: 1.15 },
  ball: { p: [6.3, 4.1, -0.5], r: [0.5, 0.9, 0.2], s: 1.6 },
  half: { p: [6.6, -1.9, -1.8], r: [-0.4, 1.25, 0.62], s: 1.05 },
  stairs: { p: [-7.6, -2.7, -1.2], r: [0.3, 0.85, -0.45], s: 1.1 },
  quarter: { p: [-3.6, -4.3, 0.5], r: [-0.55, -0.6, 0.9], s: 0.95 },
  cone: { p: [3.9, -4.1, 1.5], r: [0.75, 0.2, -1.1], s: 1.35 },
  torus: { p: [1.9, 5.8, -1.4], r: [-0.85, 0.55, 0.4], s: 1.25 },
  dot: { p: [-2.4, 5.6, 0.5], r: [0, 0.5, 0], s: 1.9 },
  fCoral: { p: [-8.8, 0.8, -3], r: [0.2, 0.3, 0.1], s: 1.75 },
  fNavy: { p: [9.4, 1.6, -4], r: [0.1, -0.4, 0.25], s: 1.8 },
  fWhite: { p: [0.2, -5.3, 1.8], r: [-0.2, 0.15, 0.5], s: 1.45 },
  fPyr: { p: [-5.3, 6.4, -2.5], r: [0.42, -0.8, 0.95], s: 0.8 },
};

/* ─── gone ────────────────────────────────────────────────────────────── */

/** How far down the sculpture drops to clear the page. */
export const GONE_DROP = 14;

/**
 * Rest, pushed below the frame. Derived rather than written out: the exit has
 * to land on exactly the rest pose offset, or the return from it would snap.
 */
export const GONE: Record<ObjId, Pose> = Object.fromEntries(
  (Object.keys(REST) as ObjId[]).map((id) => {
    const rest = REST[id];
    return [
      id,
      {
        p: [rest.p[0], rest.p[1] - GONE_DROP, rest.p[2]] as Vec3,
        r: rest.r,
        s: rest.s,
      },
    ];
  }),
) as Record<ObjId, Pose>;

/* ─── camera ──────────────────────────────────────────────────────────── */

export type CameraRig = {
  /** look-at target */
  t: Vec3;
  /** distance from target */
  d: number;
  /** radians around Y, 0 looks down -Z */
  az: number;
  /** radians above the horizon */
  el: number;
  fov: number;
  /**
   * Where the look-at target should land on screen, as artboard fractions
   * across and down.
   *
   * Without this the sculpture sits dead centre and fights the headline for
   * the same pixels. The source frames it off to one side by projecting the
   * target and then shifting the frustum with setViewOffset, which moves the
   * composition without moving the camera or changing the perspective.
   * 0.5 / 0.5 means centred.
   */
  sx: number;
  sy: number;
  /**
   * Where the target sits on a portrait viewport, as plain screen fractions.
   *
   * Portrait cannot reuse the landscape fractions. A phone stacks the type
   * vertically, so the sculpture has to find a band of its own between the
   * headline and the copy rather than sitting off to one side. One blanket
   * value does not work either: the hero needs it high to clear the copy and
   * the button, while the manifesto wants it centred behind the text.
   */
  psx: number;
  psy: number;
};

export type RigId = "hero" | "burst" | "services" | "process" | "contact";

export const RIGS: Record<RigId, CameraRig> = {
  // hero sits right of centre and low, leaving the top-left clear for the
  // headline, which is the whole reason the chapter reads at all
  // The phone hero stacks headline, then a gap, then copy and button. psy
  // aims the sculpture at that gap: lower and it sits on the copy, higher and
  // it sits inside the headline.
  hero: { t: [0, 0, 0], d: 17.755, az: 0, el: 0.2028, fov: 24, sx: 0.7031, sy: 0.6806, psx: 0.5, psy: 0.63 },
  burst: { t: [0, 0, 0], d: 21, az: 0, el: 0.02, fov: 26, sx: 0.5, sy: 0.5, psx: 0.5, psy: 0.5 },
  // the capability cards fill the lower two thirds of a phone screen
  services: { t: [0, 0, 0], d: 22, az: 0, el: 0, fov: 26, sx: 0.5, sy: 0.5, psx: 0.5, psy: 0.34 },
  // the process steps occupy the bottom half, the title the top
  process: { t: [0.15, 1.3, 0], d: 18.5, az: 0, el: 0.22, fov: 24, sx: 0.69, sy: 0.55, psx: 0.5, psy: 0.34 },
  contact: { t: [0.15, 1.35, 0], d: 21.5, az: 0, el: 0.2, fov: 24, sx: 0.795, sy: 0.39, psx: 0.5, psy: 0.3 },
};

/**
 * Artboard fractions to screen fractions.
 *
 * The rig fractions are expressed against the 2048x1152 artboard, which is
 * letterboxed inside the real viewport. Mapping them through the same scale
 * the CSS unit uses keeps the sculpture in register with the type at any
 * aspect ratio, instead of drifting across the layout as the window changes.
 */
export const framing = (
  rig: CameraRig,
  width: number,
  height: number,
  portrait: boolean,
): { sx: number; sy: number } => {
  if (portrait) return { sx: rig.psx, sy: rig.psy };
  const u = Math.min(width / 2048, height / 1152);
  return {
    sx: 1 - (2048 * (1 - rig.sx) * u) / width,
    sy: ((height - 1152 * u) / 2 + 1152 * rig.sy * u) / height,
  };
};

/**
 * Portrait correction.
 *
 * Every distance above was framed against the landscape artboard. On a tall
 * viewport the horizontal field is what runs out first, so widening the fov
 * and pushing the camera back is the only way to keep the whole sculpture in
 * frame. It is a compromise either way: the sculpture reads smaller on a
 * phone, which is better than reading cropped.
 */
export const PORTRAIT_FOV = 30;
export const PORTRAIT_DISTANCE = 1.7;

export const forPortrait = (rig: CameraRig): CameraRig => ({
  ...rig,
  d: rig.d * PORTRAIT_DISTANCE,
  fov: PORTRAIT_FOV,
});
