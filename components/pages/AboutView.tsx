import Link from "next/link";
import { careerTimeline, metrics } from "@/lib/data";

/**
 * /about.
 *
 * Server component. The prose is carried over from the previous about page,
 * which was written in his own voice and did not need rewriting; what changed
 * is that it now sits on the same colour blocks as the homepage instead of in
 * a dark editorial column.
 *
 * One person, not a studio: first person throughout, never "we".
 */

/* The three positions from the previous page, unchanged. They are the actual
   argument of the page, so they get a column each rather than a stacked list. */
const POSITIONS: ReadonlyArray<{ heading: string; body: string }> = [
  {
    heading: "Design is a hypothesis",
    body:
      "Every design decision is a bet. I trace where that bet is, what it is predicting, and how we will know if it lands. A/B testing, conversion tracking, retention curves. The design process and the measurement process are the same process.",
  },
  {
    heading: "The brief is a floor, not a ceiling",
    body:
      "Clients come with a brief. I arrive with questions. What does success look like as a number? Who is actually using this, and what do they already believe? What would a skeptic say? The answers reshape the work before a pixel is placed.",
  },
  {
    heading: "Systems before screens",
    body:
      "A beautiful screen in a broken system is decoration. I start with the design system: tokens, components, patterns, because that is what makes everything after it scalable, consistent and maintainable at pace.",
  },
];

/* The nine capabilities from the previous page, grouped rather than listed.
   A flat list of nine reads as a tag cloud; three groups of three state what
   kind of designer this is. */
const CAPABILITIES: ReadonlyArray<{ group: string; items: readonly string[] }> = [
  {
    group: "Product",
    items: [
      "Product design, end to end",
      "UX research and usability testing",
      "Conversational UX",
    ],
  },
  {
    group: "Systems",
    items: [
      "Design systems from scratch",
      "Figma, Framer, Webflow",
      "AI-assisted design workflow (Cursor, Claude Code)",
    ],
  },
  {
    group: "Outcomes",
    items: [
      "A/B testing and conversion optimisation",
      "Stakeholder facilitation",
      "Design team leadership",
    ],
  },
];

const CREDENTIALS: ReadonlyArray<{ label: string; title: string; body: string }> = [
  {
    label: "Education",
    title: "BTech, Statistics",
    body: "Federal University of Technology Akure, 2021.",
  },
  {
    label: "Recognition",
    title: "Outstanding Performance Award",
    body: "Estility Ltd, May 2025.",
  },
  {
    label: "Mentoring",
    title: "ADPList",
    body: "Mentoring emerging designers across Africa and beyond.",
  },
];

/* .aw-sh takes one of four shape classes. Cycled rather than assigned, since
   the shapes are rhythm, not meaning. */
const SHAPES = ["sh-c", "sh-t", "sh-h", "sh-s"] as const;

export default function AboutView() {
  return (
    <>
      <section className="pg-sec pg-cream">
        <div className="pg-hero-grid">
          <div>
            <p className="kicker">
              <b>About</b> Làjà
            </p>
            <h1 className="big-title pg-h1">
              Abdulmuiz
              <br />
              Adelaja
            </h1>
            <p className="pg-lead">
              Senior Product Designer and UX Lead, Lagos, Nigeria. I trace every design
              decision to a business outcome: conversion, retention, revenue. Not as a
              methodology. As a reflex.
            </p>
          </div>
          <figure className="pg-photo">
            <div className="pg-photo-box">
              {/* globals.css positions `.pg-photo-box img` directly, so the box
                  owns the 3:4 crop and the portrait cannot reflow the hero
                  grid when it loads. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/abdulmuiz.jpg"
                alt="Abdulmuiz Adelaja"
                fetchPriority="high"
              />
            </div>
            <figcaption>Lagos, Nigeria</figcaption>
          </figure>
        </div>
      </section>

      <section className="pg-sec pg-ink">
        <p className="kicker">
          <b>(01)</b> The angle
        </p>
        <h2 className="big-title pg-h2">
          Statistics
          <br />
          first
        </h2>
        <p className="pg-body pg-body-wide">
          This started with a Statistics degree from FUTA in 2021. The numbers habit
          never left. It just moved from regression tables to design systems and KPI
          dashboards. Six years and 80+ projects later, the approach is the same: form a
          hypothesis, design the intervention, measure what moves.
        </p>
        <div className="pg-story">
          {POSITIONS.map((p) => (
            <div className="pg-rv" data-rv="" key={p.heading}>
              <h3>{p.heading}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full-bleed portrait, as a colour block rather than an avatar. The
          second shot is used here so the hero portrait is not repeated. */}
      <section className="pg-plate pg-coral" aria-label="Portrait">
        <div className="pg-plate-txt">
          <p className="kicker">
            <b>(02)</b> In practice
          </p>
          <h2 className="big-title pg-h2">Lagos
            <br />
            to the world
          </h2>
          <p className="pg-body">
            Six years across fintech, proptech, sports and AI. Nigerian products, and
            products shipped from Lagos for teams in the United States and Australia.
            The constraint is always the same: build the thing that moves the number,
            then prove it moved.
          </p>
        </div>
        <div className="pg-plate-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/abdulmuiz-alt.jpg" alt="" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="pg-sec pg-blue">
        <p className="kicker">
          <b>(03)</b> Career
        </p>
        <h2 className="big-title pg-h2">Where
          <br />
          I have been
        </h2>
        {/* .aw-list is the recognition chapter's row list: label, name, detail,
            shape, with the yellow hover bleed. A career timeline is the same
            shape of information, so it reuses it rather than restating it. */}
        <ol className="aw-list pg-time">
          {careerTimeline.map((job, i) => (
            <li className="pg-rv" data-rv="" key={`${job.company}-${job.period}`}>
              <span className="aw-y">{job.period}</span>
              <span className="aw-n">
                {job.company}
                {job.current ? <b className="pg-now">Now</b> : null}
              </span>
              <span className="aw-p">
                {job.role}
                <span>{job.location}</span>
              </span>
              <i className={`aw-sh ${SHAPES[i % SHAPES.length]}`} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className="pg-sec pg-navy">
        <p className="kicker">
          <b>(04)</b> Numbers
        </p>
        <h2 className="big-title pg-h2">What
          <br />
          it added up to
        </h2>
        <div className="pg-nums">
          {metrics.map((m) => (
            <div className="pg-num pg-rv" data-rv="" key={`${m.context}-${m.label}`}>
              <b>{m.value}</b>
              <span>{m.label}</span>
              <small>{m.context}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="pg-sec pg-cream">
        <p className="kicker">
          <b>(05)</b> Capabilities
        </p>
        <h2 className="big-title pg-h2">What
          <br />
          I am for
        </h2>
        <div className="pg-caps">
          {CAPABILITIES.map((c, i) => (
            <div className="pg-cap pg-rv" data-rv="" key={c.group}>
              <b aria-hidden="true">{`0${i + 1}`}</b>
              <h3>{c.group}</h3>
              <ul>
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pg-story">
          {CREDENTIALS.map((c) => (
            <div className="pg-rv" data-rv="" key={c.label}>
              <p className="pg-meta">{c.label}</p>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pg-sec pg-yellow">
        <p className="kicker">
          <b>(06)</b> Contact
        </p>
        <h2 className="big-title pg-h2">Currently
          <br />
          open
        </h2>
        <p className="pg-body">
          Select projects, fractional engagement and design advisory. I take on a small
          number at a time. If the brief has a number attached to it, I am interested.
        </p>
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
              <small>Elsewhere</small>
              <span>
                <a
                  className="copy"
                  href="https://linkedin.com/in/abdulmuiz-adelaja"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                ,{" "}
                <a className="copy" href="https://x.com/lajanumba" target="_blank" rel="noreferrer">
                  X
                </a>
                ,{" "}
                <a
                  className="copy"
                  href="https://behance.net/adelajaabdulmu"
                  target="_blank"
                  rel="noreferrer"
                >
                  Behance
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
