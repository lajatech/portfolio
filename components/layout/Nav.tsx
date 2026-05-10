"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        background: scrolled ? "var(--void-60)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--ash)" : "none",
      }}
    >
      <div
        className="container-wide flex items-center justify-between"
        style={{ paddingBlock: "18px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Làjà — home"
        >
          {/* Brand mark squircle */}
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--veil)",
              borderRadius: "var(--r-mark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 419 173"
              width="18"
              height="7"
              aria-hidden="true"
              style={{ fill: "var(--void)", display: "block" }}
            >
              <text
                x="0"
                y="140"
                fontFamily="Special Gothic Expanded One, Archivo Black, sans-serif"
                fontSize="160"
                fill="var(--void)"
              >
                Là
              </text>
            </svg>
          </div>
          {/* Wordmark */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              color: "var(--veil)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            Làjà
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center" style={{ gap: "var(--s-7)" }}>
          {[
            { href: "/work", label: "Work" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="t-meta link-signal"
              style={{
                color: isActive(href) ? "var(--signal)" : "var(--bone)",
                transition: "color 180ms var(--ease-eerie)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="mailto:abdulmuizadelaja@gmail.com"
          className="t-meta"
          style={{
            color: "var(--bone)",
            padding: "8px 16px",
            border: "1px solid var(--ash)",
            transition: "border-color 180ms var(--ease-eerie), color 180ms var(--ease-eerie)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--signal)";
            (e.currentTarget as HTMLElement).style.color = "var(--signal)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--ash)";
            (e.currentTarget as HTMLElement).style.color = "var(--bone)";
          }}
        >
          Let's talk ↗
        </a>
      </div>
    </header>
  );
}
