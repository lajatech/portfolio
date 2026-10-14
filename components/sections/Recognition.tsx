"use client";

import { useRef } from "react";
import { useStageFrame } from "@/components/stage/ScrollStage";
import { clients } from "@/lib/data";
import { clamp, easeOutCubic, easeOutExpo, hash, range } from "@/lib/motion";

/**
 * Chapter 06: clients, numbers, recognition.
 *
 * The section carries both `recognition` (the id lib/motion.ts CHAPTERS looks
 * for, and the chapter class) and `clients` (the class globals.css actually
 * styles: background, padding, overflow clip). Dropping `clients` loses the
 * layout; renaming the id breaks the stage's section map.
 */

/** Row 1: what he does. Shapes are separators, not decoration for its own sake. */
const CAPABILITIES = [
  "Product design",
  "UX research",
  "Design systems",
  "Conversion",
  "Design leadership",
] as const;

const SHAPES = ["sh-c", "sh-t", "sh-h", "sh-s"] as const;

/** Row 2, outlined. His voice, not a studio's. */
const CREED = "Design that moves the number";

/* Recognition and milestones. One formal award, the rest are milestones that
   are true per the brief and labelled as such rather than dressed up as
   awards he has not won. */
const AWARDS = [
  {
    year: "2025",
    title: "Outstanding Performance Award",
    context: "Estility Ltd, May 2025",
  },
  {
    year: "2025",
    title: "+150% over target",
    context: "Volta Charger Kickstarter campaign",
  },
  {
    year: "2024",
    title: "10+ products in 12 months",
    context: "Design lead, Estility ecosystem",
  },
  {
    year: "2024",
    title: "5.1% to 18% retention",
    context: "Quiver Finance, inside 8 weeks",
  },
  {
    year: "Ongoing",
    title: "Mentoring on ADPList",
    context: "Product design and UX, by request",
  },
] as const;

const STATS = [
  { count: 80, suffix: "+", label: "projects delivered" },
  { count: 98, suffix: "%", label: "client satisfaction" },
  { count: 6, suffix: "+", label: "years designing" },
] as const;

const COUNT_MS = 1500;

export default function Recognition() {
  const secRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRefs = useRef<(HTMLElement | null)[]>([]);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const awardRefs = useRef<(HTMLLIElement | null)[]>([]);

  /** marquee offset in px, integrated per frame rather than derived from
   *  scroll, because it has to keep drifting when the page is still. */
  const offsetRef = useRef(0);
  /** which stat counters have already run. WeakSet, so a removed node does not
   *  pin itself in memory just to record that it finished. */
  const countedRef = useRef<WeakSet<Element>>(new WeakSet());
  /** stage.time at which each counter started */
  const startedRef = useRef<Map<number, number>>(new Map());

  useStageFrame((stage) => {
    const sec = secRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const vh = stage.viewport || window.innerHeight;
    const onScreen = rect.bottom > -200 && rect.top < vh + 200;

    /* ── marquee ─────────────────────────────────────────────────────── */
    if (onScreen) {
      // base drift plus a scroll-coupled term: the rows accelerate with the
      // page and lean into the direction of travel
      const speed = 34 + Math.abs(stage.vy) * 0.34;
      offsetRef.current += (stage.reducedMotion ? 0 : speed) * stage.dt;
      const skew = stage.reducedMotion ? 0 : clamp(stage.vy / 2600, -1, 1) * -7;

      for (let r = 0; r < rowRefs.current.length; r++) {
        const row = rowRefs.current[r];
        if (!row) continue;
        const dir = Number(row.dataset.dir ?? 1);
        const first = row.firstElementChild as HTMLElement | null;
        if (!first) continue;
        const w = first.offsetWidth;
        if (!w) continue;
        // modulo the width of one copy, so the second copy is always covering
        // the gap the first one leaves behind
        const x = dir > 0 ? -(offsetRef.current % w) : (offsetRef.current % w) - w;
        for (let i = 0; i < row.children.length; i++) {
          const copy = row.children[i] as HTMLElement;
          copy.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(skew * dir).toFixed(2)}deg)`;
        }
      }
    }

    /* ── stat counters ───────────────────────────────────────────────── */
    for (let i = 0; i < statRefs.current.length; i++) {
      const el = statRefs.current[i];
      if (!el) continue;
      const done = startedRef.current.get(i);
      if (done === undefined) {
        if (countedRef.current.has(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.top > vh * 0.88 || r.bottom < 0) continue;
        countedRef.current.add(el);
        startedRef.current.set(i, stage.time);
        continue;
      }
      const t = clamp((stage.time - done) / (COUNT_MS / 1000));
      const target = STATS[i].count;
      el.textContent = `${Math.round(easeOutExpo(stage.reducedMotion ? 1 : t) * target)}`;
      if (t >= 1) startedRef.current.delete(i);
    }

    if (!onScreen) return;

    /* ── client cells ────────────────────────────────────────────────── */
    for (let i = 0; i < cellRefs.current.length; i++) {
      const cell = cellRefs.current[i];
      if (!cell) continue;
      if (stage.reducedMotion) {
        cell.style.transform = "none";
        cell.style.opacity = "1";
        continue;
      }
      const r = cell.getBoundingClientRect();
      // stagger the start of the window, not the progress: subtracting from a
      // clamped 0..1 would leave the later cells permanently short of 1
      const t = easeOutCubic(range(0.95 + hash(i * 7) * 0.1, 0.62, r.top / vh));
      cell.style.transform = `translate3d(0,${((1 - t) * 40).toFixed(1)}px,0) scale(${(0.92 + t * 0.08).toFixed(3)})`;
      cell.style.opacity = t.toFixed(3);
    }

    /* ── award rules ─────────────────────────────────────────────────── */
    for (let i = 0; i < awardRefs.current.length; i++) {
      const li = awardRefs.current[i];
      if (!li) continue;
      if (stage.reducedMotion) {
        li.style.setProperty("--ln", "1");
        continue;
      }
      const r = li.getBoundingClientRect();
      li.style.setProperty("--ln", easeOutCubic(range(0.95, 0.68, r.top / vh)).toFixed(3));
    }
  });

  /* Two copies per row. The loop translates both by the same amount and wraps
     on one copy's width, which is the cheapest seamless marquee that does not
     need a measured keyframe. */
  const capabilityRow = (
    <>
      {CAPABILITIES.map((word, i) => (
        <span key={word}>
          {word}
          <i className={`sh ${SHAPES[i % SHAPES.length]}`} />
        </span>
      ))}
    </>
  );
  const creedRow = (
    <>
      {[0, 1, 2].map((i) => (
        <span key={i}>
          {CREED}
          <i className="sh sh-c" />
        </span>
      ))}
    </>
  );

  return (
    <section
      className="ch recognition"
      id="recognition"
      data-ch="6"
      data-bg="blue"
      ref={secRef}
    >
      <div className="marquee" aria-hidden="true">
        <div
          className="mq-row"
          data-dir="1"
          ref={(el) => {
            rowRefs.current[0] = el;
          }}
        >
          <div className="mq-in">{capabilityRow}</div>
          <div className="mq-in">{capabilityRow}</div>
        </div>
        <div
          className="mq-row out"
          data-dir="-1"
          ref={(el) => {
            rowRefs.current[1] = el;
          }}
        >
          <div className="mq-in">{creedRow}</div>
          <div className="mq-in">{creedRow}</div>
        </div>
      </div>

      <div className="cl-wrap">
        <div className="cl-intro">
          <p className="kicker">
            <b>(06)</b> Clients
          </p>
          <h2 className="big-title">TRUSTED BY</h2>
          <p className="cl-copy">
            Fintech, proptech, sports and AI, across Lagos, the US and Australia. Teams
            keep me on because the work ships and the numbers move afterwards.
          </p>
          <div className="stats">
            {STATS.map((s, i) => (
              <div key={s.label}>
                <b
                  data-count={s.count}
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                >
                  0
                </b>
                <span>{s.suffix}</span>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cl-grid">
          {clients.map((cl, i) => (
            <div
              className="cl-cell"
              tabIndex={0}
              key={cl.name}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
            >
              {/* The real mark where there is one, initials where there is not.
                  The logos are white-on-transparent SVGs built for a dark
                  ground, which is what this chapter is. */}
              {cl.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cl-logo" src={cl.logo} alt="" aria-hidden="true" />
              ) : (
                <b>{cl.abbr}</b>
              )}
              <span>{cl.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="awards">
        <p className="kicker">
          <b>(06.1)</b> Recognition and milestones
        </p>
        <ul className="aw-list">
          {AWARDS.map((a, i) => (
            <li
              key={a.title}
              ref={(el) => {
                awardRefs.current[i] = el;
              }}
            >
              <span className="aw-y">{a.year}</span>
              <span className="aw-n">{a.title}</span>
              <span className="aw-p">{a.context}</span>
              <i className={`aw-sh ${SHAPES[i % SHAPES.length]}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
