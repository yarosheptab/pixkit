"use client"

import Link from "next/link"

function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section style={{ padding: "40px 24px 36px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "32px", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.05, color: "var(--fg)", marginBottom: "12px" }}>
            Image tools that run{" "}
            <span style={{ color: "var(--accent)" }}>in your browser</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.65, maxWidth: "380px", marginBottom: "22px" }}>
            Resize, convert, compress, crop, pick colors, and read EXIF metadata — all
            client-side. No uploads. No account. No waiting.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href="/resize"
              style={{
                background: "var(--accent)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "var(--radius)",
                padding: "8px 18px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Pick a tool
            </Link>
          </div>
        </div>

        <div
          style={{
            border: "2px dashed var(--accent-border)",
            borderRadius: "12px",
            background: "var(--accent-light)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textAlign: "center",
            minHeight: "140px",
          }}
        >
          <div style={{ color: "var(--accent)", opacity: 0.7 }}>
            <ImageIcon />
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
            Drop image here
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)" }}>
            or click to browse
          </div>
        </div>
      </div>
    </section>
  )
}
