"use client";

import { useState, useRef } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────────────────────────────────
   Replace EMBED_URL with your jitter.video (or Vimeo) embed link.
   Jitter format: https://app.jitter.video/embed/<VIDEO_ID>/
   Vimeo format:  https://player.vimeo.com/video/<VIDEO_ID>?autoplay=1
───────────────────────────────────────────────────────────────────── */
const EMBED_URL = "";

export default function ShowreelSection() {
  const [playing, setPlaying] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  if (!EMBED_URL) return null;

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

        {/* Video container */}
        <ScrollReveal delay={0.08}>
          <div
            style={{
              position: "relative",
              aspectRatio: "16/9",
              background: "var(--char)",
              border: "1px solid var(--ash)",
              overflow: "hidden",
            }}
          >
            {playing ? (
              <iframe
                src={`${EMBED_URL}?autoplay=1`}
                title="Làjà — Design Showreel"
                allow="autoplay; fullscreen"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              /* Play button overlay */
              <div
                ref={overlayRef}
                role="button"
                tabIndex={0}
                aria-label="Play showreel"
                onClick={() => setPlaying(true)}
                onKeyDown={(e) => e.key === "Enter" && setPlaying(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--s-5)",
                  cursor: "pointer",
                }}
              >
                {/* Subtle ambient glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(58,124,181,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Play circle */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: "1px solid var(--ash)",
                    background: "rgba(8,9,11,0.6)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 200ms, transform 200ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--signal)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--ash)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  {/* Triangle play icon */}
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    style={{ marginLeft: 3 }}
                  >
                    <path d="M1 1L17 10L1 19V1Z" fill="var(--veil)" />
                  </svg>
                </div>

                <span className="t-meta" style={{ color: "var(--fog)" }}>
                  Play showreel
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
