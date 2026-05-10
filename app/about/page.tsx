import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { careerTimeline } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Làjà",
  description:
    "Abdulmuiz Adelaja (Làjà) — Senior Product Designer. Statistics degree, 6+ years, outcomes-driven design from Lagos to the world.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section
          className="grain"
          style={{
            background: "var(--void)",
            paddingTop: "140px",
            paddingBottom: "var(--s-10)",
            borderBottom: "1px solid var(--ash)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "30%",
              right: "5%",
              width: "500px",
              height: "400px",
              background: "var(--signal-deep)",
              borderRadius: "50%",
              filter: "blur(150px)",
              opacity: 0.12,
              pointerEvents: "none",
            }}
          />

          <div className="container-wide relative" style={{ zIndex: 2 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--s-9)",
                alignItems: "start",
              }}
              className="flex flex-col lg:grid"
            >
              {/* Left — text */}
              <div>
                <span
                  className="t-meta"
                  style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
                >
                  About
                </span>
                <h1
                  className="t-display-lg"
                  style={{
                    color: "var(--veil)",
                    marginBottom: "var(--s-4)",
                  }}
                >
                  Abdulmuiz
                </h1>
                <div
                  className="t-editorial-lg"
                  style={{
                    color: "var(--mist)",
                    fontSize: "clamp(32px, 5vw, 72px)",
                    marginBottom: "var(--s-7)",
                  }}
                >
                  Adelaja.
                </div>
                <p
                  className="t-body-lg"
                  style={{ color: "var(--bone)", maxWidth: "480px", marginBottom: "var(--s-5)" }}
                >
                  Senior Product Designer and UX Lead. I trace every design decision to a
                  business outcome — conversion, retention, revenue. Not as a methodology.
                  As a reflex.
                </p>
                <p
                  className="t-body-lg"
                  style={{ color: "var(--bone)", maxWidth: "480px" }}
                >
                  This started with a Statistics degree from FUTA in 2021. The numbers
                  habit never left — it just moved from regression tables to design systems
                  and KPI dashboards. Six years and 80+ projects later, the approach is the
                  same: form a hypothesis, design the intervention, measure what moves.
                </p>
              </div>

              {/* Right — photo */}
              <div>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "2/3",
                    border: "1px solid var(--ash)",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/images/abdulmuiz.jpg"
                    alt="Abdulmuiz Adelaja — Senior Product Designer"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter: "grayscale(100%) contrast(1.05)",
                    }}
                    priority
                  />
                  {/* void overlay so it reads as part of the dark canvas */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, transparent 60%, var(--void) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          style={{
            background: "var(--char)",
            borderBottom: "1px solid var(--ash)",
            padding: "var(--s-9) 0",
          }}
        >
          <div className="container-wide">
            <div
              className="flex flex-wrap"
              style={{ gap: "0" }}
            >
              {[
                { value: "6+", label: "Years of experience" },
                { value: "80+", label: "Projects delivered" },
                { value: "98%", label: "Client satisfaction" },
                { value: "2021", label: "BSc Statistics, FUTA" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.08}>
                  <div
                    style={{
                      padding: "var(--s-7) var(--s-7)",
                      borderRight: i < 3 ? "1px solid var(--ash)" : "none",
                    }}
                  >
                    <div
                      className="t-display-sm"
                      style={{ color: "var(--veil)", marginBottom: "var(--s-2)", lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div className="t-meta" style={{ color: "var(--mist)" }}>
                      {stat.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section
          style={{
            background: "var(--void)",
            padding: "var(--s-10) 0",
            borderBottom: "1px solid var(--ash)",
          }}
        >
          <div className="container-wide">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "var(--s-9)",
              }}
              className="flex flex-col lg:grid"
            >
              <ScrollReveal>
                <span className="t-meta" style={{ color: "var(--mist)" }}>
                  How I work
                </span>
              </ScrollReveal>

              <div>
                {[
                  {
                    heading: "Design is a hypothesis.",
                    body: "Every design decision is a bet — I trace where that bet is, what it's predicting, and how we'll know if it lands. A/B testing, conversion tracking, retention curves. The design process and the measurement process are the same process.",
                  },
                  {
                    heading: "The brief is a starting point, not a ceiling.",
                    body: "Clients come with a brief. I arrive with questions. What does success look like in a number? Who is actually using this, and what do they already believe? What would a skeptic say? The answers reshape the work before a pixel is placed.",
                  },
                  {
                    heading: "Systems before screens.",
                    body: "A beautiful screen in a broken system is decoration. I start with the design system — tokens, components, patterns — because that's what makes everything else scalable, consistent, and maintainable at pace.",
                  },
                ].map((item, i) => (
                  <ScrollReveal key={item.heading} delay={i * 0.1}>
                    <div
                      style={{
                        paddingBottom: "var(--s-7)",
                        marginBottom: "var(--s-7)",
                        borderBottom: i < 2 ? "1px solid var(--ash)" : "none",
                      }}
                    >
                      <h3
                        className="t-h2"
                        style={{ color: "var(--veil)", marginBottom: "var(--s-4)" }}
                      >
                        {item.heading}
                      </h3>
                      <p className="t-body-lg" style={{ color: "var(--bone)", maxWidth: "560px" }}>
                        {item.body}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Career Timeline */}
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
                Career timeline
              </span>
            </ScrollReveal>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {careerTimeline.map((item, i) => (
                <ScrollReveal key={`${item.company}-${item.period}`} delay={i * 0.06}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "var(--s-6)",
                      padding: "var(--s-5) 0",
                      borderBottom: i < careerTimeline.length - 1 ? "1px solid var(--ash)" : "none",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <span className="t-meta" style={{ color: "var(--fog)" }}>
                        {item.period}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center" style={{ gap: "var(--s-3)", marginBottom: "4px" }}>
                        <span
                          className="t-body"
                          style={{ color: "var(--veil)", fontWeight: 500 }}
                        >
                          {item.company}
                        </span>
                        {item.current && (
                          <span className="pill pill-signal">Now</span>
                        )}
                      </div>
                      <div className="t-body-sm" style={{ color: "var(--bone)" }}>
                        {item.role}
                      </div>
                      <div className="t-meta" style={{ color: "var(--fog)", marginTop: "4px" }}>
                        {item.location}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section
          style={{
            background: "var(--void)",
            padding: "var(--s-10) 0",
            borderBottom: "1px solid var(--ash)",
          }}
        >
          <div className="container-wide">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--s-9)",
              }}
              className="flex flex-col lg:grid"
            >
              {/* Education */}
              <ScrollReveal>
                <div>
                  <span
                    className="t-meta"
                    style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
                  >
                    Education
                  </span>
                  <div style={{ borderTop: "1px solid var(--ash)", paddingTop: "var(--s-5)" }}>
                    <div
                      className="t-body"
                      style={{ color: "var(--veil)", fontWeight: 500, marginBottom: "4px" }}
                    >
                      BTech — Statistics
                    </div>
                    <div className="t-body-sm" style={{ color: "var(--bone)" }}>
                      Federal University of Technology Akure
                    </div>
                    <div className="t-meta" style={{ color: "var(--fog)", marginTop: "4px" }}>
                      2021
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Awards */}
              <ScrollReveal delay={0.1}>
                <div>
                  <span
                    className="t-meta"
                    style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
                  >
                    Awards & recognition
                  </span>
                  <div style={{ borderTop: "1px solid var(--ash)", paddingTop: "var(--s-5)" }}>
                    <div
                      className="t-body"
                      style={{ color: "var(--veil)", fontWeight: 500, marginBottom: "4px" }}
                    >
                      Outstanding Performance Award
                    </div>
                    <div className="t-body-sm" style={{ color: "var(--bone)" }}>
                      Estility Ltd
                    </div>
                    <div className="t-meta" style={{ color: "var(--fog)", marginTop: "4px" }}>
                      May 2025
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Skills */}
              <ScrollReveal delay={0.12}>
                <div>
                  <span
                    className="t-meta"
                    style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
                  >
                    Capabilities
                  </span>
                  <div style={{ borderTop: "1px solid var(--ash)", paddingTop: "var(--s-5)" }}>
                    {[
                      "Product design — end to end",
                      "UX research + usability testing",
                      "Design systems from scratch",
                      "Conversational UX",
                      "A/B testing + conversion optimisation",
                      "Stakeholder facilitation",
                      "Design team leadership",
                      "Figma, Framer, Webflow",
                      "AI-assisted design workflow (Cursor, Claude Code)",
                    ].map((skill, i) => (
                      <div
                        key={skill}
                        style={{
                          padding: "var(--s-3) 0",
                          borderBottom: i < 8 ? "1px solid var(--ash)" : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--s-3)",
                        }}
                      >
                        <span
                          style={{ color: "var(--signal)", fontSize: "8px" }}
                        >
                          •
                        </span>
                        <span className="t-body-sm" style={{ color: "var(--bone)" }}>
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Mentoring */}
              <ScrollReveal delay={0.14}>
                <div>
                  <span
                    className="t-meta"
                    style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
                  >
                    Mentoring
                  </span>
                  <div style={{ borderTop: "1px solid var(--ash)", paddingTop: "var(--s-5)" }}>
                    <div
                      className="t-body"
                      style={{ color: "var(--veil)", fontWeight: 500, marginBottom: "4px" }}
                    >
                      ADPList
                    </div>
                    <div className="t-body-sm" style={{ color: "var(--bone)" }}>
                      Mentoring emerging designers across Africa and globally.
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "var(--char)",
            padding: "var(--s-9) 0",
          }}
        >
          <div className="container-wide">
            <ScrollReveal>
              <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between"
                style={{ gap: "var(--s-5)" }}
              >
                <div>
                  <p
                    className="t-display-sm"
                    style={{ color: "var(--veil)", marginBottom: "var(--s-2)" }}
                  >
                    Currently open.
                  </p>
                  <p className="t-body" style={{ color: "var(--bone)" }}>
                    Select projects, fractional engagement, and design advisory.
                  </p>
                </div>
                <a
                  href="mailto:abdulmuizadelaja@gmail.com"
                  className="btn-primary"
                  style={{ flexShrink: 0 }}
                >
                  Get in touch →
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
