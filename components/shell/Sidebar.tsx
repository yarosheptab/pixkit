"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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

function IconColorPicker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12l8.5-8.5" />
      <path d="M17 7l3-3" />
    </svg>
  )
}

function IconCrop() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  )
}

function IconExif() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="12" y2="15" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: "/resize",       icon: <IconResize />,      label: "Resize" },
  { href: "/convert",      icon: <IconConvert />,     label: "Convert" },
  { href: "/compress",     icon: <IconCompress />,    label: "Compress" },
  { href: "/color-picker", icon: <IconColorPicker />, label: "Color Picker" },
  { href: "/crop",         icon: <IconCrop />,        label: "Crop" },
  { href: "/exif",         icon: <IconExif />,        label: "EXIF" },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={className}
      style={{
        width: "var(--sidebar-w)",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0 12px",
        gap: "2px",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "8px",
          fontWeight: 600,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--accent)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          marginBottom: "16px",
          textDecoration: "none",
        }}
      >
        PIXKIT
      </Link>

      {NAV_ITEMS.map((item, i) => {
        const isActive = pathname === item.href
        return (
          <div key={item.href}>
            {i === 4 && (
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: "var(--border)",
                  margin: "6px 0",
                }}
              />
            )}
            <Link
              href={item.href}
              aria-label={item.label}
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9px",
                textDecoration: "none",
                color: isActive ? "var(--accent)" : "var(--subtle)",
                background: isActive ? "var(--accent-light)" : "transparent",
                transition: "background 0.12s, color 0.12s",
              }}
              className="sidebar-nav-btn"
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: "-1px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    background: "var(--accent)",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              {item.icon}
              <span className="sidebar-tooltip">{item.label}</span>
            </Link>
          </div>
        )
      })}
    </aside>
  )
}
