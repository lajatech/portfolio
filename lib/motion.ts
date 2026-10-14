/**
 * Scroll-progress math and easings.
 *
 * Every scroll-driven effect on the site resolves to a number between 0 and 1,
 * and all of those numbers come from the three functions at the bottom of this
 * file: `thru`, `entry` and `win`. Keeping them pure and separate from the
 * render loop is what makes the choreography testable: a section's behaviour
 * can be asserted at a given scroll offset without a browser.
 *
 * Nothing here touches the DOM. The rAF loop in useScrollStage measures
 * sections and feeds the results in.
 */

export type SectionBox = {
  /** document-space offset of the section top */
  top: number;
  /** full scrollable height of the section */
  height: number;
  /** viewport height at the time of measurement */
  viewport: number;
};

export type SectionMap = Record<string, SectionBox>;

/* ─── primitives ──────────────────────────────────────────────────────── */

export const clamp = (v: number, lo = 0, hi = 1): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Normalize `v` into 0..1 across the range [a, b], clamped. */
export const range = (a: number, b: number, v: number): number =>
  clamp((v - a) / (b - a || 1));

/**
 * Frame-rate independent approach toward a target.
 *
 * A naive `current += (target - current) * 0.1` is tied to frame rate: the same
 * code settles at a different speed on a 120Hz display than on a 60Hz one.
 * The exponential form takes dt, so the motion is identical everywhere.
 */
export const approach = (
  current: number,
  target: number,
  rate: number,
  dt: number,
): number => lerp(current, target, 1 - Math.exp(-rate * dt));

/* ─── easings ─────────────────────────────────────────────────────────── */

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

/** Overshoots past 1 then settles. Used for shapes popping into place. */
export const easeOutBack = (t: number): number =>
  1 + 2.9 * Math.pow(t - 1, 3) + 1.9 * Math.pow(t - 1, 2);

export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeOutBounce = (t: number): number => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};

/**
 * Deterministic pseudo-random in 0..1 from an integer seed.
 *
 * Used to give each shape its own stagger and drift. It must be deterministic
 * so the layout is identical on every load and on the server: Math.random()
 * here would make the choreography jitter between reloads.
 */
export const hash = (n: number): number => {
  const t = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return t - Math.floor(t);
};

/* ─── section progress ────────────────────────────────────────────────── */

/**
 * Progress through a sticky section, 0 at the moment it pins and 1 when it
 * releases. This is the main driver for anything that animates "while pinned".
 */
export const thru = (
  sections: SectionMap,
  id: string,
  scrollY: number,
): number => {
  const s = sections[id];
  if (!s) return 0;
  return clamp((scrollY - s.top) / Math.max(1, s.height - s.viewport));
};

/**
 * Progress of a section entering the viewport: 0 when its top is one viewport
 * below the fold, 1 when its top reaches the top of the viewport.
 */
export const entry = (
  sections: SectionMap,
  id: string,
  scrollY: number,
): number => {
  const s = sections[id];
  if (!s) return 0;
  return clamp((scrollY - (s.top - s.viewport)) / s.viewport);
};

/**
 * Progress across an arbitrary window around a section, measured in viewport
 * heights relative to the section top. `win(sections, "work", -0.9, 0.05, y)`
 * runs 0 to 1 from "nine tenths of a viewport before the section arrives" to
 * "a twentieth of a viewport after it arrives".
 *
 * This is the workhorse for cross-section choreography, where an effect has to
 * begin before its section is on screen.
 */
export const win = (
  sections: SectionMap,
  id: string,
  from: number,
  to: number,
  scrollY: number,
): number => {
  const s = sections[id];
  if (!s) return 0;
  const span = (to - from) * s.viewport;
  return clamp((scrollY - (s.top + from * s.viewport)) / (span || 1));
};

/* ─── chapters ────────────────────────────────────────────────────────── */

export const CHAPTERS = [
  "hero",
  "manifesto",
  "capabilities",
  "work",
  "process",
  "recognition",
  "contact",
] as const;

export type ChapterId = (typeof CHAPTERS)[number];

/** Background theme per chapter. Drives `body[data-theme]`. */
export const CHAPTER_THEME: Record<ChapterId, string> = {
  hero: "blue",
  manifesto: "blue",
  capabilities: "coral",
  work: "cream",
  process: "navy",
  recognition: "blue",
  contact: "yellow",
};

/** Themes whose background is light, so the nav and HUD must go dark. */
const LIGHT_THEMES = new Set(["cream", "yellow"]);

export const navForeground = (theme: string): string =>
  LIGHT_THEMES.has(theme) ? "#101A5C" : "#fff";

/**
 * Which chapter is current, and which one the viewport is mostly showing.
 *
 * Two answers rather than one because they serve different jobs: the theme
 * should flip as soon as a section's top passes the nav, while the chapter
 * counter should only advance once the section genuinely dominates the screen.
 */
export const activeChapters = (
  sections: SectionMap,
  scrollY: number,
  viewport: number,
): { current: ChapterId; dominant: ChapterId } => {
  let current: ChapterId = "hero";
  let dominant: ChapterId = "hero";
  for (const id of CHAPTERS) {
    const s = sections[id];
    if (!s) continue;
    if (scrollY + 40 >= s.top) current = id;
    if (scrollY + viewport * 0.5 >= s.top) dominant = id;
  }
  return { current, dominant };
};
