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

        {/* Showreel — centred, constrained, auto-plays as GIF */}
        <ScrollReveal delay={0.08}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "640px",
                border: "1px solid var(--ash)",
                overflow: "hidden",
                background: "var(--char)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SHOWREEL_GIF}
                alt="Làjà — Design showreel, selected product work 2019–2025"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
                loading="lazy"
              />
              {/* Subtle void overlay on bottom edge to ground it */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "80px",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(8,9,11,0.5))",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Caption */}
        <ScrollReveal delay={0.14}>
          <p
            className="t-meta"
            style={{
              color: "var(--fog)",
              textAlign: "center",
              marginTop: "var(--s-4)",
            }}
          >
            Fintech · SaaS · E-commerce · Sports · Energy
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
