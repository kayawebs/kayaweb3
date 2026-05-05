import Link from "next/link";

import { getToolPath, type ToolLocale } from "@/lib/tool-i18n";

type ToolLocaleSwitcherProps = {
  locale: ToolLocale;
  slug?: string;
};

const labels: Record<ToolLocale, string> = {
  en: "EN",
  zh: "中文",
};

export default function ToolLocaleSwitcher({ locale, slug }: ToolLocaleSwitcherProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {(["en", "zh"] as const).map((item) => {
        const active = item === locale;

        return (
          <Link
            key={item}
            href={getToolPath(item, slug)}
            className={`rounded border px-2 py-1 transition-colors ${
              active
                ? "border-[var(--terminal-accent)] text-[var(--terminal-accent)]"
                : "border-[var(--terminal-border)] text-[var(--terminal-muted)] hover:border-[var(--terminal-accent)] hover:text-[var(--foreground)]"
            }`}
          >
            {labels[item]}
          </Link>
        );
      })}
    </div>
  );
}
