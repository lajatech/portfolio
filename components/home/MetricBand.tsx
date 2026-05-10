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
            Impact — measured
          </span>
        </ScrollReveal>

        {/* Metrics grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
          }}
        >
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 0.06}>
              <div
                style={{
                  padding: "var(--s-7) var(--s-6)",
                  borderRight: i % 3 !== 2 ? "1px solid var(--ash)" : "none",
                  borderBottom: i < 3 ? "1px solid var(--ash)" : "none",
                }}
              >
                <div
                  className="t-display-lg"
                  style={{ color: "var(--veil)", marginBottom: "var(--s-2)", lineHeight: 1 }}
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
