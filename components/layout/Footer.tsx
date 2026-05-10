import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--char)",
        borderTop: "1px solid var(--ash)",
        padding: "32px 0",
      }}
    >
      <div className="container-wide">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between"
          style={{ gap: "var(--s-5)" }}
        >
          {/* Left — brand */}
          <div>
            <span
              className="t-meta"
              style={{ color: "var(--bone)" }}
            >
              © Là.já · Lagos / remote · {year}
            </span>
          </div>

          {/* Centre — nav */}
          <nav className="flex items-center" style={{ gap: "var(--s-6)" }}>
            {[
              { href: "/work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "mailto:abdulmuizadelaja@gmail.com", label: "Email ↗" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="t-meta link-signal"
                style={{ color: "var(--mist)" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right — socials */}
          <div className="flex items-center" style={{ gap: "var(--s-5)" }}>
            {[
              { href: "https://linkedin.com/in/abdulmuiz-adelaja", label: "LinkedIn ↗" },
              { href: "https://x.com/lajanumba", label: "X ↗" },
              { href: "https://behance.net/adelajaabdulmu", label: "Behance ↗" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-meta link-signal"
                style={{ color: "var(--mist)" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
