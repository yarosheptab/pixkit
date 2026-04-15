"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function IconResize() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg> }
function IconConvert() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg> }
function IconCompress() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6" /><path d="M20 10h-6V4" /><path d="M14 10l7-7" /><path d="M3 21l7-7" /></svg> }
function IconColorPicker() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l8.5-8.5" /><path d="M17 7l3-3" /></svg> }
function IconCrop() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg> }
function IconExif() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="12" y2="15" /></svg> }

const TOOLS = [
  { href: "/resize",       name: "Resize Image",   icon: <IconResize />,       desc: "Scale to exact pixels or percentage with aspect ratio lock." },
  { href: "/convert",      name: "Convert Format", icon: <IconConvert />,      desc: "Export as PNG, JPG, WebP, or AVIF with quality control." },
  { href: "/compress",     name: "Compress",       icon: <IconCompress />,     desc: "Reduce file size with before/after comparison." },
  { href: "/color-picker", name: "Color Picker",   icon: <IconColorPicker />,  desc: "Click any pixel to sample HEX, RGB, or HSL values." },
  { href: "/crop",         name: "Crop",           icon: <IconCrop />,         desc: "Free crop or ratio presets: 1:1, 16:9, 4:3, 3:2." },
  { href: "/exif",         name: "EXIF Viewer",    icon: <IconExif />,         desc: "Read camera, lens, ISO, shutter, GPS and date metadata." },
]

export function ToolGrid() {
  const pathname = usePathname()

  return (
    <section style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--subtle)" }}>
          All Tools
        </h2>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)" }}>
          6 tools
        </span>
      </div>

      <div className="tool-grid">
        {TOOLS.map((tool) => {
          const isActive = pathname === tool.href
          return (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                background: isActive ? "var(--accent-light)" : "var(--surface)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "16px 16px 14px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "border-color 0.12s",
              }}
              className="tool-card"
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "7px",
                  background: isActive ? "var(--accent)" : "var(--accent-light)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--accent-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#fff" : "var(--accent)",
                }}
              >
                {tool.icon}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>{tool.name}</div>
              <div style={{ fontSize: "11px", color: "var(--muted-fg)", lineHeight: 1.5 }}>{tool.desc}</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
