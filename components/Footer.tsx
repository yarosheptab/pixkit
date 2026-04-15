import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        height: "52px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "var(--surface)",
        flexShrink: 0,
      }}
    >
      <a
        href="https://yaro-labs.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "12px", color: "var(--muted-fg)", textDecoration: "none" }}
      >
        © {year} Yaro Labs
      </a>
      <nav style={{ display: "flex", gap: "16px" }}>
        {[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Cookies", href: "/cookies" },
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{ fontSize: "12px", color: "var(--muted-fg)", textDecoration: "none" }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
