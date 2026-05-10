import ScrollReveal from "@/components/ui/ScrollReveal";
import MetricCounter from "@/components/ui/MetricCounter";
import type { CaseStudy } from "@/lib/data";

export default function ResultsSection({ cs }: { cs: CaseStudy }) {
  return (
    <section
      className="grain"
      style={{
        background: "var(--char)",
        padding: "var(--s-10) 0",
        borderBottom: "1px solid var(--ash)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0",
          left: "20%",
          width: "600px",
          height: "300px",
          background: "var(--signal-deep)",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <div className="container-wide relative" style={{ zIndex: 2 }}>
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-9)" }}
          >
            Results
          </span>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(cs.results.length, 3)}, 1fr)`,
            gap: "0",
          }}
        >
          {cs.results.map((r, i) => (
            <ScrollReveal key={r.label} delay={i * 0.1}>
              <div
                style={{
                  padding: "var(--s-7) var(--s-6)",
                  borderRight: i < cs.results.length - 1 ? "1px solid var(--ash)" : "none",
                }}
              >
                <div
                  className="t-display-lg"
                  style={{ color: "var(--veil)", marginBottom: "var(--s-3)", lineHeight: 1 }}
                >
                  <MetricCounter value={r.value} />
                </div>
                <div
                  className="t-body"
                  style={{ color: "var(--bone)" }}
                >
                  {r.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
