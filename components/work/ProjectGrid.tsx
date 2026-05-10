"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { snapshotProjects } from "@/lib/data";

export default function ProjectGrid() {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
      }}
    >
      <div className="container-wide">
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-7)" }}
          >
            More work — snapshots
          </span>
          <p
            className="t-body-sm"
            style={{
              color: "var(--fog)",
              fontFamily: "var(--font-mono)",
              marginBottom: "var(--s-7)",
            }}
          >
            — Imagery pending. Placeholders will be replaced with actual project visuals.
          </p>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1px",
            background: "var(--ash)",
            border: "1px solid var(--ash)",
          }}
        >
          {snapshotProjects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.06}>
              <div
                style={{
                  background: "var(--char)",
                  padding: "var(--s-6)",
                  aspectRatio: "4/3",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "background 180ms var(--ease-eerie)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--shroud)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--char)";
                }}
              >
                {/* Placeholder label */}
                <div
                  className="t-meta"
                  style={{ color: "var(--fog)", fontStyle: "normal" }}
                >
                  {p.year}
                </div>

                <div>
                  {p.note && (
                    <div
                      className="t-meta"
                      style={{ color: "var(--signal)", marginBottom: "var(--s-2)" }}
                    >
                      {p.note}
                    </div>
                  )}
                  <h3
                    className="t-h2"
                    style={{ color: "var(--veil)", marginBottom: "var(--s-2)" }}
                  >
                    {p.title}
                  </h3>
                  <span className="pill">{p.category}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
