"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const roles = [
  "product designer.",
  "ux lead.",
  "design systems architect.",
  "conversion specialist.",
];

function useTypewriter(
  words: string[],
  typeSpeed = 72,
  deleteSpeed = 38,
  pauseMs = 2200,
) {
  const [display, setDisplay] = useState(words[0]);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"pause" | "deleting" | "typing">("pause");

  useEffect(() => {
    const word = words[wordIdx % words.length];

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), pauseMs);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (display.length === 0) {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase("typing");
        return;
      }
      const t = setTimeout(
        () => setDisplay((d) => d.slice(0, -1)),
        deleteSpeed,
      );
      return () => clearTimeout(t);
    }
    if (phase === "typing") {
      const target = words[wordIdx % words.length];
      if (display.length === target.length) {
        setPhase("pause");
        return;
      }
      const t = setTimeout(
        () => setDisplay(target.slice(0, display.length + 1)),
        typeSpeed,
      );
      return () => clearTimeout(t);
    }
  }, [display, phase, wordIdx, words, typeSpeed, deleteSpeed, pauseMs]);

  return display;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const role = useTypewriter(roles);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

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
          <span className="pill" style={{ borderColor: "var(--ash)", color: "var(--bone)" }}>
            Available for select projects
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div style={{ y: titleY, maxWidth: "1100px" }}>
          <motion.h1
            className="t-display-xl"
            style={{ color: "var(--veil)", marginBottom: "0.08em", lineHeight: 0.92 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.2, ease }}
          >
            Senior
          </motion.h1>

          {/* Typewriter role line — width reserved by invisible longest-role ghost */}
          <motion.div
            className="hero-role-wrap"
            style={{
              marginBottom: "var(--s-7)",
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.35, ease }}
          >
            {/* Width reservation ghost — invisible, locks container to longest role */}
            <span
              aria-hidden="true"
              className="t-editorial-xl hero-role-text"
              style={{
                visibility: "hidden",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              design systems architect.
            </span>
            {/* Live animated text overlaid on top */}
            <span
              className="t-editorial-xl hero-role-text"
              style={{
                color: "var(--mist)",
                display: "inline-flex",
                alignItems: "baseline",
                whiteSpace: "nowrap",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {role}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "0.75em",
                  background: "var(--bone)",
                  marginLeft: "2px",
                  animation: "cursor-blink 1.1s step-end infinite",
                }}
              />
            </span>
          </motion.div>
        </motion.div>

        {/* Sub-line */}
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
          Outcomes-driven design. Every decision traced to a number: conversion,
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
          <a href="mailto:abdulmuizadelaja@gmail.com" className="btn-secondary">
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

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        /* 80% of t-editorial-xl: clamp(64px,12vw,168px) → clamp(51px,9.6vw,134px) */
        .hero-role-text {
          font-size: clamp(51px, 9.6vw, 134px) !important;
          line-height: 0.92 !important;
        }
        /* Desktop: fixed height = 0.92 × max font-size */
        @media (min-width: 641px) {
          .hero-role-wrap { height: clamp(47px, 8.8vw, 123px); }
        }
        /* Mobile: allow wrap, smaller font so longest role stays on-screen */
        @media (max-width: 640px) {
          .hero-role-text {
            font-size: clamp(22px, 6vw, 42px) !important;
            white-space: normal !important;
            line-height: 1.15 !important;
          }
          .hero-role-wrap { min-height: 30px; }
        }
      `}</style>
    </section>
  );
}
