"use client";

import Image from "next/image";
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
    {
      src: "/images/neocash/01-old-dashboard.png",
      alt: "NeoCash old dashboard — before redesign",
      caption: "Before — outdated, low-trust",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/02-old-loan.png",
      alt: "NeoCash old loan screen — before redesign",
      caption: "Before — dense, form-heavy",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/03-new-splash.png",
      alt: "NeoCash new splash screen",
      caption: "After — branded, warm",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/04-new-pre-loan.png",
      alt: "NeoCash new loan pre-application screen",
      caption: "After — conversational entry",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/05-new-loan-flow.png",
      alt: "NeoCash new loan application flow",
      caption: "After — dialogue-style flow",
      aspect: "9/19",
    },
    {
      src: "/images/neocash/06-new-dashboard.png",
      alt: "NeoCash new dashboard",
      caption: "After — clear loan status",
      aspect: "9/19",
    },
  ],
  estility: [
    {
      src: "/images/estility/web-01-hero.webp",
      alt: "Estility website redesign — hero section",
      caption: "Website redesign — hero",
      wide: true,
      aspect: "16/7",
    },
    {
      src: "/images/estility/01-ui-screens.png",
      alt: "Estility ecosystem — 7 UI screens overview",
      caption: "App ecosystem — UI screens",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/estility/web-03-analytics.webp",
      alt: "Estility analytics dashboard",
      caption: "Analytics dashboard",
      aspect: "16/9",
    },
    {
      src: "/images/estility/web-04-mobile.webp",
      alt: "Estility mobile app screens",
      caption: "Mobile experience",
      aspect: "16/9",
    },
    {
      src: "/images/estility/02-wireframes.png",
      alt: "Estility wireframes — 5 screens",
      caption: "Wireframe process",
      aspect: "16/9",
    },
    {
      src: "/images/estility/web-05-mockup.webp",
      alt: "Estility website mockup",
      caption: "Website — device mockup",
      aspect: "16/9",
    },
    {
      src: "/images/estility/03-app-a.webp",
      alt: "Estility app screen A",
      caption: "App screen detail",
      aspect: "9/19",
    },
    {
      src: "/images/estility/04-app-y.webp",
      alt: "Estility app screen Y",
      caption: "App screen detail",
      aspect: "9/19",
    },
  ],
  profootball: [
    {
      src: "/images/profootball/01-desktop-home.png",
      alt: "ProFootball desktop — home page",
      caption: "Desktop — home",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/profootball/02-desktop-leaderboard.png",
      alt: "ProFootball desktop — leaderboards",
      caption: "Desktop — leaderboards",
      aspect: "16/9",
    },
    {
      src: "/images/profootball/03-desktop-trivia.png",
      alt: "ProFootball desktop — trivia trending",
      caption: "Desktop — trivia system",
      aspect: "16/9",
    },
    {
      src: "/images/profootball/04-desktop-channels.png",
      alt: "ProFootball desktop — channels",
      caption: "Desktop — channels",
      aspect: "16/9",
    },
    {
      src: "/images/profootball/05-mobile-home.png",
      alt: "ProFootball mobile — home",
      caption: "Mobile — home",
      aspect: "9/19",
    },
    {
      src: "/images/profootball/06-mobile-trivia.png",
      alt: "ProFootball mobile — trivia question",
      caption: "Mobile — trivia",
      aspect: "9/19",
    },
    {
      src: "/images/profootball/07-mobile-profile.png",
      alt: "ProFootball mobile — profile badges",
      caption: "Mobile — badges",
      aspect: "9/19",
    },
    {
      src: "/images/profootball/08-mobile-leaderboard.png",
      alt: "ProFootball mobile — leaderboard",
      caption: "Mobile — leaderboard",
      aspect: "9/19",
    },
  ],
  workergen: [
    {
      src: "/images/workergen/01-home.png",
      alt: "Workergen home page — desktop",
      caption: "Homepage — desktop",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/workergen/05-wide.png",
      alt: "Workergen platform overview",
      caption: "Platform overview",
      wide: true,
      aspect: "16/9",
    },
    {
      src: "/images/workergen/02-agents.png",
      alt: "Workergen agents marketplace page",
      caption: "Agents marketplace",
      aspect: "16/9",
    },
    {
      src: "/images/workergen/03-email-agent.png",
      alt: "Workergen email automation agent dashboard",
      caption: "Email Automation tool",
      aspect: "16/9",
    },
    {
      src: "/images/workergen/04-dashboard.png",
      alt: "Workergen main dashboard",
      caption: "Dashboard",
      aspect: "16/9",
    },
    {
      src: "/images/workergen/06-autoblog.png",
      alt: "Workergen AutoBlog AI dashboard",
      caption: "AutoBlog AI tool",
      aspect: "16/9",
    },
  ],
};

export default function ScreensGallery({ cs }: { cs: CaseStudy }) {
  const images = galleries[cs.slug] ?? [];

  const wideImages = images.filter((img) => img.wide);
  const gridImages = images.filter((img) => !img.wide);

  // For NeoCash — special before/after 2-column layout
  const isNeocash = cs.slug === "neocash";
  const oldScreens = isNeocash ? gridImages.slice(0, 2) : [];
  const newScreens = isNeocash ? gridImages.slice(2) : [];
  const mobileImages = ["profootball"].includes(cs.slug)
    ? gridImages.filter((_, i) => i >= 4)
    : [];
  const desktopImages = ["profootball"].includes(cs.slug)
    ? gridImages.filter((_, i) => i < 4)
    : [];

  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderBottom: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-7)" }}
          >
            Visual work
          </span>
        </ScrollReveal>

        {/* Wide/hero images first */}
        {wideImages.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)", marginBottom: "var(--s-4)" }}
          >
            {wideImages.map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 0.08}>
                <figure style={{ margin: 0 }}>
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
                      sizes="(max-width: 768px) 100vw, 1200px"
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  {img.caption && (
                    <figcaption
                      className="t-meta"
                      style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}
                    >
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* NeoCash — before / after side by side */}
        {isNeocash && (
          <>
            <ScrollReveal>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "var(--s-4)",
                  marginBottom: "var(--s-7)",
                }}
              >
                <div>
                  <p
                    className="t-meta"
                    style={{ color: "var(--fog)", marginBottom: "var(--s-3)" }}
                  >
                    Before
                  </p>
                  <div style={{ display: "flex", gap: "var(--s-3)" }}>
                    {oldScreens.map((img) => (
                      <figure key={img.src} style={{ margin: 0, flex: 1 }}>
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "9/19",
                            overflow: "hidden",
                            border: "1px solid var(--ash)",
                          }}
                        >
                          <Image src={img.src} alt={img.alt} fill sizes="300px" style={{ objectFit: "cover" }} />
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
                <div>
                  <p
                    className="t-meta"
                    style={{ color: "var(--signal)", marginBottom: "var(--s-3)" }}
                  >
                    After
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "var(--s-2)",
                    }}
                  >
                    {newScreens.map((img) => (
                      <figure key={img.src} style={{ margin: 0 }}>
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "9/19",
                            overflow: "hidden",
                            border: "1px solid var(--ash)",
                          }}
                        >
                          <Image src={img.src} alt={img.alt} fill sizes="200px" style={{ objectFit: "cover" }} />
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}

        {/* ProFootball — desktop row then mobile row */}
        {cs.slug === "profootball" && (
          <>
            <ScrollReveal>
              <p className="t-meta" style={{ color: "var(--fog)", marginBottom: "var(--s-3)" }}>
                Desktop
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "var(--s-4)",
                  marginBottom: "var(--s-7)",
                }}
              >
                {desktopImages.map((img, i) => (
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
                        <Image src={img.src} alt={img.alt} fill sizes="600px" style={{ objectFit: "cover", objectPosition: "top" }} />
                      </div>
                      <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>
                        {img.caption}
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="t-meta" style={{ color: "var(--fog)", marginBottom: "var(--s-3)" }}>
                Mobile
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "var(--s-3)",
                }}
              >
                {mobileImages.map((img, i) => (
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
                        <Image src={img.src} alt={img.alt} fill sizes="300px" style={{ objectFit: "cover" }} />
                      </div>
                      <figcaption className="t-meta" style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}>
                        {img.caption}
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </>
        )}

        {/* Workergen + Estility — standard grid */}
        {!isNeocash && cs.slug !== "profootball" && gridImages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--s-4)",
            }}
          >
            {gridImages.map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 0.07}>
                <figure style={{ margin: 0 }}>
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
                      sizes="(max-width: 768px) 100vw, 600px"
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  {img.caption && (
                    <figcaption
                      className="t-meta"
                      style={{ color: "var(--fog)", marginTop: "var(--s-2)" }}
                    >
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
