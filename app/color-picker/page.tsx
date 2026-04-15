import type { Metadata } from "next"
import ColorPickerTool from "./ColorPickerTool"

export const metadata: Metadata = {
  title: "Color Picker — Eyedropper for Images",
  description:
    "Pick colors from any image. Get HEX, RGB, and HSL values instantly. Upload an image and click to sample any color.",
  keywords: [
    "color picker",
    "eyedropper tool",
    "pick color from image",
    "HEX color picker",
    "image color sampler",
  ],
  openGraph: {
    title: "Color Picker — Eyedropper for Images",
    description:
      "Pick colors from any image. Get HEX, RGB, and HSL values instantly. Upload an image and click to sample any color.",
    url: "https://pixkit.yaro-labs.com/color-picker",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "pixkit Color Picker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Picker — Eyedropper for Images",
    description:
      "Pick colors from any image. Get HEX, RGB, and HSL values instantly. Upload an image and click to sample any color.",
    images: ["/og/home.png"],
  },
}

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Color Picker",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "url": "https://pixkit.yaro-labs.com/color-picker",
  "description":
    "Pick colors from any image. Get HEX, RGB, and HSL values instantly. Upload an image and click to sample any color.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "Yaro Labs", "url": "https://yaro-labs.com" },
})

export default function ColorPickerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ColorPickerTool />
    </>
  )
}
