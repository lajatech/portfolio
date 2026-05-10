import type { CaseStudy } from "@/lib/data";

export default function CaseStudyHeader({ cs }: { cs: CaseStudy }) {
  return (
    <section
      className="grain"
      style={{
        background: "var(--void)",
        paddingTop: "140px",
        paddingBottom: "var(--s-9)",
        borderBottom: "1px solid var(--ash)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "var(--signal-deep)",
          borderRadius: "50%",
          filter: "blur(160px)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />

      <div className="container-wide relative" style={{ zIndex: 2 }}>
        {/* Meta row */}
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "var(--s-3)", marginBottom: "var(--s-7)" }}
        >
          <span className="pill">{cs.industry}</span>
          <span className="pill">{cs.role}</span>
          <span className="pill">{cs.year}</span>
          {cs.type === "mini" && <span className="pill pill-signal">Mini case study</span>}
        </div>

        {/* Title */}
        <h1
          className="t-display-lg"
          style={{
            color: "var(--veil)",
            marginBottom: "var(--s-4)",
            maxWidth: "900px",
          }}
        >
          {cs.title}
        </h1>

        {/* Editorial subtitle */}
        <p
          className="t-editorial-lg"
          style={{
            color: "var(--mist)",
            marginBottom: "var(--s-7)",
            fontSize: "clamp(28px, 5vw, 72px)",
            maxWidth: "800px",
          }}
        >
          {cs.subtitle}
        </p>

        {/* Details grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0",
            borderTop: "1px solid var(--ash)",
            paddingTop: "var(--s-6)",
            maxWidth: "700px",
          }}
        >
          {[
            { label: "Client", value: cs.client },
            { label: "Duration", value: cs.duration },
            { label: "Role", value: cs.role },
          ].map((d) => (
            <div
              key={d.label}
              style={{ paddingRight: "var(--s-6)", paddingBottom: "var(--s-4)" }}
            >
              <div className="t-meta" style={{ color: "var(--mist)", marginBottom: "6px" }}>
                {d.label}
              </div>
              <div className="t-body" style={{ color: "var(--bone)" }}>
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
