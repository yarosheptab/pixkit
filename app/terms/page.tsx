import { AppShell } from "@/components/shell/AppShell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for pixkit, a free browser-based image utility suite by Yaro Labs.",
}

export default function TermsPage() {
  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Terms of Use" }]}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontSize: "12px", color: "var(--muted-fg)", marginBottom: "8px" }}>Last updated: 16 April 2026</p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "24px" }}>
          Terms of Use
        </h1>

        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit is a free, browser-based image tool suite operated by{" "}
          <a href="https://yaro-labs.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Yaro Labs</a>.
          By using pixkit you agree to these terms.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Permitted use
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          You may use pixkit for personal, educational, or commercial projects provided your use
          is lawful and does not violate the rights of others. You must not use pixkit to process
          images you do not have the right to use, or to facilitate illegal activity.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          No warranty
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          pixkit is provided &quot;as is&quot; without warranty of any kind, express or implied. Tool
          output — resized images, conversions, compressed files, EXIF data — is provided for
          informational and personal use. Yaro Labs makes no guarantee as to the accuracy,
          fitness for a particular purpose, or reliability of any output.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Limitation of liability
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          To the maximum extent permitted by law, Yaro Labs shall not be liable for any direct,
          indirect, incidental, or consequential damages arising from your use of pixkit or
          inability to use pixkit.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Intellectual property
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          The pixkit name, logo, and site design are the property of Yaro Labs. The images you
          process remain your property. We claim no ownership over files you load into pixkit.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Changes to these terms
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          We may update these terms from time to time. Continued use of pixkit after any changes
          constitutes acceptance of the revised terms. Material changes will be reflected in an
          updated &quot;Last updated&quot; date above.
        </p>

        <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg)", marginTop: "36px", marginBottom: "12px" }}>
          Contact
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--muted-fg)", marginBottom: "20px" }}>
          Questions about these terms?{" "}
          <a href="mailto:hello@yaro-labs.com" style={{ color: "var(--accent)" }}>hello@yaro-labs.com</a>
        </p>
      </div>
    </AppShell>
  )
}
