import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
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
    <div className="app-shell-grid" style={{ minHeight: "100vh" }}>
      <Sidebar className="app-shell-sidebar" />
      <div className="app-shell-main" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
        <Topbar breadcrumbs={breadcrumbs} title={topbarTitle} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
