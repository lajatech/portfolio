"use client";

import { useEffect, useRef } from "react";
import { useStage, useStageFrame } from "@/components/stage/ScrollStage";
import { clamp, easeOutQuart, win } from "@/lib/motion";
import { splitChars } from "@/lib/splitText";

/**
 * Chapter 01.
 *
 * Three jobs, all driven off the one stage loop: a staggered character
 * entrance, a pointer proximity spring, and an exit that hands the screen to
 * the manifesto. None of them hold React state, because all three write a value
 * per character per frame and a re-render at that rate would eat the budget.
 *
 * The resting HTML is fully visible. The entrance styles are set in an effect,
 * so with JS off (or before the loop starts) the headline is simply there.
 */

const LINES = ["DESIGN", "WITH", "EVIDENCE"] as const;
/** the same words as plain text, for anyone reading this with a screen reader */
const HEADLINE = "Design with evidence";

/** seconds of delay added per character index */
const CHAR_STAGGER = 0.026;
/** seconds a single character takes to land */
const CHAR_DUR = 0.72;
/** failsafe: start the entrance even if the loader never says it is done */
const INTRO_FALLBACK_MS = 1200;

type CharState = {
  el: HTMLSpanElement;
  /** index in document order, which is also the stagger order */
  i: number;
  /** client-space x of the character centre, from the last measure */
  cx: number;
  /** document-space y of the character centre, from the last measure */
  cy: number;
  /** spring position, 0 at rest and 1 when fully pushed */
  x: number;
  /** spring velocity */
  v: number;
};

/**
 * Cache every character's centre.
 *
 * x stays in client space (the page never scrolls sideways) while y is stored
 * in document space, so the frame callback can convert with the scroll position
 * it already holds. Reading all the rects in one pass keeps the forced layout
 * to a single flush.
 */
const measureChars = (chars: CharState[]): void => {
  const scrolled = window.scrollY;
  for (const c of chars) {
    const r = c.el.getBoundingClientRect();
    c.cx = r.left + r.width / 2;
    c.cy = r.top + scrolled + r.height / 2;
  }
};

/**
 * Advance one character's push spring by `dt`.
 *
 * Semi-implicit Euler, so the feel is identical at 60Hz and 120Hz. stage.dt is
 * clamped to 50ms upstream, which keeps this inside its stability window even
 * after a long frame. Tiny residuals are snapped to zero so the loop can
 * recognise a settled hero and stop writing to it.
 */
const stepSpring = (c: CharState, target: number, dt: number): boolean => {
  c.v += (target - c.x) * 120 * dt - c.v * 14 * dt;
  c.x += c.v * dt;
  if (Math.abs(c.x) < 4e-4 && Math.abs(c.v) < 4e-4) {
    c.x = 0;
    c.v = 0;
    return false;
  }
  return true;
};

/**
 * Write one character's frame.
 *
 * `o` is the entrance progress (0 hidden, 1 landed) and `push` the spring
 * position. Both fold into one transform string: the character is the only
 * thing that owns its transform, so there is nothing to compose with.
 */
const paintChar = (c: CharState, o: number, push: number): void => {
  c.el.style.opacity = `${o}`;
  c.el.style.transform =
    `translateY(${((1 - o) * 45).toFixed(2)}%) ` +
    `rotateX(${((1 - o) * 60).toFixed(2)}deg) ` +
    `scale(${(1 + push * 0.14).toFixed(4)}) ` +
    `skewX(${(push * -5).toFixed(3)}deg)`;
};

export default function Hero() {
  const { scrollTo } = useStage();

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const charsRef = useRef<CharState[]>([]);
  /** seconds since the entrance began. Negative means it has not begun. */
  const elapsedRef = useRef(-1);
  /** set once the entrance has landed and the springs have settled */
  const idleRef = useRef(false);
  /** the post-entrance remeasure, done once the glyphs are at their real size */
  const settledRef = useRef(false);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const chars: CharState[] = [];
    for (const word of Array.from(title.querySelectorAll<HTMLElement>(".w"))) {
      for (const el of splitChars(word)) {
        chars.push({ el, i: chars.length, cx: 0, cy: 0, x: 0, v: 0 });
      }
    }
    charsRef.current = chars;

    const measure = () => measureChars(chars);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      // resting state is the finished state: no entrance, no pointer push
      for (const c of chars) {
        c.el.style.opacity = "1";
        c.el.style.transform = "none";
      }
      measure();
      return;
    }

    for (const c of chars) {
      c.el.style.opacity = "0";
      c.el.style.transform = "translateY(45%) rotateX(60deg)";
    }
    measure();

    const start = () => {
      if (elapsedRef.current < 0) elapsedRef.current = 0;
    };

    // the Loader announces itself with `stage:intro-done`. If it already fired,
    // or there is no loader in the tree at all, there is nothing to wait for.
    const loader = document.getElementById("loader");
    if (!loader || loader.classList.contains("done")) start();

    const fallback = window.setTimeout(start, INTRO_FALLBACK_MS);
    window.addEventListener("stage:intro-done", start);
    window.addEventListener("stage:remeasure", measure);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("stage:intro-done", start);
      window.removeEventListener("stage:remeasure", measure);
    };
  }, []);

  useStageFrame((stage) => {
    const chars = charsRef.current;
    if (chars.length === 0 || stage.reducedMotion) return;

    // exit first: once the manifesto is close the hero is leaving regardless of
    // what the entrance or the pointer wanted
    const ex = win(stage.sections, "manifesto", -1, -0.15, stage.sy);
    const out = `0 ${(-ex * 14).toFixed(2)}vh`;
    const fade = `${1 - ex}`;
    for (const el of [titleRef.current, copyRef.current, btnRef.current]) {
      if (!el) continue;
      el.style.opacity = fade;
      // `translate` rather than `transform`: .hero-title already carries a
      // scaleX in CSS and overwriting transform would flatten it
      el.style.translate = out;
    }

    // per-character work is the expensive part, so it stops entirely once the
    // hero is well off screen
    if (stage.y >= stage.viewport * 1.6) return;

    const pointerOn = stage.pointer.active;
    if (idleRef.current && !pointerOn) return;

    if (elapsedRef.current >= 0) elapsedRef.current += stage.dt;
    const e = elapsedRef.current;
    const total = chars.length * CHAR_STAGGER + CHAR_DUR;
    const landed = e >= total;

    if (landed && !settledRef.current) {
      // the entrance measured the characters mid-transform, so the proximity
      // centres were a few pixels out. Re-read them now they are at rest.
      settledRef.current = true;
      measureChars(chars);
    }

    const px = stage.pointer.x;
    const py = stage.pointer.y + stage.y;
    // radius of the gaussian, in px. Tied to viewport width so the effect
    // covers a comparable share of the headline at any size.
    const radius = Math.max(90, stage.viewportW * 0.085);
    const inv = 1 / (radius * radius);

    let moving = false;

    for (const c of chars) {
      const t = e < 0 ? 0 : clamp((e - c.i * CHAR_STAGGER) / CHAR_DUR);
      const o = easeOutQuart(t);

      let target = 0;
      if (pointerOn) {
        const dx = px - c.cx;
        const dy = py - c.cy;
        target = Math.exp(-(dx * dx + dy * dy) * inv);
      }

      if (stepSpring(c, target, stage.dt)) moving = true;

      paintChar(c, o, c.x);
    }

    idleRef.current = landed && !moving;
  });

  return (
    <section className="ch hero" id="hero" data-ch="1" data-bg="blue">
      <div className="hero-in">
        <p className="eyebrow">Senior Product Designer, Lagos</p>
        <h1 className="hero-title" ref={titleRef} aria-label={HEADLINE}>
          {LINES.map((line) => (
            <span className="ln" key={line}>
              <span className="w">{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-copy" ref={copyRef}>
          <span className="l">
            A statistics degree, six years in product, 80+ projects shipped.
          </span>
          <span className="l">
            Every decision tied to a number: +1050% completion, 640% AOV, -50%
            churn.
          </span>
        </p>
        <button
          className="btn-y"
          id="reelBtn"
          type="button"
          ref={btnRef}
          onClick={() => scrollTo("work")}
        >
          <span>See the work</span>
          <svg viewBox="0 0 37 24" aria-hidden="true">
            <path
              d="M1 12h33M24 2l10 10-10 10"
              stroke="currentColor"
              strokeWidth={2.6}
              fill="none"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
