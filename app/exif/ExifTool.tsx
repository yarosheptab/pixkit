"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"

async function readExif(file: File): Promise<Record<string, unknown> | null> {
  const exifr = await import("exifr")
  return exifr.default.parse(file, { tiff: true, gps: true, exif: true })
}

const FRIENDLY_LABELS: Record<string, string> = {
  Make: "Camera Make",
  Model: "Camera Model",
  LensModel: "Lens",
  FNumber: "Aperture",
  ExposureTime: "Shutter Speed",
  ISO: "ISO",
  FocalLength: "Focal Length",
  Flash: "Flash",
  DateTimeOriginal: "Date Taken",
  GPSLatitude: "GPS Latitude",
  GPSLongitude: "GPS Longitude",
  ImageWidth: "Width",
  ImageHeight: "Height",
  ColorSpace: "Color Space",
  Software: "Software",
  Orientation: "Orientation",
  XResolution: "X Resolution",
  YResolution: "Y Resolution",
  ExposureProgram: "Exposure Program",
  MeteringMode: "Metering Mode",
  WhiteBalance: "White Balance",
}

function formatValue(key: string, val: unknown): string {
  if (val === null || val === undefined) return "n/a"
  if (key === "ExposureTime" && typeof val === "number") {
    return val < 1 ? `1/${Math.round(1 / val)}s` : `${val}s`
  }
  if (key === "FNumber" && typeof val === "number") return `f/${val}`
  if (key === "FocalLength" && typeof val === "number") return `${val}mm`
  if (val instanceof Date) return val.toLocaleString()
  if (typeof val === "number") return String(Math.round(val * 100) / 100)
  if (typeof val === "boolean") return val ? "Yes" : "No"
  if (Array.isArray(val)) return val.join(", ")
  return String(val)
}

export default function ExifTool() {
  const [file, setFile] = useState<File | null>(null)
  const [exifData, setExifData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setError(null)
    try {
      const data = await readExif(f)
      setExifData(data)
    } catch {
      setError("Could not read EXIF data from this file.")
    }
  }, [])

  const entries = exifData
    ? Object.entries(exifData).filter(([, v]) => v !== null && v !== undefined)
    : []

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: "var(--subtle)",
    fontWeight: 500,
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "EXIF Viewer" }]}>
      <ToolHeader name="EXIF Viewer" description="Read and display metadata from your image: camera, lens, ISO, shutter, GPS, and dates." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["JPG", "TIFF", "HEIC"]} title="Drop image for EXIF data" />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          {error && (
            <div style={{ color: "var(--muted-fg)", fontFamily: "var(--font-mono), monospace", fontSize: "12px", marginBottom: "16px" }}>
              {error}
            </div>
          )}
          {entries.length === 0 && !error && (
            <div style={{ color: "var(--muted-fg)", fontSize: "13px" }}>No EXIF metadata found in this file.</div>
          )}
          {entries.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Tag</th>
                  <th style={thStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([key, val]) => (
                  <tr key={key} className="exif-row">
                    <td style={{ padding: "7px 12px", borderBottom: "1px solid var(--border)", color: "var(--muted-fg)", fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                      {FRIENDLY_LABELS[key] ?? key}
                    </td>
                    <td style={{ padding: "7px 12px", borderBottom: "1px solid var(--border)", color: "var(--fg)", fontSize: "12px" }}>
                      {formatValue(key, val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AppShell>
  )
}
