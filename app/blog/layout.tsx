import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { template: "%s | pixkit Blog", default: "Blog | pixkit" },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
