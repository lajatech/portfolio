"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgGlowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative grain"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: "var(--s-10)",
        paddingTop: "120px",
        background: "var(--void)",
        overflow: "hidden",
      }}
    >
      {/* Parallax ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "700px",
          height: "700px",
          background: "var(--signal-deep)",
          borderRadius: "50%",
          filter: "blur(200px)",
          opacity: 0.18,
          pointerEvents: "none",
          y: bgGlowY,
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "var(--sh-vignette)", zIndex: 0 }}
      />

      <div className="container-wide relative" style={{ zIndex: 2 }}>
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.1, ease }}
          style={{ marginBottom: "var(--s-7)" }}
        >
          <span className="pill pill-signal">
            Available for select projects
          </span>
        </motion.div>

        {/* Main heading — parallax */}
        <motion.div style={{ y: titleY, maxWidth: "1100px" }}>
          <motion.h1
            className="t-display-xl"
            style={{ color: "var(--veil)", marginBottom: "0.1em", lineHeight: 0.92 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.2, ease }}
          >
            Senior
          </motion.h1>
          <motion.div
            className="t-editorial-xl"
            style={{ color: "var(--mist)", marginBottom: "var(--s-7)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.35, ease }}
          >
            product designer.
          </motion.div>
        </motion.div>

        {/* Sub-line — parallax at slower rate */}
        <motion.p
          className="t-body-lg"
          style={{
            color: "var(--bone)",
            maxWidth: "480px",
            marginBottom: "var(--s-7)",
            y: subtitleY,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.5, ease }}
        >
          Outcomes-driven design. Every decision traced to a number — conversion,
          retention, revenue. Currently leading at Volta Charger, Gold Coast.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex items-center flex-wrap"
          style={{ gap: "var(--s-4)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.62, ease }}
        >
          <Link href="/work" className="btn-primary">
            View work →
          </Link>
          <a
            href="mailto:abdulmuizadelaja@gmail.com"
            className="btn-secondary"
          >
            abdulmuizadelaja@gmail.com
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="t-meta"
          style={{
            color: "var(--fog)",
            marginTop: "var(--s-10)",
            display: "flex",
            alignItems: "center",
            gap: "var(--s-3)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.62, delay: 1.0, ease }}
        >
          <span>6+ years · 80+ projects · 98% satisfaction</span>
        </motion.div>
      </div>
    </section>
  );
}
