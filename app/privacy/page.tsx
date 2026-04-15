import { AppShell } from "@/components/shell/AppShell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How pixkit handles your data. All image processing runs in your browser — nothing is uploaded to our servers.",
}

export default function PrivacyPage() {
  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Privacy Policy" }]}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginBottom: "8px" }}>Last updated: 16 April 2026</p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "24px" }}>
          Privacy Policy
        </h1>

        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit.yaro-labs.com is operated by{" "}
          <a href="https://yaro-labs.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Yaro Labs</a>.
          This page explains what information we collect and how we use it.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Image processing
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          All image processing runs entirely in your browser using the Canvas API and WebAssembly.
          Your images are never uploaded to our servers. They never leave your device.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Analytics
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          We use Google Analytics 4 (GA4) to understand how visitors use pixkit — for example,
          which tools are used most often. GA4 sets cookies and may send data such as your
          approximate location, browser type, and pages visited to Google servers. You can
          opt out by declining the cookie banner or using the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Google Analytics Opt-out Browser Add-on</a>.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Cookie consent preference
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          When you interact with the cookie banner, your choice is stored in your browser&apos;s
          localStorage under the key <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", background: "var(--muted)", padding: "1px 5px", borderRadius: "3px" }}>pixkit-cookie-consent</code>.
          This data never leaves your device.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          No accounts or form data
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit has no user accounts, no sign-up forms, and no contact forms. We do not collect
          your name, email address, or any other personally identifiable information beyond what
          GA4 records automatically.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Data sharing
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          We do not sell or rent personal data to any third party. Analytics data is shared with
          Google solely for the purpose of operating GA4. No other third-party data processors
          are used.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Your rights
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          Depending on where you are located you may have rights to access, correct, or delete
          personal data held about you. Because we hold minimal data, most requests can be
          satisfied by clearing your browser&apos;s localStorage and opting out of GA4 via the
          add-on linked above.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Contact
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          Questions about this policy?{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>hello@yaro-labs.com</a>
        </p>
      </div>
    </AppShell>
  )
}
