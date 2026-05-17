"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  sub?: string;       /* secondary caption line */
  wide?: boolean;
  mobile?: boolean;   /* renders in a horizontal phone strip */
  aspect?: string;
};

/* ─── Gallery data ────────────────────────────────────────────────── */
const galleries: Record<string, GalleryImage[]> = {
  neocash: [
    {
      src: "/images/neocash/03-new-splash.png",
      alt: "NeoCash onboarding screen — Salary Earners",
      caption: "Onboarding",
      sub: "One screen, one idea. Built for salary earners, business owners, contractors.",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/04-new-pre-loan.png",
      alt: "NeoCash pre-loan context screen",
      caption: "Pre-application",
      sub: "Context before commitment. Users see exactly what they're walking into.",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/05-new-loan-flow.png",
      alt: "NeoCash conversational loan flow",
      caption: "Conversational flow",
      sub: "One question at a time, warm tone. Not a form — a conversation.",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/06-new-dashboard.png",
      alt: "NeoCash new dashboard",
      caption: "Dashboard",
      sub: "Loan status front-centre. Fund wallet and transactions one tap away.",
      aspect: "9/19",
    },
    /* before */
    {
      src: "/images/neocash/01-old-dashboard.png",
      alt: "NeoCash original dashboard — before redesign",
      caption: "Before: Dashboard",
      sub: "Cluttered hierarchy. No clear path to action.",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/02-old-loan.png",
      alt: "NeoCash original loan form — before redesign",
      caption: "Before: Loan form",
      sub: "All fields at once. No context, no warmth, no progress signal.",
      aspect: "9/19",
    },
  ],

  estility: [
    {
      src: "/images/estility/web-01-hero.webp",
      alt: "Estility website hero — redesigned homepage",
      caption: "Website hero",
      sub: "CTA shifted from 'Book a Demo' to 'Download the App'. One change, direct impact on activation.",
      wide: true,
      aspect: "16/7",
    },
    {
      src: "/images/estility/01-ui-screens.png",
      alt: "Estility full ecosystem UI overview",
      caption: "Ecosystem overview",
      sub: "10+ products. One design system holding it all together.",
      wide: true,
      aspect: "16/9",
    },
    /* mobile app strip — replace src paths once new images are added */
    {
      src: "/images/estility/app-home.png",
      alt: "Estility mobile app — home screen",
      caption: "App · Home",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/estility/app-services.png",
      alt: "Estility mobile app — services",
      caption: "App · Services",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/estility/app-community.png",
      alt: "Estility mobile app — community",
      caption: "App · Community",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/estility/app-profile.png",
      alt: "Estility mobile app — profile",
      caption: "App · Profile",
      aspect: "9/19",
      mobile: true,
    },
    /* detail grid */
    {
      src: "/images/estility/web-03-analytics.webp",
      alt: "Estility analytics dashboard",
      caption: "Analytics dashboard",
      sub: "KPI visibility for operators and management.",
    },
    {
      src: "/images/estility/web-04-mobile.webp",
      alt: "Estility mobile experience",
      caption: "Mobile-first screens",
    },
    {
      src: "/images/estility/02-wireframes.png",
      alt: "Estility wireframe process",
      caption: "Wireframes",
      sub: "Systems before screens. Every flow mapped before any pixel was placed.",
    },
    {
      src: "/images/estility/web-05-mockup.webp",
      alt: "Estility device mockup",
      caption: "Device mockup",
    },
  ],

  profootball: [
    {
      src: "/images/profootball/01-desktop-home.png",
      alt: "ProFootball desktop home — gamified feed",
      caption: "Desktop home",
      sub: "Sports energy without gaming clutter. Confident type, restrained colour, high contrast where the action is.",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/profootball/02-desktop-leaderboard.png",
      alt: "ProFootball leaderboard — ranked competitive system",
      caption: "Leaderboards",
      sub: "Ranked status for committed fans. Tiered: casual visible progress, competitive ranked standing.",
    },
    {
      src: "/images/profootball/03-desktop-trivia.png",
      alt: "ProFootball trivia system",
      caption: "Trivia system",
      sub: "Questions timed for tension, not anxiety. Fast enough to create stakes, slow enough to feel fair.",
    },
    {
      src: "/images/profootball/04-desktop-channels.png",
      alt: "ProFootball channels — content feed",
      caption: "Channels",
      sub: "Curated football content alongside the engagement mechanics.",
    },
    /* mobile strip — Figma exports */
    {
      src: "/images/profootball/Home%20Page%20-%20Default.png",
      alt: "ProFootball mobile home — feed, scores, trivia",
      caption: "Home",
      sub: "Live scores and trivia carousel co-exist without competing.",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/profootball/Home%20Page%20-%20Default-1.png",
      alt: "ProFootball mobile home — scrolled state",
      caption: "Home (scrolled)",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/profootball/Trivia%20Screen.png",
      alt: "ProFootball mobile trivia — categories and active contests",
      caption: "Trivia",
      sub: "Categories, active contests, pick up where you left off.",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/profootball/Trivia%20Screen%20-%20Question.png",
      alt: "ProFootball mobile trivia — question in progress",
      caption: "Trivia · Active",
      sub: "Timed for tension, not anxiety.",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/profootball/Leaderboard%20-%20Overall.png",
      alt: "ProFootball mobile leaderboard — ranked standings",
      caption: "Leaderboard",
      sub: "Overall / Predictions / Trivias tabs. Status made visible.",
      aspect: "9/19",
      mobile: true,
    },
    {
      src: "/images/profootball/Channel%20Screen.png",
      alt: "ProFootball mobile channels — curated football content",
      caption: "Channels",
      aspect: "9/19",
      mobile: true,
    },
  ],

  workergen: [
    {
      src: "/images/workergen/01-home.png",
      alt: "Workergen homepage — AI agent marketplace",
      caption: "Homepage",
      sub: "Hiring AI workers shouldn't feel like reading a manual. Clear, immediate, value-first.",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/workergen/05-wide.png",
      alt: "Workergen platform overview — all agents",
      caption: "Platform overview",
      sub: "15+ AI agents, one coherent system. The design system is what makes this scale.",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/workergen/02-agents.png",
      alt: "Workergen agents marketplace listing",
      caption: "Agents marketplace",
      sub: "Each listing is an AI worker. Browse, hire, deploy.",
    },
    {
      src: "/images/workergen/03-email-agent.png",
      alt: "Workergen Email Automation agent",
      caption: "Email Automation",
      sub: "Configure once. The agent handles the rest.",
    },
    {
      src: "/images/workergen/04-dashboard.png",
      alt: "Workergen dashboard — agent activity overview",
      caption: "Dashboard",
      sub: "Speed-to-value: first productive moment in under 130 seconds.",
    },
    {
      src: "/images/workergen/06-autoblog.png",
      alt: "AutoBlog AI dashboard",
      caption: "AutoBlog AI",
      sub: "AI-generated content pipeline. One of 15+ tools shipped.",
    },
  ],
};

/* ─── Shared: section divider with label ────────────────────────── */
function SectionDivider({ label, color = "var(--mist)" }: { label: string; color?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--s-4)",
        marginBottom: "var(--s-6)",
      }}
    >
      <span className="t-meta" style={{ color, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "var(--ash)" }} />
    </div>
  );
}

/* ─── Shared: full-width wide image ─────────────────────────────── */
function WideImage({ img }: { img: GalleryImage }) {
  return (
    <ScrollReveal>
      <figure style={{ margin: "0 0 var(--s-7)" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: img.aspect ?? "16/9",
            overflow: "hidden",
            border: "1px solid var(--ash)",
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
        <div style={{ marginTop: "var(--s-2)" }}>
          <span className="t-meta" style={{ color: "var(--bone)" }}>{img.caption}</span>
          {img.sub && (
            <span className="t-meta" style={{ color: "var(--fog)", marginLeft: "var(--s-3)" }}>
              — {img.sub}
            </span>
          )}
        </div>
      </figure>
    </ScrollReveal>
  );
}

/* ─── Shared: mobile phone strip ────────────────────────────────── */
function MobileStrip({ images, label }: { images: GalleryImage[]; label?: string }) {
  return (
    <div style={{ marginBottom: "var(--s-7)" }}>
      {label && <SectionDivider label={label} />}
      <div className="mobile-screens-row">
        {images.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.06}>
            <figure style={{ margin: 0, minWidth: "140px" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "9/19",
                  overflow: "hidden",
                  border: "1px solid var(--ash)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 140px, 200px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <figcaption
                className="t-meta"
                style={{ color: "var(--fog)", marginTop: "var(--s-1)" }}
              >
                {img.caption}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── NeoCash: redesign showcase + prominent before comparison ────── */
function NeoCashGallery({ images }: { images: GalleryImage[] }) {
  const after = images.slice(0, 4);
  const before = images.slice(4);

  return (
    <div>
      {/* After */}
      <SectionDivider label="Redesign" color="var(--signal)" />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--s-4)", marginBottom: "var(--s-9)" }}
        className="screens-grid-mobile"
      >
        {after.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "9/19",
                  overflow: "hidden",
                  border: "1px solid var(--ash)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <figcaption style={{ marginTop: "var(--s-2)" }}>
                <div className="t-meta" style={{ color: "var(--bone)" }}>{img.caption}</div>
                {img.sub && (
                  <div className="t-meta" style={{ color: "var(--fog)", marginTop: "2px" }}>{img.sub}</div>
                )}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      {/* Before */}
      <SectionDivider label="Original design — before" color="var(--fog)" />
      <ScrollReveal>
        <div
          style={{
            padding: "var(--s-7)",
            background: "var(--shroud)",
            border: "1px solid var(--ash)",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-5)" }}
            className="screens-grid-mobile"
          >
            {before.map((img) => (
              <figure key={img.src} style={{ margin: 0 }}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "9/19",
                    overflow: "hidden",
                    border: "1px solid var(--ash)",
                    opacity: 0.65,
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, 260px"
                    style={{ objectFit: "cover", filter: "grayscale(50%) contrast(0.9)" }}
                  />
                </div>
                <figcaption style={{ marginTop: "var(--s-2)" }}>
                  <div className="t-meta" style={{ color: "var(--fog)" }}>{img.caption}</div>
                  {img.sub && (
                    <div className="t-meta" style={{ color: "var(--fog)", opacity: 0.7, marginTop: "2px" }}>{img.sub}</div>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ─── Estility: wides + mobile strip + detail grid ──────────────── */
function EstilityGallery({ images }: { images: GalleryImage[] }) {
  const wides = images.filter((i) => i.wide);
  const mobile = images.filter((i) => i.mobile);
  const grid = images.filter((i) => !i.wide && !i.mobile);

  return (
    <div>
      {wides.map((img) => (
        <WideImage key={img.src} img={img} />
      ))}

      {mobile.length > 0 && (
        <MobileStrip images={mobile} label="Mobile app" />
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-4)" }}
        className="screens-grid-mobile-1col"
      >
        {grid.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  border: "1px solid var(--ash)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <figcaption style={{ marginTop: "var(--s-2)" }}>
                <div className="t-meta" style={{ color: "var(--bone)" }}>{img.caption}</div>
                {img.sub && (
                  <div className="t-meta" style={{ color: "var(--fog)", marginTop: "2px" }}>{img.sub}</div>
                )}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── ProFootball: full-bleed hero + desktop grid + mobile strip ─── */
function ProFootballGallery({ images }: { images: GalleryImage[] }) {
  const wide = images.filter((i) => i.wide);
  const desktop = images.filter((i) => !i.wide && !i.mobile);
  const mobile = images.filter((i) => i.mobile);

  return (
    <div>
      {wide.map((img) => (
        <WideImage key={img.src} img={img} />
      ))}

      <SectionDivider label="Desktop screens" />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-4)", marginBottom: "var(--s-9)" }}
        className="screens-grid-tablet"
      >
        {desktop.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  border: "1px solid var(--ash)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <figcaption style={{ marginTop: "var(--s-2)" }}>
                <div className="t-meta" style={{ color: "var(--bone)" }}>{img.caption}</div>
                {img.sub && (
                  <div className="t-meta" style={{ color: "var(--fog)", marginTop: "2px" }}>{img.sub}</div>
                )}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      <MobileStrip images={mobile} label="Mobile screens" />
    </div>
  );
}

/* ─── Workergen: wide hero pair + 3-col detail grid ─────────────── */
function WorkergenGallery({ images }: { images: GalleryImage[] }) {
  const wides = images.filter((i) => i.wide);
  const grid = images.filter((i) => !i.wide);

  return (
    <div>
      {wides.map((img) => (
        <WideImage key={img.src} img={img} />
      ))}

      <SectionDivider label="Product screens" />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-4)" }}
        className="screens-grid-mobile-2col"
      >
        {grid.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  border: "1px solid var(--ash)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <figcaption style={{ marginTop: "var(--s-2)" }}>
                <div className="t-meta" style={{ color: "var(--bone)" }}>{img.caption}</div>
                {img.sub && (
                  <div className="t-meta" style={{ color: "var(--fog)", marginTop: "2px" }}>{img.sub}</div>
                )}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function ScreensGallery({ cs }: { cs: CaseStudy }) {
  const images = galleries[cs.slug] ?? [];

  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderBottom: "1px solid var(--ash)",
      }}
    >
      <style>{`
        .screens-grid-mobile { }
        .mobile-screens-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: var(--s-3);
        }
        .screens-grid-tablet { }
        .screens-grid-mobile-1col { }
        .screens-grid-mobile-2col { }

        @media (max-width: 768px) {
          .screens-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .mobile-screens-row {
            display: flex;
            overflow-x: auto;
            gap: var(--s-3);
            padding-bottom: var(--s-3);
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .mobile-screens-row > * {
            scroll-snap-align: start;
            flex-shrink: 0;
            width: 140px;
          }
          .screens-grid-tablet {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .screens-grid-mobile-1col {
            grid-template-columns: 1fr !important;
          }
          .screens-grid-mobile-2col {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .screens-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .screens-grid-mobile-2col {
            grid-template-columns: 1fr !important;
          }
          .screens-grid-tablet {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="container-wide">
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-7)" }}
          >
            Visual work
          </span>
        </ScrollReveal>

        {cs.slug === "neocash"     && <NeoCashGallery images={images} />}
        {cs.slug === "estility"    && <EstilityGallery images={images} />}
        {cs.slug === "profootball" && <ProFootballGallery images={images} />}
        {cs.slug === "workergen"   && <WorkergenGallery images={images} />}
      </div>
    </section>
  );
}
