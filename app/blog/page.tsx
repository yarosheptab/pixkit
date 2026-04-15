import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { getAllPosts } from "@/lib/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and updates from the pixkit team.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Blog" }]}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: "32px" }}>
          Blog
        </h1>
        {posts.length === 0 && (
          <p style={{ color: "var(--muted-fg)", fontSize: "14px" }}>No posts yet.</p>
        )}
        <div>
          {posts.map((post, i) => (
            <div key={post.slug}>
              {i > 0 && <div style={{ height: "1px", background: "var(--border)" }} />}
              <Link href={`/blog/${post.slug}`} style={{ display: "block", padding: "20px 0", textDecoration: "none" }} className="blog-card-link">
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "6px" }}>
                  {post.datePublished} · {post.readTime}
                </div>
                <div className="blog-card-title" style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg)", marginBottom: "6px", letterSpacing: "-0.02em" }}>
                  {post.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--muted-fg)", lineHeight: 1.6 }}>
                  {post.description}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
