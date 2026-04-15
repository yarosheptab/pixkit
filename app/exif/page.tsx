import type { Metadata } from "next"
import ExifTool from "./ExifTool"

export const metadata: Metadata = {
  title: "EXIF Metadata Reader",
  description:
    "View EXIF metadata from JPEG photos — camera model, settings, GPS coordinates, date taken, and more. Fully offline.",
  keywords: [
    "EXIF reader",
    "EXIF metadata",
    "image metadata",
    "read EXIF data",
    "photo metadata viewer",
    "GPS from photo",
  ],
  openGraph: {
    title: "EXIF Metadata Reader",
    description:
      "View EXIF metadata from JPEG photos — camera model, settings, GPS coordinates, date taken, and more. Fully offline.",
    url: "https://pixkit.yaro-labs.com/exif",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit EXIF Reader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXIF Metadata Reader",
    description:
      "View EXIF metadata from JPEG photos — camera model, settings, GPS coordinates, date taken, and more. Fully offline.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EXIF Metadata Reader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/exif",
  "description":
    "View EXIF metadata from JPEG photos — camera model, settings, GPS coordinates, date taken, and more. Fully offline.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

export default function ExifPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ExifTool />
    </>
  )
}
