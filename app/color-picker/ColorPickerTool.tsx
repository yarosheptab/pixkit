"use client"

import { useState, useCallback, useRef } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { loadImage, samplePixel } from "@/lib/canvas"
import { rgbToHex, rgbToHsl } from "@/lib/colors"

interface PickedColor {
  r: number; g: number; b: number
  hex: string
  rgb: string
  hsl: string
}

export default function ColorPickerTool() {
  const [file, setFile] = useState<File | null>(null)
  const [picked, setPicked] = useState<PickedColor | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    const canvas = canvasRef.current!
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)
  }, [])

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    const [r, g, b] = samplePixel(canvas, x, y)
    setPicked({ r, g, b, hex: rgbToHex(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b) })
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyBtnStyle = (key: string): React.CSSProperties => ({
    fontSize: "11px",
    fontFamily: "var(--font-mono), monospace",
    background: copied === key ? "var(--accent)" : "var(--muted)",
    color: copied === key ? "#fff" : "var(--muted-fg)",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    padding: "3px 9px",
    cursor: "pointer",
    transition: "background 0.12s, color 0.12s",
  })

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Color Picker" }]}>
      <ToolHeader name="Color Picker" description="Click any pixel on your image to sample its HEX, RGB, and HSL values." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <canvas
              ref={canvasRef}
              onClick={onCanvasClick}
              style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid var(--border)", cursor: "crosshair", display: "block" }}
            />
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", marginTop: "6px" }}>
              Click anywhere on the image to pick a color
            </div>
          </div>
          {picked && (
            <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: picked.hex, border: "1px solid var(--border)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {[
                  { key: "hex", label: "HEX", value: picked.hex },
                  { key: "rgb", label: "RGB", value: picked.rgb },
                  { key: "hsl", label: "HSL", value: picked.hsl },
                ].map(({ key, label, value }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", width: "28px" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", color: "var(--fg)", flex: 1 }}>{value}</span>
                    <button style={copyBtnStyle(key)} onClick={() => copy(value, key)}>
                      {copied === key ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
