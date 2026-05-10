import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

export default function ProcessSection({ cs }: { cs: CaseStudy }) {
  return (
    <section
      style={{
        background: "var(--shroud)",
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
            The process
          </span>
        </ScrollReveal>

        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          {cs.process.map((step, i) => (
            <ScrollReveal key={step.heading} delay={i * 0.1}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "var(--s-6)",
                  paddingBottom: "var(--s-7)",
                  marginBottom: "var(--s-7)",
                  borderBottom: i < cs.process.length - 1 ? "1px solid var(--ash)" : "none",
                  alignItems: "start",
                }}
              >
                {/* Step number */}
                <div
                  className="t-meta"
                  style={{
                    color: "var(--signal)",
                    paddingTop: "6px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div>
                  <h3
                    className="t-h2"
                    style={{
                      color: "var(--veil)",
                      marginBottom: "var(--s-4)",
                    }}
                  >
                    {step.heading}
                  </h3>
                  <p
                    className="t-body-lg"
                    style={{
                      color: "var(--bone)",
                      maxWidth: "680px",
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
