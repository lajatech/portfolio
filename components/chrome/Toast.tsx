"use client";

import { useEffect, useRef } from "react";

/**
 * One toast slot for the whole page.
 *
 * The call sites (copy-to-clipboard, form errors) are scattered and some of
 * them are not React at all, so the API is a plain function rather than a
 * context hook. A module-level slot holds whichever <Toast> is mounted; calls
 * made before mount are dropped on purpose, since a message nobody could have
 * read is not worth queueing.
 */

type Sink = (msg: string) => void;

const SHOW_MS = 2400;

let sink: Sink | null = null;

export const toast = (msg: string): void => {
  sink?.(msg);
};

export default function Toast() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: number | undefined;

    const show: Sink = (msg) => {
      const el = ref.current;
      if (!el) return;
      el.textContent = msg;
      el.classList.add("on");
      // a second message restarts the clock rather than inheriting the first one
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("on"), SHOW_MS);
    };

    sink = show;
    return () => {
      window.clearTimeout(timer);
      // only clear the slot if it is still ours, so a remount during fast
      // refresh cannot unregister the live instance
      if (sink === show) sink = null;
    };
  }, []);

  return <div className="toast" id="toast" role="status" ref={ref} />;
}
