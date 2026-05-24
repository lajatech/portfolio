"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

const featured = [
  {
    index: "001",
    slug: "neocash",
    title: "NeoCash App Redesign",
    subtitle: "Reframing the loan as a conversation.",
    tags: ["FinTech", "UX Redesign", "Conversational UI"],
    metric: "+1050%",
    metricLabel: "loan completion",
    year: "2025",
    brandColor: "#1A0A32",
    brandGlow: "rgba(90, 40, 180, 0.25)",
    image: "/images/neocash/06-new-dashboard.png",
    imageStyle: {
      position: "absolute" as const,
      right: "-5%",
      bottom: "10%",
      width: "48%",
      height: "78%",
      objectFit: "contain" as const,
      objectPosition: "top center",
      opacity: 0.85,
    },
  },
  {
    index: "002",
    slug: "estility",
    title: "Estility Ecosystem",
    subtitle: "Two years. One design language. Ten products.",
    tags: ["PropTech", "Design System", "Product Lead"],
    metric: "19%",
    metricLabel: "more leads closed",
    year: "2023–2025",
    brandColor: "#0E0620",
    brandGlow: "rgba(60, 20, 120, 0.2)",
    image: "/images/estility/01-ui-screens.png",
    imageStyle: {
      position: "absolute" as const,
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      objectPosition: "center",
      opacity: 0.35,
    },
  },
  {
    index: "003",
    slug: "profootball",
    title: "ProFootball Webapp",
    subtitle: "Turning passive fans into active participants.",
    tags: ["Sports Tech", "Gamification", "Trivia"],
    metric: "2",
    metricLabel: "gamification systems",
    year: "2024",
    brandColor: "#060F05",
    brandGlow: "rgba(20, 80, 30, 0.2)",
    image: "/images/profootball/01-desktop-home.png",
    imageStyle: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "65%",
      objectFit: "cover" as const,
      objectPosition: "top center",
      opacity: 0.45,
    },
  },
  {
    index: "004",
    slug: "workergen",
    title: "Workergen AI Marketplace",
    subtitle: "15+ agents shipped. TTV cut to 130 seconds.",
    tags: ["AI / SaaS", "Design System"],
    metric: "−50%",
    metricLabel: "churn rate",
    year: "2024",
    brandColor: "#090D14",
    brandGlow: "rgba(40, 60, 100, 0.2)",
    image: "/images/workergen/01-home.png",
    imageStyle: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "65%",
      objectFit: "cover" as const,
      objectPosition: "top center",
      opacity: 0.45,
    },
  },
];

export default function SelectedWork() {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderTop: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        {/* Section header */}
        <ScrollReveal>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: "var(--s-8)" }}
          >
            <span className="t-meta" style={{ color: "var(--mist)" }}>
              Selected work
            </span>
            <Link href="/work" className="btn-ghost t-meta" style={{ color: "var(--bone)" }}>
              All projects →
            </Link>
          </div>
        </ScrollReveal>

        {/* Card grid */}
        <style>{`
          .work-card-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
          }
          @media (max-width: 768px) {
            .work-card-grid { grid-template-columns: 1fr; }
          }
          .work-card-inner {
            position: relative;
            overflow: hidden;
            height: 480px;
            transition: transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          @media (max-width: 480px) {
            .work-card-inner { height: 380px; }
          }
          .work-card-inner:hover {
            transform: translateY(-3px);
          }
          .work-card-inner:hover .work-card-arrow {
            transform: translate(3px, -3px);
          }
          .work-card-arrow {
            transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }
        `}</style>

        <div className="work-card-grid">
          {featured.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.07}>
              <Link href={`/case-study/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <article
                  className="work-card-inner"
                  style={{ background: project.brandColor }}
                >
                  {/* Product screenshot */}
                  <img
                    src={project.image}
                    alt={project.title}
                    style={project.imageStyle}
                  />

                  {/* Bottom gradient scrim */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, ${project.brandColor} 35%, rgba(0,0,0,0) 75%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top-left: index + arrow */}
                  <div
                    style={{
                      position: "absolute",
                      top: "var(--s-5)",
                      left: "var(--s-5)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--s-3)",
                      zIndex: 3,
                    }}
                  >
                    <span
                      className="t-meta"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {project.index}
                    </span>
                  </div>

                  {/* Top-right: metric */}
                  <div
                    style={{
                      position: "absolute",
                      top: "var(--s-5)",
                      right: "var(--s-5)",
                      textAlign: "right",
                      zIndex: 3,
                    }}
                  >
                    <div
                      className="t-display-sm"
                      style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1 }}
                    >
                      {project.metric}
                    </div>
                    <div
                      className="t-meta"
                      style={{ color: "rgba(255,255,255,0.35)", marginTop: "4px" }}
                    >
                      {project.metricLabel}
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "var(--s-5) var(--s-5) var(--s-6)",
                      zIndex: 3,
                    }}
                  >
                    <div style={{ marginBottom: "var(--s-2)" }}>
                      <span className="t-meta" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {project.year}
                      </span>
                    </div>
                    <h3
                      className="t-display-sm"
                      style={{
                        color: "#ffffff",
                        marginBottom: "var(--s-2)",
                        lineHeight: 1.05,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="t-editorial-md"
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: "var(--s-4)",
                        fontSize: "clamp(16px, 2vw, 24px)",
                      }}
                    >
                      {project.subtitle}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="flex flex-wrap" style={{ gap: "var(--s-2)" }}>
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="pill"
                            style={{
                              borderColor: "rgba(255,255,255,0.18)",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span
                        className="work-card-arrow"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "20px",
                          flexShrink: 0,
                          marginLeft: "var(--s-3)",
                        }}
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
