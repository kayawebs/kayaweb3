import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ToolDetailView from "@/components/tools/ToolDetailView";
import { getToolBySlug } from "@/lib/tools";
import { getToolPageMetadata, tools } from "@/lib/tool-i18n";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getToolPageMetadata(slug, "en") ?? {};
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  if (!getToolBySlug(slug)) {
    notFound();
  }

  return <ToolDetailView locale="en" slug={slug} />;
}
