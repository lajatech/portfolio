"use client";

import { useEffect } from "react";
import { useStage } from "@/components/stage/ScrollStage";
import { NAV_LINKS } from "./Nav";

/**
 * Full-screen menu for portrait and phone widths.
 *
 * Purely state driven: the three `.menu-bg i` panels and the staggered links
 * are CSS transitions keyed off `#menu.on`, so nothing here needs the frame
 * loop. The component's real work is the side effects (body lock, Escape).
 */

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: Props) {
  const { scrollTo } = useStage();

  useEffect(() => {
    if (!open) return;
    // `body.lock` sets overflow:hidden. Scroll position is preserved because we
    // never reparent or reposition the body, so no scroll restore is needed.
    document.body.classList.add("lock");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lock");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div id="menu" className={open ? "on" : ""} aria-hidden={!open}>
      <div className="menu-bg">
        <i />
        <i />
        <i />
      </div>
      <nav className="menu-links" aria-label="Primary, mobile">
        {NAV_LINKS.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            data-go={l.id}
            onClick={(e) => {
              e.preventDefault();
              // close first: the lock has to lift before the smooth scroll runs
              onClose();
              scrollTo(l.id);
            }}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
