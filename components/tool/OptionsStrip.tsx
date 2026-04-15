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
