"use client";

import { useEffect, useRef } from "react";
import { approach } from "@/lib/motion";
import { useStageFrame } from "@/components/stage/ScrollStage";

/**
 * Custom pointer.
 *
 * Mouse only: on touch there is no pointer to replace, and on a trackpad-less
 * device the lag would be the only thing you noticed. The `has-cursor` class on
 * <html> is what actually reveals it, so the markup can ship unconditionally.
 *
 * The follow uses `approach` rather than a fixed lerp factor so the trail reads
 * the same on 60Hz and 120Hz displays.
 */

const BIG = "a, button, input, textarea, .sv-card, .cl-cell";
/** elementFromPoint forces layout, so it is sampled rather than run per frame. */
const HIT_EVERY = 4;

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const pos = useRef({ x: -100, y: -100 });
  const labelText = useRef("");
  const bigRef = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    return () => root.classList.remove("has-cursor");
  }, []);

  useStageFrame((stage) => {
    const el = rootRef.current;
    if (!el || !stage.pointer.active) return;

    const p = pos.current;
    const rate = 22;
    p.x = approach(p.x, stage.pointer.x, rate, stage.dt);
    p.y = approach(p.y, stage.pointer.y, rate, stage.dt);
    el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;

    if (stage.frame % HIT_EVERY !== 0) return;

    const under = document.elementFromPoint(stage.pointer.x, stage.pointer.y);
    const caseEl = under?.closest(".case") ?? null;
    const big = Boolean(under?.closest(BIG));
    const label = caseEl ? "View" : "";

    if (big !== bigRef.current) {
      bigRef.current = big;
      el.classList.toggle("big", big);
    }
    if (label !== labelText.current) {
      labelText.current = label;
      if (labelRef.current) labelRef.current.textContent = label;
      el.classList.toggle("lbl", label !== "");
    }
  });

  return (
    <div className="cursor" id="cursor" aria-hidden="true" ref={rootRef}>
      <i />
      <span ref={labelRef} />
    </div>
  );
}
