import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

export default function TestimonialBlock({ cs }: { cs: CaseStudy }) {
  if (!cs.testimonial) return null;

  const { quote, name, role, company } = cs.testimonial;

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
          <blockquote
            style={{
              margin: 0,
              maxWidth: "800px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                fontSize: "80px",
                color: "var(--ash)",
                lineHeight: 0.8,
                marginBottom: "var(--s-5)",
                userSelect: "none",
              }}
            >
              "
            </div>
            <p
              className="t-quote"
              style={{
                color: "var(--veil)",
                marginBottom: "var(--s-6)",
                fontSize: "clamp(22px, 3vw, 36px)",
              }}
            >
              {quote}
            </p>
            <footer
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--s-4)",
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  background: "var(--signal)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div className="t-body" style={{ color: "var(--bone)", fontWeight: 500 }}>
                  {name}
                </div>
                <div className="t-meta" style={{ color: "var(--mist)", marginTop: "4px" }}>
                  {role} · {company}
                </div>
              </div>
            </footer>
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  );
}
