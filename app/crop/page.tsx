"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { OptionsStrip } from "@/components/tool/OptionsStrip"
import { UploadZone } from "@/components/tool/UploadZone"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, canvasToBlob, downloadBlob } from "@/lib/canvas"

type Ratio = "free" | "1:1" | "16:9" | "4:3" | "3:2"

const RATIOS: { value: Ratio; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "1:1",  label: "1:1"  },
  { value: "16:9", label: "16:9" },
  { value: "4:3",  label: "4:3"  },
  { value: "3:2",  label: "3:2"  },
]

function getRatioValue(ratio: Ratio): number | null {
  const map: Record<string, number> = { "1:1": 1, "16:9": 16/9, "4:3": 4/3, "3:2": 3/2 }
  return map[ratio] ?? null
}

interface CropBox { x: number; y: number; w: number; h: number }

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ratio, setRatio] = useState<Ratio>("free")
  const [imgNatW, setImgNatW] = useState(0)
  const [imgNatH, setImgNatH] = useState(0)
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0 })
  const previewRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setImgEl(img)
    setImgNatW(img.naturalWidth)
    setImgNatH(img.naturalHeight)
    setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight })
  }, [])

  useEffect(() => {
    if (!imgEl || !previewRef.current || !containerRef.current) return
    const canvas = previewRef.current
    const container = containerRef.current
    const displayW = container.clientWidth
    const scale = displayW / imgNatW
    const displayH = imgNatH * scale
    canvas.width = displayW
    canvas.height = displayH
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(imgEl, 0, 0, displayW, displayH)
    ctx.fillStyle = "rgba(0,0,0,0.45)"
    ctx.fillRect(0, 0, displayW, displayH)
    const cx = crop.x * scale
    const cy = crop.y * scale
    const cw = crop.w * scale
    const ch = crop.h * scale
    ctx.clearRect(cx, cy, cw, ch)
    ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, cx, cy, cw, ch)
    ctx.strokeStyle = "#0f766e"
    ctx.lineWidth = 2
    ctx.strokeRect(cx, cy, cw, ch)
  }, [imgEl, imgNatW, imgNatH, crop])

  useEffect(() => {
    if (!imgNatW || !imgNatH) return
    const rv = getRatioValue(ratio)
    if (!rv) return
    let w = imgNatW, h = Math.round(w / rv)
    if (h > imgNatH) { h = imgNatH; w = Math.round(h * rv) }
    setCrop({ x: Math.round((imgNatW - w) / 2), y: Math.round((imgNatH - h) / 2), w, h })
  }, [ratio, imgNatW, imgNatH])

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = previewRef.current!
    const rect = canvas.getBoundingClientRect()
    const scale = imgNatW / canvas.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale
    setDragging(true)
    setDragStart({ mx, my, cx: crop.x, cy: crop.y })
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging) return
    const canvas = previewRef.current!
    const rect = canvas.getBoundingClientRect()
    const scale = imgNatW / canvas.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale
    const dx = mx - dragStart.mx
    const dy = my - dragStart.my
    const newX = Math.max(0, Math.min(imgNatW - crop.w, dragStart.cx + dx))
    const newY = Math.max(0, Math.min(imgNatH - crop.h, dragStart.cy + dy))
    setCrop((c) => ({ ...c, x: Math.round(newX), y: Math.round(newY) }))
  }

  function onMouseUp() { setDragging(false) }

  async function handleDownload() {
    if (!imgEl || !file) return
    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = crop.w
    outputCanvas.height = crop.h
    const ctx = outputCanvas.getContext("2d")!
    ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h)
    const blob = await canvasToBlob(outputCanvas, file.type || "image/png")
    downloadBlob(blob, `cropped-${file.name}`)
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Crop" }]}>
      <ToolHeader name="Crop" description="Select a region with free crop or a fixed aspect ratio preset." />
      <OptionsStrip options={RATIOS} value={ratio} onChange={(v) => setRatio(v as Ratio)} />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          <div ref={containerRef} style={{ marginBottom: "16px" }}>
            <canvas
              ref={previewRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ maxWidth: "100%", display: "block", borderRadius: "8px", border: "1px solid var(--border)", cursor: dragging ? "grabbing" : "grab" }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "12px" }}>
            Crop: {crop.w} x {crop.h}px at ({crop.x}, {crop.y})
          </div>
          <DownloadButton onClick={handleDownload} />
        </div>
      )}
    </AppShell>
  )
}
