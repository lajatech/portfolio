"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useStage, useStageFrame } from "@/components/stage/ScrollStage";
import { caseStudies } from "@/lib/data";
import { clamp, easeInOutCubic, easeOutCubic, range, thru, win } from "@/lib/motion";
import CaseModal, { type WorkCase } from "./CaseModal";

/**
 * Chapter 04: the horizontal case track.
 *
 * The section is sticky, so its scroll height is what buys the horizontal
 * travel. That height cannot be written in CSS because it depends on
 * `track.scrollWidth`, which depends on the fonts, the viewport and the number
 * of cards. It is measured on mount, re-measured on `stage:remeasure`, and the
 * stage is told to re-read section boxes afterwards. Skip that last step and
 * `thru()` divides by a stale height and the track barely moves.
 */

/* Card palette. Picked by hand per card rather than cycled, because the only
   thing that matters is that the foreground is legible on the background:
   cream on purple, ink on cream, white on blue, ink on coral. Coral with white
   text is the brand's instinct and fails contrast at this size, so it gets ink. */
const PALETTE: { c: string; t: string }[] = [
  { c: "#8A2B90", t: "#F5EEE4" },
  { c: "#F5EEE4", t: "#101A5C" },
  { c: "#205CFA", t: "#F4F7FE" },
  { c: "#FC6A4B", t: "#101A5C" },
];

/* Where each title breaks, the hero shot, and the 2 letters the plate falls
   back to when there is no shot. Keyed by slug so a reorder in lib/data.ts
   cannot silently mislabel a card.

   The images are the real product work from public/images. The card crops hard
   (116% wide, 112% tall, object-fit cover) so each pick is a screen that still
   reads when the edges are gone: a full-bleed interface rather than a mockup
   with margins. */
const PRESENTATION: Record<
  string,
  { top: string; bottom: string; plate: string; image?: string }
> = {
  neocash: {
    top: "Neo",
    bottom: "Cash",
    plate: "NC",
    image: "/images/neocash/06-new-dashboard.png",
  },
  estility: {
    top: "Esti",
    bottom: "lity",
    plate: "ES",
    image: "/images/estility/web-01-hero.webp",
  },
  profootball: {
    top: "Pro",
    bottom: "Football",
    plate: "PF",
    image: "/images/profootball/01-desktop-home.png",
  },
  workergen: {
    top: "Worker",
    bottom: "gen",
    plate: "WG",
    image: "/images/workergen/01-home.png",
  },
};

/* Which of a case's own results to feature on the card, by index into its
   `results` array. Only the choice lives here: the number and its wording are
   always read from lib/data.ts, so there is exactly one source of truth for
   any figure shown on this site. Duplicating the values here would let a
   correction in the data silently fail to reach the card. */
const FEATURED_RESULT: Record<string, number> = {
  neocash: 0,
  estility: 0,
  profootball: 0,
  workergen: 0,
};

/* Card labels are tighter than the full result wording, which is written for
   the case study page. Keep the first clause and drop any trailing aside, so
   "time to first value, down from much higher" reads as "time to first value"
   on a card where it has to sit under a large number. */
const shortLabel = (label: string): string =>
  label.split(/[:,–—]| - /)[0].trim();

const CASES: WorkCase[] = caseStudies.map((cs, i) => {
  const pres = PRESENTATION[cs.slug] ?? { top: cs.title, bottom: "", plate: cs.slug.slice(0, 2) };
  const featured = cs.results[FEATURED_RESULT[cs.slug] ?? 0] ?? cs.results[0];
  const head = {
    metric: featured?.value ?? "",
    label: shortLabel(featured?.label ?? ""),
  };
  const pal = PALETTE[i % PALETTE.length];
  return {
    slug: cs.slug,
    tag: cs.industry,
    titleTop: pres.top,
    titleBottom: pres.bottom,
    plate: pres.plate,
    metric: head.metric,
    metricLabel: head.label,
    c: pal.c,
    t: pal.t,
    // the problem line is the sharper read of the two; tagline is the backstop
    body: cs.problem || cs.tagline,
    stats: cs.results.slice(0, 3),
    image: pres.image,
  };
});

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export default function Work() {
  const { remeasure } = useStage();
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  /** px of horizontal travel. 0 until measured, which is the safe default. */
  const overflowRef = useRef(0);
  /** .case border-radius in px, read from CSS so the clip wipe keeps the
   *  rounding instead of hard-coding the artboard-unit value. */
  const radiusRef = useRef(0);
  const lastCountRef = useRef(-1);

  /* Two pieces of state, not one: `open` is whether the overlay shows, `held`
     is which case it renders. They diverge after a close, so the panel still
     has content to animate out with instead of unmounting mid transition. */
  const [open, setOpen] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  const measure = useCallback(() => {
    const sec = secRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;
    const vh = document.documentElement.clientHeight || window.innerHeight;
    const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
    overflowRef.current = overflow;
    // one viewport to pin, `overflow` to travel, a third of a viewport of
    // run-out so the last card is readable before the section releases.
    sec.style.height = `${vh + overflow + 0.35 * vh}px`;
    const first = cardRefs.current[0];
    if (first) radiusRef.current = parseFloat(getComputedStyle(first).borderTopLeftRadius) || 0;
    remeasure();
  }, [remeasure]);

  useEffect(() => {
    measure();
    window.addEventListener("stage:remeasure", measure);
    // fonts shift the card widths, so the travel has to be re-read once they
    // resolve. The stage fires its own remeasure for the same reason.
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("stage:remeasure", measure);
  }, [measure]);

  useStageFrame((stage) => {
    const track = trackRef.current;
    if (!track) return;
    const p = thru(stage.sections, "work", stage.sy);
    const overflow = overflowRef.current;
    const reduced = stage.reducedMotion;

    // the travel is scroll-mapped navigation, not decoration, so it runs even
    // under reduced motion. Only the easing is dropped.
    const t = reduced ? range(0.04, 0.96, p) : easeInOutCubic(range(0.04, 0.96, p));
    track.style.transform = `translate3d(${-overflow * t}px, 0, 0)`;

    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

    if (titleRef.current) {
      const a = titleRef.current.children[0] as HTMLElement | undefined;
      const b = titleRef.current.children[1] as HTMLElement | undefined;
      if (reduced) {
        if (a) a.style.transform = "none";
        if (b) b.style.transform = "none";
      } else {
        // starts four fifths of a viewport before the section arrives, so the
        // two words have met by the time the track is pinned
        const w = easeOutCubic(win(stage.sections, "work", -0.8, 0, stage.sy));
        const push = (1 - w) * stage.viewportW * 0.5;
        if (a) a.style.transform = `translate3d(${-push}px,0,0)`;
        if (b) b.style.transform = `translate3d(${push}px,0,0)`;
      }
    }

    const vw = stage.viewportW || window.innerWidth;
    const r = radiusRef.current;
    let nearest = 0;
    let best = Infinity;

    for (let i = 0; i < cardRefs.current.length; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;
      // 4 rects per frame is cheaper than tracking the track transform and
      // each card's offset separately, and it stays correct through resizes.
      const rect = card.getBoundingClientRect();
      const centre = rect.left + rect.width / 2;
      const d = Math.abs(centre - vw / 2);
      if (d < best) {
        best = d;
        nearest = i;
      }

      const h3 = card.querySelector<HTMLElement>("h3");
      const inner = card.querySelector<HTMLElement>(".case-img img, .case-img .case-plate");

      if (reduced) {
        card.style.clipPath = "";
        if (h3) h3.style.transform = "none";
        if (inner) inner.style.transform = "none";
        continue;
      }

      // reveal as the card crosses from the right edge to just past mid screen
      const e = easeOutCubic(range(1, 0.55, rect.left / vw));
      card.style.clipPath = `inset(0% ${((1 - e) * 100).toFixed(2)}% 0% 0% round ${r}px)`;
      if (h3) h3.style.transform = `translate3d(${((1 - e) * 60).toFixed(1)}px,0,0)`;
      if (inner) {
        // parallax against the card's own distance from screen centre, so the
        // plate drifts opposite the travel rather than riding with it
        const off = clamp((centre - vw / 2) / vw, -1, 1) * -36;
        inner.style.transform = `translate3d(${off.toFixed(1)}px,0,0)`;
      }
    }

    if (nearest !== lastCountRef.current && countRef.current) {
      lastCountRef.current = nearest;
      countRef.current.textContent = pad2(nearest + 1);
    }
  });

  const openFrom = useCallback((e: React.MouseEvent<HTMLElement>, i: number) => {
    // a keyboard activation reports 0,0; fall back to the element centre so
    // the clip reveal still grows out of something meaningful
    if (e.clientX || e.clientY) {
      setOrigin({ x: e.clientX, y: e.clientY });
    } else {
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setHeld(i);
    setOpen(true);
  }, []);

  const next = useCallback(() => {
    setHeld((i) => ((i ?? 0) + 1) % CASES.length);
  }, []);

  return (
    <section className="ch work" id="work" data-ch="4" data-bg="cream" ref={secRef}>
      <div className="stick">
        <div className="wk-head">
          <p className="kicker">
            <b>(04)</b> Selected work
          </p>
          <h2 className="wk-title" ref={titleRef}>
            <span>SELECTED</span> <span>WORK</span>
          </h2>
          <p className="wk-count">
            <b ref={countRef}>01</b> / {pad2(CASES.length)}
          </p>
        </div>

        <div className="wk-track" ref={trackRef}>
          {CASES.map((cs, i) => (
            <article
              key={cs.slug}
              className="case"
              data-case={i}
              style={{ ["--c" as string]: cs.c, ["--t" as string]: cs.t } as CSSProperties}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={(e) => openFrom(e, i)}
            >
              <div className="case-info">
                <p className="case-tag">{cs.tag}</p>
                <h3>
                  {cs.titleTop}
                  <br />
                  {cs.titleBottom}
                </h3>
                <p className="case-metric">
                  {cs.metric}
                  <small>{cs.metricLabel}</small>
                </p>
                {/* the real control. The article's click handler is a
                    convenience for the pointer; this is what keyboard and
                    assistive tech reach. */}
                <button className="case-btn" data-open={i}>
                  <span>View case</span>
                  <i>→</i>
                </button>
              </div>
              <div className="case-img">
                {cs.image ? (
                  // globals.css positions `.case-img img` directly; next/image would
                  // wrap it in a span and the parallax target would move.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cs.image} alt="" />
                ) : (
                  <div className="case-plate">
                    <b>{cs.plate}</b>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="wk-progress">
          <i ref={barRef} />
        </div>
      </div>

      <CaseModal
        item={held === null ? null : CASES[held]}
        open={open}
        origin={origin}
        onClose={() => setOpen(false)}
        onNext={next}
      />
    </section>
  );
}
