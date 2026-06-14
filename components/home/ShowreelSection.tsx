"use client";

import { useEffect, useRef } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ShowreelSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: { destroy(): void } | null = null;

    import("lottie-web").then((mod) => {
      const lottie = mod.default;
      if (!containerRef.current) return;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/showreel.json",
      });
    });

    return () => { anim?.destroy(); };
  }, []);

  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-10) 0",
        borderTop: "1px solid var(--ash)",
        borderBottom: "1px solid var(--ash)",
      }}
    >
      {/* Label row */}
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

      {/* Full-width Lottie with seamless edge gradients */}
      <ScrollReveal delay={0.08}>
        <div
          className="grain"
          style={{ position: "relative", width: "100%", overflow: "hidden", background: "var(--void)" }}
        >
          <div ref={containerRef} style={{ width: "100%", display: "block" }} />

          {/* Left edge fade */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0,
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
              top: 0, right: 0, bottom: 0,
              width: "18%",
              background: "linear-gradient(to left, var(--void), transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Bottom edge fade */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "80px",
              background: "linear-gradient(to bottom, transparent, var(--void))",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </ScrollReveal>

      {/* Caption */}
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
