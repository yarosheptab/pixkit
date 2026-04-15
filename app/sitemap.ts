import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"

const BASE = "https://pixkit.yaro-labs.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/resize`,       priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/convert`,      priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/compress`,     priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/color-picker`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/crop`,         priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/exif`,         priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/blog`,         priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/about`,        priority: 0.5, changeFrequency: "yearly" },
  ]
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }))
  return [...staticRoutes, ...blogRoutes]
}
