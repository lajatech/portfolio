import ScrollReveal from "@/components/ui/ScrollReveal";

const clients = [
  { name: "Workergen", abbr: "WG" },
  { name: "Volta Charger", abbr: "VC" },
  { name: "Estility Ltd", abbr: "ES" },
  { name: "Neo Cash", abbr: "NC" },
  { name: "Àjọpaw", abbr: "AJ" },
];

export default function TrustedBy() {
  return (
    <section
      style={{
        background: "var(--void)",
        padding: "var(--s-9) 0",
        borderTop: "1px solid var(--ash)",
      }}
    >
      <div className="container-wide">
        <ScrollReveal>
          <span
            className="t-meta"
            style={{
              color: "var(--mist)",
              display: "block",
              textAlign: "center",
              marginBottom: "var(--s-7)",
            }}
          >
            Trusted by
          </span>
        </ScrollReveal>

        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "var(--s-6)" }}
        >
          {clients.map((client, i) => (
            <ScrollReveal key={client.name} delay={i * 0.07}>
              <div
                style={{
                  padding: "var(--s-4) var(--s-6)",
                  border: "1px solid var(--ash)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--s-3)",
                }}
              >
                {/* Abbr mark */}
                <div
                  className="t-meta"
                  style={{
                    color: "var(--signal)",
                    width: "28px",
                    height: "28px",
                    border: "1px solid var(--signal-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    flexShrink: 0,
                  }}
                >
                  {client.abbr}
                </div>
                <span
                  className="t-body"
                  style={{ color: "var(--bone)", whiteSpace: "nowrap" }}
                >
                  {client.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
