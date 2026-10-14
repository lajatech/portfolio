"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Case detail overlay.
 *
 * The shape of the data is declared here rather than in lib/data.ts because
 * this is the only consumer: Work.tsx flattens a `CaseStudy` down to exactly
 * what the card and the overlay render, and nothing else needs to know that
 * "the plate letters" is a thing. `image` is optional and unset today (there
 * are no project screenshots in the repo yet), so both surfaces fall back to
 * the typographic plate. When real screenshots land, populating `image` is
 * the whole change.
 */
export type WorkCase = {
  slug: string;
  /** industry, rendered as the all-caps tag */
  tag: string;
  /** the h3 is split over two lines, so the break is data, not markup */
  titleTop: string;
  titleBottom: string;
  /** 2 or 3 characters for the fallback plate */
  plate: string;
  metric: string;
  metricLabel: string;
  /** card background */
  c: string;
  /** card foreground, chosen for contrast against `c` */
  t: string;
  body: string;
  stats: { value: string; label: string }[];
  image?: string;
};

type Props = {
  /** what to render. Work.tsx keeps the last opened case here after a close,
   *  so the panel has content to animate out with, and so the markup stays
   *  mounted (the closed panel is `visibility: hidden`, so that costs
   *  nothing). null only before the first open. */
  item: WorkCase | null;
  /** whether the panel is showing. Separate from `item` on purpose: see above. */
  open: boolean;
  /** viewport coordinates of the click that opened it */
  origin: { x: number; y: number } | null;
  onClose: () => void;
  onNext: () => void;
};

export default function CaseModal({ item, open, origin, onClose, onNext }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** whoever opened us, so focus can go back where it came from */
  const triggerRef = useRef<Element | null>(null);

  /* The open class is written to the root imperatively rather than rendered.
     It has to land a frame after the panel's content and origin vars commit,
     otherwise the browser reads `clip-path: circle(150%)` as .md-in's initial
     style and there is no reveal to transition at all. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (open) {
      triggerRef.current ??= document.activeElement;
      const raf = requestAnimationFrame(() => {
        const node = inRef.current;
        if (node) {
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduced) {
            node.style.transition = "none";
            node.style.setProperty("--ox", "50%");
            node.style.setProperty("--oy", "50%");
          } else {
            node.style.transition = "";
            const r = node.getBoundingClientRect();
            // the reveal reads as "it grew out of the thing I clicked", so the
            // circle origin is the click point expressed in the panel's own
            // percentage space. Unclamped on purpose: a click outside the
            // panel still gives a believable direction.
            const ox = r.width ? ((origin?.x ?? r.left + r.width / 2) - r.left) / r.width : 0.5;
            const oy = r.height ? ((origin?.y ?? r.top + r.height / 2) - r.top) / r.height : 0.5;
            node.style.setProperty("--ox", `${(ox * 100).toFixed(2)}%`);
            node.style.setProperty("--oy", `${(oy * 100).toFixed(2)}%`);
          }
        }
        root.classList.add("on");
        closeRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }

    root.classList.remove("on");
    const t = triggerRef.current;
    triggerRef.current = null;
    if (t instanceof HTMLElement) t.focus();
    return undefined;
  }, [open, origin]);

  // body scroll lock, released the instant the parent closes rather than when
  // the exit transition finishes: a locked page that looks unlocked is worse
  // than a half-animated panel.
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("lock");
    return () => document.body.classList.remove("lock");
  }, [open]);

  useEffect(
    () => () => {
      document.body.classList.remove("lock");
    },
    [],
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  return (
    <div
      className="modal"
      id="caseModal"
      ref={rootRef}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={item ? `${item.titleTop}${item.titleBottom} case study` : undefined}
    >
      <div className="md-bg" onClick={onClose} />
      {item ? (
        <div
          className="md-in"
          ref={inRef}
          style={{ ["--c" as string]: item.c, ["--t" as string]: item.t }}
        >
          <button className="md-x" aria-label="Close" ref={closeRef} onClick={onClose}>
            ×
          </button>
          <div className="md-img">
            {item.image ? (
              // `.md-img img` is styled as a direct child, so this stays a plain
              // img rather than next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" />
            ) : (
              <div className="case-plate">
                <b>{item.plate}</b>
              </div>
            )}
          </div>
          <div className="md-txt">
            <p className="case-tag md-tag">{item.tag}</p>
            <h3 className="md-title">
              {item.titleTop}
              {item.titleBottom}
            </h3>
            <p className="md-body">{item.body}</p>
            <div className="md-stats">
              {item.stats.map((s) => (
                <div key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <p className="md-body">
              <a className="copy" href={`/case-study/${item.slug}`}>
                Read the full case study
              </a>
            </p>
            {/* a button, not the <a> the spec sketched: it cycles the overlay
                in place and never navigates, so it must not look linkable to
                a screen reader or to a middle click. */}
            <button type="button" className="btn-y md-next" onClick={onNext}>
              <span>Next case</span>
              <svg viewBox="0 0 35 23" fill="none" aria-hidden="true">
                <path
                  d="M1 11.5h30M23 3l9 8.5-9 8.5"
                  stroke="currentColor"
                  strokeWidth="2.6"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
