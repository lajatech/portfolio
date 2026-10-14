import Link from "next/link";
import type { CSSProperties } from "react";
import { caseStudies, snapshotProjects, type CaseStudy } from "@/lib/data";

/**
 * /work: the index of everything.
 *
 * A server component. The only browser-side behaviour on this page is the
 * reveal class, which PageChrome's single observer adds to every `[data-rv]`
 * node, so nothing here has to be a client component.
 */

/* Row palette, in the same order as the homepage's case cards, so a visitor
   arriving from the horizontal track recognises each case by its colour.
   Picked for legibility rather than variety: cream on purple, ink on cream,
   white on blue, ink on coral (coral with white text fails contrast at this
   size, which is why it gets ink). */
const PALETTE: ReadonlyArray<{ c: string; t: string }> = [
  { c: "#8A2B90", t: "#F5EEE4" },
  { c: "#F5EEE4", t: "#101A5C" },
  { c: "#205CFA", t: "#F4F7FE" },
  { c: "#FC6A4B", t: "#101A5C" },
];

/* Hero shot per case, keyed by slug so a reorder in lib/data.ts cannot
   mislabel a row.

   These are device mockups with transparent backgrounds, which is why `shape`
   is "mockup" rather than "wide": a flat screenshot can be cropped to the row
   box, but cropping a device cuts the hardware in half. Mockups are contained
   and float on the row's colour instead, and the transparency is the point. */
const HERO: Record<string, { src: string; alt: string; shape: "wide" | "phone" | "mockup" }> = {
  neocash: {
    src: "/images/mockups/neocash.webp",
    alt: "The NeoCash app on a phone, showing loan balance and loan status",
    shape: "mockup",
  },
  estility: {
    src: "/images/mockups/estility.webp",
    alt: "The Estility website on a laptop",
    shape: "mockup",
  },
  profootball: {
    src: "/images/mockups/profootball.webp",
    alt: "The ProFootball platform on a tablet, showing the gamified feed",
    shape: "mockup",
  },
  workergen: {
    src: "/images/mockups/workergen.webp",
    alt: "The Workergen marketplace on a tablet",
    shape: "mockup",
  },
};

/**
 * The strongest of a case's own results.
 *
 * Ranked by the magnitude of the leading number rather than by a hand-picked
 * index, so a correction in lib/data.ts reaches this page on its own. The
 * figures themselves are never copied here: exactly one source of truth.
 */
const leadingNumber = (value: string): number => {
  const m = value.match(/-?\d+(?:\.\d+)?/);
  return m ? Math.abs(parseFloat(m[0])) : 0;
};

const strongest = (cs: CaseStudy): { value: string; label: string } | undefined =>
  cs.results.reduce<{ value: string; label: string } | undefined>(
    (best, r) => (!best || leadingNumber(r.value) > leadingNumber(best.value) ? r : best),
    undefined,
  );

/* Result labels are written for the case study page, where they get a full
   line. Under a large number they want the first clause only, so
   "time to first value, down from much higher" reads as "time to first value".
   The character class covers colon, comma and both long dashes, written as
   escapes so searching the copy for punctuation does not flag this. */
const shortLabel = (label: string): string =>
  label.split(/[:,\u2013\u2014]| - /)[0].trim();

export default function WorkView() {
  const deep = caseStudies.length;

  return (
    <>
      <section className="pg-sec pg-cream">
        <p className="kicker">
          <b>(01)</b> Index
        </p>
        <h1 className="big-title pg-h1">Work</h1>
        <p className="pg-lead">
          Six years of product design, measured. Every project below is here because
          a number moved, not because it photographed well.
        </p>
        <div className="pg-tally">
          <div>
            <b>80+</b>
            <span>Projects delivered</span>
          </div>
          <div>
            <b>{deep}</b>
            <span>Deep case studies</span>
          </div>
          <div>
            <b>{snapshotProjects.length}</b>
            <span>Selected snapshots</span>
          </div>
        </div>
      </section>

      <section className="pg-sec pg-bleed pg-ink" aria-label="Case studies">
        <div className="pg-rows">
          {caseStudies.map((cs, i) => {
            const pal = PALETTE[i % PALETTE.length];
            const hero = HERO[cs.slug];
            const metric = strongest(cs);
            return (
              <article
                key={cs.slug}
                className={i % 2 === 1 ? "pg-row pg-row-alt pg-rv" : "pg-row pg-rv"}
                data-rv=""
                style={{ ["--pg-c" as string]: pal.c, ["--pg-t" as string]: pal.t } as CSSProperties}
              >
                <div className="pg-row-media" data-shape={hero?.shape ?? "wide"}>
                  {hero ? (
                    // globals.css positions `.pg-row-media img` directly, which is
                    // what keeps the crop anchored to the top of the screenshot.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hero.src} alt={hero.alt} />
                  ) : null}
                </div>
                <div className="pg-row-body">
                  <p className="case-tag">
                    {cs.industry} · {cs.year}
                  </p>
                  <h2 className="pg-h3">{cs.title}</h2>
                  <p className="pg-body">{cs.problem}</p>
                  {metric ? (
                    <p className="case-metric">
                      {metric.value}
                      <small>{shortLabel(metric.label)}</small>
                    </p>
                  ) : null}
                  {/* The second excerpt. `problem` states the before, the
                      number states the shift, and the tagline states what the
                      product is now, so the three read as one argument rather
                      than three unrelated blocks. */}
                  <p className="pg-body pg-row-after">{cs.tagline}</p>
                  <Link className="pg-arrow" href={`/case-study/${cs.slug}`}>
                    <span>Read the case</span>
                    <i aria-hidden="true">→</i>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pg-sec pg-navy" aria-label="Selected snapshots">
        <p className="kicker">
          <b>(02)</b> Snapshots
        </p>
        <h2 className="big-title pg-h2">Shorter
          <br />
          stories
        </h2>
        <p className="pg-body pg-body-wide">
          Work that does not need a full case study to make its point. Brand systems,
          single products, platform builds.
        </p>
        <div className="pg-grid">
          {snapshotProjects.map((p) => (
            <article className="pg-card pg-rv" data-rv="" key={p.title}>
              <div className="pg-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={`${p.title}, ${p.category}`} />
              </div>
              <div className="pg-card-txt">
                <h3>{p.title}</h3>
                <p>
                  {p.category} · {p.year}
                </p>
                {p.note ? <p className="pg-card-note">{p.note}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pg-sec pg-yellow">
        <p className="kicker">
          <b>(03)</b> Next
        </p>
        <h2 className="big-title pg-h2">Got a number
          <br />
          that needs moving?
        </h2>
        <div className="pg-cta-row">
          <Link className="btn-n pg-btn" href="/#contact">
            <span>Start a project</span>
            <svg viewBox="0 0 35 23" fill="none" aria-hidden="true">
              <path d="M1 11.5h30M23 3l9 8.5-9 8.5" stroke="currentColor" strokeWidth="2.6" />
            </svg>
          </Link>
          <div className="ct-lines">
            <p>
              <small>Email</small>
              <a className="copy" href="mailto:abdulmuizadelaja@gmail.com">
                abdulmuizadelaja@gmail.com
              </a>
            </p>
            <p>
              <small>Based in</small>
              Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
