import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";
import { tools } from "@/lib/tools";

const STATIC_ROUTES = [
  "",
  "/blog",
  "/tools",
  "/zh/tools",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.95 : 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.flatMap((tool) => [
    {
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/zh/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ]);

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries];
}
