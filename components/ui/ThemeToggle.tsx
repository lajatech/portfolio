"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current =
      (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(current);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("laja-theme")) {
        const next = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        setTheme(next);
      }
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("laja-theme", next);
    setTheme(next);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="t-meta"
      style={{
        background: "none",
        border: "1px solid var(--ash)",
        color: "var(--mist)",
        cursor: "pointer",
        padding: "5px 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        lineHeight: 1,
        flexShrink: 0,
        transition: "color var(--dur-fast), border-color var(--dur-fast)",
      }}
    >
      {theme === "dark" ? (
        <>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="5.5" y1="0" x2="5.5" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="5.5" y1="9" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="0" y1="5.5" x2="2" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="9" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1.58" y1="1.58" x2="2.99" y2="2.99" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8.01" y1="8.01" x2="9.42" y2="9.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="9.42" y1="1.58" x2="8.01" y2="2.99" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="2.99" y1="8.01" x2="1.58" y2="9.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Light
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path
              d="M9.5 6.5A5 5 0 1 1 4.5 1.5a3.5 3.5 0 0 0 5 5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          Dark
        </>
      )}
    </button>
  );
}
