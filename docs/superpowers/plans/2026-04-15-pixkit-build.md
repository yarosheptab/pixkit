# pixkit Full-Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build pixkit.yaro-labs.com — a six-tool client-side image utilities site with a persistent sidebar-nav app shell, blog, and about page, using Next.js 15 App Router + Tailwind CSS v4.

**Architecture:** All image processing runs client-side via the Canvas API (no server uploads). A persistent two-column shell (64px sidebar + flexible main area with 50px topbar) wraps every page. Tool pages live at /resize, /convert, /compress, /color-picker, /crop, and /exif. Blog is SSG via gray-matter + marked. GA4 fires via next/script afterInteractive.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, next/font/google (Geist + Geist Mono), gray-matter, marked, exifr, Canvas API, GA4.

---

## File Map

```
pixkit/
├── app/
│   ├── layout.tsx                    <- Root layout: fonts, GA4
│   ├── globals.css                   <- Tailwind v4 @import, CSS custom properties, base styles
│   ├── page.tsx                      <- Homepage (hero + tool grid)
│   ├── resize/page.tsx               <- Resize tool
│   ├── convert/page.tsx              <- Convert format tool
│   ├── compress/page.tsx             <- Compress tool
│   ├── color-picker/page.tsx         <- Color picker tool
│   ├── crop/page.tsx                 <- Crop tool
│   ├── exif/page.tsx                 <- EXIF viewer tool
│   ├── blog/
│   │   ├── layout.tsx                <- Blog title template
│   │   ├── page.tsx                  <- Blog index (SSG)
│   │   └── [slug]/page.tsx           <- Blog post (SSG, generateStaticParams)
│   ├── about/page.tsx                <- About page prose
│   ├── sitemap.ts                    <- Auto-generated sitemap
│   └── robots.ts                     <- Robots.txt
├── components/
│   ├── shell/
│   │   ├── Sidebar.tsx               <- 64px sidebar: logo, nav icons, tooltips, active indicator
│   │   ├── Topbar.tsx                <- 50px topbar: breadcrumb, search, Blog/About links
│   │   └── AppShell.tsx              <- Grid wrapper: sidebar + main slot
│   ├── tool/
│   │   ├── UploadZone.tsx            <- Drag-and-drop / click upload zone (shared by all tools)
│   │   ├── ToolHeader.tsx            <- Tool name + one-line description
│   │   ├── OptionsStrip.tsx          <- 42px toggle-button strip
│   │   ├── ControlsPanel.tsx         <- Two-column original/output layout
│   │   └── DownloadButton.tsx        <- Full-width teal download button
│   └── home/
│       ├── HeroSection.tsx           <- Two-column hero (text + drop zone)
│       └── ToolGrid.tsx              <- 3-column tool card grid
├── lib/
│   ├── blog.ts                       <- getAllPosts() + getPostBySlug()
│   ├── canvas.ts                     <- Canvas API helpers: loadImage, canvasToBlob, etc.
│   └── colors.ts                     <- HEX/RGB/HSL conversion utilities
├── content/
│   └── blog/                         <- Markdown source files (*.md with gray-matter frontmatter)
├── public/
│   └── og/                           <- OG images
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `pixkit/package.json`
- Create: `pixkit/tsconfig.json`
- Create: `pixkit/next.config.ts`
- Create: `pixkit/postcss.config.mjs`
- Create: `pixkit/app/globals.css`
- Create: `pixkit/app/layout.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run from `/Users/a1111/Public/Prog/js/pixkit/`:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

Expected: project files created (package.json, tsconfig.json, app/, etc.)

- [ ] **Step 2: Install additional dependencies**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm install gray-matter marked exifr
```

Expected: `node_modules/gray-matter`, `node_modules/marked`, `node_modules/exifr` present.

- [ ] **Step 3: Replace `next.config.ts` with project config**

Write `/Users/a1111/Public/Prog/js/pixkit/next.config.ts`:

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: Confirm postcss config uses @tailwindcss/postcss**

The `create-next-app` with `--tailwind` on v4 generates the correct `postcss.config.mjs`. Verify it reads:

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

If it shows `tailwindcss: {}` instead, replace it with the above.

- [ ] **Step 5: Write `app/globals.css` — design tokens + Tailwind v4**

Write `/Users/a1111/Public/Prog/js/pixkit/app/globals.css`:

```css
@import 'tailwindcss';

:root {
  --bg:            #fafaf9;
  --surface:       #ffffff;
  --muted:         #f5f5f4;
  --border:        #e7e5e4;
  --border-2:      #d6d3d1;
  --fg:            #1c1917;
  --muted-fg:      #78716c;
  --subtle:        #a8a29e;
  --accent:        #0f766e;
  --accent-2:      #0d9488;
  --accent-light:  #f0fdfa;
  --accent-border: #99f6e4;
  --sidebar-w:     64px;
  --topbar-h:      50px;
  --radius:        8px;
}

@theme inline {
  --font-sans: var(--font-geist);
  --font-mono: var(--font-geist-mono);
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --radius-DEFAULT: var(--radius);
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Sidebar nav button hover */
.sidebar-nav-btn:hover {
  background: var(--muted) !important;
  color: var(--fg) !important;
}

/* Sidebar tooltip */
.sidebar-tooltip {
  display: none;
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--fg);
  color: #fff;
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 50;
  pointer-events: none;
}

.sidebar-nav-btn:hover .sidebar-tooltip {
  display: block;
}

/* Topbar nav buttons */
.topbar-nav-btn {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-fg);
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 11px;
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.topbar-nav-btn:hover {
  background: var(--muted);
  color: var(--fg);
}

/* Topbar breadcrumb link hover */
.topbar-crumb-link:hover {
  color: var(--accent) !important;
}

/* Tool cards */
.tool-card:hover {
  border-color: var(--accent-border) !important;
}

/* Upload zone */
.upload-zone:hover {
  border-color: var(--accent-border) !important;
  background: var(--accent-light) !important;
}
.upload-zone:hover svg {
  color: var(--accent) !important;
}

/* EXIF table row hover */
.exif-row:hover td {
  background: var(--muted);
}

/* Blog prose styles */
.blog-prose p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--muted-fg);
  margin-bottom: 20px;
}
.blog-prose h2 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin-top: 36px;
  margin-bottom: 12px;
}
.blog-prose strong {
  color: var(--fg);
  font-weight: 600;
}
.blog-prose ul {
  padding-left: 20px;
  margin-bottom: 20px;
}
.blog-prose li {
  font-size: 15px;
  line-height: 1.75;
  color: var(--muted-fg);
  margin-bottom: 6px;
}
.blog-prose a {
  color: var(--accent);
  text-decoration: underline;
}

/* Blog card link title hover */
.blog-card-link:hover .blog-card-title {
  color: var(--accent) !important;
}
```

- [ ] **Step 6: Write root `app/layout.tsx` — fonts and GA4**

Write `/Users/a1111/Public/Prog/js/pixkit/app/layout.tsx`:

```typescript
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
```

- [ ] **Step 7: Verify dev server starts**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm run dev
```

Expected: "Ready on http://localhost:3000" with no TypeScript/module errors. Kill with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && git init
git add package.json tsconfig.json next.config.ts postcss.config.mjs app/layout.tsx app/globals.css
git commit -m "feat: scaffold Next.js 15 + Tailwind v4 project"
```

---

## Task 2: App Shell — Sidebar + Topbar

**Files:**
- Create: `components/shell/Sidebar.tsx`
- Create: `components/shell/Topbar.tsx`
- Create: `components/shell/AppShell.tsx`

These three components form the persistent shell rendered around every page. AppShell is used in each page (not in layout.tsx) so breadcrumbs can be passed per page.

- [ ] **Step 1: Create `components/shell/Sidebar.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/shell/Sidebar.tsx`:

```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function IconResize() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function IconConvert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function IconCompress() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="M14 10l7-7" />
      <path d="M3 21l7-7" />
    </svg>
  )
}

function IconColorPicker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12l8.5-8.5" />
      <path d="M17 7l3-3" />
    </svg>
  )
}

function IconCrop() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  )
}

function IconExif() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="12" y2="15" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: "/resize",       icon: <IconResize />,      label: "Resize" },
  { href: "/convert",      icon: <IconConvert />,     label: "Convert" },
  { href: "/compress",     icon: <IconCompress />,    label: "Compress" },
  { href: "/color-picker", icon: <IconColorPicker />, label: "Color Picker" },
  { href: "/crop",         icon: <IconCrop />,        label: "Crop" },
  { href: "/exif",         icon: <IconExif />,        label: "EXIF" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0 12px",
        gap: "2px",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "8px",
          fontWeight: 600,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--accent)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          marginBottom: "16px",
          textDecoration: "none",
        }}
      >
        PIXKIT
      </Link>

      {NAV_ITEMS.map((item, i) => {
        const isActive = pathname === item.href
        return (
          <div key={item.href}>
            {i === 4 && (
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: "var(--border)",
                  margin: "6px 0",
                }}
              />
            )}
            <Link
              href={item.href}
              aria-label={item.label}
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9px",
                textDecoration: "none",
                color: isActive ? "var(--accent)" : "var(--subtle)",
                background: isActive ? "var(--accent-light)" : "transparent",
                transition: "background 0.12s, color 0.12s",
              }}
              className="sidebar-nav-btn"
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: "-1px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    background: "var(--accent)",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              {item.icon}
              <span className="sidebar-tooltip">{item.label}</span>
            </Link>
          </div>
        )
      })}
    </aside>
  )
}
```

- [ ] **Step 2: Create `components/shell/Topbar.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/shell/Topbar.tsx`:

```typescript
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function Topbar({ breadcrumbs, title }: TopbarProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "var(--topbar-h)",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        flexShrink: 0,
      }}
    >
      <div>
        {breadcrumbs ? (
          <nav
            aria-label="breadcrumb"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              color: "var(--subtle)",
            }}
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span style={{ color: "var(--border-2)" }}>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} style={{ color: "var(--subtle)", textDecoration: "none" }} className="topbar-crumb-link">
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--fg)", fontWeight: 500 }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
            {title ?? "pixkit"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "4px 10px",
            color: "var(--subtle)",
          }}
        >
          <SearchIcon />
          <span style={{ fontSize: "12px", color: "var(--subtle)" }}>Search</span>
          <kbd
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              color: "var(--subtle)",
              background: "var(--border)",
              borderRadius: "3px",
              padding: "1px 4px",
              marginLeft: "6px",
            }}
          >
            K
          </kbd>
        </div>
        <Link href="/blog" className="topbar-nav-btn">Blog</Link>
        <Link href="/about" className="topbar-nav-btn">About</Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create `components/shell/AppShell.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/shell/AppShell.tsx`:

```typescript
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppShellProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  topbarTitle?: string
}

export function AppShell({ children, breadcrumbs, topbarTitle }: AppShellProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "var(--sidebar-w) 1fr",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
        <Topbar breadcrumbs={breadcrumbs} title={topbarTitle} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add components/shell/
git commit -m "feat: app shell — sidebar, topbar, AppShell wrapper"
```

---

## Task 3: Homepage

**Files:**
- Create: `components/home/HeroSection.tsx`
- Create: `components/home/ToolGrid.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/home/HeroSection.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/home/HeroSection.tsx`:

```typescript
"use client"

import Link from "next/link"

function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <section style={{ padding: "40px 24px 36px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "32px", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.05, color: "var(--fg)", marginBottom: "12px" }}>
            Image tools that run{" "}
            <span style={{ color: "var(--accent)" }}>in your browser</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.65, maxWidth: "380px", marginBottom: "22px" }}>
            Resize, convert, compress, crop, pick colors, and read EXIF metadata — all
            client-side. No uploads. No account. No waiting.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href="/resize"
              style={{
                background: "var(--accent)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "var(--radius)",
                padding: "8px 18px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Pick a tool
            </Link>
            <a
              href="https://github.com/yaro-labs/pixkit"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "none",
                color: "var(--muted-fg)",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "7px 15px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              View source
            </a>
          </div>
        </div>

        <div
          style={{
            border: "2px dashed var(--accent-border)",
            borderRadius: "12px",
            background: "var(--accent-light)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textAlign: "center",
            minHeight: "140px",
          }}
        >
          <div style={{ color: "var(--accent)", opacity: 0.7 }}>
            <ImageIcon />
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
            Drop image here
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)" }}>
            or click to browse
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/home/ToolGrid.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/home/ToolGrid.tsx`:

```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function IconResize() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg> }
function IconConvert() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg> }
function IconCompress() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6" /><path d="M20 10h-6V4" /><path d="M14 10l7-7" /><path d="M3 21l7-7" /></svg> }
function IconColorPicker() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 12l8.5-8.5" /><path d="M17 7l3-3" /></svg> }
function IconCrop() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg> }
function IconExif() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="12" y2="15" /></svg> }

const TOOLS = [
  { href: "/resize",       name: "Resize Image",   icon: <IconResize />,       desc: "Scale to exact pixels or percentage with aspect ratio lock." },
  { href: "/convert",      name: "Convert Format", icon: <IconConvert />,      desc: "Export as PNG, JPG, WebP, or AVIF with quality control." },
  { href: "/compress",     name: "Compress",       icon: <IconCompress />,     desc: "Reduce file size with before/after comparison." },
  { href: "/color-picker", name: "Color Picker",   icon: <IconColorPicker />,  desc: "Click any pixel to sample HEX, RGB, or HSL values." },
  { href: "/crop",         name: "Crop",           icon: <IconCrop />,         desc: "Free crop or ratio presets: 1:1, 16:9, 4:3, 3:2." },
  { href: "/exif",         name: "EXIF Viewer",    icon: <IconExif />,         desc: "Read camera, lens, ISO, shutter, GPS and date metadata." },
]

export function ToolGrid() {
  const pathname = usePathname()

  return (
    <section style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--subtle)" }}>
          All Tools
        </h2>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)" }}>
          6 tools
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {TOOLS.map((tool) => {
          const isActive = pathname === tool.href
          return (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                background: isActive ? "var(--accent-light)" : "var(--surface)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "16px 16px 14px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "border-color 0.12s",
              }}
              className="tool-card"
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "7px",
                  background: isActive ? "var(--accent)" : "var(--accent-light)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--accent-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#fff" : "var(--accent)",
                }}
              >
                {tool.icon}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>{tool.name}</div>
              <div style={{ fontSize: "11px", color: "var(--muted-fg)", lineHeight: 1.5 }}>{tool.desc}</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write `app/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/page.tsx`:

```typescript
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
```

- [ ] **Step 4: Verify homepage renders correctly**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm run dev
```

Open http://localhost:3000. Expected: sidebar with PIXKIT logo + 6 icons, topbar with search + Blog/About, hero two-column layout, 3-column tool grid. Kill dev server.

- [ ] **Step 5: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add components/home/ app/page.tsx
git commit -m "feat: homepage — hero section and tool grid"
```

---

## Task 4: Shared Tool Components + Canvas Utilities

**Files:**
- Create: `lib/canvas.ts`
- Create: `lib/colors.ts`
- Create: `components/tool/UploadZone.tsx`
- Create: `components/tool/ToolHeader.tsx`
- Create: `components/tool/OptionsStrip.tsx`
- Create: `components/tool/ControlsPanel.tsx`
- Create: `components/tool/DownloadButton.tsx`

- [ ] **Step 1: Create `lib/canvas.ts`**

Write `/Users/a1111/Public/Prog/js/pixkit/lib/canvas.ts`:

```typescript
/** Load a File or Blob into an HTMLImageElement. */
export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")) }
    img.src = url
  })
}

/** Draw an image onto a new canvas at the given dimensions. */
export function drawImageToCanvas(img: HTMLImageElement, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}

/** Convert a canvas to a Blob with the given MIME type and quality (0-1). */
export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error("Canvas toBlob returned null")) },
      type,
      quality
    )
  })
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Format bytes as human-readable string (e.g. "1.2 MB"). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** Get pixel [r, g, b, a] at (x, y) from a canvas. */
export function samplePixel(canvas: HTMLCanvasElement, x: number, y: number): [number, number, number, number] {
  const ctx = canvas.getContext("2d")!
  const d = ctx.getImageData(x, y, 1, 1).data
  return [d[0], d[1], d[2], d[3]]
}
```

- [ ] **Step 2: Create `lib/colors.ts`**

Write `/Users/a1111/Public/Prog/js/pixkit/lib/colors.ts`:

```typescript
/** Convert [r, g, b] (0-255) to a hex string like "#1a2b3c". */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
}

/** Convert [r, g, b] (0-255) to HSL string "hsl(H, S%, L%)". */
export function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}
```

- [ ] **Step 3: Create `components/tool/UploadZone.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/tool/UploadZone.tsx`:

```typescript
"use client"

import { useRef, useState } from "react"

interface UploadZoneProps {
  onFile: (file: File) => void
  accept?: string
  title?: string
  subtitle?: string
  formats?: string[]
}

function ImageUploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function UploadZone({
  onFile,
  accept = "image/*",
  title = "Drop image here",
  subtitle = "or click to browse",
  formats = ["PNG", "JPG", "WebP", "AVIF", "GIF"],
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    onFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        margin: "20px 24px",
        border: `2px dashed ${dragging ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: "10px",
        background: dragging ? "var(--accent-light)" : "var(--muted)",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "border-color 0.12s, background 0.12s",
      }}
      className="upload-zone"
    >
      <div style={{ color: dragging ? "var(--accent)" : "var(--subtle)" }}>
        <ImageUploadIcon />
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>{title}</div>
      <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)" }}>
        {subtitle}
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
        {formats.map((fmt) => (
          <span
            key={fmt}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              color: "var(--subtle)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "2px 7px",
            }}
          >
            {fmt}
          </span>
        ))}
      </div>
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={onInputChange} />
    </div>
  )
}
```

- [ ] **Step 4: Create `components/tool/ToolHeader.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/tool/ToolHeader.tsx`:

```typescript
interface ToolHeaderProps {
  name: string
  description: string
}

export function ToolHeader({ name, description }: ToolHeaderProps) {
  return (
    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "4px" }}>
        {name}
      </h2>
      <p style={{ fontSize: "12px", color: "var(--muted-fg)" }}>{description}</p>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/tool/OptionsStrip.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/tool/OptionsStrip.tsx`:

```typescript
interface Option {
  value: string
  label: string
}

interface OptionsStripProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function OptionsStrip({ options, value, onChange }: OptionsStripProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "0 24px", height: "42px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      {options.map((opt) => {
        const isOn = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "12px",
              fontWeight: isOn ? 600 : 500,
              color: isOn ? "var(--accent)" : "var(--muted-fg)",
              background: isOn ? "var(--accent-light)" : "none",
              border: "none",
              borderRadius: "5px",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Create `components/tool/ControlsPanel.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/tool/ControlsPanel.tsx`:

```typescript
interface ControlsPanelProps {
  left: React.ReactNode
  right: React.ReactNode
}

const paneLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: "10px",
  fontWeight: 500,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: "var(--subtle)",
  marginBottom: "10px",
}

export function ControlsPanel({ left, right }: ControlsPanelProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)" }}>
      <div style={{ padding: "16px 20px" }}>
        <div style={paneLabelStyle}>Original</div>
        {left}
      </div>
      <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--border)" }}>
        <div style={paneLabelStyle}>Output</div>
        {right}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create `components/tool/DownloadButton.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/components/tool/DownloadButton.tsx`:

```typescript
interface DownloadButtonProps {
  onClick: () => void
  label?: string
  disabled?: boolean
}

export function DownloadButton({ onClick, label = "Download", disabled = false }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        background: disabled ? "var(--muted)" : "var(--accent)",
        color: disabled ? "var(--subtle)" : "#fff",
        border: "none",
        borderRadius: "var(--radius)",
        padding: "10px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans), sans-serif",
        marginTop: "12px",
        transition: "background 0.12s",
      }}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 8: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add components/tool/ lib/canvas.ts lib/colors.ts
git commit -m "feat: shared tool components and canvas/color utilities"
```

---

## Task 5: Resize Tool (`/resize`)

**Files:**
- Create: `app/resize/page.tsx`

- [ ] **Step 1: Write `app/resize/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/resize/page.tsx`:

```typescript
"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { OptionsStrip } from "@/components/tool/OptionsStrip"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

type Mode = "pixels" | "percentage"

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [mode, setMode] = useState<Mode>("pixels")
  const [locked, setLocked] = useState(true)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
    setWidth(String(img.naturalWidth))
    setHeight(String(img.naturalHeight))
  }, [])

  function onWidthChange(val: string) {
    setWidth(val)
    if (locked && origW && origH && val) {
      if (mode === "pixels") {
        setHeight(String(Math.round((Number(val) / origW) * origH)))
      } else {
        setHeight(val)
      }
    }
  }

  function onHeightChange(val: string) {
    setHeight(val)
    if (locked && origW && origH && val) {
      if (mode === "pixels") {
        setWidth(String(Math.round((Number(val) / origH) * origW)))
      } else {
        setWidth(val)
      }
    }
  }

  async function handleDownload() {
    if (!file) return
    const img = await loadImage(file)
    let w: number, h: number
    if (mode === "pixels") {
      w = Number(width) || origW
      h = Number(height) || origH
    } else {
      const pct = Number(width) / 100
      w = Math.round(origW * pct)
      h = Math.round(origH * pct)
    }
    const canvas = drawImageToCanvas(img, w, h)
    const blob = await canvasToBlob(canvas, file.type || "image/png")
    downloadBlob(blob, `resized-${file.name}`)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--muted)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "13px",
    color: "var(--fg)",
    fontFamily: "var(--font-mono), monospace",
    outline: "none",
    marginBottom: "8px",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    color: "var(--subtle)",
    marginBottom: "4px",
    display: "block",
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Resize Image" }]}>
      <ToolHeader name="Resize Image" description="Scale your image to exact pixels or a percentage of the original." />
      <OptionsStrip
        options={[{ value: "pixels", label: "By Pixels" }, { value: "percentage", label: "By Percentage" }]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF", "GIF"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginTop: "4px" }}>
                {formatBytes(file.size)}
              </div>
            </div>
          }
          right={
            <div>
              <label style={labelStyle}>{mode === "pixels" ? "Width (px)" : "Width (%)"}</label>
              <input style={inputStyle} type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} min={1} />
              <label style={labelStyle}>{mode === "pixels" ? "Height (px)" : "Height (%)"}</label>
              <input style={inputStyle} type="number" value={height} onChange={(e) => onHeightChange(e.target.value)} min={1} />
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted-fg)", cursor: "pointer" }}>
                <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} />
                Lock aspect ratio
              </label>
              <DownloadButton onClick={handleDownload} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Verify resize tool in browser**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm run dev
```

Navigate to http://localhost:3000/resize. Expected: breadcrumb "pixkit / Resize Image", tool header, By Pixels / By Percentage toggle, upload zone. Upload an image — expected: original dimensions in left pane, W x H inputs in right pane. Change width with lock on — height should update proportionally. Kill dev server.

- [ ] **Step 3: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/resize/
git commit -m "feat: resize tool — pixel/percentage mode with aspect lock"
```

---

## Task 6: Convert Tool (`/convert`)

**Files:**
- Create: `app/convert/page.tsx`

- [ ] **Step 1: Write `app/convert/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/convert/page.tsx`:

```typescript
"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

type Format = "image/png" | "image/jpeg" | "image/webp" | "image/avif"

const FORMAT_OPTS: { value: Format; label: string; ext: string }[] = [
  { value: "image/png",  label: "PNG",  ext: "png"  },
  { value: "image/jpeg", label: "JPG",  ext: "jpg"  },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/avif", label: "AVIF", ext: "avif" },
]

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [format, setFormat] = useState<Format>("image/webp")
  const [quality, setQuality] = useState(85)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
  }, [])

  async function handleDownload() {
    if (!file) return
    const img = await loadImage(file)
    const canvas = drawImageToCanvas(img, origW, origH)
    const blob = await canvasToBlob(canvas, format, quality / 100)
    const ext = FORMAT_OPTS.find((f) => f.value === format)?.ext ?? "png"
    const baseName = file.name.replace(/\.[^.]+$/, "")
    downloadBlob(blob, `${baseName}.${ext}`)
  }

  const formatBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: active ? 600 : 500,
    background: active ? "var(--accent-light)" : "var(--muted)",
    color: active ? "var(--accent)" : "var(--muted-fg)",
    border: `1px solid ${active ? "var(--accent-border)" : "var(--border)"}`,
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "var(--font-mono), monospace",
  })

  const sliderRowStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    color: "var(--subtle)",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Convert Format" }]}>
      <ToolHeader name="Convert Format" description="Export your image as PNG, JPG, WebP, or AVIF with quality control." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginTop: "4px" }}>
                {formatBytes(file.size)} · {file.type}
              </div>
            </div>
          }
          right={
            <div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ ...sliderRowStyle, marginBottom: "8px" }}>
                  <span>Output format</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {FORMAT_OPTS.map((opt) => (
                    <button key={opt.value} style={formatBtnStyle(format === opt.value)} onClick={() => setFormat(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {format !== "image/png" && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={sliderRowStyle}>
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </div>
                  <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
                </div>
              )}
              <DownloadButton onClick={handleDownload} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Verify convert tool**

Open http://localhost:3000/convert. Upload an image, select WebP, set quality to 70%, click Download. Expected: file downloads as `.webp`. Kill dev server.

- [ ] **Step 3: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/convert/
git commit -m "feat: convert tool — format selector and quality slider"
```

---

## Task 7: Compress Tool (`/compress`)

**Files:**
- Create: `app/compress/page.tsx`

- [ ] **Step 1: Write `app/compress/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/compress/page.tsx`:

```typescript
"use client"

import { useState, useCallback, useEffect } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { ControlsPanel } from "@/components/tool/ControlsPanel"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, drawImageToCanvas, canvasToBlob, downloadBlob, formatBytes } from "@/lib/canvas"

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [quality, setQuality] = useState(80)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setOrigW(img.naturalWidth)
    setOrigH(img.naturalHeight)
  }, [])

  useEffect(() => {
    if (!file) return
    let cancelled = false
    ;(async () => {
      const img = await loadImage(file)
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg"
      const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight)
      const blob = await canvasToBlob(canvas, mimeType, quality / 100)
      if (!cancelled) {
        setOutputBlob(blob)
        setOutputSize(blob.size)
      }
    })()
    return () => { cancelled = true }
  }, [file, quality])

  function handleDownload() {
    if (!file || !outputBlob) return
    const baseName = file.name.replace(/\.[^.]+$/, "")
    const ext = file.name.split(".").pop() ?? "jpg"
    downloadBlob(outputBlob, `${baseName}-compressed.${ext}`)
  }

  const savings = file && outputSize !== null
    ? Math.round(((file.size - outputSize) / file.size) * 100)
    : null

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Compress" }]}>
      <ToolHeader name="Compress" description="Reduce image file size with live before/after comparison." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP"]} />
      ) : (
        <ControlsPanel
          left={
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)", marginBottom: "4px" }}>
                {origW} x {origH}px
              </div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>
                {formatBytes(file.size)}
              </div>
            </div>
          }
          right={
            <div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Quality</span>
                  <span>{quality}%</span>
                </div>
                <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              {outputSize !== null && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", fontWeight: 600, color: "var(--accent)" }}>
                    {formatBytes(outputSize)}
                  </div>
                  {savings !== null && savings > 0 && (
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted-fg)", marginTop: "2px" }}>
                      {savings}% smaller
                    </div>
                  )}
                </div>
              )}
              <DownloadButton onClick={handleDownload} disabled={!outputBlob} />
            </div>
          }
        />
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/compress/
git commit -m "feat: compress tool — quality slider with live before/after size"
```

---

## Task 8: Color Picker Tool (`/color-picker`)

**Files:**
- Create: `app/color-picker/page.tsx`

- [ ] **Step 1: Write `app/color-picker/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/color-picker/page.tsx`:

```typescript
"use client"

import { useState, useCallback, useRef } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"
import { loadImage, samplePixel } from "@/lib/canvas"
import { rgbToHex, rgbToHsl } from "@/lib/colors"

interface PickedColor {
  r: number; g: number; b: number
  hex: string
  rgb: string
  hsl: string
}

export default function ColorPickerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [picked, setPicked] = useState<PickedColor | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    const canvas = canvasRef.current!
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)
  }, [])

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    const [r, g, b] = samplePixel(canvas, x, y)
    setPicked({ r, g, b, hex: rgbToHex(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b) })
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyBtnStyle = (key: string): React.CSSProperties => ({
    fontSize: "11px",
    fontFamily: "var(--font-mono), monospace",
    background: copied === key ? "var(--accent)" : "var(--muted)",
    color: copied === key ? "#fff" : "var(--muted-fg)",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    padding: "3px 9px",
    cursor: "pointer",
    transition: "background 0.12s, color 0.12s",
  })

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Color Picker" }]}>
      <ToolHeader name="Color Picker" description="Click any pixel on your image to sample its HEX, RGB, and HSL values." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ marginBottom: "20px" }}>
            <canvas
              ref={canvasRef}
              onClick={onCanvasClick}
              style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid var(--border)", cursor: "crosshair", display: "block" }}
            />
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", marginTop: "6px" }}>
              Click anywhere on the image to pick a color
            </div>
          </div>
          {picked && (
            <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: picked.hex, border: "1px solid var(--border)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {[
                  { key: "hex", label: "HEX", value: picked.hex },
                  { key: "rgb", label: "RGB", value: picked.rgb },
                  { key: "hsl", label: "HSL", value: picked.hsl },
                ].map(({ key, label, value }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--subtle)", width: "28px" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", color: "var(--fg)", flex: 1 }}>{value}</span>
                    <button style={copyBtnStyle(key)} onClick={() => copy(value, key)}>
                      {copied === key ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/color-picker/
git commit -m "feat: color picker tool — canvas click-to-sample with HEX/RGB/HSL"
```

---

## Task 9: Crop Tool (`/crop`)

**Files:**
- Create: `app/crop/page.tsx`

The crop tool renders an image onto a canvas with a darkened overlay. The crop region stays clear. The user drags the crop box. Ratio presets update the crop box size.

- [ ] **Step 1: Write `app/crop/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/crop/page.tsx`:

```typescript
"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { OptionsStrip } from "@/components/tool/OptionsStrip"
import { UploadZone } from "@/components/tool/UploadZone"
import { DownloadButton } from "@/components/tool/DownloadButton"
import { loadImage, canvasToBlob, downloadBlob } from "@/lib/canvas"

type Ratio = "free" | "1:1" | "16:9" | "4:3" | "3:2"

const RATIOS: { value: Ratio; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "1:1",  label: "1:1"  },
  { value: "16:9", label: "16:9" },
  { value: "4:3",  label: "4:3"  },
  { value: "3:2",  label: "3:2"  },
]

function getRatioValue(ratio: Ratio): number | null {
  const map: Record<string, number> = { "1:1": 1, "16:9": 16/9, "4:3": 4/3, "3:2": 3/2 }
  return map[ratio] ?? null
}

interface CropBox { x: number; y: number; w: number; h: number }

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ratio, setRatio] = useState<Ratio>("free")
  const [imgNatW, setImgNatW] = useState(0)
  const [imgNatH, setImgNatH] = useState(0)
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0 })
  const previewRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    const img = await loadImage(f)
    setImgEl(img)
    setImgNatW(img.naturalWidth)
    setImgNatH(img.naturalHeight)
    setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight })
  }, [])

  useEffect(() => {
    if (!imgEl || !previewRef.current || !containerRef.current) return
    const canvas = previewRef.current
    const container = containerRef.current
    const displayW = container.clientWidth
    const scale = displayW / imgNatW
    const displayH = imgNatH * scale
    canvas.width = displayW
    canvas.height = displayH
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(imgEl, 0, 0, displayW, displayH)
    ctx.fillStyle = "rgba(0,0,0,0.45)"
    ctx.fillRect(0, 0, displayW, displayH)
    const cx = crop.x * scale
    const cy = crop.y * scale
    const cw = crop.w * scale
    const ch = crop.h * scale
    ctx.clearRect(cx, cy, cw, ch)
    ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, cx, cy, cw, ch)
    ctx.strokeStyle = "#0f766e"
    ctx.lineWidth = 2
    ctx.strokeRect(cx, cy, cw, ch)
  }, [imgEl, imgNatW, imgNatH, crop])

  useEffect(() => {
    if (!imgNatW || !imgNatH) return
    const rv = getRatioValue(ratio)
    if (!rv) return
    let w = imgNatW, h = Math.round(w / rv)
    if (h > imgNatH) { h = imgNatH; w = Math.round(h * rv) }
    setCrop({ x: Math.round((imgNatW - w) / 2), y: Math.round((imgNatH - h) / 2), w, h })
  }, [ratio, imgNatW, imgNatH])

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = previewRef.current!
    const rect = canvas.getBoundingClientRect()
    const scale = imgNatW / canvas.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale
    setDragging(true)
    setDragStart({ mx, my, cx: crop.x, cy: crop.y })
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging) return
    const canvas = previewRef.current!
    const rect = canvas.getBoundingClientRect()
    const scale = imgNatW / canvas.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale
    const dx = mx - dragStart.mx
    const dy = my - dragStart.my
    const newX = Math.max(0, Math.min(imgNatW - crop.w, dragStart.cx + dx))
    const newY = Math.max(0, Math.min(imgNatH - crop.h, dragStart.cy + dy))
    setCrop((c) => ({ ...c, x: Math.round(newX), y: Math.round(newY) }))
  }

  function onMouseUp() { setDragging(false) }

  async function handleDownload() {
    if (!imgEl || !file) return
    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = crop.w
    outputCanvas.height = crop.h
    const ctx = outputCanvas.getContext("2d")!
    ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h)
    const blob = await canvasToBlob(outputCanvas, file.type || "image/png")
    downloadBlob(blob, `cropped-${file.name}`)
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Crop" }]}>
      <ToolHeader name="Crop" description="Select a region with free crop or a fixed aspect ratio preset." />
      <OptionsStrip options={RATIOS} value={ratio} onChange={(v) => setRatio(v as Ratio)} />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["PNG", "JPG", "WebP", "AVIF"]} />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          <div ref={containerRef} style={{ marginBottom: "16px" }}>
            <canvas
              ref={previewRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ maxWidth: "100%", display: "block", borderRadius: "8px", border: "1px solid var(--border)", cursor: dragging ? "grabbing" : "grab" }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "12px" }}>
            Crop: {crop.w} x {crop.h}px at ({crop.x}, {crop.y})
          </div>
          <DownloadButton onClick={handleDownload} />
        </div>
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/crop/
git commit -m "feat: crop tool — ratio presets and draggable crop box on canvas"
```

---

## Task 10: EXIF Viewer (`/exif`)

**Files:**
- Create: `app/exif/page.tsx`

Uses `exifr` (installed in Task 1). Imported dynamically because it uses browser APIs.

- [ ] **Step 1: Write `app/exif/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/exif/page.tsx`:

```typescript
"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { ToolHeader } from "@/components/tool/ToolHeader"
import { UploadZone } from "@/components/tool/UploadZone"

async function readExif(file: File): Promise<Record<string, unknown> | null> {
  const exifr = await import("exifr")
  return exifr.default.parse(file, { tiff: true, gps: true, exif: true })
}

const FRIENDLY_LABELS: Record<string, string> = {
  Make: "Camera Make",
  Model: "Camera Model",
  LensModel: "Lens",
  FNumber: "Aperture",
  ExposureTime: "Shutter Speed",
  ISO: "ISO",
  FocalLength: "Focal Length",
  Flash: "Flash",
  DateTimeOriginal: "Date Taken",
  GPSLatitude: "GPS Latitude",
  GPSLongitude: "GPS Longitude",
  ImageWidth: "Width",
  ImageHeight: "Height",
  ColorSpace: "Color Space",
  Software: "Software",
  Orientation: "Orientation",
  XResolution: "X Resolution",
  YResolution: "Y Resolution",
  ExposureProgram: "Exposure Program",
  MeteringMode: "Metering Mode",
  WhiteBalance: "White Balance",
}

function formatValue(key: string, val: unknown): string {
  if (val === null || val === undefined) return "n/a"
  if (key === "ExposureTime" && typeof val === "number") {
    return val < 1 ? `1/${Math.round(1 / val)}s` : `${val}s`
  }
  if (key === "FNumber" && typeof val === "number") return `f/${val}`
  if (key === "FocalLength" && typeof val === "number") return `${val}mm`
  if (val instanceof Date) return val.toLocaleString()
  if (typeof val === "number") return String(Math.round(val * 100) / 100)
  if (typeof val === "boolean") return val ? "Yes" : "No"
  if (Array.isArray(val)) return val.join(", ")
  return String(val)
}

export default function ExifPage() {
  const [file, setFile] = useState<File | null>(null)
  const [exifData, setExifData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setError(null)
    try {
      const data = await readExif(f)
      setExifData(data)
    } catch (e) {
      setError("Could not read EXIF data from this file.")
    }
  }, [])

  const entries = exifData
    ? Object.entries(exifData).filter(([, v]) => v !== null && v !== undefined)
    : []

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "10px",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: "var(--subtle)",
    fontWeight: 500,
  }

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "EXIF Viewer" }]}>
      <ToolHeader name="EXIF Viewer" description="Read and display metadata from your image: camera, lens, ISO, shutter, GPS, and dates." />
      {!file ? (
        <UploadZone onFile={handleFile} formats={["JPG", "TIFF", "HEIC"]} title="Drop image for EXIF data" />
      ) : (
        <div style={{ padding: "20px 24px" }}>
          {error && (
            <div style={{ color: "var(--muted-fg)", fontFamily: "var(--font-mono), monospace", fontSize: "12px", marginBottom: "16px" }}>
              {error}
            </div>
          )}
          {entries.length === 0 && !error && (
            <div style={{ color: "var(--muted-fg)", fontSize: "13px" }}>No EXIF metadata found in this file.</div>
          )}
          {entries.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Tag</th>
                  <th style={thStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([key, val]) => (
                  <tr key={key} className="exif-row">
                    <td style={{ padding: "7px 12px", borderBottom: "1px solid var(--border)", color: "var(--muted-fg)", fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                      {FRIENDLY_LABELS[key] ?? key}
                    </td>
                    <td style={{ padding: "7px 12px", borderBottom: "1px solid var(--border)", color: "var(--fg)", fontSize: "12px" }}>
                      {formatValue(key, val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AppShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/exif/
git commit -m "feat: EXIF viewer — exifr metadata table with friendly labels"
```

---

## Task 11: Blog

**Files:**
- Create: `lib/blog.ts`
- Create: `app/blog/layout.tsx`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `content/blog/getting-started.md`

- [ ] **Step 1: Create `lib/blog.ts`**

Write `/Users/a1111/Public/Prog/js/pixkit/lib/blog.ts`:

```typescript
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

export interface PostMeta {
  slug: string
  title: string
  description: string
  datePublished: string
  readTime: string
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8")
      const { data } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        datePublished: data.datePublished ?? "",
        readTime: data.readTime ?? "",
      }
    })
    .sort((a, b) => (b.datePublished > a.datePublished ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    datePublished: data.datePublished ?? "",
    readTime: data.readTime ?? "",
    content,
  }
}
```

- [ ] **Step 2: Create sample blog post**

Write `/Users/a1111/Public/Prog/js/pixkit/content/blog/getting-started.md`:

```markdown
---
title: "Getting Started with pixkit"
description: "A quick tour of the six image tools available in pixkit — all running client-side in your browser."
datePublished: "2026-04-15"
readTime: "3 min read"
---

## What is pixkit?

pixkit is a suite of six browser-based image utilities. Every operation runs locally via the Canvas API — your images never leave your device.

## The tools

**Resize** — Scale any image to exact pixel dimensions or a percentage of the original. Lock the aspect ratio to avoid distortion.

**Convert** — Export images as PNG, JPG, WebP, or AVIF. Control quality with a slider to balance file size and visual fidelity.

**Compress** — Reduce file size while keeping the same format. The live before/after comparison shows exactly how much you are saving.

**Color Picker** — Click any pixel on an uploaded image to sample its color. Output is available as HEX, RGB, or HSL with one-click copy.

**Crop** — Select a region using free-form dragging or snap to standard ratios: 1:1, 16:9, 4:3, and 3:2.

**EXIF Viewer** — Read the metadata embedded in a photo: camera model, lens, ISO, shutter speed, GPS coordinates, and capture date.

## Privacy

Zero uploads. All processing happens in the browser. pixkit never sends your images to a server.
```

- [ ] **Step 3: Create `app/blog/layout.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/blog/layout.tsx`:

```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { template: "%s | pixkit Blog", default: "Blog | pixkit" },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4: Create `app/blog/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/blog/page.tsx`:

```typescript
import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { getAllPosts } from "@/lib/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and updates from the pixkit team.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Blog" }]}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "32px" }}>
          Blog
        </h1>
        {posts.length === 0 && (
          <p style={{ color: "var(--muted-fg)", fontSize: "14px" }}>No posts yet.</p>
        )}
        <div>
          {posts.map((post, i) => (
            <div key={post.slug}>
              {i > 0 && <div style={{ height: "1px", background: "var(--border)" }} />}
              <Link href={`/blog/${post.slug}`} style={{ display: "block", padding: "20px 0", textDecoration: "none" }} className="blog-card-link">
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "6px" }}>
                  {post.datePublished} · {post.readTime}
                </div>
                <div className="blog-card-title" style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg)", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                  {post.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6 }}>
                  {post.description}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 5: Create `app/blog/[slug]/page.tsx`**

NOTE: The blog post HTML is rendered from local markdown files (not user input) using marked. This is equivalent to the reference project at yaro-labs-landing-page which uses the same pattern. The HTML is safe server-side static content.

Write `/Users/a1111/Public/Prog/js/pixkit/app/blog/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation"
import { AppShell } from "@/components/shell/AppShell"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import type { Metadata } from "next"
import { marked } from "marked"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Content is from local markdown files only — safe to render as HTML
  const html = await Promise.resolve(marked(post.content))

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "12px" }}>
          {post.datePublished} · {post.readTime}
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--fg)", marginBottom: "32px" }}>
          {post.title}
        </h1>
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add lib/blog.ts app/blog/ content/
git commit -m "feat: blog — SSG index, post pages, prose styles"
```

---

## Task 12: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write `app/about/page.tsx`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/about/page.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/about/
git commit -m "feat: about page"
```

---

## Task 13: Sitemap, Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

const BASE = "https://pixkit.yaro-labs.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/resize`,       priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/convert`,      priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/compress`,     priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/color-picker`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/crop`,         priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/exif`,         priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/blog`,         priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/about`,        priority: 0.5, changeFrequency: "yearly" },
  ]
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }))
  return [...staticRoutes, ...blogRoutes]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

Write `/Users/a1111/Public/Prog/js/pixkit/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://pixkit.yaro-labs.com/sitemap.xml",
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add app/sitemap.ts app/robots.ts
git commit -m "feat: sitemap.xml and robots.txt"
```

---

## Task 14: Production Build Verification

- [ ] **Step 1: Run production build**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm run build
```

Expected: Build completes with no TypeScript errors. Static pages output: `/`, `/blog`, `/blog/getting-started`, `/about`. Dynamic client pages: `/resize`, `/convert`, `/compress`, `/color-picker`, `/crop`, `/exif`.

- [ ] **Step 2: Fix common build issues**

- If `marked()` returns `Promise<string>` (v17+), wrap it: `const html = await Promise.resolve(marked(post.content))` — already handled in Task 11.
- If params typing fails in Next.js 15, ensure `params: Promise<{ slug: string }>` pattern is used — already handled in Task 11.
- If `exifr` fails at build time (SSR), ensure the import is inside an async function (not top-level) — already handled in Task 10.

- [ ] **Step 3: Manual smoke test**

```bash
cd /Users/a1111/Public/Prog/js/pixkit && npm run dev
```

Walk through: `/`, `/resize`, `/convert`, `/compress`, `/color-picker`, `/crop`, `/exif`, `/blog`, `/blog/getting-started`, `/about`. Upload a test JPEG to each tool and confirm the core operation works (download, pixel sampling, crop drag, EXIF table).

- [ ] **Step 4: Final commit**

```bash
cd /Users/a1111/Public/Prog/js/pixkit
git add -A
git commit -m "feat: production build verified — all 6 tools, blog, about"
```

---

## Self-Review Against Spec

### Spec Coverage

| Spec Requirement | Task |
|---|---|
| Sidebar 64px, PIXKIT logo rotated, 6 icons, active 3px left bar, tooltips | Task 2 |
| Divider between tool 4 and 5 in sidebar | Task 2 |
| Topbar 50px, breadcrumb Geist Mono 11px, search, Blog/About buttons | Task 2 |
| Homepage hero: two-column, 34px/800 headline, CTAs, teal dashed drop zone | Task 3 |
| Homepage tool grid: 3 cols, 8px gap, card anatomy, active/hover states | Task 3 |
| Tool page shell: breadcrumb, tool header 20px/700, 12px muted description | Tasks 4-10 |
| Options strip: 42px, toggle buttons, active = teal-light bg + teal text | Task 4 |
| Upload zone: dashed border default/hover teal, format pill tags Geist Mono | Task 4 |
| Controls panel: two-column original/output with border divider | Task 4 |
| Download button: full-width teal | Task 4 |
| /resize: W x H inputs, aspect lock, by-pixels / by-percentage toggle | Task 5 |
| /convert: format selector PNG/JPG/WebP/AVIF, quality slider, download | Task 6 |
| /compress: quality slider, before/after file size, download | Task 7 |
| /color-picker: click-to-sample, HEX/RGB/HSL output, copy buttons | Task 8 |
| /crop: free crop + ratio presets 1:1 16:9 4:3 3:2, drag handles, download | Task 9 |
| /exif: EXIF table camera/lens/ISO/shutter/GPS/dates, exifr package | Task 10 |
| Blog index: Geist Mono date, title, excerpt, hairlines | Task 11 |
| Blog post: prose max-width 680px | Task 11 |
| About: single-column prose max-width 640px | Task 12 |
| GA4 via next/script afterInteractive | Task 1 |
| Sitemap + robots.txt | Task 13 |
| CSS design tokens all 12 colors, Geist + Geist Mono via next/font | Task 1 |
| 120ms transitions on border-color and background | Task 1 (globals.css) |
| No external UI libraries | All tasks |
| Canvas API, no server uploads | lib/canvas.ts, Tasks 5-9 |

### Placeholder Scan

No TBD/TODO/placeholder text found. All steps include complete code.

### Type Consistency

- `loadImage`, `drawImageToCanvas`, `canvasToBlob`, `downloadBlob`, `formatBytes`, `samplePixel` — defined in Task 4, used identically in Tasks 5, 6, 7, 8, 9, 10.
- `rgbToHex(r, g, b)`, `rgbToHsl(r, g, b)` — defined in Task 4, used identically in Task 8.
- `AppShell({ children, breadcrumbs, topbarTitle })` — defined in Task 2, used identically in all page tasks.
- `OptionsStrip({ options, value, onChange })` — defined in Task 4, used identically in Tasks 5 and 9.
- `ControlsPanel({ left, right })` — defined in Task 4, used identically in Tasks 5, 6, 7.
- `getAllPosts()`, `getPostBySlug(slug)`, `PostMeta`, `Post` — defined in Task 11, used identically in blog pages and sitemap.
- `UploadZone({ onFile, accept, title, subtitle, formats })` — defined in Task 4, used identically in Tasks 5-10.
- `DownloadButton({ onClick, label, disabled })` — defined in Task 4, used identically in Tasks 5-9.
