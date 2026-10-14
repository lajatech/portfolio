"use client";

import { useEffect, useRef } from "react";
import { useStageFrame } from "@/components/stage/ScrollStage";
import { clamp, easeOutBack, range, thru, win } from "@/lib/motion";

/**
 * Chapter 02.
 *
 * One statement, filled in left to right as the section scrolls through its
 * pin. The words rest as outlined type (that is `.mw` in the stylesheet), so
 * the statement is legible before a single frame runs; progress only adds the
 * fill. The inline shapes are the punctuation.
 */

/** word fill runs across this slice of the section progress */
const FILL_FROM = 0.04;
const FILL_TO = 0.62;
/** and the whole block leaves across this one */
const OUT_FROM = 0.82;

type Entry =
  | { kind: "word"; el: HTMLElement }
  | { kind: "shape"; el: HTMLElement };

const statementCache = new WeakMap<HTMLElement, Entry[]>();

/**
 * Split the statement into animatable entries.
 *
 * Deliberately not `splitChars`: 132µ display type filled one character at a
 * time reads as a glitch, while one word at a time reads as reading. The
 * inline `.sh` children are not text, so they are picked up as entries of
 * their own and keep their position in the sequence.
 *
 * Cached on the element, because a dev StrictMode double effect would
 * otherwise wrap the wrappers.
 */
function splitStatement(el: HTMLElement): Entry[] {
  const cached = statementCache.get(el);
  if (cached) return cached;

  const entries: Entry[] = [];
  // snapshot: the loop replaces nodes as it goes
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as HTMLElement;
      if (child.classList.contains("sh")) entries.push({ kind: "shape", el: child });
      continue;
    }
    if (node.nodeType !== Node.TEXT_NODE) continue;

    const value = node.nodeValue ?? "";
    const frag = document.createDocumentFragment();
    for (const token of value.split(/(\s+)/)) {
      if (token === "") continue;
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(token));
        continue;
      }
      const wrap = document.createElement("span");
      wrap.className = "split-w";
      const word = document.createElement("span");
      word.className = "mw";
      word.textContent = token;
      wrap.appendChild(word);
      frag.appendChild(wrap);
      entries.push({ kind: "word", el: word });
    }
    node.parentNode?.replaceChild(frag, node);
  }

  statementCache.set(el, entries);
  return entries;
}

export default function Manifesto() {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const footRef = useRef<HTMLDivElement | null>(null);
  const entriesRef = useRef<Entry[]>([]);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const entries = splitStatement(text);
    entriesRef.current = entries;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      // the stylesheet parks `.mf-text .sh` at scale(0), which is invisible, so
      // under reduced motion the resting state has to be written here instead
      for (const entry of entries) {
        if (entry.kind === "shape") entry.el.style.transform = "none";
        else {
          entry.el.style.color = "#fff";
          entry.el.style.setProperty("-webkit-text-stroke-color", "#fff");
        }
      }
      return;
    }

    // kicker and foot fade in on approach. Hiding them here rather than in the
    // markup keeps them visible with JS off.
    if (kickerRef.current) kickerRef.current.style.opacity = "0";
    if (footRef.current) footRef.current.style.opacity = "0";
  }, []);

  useStageFrame((stage) => {
    const entries = entriesRef.current;
    if (entries.length === 0 || stage.reducedMotion) return;

    const s = stage.sections.manifesto;
    // off screen entirely: nothing to update, and this section is 340vh tall so
    // that is most of the page
    if (s && (stage.y > s.top + s.height || stage.y + stage.viewport < s.top)) {
      return;
    }

    const p = thru(stage.sections, "manifesto", stage.sy);

    const lead = win(stage.sections, "manifesto", -0.5, -0.1, stage.sy);
    if (kickerRef.current) kickerRef.current.style.opacity = `${lead}`;
    if (footRef.current) footRef.current.style.opacity = `${lead}`;

    // one unit of fill progress per entry, so the head of the fill moves at a
    // constant word rate however long the statement is
    const head = range(FILL_FROM, FILL_TO, p) * entries.length;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const t = clamp(head - i);
      if (entry.kind === "word") {
        entry.el.style.color = `rgba(244, 247, 254, ${t.toFixed(3)})`;
        entry.el.style.setProperty(
          "-webkit-text-stroke-color",
          `rgba(255, 255, 255, ${(0.45 + 0.55 * t).toFixed(3)})`,
        );
      } else {
        const b = easeOutBack(t);
        entry.el.style.transform = `scale(${b.toFixed(4)}) rotate(${((1 - t) * -90).toFixed(2)}deg)`;
      }
    }

    const out = range(OUT_FROM, 1, p);
    const text = textRef.current;
    if (text) {
      text.style.opacity = `${1 - out}`;
      text.style.scale = `${1 - out * 0.14}`;
    }
  });

  return (
    <section className="ch manifesto" id="manifesto" data-ch="2" data-bg="blue">
      <div className="stick">
        <p className="kicker" ref={kickerRef}>
          <b>(02)</b> Approach
        </p>
        <p className="mf-text" id="mfText" ref={textRef}>
          Every screen is a <i className="sh sh-c" aria-hidden="true" /> hypothesis.
          I design it, <i className="sh sh-h" aria-hidden="true" /> measure it, and
          keep only <i className="sh sh-t" aria-hidden="true" /> what moves the
          number.
        </p>
        <div className="mf-foot" ref={footRef}>
          <span>Hypothesis</span>
          <span className="mf-arrow" />
          <span>Design</span>
          <span className="mf-arrow" />
          <span>Evidence</span>
        </div>
      </div>
    </section>
  );
}
