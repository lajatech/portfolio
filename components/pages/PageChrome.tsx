"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";

/**
 * Header, footer and reveal observer for the three standalone routes.
 *
 * Why this is the only client component on these pages: /work, /about and
 * /case-study/[slug] are ordinary documents with no ScrollStage, so the only
 * thing they need from the browser is "add a class when a block scrolls into
 * view". Doing that with one observer over `[data-rv]` keeps the page bodies
 * server components: they emit the attribute and nothing else. Wrapping every
 * revealed block in its own client component would ship a component boundary
 * per row for a single classList write.
 *
 * The children are server-rendered and passed through as an opaque tree, so
 * marking this file "use client" does not pull the page content into the
 * client bundle.
 */

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

const EMAIL = "abdulmuizadelaja@gmail.com";

const FOOT_NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
] as const;

const ELSEWHERE = [
  { label: "LinkedIn", href: "https://linkedin.com/in/abdulmuiz-adelaja" },
  { label: "X", href: "https://x.com/lajanumba" },
  { label: "Behance", href: "https://behance.net/adelajaabdulmu" },
] as const;

export type ChromeTheme = "dark" | "light";

type Props = {
  /** Which ground the first section paints, so the header foreground matches. */
  theme?: ChromeTheme;
  /** Marks the current route in the header. */
  current?: "work" | "about" | null;
  children: ReactNode;
};

export default function PageChrome({ theme = "dark", current = null, children }: Props) {
  /* All three routes render <PageChrome> in the same position in the tree, so a
     client-side navigation between them reconciles onto this same instance
     rather than remounting it. An empty dependency array would therefore run
     the observer once, for the first page visited, and leave every later page
     stuck at opacity 0. The pathname is what actually changed, so it is the
     dependency. */
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    if (nodes.length === 0) return;

    // No IntersectionObserver (or reduced motion) means the reveal never
    // arrives, and .pg-rv starts at opacity 0. Revealing everything up front is
    // the only safe failure mode: an invisible page is worse than no animation.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      for (const el of nodes) el.classList.add("pg-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("pg-in");
          // one-shot: a block that has been read should not fade out again on
          // the way back up, and unobserving keeps the callback list short
          io.unobserve(entry.target);
        }
      },
      // a little past the bottom edge, so a row has committed to being on
      // screen before it starts moving
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    for (const el of nodes) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  const toTop = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <div className="pg">
      <header className={theme === "light" ? "pg-nav pg-nav-light" : "pg-nav pg-nav-dark"}>
        <Link className="pg-logo" href="/" aria-label="Làjà, home">
          L<em>à</em>jà
        </Link>
        <nav className="pg-nav-links" aria-label="Primary">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current === l.label.toLowerCase() ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link className="pill" href="/#contact">
          <span>Let&apos;s talk</span>
        </Link>
      </header>

      <main>{children}</main>

      <footer className="foot">
        <div className="ft-mark" aria-hidden="true">
          <i>L</i>
          <i>À</i>
          <i>J</i>
          <i>À</i>
        </div>
        <p className="pg-ft-extra">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          {ELSEWHERE.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </p>
        <div className="ft-row">
          <nav aria-label="Footer">
            {FOOT_NAV.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <p>© 2026 Abdulmuiz Adelaja</p>
          <button className="to-top" aria-label="Back to top" onClick={toTop}>
            ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
