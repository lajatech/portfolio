import ScrollReveal from "@/components/ui/ScrollReveal";

const testimonials = [
  {
    quote:
      "Working with Laja was seamless and inspiring. His work elevated our brand. Gave him a tip and will definitely come back for more projects.",
    name: "Blessing Edet",
    role: "Manager",
    company: "Neo Cash",
  },
  {
    quote:
      "Muiz (Laja) is our design architect and for real, he's a guru at it.",
    name: "Mac Nwachukwu",
    role: "CEO",
    company: "Estility Ltd",
  },
  {
    quote:
      "Muiz is highly talented and I'm super proud I get to work with him.",
    name: "Adedayo Charis",
    role: "CEO",
    company: "Volta Charger",
  },
  {
    quote:
      "Professional, creative, and reliable — he delivered a product that made a huge impact.",
    name: "Abel Tayo",
    role: "COO",
    company: "Proven",
  },
];

export default function Testimonials() {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderTop: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        {/* Header */}
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-9)" }}
          >
            What clients say
          </span>
        </ScrollReveal>

        {/* Testimonials — two-column on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
            gap: "0",
          }}
        >
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <blockquote
                style={{
                  padding: "var(--s-7)",
                  borderBottom: i < testimonials.length - 1 ? "1px solid var(--ash)" : "none",
                  borderRight: i % 2 === 0 ? "1px solid var(--ash)" : "none",
                  margin: 0,
                }}
              >
                {/* Quote mark */}
                <div
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontStyle: "italic",
                    fontSize: "64px",
                    color: "var(--ash)",
                    lineHeight: 0.8,
                    marginBottom: "var(--s-4)",
                    userSelect: "none",
                  }}
                >
                  "
                </div>
                <p
                  className="t-quote"
                  style={{
                    color: "var(--veil)",
                    marginBottom: "var(--s-5)",
                    fontSize: "clamp(18px, 2.5vw, 28px)",
                  }}
                >
                  {t.quote}
                </p>
                <footer>
                  <div
                    className="t-body"
                    style={{ color: "var(--bone)", fontWeight: 500 }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="t-meta"
                    style={{ color: "var(--mist)", marginTop: "4px" }}
                  >
                    {t.role} · {t.company}
                  </div>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
