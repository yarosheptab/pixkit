import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { CookieConsent } from "@/components/CookieConsent"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://pixkit.yaro-labs.com"),
  title: {
    default: "pixkit — Browser Image Utilities",
    template: "%s | pixkit",
  },
  description:
    "Free, client-side image tools: resize, convert, compress, crop, color-pick, and read EXIF metadata. No uploads, no account.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://pixkit.yaro-labs.com",
    siteName: "pixkit",
    locale: "en_US",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCJXDL9H"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PCJXDL9H');`,
          }}
        />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  )
}
