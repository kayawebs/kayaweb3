import type { Metadata } from "next";

import ToolsIndexView from "@/components/tools/ToolsIndexView";
import { getToolUiText, getToolPath } from "@/lib/tool-i18n";

const ui = getToolUiText("en");

export const metadata: Metadata = {
  title: ui.indexMetaTitle,
  description: ui.indexMetaDescription,
  alternates: {
    canonical: getToolPath("en"),
    languages: {
      en: getToolPath("en"),
      zh: getToolPath("zh"),
    },
  },
};

export default function ToolsIndexPage() {
  return <ToolsIndexView locale="en" />;
}
