import type { Metadata } from "next"
import CropTool from "./CropTool"

export const metadata: Metadata = {
  title: "Image Cropper",
  description:
    "Crop images to any aspect ratio or custom dimensions. Interactive crop tool — runs in your browser.",
  keywords: [
    "image cropper",
    "crop image online",
    "crop photo",
    "image crop tool",
    "free image cropper",
  ],
  openGraph: {
    title: "Image Cropper",
    description:
      "Crop images to any aspect ratio or custom dimensions. Interactive crop tool — runs in your browser.",
    url: "https://pixkit.yaro-labs.com/crop",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit Image Cropper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Cropper",
    description:
      "Crop images to any aspect ratio or custom dimensions. Interactive crop tool — runs in your browser.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Image Cropper",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/crop",
  "description":
    "Crop images to any aspect ratio or custom dimensions. Interactive crop tool — runs in your browser.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

export default function CropPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CropTool />
    </>
  )
}
