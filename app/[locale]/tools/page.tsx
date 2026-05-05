import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ToolsIndexView from "@/components/tools/ToolsIndexView";
import { getToolPath, getToolUiText, isToolLocale, type ToolLocale } from "@/lib/tool-i18n";

type LocalizedToolsIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return [{ locale: "zh" }];
}

export async function generateMetadata({ params }: LocalizedToolsIndexPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isToolLocale(locale) || locale === "en") {
    return {};
  }

  const ui = getToolUiText(locale);

  return {
    title: ui.indexMetaTitle,
    description: ui.indexMetaDescription,
    alternates: {
      canonical: getToolPath(locale),
      languages: {
        en: getToolPath("en"),
        zh: getToolPath("zh"),
      },
    },
  };
}

export default async function LocalizedToolsIndexPage({ params }: LocalizedToolsIndexPageProps) {
  const { locale } = await params;
  if (!isToolLocale(locale) || locale === "en") {
    notFound();
  }

  return <ToolsIndexView locale={locale as ToolLocale} />;
}
