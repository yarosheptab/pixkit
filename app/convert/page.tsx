"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

type Format = "image/png" | "image/jpeg" | "image/webp" | "image/avif"

const FORMAT_OPTS: { value: Format; label: string; ext: string }[] = [
  { value: "image/png",  label: "PNG",  ext: "png"  },
  { value: "image/jpeg", label: "JPG",  ext: "jpg"  },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/avif", label: "AVIF", ext: "avif" },
]

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [format, setFormat] = useState<Format>("image/webp")
  const [quality, setQuality] = useState(85)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
  }, [])

  async function handleDownload() {
    if (!file) return
    const img = await loadImage(file)
    const canvas = drawImageToCanvas(img, origW, origH)
    const blob = await canvasToBlob(canvas, format, quality / 100)
    const ext = FORMAT_OPTS.find((f) => f.value === format)?.ext ?? "png"
    const baseName = file.name.replace(/\.[^.]+$/, "")
    downloadBlob(blob, `${baseName}.${ext}`)
  }

  const formatBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: active ? 600 : 500,
    background: active ? "var(--accent-light)" : "var(--muted)",
    color: active ? "var(--accent)" : "var(--muted-fg)",
    border: `1px solid ${active ? "var(--accent-border)" : "var(--border)"}`,
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "var(--font-mono), monospace",
  })

  const sliderRowStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    color: "var(--subtle)",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Convert Format" }]}>
      <ToolHeader name="Convert Format" description="Export your image as PNG, JPG, WebP, or AVIF with quality control." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginTop: "4px" }}>
                {formatBytes(file.size)} · {file.type}
              </div>
            </div>
          }
          right={
            <div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ ...sliderRowStyle, marginBottom: "8px" }}>
                  <span>Output format</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {FORMAT_OPTS.map((opt) => (
                    <button key={opt.value} style={formatBtnStyle(format === opt.value)} onClick={() => setFormat(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {format !== "image/png" && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={sliderRowStyle}>
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </div>
                  <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
                </div>
              )}
              <DownloadButton onClick={handleDownload} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
