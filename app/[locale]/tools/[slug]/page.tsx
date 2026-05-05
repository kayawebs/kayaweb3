import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ToolDetailView from "@/components/tools/ToolDetailView";
import { getToolBySlug } from "@/lib/tools";
import { getToolPageMetadata, isToolLocale, tools, type ToolLocale } from "@/lib/tool-i18n";

type LocalizedToolPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return [{ locale: "zh" as const }].flatMap(({ locale }) => tools.map((tool) => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: LocalizedToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isToolLocale(locale) || locale === "en") {
    return {};
  }

  return getToolPageMetadata(slug, locale) ?? {};
}

export default async function LocalizedToolPage({ params }: LocalizedToolPageProps) {
  const { locale, slug } = await params;
  if (!isToolLocale(locale) || locale === "en" || !getToolBySlug(slug)) {
    notFound();
  }

  return <ToolDetailView locale={locale as ToolLocale} slug={slug} />;
}
