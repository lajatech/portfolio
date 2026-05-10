"use client";

import Link from "next/link";
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
    size: "large",
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
    size: "medium",
  },
  {
    index: "003",
    slug: "profootball",
    title: "ProFootball Webapp",
    subtitle: "Turning passive fans into active participants.",
    tags: ["Sports Tech", "Gamification", "Trivia"],
    metric: "2",
    metricLabel: "gamification systems built",
    year: "2024",
    size: "medium",
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
            style={{ marginBottom: "var(--s-9)" }}
          >
            <span className="t-meta" style={{ color: "var(--mist)" }}>
              Selected work — 2021—Now
            </span>
            <Link
              href="/work"
              className="btn-ghost t-meta"
              style={{ color: "var(--bone)" }}
            >
              All projects →
            </Link>
          </div>
        </ScrollReveal>

        {/* Project list — editorial, not a grid */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {featured.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.08}>
              <Link
                href={`/case-study/${project.slug}`}
                className="group"
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    padding: "var(--s-7) 0",
                    borderBottom: "1px solid var(--ash)",
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    alignItems: "start",
                    gap: "var(--s-6)",
                    transition: "background 180ms var(--ease-eerie)",
                  }}
                >
                  {/* Index */}
                  <span
                    className="t-meta"
                    style={{ color: "var(--signal)", paddingTop: "6px" }}
                  >
                    {project.index}
                  </span>

                  {/* Content */}
                  <div>
                    <h3
                      className="t-display-sm"
                      style={{
                        color: "var(--veil)",
                        marginBottom: "var(--s-2)",
                        transition: "color 180ms var(--ease-eerie)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="t-editorial-md"
                      style={{
                        color: "var(--mist)",
                        marginBottom: "var(--s-4)",
                        fontSize: "clamp(20px, 3vw, 36px)",
                      }}
                    >
                      {project.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center" style={{ gap: "var(--s-2)" }}>
                      {project.tags.map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — metric + arrow */}
                  <div
                    className="flex flex-col items-end"
                    style={{ gap: "var(--s-2)", textAlign: "right" }}
                  >
                    <div>
                      <div
                        className="t-display-md"
                        style={{ color: "var(--signal)", lineHeight: 1 }}
                      >
                        {project.metric}
                      </div>
                      <div
                        className="t-meta"
                        style={{ color: "var(--fog)", marginTop: "4px" }}
                      >
                        {project.metricLabel}
                      </div>
                    </div>
                    <span
                      className="t-meta"
                      style={{ color: "var(--fog)" }}
                    >
                      {project.year}
                    </span>
                    <span
                      style={{
                        color: "var(--mist)",
                        fontSize: "20px",
                        transition: "color 180ms var(--ease-eerie), transform 180ms var(--ease-eerie)",
                      }}
                      className="group-hover:text-signal"
                    >
                      ↗
                    </span>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Workergen mini — separate treatment */}
        <ScrollReveal delay={0.3}>
          <Link
            href="/case-study/workergen"
            className="group"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                marginTop: "var(--s-7)",
                padding: "var(--s-6)",
                background: "var(--char)",
                border: "1px solid var(--ash)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--s-5)",
                boxShadow: "var(--sh-inset)",
                transition: "transform 180ms var(--ease-eerie)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div>
                <div
                  className="flex items-center"
                  style={{ gap: "var(--s-3)", marginBottom: "var(--s-2)" }}
                >
                  <span className="t-meta" style={{ color: "var(--signal)" }}>
                    004
                  </span>
                  <span className="pill">Mini Case Study</span>
                  <span className="pill">AI / SaaS</span>
                </div>
                <h3 className="t-h2" style={{ color: "var(--veil)" }}>
                  Workergen AI Marketplace
                </h3>
                <p className="t-body" style={{ color: "var(--bone)", marginTop: "var(--s-2)" }}>
                  15+ AI agents shipped. TTV reduced to 130 seconds. Churn halved.
                </p>
              </div>
              <div style={{ flexShrink: 0, color: "var(--mist)", fontSize: "24px" }}>
                →
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
