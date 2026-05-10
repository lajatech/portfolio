"use client";

import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  wide?: boolean;
  aspect?: string;
};

const galleries: Record<string, GalleryImage[]> = {
  neocash: [
    { src: "/images/neocash/03-new-splash.png",    alt: "NeoCash new splash screen",         caption: "Splash — brand entry",     aspect: "9/19" },
    { src: "/images/neocash/04-new-pre-loan.png",  alt: "NeoCash loan pre-application",      caption: "Pre-application",          aspect: "9/19" },
    { src: "/images/neocash/05-new-loan-flow.png", alt: "NeoCash conversational loan flow",  caption: "Conversational flow",      aspect: "9/19" },
    { src: "/images/neocash/06-new-dashboard.png", alt: "NeoCash new dashboard",             caption: "Dashboard",                aspect: "9/19" },
    { src: "/images/neocash/01-old-dashboard.png", alt: "NeoCash old dashboard — before",   caption: "Before — old dashboard",   aspect: "9/19" },
    { src: "/images/neocash/02-old-loan.png",      alt: "NeoCash old loan screen — before", caption: "Before — loan form",       aspect: "9/19" },
  ],
  estility: [
    { src: "/images/estility/web-01-hero.webp",       alt: "Estility website hero",           caption: "Website hero",            wide: true, aspect: "16/7" },
    { src: "/images/estility/01-ui-screens.png",      alt: "Estility ecosystem UI screens",   caption: "Ecosystem — UI overview", wide: true, aspect: "16/9" },
    { src: "/images/estility/web-03-analytics.webp",  alt: "Estility analytics dashboard",    caption: "Analytics dashboard" },
    { src: "/images/estility/web-04-mobile.webp",     alt: "Estility mobile screens",         caption: "Mobile experience" },
    { src: "/images/estility/02-wireframes.png",      alt: "Estility wireframe process",      caption: "Wireframes" },
    { src: "/images/estility/web-05-mockup.webp",     alt: "Estility device mockup",          caption: "Device mockup" },
  ],
  profootball: [
    { src: "/images/profootball/01-desktop-home.png",        alt: "ProFootball desktop home",      caption: "Desktop — home",        wide: true, aspect: "16/9" },
    { src: "/images/profootball/02-desktop-leaderboard.png", alt: "ProFootball leaderboards",      caption: "Leaderboards" },
    { src: "/images/profootball/03-desktop-trivia.png",      alt: "ProFootball trivia system",     caption: "Trivia system" },
    { src: "/images/profootball/04-desktop-channels.png",    alt: "ProFootball channels",          caption: "Channels" },
    { src: "/images/profootball/05-mobile-home.png",         alt: "ProFootball mobile home",       caption: "Home",     aspect: "9/19" },
    { src: "/images/profootball/06-mobile-trivia.png",       alt: "ProFootball mobile trivia",     caption: "Trivia",   aspect: "9/19" },
    { src: "/images/profootball/07-mobile-profile.png",      alt: "ProFootball mobile profile",    caption: "Profile",  aspect: "9/19" },
    { src: "/images/profootball/08-mobile-leaderboard.png",  alt: "ProFootball mobile leaderboard",caption: "Leaderboard", aspect: "9/19" },
  ],
  workergen: [
    { src: "/images/workergen/01-home.png",       alt: "Workergen home",           caption: "Homepage",           wide: true, aspect: "16/9" },
    { src: "/images/workergen/05-wide.png",       alt: "Workergen overview",       caption: "Platform overview",  wide: true, aspect: "16/9" },
    { src: "/images/workergen/02-agents.png",     alt: "Workergen agents page",    caption: "Agents marketplace" },
    { src: "/images/workergen/03-email-agent.png",alt: "Email Automation tool",    caption: "Email Automation" },
    { src: "/images/workergen/04-dashboard.png",  alt: "Workergen dashboard",      caption: "Dashboard" },
    { src: "/images/workergen/06-autoblog.png",   alt: "AutoBlog AI dashboard",    caption: "AutoBlog AI" },
  ],
};

/* ─── NeoCash: featured after + small before strip ──────────────────── */
function NeoCashGallery({ images }: { images: GalleryImage[] }) {
  const after = images.slice(0, 4);
  const before = images.slice(4);

  return (
    <div>
      {/* After — primary showcase */}
      <ScrollReveal>
        <div style={{ marginBottom: "var(--s-3)" }}>
          <span className="t-meta" style={{ color: "var(--signal)" }}>After — redesign</span>
        </div>
      </ScrollReveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--s-3)",
          marginBottom: "var(--s-7)",
        }}
        className="screens-grid-mobile"
      >
        {after.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div style={{ position: "relative", aspectRatio: "9/19", overflow: "hidden", border: "1px solid var(--ash)" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 50vw, 300px" style={{ objectFit: "cover" }} />
              </div>
              <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-1)" }}>{img.caption}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      {/* Before — smaller reference strip */}
      <ScrollReveal>
        <div
          style={{
            padding: "var(--s-5)",
            background: "var(--shroud)",
            border: "1px solid var(--ash)",
          }}
        >
          <div style={{ marginBottom: "var(--s-4)" }}>
            <span className="t-meta" style={{ color: "var(--fog)" }}>Before — original</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--s-3)",
              maxWidth: "320px",
            }}
          >
            {before.map((img) => (
              <figure key={img.src} style={{ margin: 0 }}>
                <div style={{ position: "relative", aspectRatio: "9/19", overflow: "hidden", border: "1px solid var(--ash)", opacity: 0.7 }}>
                  <Image src={img.src} alt={img.alt} fill sizes="160px" style={{ objectFit: "cover", filter: "grayscale(30%)" }} />
                </div>
                <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-1)" }}>{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ─── ProFootball: desktop grid + mobile strip ──────────────────────── */
function ProFootballGallery({ images }: { images: GalleryImage[] }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const wide = images.filter((i) => i.wide);
  const desktop = images.filter((i) => !i.wide && i.aspect !== "9/19");
  const mobile = images.filter((i) => i.aspect === "9/19");

  return (
    <div>
      {/* Full-bleed hero with thumbnail switcher */}
      <ScrollReveal>
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", border: "1px solid var(--ash)", marginBottom: "var(--s-3)" }}>
          <Image src={wide[0].src} alt={wide[0].alt} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "top" }} priority />
        </div>
        <figcaption className="t-meta" style={{ color: "var(--fog)", marginBottom: "var(--s-7)" }}>Desktop — home</figcaption>
      </ScrollReveal>

      {/* Desktop screens row */}
      <ScrollReveal delay={0.05}>
        <p className="t-meta" style={{ color: "var(--mist)", marginBottom: "var(--s-3)" }}>Desktop screens</p>
      </ScrollReveal>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-3)", marginBottom: "var(--s-7)" }}
        className="screens-grid-tablet"
      >
        {desktop.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", border: "1px solid var(--ash)" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-1)" }}>{img.caption}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      {/* Mobile screens — horizontal scroll on mobile, 4-col on desktop */}
      <ScrollReveal delay={0.1}>
        <p className="t-meta" style={{ color: "var(--mist)", marginBottom: "var(--s-3)" }}>Mobile screens</p>
      </ScrollReveal>
      <div className="mobile-screens-row">
        {mobile.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.06}>
            <figure style={{ margin: 0, minWidth: "140px" }}>
              <div style={{ position: "relative", aspectRatio: "9/19", overflow: "hidden", border: "1px solid var(--ash)" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 140px, 200px" style={{ objectFit: "cover" }} />
              </div>
              <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-1)" }}>{img.caption}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── Estility: editorial with wide anchors ─────────────────────────── */
function EstilityGallery({ images }: { images: GalleryImage[] }) {
  const wides = images.filter((i) => i.wide);
  const grid = images.filter((i) => !i.wide);

  return (
    <div>
      {wides.map((img, i) => (
        <ScrollReveal key={img.src} delay={i * 0.08}>
          <figure style={{ margin: "0 0 var(--s-4)" }}>
            <div style={{ position: "relative", aspectRatio: img.aspect ?? "16/9", overflow: "hidden", border: "1px solid var(--ash)" }}>
              <Image src={img.src} alt={img.alt} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
            <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>{img.caption}</figcaption>
          </figure>
        </ScrollReveal>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-4)" }} className="screens-grid-mobile-1col">
        {grid.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", border: "1px solid var(--ash)" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 600px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>{img.caption}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── Workergen: wide hero + 2×3 grid ───────────────────────────────── */
function WorkergenGallery({ images }: { images: GalleryImage[] }) {
  const wides = images.filter((i) => i.wide);
  const grid = images.filter((i) => !i.wide);

  return (
    <div>
      {wides.map((img, i) => (
        <ScrollReveal key={img.src} delay={i * 0.06}>
          <figure style={{ margin: "0 0 var(--s-4)" }}>
            <div style={{ position: "relative", aspectRatio: img.aspect ?? "16/9", overflow: "hidden", border: "1px solid var(--ash)" }}>
              <Image src={img.src} alt={img.alt} fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
            <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>{img.caption}</figcaption>
          </figure>
        </ScrollReveal>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-3)" }} className="screens-grid-mobile-2col">
        {grid.map((img, i) => (
          <ScrollReveal key={img.src} delay={i * 0.07}>
            <figure style={{ margin: 0 }}>
              <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", border: "1px solid var(--ash)" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 400px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>{img.caption}</figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────── */
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
          grid-template-columns: repeat(4, 1fr);
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

        {cs.slug === "neocash"    && <NeoCashGallery images={images} />}
        {cs.slug === "estility"   && <EstilityGallery images={images} />}
        {cs.slug === "profootball"&& <ProFootballGallery images={images} />}
        {cs.slug === "workergen"  && <WorkergenGallery images={images} />}
      </div>
    </section>
  );
}
