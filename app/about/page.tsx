import { AppShell } from "@/components/shell/AppShell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "pixkit is a suite of browser-based image utilities built by Yaro Labs.",
}

export default function AboutPage() {
  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "About" }]}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "24px" }}>
          About pixkit
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit is the third of five tool-kit sub-sites under{" "}
          <a href="https://yaro-labs.com" style={{ color: "var(--accent)" }}>yaro-labs.com</a>.
          It provides six image utilities that run entirely in your browser — no uploads, no
          account, no waiting.
        </p>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          All processing uses the browser native Canvas API. Your images never leave your device.
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          The tools
        </h2>
        <ul style={{ paddingLeft: "20px" }}>
          {[
            ["Resize", "Scale to exact pixel dimensions or a percentage with aspect lock."],
            ["Convert", "Export as PNG, JPG, WebP, or AVIF with quality control."],
            ["Compress", "Reduce file size with live before/after size comparison."],
            ["Color Picker", "Click any pixel to sample HEX, RGB, and HSL values."],
            ["Crop", "Free crop or standard ratio presets with drag handles."],
            ["EXIF Viewer", "Read camera, lens, ISO, GPS, and date metadata."],
          ].map(([name, desc]) => (
            <li key={name} style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
              <strong style={{ color: "var(--fg)", fontWeight: 600 }}>{name}</strong> — {desc}
            </li>
          ))}
        </ul>
        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Tech stack
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)" }}>
          Next.js 15 App Router, TypeScript, Tailwind CSS v4, Canvas API, exifr,
          gray-matter and marked for blog, deployed on Vercel.
        </p>
      </div>
    </AppShell>
  )
}
