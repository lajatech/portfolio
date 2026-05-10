import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

export default function ScreensGallery({ cs }: { cs: CaseStudy }) {
  const placeholders =
    cs.type === "mini"
      ? [
          { label: "Platform overview", aspect: "16/9" },
          { label: "Design system", aspect: "4/3" },
          { label: "Email Automation tool", aspect: "4/3" },
        ]
      : [
          { label: "Key screen — before", aspect: "9/19" },
          { label: "Key screen — after", aspect: "9/19" },
          { label: "Component detail", aspect: "16/9" },
          { label: "Full flow overview", aspect: "16/9" },
        ];

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

        {/* Note about placeholders */}
        <ScrollReveal delay={0.05}>
          <p
            className="t-body-sm"
            style={{
              color: "var(--fog)",
              marginBottom: "var(--s-7)",
              fontFamily: "var(--font-mono)",
            }}
          >
            — Imagery pending. Provide design assets to populate these slots.
          </p>
        </ScrollReveal>

        {/* Placeholder grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cs.type === "mini" ? "1fr" : "repeat(2, 1fr)",
            gap: "var(--s-4)",
          }}
        >
          {placeholders.map((p, i) => (
            <ScrollReveal key={p.label} delay={i * 0.08}>
              <div
                style={{
                  aspectRatio: p.aspect,
                  background: "var(--char)",
                  border: "1px solid var(--ash)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--s-3)",
                  gridColumn: i === 0 && cs.type !== "mini" ? "1 / -1" : "auto",
                }}
              >
                <div
                  className="t-meta"
                  style={{ color: "var(--mist)", textAlign: "center" }}
                >
                  {cs.title}
                </div>
                <div
                  className="t-meta"
                  style={{ color: "var(--fog)", textAlign: "center" }}
                >
                  {p.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
