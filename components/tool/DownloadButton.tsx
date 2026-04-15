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
