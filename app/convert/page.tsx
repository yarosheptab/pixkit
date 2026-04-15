import type { Metadata } from "next"
import ConvertTool from "./ConvertTool"

export const metadata: Metadata = {
  title: "Image Format Converter",
  description:
    "Convert images between JPEG, PNG, WebP, and GIF. Client-side conversion — your images never leave your device.",
  keywords: [
    "image converter",
    "convert image format",
    "PNG to JPEG",
    "WebP converter",
    "image format converter online",
  ],
  openGraph: {
    title: "Image Format Converter",
    description:
      "Convert images between JPEG, PNG, WebP, and GIF. Client-side conversion — your images never leave your device.",
    url: "https://pixkit.yaro-labs.com/convert",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit Image Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Format Converter",
    description:
      "Convert images between JPEG, PNG, WebP, and GIF. Client-side conversion — your images never leave your device.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Image Format Converter",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/convert",
  "description":
    "Convert images between JPEG, PNG, WebP, and GIF. Client-side conversion — your images never leave your device.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

// eslint-disable-next-line react/no-danger
export default function ConvertPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ConvertTool />
    </>
  )
}
