"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
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

export const NAV_LINKS: ReadonlyArray<{ id: ChapterId; label: string }> = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "capabilities", label: "Capabilities" },
  { id: "contact", label: "Contact" },
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
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} data-go={l.id} onClick={go}>
              {l.label}
            </a>
          ))}
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
