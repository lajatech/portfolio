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
            More work
          </span>
        </ScrollReveal>

        <style>{`
          .snapshot-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: var(--ash);
            border: 1px solid var(--ash);
          }
          @media (max-width: 768px) {
            .snapshot-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 480px) {
            .snapshot-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="snapshot-grid">
          {snapshotProjects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.06}>
              <div
                style={{
                  background: "var(--char)",
                  aspectRatio: "4/3",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
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
                {/* Snapshot image */}
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                )}

                {/* Gradient scrim so text is always readable */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: p.image
                      ? "linear-gradient(to bottom, transparent 30%, rgba(14,14,14,0.85) 100%)"
                      : "none",
                    pointerEvents: "none",
                  }}
                />

                {/* Year — top left */}
                <div
                  className="t-meta"
                  style={{
                    color: p.image ? "rgba(255,255,255,0.6)" : "var(--fog)",
                    position: "relative",
                    zIndex: 2,
                    padding: "var(--s-5) var(--s-5) 0",
                  }}
                >
                  {p.year}
                </div>

                {/* Title + category — bottom */}
                <div style={{ position: "relative", zIndex: 2, padding: "0 var(--s-5) var(--s-5)" }}>
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
