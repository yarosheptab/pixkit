"use client"

import { useState, useCallback, useEffect } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [quality, setQuality] = useState(80)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
  }, [])

  useEffect(() => {
    if (!file) return
    let cancelled = false
    ;(async () => {
      const img = await loadImage(file)
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg"
      const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight)
      const blob = await canvasToBlob(canvas, mimeType, quality / 100)
      if (!cancelled) {
        setOutputBlob(blob)
        setOutputSize(blob.size)
      }
    })()
    return () => { cancelled = true }
  }, [file, quality])

  function handleDownload() {
    if (!file || !outputBlob) return
    const baseName = file.name.replace(/\.[^.]+$/, "")
    const ext = file.name.split(".").pop() ?? "jpg"
    downloadBlob(outputBlob, `${baseName}-compressed.${ext}`)
  }

  const savings = file && outputSize !== null
    ? Math.round(((file.size - outputSize) / file.size) * 100)
    : null

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Compress" }]}>
      <ToolHeader name="Compress" description="Reduce image file size with live before/after comparison." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)", marginBottom: "4px" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>
                {formatBytes(file.size)}
              </div>
            </div>
          }
          right={
            <div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Quality</span>
                  <span>{quality}%</span>
                </div>
                <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              {outputSize !== null && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", fontWeight: 600, color: "var(--accent)" }}>
                    {formatBytes(outputSize)}
                  </div>
                  {savings !== null && savings > 0 && (
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)", marginTop: "2px" }}>
                      {savings}% smaller
                    </div>
                  )}
                </div>
              )}
              <DownloadButton onClick={handleDownload} disabled={!outputBlob} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
