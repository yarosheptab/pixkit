import type { Metadata } from "next"
import CompressTool from "./CompressTool"

export const metadata: Metadata = {
  title: "Image Compressor — Reduce File Size",
  description:
    "Compress JPEG, PNG, and WebP images to reduce file size while preserving quality. No upload — all processing in-browser.",
  keywords: [
    "image compressor",
    "compress image",
    "reduce image size",
    "optimize image",
    "image optimization online",
  ],
  openGraph: {
    title: "Image Compressor — Reduce File Size",
    description:
      "Compress JPEG, PNG, and WebP images to reduce file size while preserving quality. No upload — all processing in-browser.",
    url: "https://pixkit.yaro-labs.com/compress",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit Image Compressor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor — Reduce File Size",
    description:
      "Compress JPEG, PNG, and WebP images to reduce file size while preserving quality. No upload — all processing in-browser.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Image Compressor",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/compress",
  "description":
    "Compress JPEG, PNG, and WebP images to reduce file size while preserving quality. No upload — all processing in-browser.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

export default function CompressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CompressTool />
    </>
  )
}
