import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  return (
    <section
      className="grain"
      style={{
        background: "var(--char)",
        padding: "var(--s-10) 0",
        borderTop: "1px solid var(--ash)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div className="container-wide relative" style={{ zIndex: 2, textAlign: "center" }}>
        <ScrollReveal>
          <span
            className="t-meta"
            style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
          >
            Let's work together
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2
            className="t-display-md"
            style={{
              color: "var(--veil)",
              marginBottom: "var(--s-4)",
              maxWidth: "760px",
              marginInline: "auto",
            }}
          >
            Let's build something
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.18}>
          <p
            className="t-editorial-md"
            style={{
              color: "var(--mist)",
              marginBottom: "var(--s-8)",
              fontSize: "clamp(24px, 4vw, 52px)",
            }}
          >
            that outlasts the brief.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.26}>
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: "var(--s-4)" }}
          >
            <a
              href="mailto:abdulmuizadelaja@gmail.com"
              className="btn-primary"
              style={{ fontSize: "15px", padding: "14px 28px" }}
            >
              abdulmuizadelaja@gmail.com ↗
            </a>
            <a
              href="https://linkedin.com/in/abdulmuiz-adelaja"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: "15px", padding: "14px 28px" }}
            >
              LinkedIn ↗
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.36}>
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: "var(--s-6)", marginTop: "var(--s-9)" }}
          >
            {[
              { href: "https://x.com/lajanumba", label: "X · @lajanumba" },
              { href: "https://instagram.com/lajanumba", label: "Instagram · @lajanumba" },
              { href: "https://behance.net/adelajaabdulmu", label: "Behance" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-meta link-signal"
                style={{ color: "var(--mist)" }}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
