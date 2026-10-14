import Link from "next/link";
import type { CSSProperties } from "react";
import type { CaseStudy } from "@/lib/data";

/**
 * /case-study/[slug]: the narrative read.
 *
 * Server component. Order is the argument: facts, the problem on its own
 * colour block, the process as numbered steps, the screens, then the numbers.
 * The numbers land last because they only mean something once the reader knows
 * what was changed to produce them.
 */

type Shot = {
  src: string;
  alt: string;
  caption: string;
  /** second caption line, the "why this screen" note */
  sub?: string;
  /** full-width, rather than one of a pair */
  wide?: boolean;
  /** 9:19 export, rendered in the sideways-scrolling phone strip */
  phone?: boolean;
  /** CSS aspect-ratio for the box, so nothing reflows when the file lands */
  ar: string;
};

/* The same files, in the same order, as the previous gallery. Paths are kept
   byte-for-byte (including the percent-encoded spaces in the Figma exports,
   which are real filenames on disk) so nothing 404s. The alt text is rewritten
   here only to drop its punctuation dashes. */
const SHOTS: Record<string, Shot[]> = {
  neocash: [
    {
      src: "/images/neocash/03-new-splash.png",
      alt: "NeoCash onboarding screen, segmented for salary earners",
      caption: "Onboarding",
      sub: "One screen, one idea. Built for salary earners, business owners, contractors.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/04-new-pre-loan.png",
      alt: "NeoCash pre-loan context screen",
      caption: "Pre-application",
      sub: "Context before commitment. Users see exactly what they are walking into.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/05-new-loan-flow.png",
      alt: "NeoCash conversational loan application flow",
      caption: "Conversational flow",
      sub: "One question at a time, warm tone. Not a form, a conversation.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/06-new-dashboard.png",
      alt: "NeoCash redesigned dashboard",
      caption: "Dashboard",
      sub: "Loan status front and centre. Fund wallet and transactions one tap away.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/01-old-dashboard.png",
      alt: "NeoCash original dashboard, before the redesign",
      caption: "Before: Home",
      sub: "Zero balance, no loan context, no clear next step.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/02-old-loan.png",
      alt: "NeoCash original loans screen, before the redesign",
      caption: "Before: Loans",
      sub: "Empty state only. No guidance on how to start.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/neocash/Action%20Required.png",
      alt: "NeoCash original loan status screen, listing required actions",
      caption: "Before: Loan status",
      sub: "Three action items with no progress signal and no priority order.",
      phone: true,
      ar: "9 / 19",
    },
  ],

  estility: [
    {
      src: "/images/estility/web-01-hero.webp",
      alt: "Estility website hero after the redesign",
      caption: "Website hero",
      sub: "The primary CTA moved from 'Book a Demo' to 'Download the App'. One change, direct impact on activation.",
      wide: true,
      ar: "16 / 7",
    },
    {
      src: "/images/estility/01-ui-screens.png",
      alt: "Overview of the full Estility product ecosystem",
      caption: "Ecosystem overview",
      sub: "Ten products. One design system holding all of it together.",
      wide: true,
      ar: "16 / 9",
    },
    {
      src: "/images/estility/IMG_5278.PNG",
      alt: "Estility app onboarding splash screen",
      caption: "Onboarding",
      sub: "Single screen, single promise.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/IMG_5279.PNG",
      alt: "Estility app sign in screen",
      caption: "Sign in",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/IMG_5281.PNG",
      alt: "Estility app home dashboard with fuel and gas actions",
      caption: "Home",
      sub: "Fuel stations and gas vendors surfaced by proximity.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/IMG_5280.PNG",
      alt: "Estility app home screen with the referral modal open",
      caption: "Referrals",
      sub: "Residents earn when friends order on Estility.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/IMG_5283.PNG",
      alt: "Estility app gas purchase vendor listing",
      caption: "Buy gas",
      sub: "Nearby vendors ranked by distance, open status and rating.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/IMG_5282.PNG",
      alt: "Estility app wallet transaction history",
      caption: "Wallet",
      sub: "Full transaction history, searchable and filterable.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/estility/web-03-analytics.webp",
      alt: "Estility analytics dashboard",
      caption: "Analytics dashboard",
      sub: "KPI visibility for operators and management.",
      ar: "16 / 10",
    },
    {
      src: "/images/estility/web-04-mobile.webp",
      alt: "Estility mobile experience",
      caption: "Mobile-first screens",
      ar: "16 / 10",
    },
    {
      src: "/images/estility/02-wireframes.png",
      alt: "Estility wireframes from the design process",
      caption: "Wireframes",
      sub: "Systems before screens. Every flow mapped before a pixel was placed.",
      ar: "16 / 10",
    },
    {
      src: "/images/estility/web-05-mockup.webp",
      alt: "Estility device mockup",
      caption: "Device mockup",
      ar: "16 / 10",
    },
  ],

  profootball: [
    {
      src: "/images/profootball/01-desktop-home.png",
      alt: "ProFootball desktop home, showing the gamified feed",
      caption: "Desktop home",
      sub: "Sports energy without gaming clutter. Confident type, restrained colour, high contrast where the action is.",
      wide: true,
      ar: "16 / 9",
    },
    {
      src: "/images/profootball/02-desktop-leaderboard.png",
      alt: "ProFootball leaderboard, the ranked competitive system",
      caption: "Leaderboards",
      sub: "Tiered: casual engagement gets visible progress, competitive engagement gets ranked standing.",
      ar: "16 / 10",
    },
    {
      src: "/images/profootball/03-desktop-trivia.png",
      alt: "ProFootball trivia system on desktop",
      caption: "Trivia system",
      sub: "Timed for tension, not anxiety. Fast enough to create stakes, slow enough to feel fair.",
      ar: "16 / 10",
    },
    {
      src: "/images/profootball/04-desktop-channels.png",
      alt: "ProFootball channels content feed",
      caption: "Channels",
      sub: "Curated football content alongside the engagement mechanics.",
      ar: "16 / 10",
    },
    {
      src: "/images/profootball/Home%20Page%20-%20Default.png",
      alt: "ProFootball mobile home with feed, scores and trivia",
      caption: "Home",
      sub: "Live scores and the trivia carousel co-exist without competing.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/profootball/Home%20Page%20-%20Default-1.png",
      alt: "ProFootball mobile home, scrolled state",
      caption: "Home (scrolled)",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/profootball/Trivia%20Screen.png",
      alt: "ProFootball mobile trivia categories and active contests",
      caption: "Trivia",
      sub: "Categories, active contests, pick up where you left off.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/profootball/Trivia%20Screen%20-%20Question.png",
      alt: "ProFootball mobile trivia question in progress",
      caption: "Trivia, active",
      sub: "Timed for tension, not anxiety.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/profootball/Leaderboard%20-%20Overall.png",
      alt: "ProFootball mobile leaderboard with ranked standings",
      caption: "Leaderboard",
      sub: "Overall, predictions and trivia tabs. Status made visible.",
      phone: true,
      ar: "9 / 19",
    },
    {
      src: "/images/profootball/Channel%20Screen.png",
      alt: "ProFootball mobile channels, curated football content",
      caption: "Channels",
      phone: true,
      ar: "9 / 19",
    },
  ],

  workergen: [
    {
      src: "/images/workergen/01-home.png",
      alt: "Workergen homepage, the AI agent marketplace",
      caption: "Homepage",
      sub: "Hiring AI workers should not feel like reading a manual. Clear, immediate, value first.",
      wide: true,
      ar: "16 / 9",
    },
    {
      src: "/images/workergen/05-wide.png",
      alt: "Workergen platform overview showing all available agents",
      caption: "Platform overview",
      sub: "Fifteen plus AI agents, one coherent system. The design system is what makes that scale.",
      wide: true,
      ar: "16 / 9",
    },
    {
      src: "/images/workergen/02-agents.png",
      alt: "Workergen agents marketplace listing",
      caption: "Agents marketplace",
      sub: "Each listing is an AI worker. Browse, hire, deploy.",
      ar: "16 / 10",
    },
    {
      src: "/images/workergen/03-email-agent.png",
      alt: "Workergen Email Automation agent configuration",
      caption: "Email Automation",
      sub: "Configure once. The agent handles the rest.",
      ar: "16 / 10",
    },
    {
      src: "/images/workergen/04-dashboard.png",
      alt: "Workergen dashboard with an overview of agent activity",
      caption: "Dashboard",
      sub: "Speed to value: the first productive moment inside 130 seconds.",
      ar: "16 / 10",
    },
    {
      src: "/images/workergen/06-autoblog.png",
      alt: "AutoBlog AI dashboard",
      caption: "AutoBlog AI",
      sub: "An AI content pipeline. One of the fifteen plus tools shipped.",
      ar: "16 / 10",
    },
  ],
};

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

function Figure({ shot }: { shot: Shot }) {
  return (
    <figure className="pg-shot">
      <div className="pg-shot-box" style={{ ["--pg-ar" as string]: shot.ar } as CSSProperties}>
        {/* globals.css positions `.pg-shot-box img` directly so the box owns the
            aspect ratio and the image can never push the layout wider than its
            column. The box reserves the height before the file loads. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption>
        <b>{shot.caption}</b>
        {shot.sub ? <span>{shot.sub}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function CaseStudyView({ cs }: { cs: CaseStudy }) {
  const shots = SHOTS[cs.slug] ?? [];
  const wide = shots.filter((s) => s.wide);
  const phones = shots.filter((s) => s.phone);
  // whatever is left is a desktop detail shot, which pairs two to a row
  const pairs = shots.filter((s) => !s.wide && !s.phone);

  return (
    <>
      <section className="pg-sec pg-cream">
        <p className="kicker">
          <b>Case</b> {cs.client}
        </p>
        <h1 className="big-title pg-h1">{cs.title}</h1>
        <p className="pg-lead">{cs.tagline}</p>
        <dl className="pg-facts">
          <div>
            <dt>Client</dt>
            <dd>{cs.client}</dd>
          </div>
          <div>
            <dt>Industry</dt>
            <dd>{cs.industry}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{cs.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>
              {cs.year} · {cs.duration}
            </dd>
          </div>
        </dl>
      </section>

      <section className="pg-sec pg-coral">
        <p className="kicker">
          <b>(01)</b> The problem
        </p>
        <h2 className="big-title pg-h2">{cs.problem}</h2>
        <p className="pg-body pg-body-wide pg-rv" data-rv="">
          {cs.problemDetail}
        </p>
      </section>

      <section className="pg-sec pg-navy">
        <p className="kicker">
          <b>(02)</b> The process
        </p>
        <h2 className="big-title pg-h2">How it
          <br />
          was done
        </h2>
        <ol className="pg-steps">
          {cs.process.map((step, i) => (
            <li className="pg-rv" data-rv="" key={step.heading}>
              <span className="pg-step-n" aria-hidden="true">
                {pad2(i + 1)}
              </span>
              <div>
                <h3>{step.heading}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {shots.length > 0 ? (
        <section className="pg-sec pg-white">
          <p className="kicker">
            <b>(03)</b> Screens
          </p>
          <h2 className="big-title pg-h2">The work
            <br />
            itself
          </h2>
          <div className="pg-shots">
            {wide.map((s) => (
              <div className="pg-rv" data-rv="" key={s.src}>
                <Figure shot={s} />
              </div>
            ))}

            {phones.length > 0 ? (
              <div className="pg-phones pg-rv" data-rv="">
                {phones.map((s) => (
                  <Figure shot={s} key={s.src} />
                ))}
              </div>
            ) : null}

            {pairs.length > 0 ? (
              <div className="pg-shot-pair pg-rv" data-rv="">
                {pairs.map((s) => (
                  <Figure shot={s} key={s.src} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="pg-sec pg-blue">
        <p className="kicker">
          <b>(04)</b> Results
        </p>
        <h2 className="big-title pg-h2">What
          <br />
          moved
        </h2>
        <div className="pg-nums">
          {cs.results.map((r) => (
            <div className="pg-num pg-rv" data-rv="" key={r.label}>
              <b>{r.value}</b>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      {cs.testimonial ? (
        <section className="pg-sec pg-yellow">
          <p className="kicker">
            <b>(05)</b> The client
          </p>
          <figure className="pg-quote">
            <blockquote>{cs.testimonial.quote}</blockquote>
            <figcaption>
              {cs.testimonial.name}
              <span>
                {cs.testimonial.role}, {cs.testimonial.company}
              </span>
            </figcaption>
          </figure>
        </section>
      ) : null}

      <section className="pg-sec pg-ink">
        <p className="kicker">
          <b>Next</b> Case study
        </p>
        <Link className="pg-next" href={`/case-study/${cs.nextSlug}`}>
          <p className="pg-next-t">{cs.nextTitle}</p>
          <span className="pg-arrow">
            <span>Read the case</span>
            <i aria-hidden="true">→</i>
          </span>
        </Link>
      </section>
    </>
  );
}
