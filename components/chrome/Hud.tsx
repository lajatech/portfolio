"use client";

import { useRef } from "react";
import { useStageFrame } from "@/components/stage/ScrollStage";
import { CHAPTERS, clamp } from "@/lib/motion";

/**
 * Persistent read-outs: the hero scroll hint, the chapter counter and the
 * document progress rail.
 *
 * All three are driven from the frame loop and written straight to the nodes.
 * The counter is the one piece with real state (which digit is showing, and
 * whether a roll is mid-flight), and that state lives in refs: a re-render
 * would restart the Web Animations timeline it is in the middle of.
 */

const TOTAL = CHAPTERS.length;
const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Swap the counter digit with a two-part roll: the old number leaves in the
 * travel direction, then the new one arrives from the opposite edge.
 *
 * `token` guards the gap between the two halves. Scrolling fast enough to cross
 * two chapters inside 260ms would otherwise leave two timelines fighting over
 * one node, and the digit would end up showing the older chapter.
 */
const roll = (
  el: HTMLElement,
  next: number,
  forward: boolean,
  reduced: boolean,
  token: number,
  live: () => number,
): void => {
  if (reduced) {
    // a number swapping in place is the honest reduced-motion equivalent
    el.textContent = pad(next);
    return;
  }

  const out = forward ? "-110%" : "110%";
  const inFrom = forward ? "110%" : "-110%";
  const timing: KeyframeAnimationOptions = {
    duration: 260,
    easing: "cubic-bezier(.7,0,.25,1)",
    fill: "forwards",
  };

  const leaving = el.animate(
    [{ transform: "translateY(0)" }, { transform: `translateY(${out})` }],
    timing,
  );

  leaving.finished
    .then(() => {
      if (token !== live()) return;
      el.textContent = pad(next);
      const arriving = el.animate(
        [{ transform: `translateY(${inFrom})` }, { transform: "translateY(0)" }],
        timing,
      );
      // fill:forwards animations are retained on the element, so without this
      // a long scrolling session accumulates one per chapter crossed. Resting
      // state matches the stylesheet, so cancelling is invisible.
      const drop = () => {
        leaving.cancel();
        arriving.cancel();
      };
      arriving.finished.then(drop).catch(drop);
    })
    .catch(() => {
      // cancelled by a newer roll, which now owns the digit
    });
};

export default function Hud() {
  const hudRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLElement | null>(null);
  const digitRef = useRef<HTMLElement | null>(null);

  const pastRef = useRef(false);
  const indexRef = useRef(1);
  // bumped on every roll so a stale `finished` continuation knows to bail out
  const rollRef = useRef(0);

  useStageFrame((stage) => {
    const hud = hudRef.current;
    if (!hud) return;

    const past = stage.y > stage.viewport * 0.3;
    if (past !== pastRef.current) {
      pastRef.current = past;
      hud.classList.toggle("past-hero", past);
    }

    const bar = barRef.current;
    if (bar) {
      const scrollable = Math.max(1, stage.docHeight - stage.viewport);
      bar.style.transform = `scaleY(${clamp(stage.y / scrollable).toFixed(4)})`;
    }

    const next = CHAPTERS.indexOf(stage.dominant) + 1;
    const digit = digitRef.current;
    if (next !== indexRef.current && digit) {
      // forward chapters push the old digit up and out, backward pushes it down
      const forward = next > indexRef.current;
      indexRef.current = next;
      const token = ++rollRef.current;
      const live = () => rollRef.current;
      roll(digit, next, forward, stage.reducedMotion, token, live);
    }
  });

  return (
    <div className="hud" aria-hidden="true" ref={hudRef}>
      <div className="hud-scroll">
        <i />
        <span>Scroll</span>
      </div>
      <div className="hud-count">
        <span className="hc-cur">
          <b ref={digitRef}>01</b>
        </span>{" "}
        / {pad(TOTAL)}
      </div>
      <div className="hud-bar">
        <i ref={barRef} />
      </div>
    </div>
  );
}
