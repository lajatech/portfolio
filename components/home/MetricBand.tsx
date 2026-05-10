"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import MetricCounter from "@/components/ui/MetricCounter";

const metrics = [
  { value: "+1050%", label: "Loan completion", context: "NeoCash" },
  { value: "640%", label: "Order value growth", context: "Volta Charger" },
  { value: "-50%", label: "Churn reduction", context: "Workergen" },
  { value: "+150%", label: "Kickstarter revenue beyond target", context: "Volta Charger" },
  { value: "+30%", label: "Conversion uplift", context: "Workergen" },
  { value: "19%", label: "More leads closed", context: "Estility" },
];

export default function MetricBand() {
  return (
    <section
      style={{
        background: "var(--shroud)",
        borderTop: "1px solid var(--ash)",
        borderBottom: "1px solid var(--ash)",
        padding: "var(--s-10) 0",
        position: "relative",
        overflow: "hidden",
      }}
      className="grain"
    >
      <div className="container-wide">
        {/* Header */}
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-9)" }}
          >
            Impact, measured
          </span>
        </ScrollReveal>

        {/* Metrics grid */}
        <style>{`
          .metric-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }
          .metric-cell {
            padding: var(--s-7) var(--s-6);
            min-width: 0;
          }
          .metric-cell:not(:nth-child(3n)) { border-right: 1px solid var(--ash); }
          .metric-cell:nth-child(-n+3)     { border-bottom: 1px solid var(--ash); }
          @media (max-width: 768px) {
            .metric-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .metric-cell:not(:nth-child(3n)) { border-right: none; }
            .metric-cell:not(:nth-child(2n)) { border-right: 1px solid var(--ash); }
            .metric-cell:nth-child(-n+3)     { border-bottom: none; }
            .metric-cell:nth-child(-n+4)     { border-bottom: 1px solid var(--ash); }
          }
          @media (max-width: 480px) {
            .metric-grid { grid-template-columns: 1fr !important; }
            .metric-cell { border-right: none !important; border-bottom: 1px solid var(--ash) !important; }
            .metric-cell:last-child { border-bottom: none !important; }
          }
        `}</style>
        <div className="metric-grid">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 0.06}>
              <div className="metric-cell">
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 4vw, 76px)",
                    color: "var(--veil)",
                    marginBottom: "var(--s-2)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    overflow: "hidden",
                  }}
                >
                  <MetricCounter value={m.value} />
                </div>
                <div
                  className="t-body"
                  style={{ color: "var(--bone)", marginBottom: "4px" }}
                >
                  {m.label}
                </div>
                <div
                  className="t-meta"
                  style={{ color: "var(--signal)" }}
                >
                  {m.context}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Summary stats */}
        <ScrollReveal delay={0.4}>
          <div
            className="flex flex-wrap items-center justify-center"
            style={{
              gap: "var(--s-9)",
              marginTop: "var(--s-9)",
              paddingTop: "var(--s-7)",
              borderTop: "1px solid var(--ash)",
            }}
          >
            {[
              { value: "80+", label: "Projects delivered" },
              { value: "6+", label: "Years experience" },
              { value: "98%", label: "Client satisfaction" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  className="t-display-md"
                  style={{ color: "var(--veil)", lineHeight: 1 }}
                >
                  <MetricCounter value={stat.value} />
                </div>
                <div
                  className="t-meta"
                  style={{ color: "var(--mist)", marginTop: "var(--s-2)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
