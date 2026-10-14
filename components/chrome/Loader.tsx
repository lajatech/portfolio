"use client";

import { useEffect, useRef } from "react";
import { easeOutCubic } from "@/lib/motion";

/**
 * Intro curtain: a counter to 100, then five colour shutters wiping up.
 *
 * Two rules shape this component. First, it must never be the reason the site
 * is unreachable, so every path (throw, cancelled animation, missing Web
 * Animations) still ends at `#loader.done`, which is `display:none`. Second,
 * sections downstream wait on the `stage:intro-done` event, so that event fires
 * when the shutters *start* rather than when they finish: the entrance happens
 * behind the curtain and is already in motion as it lifts.
 */

const COUNT_MS = 1500;
const COUNT_MS_REDUCED = 300;
const SHUTTER_MS = 1300;
const SHUTTER_STAGGER = 70;
export const INTRO_DONE = "stage:intro-done";

export default function Loader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // `html.noload` is the screenshot and test escape hatch: no intro at all
    if (document.documentElement.classList.contains("noload")) {
      root.classList.add("go", "done");
      window.dispatchEvent(new Event(INTRO_DONE));
      return;
    }

    // read the preference directly rather than from the stage: child effects
    // run before the provider's, so stage.reducedMotion is not populated yet
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let raf = 0;
    let settled = false;
    const timers: number[] = [];

    const finish = () => {
      if (settled) return;
      settled = true;
      root.classList.add("done");
    };

    const wipe = () => {
      root.classList.add("go");
      window.dispatchEvent(new Event(INTRO_DONE));

      // belt and braces: if the animations never report finishing (cancelled by
      // a backgrounded tab, unsupported API) the curtain still comes down
      timers.push(
        window.setTimeout(
          finish,
          SHUTTER_MS + SHUTTER_STAGGER * 5 + 120,
        ),
      );

      const panels = Array.from(
        root.querySelectorAll<HTMLElement>(".ld-shutters i"),
      );
      if (!panels.length || typeof panels[0].animate !== "function") {
        finish();
        return;
      }

      let pending = panels.length;
      panels.forEach((panel, i) => {
        const anim = panel.animate(
          [
            { transform: "translateY(100%)", offset: 0 },
            { transform: "translateY(0)", offset: 0.42 },
            { transform: "translateY(0)", offset: 0.56 },
            { transform: "translateY(-101%)", offset: 1 },
          ],
          {
            duration: SHUTTER_MS,
            delay: i * SHUTTER_STAGGER,
            easing: "cubic-bezier(.7,0,.25,1)",
            fill: "forwards",
          },
        );
        const settle = () => {
          if (--pending === 0) finish();
        };
        anim.finished.then(settle).catch(settle);
      });
    };

    const total = reduced ? COUNT_MS_REDUCED : COUNT_MS;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const n = Math.round(easeOutCubic(t) * 100);
      if (numRef.current) numRef.current.textContent = String(n);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // one frame of 100% before the wipe, so the number is actually read
      timers.push(window.setTimeout(wipe, reduced ? 0 : 120));
    };

    try {
      raf = requestAnimationFrame(tick);
    } catch {
      finish();
    }

    return () => {
      cancelAnimationFrame(raf);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  return (
    <div id="loader" aria-hidden="true" ref={rootRef}>
      <div className="ld-shapes">
        <i className="ld-c" />
        <i className="ld-h" />
        <i className="ld-t" />
        <i className="ld-s" />
      </div>
      <div className="ld-count">
        <span ref={numRef}>0</span>
        <small>%</small>
      </div>
      <div className="ld-word">Designing for outcomes</div>
      <div className="ld-shutters">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
