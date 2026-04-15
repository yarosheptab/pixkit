import { notFound } from "next/navigation"
import { AppShell } from "@/components/shell/AppShell"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import type { Metadata } from "next"
import { marked } from "marked"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Content is from local markdown files only — safe to render as HTML
  const html = await Promise.resolve(marked(post.content))

  return (
    <AppShell breadcrumbs={[{ label: "pixkit", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--subtle)", marginBottom: "12px" }}>
          {post.datePublished} · {post.readTime}
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--fg)", marginBottom: "32px" }}>
          {post.title}
        </h1>
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </AppShell>
  )
}
