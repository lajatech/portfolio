"use client";

import { useEffect, useRef, useState } from "react";

interface MetricCounterProps {
  value: string;
  className?: string;
}

function parseValue(raw: string): { prefix: string; number: number; suffix: string } | null {
  const match = raw.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
  };
}

function formatNumber(n: number, original: string): string {
  if (original.includes(".")) {
    return n.toFixed(1);
  }
  return Math.round(n).toString();
}

export default function MetricCounter({ value, className = "" }: MetricCounterProps) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);
  const parsed = parseValue(value);

  useEffect(() => {
    if (!parsed) {
      setDisplayed(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observed.current) {
          observed.current = true;
          const target = parsed.number;
          const duration = 1400;
          const start = performance.now();

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            setDisplayed(parsed!.prefix + formatNumber(current, value) + parsed!.suffix);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, parsed]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
