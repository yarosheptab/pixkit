"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { OptionsStrip } from "@/components/tool/OptionsStrip"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

type Mode = "pixels" | "percentage"

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [mode, setMode] = useState<Mode>("pixels")
  const [locked, setLocked] = useState(true)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
    setWidth(String(img.naturalWidth))
    setHeight(String(img.naturalHeight))
  }, [])

  function onWidthChange(val: string) {
    setWidth(val)
    if (locked && origW && origH && val) {
      if (mode === "pixels") {
        setHeight(String(Math.round((Number(val) / origW) * origH)))
      } else {
        setHeight(val)
      }
    }
  }

  function onHeightChange(val: string) {
    setHeight(val)
    if (locked && origW && origH && val) {
      if (mode === "pixels") {
        setWidth(String(Math.round((Number(val) / origH) * origW)))
      } else {
        setWidth(val)
      }
    }
  }

  async function handleDownload() {
    if (!file) return
    const img = await loadImage(file)
    let w: number, h: number
    if (mode === "pixels") {
      w = Number(width) || origW
      h = Number(height) || origH
    } else {
      const pct = Number(width) / 100
      w = Math.round(origW * pct)
      h = Math.round(origH * pct)
    }
    const canvas = drawImageToCanvas(img, w, h)
    const blob = await canvasToBlob(canvas, file.type || "image/png")
    downloadBlob(blob, `resized-${file.name}`)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--muted)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "13px",
    color: "var(--fg)",
    fontFamily: "var(--font-mono), monospace",
    outline: "none",
    marginBottom: "8px",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    color: "var(--subtle)",
    marginBottom: "4px",
    display: "block",
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Resize Image" }]}>
      <ToolHeader name="Resize Image" description="Scale your image to exact pixels or a percentage of the original." />
      <OptionsStrip
        options={[{ value: "pixels", label: "By Pixels" }, { value: "percentage", label: "By Percentage" }]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF", "GIF"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginTop: "4px" }}>
                {formatBytes(file.size)}
              </div>
            </div>
          }
          right={
            <div>
              <label style={labelStyle}>{mode === "pixels" ? "Width (px)" : "Width (%)"}</label>
              <input style={inputStyle} type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} min={1} />
              <label style={labelStyle}>{mode === "pixels" ? "Height (px)" : "Height (%)"}</label>
              <input style={inputStyle} type="number" value={height} onChange={(e) => onHeightChange(e.target.value)} min={1} />
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted-fg)", cursor: "pointer" }}>
                <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} />
                Lock aspect ratio
              </label>
              <DownloadButton onClick={handleDownload} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
