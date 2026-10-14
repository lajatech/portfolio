"use client";

import { useEffect, useRef } from "react";
import { useStageFrame } from "@/components/stage/ScrollStage";
import { clamp, easeOutCubic, thru, win } from "@/lib/motion";

/**
 * Chapter 05: how he works.
 *
 * The section height is fixed in CSS (420vh), so unlike Work there is nothing
 * to measure here: `thru` already resolves to 0..1 across the pin, and the
 * only job is to cut that into one band per step.
 */

const STEPS = [
  {
    label: "Frame",
    title: "Frame the outcome",
    body:
      "Run the stakeholder sessions first, agree what the business is actually trying to move, then set a measurable KPI against every person on the team. Two directions go to the room, not one.",
  },
  {
    label: "Audit",
    title: "Audit the evidence",
    body:
      "Pull the existing flows apart and find where people genuinely leave. Interviews, usability runs, split tests on the landing pages. The data picks the problem, not taste.",
  },
  {
    label: "System",
    title: "System before screens",
    body:
      "Tokens, components, patterns, documentation. Build the design system first and the twentieth screen costs a fraction of the first. At Estility that cut project timelines by 17%.",
  },
  {
    label: "Measure",
    title: "Measure, then say so",
    body:
      "Ship it instrumented and read the numbers back: completion, churn, time to first value. A statistics degree is only useful if you are willing to publish the result either way.",
  },
] as const;

/** glyphs for the scan scramble. Narrow set, so the label does not reflow. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%/*";

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export default function Process() {
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scanRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(-1);
  /** rAF handle for the scramble, so a fast scroll cancels the old one */
  const scrambleRef = useRef(0);

  useEffect(
    () => () => {
      cancelAnimationFrame(scrambleRef.current);
    },
    [],
  );

  useStageFrame((stage) => {
    const p = thru(stage.sections, "process", stage.sy);

    // the title rises before the steps start, so it is settled when step 01
    // takes over the eye
    const w = win(stage.sections, "process", -0.6, 0.05, stage.sy);
    for (let i = 0; i < lineRefs.current.length; i++) {
      const el = lineRefs.current[i];
      if (!el) continue;
      if (stage.reducedMotion) {
        el.style.transform = "none";
        el.style.opacity = "1";
        continue;
      }
      // each line trails the one above by a tenth of the window. The rise is
      // half a line rather than a full one: .pr-title has no overflow clip, so
      // a full-line offset would stack the lines on top of each other on the
      // way in.
      const t = easeOutCubic(clamp((w - i * 0.1) / 0.7));
      el.style.transform = `translate3d(0,${((1 - t) * 55).toFixed(1)}%,0)`;
      el.style.opacity = t.toFixed(3);
    }

    // equal bands, with a sliver of lead-in and run-out so the first and last
    // steps are not active for a single frame each
    const bands = STEPS.length;
    const active = clamp(Math.floor(clamp((p - 0.04) / 0.9) * bands), 0, bands - 1);

    if (active === activeRef.current) return;
    const prev = activeRef.current;
    activeRef.current = active;

    for (let i = 0; i < stepRefs.current.length; i++) {
      const li = stepRefs.current[i];
      if (li) li.classList.toggle("on", i === active);
    }

    const li = stepRefs.current[active];
    const digit = li?.querySelector<HTMLElement>(".pr-n b");
    if (digit && !stage.reducedMotion && prev !== -1) {
      // .pr-n clips to one line height, so the digit rolls in from whichever
      // side the scroll came from
      const from = active > prev ? 100 : -100;
      digit.animate(
        [{ transform: `translateY(${from}%)` }, { transform: "translateY(0)" }],
        { duration: 420, easing: "cubic-bezier(0.2,0.8,0.2,1)" },
      );
    }

    const scan = scanRef.current;
    if (!scan) return;
    const target = STEPS[active].label.toUpperCase();
    cancelAnimationFrame(scrambleRef.current);
    if (stage.reducedMotion) {
      scan.textContent = target;
      return;
    }
    // settle one character per ~2 frames, randomising the rest. Cheap: one
    // string build per frame over a word, and it self-terminates.
    let settled = 0;
    let frame = 0;
    const tick = () => {
      frame++;
      if (frame % 2 === 0) settled++;
      let out = target.slice(0, settled);
      for (let i = settled; i < target.length; i++) {
        out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      scan.textContent = out;
      if (settled < target.length) scrambleRef.current = requestAnimationFrame(tick);
    };
    scrambleRef.current = requestAnimationFrame(tick);
  });

  return (
    <section className="ch process" id="process" data-ch="5" data-bg="navy">
      <div className="stick">
        <div className="pr-head">
          <p className="kicker">
            <b>(05)</b> How I work
          </p>
          <h2 className="pr-title">
            {["I design", "against a", "number."].map((line, i) => (
              <span
                className="pr-l"
                key={line}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
              >
                {line}
              </span>
            ))}
          </h2>
        </div>

        <ol className="pr-steps">
          {STEPS.map((s, i) => (
            <li
              key={s.label}
              data-step={i}
              className={i === 0 ? "on" : undefined}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
            >
              <span className="pr-n">
                <b>{pad2(i + 1)}</b>
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="pr-scan">
          <span ref={scanRef}>{STEPS[0].label.toUpperCase()}</span>
        </div>
      </div>
    </section>
  );
}
