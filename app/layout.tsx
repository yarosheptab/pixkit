import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ""

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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  )
}
