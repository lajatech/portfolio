"use client";

import { useEffect, useRef, useState } from "react";
import { useStageFrame } from "@/components/stage/ScrollStage";
import { clamp, easeOutQuart, win } from "@/lib/motion";
import { splitChars } from "@/lib/splitText";

/**
 * Chapter 03.
 *
 * The OBLO services rack, reframed. He is one designer, not an agency, so these
 * are capabilities rather than packages: what he does, with the bullets taken
 * from work that actually shipped.
 *
 * The open card is React state (a click, not a frame) while the rise-in is
 * written straight to the nodes. The two never collide because the rise uses
 * `translate` and the stylesheet's hover and open states use `transform`.
 */

type Capability = {
  piece: string;
  title: string;
  copy: string;
  items: [string, string, string];
};

const CAPABILITIES: Capability[] = [
  {
    piece: "arch",
    title: "Product Design",
    copy: "End to end flows for fintech, proptech and AI products, carried on a design system so the next ten screens stay consistent.",
    items: [
      "End to end app and web flows",
      "Design systems from scratch",
      "Conversational and form UX",
    ],
  },
  {
    piece: "lens",
    title: "UX Research",
    copy: "Audits, interviews and usability tests that find the exact step where people give up, before anything gets redrawn.",
    items: ["Flow and funnel audits", "User interviews and testing", "Journey mapping"],
  },
  {
    piece: "lead",
    title: "Design Leadership",
    copy: "Leading designers, setting a KPI per person, and running the stakeholder sessions where direction is actually decided.",
    items: [
      "Team lead and mentoring",
      "Stakeholder facilitation",
      "KPI setting and design ops",
    ],
  },
  {
    piece: "growth",
    title: "Growth Design",
    copy: "Conversion work with a statistics habit: split tests, landing pages and onboarding tuned against time to value.",
    items: [
      "A/B and split testing",
      "Landing page conversion",
      "Onboarding and activation",
    ],
  },
];

/** fraction of the rise window each card waits before it starts */
const CARD_STAGGER = 0.09;
const TITLE_STAGGER = 0.035;

export default function Capabilities() {
  const [open, setOpen] = useState<string | null>(null);

  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const charsRef = useRef<HTMLSpanElement[]>([]);
  const cardElsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const title = titleRef.current;
    if (title) charsRef.current = splitChars(title);
    const cards = cardsRef.current;
    if (cards) {
      cardElsRef.current = Array.from(
        cards.querySelectorAll<HTMLElement>(".sv-card"),
      );
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) return;

    // entrance state goes on here, not in the markup, so the section reads
    // normally with JS off or before the loop picks it up
    for (const c of charsRef.current) {
      c.style.opacity = "0";
      c.style.transform = "translateY(60%)";
    }
    for (const el of cardElsRef.current) {
      el.style.opacity = "0";
      el.style.translate = "0 70px";
    }
    if (kickerRef.current) kickerRef.current.style.opacity = "0";
  }, []);

  useStageFrame((stage) => {
    if (stage.reducedMotion) return;

    const s = stage.sections.capabilities;
    if (s && (stage.y > s.top + s.height || stage.y + stage.viewport < s.top)) {
      return;
    }

    if (kickerRef.current) {
      kickerRef.current.style.opacity = `${win(
        stage.sections,
        "capabilities",
        -0.5,
        -0.1,
        stage.sy,
      )}`;
    }

    const chars = charsRef.current;
    if (chars.length > 0) {
      const tp = win(stage.sections, "capabilities", -0.45, 0.05, stage.sy);
      // the stagger eats into the window, so the head runs past 1 to leave the
      // last character a full ramp of its own
      const head = tp * (1 + chars.length * TITLE_STAGGER);
      for (let i = 0; i < chars.length; i++) {
        const e = easeOutQuart(clamp(head - i * TITLE_STAGGER));
        chars[i].style.opacity = `${e}`;
        chars[i].style.transform = `translateY(${((1 - e) * 60).toFixed(2)}%)`;
      }
    }

    const cards = cardElsRef.current;
    if (cards.length > 0) {
      const cp = win(stage.sections, "capabilities", -0.3, 0.12, stage.sy);
      const head = cp * (1 + (cards.length - 1) * CARD_STAGGER);
      for (let i = 0; i < cards.length; i++) {
        const e = easeOutQuart(clamp(head - i * CARD_STAGGER));
        cards[i].style.opacity = `${e}`;
        cards[i].style.translate = `0 ${((1 - e) * 70).toFixed(2)}px`;
      }
    }
  });

  // exclusive: opening a card closes whichever one was open
  const toggle = (piece: string) =>
    setOpen((prev) => (prev === piece ? null : piece));

  /**
   * On a hover device the CSS already reveals the list, and the button is the
   * only affordance that should toggle the pinned `open` state. Where there is
   * no hover there is nothing to reveal, so the whole card becomes a tap
   * target. Queried at click time rather than on mount: no state, no extra
   * render, and it follows a device that changes input mode mid-session.
   */
  const onCardClick = (piece: string) => () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      toggle(piece);
    }
  };

  return (
    <section
      className="ch capabilities"
      id="capabilities"
      data-ch="3"
      data-bg="coral"
    >
      <div className="stick">
        <div className="sv-head">
          <p className="kicker" ref={kickerRef}>
            <b>(03)</b> Capabilities
          </p>
          <h2 className="big-title" ref={titleRef}>
            WHAT I DO
          </h2>
        </div>
        <div className="sv-cards" ref={cardsRef}>
          {CAPABILITIES.map((cap) => (
            <article
              className={cap.piece === open ? "sv-card open" : "sv-card"}
              data-piece={cap.piece}
              key={cap.piece}
              onClick={onCardClick(cap.piece)}
            >
              <div className="sv-slot" />
              <h3>{cap.title}</h3>
              <p>{cap.copy}</p>
              <ul>
                {cap.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                className="sv-more"
                type="button"
                aria-expanded={cap.piece === open}
                onClick={(ev) => {
                  // the card's own handler would immediately undo this on touch
                  ev.stopPropagation();
                  toggle(cap.piece);
                }}
              >
                <span>More</span>
                <b aria-hidden="true">+</b>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
