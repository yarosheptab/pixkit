"use client"

import { useRef, useState } from "react"

interface UploadZoneProps {
  onFile: (file: File) => void
  accept?: string
  title?: string
  subtitle?: string
  formats?: string[]
}

function ImageUploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function UploadZone({
  onFile,
  accept = "image/*",
  title = "Drop image here",
  subtitle = "or click to browse",
  formats = ["PNG", "JPG", "WebP", "AVIF", "GIF"],
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    onFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        margin: "20px 24px",
        border: `2px dashed ${dragging ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: "10px",
        background: dragging ? "var(--accent-light)" : "var(--muted)",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "border-color 0.12s, background 0.12s",
      }}
      className="upload-zone"
    >
      <div style={{ color: dragging ? "var(--accent)" : "var(--subtle)" }}>
        <ImageUploadIcon />
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>{title}</div>
      <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)" }}>
        {subtitle}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
        {formats.map((fmt) => (
          <span
            key={fmt}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              color: "var(--subtle)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "2px 7px",
            }}
          >
            {fmt}
          </span>
        ))}
      </div>
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={onInputChange} />
    </div>
  )
}
