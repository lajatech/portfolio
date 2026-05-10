"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']");
      setHovering(!!isInteractive);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousemove", handleHover, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animate() {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
        ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    }

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", handleHover);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [visible]);

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          background: hovering ? "var(--signal)" : "var(--veil)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transform: "translate(0px, 0px)",
          marginLeft: "-3px",
          marginTop: "-3px",
          transition: "opacity 180ms var(--ease-eerie), background 180ms var(--ease-eerie), width 180ms var(--ease-eerie), height 180ms var(--ease-eerie)",
          willChange: "transform",
        }}
      />

      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: hovering ? "40px" : "28px",
          height: hovering ? "40px" : "28px",
          border: `1px solid ${hovering ? "var(--signal)" : "var(--ash)"}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transform: "translate(0px, 0px)",
          marginLeft: hovering ? "-20px" : "-14px",
          marginTop: hovering ? "-20px" : "-14px",
          transition:
            "opacity 180ms var(--ease-eerie), border-color 180ms var(--ease-eerie), width 320ms var(--ease-eerie), height 320ms var(--ease-eerie), margin 320ms var(--ease-eerie)",
          willChange: "transform",
        }}
      />
    </>
  );
}
