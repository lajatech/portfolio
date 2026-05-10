"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CaseStudy } from "@/lib/data";

export default function NextProject({ cs }: { cs: CaseStudy }) {
  return (
    <section
      style={{
        background: "var(--char)",
        borderTop: "1px solid var(--ash)",
        padding: "var(--s-9) 0",
      }}
    >
      <div className="container-wide">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <span className="t-meta" style={{ color: "var(--mist)" }}>
              Next project
            </span>
            <Link
              href="/work"
              className="t-meta link-signal"
              style={{ color: "var(--fog)" }}
            >
              All work →
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Link
            href={`/case-study/${cs.nextSlug}`}
            style={{
              display: "block",
              marginTop: "var(--s-5)",
              textDecoration: "none",
            }}
          >
            <h2
              className="t-display-md group-hover:text-signal"
              style={{
                color: "var(--veil)",
                transition: "color 180ms var(--ease-eerie)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--signal)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--veil)";
              }}
            >
              {cs.nextTitle} →
            </h2>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
