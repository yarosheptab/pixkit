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
