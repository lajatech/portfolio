"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { useStage, useStageFrame } from "@/components/stage/ScrollStage";
import type { ChapterId } from "@/lib/motion";
import MobileMenu from "./MobileMenu";

/**
 * Fixed header.
 *
 * Two jobs that both have to happen off the React render path: marking the
 * active link from `stage.dominant`, and hiding on scroll down. Both are a
 * single class toggle per frame, so they are cheap to do imperatively and
 * ruinous to do through state (a re-render of the whole header every frame).
 *
 * The only thing React owns here is the menu boolean, which changes at human
 * frequency rather than frame frequency.
 */

/* Most of the header points at chapters of this page, which are scrolled to
   rather than jumped to, so the stage's lead-in offsets survive. About is a
   separate route, so the list has to carry both kinds: a chapter link that
   calls `scrollTo`, and a route link that navigates. Collapsing the two (an
   `#about` anchor, say) would scroll to nothing, and typing About as a
   ChapterId would let it reach `scrollTo` and silently do the same. */
export type NavLink =
  | { kind: "chapter"; id: ChapterId; label: string }
  | { kind: "route"; href: string; label: string };

export const NAV_LINKS: ReadonlyArray<NavLink> = [
  { kind: "chapter", id: "work", label: "Work" },
  { kind: "chapter", id: "process", label: "Process" },
  { kind: "chapter", id: "capabilities", label: "Capabilities" },
  { kind: "route", href: "/about", label: "About" },
  { kind: "chapter", id: "contact", label: "Contact" },
];

/** px/s of downward scroll before the nav retracts. */
const HIDE_VY = 260;
/** px/s of upward scroll before it comes back. Lower, so recovery feels eager. */
const SHOW_VY = -90;

export default function Nav() {
  const { scrollTo } = useStage();
  const navRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  // the frame loop must not re-subscribe when the menu toggles, so it reads the
  // flag from a ref rather than closing over the state value
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // last written state, to avoid hammering classList with no-op writes
  const hiddenRef = useRef(false);
  const activeRef = useRef<string | null>(null);

  useStageFrame((stage) => {
    const nav = navRef.current;
    if (!nav) return;

    if (activeRef.current !== stage.dominant) {
      activeRef.current = stage.dominant;
      const links = nav.querySelectorAll<HTMLAnchorElement>(".links a");
      for (const a of links) {
        a.classList.toggle("on", a.dataset.go === stage.dominant);
      }
    }

    // past the hero only: inside the hero the nav is part of the composition
    const eligible = stage.y > stage.viewport * 0.6 && !openRef.current;
    let hide = hiddenRef.current;
    if (!eligible) hide = false;
    else if (stage.vy > HIDE_VY) hide = true;
    else if (stage.vy < SHOW_VY) hide = false;

    if (hide !== hiddenRef.current) {
      hiddenRef.current = hide;
      nav.classList.toggle("hide", hide);
    }
  });

  const go = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const id = e.currentTarget.dataset.go as ChapterId | undefined;
      if (!id) return;
      // hash navigation would jump and bypass the stage's lead-in offsets
      e.preventDefault();
      scrollTo(id);
    },
    [scrollTo],
  );

  const toTop = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollTo("top");
    },
    [scrollTo],
  );

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="nav" id="nav" ref={navRef}>
        <a className="logo" href="#top" aria-label="Làjà, home" onClick={toTop}>
          L<em>à</em>jà
        </a>

        <nav className="links" aria-label="Primary">
          {NAV_LINKS.map((l) =>
            l.kind === "chapter" ? (
              <a key={l.id} href={`#${l.id}`} data-go={l.id} onClick={go}>
                {l.label}
              </a>
            ) : (
              // no `data-go`, so the frame loop's active-link pass never marks
              // it: nothing on this page can be the About chapter
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <a className="pill" href="#contact" data-go="contact" onClick={go}>
          <span>Let&apos;s talk</span>
        </a>

        <button
          className="burger"
          id="burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
        </button>
      </header>

      <MobileMenu open={open} onClose={closeMenu} />
    </>
  );
}
