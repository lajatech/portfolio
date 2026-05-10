"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Client = {
  name: string;
  logo?: string; /* path relative to /public, e.g. "/logos/volta.svg" */
  abbr: string;
};

const clients: Client[] = [
  { name: "Workergen",    logo: "/logos/workergen.svg", abbr: "WG" },
  { name: "Volta Charger",logo: "/logos/volta.svg",     abbr: "VC" },
  { name: "Estility Ltd", logo: "/logos/estility.svg",  abbr: "ES" },
  { name: "NeoCash",      logo: "/logos/neocash.svg",   abbr: "NC" },
  { name: "Àjọpaw",       logo: "/logos/ajopaw.svg",    abbr: "AJ" },
  { name: "DukaCards",    logo: "/logos/dukacards.svg", abbr: "DC" },
];

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <Image
        src={client.logo}
        alt={client.name}
        width={120}
        height={36}
        style={{ objectFit: "contain", maxHeight: 36 }}
      />
    );
  }

  return (
    <div
      className="flex items-center"
      style={{ gap: "var(--s-3)" }}
    >
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
      <span className="t-body" style={{ color: "var(--bone)", whiteSpace: "nowrap" }}>
        {client.name}
      </span>
    </div>
  );
}

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

        <style>{`
          .logos-row {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            gap: var(--s-8);
          }
          @media (max-width: 640px) {
            .logos-row {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: var(--s-6);
            }
            .logo-item {
              justify-content: center;
            }
          }
        `}</style>
        <div className="logos-row">
          {clients.map((client, i) => (
            <ScrollReveal key={client.name} delay={i * 0.07}>
              <div
                className="logo-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "var(--s-3) var(--s-4)",
                  opacity: 0.75,
                  transition: "opacity 200ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.75";
                }}
              >
                <ClientLogo client={client} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
