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
    <div className="controls-panel-grid">
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
