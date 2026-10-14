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
      "Professional, creative, and reliable. He delivered a product that made a huge impact.",
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
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
        }
        .testimonial-card {
          padding: var(--s-7);
          margin: 0;
        }
        .testimonial-card:nth-child(odd)  { border-right: 1px solid var(--ash); }
        .testimonial-card:nth-child(1),
        .testimonial-card:nth-child(2)    { border-bottom: 1px solid var(--ash); }
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .testimonial-card:nth-child(odd)  { border-right: none; }
          .testimonial-card:not(:last-child) { border-bottom: 1px solid var(--ash); }
        }
      `}</style>

      <div className="container-wide">
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-9)" }}
          >
            What clients say
          </span>
        </ScrollReveal>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <blockquote className="testimonial-card">
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
                  &ldquo;
                </div>
                <p
                  className="t-quote"
                  style={{
                    color: "var(--veil)",
                    marginBottom: "var(--s-5)",
                    fontSize: "clamp(16px, 2vw, 24px)",
                  }}
                >
                  {t.quote}
                </p>
                <footer>
                  <div className="t-body" style={{ color: "var(--bone)", fontWeight: 500 }}>
                    {t.name}
                  </div>
                  <div className="t-meta" style={{ color: "var(--mist)", marginTop: "4px" }}>
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
