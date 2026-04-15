"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconResize() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function IconConvert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function IconCompress() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="M14 10l7-7" />
      <path d="M3 21l7-7" />
    </svg>
  )
}

function IconMore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: "/", icon: <IconHome />, label: "Home" },
  { href: "/resize", icon: <IconResize />, label: "Resize" },
  { href: "/convert", icon: <IconConvert />, label: "Convert" },
  { href: "/compress", icon: <IconCompress />, label: "Compress" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "6px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--subtle)",
              background: isActive ? "var(--accent-light)" : "transparent",
              flex: 1,
              maxWidth: "80px",
            }}
          >
            {item.icon}
            <span style={{ fontSize: "9px", fontFamily: "var(--font-mono), monospace", fontWeight: 500 }}>
              {item.label}
            </span>
          </Link>
        )
      })}
      <Link
        href="/color-picker"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          padding: "6px 12px",
          borderRadius: "8px",
          textDecoration: "none",
          color: ["/color-picker", "/crop", "/exif"].includes(pathname) ? "var(--accent)" : "var(--subtle)",
          background: ["/color-picker", "/crop", "/exif"].includes(pathname) ? "var(--accent-light)" : "transparent",
          flex: 1,
          maxWidth: "80px",
        }}
      >
        <IconMore />
        <span style={{ fontSize: "9px", fontFamily: "var(--font-mono), monospace", fontWeight: 500 }}>
          More
        </span>
      </Link>
    </nav>
  )
}
