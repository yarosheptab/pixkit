import { AppShell } from "@/components/shell/AppShell"
import { HeroSection } from "@/components/home/HeroSection"
import { ToolGrid } from "@/components/home/ToolGrid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "pixkit — Browser Image Utilities",
  description:
    "Resize, convert, compress, crop, color-pick and read EXIF metadata — all client-side. No uploads, no account.",
}

export default function HomePage() {
  return (
    <AppShell topbarTitle="pixkit">
      <HeroSection />
      <ToolGrid />
    </AppShell>
  )
}
