"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const SHOWREEL_GIF = "https://framerusercontent.com/images/6tP1geDhKCyjmQlj89SqjzCuZfo.gif";

export default function ShowreelSection() {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderTop: "1px solid var(--ash)",
        borderBottom: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        {/* Label row */}
        <ScrollReveal>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: "var(--s-7)" }}
          >
            <span className="t-meta" style={{ color: "var(--mist)" }}>
              Design showreel
            </span>
            <span className="t-meta" style={{ color: "var(--fog)" }}>
              Selected work · 2019–2025
            </span>
          </div>
        </ScrollReveal>

        {/* Showreel — landscape crop hides watermark, grain reduces distraction */}
        <ScrollReveal delay={0.08}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="grain"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "720px",
                aspectRatio: "4/3",   /* landscape crop — square GIF, top portion shown */
                overflow: "hidden",
                border: "1px solid var(--ash)",
                background: "var(--char)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SHOWREEL_GIF}
                alt="Làjà — Design showreel, selected product work 2019–2025"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
                loading="lazy"
              />
              {/* Bottom edge fade to mask any residual branding */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "60px",
                  background: "linear-gradient(to bottom, transparent, var(--void))",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Caption */}
        <ScrollReveal delay={0.14}>
          <p
            className="t-meta"
            style={{ color: "var(--fog)", textAlign: "center", marginTop: "var(--s-4)" }}
          >
            Fintech · SaaS · E-commerce · Sports · Energy
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
