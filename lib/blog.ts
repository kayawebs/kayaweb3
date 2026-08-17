import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogMeta = {
  title: string;
  date: string;
  category: string;
  slug: string;
  summary?: string;
  tags?: string[];
};

export type BlogPost = BlogMeta & {
  content: string;
};

export type BlogCategory = {
  slug: string;
  label: string;
  count: number;
  posts: BlogMeta[];
};

export function formatBlogCategory(category: string) {
  return category
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function getAllPosts(): BlogMeta[] {
  const categories = fs.readdirSync(CONTENT_DIR);

  const posts: BlogMeta[] = [];

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const stat = fs.statSync(categoryDir);
    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const fullPath = path.join(categoryDir, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(source);

      const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "");
      
      const date = data.date instanceof Date 
        ? data.date.toISOString().split('T')[0] 
        : data.date as string;

      posts.push({
        title: data.title as string,
        date,
        category: (data.category as string) ?? category,
        slug,
        summary: data.summary as string | undefined,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
      });
    }
  }

  // 按日期倒序
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsWithContent(): BlogPost[] {
  const categories = fs.readdirSync(CONTENT_DIR);
  const posts: BlogPost[] = [];

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const stat = fs.statSync(categoryDir);
    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const fullPath = path.join(categoryDir, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(source);

      const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "");

      const date = data.date instanceof Date
        ? data.date.toISOString().split("T")[0]
        : (data.date as string);

      posts.push({
        title: data.title as string,
        date,
        category: (data.category as string) ?? category,
        slug,
        summary: data.summary as string | undefined,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
        content,
      });
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: string): BlogMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getBlogCategories(): BlogCategory[] {
  const groups = new Map<string, BlogMeta[]>();

  for (const post of getAllPosts()) {
    const entries = groups.get(post.category) ?? [];
    entries.push(post);
    groups.set(post.category, entries);
  }

  return [...groups.entries()]
    .map(([slug, posts]) => ({
      slug,
      label: formatBlogCategory(slug),
      count: posts.length,
      posts,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getPost(category: string, slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  const date = data.date instanceof Date 
    ? data.date.toISOString().split('T')[0] 
    : data.date as string;

  return {
    title: data.title as string,
    date,
    category: (data.category as string) ?? category,
    slug: (data.slug as string) ?? slug,
    summary: data.summary as string | undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
    content,
  };
}
