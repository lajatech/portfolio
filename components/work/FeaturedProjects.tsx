"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { caseStudies } from "@/lib/data";

export default function FeaturedProjects() {
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
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-9)" }}
          >
            Case studies
          </span>
        </ScrollReveal>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {caseStudies.map((cs, i) => (
            <ScrollReveal key={cs.slug} delay={i * 0.07}>
              <Link
                href={`/case-study/${cs.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    padding: "var(--s-7) 0",
                    borderBottom: "1px solid var(--ash)",
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "var(--s-6)",
                    alignItems: "start",
                    transition: "background 180ms var(--ease-eerie)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--veil-04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {/* Index */}
                  <span
                    className="t-meta"
                    style={{ color: "var(--mist)", paddingTop: "6px" }}
                  >
                    {String(i + 1).padStart(3, "0")}
                  </span>

                  {/* Content */}
                  <div>
                    <div
                      className="flex items-center flex-wrap"
                      style={{ gap: "var(--s-2)", marginBottom: "var(--s-3)" }}
                    >
                      {cs.type === "mini" && (
                        <span className="pill pill-signal">Mini</span>
                      )}
                      <span className="pill">{cs.industry}</span>
                    </div>
                    <h2
                      className="t-display-sm"
                      style={{
                        color: "var(--veil)",
                        marginBottom: "var(--s-2)",
                      }}
                    >
                      {cs.title}
                    </h2>
                    <p
                      className="t-editorial-md"
                      style={{
                        color: "var(--mist)",
                        fontSize: "clamp(18px, 2.5vw, 32px)",
                        marginBottom: "var(--s-4)",
                      }}
                    >
                      {cs.subtitle}
                    </p>
                    <p className="t-body" style={{ color: "var(--fog)", maxWidth: "480px" }}>
                      {cs.tagline}
                    </p>
                  </div>

                  {/* Right */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "var(--s-2)",
                    }}
                  >
                    <span className="t-meta" style={{ color: "var(--fog)" }}>
                      {cs.year}
                    </span>
                    <span
                      style={{
                        color: "var(--mist)",
                        fontSize: "20px",
                      }}
                    >
                      ↗
                    </span>
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
