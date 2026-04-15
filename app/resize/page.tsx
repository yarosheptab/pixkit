import type { Metadata } from "next"
import ResizeTool from "./ResizeTool"

export const metadata: Metadata = {
  title: "Image Resizer — Resize Images Online",
  description:
    "Resize images to exact dimensions or by percentage. Supports JPEG, PNG, WebP. Runs entirely in your browser — no uploads.",
  keywords: [
    "image resizer",
    "resize image online",
    "resize photo",
    "change image dimensions",
    "browser image resize",
  ],
  openGraph: {
    title: "Image Resizer — Resize Images Online",
    description:
      "Resize images to exact dimensions or by percentage. Supports JPEG, PNG, WebP. Runs entirely in your browser — no uploads.",
    url: "https://pixkit.yaro-labs.com/resize",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit Image Resizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Resizer — Resize Images Online",
    description:
      "Resize images to exact dimensions or by percentage. Supports JPEG, PNG, WebP. Runs entirely in your browser — no uploads.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Image Resizer",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/resize",
  "description":
    "Resize images to exact dimensions or by percentage. Supports JPEG, PNG, WebP. Runs entirely in your browser — no uploads.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

export default function ResizePage() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ResizeTool />
    </>
  )
}
