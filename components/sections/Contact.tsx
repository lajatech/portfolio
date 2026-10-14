"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useStage, useStageFrame } from "@/components/stage/ScrollStage";
import { approach, clamp, easeOutCubic, hash, range, win } from "@/lib/motion";

/**
 * Chapter 07: contact, and the footer.
 *
 * There is no backend on this site, so the form does not claim to send
 * anything. It validates, then hands the typed content to the visitor's own
 * mail client through a mailto: URL, and leaves the address on screen as
 * selectable text for the case where mailto does nothing (which is most
 * webmail-only machines). Saying "Message sent" here would be a lie.
 */

const EMAIL = "abdulmuizadelaja@gmail.com";

const TITLE_LINES = ["Got a number", "that needs", "moving?"] as const;
const TITLE_LABEL = "Got a number that needs moving?";

const BUDGETS = ["Under $5k", "$5k to $15k", "$15k+"] as const;

const FOOT_NAV = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "recognition", label: "Clients" },
  { id: "contact", label: "Contact" },
] as const;

const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/abdulmuiz-adelaja" },
  { label: "X", href: "https://x.com/lajanumba" },
  { label: "Behance", href: "https://behance.net/adelajaabdulmu" },
] as const;

/** deliberately loose: the browser's own type=email check is stricter, and the
 *  point is to catch typos, not to police RFC 5322 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type CharNode = {
  el: HTMLSpanElement;
  /** viewport-space centre, re-measured on stage:remeasure */
  cx: number;
  cy: number;
  /** current spring value toward the pointer-proximity target */
  v: number;
};

export default function Contact() {
  const { scrollTo } = useStage();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLElement>(null);
  const charsRef = useRef<CharNode[]>([]);

  const [budget, setBudget] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  /* ── title char measurement ────────────────────────────────────────── */
  const measureChars = useCallback(() => {
    const root = titleRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLSpanElement>(".split-c"));
    charsRef.current = els.map((el, i) => {
      const prev = charsRef.current[i];
      // measuring with the transform still applied would drift the centres a
      // little further every remeasure, so it is cleared first
      el.style.transform = "";
      const r = el.getBoundingClientRect();
      return {
        el,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2 + window.scrollY,
        v: prev?.v ?? 0,
      };
    });
  }, []);

  useEffect(() => {
    measureChars();
    window.addEventListener("stage:remeasure", measureChars);
    document.fonts?.ready.then(measureChars).catch(() => undefined);
    return () => window.removeEventListener("stage:remeasure", measureChars);
  }, [measureChars]);

  useStageFrame((stage) => {
    const chars = charsRef.current;
    const w = win(stage.sections, "contact", -0.7, -0.1, stage.sy);

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (stage.reducedMotion) {
        c.el.style.transform = "none";
        c.el.style.opacity = "1";
        continue;
      }
      // entrance: staggered rise. hash() rather than i / length so the order
      // reads as scattered without being random between loads.
      const t = easeOutCubic(clamp((w - hash(i * 3.1) * 0.35) / 0.65));

      // proximity: a gaussian around the pointer in document space, so the
      // falloff does not change shape as the page scrolls
      let target = 0;
      if (stage.pointer.active) {
        const dx = stage.pointer.x - c.cx;
        const dy = stage.pointer.y + stage.y - c.cy;
        const d2 = dx * dx + dy * dy;
        const r = 220;
        target = Math.exp(-d2 / (2 * r * r));
      }
      // one spring per char, frame-rate independent, no allocation
      c.v = approach(c.v, target, 9, stage.dt);

      const s = 1 + c.v * 0.18;
      c.el.style.transform = `translate3d(0,${((1 - t) * 90).toFixed(1)}%,0) scale(${s.toFixed(3)}) skewX(${(c.v * -7).toFixed(2)}deg)`;
      c.el.style.opacity = t.toFixed(3);
    }

    /* ── footer wordmark ─────────────────────────────────────────────── */
    const mark = markRef.current;
    const foot = footRef.current;
    if (!mark || !foot) return;
    const vh = stage.viewport || window.innerHeight;
    const rect = foot.getBoundingClientRect();
    if (rect.top > vh || rect.bottom < 0) return;

    for (let i = 0; i < mark.children.length; i++) {
      const el = mark.children[i] as HTMLElement;
      if (stage.reducedMotion) {
        el.style.transform = "none";
        continue;
      }
      const t = easeOutCubic(range(0.98, 0.52, rect.top / vh));
      // deterministic scatter, so the four letters land the same way on every
      // load and on every machine
      const ox = (hash(i * 11 + 1) - 0.5) * 420;
      const oy = (hash(i * 11 + 2) - 0.5) * 320;
      const rot = (hash(i * 11 + 3) - 0.5) * 50;
      el.style.transform = `translate3d(${((1 - t) * ox).toFixed(1)}px,${((1 - t) * oy).toFixed(1)}px,0) rotate(${((1 - t) * rot).toFixed(2)}deg)`;
    }
  });

  /* ── form ──────────────────────────────────────────────────────────── */
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);
      const name = String(data.get("name") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const brief = String(data.get("msg") ?? "").trim();

      const bad: string[] = [];
      if (name.length < 2) bad.push("name");
      if (!EMAIL_RE.test(email)) bad.push("email");
      if (brief.length < 12) bad.push("msg");

      for (const key of ["name", "email", "msg"]) {
        const field = form.elements.namedItem(key);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
          field.classList.toggle("bad", bad.includes(key));
        }
      }

      if (bad.length) {
        setMsg(
          bad.includes("msg") && bad.length === 1
            ? "Tell me a little more about the project, a sentence or two."
            : "Check the highlighted fields and try again.",
        );
        const first = form.elements.namedItem(bad[0]);
        if (first instanceof HTMLElement) first.focus();
        return;
      }

      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget: ${budget ?? "not specified"}`,
        "",
        brief,
      ].join("\n");
      const href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Project enquiry from ${name}`,
      )}&body=${encodeURIComponent(body)}`;

      setMsg(`Opening your mail app. If nothing happens, email ${EMAIL} directly.`);
      window.location.href = href;
    },
    [budget],
  );

  return (
    <section className="ch contact" id="contact" data-ch="7" data-bg="yellow">
      <div className="ct-in">
        <p className="kicker">
          <b>(07)</b> Contact
        </p>

        {/* split per character for the pointer proximity effect. The real
            sentence lives in aria-label, since the split spans read as
            individual letters otherwise. */}
        <h2 className="ct-title" aria-label={TITLE_LABEL} ref={titleRef}>
          {TITLE_LINES.map((line) => (
            <span className="ln" key={line}>
              {line.split(" ").map((word, wi) => (
                <span className="mg" key={`${word}-${wi}`}>
                  {wi > 0 ? " " : null}
                  {Array.from(word).map((ch, ci) => (
                    <span className="split-c" key={`${ch}-${ci}`} aria-hidden="true">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="ct-row">
          <form className="ct-form" noValidate onSubmit={onSubmit}>
            <label>
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@company.com" />
            </label>
            <fieldset>
              <legend>Budget</legend>
              <div className="chips">
                {BUDGETS.map((b) => (
                  <button
                    type="button"
                    className={budget === b ? "chip on" : "chip"}
                    key={b}
                    aria-pressed={budget === b}
                    onClick={() => setBudget((cur) => (cur === b ? null : b))}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="full">
              <span>Project</span>
              <textarea
                name="msg"
                rows={3}
                placeholder="What are you building, and what needs to move?"
              />
            </label>
            <button className="btn-n" type="submit">
              <span>Send</span>
              <svg viewBox="0 0 35 23" fill="none" aria-hidden="true">
                <path d="M1 11.5h30M23 3l9 8.5-9 8.5" stroke="currentColor" strokeWidth="2.6" />
              </svg>
            </button>
            <p className="ct-msg" role="status">
              {msg}
            </p>
          </form>

          <div className="ct-side">
            <p className="ct-note">
              I take on a small number of projects at a time. If the brief has a number
              attached to it, I am interested.
            </p>
            <div className="ct-lines">
              <p>
                <small>Email</small>
                <a className="copy" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </p>
              <p>
                <small>Based in</small>
                Lagos, Nigeria
              </p>
              <p>
                <small>Elsewhere</small>
                <span>
                  {LINKS.map((l, i) => (
                    <span key={l.label}>
                      {i > 0 ? ", " : null}
                      <a className="copy" href={l.href} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="foot" ref={footRef}>
        <div className="ft-mark" ref={markRef} aria-hidden="true">
          <i>L</i>
          <i>À</i>
          <i>J</i>
          <i>À</i>
        </div>
        <div className="ft-row">
          {/* anchors rather than buttons: globals.css hangs the hover rule off
              `.ft-row nav a`, and the href keeps these usable if the stage
              never mounts. scrollTo() just takes over the jump. */}
          <nav aria-label="Footer">
            {FOOT_NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(n.id);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <p>© 2026 Abdulmuiz Adelaja</p>
          <button className="to-top" aria-label="Back to top" onClick={() => scrollTo("top")}>
            ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
