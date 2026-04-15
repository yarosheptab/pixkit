import { AppShell } from "@/components/shell/AppShell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies and local storage pixkit uses and how to manage them.",
}

export default function CookiesPage() {
  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Cookie Policy" }]}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginBottom: "8px" }}>Last updated: 16 April 2026</p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "24px" }}>
          Cookie Policy
        </h1>

        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          This page explains what cookies and browser storage pixkit uses, why, and how you can
          manage them.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Analytics cookies (GA4)
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "12px" }}>
          We use Google Analytics 4 to understand aggregate usage of pixkit — for example, which
          tools are most popular. GA4 sets the following cookies:
        </p>
        <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
          {[
            ["_ga", "2 years", "Distinguishes users for GA4 aggregated reporting."],
            ["_ga_*", "2 years", "Maintains session state for the GA4 measurement ID."],
          ].map(([name, duration, purpose]) => (
            <li key={name} style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", background: "var(--muted)", padding: "1px 5px", borderRadius: "3px", color: "var(--fg)" }}>{name}</code>{" "}
              <span style={{ color: "var(--subtle)" }}>({duration})</span> — {purpose}
            </li>
          ))}
        </ul>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          These cookies are only set if you accept the cookie banner. If you decline, GA4 is not
          loaded and no analytics cookies are written.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Cookie consent preference (localStorage)
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          When you interact with the cookie banner your choice (accepted or declined) is stored
          in your browser&apos;s localStorage under the key{" "}
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", background: "var(--muted)", padding: "1px 5px", borderRadius: "3px", color: "var(--fg)" }}>pixkit-cookie-consent</code>.
          This is not a cookie — it is local browser storage that never leaves your device and
          has no expiry.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          No other cookies
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit sets no other cookies. There are no session cookies, no advertising cookies, and
          no third-party tracking beyond GA4.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          How to manage cookies
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "12px" }}>
          You have several options:
        </p>
        <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
          <li style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>Cookie banner</strong> — decline cookies when prompted and GA4 will not be loaded.
          </li>
          <li style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>Browser settings</strong> — you can delete or block cookies in your browser&apos;s privacy settings at any time.
          </li>
          <li style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>GA4 opt-out</strong> — install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              Google Analytics Opt-out Browser Add-on
            </a>{" "}
            to prevent GA4 from collecting data across all sites.
          </li>
          <li style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "8px" }}>
            <strong style={{ color: "var(--fg)", fontWeight: 600 }}>Reset consent preference</strong> — open your browser&apos;s developer tools, go to Application &gt; Local Storage, and delete the{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", background: "var(--muted)", padding: "1px 5px", borderRadius: "3px", color: "var(--fg)" }}>pixkit-cookie-consent</code>{" "}
            key to see the banner again.
          </li>
        </ul>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Contact
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          Questions about cookies?{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>hello@yaro-labs.com</a>
        </p>
      </div>
    </AppShell>
  )
}
