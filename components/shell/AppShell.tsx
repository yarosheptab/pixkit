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
