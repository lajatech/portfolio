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
      {/* Label row stays in container */}
      <div className="container-wide">
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
      </div>

      {/* Full-width showreel with edge gradients */}
      <ScrollReveal delay={0.08}>
        <div
          className="grain"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            overflow: "hidden",
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

          {/* Left edge fade */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "18%",
              background: "linear-gradient(to right, var(--void), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Right edge fade */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "18%",
              background: "linear-gradient(to left, var(--void), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Bottom edge fade to mask residual branding */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, transparent, var(--void))",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </ScrollReveal>

      {/* Caption stays in container */}
      <div className="container-wide">
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
