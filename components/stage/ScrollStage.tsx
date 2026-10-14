"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  CHAPTERS,
  CHAPTER_THEME,
  activeChapters,
  approach,
  navForeground,
  type ChapterId,
  type SectionMap,
} from "@/lib/motion";

/**
 * One scroll loop for the whole page.
 *
 * Why a single imperative loop instead of React state: these effects update
 * dozens of elements every frame. Driving that through `useState` would queue a
 * re-render per frame and lose the frame budget to reconciliation. Instead the
 * loop owns a mutable `Stage` object, sections register a per-frame callback,
 * and each one writes directly to its own DOM nodes.
 *
 * React still owns the markup. It just does not own the animation.
 */

export type Stage = {
  /** raw scrollY */
  y: number;
  /** smoothed scrollY, what choreography should read */
  sy: number;
  /** scroll velocity in px/s, smoothed */
  vy: number;
  viewport: number;
  viewportW: number;
  docHeight: number;
  /** seconds since page start */
  time: number;
  /** seconds since previous frame, clamped */
  dt: number;
  frame: number;
  sections: SectionMap;
  pointer: {
    x: number;
    y: number;
    /** -1..1 normalized */
    nx: number;
    ny: number;
    /** smoothed normalized */
    sx: number;
    sy: number;
    /** false on touch devices and before first move */
    active: boolean;
  };
  reducedMotion: boolean;
  isPortrait: boolean;
  current: ChapterId;
  dominant: ChapterId;
};

type FrameFn = (stage: Stage) => void;

type StageApi = {
  /**
   * The live stage, as a getter rather than a value.
   *
   * The stage is a mutable model the loop writes to sixty times a second, so
   * it cannot be React state (immutable) and must not be read during render
   * (refs). A getter satisfies both: callers reach it from effects, handlers
   * and frame callbacks, which is the only place the value is meaningful.
   */
  getStage: () => Stage;
  onFrame: (fn: FrameFn) => () => void;
  remeasure: () => void;
  scrollTo: (id: ChapterId | "top") => void;
};

const StageContext = createContext<StageApi | null>(null);

export const useStage = (): StageApi => {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside <ScrollStage>");
  return ctx;
};

/**
 * Register a per-frame callback for the life of the component.
 *
 * The callback is held in a ref and refreshed in an effect rather than during
 * render, so the subscription itself never churns: sections pass inline
 * closures that change identity every render, and resubscribing each time
 * would thrash the subscriber set sixty times a second.
 */
export const useStageFrame = (fn: FrameFn): void => {
  const { onFrame } = useStage();
  const ref = useRef<FrameFn>(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  useEffect(() => onFrame((s) => ref.current(s)), [onFrame]);
};

const makeStage = (): Stage => ({
  y: 0,
  sy: 0,
  vy: 0,
  viewport: 0,
  viewportW: 0,
  docHeight: 0,
  time: 0,
  dt: 1 / 60,
  frame: 0,
  sections: {},
  pointer: { x: 0, y: 0, nx: 0, ny: 0, sx: 0, sy: 0, active: false },
  reducedMotion: false,
  isPortrait: false,
  current: "hero",
  dominant: "hero",
});

export default function ScrollStage({ children }: { children: ReactNode }) {
  /**
   * Both of these are mutable models the frame loop writes to in place, and
   * React is never told they changed, because telling it would mean a
   * re-render per frame. That rules out state. They are therefore refs, and
   * nothing below reads `.current` during render: every access happens inside
   * a closure that runs later, from an effect, a handler or the loop.
   */
  const stageRef = useRef<Stage>(makeStage());
  const subsRef = useRef<Set<FrameFn>>(new Set());

  const api = useMemo<StageApi>(() => {
    const measure = () => {
      const stage = stageRef.current;
      const viewport =
        document.documentElement.clientHeight || window.innerHeight;
      stage.viewport = viewport;
      stage.viewportW = window.innerWidth;
      stage.isPortrait = window.innerWidth / Math.max(1, viewport) < 1;
      const scrolled = window.scrollY;
      const next: SectionMap = {};
      for (const id of CHAPTERS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        next[id] = {
          top: rect.top + scrolled,
          height: rect.height,
          viewport,
        };
      }
      stage.sections = next;
      stage.docHeight = document.documentElement.scrollHeight;
    };

    return {
      getStage: () => stageRef.current,
      onFrame: (fn: FrameFn) => {
        subsRef.current.add(fn);
        return () => {
          subsRef.current.delete(fn);
        };
      },
      remeasure: measure,
      scrollTo: (id) => {
        const stage = stageRef.current;
        if (id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const s = stage.sections[id];
        if (!s) return;
        // the pinned sections want a small lead-in so the first frame of their
        // choreography is not skipped by landing exactly on the pin point
        const lead =
          id === "work" ? 0.02 : id === "process" ? 0.05 : 0;
        window.scrollTo({
          top: s.top + lead * s.viewport,
          behavior: stage.reducedMotion ? "auto" : "smooth",
        });
      },
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    stage.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    api.remeasure();
    stage.y = stage.sy = window.scrollY;

    let raf = 0;
    let last = performance.now();
    let resizeTimer: number | undefined;

    const onPointerMove = (e: PointerEvent) => {
      const p = stage.pointer;
      p.x = e.clientX;
      p.y = e.clientY;
      p.active = finePointer && e.pointerType === "mouse";
      p.nx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ny = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      const p = stage.pointer;
      p.active = false;
      p.nx = p.ny = 0;
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        api.remeasure();
        window.dispatchEvent(new Event("stage:remeasure"));
      }, 80);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      stage.dt = dt;
      stage.time += dt;
      stage.frame++;

      const y = window.scrollY;
      stage.vy = approach(stage.vy, (y - stage.y) / dt, 10, dt);
      stage.y = y;
      // smoothed scroll, except under reduced motion where lag reads as lag
      stage.sy = stage.reducedMotion ? y : approach(stage.sy, y, 8, dt);
      if (Math.abs(stage.sy - y) < 0.05) stage.sy = y;

      const p = stage.pointer;
      p.sx = approach(p.sx, p.nx, 4, dt);
      p.sy = approach(p.sy, p.ny, 4, dt);

      const { current, dominant } = activeChapters(
        stage.sections,
        y,
        stage.viewport,
      );
      if (current !== stage.current) {
        stage.current = current;
        const theme = CHAPTER_THEME[current];
        document.body.dataset.theme = theme;
        document.documentElement.style.setProperty(
          "--nav-fg",
          navForeground(theme),
        );
      }
      stage.dominant = dominant;

      for (const fn of subsRef.current) {
        try {
          fn(stage);
        } catch (err) {
          // one broken section must not stop the page animating
          if (process.env.NODE_ENV !== "production") console.error(err);
          subsRef.current.delete(fn);
        }
      }
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    // fonts change metrics, so section heights must be re-read once they land
    document.fonts?.ready.then(() => api.remeasure());

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [api]);

  return <StageContext.Provider value={api}>{children}</StageContext.Provider>;
}
