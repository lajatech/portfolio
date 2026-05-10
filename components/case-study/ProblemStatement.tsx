import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

export default function ProblemStatement({ cs }: { cs: CaseStudy }) {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderBottom: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        <div className="resp-split">
          <ScrollReveal>
            <span className="t-meta" style={{ color: "var(--mist)" }}>
              The problem
            </span>
          </ScrollReveal>

          <div>
            <ScrollReveal delay={0.08}>
              <p
                className="t-display-sm"
                style={{ color: "var(--veil)", marginBottom: "var(--s-6)" }}
              >
                {cs.problem}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p
                className="t-body-lg"
                style={{ color: "var(--bone)", maxWidth: "640px" }}
              >
                {cs.problemDetail}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
