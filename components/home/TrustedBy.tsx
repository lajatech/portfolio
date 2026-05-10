"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Client = {
  name: string;
  logo?: string; /* path relative to /public, e.g. "/logos/volta.svg" */
  abbr: string;
};

const clients: Client[] = [
  { name: "Workergen",    abbr: "WG" },
  { name: "Volta Charger",abbr: "VC" },
  { name: "Estility Ltd", abbr: "ES" },
  { name: "NeoCash",      abbr: "NC" },
  { name: "Àjọpaw",       abbr: "AJ" },
  { name: "ProFootball",  abbr: "PF" },
  /* Logo paths added once SVG files are placed in /public/logos/:
     logo: "/logos/workergen.svg" etc. */
];

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <Image
        src={client.logo}
        alt={client.name}
        width={120}
        height={36}
        style={{ objectFit: "contain", filter: "brightness(0) invert(0.6)", maxHeight: 36 }}
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

        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "var(--s-8)" }}
        >
          {clients.map((client, i) => (
            <ScrollReveal key={client.name} delay={i * 0.07}>
              <div
                style={{
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
