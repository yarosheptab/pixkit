import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function Topbar({ breadcrumbs, title }: TopbarProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "var(--topbar-h)",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        flexShrink: 0,
      }}
    >
      <div>
        {breadcrumbs ? (
          <nav
            aria-label="breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              color: "var(--subtle)",
            }}
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span style={{ color: "var(--border-2)" }}>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} style={{ color: "var(--subtle)", textDecoration: "none" }} className="topbar-crumb-link">
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--fg)", fontWeight: 500 }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
            {title ?? "pixkit"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          className="topbar-search"
          style={{
            alignItems: "center",
            gap: "7px",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "4px 10px",
            color: "var(--subtle)",
          }}
        >
          <SearchIcon />
          <span style={{ fontSize: "12px", color: "var(--subtle)" }}>Search</span>
          <kbd
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              color: "var(--subtle)",
              background: "var(--border)",
              borderRadius: "3px",
              padding: "1px 4px",
              marginLeft: "6px",
            }}
          >
            K
          </kbd>
        </div>
        <Link href="/blog" className="topbar-nav-btn">Blog</Link>
        <Link href="/about" className="topbar-nav-btn">About</Link>
      </div>
    </header>
  )
}
