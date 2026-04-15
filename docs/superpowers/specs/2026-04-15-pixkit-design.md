# pixkit.yaro-labs.com — Design Specification

**Date:** 2026-04-15  
**Status:** Approved  
**Scope:** Homepage, tool pages, blog, about — full site design for pixkit.yaro-labs.com

---

## Overview

pixkit is an image utilities site with a sidebar-nav app shell — the third of five tool-kit sub-sites under yaro-labs.com. It targets anyone who needs to process images in-browser: resize, convert, compress, crop, color-pick, and inspect EXIF data.

**Design philosophy:** Clean and functional, app-like. Icon sidebar provides direct tool access from any page. Teal accent, off-white background, Geist font throughout. No hero pill/badge — headline is direct.

---

## Visual Design

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#fafaf9` | Page background |
| Surface | `#ffffff` | Sidebar, topbar, cards, panels |
| Muted | `#f5f5f4` | Input fields, hover bg, upload zone |
| Border | `#e7e5e4` | Default borders |
| Border (active) | `#d6d3d1` | Focused/active borders |
| Foreground | `#1c1917` | Primary text |
| Muted foreground | `#78716c` | Descriptions, labels |
| Subtle | `#a8a29e` | Placeholders, sidebar icons (inactive) |
| Accent | `#0f766e` | Teal — sidebar active, CTAs, highlights |
| Accent 2 | `#0d9488` | Hover state for accent elements |
| Accent light | `#f0fdfa` | Active card bg, upload zone hover |
| Accent border | `#99f6e4` | Active card border, focused inputs |

### Typography

- **All UI:** Geist (sans-serif) — headings, body, buttons, labels
- **Code / mono labels:** Geist Mono — breadcrumbs, kbd shortcuts, format tags
- **Border radius:** 8px

### Motion

Transitions: 120ms ease on border-color and background. Sidebar active indicator slides in as a 3px left-border bar.

---

## Layout System — App Shell

pixkit uses a persistent two-column shell on every page:

```
┌──────────┬──────────────────────────────────────┐
│  Sidebar │  Main area                           │
│  64px    │  (topbar + content)                  │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### Sidebar (64px wide, full height)
- White background, right border
- Top: "PIXKIT" text rotated 90° in Geist Mono, teal color
- 6 icon buttons (one per tool): 40×40px, 9px radius
  - Inactive: subtle gray icon
  - Hover: muted background, dark icon
  - Active: teal-light background, teal icon, 3px teal left-bar indicator
- Divider line between first 4 and last 2 tools
- Tooltips on hover (tool name)

### Topbar (50px, spans main area)
- Left: page title or breadcrumb (Geist Mono 11px for breadcrumbs)
- Right: search input (⌘K) + Blog + About buttons
- White background, bottom border

---

## Layout: Homepage

### Hero
- Two-column: left text, right drop zone
- **Left:** bold 34px/800 headline (no badge/pill) · 13px body · "Pick a tool" (teal primary) + "View source ↗" (ghost) CTAs
- **Right:** dashed-border drop zone — teal dashed border, teal-light bg, image icon, "Drop image here / or click to browse"

### Tool Grid
- Header: "ALL TOOLS" uppercase label (subtle) + "6 tools" count (Geist Mono, right)
- 3 columns, 8px gap
- Card: white surface, 1px border → hover: teal accent border
- Active card: teal-light bg, teal border
- Card anatomy: teal icon box (32×32, active = solid teal bg) · tool name (600 14px) · description · (no slug tag)

---

## Layout: Tool Page

### Topbar
- Breadcrumb: `pixkit / Tool Name` in Geist Mono 11px
- Right: search input

### Tool Header
- Tool name: Geist 20px 700
- One-line description: Geist 12px muted

### Options Strip (where applicable)
- 42px height, bottom border
- Toggle buttons: inactive = muted text, active = teal-light bg + teal text

### Upload Zone
- Dashed border (default: `--border`, hover: `--accent-border`)
- Hover: teal-light background, teal icon
- Shows: image icon + title + subtitle + accepted format tags (Geist Mono pill tags)

### Controls (after image loaded)
- Two equal columns, border divider
- **Left:** "Original" label · image preview thumbnail · dimension/info display
- **Right:** "Output" label · image preview thumbnail · editable fields · "Download" button (full-width teal)

---

## Tools (6 total)

| Slug | Name | UI Pattern |
|---|---|---|
| `/resize` | Resize Image | Options: by pixels / by percentage · W×H fields with aspect lock · download |
| `/convert` | Convert Format | Format selector (PNG/JPG/WebP/AVIF) · quality slider · download |
| `/compress` | Compress | Quality slider · before/after size comparison · download |
| `/color-picker` | Color Picker | Click-to-sample on image · HEX / RGB / HSL output · copy buttons |
| `/crop` | Crop | Free crop or ratio presets (1:1, 16:9, 4:3, 3:2) · drag handles · download |
| `/exif` | EXIF Viewer | Table of metadata: camera, lens, ISO, shutter, GPS, dates |

---

## Layout: Blog & About

- Blog index: Geist Mono date · title · excerpt, separated by hairlines
- Blog post: prose, max-width 680px, centered
- About: single-column prose, max-width 640px

---

## Technical Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Fonts | `next/font/google` — Geist + Geist Mono |
| Blog | MDX via `gray-matter` + `marked` |
| Analytics | GA4 via `next/script` afterInteractive |
| Image processing | Canvas API + browser-native APIs (client-side only) |
| OG images | Playwright `browser_run_code` |
| Deployment | Vercel → pixkit.yaro-labs.com |
| Repo | GitHub, repo named `pixkit` |

### Key Notes
- All image processing client-side via Canvas API — no server uploads
- Sidebar is a persistent layout component wrapping all pages
- No external UI libraries
- Tool pages at `app/resize/page.tsx`, `app/convert/page.tsx`, etc.
- Design reference: `/Users/a1111/Public/Prog/js/devkit/.superpowers/brainstorm/40054-1776278865/content/pixkit-final.html`

---

## Success Criteria

- Loads < 1s on Vercel edge (SSG)
- All 6 tools work offline via Canvas API
- Lighthouse accessibility ≥ 90
- OG images for homepage + each tool
- GA4 fires on page load and tool usage
