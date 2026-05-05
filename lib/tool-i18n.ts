import type { Metadata } from "next";

import { getRelatedTools, getToolBySlug, getToolSummary, getToolsByCategory, toolCategories, tools, type ToolCategoryKey } from "@/lib/tools";

export const toolLocales = ["en", "zh"] as const;

export type ToolLocale = (typeof toolLocales)[number];

export type ToolFaqItem = {
  question: string;
  answer: string;
};

export type ToolPageContent = {
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  exampleHeading: string;
  explanationHeading: string;
  faqHeading: string;
  relatedHeading: string;
  internalLinksHeading: string;
  example: readonly string[];
  explanation: string;
  faq: readonly ToolFaqItem[];
};

export function isToolLocale(value: string): value is ToolLocale {
  return toolLocales.includes(value as ToolLocale);
}

export function getToolPath(locale: ToolLocale, slug?: string) {
  if (locale === "en") {
    return slug ? `/tools/${slug}` : "/tools";
  }

  return slug ? `/${locale}/tools/${slug}` : `/${locale}/tools`;
}

function categoryLabels(locale: ToolLocale) {
  const map = {
    en: {
      "date-time": { title: "Date / Time", description: "Timestamp, timezone, duration, and calendar utilities." },
      dev: { title: "Dev / Encoding", description: "JSON, text, encoding, and debugging helpers." },
      finance: { title: "Finance", description: "Interest, ROI, tax, and portfolio math tools." },
      web3: { title: "Web3", description: "EVM, Bitcoin, PSBT, and on-chain analysis tools." },
      mini: { title: "Mini / Fun", description: "Quick tests, generators, and lightweight utilities." },
      "image-file": { title: "Image / File", description: "Image, PDF, and file conversion helpers." },
      ai: { title: "AI Light Tools", description: "Prompt and content formatting helpers." },
    },
    zh: {
      "date-time": { title: "日期 / 时间", description: "时间戳、时区、时长和日历相关工具。" },
      dev: { title: "开发 / 编码", description: "JSON、文本、编码和调试辅助工具。" },
      finance: { title: "金融", description: "利息、收益率、税费和投资计算工具。" },
      web3: { title: "Web3", description: "EVM、Bitcoin、PSBT 和链上分析工具。" },
      mini: { title: "轻工具 / 小游戏", description: "轻量测试、生成器和日常小工具。" },
      "image-file": { title: "图片 / 文件", description: "图片、PDF 和文件转换工具。" },
      ai: { title: "AI 轻工具", description: "Prompt 和文本整理相关工具。" },
    },
  } as const;

  return map[locale];
}

export function getLocalizedCategoryMeta(locale: ToolLocale) {
  const labels = categoryLabels(locale);

  return toolCategories.map((category) => ({
    ...category,
    title: labels[category.key].title,
    description: labels[category.key].description,
    count: getToolsByCategory(category.key).length,
  }));
}

export function getLocalizedTool(toolSlug: string, locale: ToolLocale) {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return null;

  return {
    ...tool,
    summary: getToolSummary(tool.slug, tool.category, locale),
  };
}

const UI_TEXT = {
  en: {
    statusLive: "live",
    statusPlanned: "planned",
    indexMetaTitle: "Developer Tools Hub | Kaya",
    indexMetaDescription: "Browse developer, date, finance, Web3, and utility tools in a fast terminal-style collection.",
    indexH1: "Tools",
    indexIntro:
      "A growing collection of fast, static, terminal-style tools for timestamps, developer workflows, finance math, Web3 analysis, and small daily utilities. The index is ready now; individual tool pages are being filled in progressively with working logic and search-focused copy.",
    indexCommand: "find . -type f",
    entries: "entries",
    language: "Language",
    allTools: "All tools",
    categorySuffix: "category",
    search: "Search",
    blog: "Blog",
    interactive: "interactive",
    scaffold: "scaffold",
    pending: "pending",
    pendingCopyPrefix: "The route, metadata, and internal linking are in place. The working browser-side utility for",
    pendingCopySuffix: "is the next implementation step.",
    usageFile: "usage.txt",
    guideFile: "README.md",
    internal: "internal",
    links: "links",
    recentTitle: "Recent",
    recentDescription: "Tools you opened recently in this browser.",
  },
  zh: {
    statusLive: "已上线",
    statusPlanned: "规划中",
    indexMetaTitle: "工具集合 | Kaya",
    indexMetaDescription: "浏览日期时间、开发、金融、Web3 等工具，统一 terminal 风格，静态快速加载。",
    indexH1: "工具集合",
    indexIntro:
      "这里会持续扩展一组静态、加载快、偏 terminal 风格的工具页，覆盖时间戳、开发辅助、金融计算、Web3 分析和日常轻工具。当前集合页和路由结构已经就绪，单个工具页会逐步补齐可用功能与 SEO 内容。",
    indexCommand: "find . -type f",
    entries: "个条目",
    language: "语言",
    allTools: "全部工具",
    categorySuffix: "分类",
    search: "搜索",
    blog: "博客",
    interactive: "可交互",
    scaffold: "骨架页",
    pending: "待补充",
    pendingCopyPrefix: "当前已经接好路由、metadata 和内部链接，",
    pendingCopySuffix: "的前端可用逻辑会在后续继续补上。",
    usageFile: "usage.txt",
    guideFile: "README.md",
    internal: "站内",
    links: "链接",
    recentTitle: "最近使用",
    recentDescription: "当前浏览器里最近打开过的工具。",
  },
} as const;

export function getToolUiText(locale: ToolLocale) {
  return UI_TEXT[locale];
}

const READY_TOOL_COPY = {
  en: {
    "json-minifier": {
      title: "JSON Minifier",
      seoTitle: "JSON Minifier | Kaya",
      description: "Minify JSON instantly by removing whitespace and compressing it into one line.",
      intro:
        "Use this JSON minifier to compress formatted JSON into a compact single-line string. It is useful for payload testing, storage checks, and API debugging.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Minifier Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste formatted JSON and turn it into a compact single-line payload.",
        "Minify config snippets before embedding them in a small transport field.",
        "Check how much whitespace can be removed from a JSON body.",
      ],
      explanation:
        "A JSON minifier removes indentation, line breaks, and extra whitespace from valid JSON so the content becomes as compact as possible. This is useful when testing APIs, preparing payloads for transport, or checking how a response or config file looks in its compressed form. The tool parses the JSON first and then rewrites it into a minimal one-line version, which means the structure stays valid while unnecessary formatting is removed. For developers working with request bodies, embedded config, or compressed examples, this is a quick browser-side utility.",
      faq: [
        {
          question: "Does minifying JSON change its data?",
          answer: "No. It only removes formatting whitespace while preserving the same JSON structure and values.",
        },
        {
          question: "Will invalid JSON still minify?",
          answer: "No. The input must parse as valid JSON first.",
        },
        {
          question: "When is minified JSON useful?",
          answer: "It is useful for compact payloads, transport, examples, and seeing the raw compressed form of a JSON document.",
        },
      ],
    },
    "json-escape-unescape": {
      title: "JSON Escape Unescape Tool",
      seoTitle: "JSON Escape Unescape | Kaya",
      description: "Escape JSON string content or unescape a JSON string back into readable text.",
      intro:
        "Use this JSON escape unescape tool to convert plain text into a JSON-safe string literal or restore an escaped JSON string back into readable text.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Escape Unescape Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Escape quotes and newlines before embedding text inside a JSON string value.",
        "Unescape a JSON string copied from logs or serialized output.",
        "Use it when testing how text is stored or transported inside JSON payloads.",
      ],
      explanation:
        "JSON escaping is used when text needs to live safely inside a JSON string literal. Characters like quotes, newlines, and backslashes must be escaped so the JSON remains valid. This tool supports both directions: escaping plain text into a JSON-safe string and unescaping a JSON string literal back into human-readable text. That makes it useful for debugging payloads, checking serialized values, and understanding how raw text is represented when embedded inside JSON. Because it runs entirely in the browser, you get immediate feedback while testing.",
      faq: [
        {
          question: "What does escaping do in JSON?",
          answer: "Escaping converts special characters like quotes and newlines into a form that can safely appear inside a JSON string literal.",
        },
        {
          question: "Can I reverse the process too?",
          answer: "Yes. The tool supports both escaping and unescaping.",
        },
        {
          question: "Why would unescaping fail?",
          answer: "It fails when the input is not a valid JSON string literal.",
        },
      ],
    },
    "word-character-counter": {
      title: "Word Character Counter",
      seoTitle: "Word Character Counter | Kaya",
      description: "Count words, characters, lines, and paragraphs in a block of text instantly.",
      intro:
        "Use this word character counter to measure text length instantly. It reports words, characters, non-space characters, lines, and paragraphs in one place.",
      exampleHeading: "Example Usage",
      explanationHeading: "Word Character Counter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check word count before publishing an article or note.",
        "Measure character count when working with UI limits, bios, or form constraints.",
        "Use line and paragraph counts while editing structured text.",
      ],
      explanation:
        "A word character counter gives you a quick way to measure text across several dimensions at once. Instead of counting only words, it can also show total characters, characters without spaces, line count, and paragraph count. This is useful for content writing, UI copy, form validation, and any workflow with text length constraints. Because the tool updates as you type, it is easy to test how edits affect the totals immediately. For developers and writers alike, that makes it a practical utility for checking text before publishing or submission.",
      faq: [
        {
          question: "Does it count spaces as characters?",
          answer: "Yes. It shows both total characters and a separate count that removes whitespace.",
        },
        {
          question: "How are paragraphs counted?",
          answer: "Paragraphs are counted by splitting text blocks separated by blank lines.",
        },
        {
          question: "Is this useful for UI length limits?",
          answer: "Yes. Character counts are helpful for bios, labels, input constraints, and copy checks.",
        },
      ],
    },
    "text-case-converter": {
      title: "Text Case Converter",
      seoTitle: "Text Case Converter | Kaya",
      description: "Convert text between lowercase, uppercase, title case, sentence case, and slug case.",
      intro:
        "Use this text case converter to switch text between several common styles, including lowercase, uppercase, title case, sentence case, and slug-friendly output.",
      exampleHeading: "Example Usage",
      explanationHeading: "Text Case Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert mixed text into title case for headings.",
        "Generate sentence case for cleaner content editing.",
        "Preview a slug-style version of the same text for URLs or IDs.",
      ],
      explanation:
        "A text case converter changes the capitalization style of a piece of text without altering its basic content. This is useful when editing headings, labels, blog titles, UI copy, IDs, or documentation snippets that need a consistent text style. Instead of rewriting strings manually, the tool generates multiple variants at once so you can pick the one you need. It is particularly handy when moving between design copy, developer identifiers, and URL-safe forms of the same phrase. Because the conversion is instant, it works well for quick experimentation and cleanup.",
      faq: [
        {
          question: "What case styles does it support?",
          answer: "It supports lowercase, uppercase, title case, sentence case, and a slug-style output.",
        },
        {
          question: "Can I use it for headings and labels?",
          answer: "Yes. It is useful for preparing UI copy, headings, and content titles.",
        },
        {
          question: "Is slug output the same as a full slug generator?",
          answer: "It gives a slug-like form, but a dedicated slug generator is better when URL formatting is the main goal.",
        },
      ],
    },
    "slug-generator": {
      title: "Slug Generator",
      seoTitle: "Slug Generator | Kaya",
      description: "Turn text into a clean URL-friendly slug instantly.",
      intro:
        "Use this slug generator to convert a title or phrase into a URL-friendly slug. It normalizes text, removes unsafe characters, and outputs a clean dash-separated result.",
      exampleHeading: "Example Usage",
      explanationHeading: "Slug Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert an article title into a URL-safe slug for publishing.",
        "Normalize text with punctuation before using it in links.",
        "Generate a clean slug for routes, filenames, or content IDs.",
      ],
      explanation:
        "A slug generator converts human-readable text into a compact URL-friendly format. This usually means lowercasing the text, removing or normalizing accents, replacing spaces and punctuation with dashes, and trimming extra separators. Slugs are commonly used in blog URLs, page routes, filenames, and content identifiers because they are readable and stable. This tool performs that conversion instantly in the browser, which makes it useful when drafting content, building route names, or cleaning up imported titles before publishing.",
      faq: [
        {
          question: "What is a slug?",
          answer: "A slug is a simplified text string used in URLs, routes, or identifiers, usually made of lowercase words separated by dashes.",
        },
        {
          question: "Does it remove punctuation and spaces?",
          answer: "Yes. It replaces unsafe characters and whitespace with a cleaner dash-separated form.",
        },
        {
          question: "Can I use the result in blog URLs?",
          answer: "Yes. That is one of the most common use cases for a slug generator.",
        },
      ],
    },
    "duplicate-line-remover": {
      title: "Duplicate Line Remover",
      seoTitle: "Duplicate Line Remover | Kaya",
      description: "Remove duplicate lines from text instantly while keeping the first occurrence.",
      intro:
        "Use this duplicate line remover to clean repeated lines from a text block. It can preserve the first occurrence, trim whitespace, and handle empty lines directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Duplicate Line Remover Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Remove repeated keywords or tags from a copied list.",
        "Clean duplicate rows from plain text exports before further processing.",
        "Normalize line-based inputs while keeping the first matching entry.",
      ],
      explanation:
        "A duplicate line remover scans text line by line and keeps only the first appearance of each unique entry. This is useful when you copy data from logs, spreadsheets, keyword lists, or text exports that contain repeated values. Instead of manually checking every line, the tool compares entries and removes duplicates instantly. Options such as case sensitivity, whitespace trimming, and empty-line handling help you match the exact cleanup behavior you want. Because the tool works entirely in the browser, it is fast enough for quick edits and safe for local text cleanup.",
      faq: [
        {
          question: "Does it preserve the first matching line?",
          answer: "Yes. The tool keeps the first occurrence and removes later duplicates.",
        },
        {
          question: "Can I ignore differences in uppercase and lowercase letters?",
          answer: "Yes. You can turn off case sensitivity to treat lines like the same value.",
        },
        {
          question: "What happens to blank lines?",
          answer: "You can choose whether empty lines stay in the result or are removed.",
        },
      ],
    },
    "line-sorter": {
      title: "Line Sorter",
      seoTitle: "Line Sorter | Kaya",
      description: "Sort lines of text instantly with ascending, descending, and cleanup options.",
      intro:
        "Use this line sorter to arrange text lines in ascending or descending order. It can trim whitespace, remove empty lines, and switch case sensitivity without leaving the page.",
      exampleHeading: "Example Usage",
      explanationHeading: "Line Sorter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Sort a list of words or IDs alphabetically before pasting into a config file.",
        "Clean line-based exports by trimming edges and removing empty rows.",
        "Reverse the order of items quickly for debugging or manual comparison.",
      ],
      explanation:
        "A line sorter takes plain text input, splits it into separate lines, and reorders those lines based on a chosen sort rule. This is useful for cleaning keyword lists, checking IDs, organizing copied logs, or preparing sorted config values. Instead of sorting text manually, you can paste the full list and get the result instantly. This version also lets you trim line edges, remove empty entries, and choose whether letter case matters. Those options make it more practical than a basic alphabetical sort when real-world input is messy.",
      faq: [
        {
          question: "Can I sort in reverse order?",
          answer: "Yes. You can switch between ascending and descending output.",
        },
        {
          question: "Will it remove empty lines automatically?",
          answer: "It can, but that behavior is optional and can be toggled on or off.",
        },
        {
          question: "Does it change the content of each line?",
          answer: "Only if you enable whitespace trimming. Otherwise the original line text is preserved and only the order changes.",
        },
      ],
    },
    "random-string-generator": {
      title: "Random String Generator",
      seoTitle: "Random String Generator | Kaya",
      description: "Generate random strings with custom length and character set options.",
      intro:
        "Use this random string generator to create one or more secure random strings in the browser. You can control the length, quantity, and allowed character sets.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random String Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate test IDs or placeholder secrets for development work.",
        "Create random strings that include letters, numbers, or symbols.",
        "Exclude ambiguous characters when sharing values manually with other people.",
      ],
      explanation:
        "A random string generator creates unpredictable text values from a set of allowed characters. This is useful for test data, temporary tokens, internal identifiers, invite codes, and other developer workflows where you need quick unique-looking strings. With configurable options, you can choose lowercase letters, uppercase letters, numbers, symbols, or a narrower set that avoids confusing characters such as O and 0. This tool uses the browser's cryptographic random source for instant output, which makes it more reliable than simple math-based random helpers.",
      faq: [
        {
          question: "Can I generate more than one string at a time?",
          answer: "Yes. The tool can output multiple strings in one run.",
        },
        {
          question: "Can I exclude confusing characters?",
          answer: "Yes. You can remove ambiguous characters such as 0, O, l, and 1.",
        },
        {
          question: "Does it work without a backend?",
          answer: "Yes. Generation happens directly in the browser using Web Crypto.",
        },
      ],
    },
    "binary-to-text": {
      title: "Binary to Text Converter",
      seoTitle: "Binary to Text Converter | Kaya",
      description: "Convert 8-bit binary bytes into readable text instantly.",
      intro:
        "Use this binary to text converter to decode 8-bit binary input into readable text. It accepts bytes separated by spaces, line breaks, or a continuous bit string grouped into bytes.",
      exampleHeading: "Example Usage",
      explanationHeading: "Binary to Text Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode a binary byte sequence copied from a coding exercise.",
        "Inspect simple binary payloads and turn them back into readable text.",
        "Paste a continuous binary string and let the tool regroup it into bytes automatically.",
      ],
      explanation:
        "A binary to text converter changes groups of 0 and 1 digits back into readable characters. In most simple cases, each character is represented as an 8-bit byte, so the tool reads each byte, converts it into a numeric value, and then decodes the full byte sequence as text. This is useful in programming lessons, low-level debugging, encoding demos, and quick inspection of small binary examples. The tool validates the input before decoding so incomplete or invalid byte groups are caught immediately instead of producing confusing output.",
      faq: [
        {
          question: "What binary format does it expect?",
          answer: "It expects 8-bit byte groups made only of 0 and 1 digits.",
        },
        {
          question: "Can I paste a single long binary string?",
          answer: "Yes. If the total length is divisible by 8, the tool will regroup it into bytes automatically.",
        },
        {
          question: "Why do I get an invalid input message?",
          answer: "That usually means one or more groups are not exactly 8 bits long or contain characters other than 0 and 1.",
        },
      ],
    },
    "text-to-binary": {
      title: "Text to Binary Converter",
      seoTitle: "Text to Binary Converter | Kaya",
      description: "Convert plain text into 8-bit binary bytes instantly.",
      intro:
        "Use this text to binary converter to turn plain text into binary bytes. It encodes the input in the browser and can output bytes separated by spaces or line breaks.",
      exampleHeading: "Example Usage",
      explanationHeading: "Text to Binary Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a short word into binary bytes for learning or debugging.",
        "Preview how text is represented as bytes before decoding it elsewhere.",
        "Switch between space-separated and line-separated binary output formats.",
      ],
      explanation:
        "A text to binary converter takes normal characters and shows the byte-level binary representation behind them. Each byte is displayed as eight 0/1 digits, which makes the result easy to inspect when learning about encodings or testing byte-based workflows. This is useful in programming exercises, protocol demos, and debugging situations where you want to understand how a string maps to bytes. Because the conversion runs immediately in the browser, you can change the input and compare output formats without waiting or sending data anywhere.",
      faq: [
        {
          question: "Does it output 8-bit groups?",
          answer: "Yes. Each byte is shown as an 8-bit binary value.",
        },
        {
          question: "Can I put each byte on its own line?",
          answer: "Yes. You can switch between space-separated and line-separated output.",
        },
        {
          question: "Is this useful for non-English text too?",
          answer: "Yes. The tool encodes text as UTF-8 bytes, so non-English characters can also be represented.",
        },
      ],
    },
    "unicode-converter": {
      title: "Unicode Converter",
      seoTitle: "Unicode Converter | Kaya",
      description: "Convert text into Unicode code points or decode Unicode escapes instantly.",
      intro:
        "Use this Unicode converter to switch between readable text and Unicode representations such as U+ codes, escape sequences, and common HTML entities.",
      exampleHeading: "Example Usage",
      explanationHeading: "Unicode Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Turn text into Unicode code points when debugging encoded strings.",
        "Decode copied escape sequences like \\u4F60\\u597D back into readable characters.",
        "Inspect emoji or multilingual content as Unicode values.",
      ],
      explanation:
        "A Unicode converter helps you move between plain text and the encoded representations often seen in source code, logs, payloads, and HTML. This is useful when you need to inspect escape sequences, confirm the code points behind a character, or decode values copied from APIs and serialized output. Instead of doing those conversions manually, the tool can show Unicode values for text or reverse them back into readable characters. That makes it practical for debugging multilingual strings, emoji, escaped JSON content, and frontend rendering issues.",
      faq: [
        {
          question: "What formats can it decode?",
          answer: "It can decode common Unicode escapes, U+ code point values, and basic HTML numeric entities.",
        },
        {
          question: "Can it handle emoji and non-English text?",
          answer: "Yes. It works with regular Unicode characters, including emoji and multilingual text.",
        },
        {
          question: "Why would I need a Unicode converter?",
          answer: "It is useful when debugging escaped strings, encoded payloads, or character rendering problems.",
        },
      ],
    },
    "text-diff-checker": {
      title: "Text Diff Checker",
      seoTitle: "Text Diff Checker | Kaya",
      description: "Compare two text blocks line by line and inspect additions or removals.",
      intro:
        "Use this text diff checker to compare two text blocks and highlight which lines stayed the same, were removed, or were added.",
      exampleHeading: "Example Usage",
      explanationHeading: "Text Diff Checker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Compare two config snippets before deploying a change.",
        "Inspect the line differences between old and updated content.",
        "Review copied lists or docs without using a command-line diff tool.",
      ],
      explanation:
        "A text diff checker compares two versions of text and shows how they differ line by line. This is useful when reviewing content changes, checking copied lists, comparing configuration fragments, or inspecting quick edits without opening Git or a local diff viewer. Instead of manually scanning two blocks of text, the tool separates unchanged lines from added and removed lines and summarizes the result immediately. For developers, writers, and operators, this is a fast way to spot what changed before moving on to more formal review tools.",
      faq: [
        {
          question: "Does it compare line by line or character by character?",
          answer: "This version focuses on line-by-line differences, which is better for copied text blocks and config snippets.",
        },
        {
          question: "Can I use it for short notes or long lists?",
          answer: "Yes. It works for both, as long as the content is line-based text.",
        },
        {
          question: "Does it require a backend?",
          answer: "No. The comparison runs directly in the browser.",
        },
      ],
    },
    "regex-tester": {
      title: "Regex Tester",
      seoTitle: "Regex Tester | Kaya",
      description: "Test regular expressions instantly and inspect matches with positions and groups.",
      intro:
        "Use this regex tester to try a pattern against sample text, adjust flags, and inspect every match directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Regex Tester Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Test a validation pattern before adding it to a form or parser.",
        "Inspect match positions and captured groups while debugging a regex.",
        "Try different flags such as global or case-insensitive without leaving the page.",
      ],
      explanation:
        "A regex tester helps you check whether a regular expression behaves the way you expect on real input. Instead of writing code and rerunning it repeatedly, you can paste a pattern, provide flags, add sample text, and review the matches instantly. This is especially useful when debugging validation rules, search patterns, parsers, or log filters. Because the tool shows individual matches and captured groups, it is easier to understand what your pattern is actually selecting and where it may be too broad or too strict.",
      faq: [
        {
          question: "Can I test regex flags too?",
          answer: "Yes. You can enter common JavaScript flags such as g, i, and m.",
        },
        {
          question: "Does it show capture groups?",
          answer: "Yes. Captured groups are listed for each match when they exist.",
        },
        {
          question: "Why does it say the regex is invalid?",
          answer: "That usually means the pattern syntax or flag combination is not valid in JavaScript.",
        },
      ],
    },
    "regex-replace-tool": {
      title: "Regex Replace Tool",
      seoTitle: "Regex Replace Tool | Kaya",
      description: "Run regex-based find and replace in the browser with instant output.",
      intro:
        "Use this regex replace tool to search with a regular expression and replace matches immediately. You can control both the pattern and the flags.",
      exampleHeading: "Example Usage",
      explanationHeading: "Regex Replace Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Replace repeated whitespace with dashes when preparing slugs or IDs.",
        "Clean structured text using capture groups and regex replacements.",
        "Preview a transformation before using the same regex in code.",
      ],
      explanation:
        "A regex replace tool lets you apply regular expression search and replacement rules to text without writing a script. This is useful for content cleanup, pattern-based renaming, quick data shaping, and debugging replacement logic before embedding it in code. By changing the pattern, flags, and replacement string, you can test how a regex transforms your input in real time. That makes it especially helpful for developers and content editors who often need small but precise text transformations.",
      faq: [
        {
          question: "Can I use regex flags during replacement?",
          answer: "Yes. You can provide JavaScript regex flags such as g or i.",
        },
        {
          question: "Does it update the output instantly?",
          answer: "Yes. The replacement result updates as soon as the input or pattern changes.",
        },
        {
          question: "Can I test replacement patterns before coding them?",
          answer: "Yes. That is one of the main reasons to use a browser-based regex replace tool.",
        },
      ],
    },
    "hash-generator-md5-sha256": {
      title: "MD5 SHA-256 Hash Generator",
      seoTitle: "MD5 SHA-256 Hash Generator | Kaya",
      description: "Generate MD5 and SHA-256 hashes for any text input instantly.",
      intro:
        "Use this MD5 SHA-256 hash generator to create common text hashes in the browser. It returns both hash values immediately as you type.",
      exampleHeading: "Example Usage",
      explanationHeading: "MD5 SHA-256 Hash Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Hash a short test string while checking backend and frontend parity.",
        "Generate both MD5 and SHA-256 values for quick debugging or verification.",
        "Compare hash outputs when testing signatures, fixtures, or content checks.",
      ],
      explanation:
        "A hash generator converts text into a fixed-length fingerprint that changes when the input changes. MD5 and SHA-256 are two common algorithms used in development, debugging, checksums, fixture preparation, and compatibility testing. This tool lets you generate both values side by side in the browser, which makes it easy to compare outputs without switching between scripts or terminal commands. While MD5 is older and not suitable for secure password storage, it still appears in legacy workflows and checksum examples, so having both algorithms in one place is useful.",
      faq: [
        {
          question: "What is the difference between MD5 and SHA-256?",
          answer: "SHA-256 is stronger and more modern, while MD5 is older and mostly used for legacy compatibility or simple checksums.",
        },
        {
          question: "Can I use MD5 for password security?",
          answer: "No. MD5 is not appropriate for secure password storage.",
        },
        {
          question: "Does the hashing happen locally?",
          answer: "Yes. The hashes are generated directly in the browser.",
        },
      ],
    },
    "hex-to-string-converter": {
      title: "Hex to String Converter",
      seoTitle: "Hex to String Converter | Kaya",
      description: "Convert hexadecimal bytes into readable UTF-8 text instantly.",
      intro:
        "Use this hex to string converter to decode hexadecimal input into readable text. It accepts compact hex strings or byte pairs separated by spaces.",
      exampleHeading: "Example Usage",
      explanationHeading: "Hex to String Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode copied hex bytes from logs or packet examples into readable text.",
        "Inspect simple UTF-8 payloads stored in hexadecimal form.",
        "Paste space-separated bytes or a continuous hex string and decode them instantly.",
      ],
      explanation:
        "A hex to string converter turns hexadecimal byte values back into readable text. This is useful when you are inspecting encoded payloads, debugging byte-oriented data, or checking how a string is represented in hexadecimal form. Instead of decoding each byte manually, the tool groups the input into byte pairs, validates the format, and converts the bytes into UTF-8 text directly in the browser. That makes it a fast helper for debugging APIs, test fixtures, protocol examples, and simple encoding exercises.",
      faq: [
        {
          question: "What input format does it accept?",
          answer: "It accepts hexadecimal characters in pairs, either as one continuous string or separated by spaces.",
        },
        {
          question: "Why does it say the input is invalid?",
          answer: "That usually means the input contains non-hex characters or an odd number of characters.",
        },
        {
          question: "Can it decode UTF-8 text?",
          answer: "Yes. The tool decodes the byte sequence as UTF-8 text.",
        },
      ],
    },
    "string-to-hex-converter": {
      title: "String to Hex Converter",
      seoTitle: "String to Hex Converter | Kaya",
      description: "Convert plain text into hexadecimal bytes for quick encoding checks.",
      intro:
        "Use this string to hex converter to turn plain text into hexadecimal byte output. You can also switch to a space-separated byte format for easier reading.",
      exampleHeading: "Example Usage",
      explanationHeading: "String to Hex Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a text snippet into hex before sending it to a byte-oriented system.",
        "Inspect how UTF-8 text maps to byte values.",
        "Generate spaced hex output when you need clearer byte-by-byte debugging.",
      ],
      explanation:
        "A string to hex converter shows the hexadecimal byte representation of a text input. This is helpful when you are working with protocols, payloads, encodings, fixtures, or low-level debugging where byte values matter more than characters. Instead of looking up character codes manually, the tool encodes the text as UTF-8 and returns the resulting bytes in hexadecimal form. Because it runs instantly in the browser, it is useful for quick checks during development, debugging, and data transformation tasks.",
      faq: [
        {
          question: "Does it output bytes or character codes?",
          answer: "It outputs UTF-8 bytes represented in hexadecimal form.",
        },
        {
          question: "Can I make the hex output easier to read?",
          answer: "Yes. You can switch to a space-separated byte format.",
        },
        {
          question: "Is this useful for non-English text too?",
          answer: "Yes. The converter works with UTF-8, so multilingual text can also be represented.",
        },
      ],
    },
    "jwt-decoder": {
      title: "JWT Decoder",
      seoTitle: "JWT Decoder | Kaya",
      description: "Decode JWT header and payload values instantly in the browser.",
      intro:
        "Use this JWT decoder to inspect a token's header and payload without sending it anywhere. It decodes Base64URL segments and shows common metadata such as timestamps.",
      exampleHeading: "Example Usage",
      explanationHeading: "JWT Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a JWT to inspect header fields such as alg and typ.",
        "Read payload claims like sub, exp, and iat while debugging auth flows.",
        "Check whether a token has a signature section and how long it is.",
      ],
      explanation:
        "A JWT decoder helps you inspect the readable parts of a JSON Web Token without verifying the signature or calling a backend service. JWTs are commonly used in authentication and API workflows, and they contain a header, a payload, and usually a signature segment. This tool decodes the Base64URL-encoded header and payload in the browser, formats them as JSON, and surfaces common metadata such as issue time or expiration time when present. That makes it convenient for debugging tokens, checking claims, and understanding what a JWT contains during development.",
      faq: [
        {
          question: "Does this tool verify the JWT signature?",
          answer: "No. It decodes the token structure but does not verify the signature.",
        },
        {
          question: "Can I inspect exp and iat fields?",
          answer: "Yes. Common timestamp claims are displayed in a readable format when present.",
        },
        {
          question: "Is it safe to use without a backend?",
          answer: "Yes. Decoding happens locally in the browser.",
        },
      ],
    },
    "json-flatten-tool": {
      title: "JSON Flatten Tool",
      seoTitle: "JSON Flatten Tool | Kaya",
      description: "Flatten nested JSON into dot-path key/value pairs instantly.",
      intro:
        "Use this JSON flatten tool to convert nested JSON objects and arrays into a flat structure of path-based keys and values.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Flatten Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Flatten nested API payloads before mapping them into tables or key-value views.",
        "Inspect deep object paths without expanding a large JSON tree manually.",
        "Convert arrays and objects into a simpler path-based structure for debugging.",
      ],
      explanation:
        "A JSON flatten tool takes nested JSON data and rewrites it into a simpler object where each key describes the original path. This is useful when you need a compact view of deep structures, want to compare fields more easily, or need path/value pairs for exports and debugging. Instead of expanding every object and array manually, the tool walks through the structure and produces readable keys that point to each terminal value. That makes it easier to inspect large payloads and reason about nested data quickly.",
      faq: [
        {
          question: "How are nested paths represented?",
          answer: "Object keys use dot notation, and arrays use bracket indexes such as items[0].name.",
        },
        {
          question: "Does it work with arrays too?",
          answer: "Yes. Arrays are flattened using index-based paths.",
        },
        {
          question: "Will it change my JSON values?",
          answer: "No. It only changes the structure used to display the data.",
        },
      ],
    },
    "json-diff-viewer": {
      title: "JSON Diff Viewer",
      seoTitle: "JSON Diff Viewer | Kaya",
      description: "Compare two JSON documents and inspect added, removed, or changed paths.",
      intro:
        "Use this JSON diff viewer to compare two JSON inputs and highlight which flattened paths were added, removed, or changed.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Diff Viewer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Compare API responses before and after a code change.",
        "Inspect which fields changed between two JSON payload versions.",
        "Review added or removed paths in config objects without using command-line tools.",
      ],
      explanation:
        "A JSON diff viewer helps you understand how two JSON documents differ without manually scanning nested structures. This version flattens both inputs into path-based keys, then compares those paths to show what was added, removed, or changed. That makes the output easier to scan when payloads contain deep nesting or arrays. It is useful for API debugging, config review, fixture updates, and general development work where JSON changes need to be understood quickly.",
      faq: [
        {
          question: "Does it compare nested JSON too?",
          answer: "Yes. Nested objects and arrays are flattened into comparable paths before diffing.",
        },
        {
          question: "What kinds of changes does it show?",
          answer: "It shows added paths, removed paths, and paths whose values changed.",
        },
        {
          question: "Do both inputs need to be valid JSON?",
          answer: "Yes. The diff runs only after both sides parse successfully.",
        },
      ],
    },
    "json-to-csv-converter": {
      title: "JSON to CSV Converter",
      seoTitle: "JSON to CSV Converter | Kaya",
      description: "Convert JSON arrays or objects into CSV rows instantly.",
      intro:
        "Use this JSON to CSV converter to turn structured JSON data into CSV output. It works well for arrays of objects and flattens nested values into path-based columns.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON to CSV Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert API response objects into CSV before importing them into a spreadsheet.",
        "Flatten nested JSON rows into dot-path columns for easier exports.",
        "Turn a JSON array into a quick table format without using a backend.",
      ],
      explanation:
        "A JSON to CSV converter helps you move structured data into a tabular format that is easier to share, inspect, or import into spreadsheets. This is useful when you have arrays of objects from APIs, configs, or exports and want a simple row-and-column view. This tool reads the JSON in the browser, flattens nested fields into path-based headers, and outputs CSV instantly. That makes it convenient for debugging, lightweight reporting, and quick data reshaping without relying on scripts or external services.",
      faq: [
        {
          question: "What JSON structure works best here?",
          answer: "It works best with an array of objects, but a single object can also be converted as one row.",
        },
        {
          question: "How are nested fields handled?",
          answer: "Nested values are flattened into dot-path or indexed column names.",
        },
        {
          question: "Does the conversion happen locally?",
          answer: "Yes. The JSON is parsed and converted directly in the browser.",
        },
      ],
    },
    "csv-to-json-converter": {
      title: "CSV to JSON Converter",
      seoTitle: "CSV to JSON Converter | Kaya",
      description: "Convert CSV data with headers into structured JSON instantly.",
      intro:
        "Use this CSV to JSON converter to turn table-like CSV data into structured JSON. It reads the header row as object keys and can infer common value types.",
      exampleHeading: "Example Usage",
      explanationHeading: "CSV to JSON Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert spreadsheet-exported CSV rows into JSON objects for development work.",
        "Parse a simple CSV table into API-friendly structured data.",
        "Infer booleans and numbers automatically when preparing mock payloads.",
      ],
      explanation:
        "A CSV to JSON converter changes table-style CSV input into a list of JSON objects, using the first row as field names. This is useful when you need to move spreadsheet data into code, APIs, fixtures, or config files. Instead of manually mapping each column, the tool reads the header row and converts every following row into a structured object. With optional type inference, it can also detect simple numbers, booleans, and null values. That makes it a practical browser-side helper for quick data transformation tasks.",
      faq: [
        {
          question: "Does the CSV need a header row?",
          answer: "Yes. The first row is used as the key list for generated JSON objects.",
        },
        {
          question: "Can it infer types like numbers and booleans?",
          answer: "Yes. You can enable type inference to convert common scalar values automatically.",
        },
        {
          question: "Does it support quoted CSV values?",
          answer: "Yes. The parser handles common quoted cell formats, including escaped quotes.",
        },
      ],
    },
    "xml-to-json-converter": {
      title: "XML to JSON Converter",
      seoTitle: "XML to JSON Converter | Kaya",
      description: "Convert XML nodes, text, and attributes into readable JSON.",
      intro:
        "Use this XML to JSON converter to turn XML content into structured JSON. It preserves attributes, text nodes, and repeated child elements in a readable form.",
      exampleHeading: "Example Usage",
      explanationHeading: "XML to JSON Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert an XML API response into JSON before inspecting it in frontend code.",
        "Check how XML attributes and child nodes map into a JSON-like structure.",
        "Turn repeated XML tags into array-like JSON output for debugging.",
      ],
      explanation:
        "An XML to JSON converter helps you inspect XML content in a structure that is often easier for JavaScript and modern frontend workflows to work with. Instead of reading nested XML tags manually, the tool parses the document, keeps attributes in a dedicated field, preserves text content, and groups repeated child tags into arrays when needed. That makes it useful for debugging XML APIs, migration work, older integrations, and any case where you need a quick browser-side view of XML data in JSON form.",
      faq: [
        {
          question: "Are XML attributes preserved?",
          answer: "Yes. Attributes are kept under a dedicated attributes field in the output.",
        },
        {
          question: "What happens to repeated child nodes?",
          answer: "Repeated nodes with the same tag name are grouped into arrays.",
        },
        {
          question: "Does it require a backend parser?",
          answer: "No. The conversion uses the browser's XML parser directly.",
        },
      ],
    },
    "yaml-to-json-converter": {
      title: "YAML to JSON Converter",
      seoTitle: "YAML to JSON Converter | Kaya",
      description: "Convert common YAML objects and lists into JSON instantly.",
      intro:
        "Use this YAML to JSON converter to turn common YAML mappings and lists into structured JSON. It supports the most common indentation-based object and array patterns.",
      exampleHeading: "Example Usage",
      explanationHeading: "YAML to JSON Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a small YAML config into JSON before using it in a JavaScript app.",
        "Inspect nested YAML objects and arrays in a more familiar JSON format.",
        "Quickly reshape hand-written YAML notes into structured frontend data.",
      ],
      explanation:
        "A YAML to JSON converter is useful when you need to move configuration or structured notes from YAML into a format that JavaScript tools and APIs use more naturally. This tool focuses on common YAML shapes such as nested mappings, lists, booleans, numbers, and null values. It reads the indentation-based structure in the browser and outputs pretty-printed JSON immediately. That makes it a good fit for lightweight config inspection, frontend prototyping, and quick data cleanup without extra dependencies.",
      faq: [
        {
          question: "What YAML features does it support?",
          answer: "It supports common object mappings, lists, numbers, booleans, null values, and nested indentation-based structures.",
        },
        {
          question: "Why might parsing fail?",
          answer: "Parsing usually fails when the YAML indentation is inconsistent or uses features outside the supported subset.",
        },
        {
          question: "Is it meant for large production YAML files?",
          answer: "It is best suited for common small-to-medium YAML snippets used in day-to-day development work.",
        },
      ],
    },
    "percentage-calculator": {
      title: "Percentage Calculator",
      seoTitle: "Percentage Calculator | Kaya",
      description: "Calculate percentages, percent-of-total values, and reverse totals instantly.",
      intro:
        "Use this percentage calculator to solve common percentage problems quickly, including finding what percent one value is of another, computing a percentage of a total, and reversing a percentage to find the original total.",
      exampleHeading: "Example Usage",
      explanationHeading: "Percentage Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Find what percent 25 is of 200.",
        "Calculate 15% of a total value without doing the math by hand.",
        "Reverse a percentage to estimate the original total from a partial value.",
      ],
      explanation:
        "A percentage calculator helps with some of the most common everyday finance and math questions. You might want to know what percentage one value is of another, how much a certain percentage of a total equals, or what the original total was before a percentage was applied. Instead of switching formulas in your head, this tool shows several percentage relationships at once. That makes it useful for budgeting, pricing, reports, grade math, sales analysis, and many other quick calculations.",
      faq: [
        {
          question: "Can it calculate multiple percentage formulas at once?",
          answer: "Yes. It shows common results such as part-of-total, percent-of-total, and reverse total calculation.",
        },
        {
          question: "Why does total need to be above zero?",
          answer: "Because percentage division depends on a nonzero base total.",
        },
        {
          question: "Is this useful beyond finance?",
          answer: "Yes. Percentage math is common in reports, statistics, grades, and many everyday calculations.",
        },
      ],
    },
    "discount-calculator": {
      title: "Discount Calculator",
      seoTitle: "Discount Calculator | Kaya",
      description: "Calculate discount savings and final sale price instantly.",
      intro:
        "Use this discount calculator to find the savings amount and final price after applying a percentage discount to an original price.",
      exampleHeading: "Example Usage",
      explanationHeading: "Discount Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check the final sale price before buying a discounted product.",
        "See how much money a 20% discount actually saves.",
        "Quickly compare multiple deals using the same original price.",
      ],
      explanation:
        "A discount calculator helps you understand how a percentage discount changes the final price of a product or service. Instead of estimating mentally, you can enter the original price and discount rate to see both the money saved and the reduced total. This is useful for shopping, pricing comparisons, promotions, invoices, and business offers. Because the calculation updates instantly, it is easy to test different discount rates and understand the real impact of a sale or markdown.",
      faq: [
        {
          question: "What does the calculator show?",
          answer: "It shows both the savings amount and the final price after the discount.",
        },
        {
          question: "Can I use decimal prices?",
          answer: "Yes. The calculator supports decimal values such as 199.99.",
        },
        {
          question: "Is a discount the same as a percentage off?",
          answer: "Yes. A percentage discount means a percentage is subtracted from the original price.",
        },
      ],
    },
    "profit-loss-calculator": {
      title: "Profit Loss Calculator",
      seoTitle: "Profit Loss Calculator | Kaya",
      description: "Calculate profit or loss amounts and margin percentage from trade values.",
      intro:
        "Use this profit loss calculator to measure profit or loss from a buy price, sell price, and quantity. It returns both the total amount and the percentage change relative to cost.",
      exampleHeading: "Example Usage",
      explanationHeading: "Profit Loss Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check the total profit from selling an item above cost.",
        "Calculate the loss percentage on a trade that sold below purchase price.",
        "Estimate per-unit and overall results before closing a position.",
      ],
      explanation:
        "A profit loss calculator helps you understand how much money you made or lost from a transaction. By entering a cost price, a sell price, and a quantity, you can see the gain or loss per unit, the overall result, and the percentage change relative to the original cost. This is useful for product sales, inventory checks, small trading decisions, and general business math. It gives you a clearer picture than looking at prices alone because it combines unit economics with total outcome.",
      faq: [
        {
          question: "Does it work for losses too?",
          answer: "Yes. If the sell price is below cost, the result becomes a loss automatically.",
        },
        {
          question: "What percentage does it show?",
          answer: "It shows the change relative to the cost price.",
        },
        {
          question: "Why do cost and quantity need to be above zero?",
          answer: "Because the calculator uses cost as the percentage base and quantity as the total multiplier.",
        },
      ],
    },
    "roi-calculator": {
      title: "ROI Calculator",
      seoTitle: "ROI Calculator | Kaya",
      description: "Calculate return on investment and net profit from cost and return values.",
      intro:
        "Use this ROI calculator to measure how much profit an investment generated and what that gain represents as a percentage of the original cost.",
      exampleHeading: "Example Usage",
      explanationHeading: "ROI Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Calculate the ROI of a project from its total cost and return value.",
        "Check whether an investment earned a positive or negative return.",
        "Compare two investment options using the same ROI formula.",
      ],
      explanation:
        "An ROI calculator measures return on investment by comparing how much you put in with how much you got back. It gives you both the net profit and the ROI percentage, which makes it easier to compare outcomes across projects, campaigns, or investments of different sizes. This is useful in business analysis, freelance work, marketing spend reviews, and personal finance planning. Instead of only looking at gross return, ROI helps you judge whether the gain was meaningful relative to the original cost.",
      faq: [
        {
          question: "What does ROI mean?",
          answer: "ROI stands for return on investment, which shows profit relative to the original investment cost.",
        },
        {
          question: "Can ROI be negative?",
          answer: "Yes. If return value is below investment cost, the ROI will be negative.",
        },
        {
          question: "Why must investment cost be above zero?",
          answer: "Because ROI is measured as a percentage of the original investment amount.",
        },
      ],
    },
    "compound-interest-calculator": {
      title: "Compound Interest Calculator",
      seoTitle: "Compound Interest Calculator | Kaya",
      description: "Estimate compound growth with recurring monthly contributions.",
      intro:
        "Use this compound interest calculator to project future value from a starting principal, annual rate, compounding frequency, investment length, and optional monthly contributions.",
      exampleHeading: "Example Usage",
      explanationHeading: "Compound Interest Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how a savings balance grows over 10 years at a fixed annual rate.",
        "See how monthly contributions change long-term compound growth.",
        "Compare contribution plans and compounding frequencies for a simple forecast.",
      ],
      explanation:
        "A compound interest calculator helps you estimate how money grows when returns are reinvested over time. By combining a starting amount, an annual interest rate, a compounding schedule, and an optional monthly contribution, the tool can show projected future value, total contributions, and interest earned. This is useful for savings plans, investment forecasts, retirement planning, and long-term budgeting. Because compounding can make small differences grow significantly over time, seeing the numbers together is often much more helpful than using a rough mental estimate.",
      faq: [
        {
          question: "What is compound interest?",
          answer: "Compound interest means earnings are added back to the balance, so future growth happens on both the original amount and past gains.",
        },
        {
          question: "Do monthly contributions matter a lot?",
          answer: "Yes. Regular contributions can have a large effect on long-term growth, especially over many years.",
        },
        {
          question: "Is this a guaranteed forecast?",
          answer: "No. It is a mathematical projection based on the rate and assumptions you enter.",
        },
      ],
    },
    "dca-investment-calculator": {
      title: "DCA Investment Calculator",
      seoTitle: "DCA Investment Calculator | Kaya",
      description: "Calculate average cost, units accumulated, and current value from recurring buys.",
      intro:
        "Use this DCA investment calculator to estimate average cost basis, accumulated units, current value, and profit or loss from repeated equal-sized buys.",
      exampleHeading: "Example Usage",
      explanationHeading: "DCA Investment Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Model a recurring crypto or stock purchase plan with the same budget each time.",
        "See how buying through price dips changes average cost per unit.",
        "Compare total invested capital with current market value.",
      ],
      explanation:
        "A DCA investment calculator helps you evaluate dollar-cost averaging, where you invest the same amount at different prices over time. Instead of trying to time the market with one large purchase, you spread buys across multiple entries. This tool estimates total invested capital, total units accumulated, average cost per unit, current portfolio value, and profit or loss based on a current price. That makes it useful for long-term investing, crypto accumulation, and scenario planning. Seeing how lower and higher buy prices combine into one blended cost basis is often more useful than looking at each trade separately.",
      faq: [
        {
          question: "What does DCA stand for?",
          answer: "DCA means dollar-cost averaging, a strategy where you invest the same amount on a repeating schedule.",
        },
        {
          question: "Why use equal buy amounts instead of equal units?",
          answer: "Equal amounts are the usual DCA approach because they automatically buy more units when price is low and fewer when price is high.",
        },
        {
          question: "Can I use this for crypto and stocks?",
          answer: "Yes. The math works for any asset where you track buy prices and a current market price.",
        },
      ],
    },
    "simple-interest-calculator": {
      title: "Simple Interest Calculator",
      seoTitle: "Simple Interest Calculator | Kaya",
      description: "Calculate simple interest, total interest earned, and final amount.",
      intro:
        "Use this simple interest calculator to estimate interest earned from a principal, annual rate, and time period without compound growth.",
      exampleHeading: "Example Usage",
      explanationHeading: "Simple Interest Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how much interest a fixed deposit earns over 3 years.",
        "Check the final amount for a loan or savings example using simple interest.",
        "Compare simple interest with compound interest for basic planning.",
      ],
      explanation:
        "A simple interest calculator shows how much interest builds up when interest is calculated only on the original principal. You enter the starting amount, annual rate, and time period, and the tool returns the interest earned plus the final amount. This is useful for basic loans, classroom examples, short-term savings, and quick comparisons where compounding does not apply. It is easier to understand than compound growth because the interest stays linear over time, which makes it a good starting point for beginners learning how rates affect money.",
      faq: [
        {
          question: "What is simple interest?",
          answer: "Simple interest is interest calculated only on the original principal, not on past interest.",
        },
        {
          question: "How is this different from compound interest?",
          answer: "Compound interest adds earned interest back into the balance, while simple interest does not.",
        },
        {
          question: "Can I use this for loans and savings?",
          answer: "Yes. It works for any case where the amount grows using a fixed simple interest formula.",
        },
      ],
    },
    "loan-payment-calculator": {
      title: "Loan Payment Calculator",
      seoTitle: "Loan Payment Calculator | Kaya",
      description: "Estimate monthly loan payments, total interest, and total repayment.",
      intro:
        "Use this loan payment calculator to estimate monthly payments from a loan amount, annual interest rate, and repayment term.",
      exampleHeading: "Example Usage",
      explanationHeading: "Loan Payment Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Calculate the monthly payment for a personal loan over 5 years.",
        "See how total interest changes when the repayment term gets longer.",
        "Compare borrowing costs before choosing between loan options.",
      ],
      explanation:
        "A loan payment calculator helps you estimate how much you would pay each month on an amortized loan. After entering the loan amount, annual interest rate, and loan term, the tool calculates the monthly payment, total amount repaid, and total interest cost. This is useful for personal loans, auto loans, education financing, and general borrowing comparisons. Instead of guessing from the headline rate alone, you can see how repayment length changes both affordability and total interest. That makes it easier to compare loan offers and avoid underestimating the real cost of borrowing.",
      faq: [
        {
          question: "What does amortized loan mean?",
          answer: "It means each monthly payment covers both interest and principal until the balance is paid off.",
        },
        {
          question: "Why does a longer term reduce monthly payments?",
          answer: "Because the balance is spread across more payments, although total interest often becomes higher.",
        },
        {
          question: "Can this calculator handle zero interest?",
          answer: "Yes. In that case the payment is just the loan amount divided by the total number of months.",
        },
      ],
    },
    "mortgage-calculator": {
      title: "Mortgage Calculator",
      seoTitle: "Mortgage Calculator | Kaya",
      description: "Estimate mortgage payments, loan principal, and total housing interest.",
      intro:
        "Use this mortgage calculator to estimate home loan principal, monthly payment, total interest, and total paid based on home price, down payment, rate, and term.",
      exampleHeading: "Example Usage",
      explanationHeading: "Mortgage Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate monthly payments for a home purchase with a 20 percent down payment.",
        "Compare how rate changes affect total mortgage interest over 15 or 30 years.",
        "Check the financed amount before talking to a lender.",
      ],
      explanation:
        "A mortgage calculator helps you estimate the cost of financing a home purchase. By entering the home price, down payment, interest rate, and mortgage term, you can see the loan principal, monthly payment, total interest, and overall amount paid. This gives a clearer view of affordability than looking at the listing price alone. It is useful when comparing homes, planning a budget, or deciding whether a larger down payment makes sense. Even a small change in rate or term can significantly affect the lifetime cost, so seeing the numbers together makes better decisions easier.",
      faq: [
        {
          question: "Does this include taxes and insurance?",
          answer: "No. This version focuses on principal and interest only, not escrow, taxes, or insurance.",
        },
        {
          question: "Why does a bigger down payment help?",
          answer: "It reduces the financed amount, which lowers monthly payments and total interest.",
        },
        {
          question: "Can I compare 15-year and 30-year mortgages?",
          answer: "Yes. Changing the term is a good way to compare monthly cost versus lifetime interest.",
        },
      ],
    },
    "tax-calculator": {
      title: "Tax Calculator",
      seoTitle: "Tax Calculator | Kaya",
      description: "Calculate tax amount and total price from a pre-tax value and rate.",
      intro:
        "Use this tax calculator to add tax to a pre-tax amount and see the tax value plus final total instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "Tax Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Add sales tax to a product price before checkout.",
        "Estimate tax on an invoice subtotal using a known rate.",
        "Quickly compare totals across different tax percentages.",
      ],
      explanation:
        "A tax calculator lets you take a pre-tax amount and apply a tax rate to find both the tax value and the final total. This is useful for shopping, invoicing, budgeting, and quick pricing checks. Instead of estimating mentally, you can see exactly how much tax is being added and what the customer or buyer will pay in total. For simple calculations like sales tax or flat-rate tax additions, this kind of tool is faster and less error-prone than using a calculator by hand, especially when you need to compare multiple rates.",
      faq: [
        {
          question: "What amount should I enter?",
          answer: "Enter the amount before tax if you want the tool to add tax on top.",
        },
        {
          question: "Can I use decimal tax rates?",
          answer: "Yes. You can enter whole percentages like 8.25 or 20 depending on your case.",
        },
        {
          question: "Does this calculate progressive income tax?",
          answer: "No. This tool is for simple flat-rate tax additions, not tiered tax systems.",
        },
      ],
    },
    "vat-calculator": {
      title: "VAT Calculator",
      seoTitle: "VAT Calculator | Kaya",
      description: "Calculate VAT amount and gross total from a net amount and VAT rate.",
      intro:
        "Use this VAT calculator to add value-added tax to a net amount and see the VAT portion plus gross total instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "VAT Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Add VAT to a service invoice from the net amount.",
        "Check how much of the final price comes from VAT.",
        "Compare totals under different VAT rates for pricing decisions.",
      ],
      explanation:
        "A VAT calculator helps you work out how much value-added tax is added to a net amount and what the final gross total becomes. This is useful for invoices, e-commerce pricing, accounting checks, and international business work where VAT rates differ by market. By separating the base amount from the VAT portion, the tool makes it easier to understand pricing structure and communicate totals clearly. It is especially helpful when you need a quick answer without opening spreadsheets or calculating the percentage manually every time.",
      faq: [
        {
          question: "What is VAT?",
          answer: "VAT stands for value-added tax, a consumption tax added to goods and services in many countries.",
        },
        {
          question: "Should I enter the net or gross amount?",
          answer: "This version expects the net amount before VAT so it can calculate the VAT and gross total.",
        },
        {
          question: "Is VAT the same as sales tax?",
          answer: "They are related but not identical. VAT is collected through the supply chain, while sales tax is usually charged at the final sale.",
        },
      ],
    },
    "currency-converter": {
      title: "Currency Converter",
      seoTitle: "Currency Converter | Kaya",
      description: "Convert between two currencies with a custom exchange rate input.",
      intro:
        "Use this currency converter to convert between two currencies instantly with a custom exchange rate and inverse-rate preview.",
      exampleHeading: "Example Usage",
      explanationHeading: "Currency Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert USD into EUR using a manually entered exchange rate.",
        "Check the inverse rate when comparing quote directions.",
        "Use your own market or invoice rate instead of a live feed.",
      ],
      explanation:
        "A currency converter helps you turn one currency amount into another using a given exchange rate. This version is designed for static-site use, so instead of calling a live API it lets you enter the rate directly. That makes it useful when you already know the market rate, invoice rate, treasury rate, or internal pricing rate you want to apply. It also shows the inverse rate so you can check the quote direction more easily. For quick manual conversions and planning, that is often more practical than waiting on a live feed.",
      faq: [
        {
          question: "Why does this use a manual exchange rate?",
          answer: "Because the tool is static-site compatible and lets you apply the exact rate you want instead of relying on a live API.",
        },
        {
          question: "Can I use this for invoice conversions?",
          answer: "Yes. It is useful when you need to apply a specific bookkeeping or invoice exchange rate.",
        },
        {
          question: "What is the inverse rate?",
          answer: "It is the reversed quote that shows how much of the original currency equals one unit of the target currency.",
        },
      ],
    },
    "exchange-rate-history-viewer": {
      title: "Exchange Rate History Viewer",
      seoTitle: "Exchange Rate History Viewer | Kaya",
      description: "Inspect a manual exchange-rate history series with change, high, low, and average values.",
      intro:
        "Use this exchange rate history viewer to review a manual FX rate series, compare first-to-last change, and inspect the average, high, and low rate.",
      exampleHeading: "Example Usage",
      explanationHeading: "Exchange Rate History Viewer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste monthly USD/EUR rates and inspect how the quote changed over time.",
        "Review the highest and lowest rate inside a planning window.",
        "Summarize a historical exchange-rate series without using a spreadsheet.",
      ],
      explanation:
        "An exchange rate history viewer helps you inspect a sequence of historical currency quotes in one place. This static version is designed for manual input, so you can paste lines of date and rate data from a report, spreadsheet, or broker note. The tool then summarizes the latest value, average rate, high, low, and first-to-last percentage change. That is useful when you want a quick overview of a historical FX series without relying on a live market API. It also works well for finance notes, treasury planning, and comparing how a rate moved across a chosen time range.",
      faq: [
        {
          question: "Why does this tool use manual input instead of a live feed?",
          answer: "Because the site is static-first, manual input keeps the tool fast and lets you analyze any source series you already trust.",
        },
        {
          question: "What format should I paste?",
          answer: "Use one line per data point in date,rate format, such as 2024-01-01,1.08.",
        },
        {
          question: "What does first-to-last change mean?",
          answer: "It measures the percentage change from the first rate in your list to the final rate in your list.",
        },
      ],
    },
    "inflation-calculator": {
      title: "Inflation Calculator",
      seoTitle: "Inflation Calculator | Kaya",
      description: "Adjust a present amount by inflation and compare future purchasing power.",
      intro:
        "Use this inflation calculator to estimate future equivalent cost, remaining purchasing power, and cumulative inflation over time.",
      exampleHeading: "Example Usage",
      explanationHeading: "Inflation Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate what today's budget would cost after 10 years of inflation.",
        "Check how much purchasing power remains after sustained inflation.",
        "Compare different inflation assumptions for planning.",
      ],
      explanation:
        "An inflation calculator helps you understand how rising prices affect the future value of money. By entering a starting amount, annual inflation rate, and time period, you can estimate what the same basket of spending may cost in the future, how much purchasing power remains, and how much inflation accumulates overall. This is useful for long-term budgeting, retirement planning, salary discussions, and simple financial education. It makes abstract percentage changes easier to understand because you can see them translated into money terms.",
      faq: [
        {
          question: "What does future equivalent cost mean?",
          answer: "It means how much money you may need in the future to buy what the starting amount buys today.",
        },
        {
          question: "Why does purchasing power fall over time?",
          answer: "Because inflation means each unit of currency buys less than before when prices rise.",
        },
        {
          question: "Can I test different inflation assumptions?",
          answer: "Yes. Changing the annual inflation rate is a simple way to compare planning scenarios.",
        },
      ],
    },
    "savings-growth-calculator": {
      title: "Savings Growth Calculator",
      seoTitle: "Savings Growth Calculator | Kaya",
      description: "Project long-term savings growth with monthly contributions and return assumptions.",
      intro:
        "Use this savings growth calculator to project future savings balance from an initial amount, monthly contributions, and an annual return rate.",
      exampleHeading: "Example Usage",
      explanationHeading: "Savings Growth Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Project how monthly contributions may grow over 15 years.",
        "Compare the effect of raising your annual return assumption.",
        "See how much of the final balance comes from contributions versus growth.",
      ],
      explanation:
        "A savings growth calculator helps you estimate how a savings or investment balance may grow over time. By combining an initial amount, monthly contributions, annual return assumption, and time horizon, the tool projects final balance, total contributed capital, and growth from returns. This is useful for savings planning, long-term investing, and personal finance education. The output makes it easier to see the difference between what you personally contributed and what growth added on top. That can be especially helpful when comparing scenarios with different contribution levels or return assumptions.",
      faq: [
        {
          question: "Does this assume monthly compounding?",
          answer: "Yes. This version applies the annual return as a monthly growth rate over the selected time period.",
        },
        {
          question: "What counts as total contributed?",
          answer: "It includes the initial savings amount plus all monthly contributions made over time.",
        },
        {
          question: "Why separate growth from contributions?",
          answer: "Because it helps you see how much of the ending balance came from your deposits versus investment returns.",
        },
      ],
    },
    "stock-average-price-calculator": {
      title: "Stock Average Price Calculator",
      seoTitle: "Stock Average Price Calculator | Kaya",
      description: "Calculate stock average cost basis, total shares, and unrealized profit or loss.",
      intro:
        "Use this stock average price calculator to combine multiple buy lots, compute average cost per share, and compare cost basis with the current market price.",
      exampleHeading: "Example Usage",
      explanationHeading: "Stock Average Price Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Blend several stock purchases into one average cost per share.",
        "Check unrealized profit or loss at the current market price.",
        "Estimate whether buying another lot may lower or raise your cost basis.",
      ],
      explanation:
        "A stock average price calculator helps you merge multiple buy lots into one clear cost basis. After entering shares and buy price for each lot, the tool totals your shares, total cost, and average price per share. If you also enter a current market price, it can estimate market value and unrealized profit or loss. This is useful for stock portfolios, ETF accumulation, and any situation where you buy the same asset at different times. Instead of tracking each trade mentally, you can quickly see what your blended entry price looks like and how the position stands today.",
      faq: [
        {
          question: "What is average cost basis?",
          answer: "It is the total money spent divided by the total number of shares you hold.",
        },
        {
          question: "Does this include taxes or commissions?",
          answer: "Only if you include them in the prices you enter. The calculator itself does not add brokerage fees automatically.",
        },
        {
          question: "Can I leave market price empty?",
          answer: "Yes. The average cost still works without a market price, but unrealized P/L will not be shown.",
        },
      ],
    },
    "net-profit-margin-calculator": {
      title: "Net Profit Margin Calculator",
      seoTitle: "Net Profit Margin Calculator | Kaya",
      description: "Calculate net profit and net profit margin from revenue and expenses.",
      intro:
        "Use this net profit margin calculator to measure net profit and net margin percentage from revenue and total expenses.",
      exampleHeading: "Example Usage",
      explanationHeading: "Net Profit Margin Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Calculate how much profit remains after subtracting expenses from revenue.",
        "Estimate net margin for a product line or service business.",
        "Compare business performance across different revenue levels.",
      ],
      explanation:
        "A net profit margin calculator helps you measure how much of your revenue is left as profit after expenses are deducted. By entering revenue and expenses, the tool returns both the net profit amount and the net margin percentage. This is useful for business planning, founder dashboards, small business reporting, and quick unit-economics checks. Margin percentages are often easier to compare across time periods or products than raw profit values alone, so seeing both numbers together gives a clearer picture of performance.",
      faq: [
        {
          question: "What is net profit margin?",
          answer: "It is the percentage of revenue that remains as profit after expenses are deducted.",
        },
        {
          question: "Can the margin be negative?",
          answer: "Yes. If expenses are higher than revenue, the result is a negative net profit margin.",
        },
        {
          question: "Why calculate both profit and margin?",
          answer: "Profit shows the absolute result, while margin shows efficiency relative to revenue.",
        },
      ],
    },
    "break-even-calculator": {
      title: "Break Even Calculator",
      seoTitle: "Break Even Calculator | Kaya",
      description: "Calculate break-even units and revenue from fixed and variable costs.",
      intro:
        "Use this break even calculator to estimate break-even sales volume, contribution margin, and revenue required to cover fixed costs.",
      exampleHeading: "Example Usage",
      explanationHeading: "Break Even Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how many units you need to sell before turning profitable.",
        "Check whether contribution margin per unit is high enough to cover fixed costs.",
        "Compare different pricing assumptions for the same cost structure.",
      ],
      explanation:
        "A break-even calculator helps you estimate the point at which sales cover costs but do not yet generate profit. By entering fixed costs, selling price per unit, and variable cost per unit, the tool shows the break-even unit count, contribution margin per unit, and break-even revenue level. This is useful for product planning, small business pricing, and financial modeling. It gives a clearer view of how price and cost structure work together, which makes it easier to judge whether a business model has enough margin to scale.",
      faq: [
        {
          question: "What is break-even?",
          answer: "Break-even is the point where total revenue covers total costs, leaving zero profit and zero loss.",
        },
        {
          question: "What is contribution margin per unit?",
          answer: "It is the selling price per unit minus the variable cost per unit.",
        },
        {
          question: "Why must price be higher than variable cost?",
          answer: "Because otherwise each unit sold would fail to cover its own direct cost, making break-even impossible.",
        },
      ],
    },
    "evm-address-checker": {
      title: "EVM Address Checker",
      seoTitle: "EVM Address Checker | Kaya",
      description: "Validate Ethereum and EVM addresses, including checksum formatting.",
      intro:
        "Use this EVM address checker to validate Ethereum-compatible addresses, inspect lowercase normalization, and verify whether the address already matches EIP-55 checksum format.",
      exampleHeading: "Example Usage",
      explanationHeading: "EVM Address Checker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a wallet address is a valid EVM hex address.",
        "Verify if a mixed-case address matches EIP-55 checksum rules.",
        "Normalize an address before storing or comparing it in a frontend.",
      ],
      explanation:
        "An EVM address checker helps you confirm whether an Ethereum-style address is valid before you send funds, store user input, or process blockchain data. The tool checks whether the address is properly formed, whether it can be normalized, and whether its mixed-case form matches the EIP-55 checksum standard. That matters because checksum formatting can catch some typing mistakes that all-lowercase strings would not expose. This is useful for wallets, dashboards, allowlists, smart contract admin tools, and any app that asks users to paste addresses manually.",
      faq: [
        {
          question: "What is an EVM address?",
          answer: "It is a 20-byte hexadecimal address used by Ethereum and other EVM-compatible chains.",
        },
        {
          question: "What does checksum mean here?",
          answer: "EIP-55 checksum uses letter casing to help detect some address typos.",
        },
        {
          question: "Are lowercase addresses always invalid?",
          answer: "No. They can still be valid addresses, but they do not carry checksum information.",
        },
      ],
    },
    "evm-checksum-converter": {
      title: "EVM Checksum Converter",
      seoTitle: "EVM Checksum Converter | Kaya",
      description: "Convert Ethereum and EVM addresses into EIP-55 checksum format.",
      intro:
        "Use this EVM checksum converter to turn a lowercase or plain Ethereum-style address into its canonical EIP-55 checksum version instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "EVM Checksum Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a lowercase address into checksum format before showing it in a UI.",
        "Standardize pasted wallet addresses for admin panels or allowlists.",
        "Compare checksum and lowercase versions of the same address quickly.",
      ],
      explanation:
        "An EVM checksum converter takes a valid Ethereum-compatible address and rewrites it using EIP-55 checksum casing. This is useful because the checksum form is the most common display format across wallets, block explorers, and developer tooling. It also makes accidental typos easier to catch than a plain lowercase address. If you work on dashboards, wallets, internal tooling, or contract interfaces, converting addresses into checksum form before display is a good default. This browser-side tool makes that formatting step instant without requiring a script or CLI command.",
      faq: [
        {
          question: "What standard does this converter use?",
          answer: "It uses the EIP-55 checksum standard used across Ethereum-compatible chains.",
        },
        {
          question: "Can I paste an already checksummed address?",
          answer: "Yes. The output will remain the same if the address is already in canonical checksum format.",
        },
        {
          question: "Does checksum change the underlying address?",
          answer: "No. It only changes letter casing for display and validation purposes.",
        },
      ],
    },
    "token-decimals-converter": {
      title: "Token Decimals Converter",
      seoTitle: "Token Decimals Converter | Kaya",
      description: "Convert token display amounts into raw on-chain integer values using decimals.",
      intro:
        "Use this token decimals converter to switch between a token's human-readable amount and its raw integer on-chain value with any decimals setting.",
      exampleHeading: "Example Usage",
      explanationHeading: "Token Decimals Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert 1.5 USDC into raw units with 6 decimals.",
        "Format a raw ERC-20 balance into a readable token amount.",
        "Check token math before building a transaction or quote flow.",
      ],
      explanation:
        "A token decimals converter helps you move between what users see and what smart contracts actually store. ERC-20 style tokens use integer values on-chain, while wallets and UIs usually show decimal amounts. By entering a token amount and decimals value, you can convert it into the raw integer needed for contract calls. By entering a raw integer, you can turn it back into a readable balance. This is useful when preparing transfers, quoting balances, checking API responses, or debugging frontend token math. It saves time and helps avoid mistakes caused by manual decimal shifting.",
      faq: [
        {
          question: "Why do tokens use decimals?",
          answer: "Because smart contracts store integer values, and decimals tell apps how to display those integers as user-friendly amounts.",
        },
        {
          question: "Is 18 always the correct decimals value?",
          answer: "No. Many tokens use 18, but others like USDC use 6, so you must use the token's actual decimals.",
        },
        {
          question: "Can this help with contract input preparation?",
          answer: "Yes. The raw integer output is the value you typically pass into contract calls.",
        },
      ],
    },
    "wei-eth-converter": {
      title: "Wei to ETH Converter",
      seoTitle: "Wei to ETH Converter | Kaya",
      description: "Convert between wei, gwei, and ETH amounts instantly.",
      intro:
        "Use this wei to ETH converter to switch between wei, gwei, and ETH values for gas math, balances, and transaction preparation.",
      exampleHeading: "Example Usage",
      explanationHeading: "Wei to ETH Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert 1000000000000000000 wei into 1 ETH.",
        "Check how a gas price in gwei maps to wei or ETH.",
        "Format raw balance values from RPC responses into readable ETH.",
      ],
      explanation:
        "A wei to ETH converter is useful whenever you work with Ethereum balances or gas values. On-chain systems typically represent ETH in wei, the smallest unit, while users often think in ETH or gwei. This tool lets you enter a value in wei, gwei, or ETH and instantly see the equivalent values in the other units. That makes it useful for wallet UIs, contract testing, gas estimation, transaction previews, and debugging RPC data. It removes the need to count zeros by hand and helps you avoid mistakes when converting between display units and on-chain units.",
      faq: [
        {
          question: "What is wei?",
          answer: "Wei is the smallest unit of ETH. One ETH equals 1,000,000,000,000,000,000 wei.",
        },
        {
          question: "What is gwei used for?",
          answer: "Gwei is commonly used for gas prices and equals 1,000,000,000 wei.",
        },
        {
          question: "Can I enter decimal ETH values?",
          answer: "Yes. The tool can parse decimal ETH or gwei amounts and convert them to wei.",
        },
      ],
    },
    "gas-fee-calculator": {
      title: "Gas Fee Calculator",
      seoTitle: "Gas Fee Calculator | Kaya",
      description: "Calculate total EVM gas cost from gas limit and gas price values.",
      intro:
        "Use this gas fee calculator to estimate total transaction cost from gas limit and gas price inputs, with instant output in wei, gwei, and ETH.",
      exampleHeading: "Example Usage",
      explanationHeading: "Gas Fee Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate the fee for a simple ETH transfer using 21000 gas.",
        "Compare how a higher gas price changes total transaction cost.",
        "Turn gas math into ETH units before showing a transaction preview.",
      ],
      explanation:
        "A gas fee calculator helps you estimate how much an EVM transaction may cost before sending it. You enter the gas limit and gas price, and the tool multiplies them to show the total fee in wei, gwei, and ETH. This is useful when you are preparing a transfer, previewing a contract interaction, building a wallet UI, or double-checking gas math from an RPC or block explorer. Instead of manually counting zeros or converting between units in your head, you can see the full fee output immediately and compare different gas price scenarios more safely.",
      faq: [
        {
          question: "What does gas limit mean?",
          answer: "Gas limit is the maximum amount of gas a transaction is allowed to consume.",
        },
        {
          question: "What does gas price mean?",
          answer: "Gas price is how much you pay per unit of gas, often shown in gwei.",
        },
        {
          question: "Does this tool estimate gas automatically?",
          answer: "No. It calculates cost from the values you enter, so you still need a gas limit estimate from your app or wallet.",
        },
      ],
    },
    "transaction-decoder": {
      title: "Transaction Decoder",
      seoTitle: "Transaction Decoder | Kaya",
      description: "Decode raw signed EVM transactions into readable fields instantly.",
      intro:
        "Use this transaction decoder to inspect a raw signed Ethereum transaction and view its nonce, gas settings, recipient, value, signature, and hash-related fields.",
      exampleHeading: "Example Usage",
      explanationHeading: "Transaction Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode a raw hex transaction copied from a wallet or script.",
        "Inspect EIP-1559 fee fields before broadcasting a signed transaction.",
        "Compare signed transaction contents across environments while debugging.",
      ],
      explanation:
        "A transaction decoder helps you inspect the contents of a raw signed EVM transaction without sending it anywhere. When you paste a raw transaction hex string, the tool can extract fields such as nonce, to, value, gas limit, fee settings, signature parts, and hashes. This is useful when debugging wallet integrations, testing transaction builders, checking what a signing flow produced, or inspecting data copied from RPC responses and scripts. Instead of treating the raw transaction as opaque hex, you can see the underlying structure immediately and verify that the encoded values match what you expected.",
      faq: [
        {
          question: "Does this broadcast the transaction?",
          answer: "No. It only parses the raw transaction locally in the browser.",
        },
        {
          question: "Can it decode EIP-1559 transactions?",
          answer: "Yes. It can show fields such as max fee and max priority fee when present.",
        },
        {
          question: "Do I need a signed transaction for this tool?",
          answer: "It is most useful with signed raw transactions, because those include the full payload and signature data.",
        },
      ],
    },
    "calldata-decoder": {
      title: "Calldata Decoder",
      seoTitle: "Calldata Decoder | Kaya",
      description: "Decode EVM calldata using a provided function fragment.",
      intro:
        "Use this calldata decoder to decode EVM transaction input data with a Solidity function fragment and inspect selector, function name, and decoded arguments.",
      exampleHeading: "Example Usage",
      explanationHeading: "Calldata Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode ERC-20 transfer calldata using the transfer function signature.",
        "Inspect the arguments inside a pasted transaction input payload.",
        "Check whether your frontend built calldata with the correct function and values.",
      ],
      explanation:
        "A calldata decoder is useful when you already know or strongly suspect which function a transaction input is meant to call. You provide a Solidity function fragment such as transfer(address,uint256) together with the calldata hex, and the tool decodes the selector and arguments into readable values. This is helpful for contract debugging, audit review, transaction preview UIs, and comparing frontend-built calldata with what a script or wallet produced. It turns a long hex string into something much easier to reason about and helps catch argument ordering or type mistakes quickly.",
      faq: [
        {
          question: "Do I need the exact function fragment?",
          answer: "Yes. The decoder needs the correct Solidity function definition to interpret the calldata.",
        },
        {
          question: "Can this decode any calldata automatically?",
          answer: "No. It does not guess the ABI. You supply the relevant function fragment.",
        },
        {
          question: "Does this include the function selector too?",
          answer: "Yes. The decoded output includes selector information along with the parsed arguments.",
        },
      ],
    },
    "event-log-decoder": {
      title: "Event Log Decoder",
      seoTitle: "Event Log Decoder | Kaya",
      description: "Decode EVM event logs from topics and data using an event fragment.",
      intro:
        "Use this event log decoder to interpret Ethereum event topics and data with a Solidity event fragment and recover the emitted event arguments.",
      exampleHeading: "Example Usage",
      explanationHeading: "Event Log Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode an ERC-20 Transfer event from topics and data.",
        "Inspect indexed and non-indexed event arguments while debugging logs.",
        "Verify that a contract emitted the values your frontend expected to see.",
      ],
      explanation:
        "An event log decoder helps you interpret Ethereum logs when you know the event shape. You provide a Solidity event fragment together with the log topics and data, and the tool decodes the emitted values into readable output. This is especially useful for debugging indexed versus non-indexed fields, reviewing block explorer data, checking monitoring pipelines, and verifying that contract events match your app logic. Since event logs often arrive as split topics plus a separate data field, having a browser-side decoder makes this low-level inspection much faster.",
      faq: [
        {
          question: "What are topics in an Ethereum log?",
          answer: "Topics are fixed-size log fields used for the event signature and indexed event arguments.",
        },
        {
          question: "Do I need the exact event fragment?",
          answer: "Yes. Accurate decoding depends on the correct event definition and argument order.",
        },
        {
          question: "Can this decode indexed and non-indexed values together?",
          answer: "Yes. It combines topics and data to reconstruct the event arguments when the fragment matches.",
        },
      ],
    },
    "abi-encode-tool": {
      title: "ABI Encode Tool",
      seoTitle: "ABI Encode Tool | Kaya",
      description: "ABI-encode Solidity types and values into a hex payload instantly.",
      intro:
        "Use this ABI encode tool to encode Solidity-compatible types and values into a hex payload directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "ABI Encode Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Encode an address and uint256 before passing them into a contract helper.",
        "Generate sample ABI payloads while debugging frontend transaction builders.",
        "Check whether your types and values match before building calldata.",
      ],
      explanation:
        "An ABI encode tool converts Solidity types and values into the binary-compatible hex representation used by the EVM. This is useful when building calldata manually, testing contract integrations, checking payloads from scripts, or understanding how frontend inputs become on-chain bytes. By entering a list of ABI types and a matching JSON array of values, you can generate the encoded output instantly in the browser. This helps reduce mistakes when debugging low-level contract interactions, especially when you are working without a full SDK abstraction around the call.",
      faq: [
        {
          question: "What does ABI mean?",
          answer: "ABI stands for Application Binary Interface, the encoding format Ethereum contracts use for inputs and outputs.",
        },
        {
          question: "Why are values entered as a JSON array?",
          answer: "Because the encoder needs ordered values that line up with the ordered list of ABI types.",
        },
        {
          question: "Is this the same as a full function call payload?",
          answer: "Not by itself. This tool encodes the arguments, but a full function call also includes the 4-byte selector.",
        },
      ],
    },
    "abi-decode-tool": {
      title: "ABI Decode Tool",
      seoTitle: "ABI Decode Tool | Kaya",
      description: "ABI-decode hex data into typed Solidity values in the browser.",
      intro:
        "Use this ABI decode tool to decode hex-encoded EVM data into readable Solidity values based on the types you provide.",
      exampleHeading: "Example Usage",
      explanationHeading: "ABI Decode Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode return data from a contract call using known output types.",
        "Inspect a stored payload or log fragment while debugging a frontend.",
        "Turn ABI-encoded hex back into readable values for comparison.",
      ],
      explanation:
        "An ABI decode tool takes hex-encoded EVM data and interprets it using the Solidity types you specify. This is useful when you are inspecting contract return data, debugging stored payloads, reading encoded parameters, or comparing results from frontend code and scripts. Instead of treating the data as an unreadable hex string, you can map it back into addresses, integers, strings, arrays, and other Solidity values. This makes low-level contract debugging much faster, especially when you want to verify that a payload or response matches the types you expected.",
      faq: [
        {
          question: "Do I need the exact types to decode correctly?",
          answer: "Yes. ABI decoding depends on the correct ordered list of Solidity types.",
        },
        {
          question: "Can I use this for contract return data?",
          answer: "Yes. It works well for decoding outputs when you already know the expected output types.",
        },
        {
          question: "Why are big integers shown as strings?",
          answer: "Because JavaScript numbers are not safe for many large EVM integers, so strings preserve the full value.",
        },
      ],
    },
    "keccak256-hash-generator": {
      title: "Keccak256 Hash Generator",
      seoTitle: "Keccak256 Hash Generator | Kaya",
      description: "Generate Keccak-256 hashes from text or hex input in the browser.",
      intro:
        "Use this Keccak256 hash generator to hash plain text or raw hex bytes for Ethereum selectors, signatures, and smart contract development workflows.",
      exampleHeading: "Example Usage",
      explanationHeading: "Keccak256 Hash Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Hash a function signature string before deriving a method selector.",
        "Generate a Keccak-256 hash from text for contract tooling or testing.",
        "Hash raw hex bytes instead of UTF-8 text when comparing low-level outputs.",
      ],
      explanation:
        "A Keccak256 hash generator is a core utility for Ethereum development because the EVM uses Keccak-256 in many places. Function selectors, event topics, typed data workflows, and address checksum rules all rely on the same family of hashing behavior. This tool lets you hash either plain text or raw hex bytes directly in the browser, which is useful when debugging calldata, checking signatures, deriving selectors, or comparing outputs from scripts and contracts. For frontend engineers and smart contract developers, having a quick Keccak utility saves time and makes low-level Web3 debugging much easier.",
      faq: [
        {
          question: "Is Keccak-256 the same as SHA3-256?",
          answer: "They are closely related but not identical. Ethereum specifically uses Keccak-256.",
        },
        {
          question: "When should I hash text versus hex bytes?",
          answer: "Hash text when you mean the UTF-8 string itself, and hash hex bytes when you already have raw encoded data.",
        },
        {
          question: "Why is this useful in Ethereum development?",
          answer: "It is used for selectors, topics, checksum rules, signatures, and many other EVM-related workflows.",
        },
      ],
    },
    "signature-verifier": {
      title: "Signature Verifier",
      seoTitle: "Signature Verifier | Kaya",
      description: "Verify whether a signed message matches an expected EVM address.",
      intro:
        "Use this signature verifier to check whether an EIP-191 personal-sign style message signature was produced by the expected Ethereum address.",
      exampleHeading: "Example Usage",
      explanationHeading: "Signature Verifier Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a signed login message matches the wallet address a user claims.",
        "Verify a message signature before accepting an off-chain action.",
        "Compare the recovered signer against an expected wallet in the browser.",
      ],
      explanation:
        "A signature verifier is useful when your app relies on wallet-based authentication or off-chain signed messages. You provide the original message, the signature, and the expected address, and the tool recovers the signer to see whether it matches. This helps when testing sign-in flows, validating approvals, debugging wallet integrations, or checking signatures shared out of band. Because the verification runs fully in the browser, it is a fast way to confirm whether a personal-sign style signature is tied to the address you expect without hitting a backend service.",
      faq: [
        {
          question: "What kind of signatures does this tool verify?",
          answer: "It verifies EIP-191 personal-sign style message signatures.",
        },
        {
          question: "Do I need the original message?",
          answer: "Yes. Signature verification depends on the exact original message content.",
        },
        {
          question: "Why might verification fail even with a valid signature?",
          answer: "It can fail if the message text changed, the expected address is different, or the signature was created under another signing scheme.",
        },
      ],
    },
    "recover-address-from-signature": {
      title: "Recover Address From Signature",
      seoTitle: "Recover Address From Signature | Kaya",
      description: "Recover the signer address from a message and EVM signature.",
      intro:
        "Use this recover address from signature tool to derive the Ethereum address that signed a personal-sign style message.",
      exampleHeading: "Example Usage",
      explanationHeading: "Recover Address From Signature Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Recover the signer address from a wallet login signature.",
        "Inspect who signed a message before comparing it in app logic.",
        "Debug a signature flow without writing a quick script first.",
      ],
      explanation:
        "A recover address from signature tool takes an original message and its EVM signature, then derives the signer address directly in the browser. This is useful when you want to inspect a signature before running custom app logic, compare recovered signers across environments, or debug wallet-based authentication flows. Instead of building a small script just to recover the address, you can test the exact message and signature pair on the page. That makes it easier to understand whether the signature itself is correct before moving on to higher-level verification steps.",
      faq: [
        {
          question: "Does recovery prove the signer is trusted?",
          answer: "No. It only tells you which address produced the signature. Your app still decides whether that address should be trusted.",
        },
        {
          question: "What signing format does this expect?",
          answer: "It expects a personal-sign style EIP-191 message signature.",
        },
        {
          question: "Can I use this without an expected address?",
          answer: "Yes. That is the main purpose of this tool: recover first, then compare or inspect later.",
        },
      ],
    },
    "btc-address-validator": {
      title: "BTC Address Validator",
      seoTitle: "BTC Address Validator | Kaya",
      description: "Validate Bitcoin base58 and bech32 addresses in the browser.",
      intro:
        "Use this BTC address validator to check whether a Bitcoin address is valid and identify whether it uses base58, bech32, or bech32m formatting.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Address Validator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Validate a mainnet or testnet Bitcoin address before using it in a payment flow.",
        "Check whether an address uses legacy base58 or segwit bech32 formatting.",
        "Inspect the detected network while debugging wallet or exchange inputs.",
      ],
      explanation:
        "A BTC address validator helps you confirm whether a Bitcoin address is structurally valid before you use it. The tool checks common address formats such as legacy base58, bech32, and bech32m, and it can also identify the likely network. This is useful for wallet UIs, exchange forms, payment flows, and internal tools that accept pasted Bitcoin addresses. Since Bitcoin supports multiple address encodings, validating them correctly is more reliable than using a simple regular expression. Running the validation directly in the browser makes it fast and easy to test address handling without a backend dependency.",
      faq: [
        {
          question: "What formats does this validator support?",
          answer: "It supports common Bitcoin address formats including base58, bech32, and bech32m.",
        },
        {
          question: "Can it tell mainnet from testnet?",
          answer: "Yes. It detects the likely network from the address prefix and encoding details.",
        },
        {
          question: "Does validity mean the address is in use?",
          answer: "No. It only means the address format and checksum are valid, not that the address has activity.",
        },
      ],
    },
    "btc-satoshi-converter": {
      title: "BTC to Satoshi Converter",
      seoTitle: "BTC to Satoshi Converter | Kaya",
      description: "Convert between BTC amounts and satoshis instantly.",
      intro:
        "Use this BTC to satoshi converter to switch between human-readable BTC amounts and raw satoshi values for wallets, APIs, and transaction math.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC to Satoshi Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert 0.001 BTC into satoshis before constructing a payment amount.",
        "Turn an API balance in satoshis into readable BTC for a frontend display.",
        "Check Bitcoin amount math without manually shifting eight decimals.",
      ],
      explanation:
        "A BTC to satoshi converter helps you move between user-facing Bitcoin amounts and raw integer satoshi values. Bitcoin uses 8 decimal places, so a value shown in BTC often needs to be converted into satoshis before it can be stored, compared, or used in transaction building. The reverse is also common when APIs or wallet data return balances in satoshis but your interface needs to display BTC. This tool handles both directions instantly in the browser, which makes it convenient for wallet UIs, exchange forms, payment tools, and debugging amount conversions.",
      faq: [
        {
          question: "How many satoshis are in 1 BTC?",
          answer: "One BTC equals 100,000,000 satoshis.",
        },
        {
          question: "Can I enter decimal BTC amounts?",
          answer: "Yes. The tool supports BTC amounts with up to 8 decimal places.",
        },
        {
          question: "Why do APIs often return satoshis instead of BTC?",
          answer: "Because integer satoshi values avoid floating-point issues and are easier to handle in low-level transaction logic.",
        },
      ],
    },
    "btc-transaction-decoder": {
      title: "BTC Transaction Decoder",
      seoTitle: "BTC Transaction Decoder | Kaya",
      description: "Decode raw Bitcoin transactions into summary fields instantly.",
      intro:
        "Use this BTC transaction decoder to inspect a raw Bitcoin transaction and view summary fields such as txid, version, witness usage, size, weight, and total outputs.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Transaction Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode a raw Bitcoin transaction copied from a wallet or block explorer.",
        "Check whether a transaction uses witness data and how large it is.",
        "Inspect the total output value before comparing a transaction across tools.",
      ],
      explanation:
        "A BTC transaction decoder is useful when you want a quick summary of a raw Bitcoin transaction without manually parsing every field. The tool reads the hex-encoded transaction and returns high-level details such as the transaction ID, version, locktime, witness presence, byte length, virtual size, weight, and total outputs. This is helpful when debugging wallet exports, reviewing raw transactions from APIs, checking size-related fee assumptions, or confirming that a transaction payload matches expectations. It gives you a clean summary first, which is often enough before moving into deeper input and output inspection.",
      faq: [
        {
          question: "Does this tool broadcast the transaction?",
          answer: "No. It only parses the raw transaction locally in the browser.",
        },
        {
          question: "Can it detect segwit transactions?",
          answer: "Yes. It reports whether witness data is present and includes size and weight information.",
        },
        {
          question: "Is this different from a raw transaction parser?",
          answer: "Yes. This decoder focuses on summary fields, while a raw parser usually shows detailed input and output structure.",
        },
      ],
    },
    "btc-raw-transaction-parser": {
      title: "BTC Raw Transaction Parser",
      seoTitle: "BTC Raw Transaction Parser | Kaya",
      description: "Parse Bitcoin raw transactions into detailed input and output data.",
      intro:
        "Use this BTC raw transaction parser to inspect Bitcoin inputs, outputs, script fields, witness data, and output addresses from a raw transaction hex string.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Raw Transaction Parser Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Inspect each input and output inside a raw Bitcoin transaction.",
        "Read scriptSig, witness, and scriptPubKey data during debugging.",
        "Check which output scripts map to readable Bitcoin addresses.",
      ],
      explanation:
        "A BTC raw transaction parser gives you a field-by-field view of a Bitcoin transaction. Instead of only showing the summary, it breaks the transaction into individual inputs and outputs so you can inspect previous outpoints, sequence values, scripts, witness items, output values, and script-derived addresses when possible. This is useful for low-level Bitcoin debugging, PSBT review, wallet development, payment tooling, and understanding how different transaction formats are serialized. When you need more detail than a simple transaction summary, a raw parser is the right next step.",
      faq: [
        {
          question: "What is the difference between inputs and outputs?",
          answer: "Inputs spend previous outputs, while outputs define new spendable values and scripts in the current transaction.",
        },
        {
          question: "Can it show witness data?",
          answer: "Yes. Witness items are included when the transaction contains segwit data.",
        },
        {
          question: "Will every output script map to an address?",
          answer: "No. Standard scripts often do, but unusual or custom scripts may not convert cleanly into a standard address.",
        },
      ],
    },
    "btc-fee-calculator": {
      title: "BTC Fee Calculator",
      seoTitle: "BTC Fee Calculator | Kaya",
      description: "Calculate Bitcoin transaction fees and fee rates from inputs and outputs.",
      intro:
        "Use this BTC fee calculator to compute transaction fees from total input and output values, with optional fee rate output in satoshis per virtual byte.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Fee Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Subtract total outputs from total inputs to confirm the actual fee paid.",
        "Calculate fee rate in sat/vB when you already know the transaction virtual size.",
        "Check whether a Bitcoin transaction is overpaying or underpaying relative to its size.",
      ],
      explanation:
        "A BTC fee calculator helps you work out the actual fee a Bitcoin transaction pays by subtracting total outputs from total inputs. If you also know the transaction virtual size, the tool can estimate the fee rate in satoshis per virtual byte, which is one of the most common ways to compare Bitcoin transaction costs. This is useful when debugging wallet fee logic, reviewing transaction history, checking exchange withdrawal behavior, or verifying fee assumptions before broadcast. It gives you a quick way to inspect fee math without opening a spreadsheet or writing a script.",
      faq: [
        {
          question: "How is Bitcoin fee calculated?",
          answer: "It is the difference between the total input value and the total output value.",
        },
        {
          question: "What is sat/vB?",
          answer: "It means satoshis per virtual byte, a common fee rate unit for Bitcoin transactions.",
        },
        {
          question: "Do I need the transaction size for the fee itself?",
          answer: "No. You only need size if you also want the fee rate, not just the total fee.",
        },
      ],
    },
    "btc-fee-estimator": {
      title: "BTC Fee Estimator",
      seoTitle: "BTC Fee Estimator | Kaya",
      description: "Estimate Bitcoin fees from virtual size and target sat/vB rate.",
      intro:
        "Use this BTC fee estimator to calculate an estimated fee from transaction virtual size and a target satoshis-per-vbyte fee rate.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Fee Estimator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate the fee for a 141 vbyte transaction at 12.5 sat/vB.",
        "Compare how a higher target fee rate changes total fee cost.",
        "Turn a size estimate into a quick BTC-denominated fee preview.",
      ],
      explanation:
        "A BTC fee estimator helps you predict what a Bitcoin transaction may cost before you finalize it. If you already have an estimated transaction size in virtual bytes and a target fee rate in sat/vB, the tool multiplies them to calculate the likely fee in satoshis and BTC. This is useful when preparing wallet previews, tuning fee selection, comparing urgency options, or testing transaction-building flows. It complements a transaction size calculator well because you can first estimate size and then turn that result into an actual fee target.",
      faq: [
        {
          question: "What is sat/vB?",
          answer: "It means satoshis per virtual byte, the most common fee rate unit for Bitcoin transactions.",
        },
        {
          question: "Do I need the exact transaction size?",
          answer: "Not always. An estimate is often enough for planning, though final fees depend on the actual built transaction.",
        },
        {
          question: "How is this different from a fee calculator?",
          answer: "A fee estimator starts from size and rate assumptions, while a fee calculator usually works backward from known input and output totals.",
        },
      ],
    },
    "btc-script-decoder": {
      title: "BTC Script Decoder",
      seoTitle: "BTC Script Decoder | Kaya",
      description: "Decode Bitcoin script hex into ASM opcodes and data pushes.",
      intro:
        "Use this BTC script decoder to inspect Bitcoin locking or unlocking scripts in ASM form and break the script into readable opcodes and pushed data chunks.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Script Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Decode a standard P2PKH scriptPubKey into ASM form.",
        "Inspect which opcodes and pushed data appear inside a script.",
        "Compare script hex from a transaction parser with a readable representation.",
      ],
      explanation:
        "A BTC script decoder helps you inspect the actual contents of a Bitcoin script without reading raw hex by eye. You paste a script hex string and the tool converts it into an ASM-style representation while also listing the underlying opcodes and pushed data chunks. This is useful for transaction debugging, script learning, wallet development, and low-level Bitcoin analysis. Since scripts are a core part of how Bitcoin defines spending conditions, being able to decode them quickly makes it much easier to understand what an output or input script is doing.",
      faq: [
        {
          question: "What kinds of scripts can this decode?",
          answer: "It can decode any valid Bitcoin script byte sequence into opcodes and data pushes, including standard script templates.",
        },
        {
          question: "What does ASM mean here?",
          answer: "ASM is a readable script form that shows opcodes and pushed data instead of only raw hex bytes.",
        },
        {
          question: "Does decoding tell me whether the script is spendable?",
          answer: "Not by itself. It shows script structure, but spendability depends on matching Bitcoin script rules and the right unlocking data.",
        },
      ],
    },
    "btc-transaction-size-calculator": {
      title: "BTC Transaction Size Calculator",
      seoTitle: "BTC Transaction Size Calculator | Kaya",
      description: "Estimate Bitcoin transaction size, vbytes, and weight units.",
      intro:
        "Use this BTC transaction size calculator to estimate transaction size from common input and output script types and compare vbytes with weight units.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Transaction Size Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate the size of a simple 1-input 2-output segwit transaction.",
        "Compare how different input types affect virtual size.",
        "Check rough vbytes before estimating a target fee rate.",
      ],
      explanation:
        "A BTC transaction size calculator gives you a quick estimate of how large a Bitcoin transaction is likely to be based on common input and output script types. This matters because Bitcoin fees are usually priced per virtual byte, so transaction size directly affects cost. By selecting script types such as P2PKH, P2WPKH, nested segwit, or taproot, and entering input and output counts, you can estimate bytes, vbytes, and weight units. This is useful for wallet UIs, fee planning, transaction previews, and rough cost comparisons before you build the final transaction.",
      faq: [
        {
          question: "What is a virtual byte or vbyte?",
          answer: "A virtual byte is a size unit derived from transaction weight and commonly used for Bitcoin fee pricing.",
        },
        {
          question: "Why do segwit transactions often have lower vbytes?",
          answer: "Because witness data is discounted in the Bitcoin weight formula, reducing effective fee size.",
        },
        {
          question: "Is this an exact size calculator?",
          answer: "It is an estimate based on common script templates, which is useful for planning even if the final transaction differs slightly.",
        },
      ],
    },
    "btc-change-output-calculator": {
      title: "BTC Change Output Calculator",
      seoTitle: "BTC Change Output Calculator | Kaya",
      description: "Calculate Bitcoin change output values from inputs, send amount, and fees.",
      intro:
        "Use this BTC change output calculator to determine the remaining change after subtracting a recipient amount and transaction fee from total Bitcoin inputs.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Change Output Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Calculate the change output for a single-send Bitcoin transaction.",
        "Check whether your chosen fee leaves a usable change amount.",
        "Verify wallet math before building a payment transaction.",
      ],
      explanation:
        "A BTC change output calculator is useful when you are building or reviewing Bitcoin transactions that need to return leftover value back to the sender. You enter the total input amount, the amount being sent to the recipient, and the planned fee, and the tool calculates the remaining change output in satoshis and BTC. This is helpful for payment tooling, wallet UIs, PSBT review, and manual transaction planning. It also makes it easy to spot when a transaction would leave no change or when the leftover amount is so small that it may become dust.",
      faq: [
        {
          question: "What is a change output?",
          answer: "It is the output that returns leftover Bitcoin back to the sender after paying recipients and fees.",
        },
        {
          question: "Can change be zero?",
          answer: "Yes. Some transactions intentionally spend the full input value with no change output.",
        },
        {
          question: "Why is this useful together with a dust calculator?",
          answer: "Because a very small calculated change output may be uneconomical or below common dust thresholds.",
        },
      ],
    },
    "btc-dust-limit-calculator": {
      title: "BTC Dust Limit Calculator",
      seoTitle: "BTC Dust Limit Calculator | Kaya",
      description: "Estimate Bitcoin dust thresholds for common output types.",
      intro:
        "Use this BTC dust limit calculator to estimate the minimum practical value for common Bitcoin output types at a given relay fee rate.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Dust Limit Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate the dust threshold for a P2WPKH output at 1 sat/vB.",
        "Compare how output type changes the minimum practical send value.",
        "Check whether a planned change output is likely to be considered dust.",
      ],
      explanation:
        "A BTC dust limit calculator helps you estimate when a Bitcoin output may be too small to be economical to spend later. Dust thresholds depend on output type and relay fee assumptions, because spending a tiny output can cost more than the output itself is worth. By selecting a common output type and a fee rate, the tool gives you a rough threshold in satoshis. This is useful for wallet builders, payment tools, change-output planning, and transaction review. It gives you a practical planning number even though exact policy details may vary by environment.",
      faq: [
        {
          question: "What is dust in Bitcoin?",
          answer: "Dust is an output so small that spending it later may cost more in fees than the output value itself.",
        },
        {
          question: "Is there one universal dust threshold?",
          answer: "No. It depends on script type, policy assumptions, and fee rate context, so this tool provides an estimate.",
        },
        {
          question: "Why do different output types have different dust levels?",
          answer: "Because different script types have different sizes and spending costs, which changes the economics of redeeming them later.",
        },
      ],
    },
    "btc-locktime-calculator": {
      title: "BTC Locktime Calculator",
      seoTitle: "BTC Locktime Calculator | Kaya",
      description: "Convert and inspect Bitcoin nLockTime values as heights or timestamps.",
      intro:
        "Use this BTC locktime calculator to decode raw nLockTime values or convert a UTC date into the timestamp-based locktime used in Bitcoin transactions.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Locktime Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a raw locktime value is treated as a block height or a timestamp.",
        "Convert a future UTC date into a timestamp-based locktime value.",
        "Inspect the meaning of locktime fields when debugging raw Bitcoin transactions.",
      ],
      explanation:
        "A BTC locktime calculator helps you interpret or construct Bitcoin nLockTime values. In Bitcoin, locktime values below 500,000,000 are treated as block heights, while larger values are interpreted as Unix timestamps. This tool lets you decode an existing raw locktime value or turn a UTC date into the timestamp form used by time-based locktime transactions. That is useful for transaction planning, script review, wallet debugging, and understanding when a transaction is meant to become valid.",
      faq: [
        {
          question: "What is nLockTime?",
          answer: "nLockTime is a Bitcoin transaction field that can delay when a transaction becomes valid for inclusion.",
        },
        {
          question: "How do I know whether a locktime is height-based or time-based?",
          answer: "Values below 500,000,000 are block heights, while larger values are treated as Unix timestamps.",
        },
        {
          question: "Does locktime alone guarantee a delay?",
          answer: "Not always. Sequence settings and overall transaction semantics also matter in Bitcoin transaction validity rules.",
        },
      ],
    },
    "btc-weight-calculator": {
      title: "BTC Weight Calculator",
      seoTitle: "BTC Weight Calculator | Kaya",
      description: "Estimate Bitcoin transaction weight units, witness bytes, and virtual size.",
      intro:
        "Use this BTC weight calculator to estimate Bitcoin transaction weight units, witness bytes, total bytes, and virtual size from common input and output mixes.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Weight Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate weight for a simple 1-input 2-output P2WPKH transaction.",
        "Compare how P2TR and P2PKH inputs change vbytes and weight.",
        "Check witness-heavy transactions before fee planning.",
      ],
      explanation:
        "A BTC weight calculator helps you estimate how large a Bitcoin transaction is under SegWit sizing rules. Instead of only showing raw bytes, it separates base bytes, witness bytes, total weight units, and virtual bytes. That matters because Bitcoin fee rates are usually priced in satoshis per virtual byte, while witness data is discounted in the weight formula. This tool is useful for wallet flows, fee planning, transaction simulation, and comparing script types like P2WPKH, P2TR, and older legacy inputs. It is an estimator based on common template sizes, but for most front-end planning work that is exactly what you need.",
      faq: [
        {
          question: "What is Bitcoin transaction weight?",
          answer: "Weight is the SegWit sizing metric that combines base bytes and witness bytes into a single fee-related value.",
        },
        {
          question: "Why are vbytes different from raw bytes?",
          answer: "Because witness bytes are discounted under Bitcoin weight rules, so the billed virtual size can be smaller than total raw bytes.",
        },
        {
          question: "Is this exact for every script path?",
          answer: "No. It uses common input and output templates, so unusual scripts may differ slightly.",
        },
      ],
    },
    "psbt-decoder": {
      title: "PSBT Decoder",
      seoTitle: "PSBT Decoder | Kaya",
      description: "Decode a Bitcoin PSBT into readable inputs, outputs, and signing fields.",
      intro:
        "Use this PSBT decoder to inspect Bitcoin PSBT inputs, outputs, UTXO data, scripts, and signing fields directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "PSBT Decoder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a base64 PSBT and inspect which inputs already include UTXO data.",
        "Decode a hex PSBT before handing it off to a signer or wallet.",
        "Review redeem scripts, witness scripts, and partial signature counts quickly.",
      ],
      explanation:
        "A PSBT decoder turns a raw Partially Signed Bitcoin Transaction into a readable structure. That makes it much easier to inspect input references, output scripts, witness UTXOs, redeem scripts, partial signatures, and finalization state without jumping into a full wallet or node environment. This is especially useful when you are debugging multisig flows, wallet handoffs, signing pipelines, or PSBT-based product logic. Because PSBT can appear in either base64 or hex form, the tool accepts both and normalizes them into a consistent view. For front-end debugging and quick operator checks, that saves a lot of time.",
      faq: [
        {
          question: "What is a PSBT?",
          answer: "A PSBT is a Partially Signed Bitcoin Transaction format used to pass unsigned or partially signed transaction data between tools and signers.",
        },
        {
          question: "Does this support base64 and hex PSBT input?",
          answer: "Yes. The decoder accepts both common PSBT encodings.",
        },
        {
          question: "Why decode a PSBT before signing?",
          answer: "Because it helps you verify inputs, outputs, and signing metadata before a wallet or signer finalizes anything.",
        },
      ],
    },
    "psbt-analyzer": {
      title: "PSBT Analyzer",
      seoTitle: "PSBT Analyzer | Kaya",
      description: "Analyze PSBT signing completeness, UTXO coverage, and visible fee data.",
      intro:
        "Use this PSBT analyzer to review signing completeness, UTXO coverage, finalization state, and visible fee information in a Bitcoin PSBT.",
      exampleHeading: "Example Usage",
      explanationHeading: "PSBT Analyzer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether every PSBT input already has UTXO data attached.",
        "See how many inputs are signed or finalized before broadcasting.",
        "Inspect whether fee calculation is possible from the PSBT alone.",
      ],
      explanation:
        "A PSBT analyzer focuses less on raw field-by-field decoding and more on readiness. It helps you see whether all inputs include UTXO information, how many inputs are signed, how many are finalized, and whether the transaction fee can be derived from known values. That is useful in wallet workflows, signing services, and multi-step PSBT pipelines where you need a quick operational summary before the next handoff. Instead of manually reading every field, you get a compact status view that surfaces missing data and obvious blockers. For debugging PSBT flow state, that is often more useful than raw decoding alone.",
      faq: [
        {
          question: "What does UTXO coverage mean here?",
          answer: "It means whether each input includes enough referenced UTXO data for signing checks and fee visibility.",
        },
        {
          question: "Can it always calculate the fee?",
          answer: "No. Fee calculation only works when the PSBT includes enough input value information.",
        },
        {
          question: "Why use an analyzer if I already have a decoder?",
          answer: "Because the analyzer gives a fast readiness summary instead of making you inspect every field manually.",
        },
      ],
    },
    "nonce-checker": {
      title: "Nonce Checker",
      seoTitle: "Nonce Checker | Kaya",
      description: "Check latest and pending EVM account nonce values from a live RPC endpoint.",
      intro:
        "Use this nonce checker to query the latest and pending EVM account nonce from a live RPC endpoint for Ethereum, Base, Arbitrum, Optimism, or a custom network.",
      exampleHeading: "Example Usage",
      explanationHeading: "Nonce Checker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a wallet has pending transactions stuck ahead of the mined nonce.",
        "Compare latest and pending nonce before sending a manual transaction.",
        "Query nonce state on Base, Arbitrum, Optimism, or a custom RPC URL.",
      ],
      explanation:
        "A nonce checker helps you understand the transaction sequence state of an EVM account. It queries both the latest mined nonce and the pending nonce from a live RPC endpoint, then shows the gap between them. That gap can reveal whether the account has queued or unconfirmed transactions that may affect the next usable nonce. This is helpful when you are debugging wallet behavior, replacing transactions, handling manual signing, or checking whether a stuck pending state exists. Because it runs in the browser and uses a standard JSON-RPC endpoint, it stays static-site compatible while still providing live chain data.",
      faq: [
        {
          question: "What is an EVM nonce?",
          answer: "It is the transaction sequence number for an account, incremented each time that account sends a transaction.",
        },
        {
          question: "Why compare latest and pending nonce?",
          answer: "The difference can show whether there are queued or unconfirmed transactions ahead of the latest mined state.",
        },
        {
          question: "Do I need my own RPC URL?",
          answer: "No. You can use a preset network RPC or provide your own custom endpoint.",
        },
      ],
    },
    "price-impact-calculator": {
      title: "Price Impact Calculator",
      seoTitle: "Price Impact Calculator | Kaya",
      description: "Estimate AMM swap price impact from reserves, trade size, and fee bps.",
      intro:
        "Use this price impact calculator to estimate AMM swap output, execution price, and price impact from pool reserves, trade size, and fee bps.",
      exampleHeading: "Example Usage",
      explanationHeading: "Price Impact Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how much output a trade would get from a constant-product pool.",
        "Compare the ideal no-slippage output against the actual AMM output.",
        "Check how fee bps and trade size change execution price before swapping.",
      ],
      explanation:
        "A price impact calculator helps you estimate how much a swap moves the price in an automated market maker pool. It compares the ideal no-slippage output against the actual output after both AMM curve effects and trading fees. That lets you see price impact, execution price, and how the post-trade pool price changes. This is useful when planning trade size, comparing routes, or explaining why larger swaps get worse execution than smaller ones. The calculator uses a simple constant-product AMM model, which makes it a good fit for first-pass DeFi analysis and user education.",
      faq: [
        {
          question: "What is price impact?",
          answer: "Price impact is the amount a trade moves the pool price away from the pre-trade spot price.",
        },
        {
          question: "Is price impact the same as fee?",
          answer: "No. Fees are explicit trading costs, while price impact comes from moving along the AMM curve.",
        },
        {
          question: "Does this model every AMM exactly?",
          answer: "No. It uses a simple constant-product model, which is useful for quick estimates but not every pool design.",
        },
      ],
    },
    "slippage-calculator": {
      title: "Slippage Calculator",
      seoTitle: "Slippage Calculator | Kaya",
      description: "Calculate minimum received and actual slippage against a chosen tolerance.",
      intro:
        "Use this slippage calculator to compare expected output, actual output, and minimum received against a chosen slippage tolerance.",
      exampleHeading: "Example Usage",
      explanationHeading: "Slippage Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a completed swap output stayed within your slippage setting.",
        "Calculate the minimum received amount before submitting a trade.",
        "Compare actual output against expected output for quick post-trade review.",
      ],
      explanation:
        "A slippage calculator helps you measure how far a real or expected trade output moves away from the quoted amount. By entering the expected output, actual output, and a chosen tolerance, you can see the minimum acceptable received amount and whether the trade stays within that limit. This is useful for DEX swaps, router checks, and user education because slippage settings are often misunderstood. The tool is intentionally simple: it focuses on the direct relationship between quote, execution, and tolerance, which makes it useful both before and after a trade.",
      faq: [
        {
          question: "What is slippage?",
          answer: "Slippage is the difference between the quoted output and the amount you actually receive when the trade executes.",
        },
        {
          question: "Why calculate minimum received?",
          answer: "Because it shows the lowest output that still fits within your chosen slippage tolerance.",
        },
        {
          question: "Is slippage always caused by fees?",
          answer: "No. Fees are one factor, but pool depth, price movement, and routing effects also matter.",
        },
      ],
    },
    "arbitrage-profit-calculator": {
      title: "Arbitrage Profit Calculator",
      seoTitle: "Arbitrage Profit Calculator | Kaya",
      description: "Estimate cross-venue arbitrage profit after fees, slippage, and transfer costs.",
      intro:
        "Use this arbitrage profit calculator to estimate net arbitrage profit after buy fees, sell fees, slippage, and transfer or network costs.",
      exampleHeading: "Example Usage",
      explanationHeading: "Arbitrage Profit Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate whether a price spread is still profitable after exchange fees.",
        "Check how transfer costs affect a cross-venue arbitrage idea.",
        "Find the break-even sell price for a proposed arbitrage cycle.",
      ],
      explanation:
        "An arbitrage profit calculator helps you move beyond raw price spread and estimate what you actually keep after costs. It accounts for buy-side fees, sell-side fees, extra slippage, and fixed network or transfer costs. That makes it useful for centralized exchange arbitrage, simple DeFi-to-CEX comparisons, and first-pass strategy review. Many apparent opportunities disappear once friction is included, so this tool is meant to provide a more realistic directional estimate before you spend time on execution details.",
      faq: [
        {
          question: "Why can a visible spread still be unprofitable?",
          answer: "Because fees, slippage, and transfer costs can easily consume the headline price difference.",
        },
        {
          question: "What does break-even sell price mean?",
          answer: "It is the minimum effective sell price required to recover all costs and avoid a loss.",
        },
        {
          question: "Is this enough to model live arbitrage execution?",
          answer: "No. It is a planning tool, not a replacement for real-time execution, liquidity, and latency analysis.",
        },
      ],
    },
    "liquidation-risk-calculator": {
      title: "Liquidation Risk Calculator",
      seoTitle: "Liquidation Risk Calculator | Kaya",
      description: "Estimate collateral LTV, liquidation price, and remaining buffer.",
      intro:
        "Use this liquidation risk calculator to estimate current LTV, maximum safe debt, liquidation price, and remaining price buffer for a collateralized position.",
      exampleHeading: "Example Usage",
      explanationHeading: "Liquidation Risk Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how far a collateral price can fall before liquidation.",
        "Check whether a borrow position is already close to its threshold.",
        "Compare different collateral prices to understand risk buffer.",
      ],
      explanation:
        "A liquidation risk calculator helps you estimate how exposed a collateralized borrow position is. By entering collateral amount, collateral price, debt size, and liquidation threshold, you can see the current loan-to-value ratio, the maximum safe debt level, the implied liquidation price, and how much price buffer remains. This is useful for lending markets, CDP-style positions, and educational DeFi dashboards. The tool is simplified, but it gives a fast risk snapshot that is often enough for first-pass monitoring and planning.",
      faq: [
        {
          question: "What is liquidation price?",
          answer: "It is the collateral price at which the position reaches its liquidation threshold.",
        },
        {
          question: "What does LTV mean?",
          answer: "LTV is loan-to-value, which compares debt size against collateral value.",
        },
        {
          question: "Does this replace protocol-specific risk logic?",
          answer: "No. Different lending protocols have extra rules, bonuses, and oracle behavior, so this is a simplified estimator.",
        },
      ],
    },
    "btc-address-generator": {
      title: "BTC Address Generator",
      seoTitle: "BTC Address Generator | Kaya",
      description: "Generate a random Bitcoin address with common address formats in the browser.",
      intro:
        "Use this BTC address generator to create random Bitcoin addresses in common formats like P2PKH, P2WPKH, and wrapped SegWit directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "BTC Address Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a fresh mainnet Bitcoin address for testing address parsing logic.",
        "Switch to testnet and create sample addresses for wallet QA flows.",
        "Compare how the same random key maps into legacy and SegWit formats.",
      ],
      explanation:
        "A BTC address generator helps you quickly produce random Bitcoin addresses for testing, demos, and development workflows. This version generates a random private key in the browser, derives a compressed public key, and then renders common address styles such as legacy P2PKH, native SegWit P2WPKH, and wrapped SegWit P2SH-P2WPKH. That makes it useful for wallet UI checks, parser testing, and fixture generation. Because it runs locally in the browser, it stays static-site compatible and does not require a backend service.",
      faq: [
        {
          question: "Does this create real Bitcoin addresses?",
          answer: "Yes. The generated addresses are syntactically real for the selected network.",
        },
        {
          question: "Can I switch between mainnet and testnet?",
          answer: "Yes. The generator supports both Bitcoin mainnet and testnet formats.",
        },
        {
          question: "Is the private key output in WIF?",
          answer: "No. This tool shows the raw hex private key rather than WIF encoding.",
        },
      ],
    },
    "batch-btc-address-generator": {
      title: "Batch BTC Address Generator",
      seoTitle: "Batch BTC Address Generator | Kaya",
      description: "Generate a batch of random Bitcoin addresses for quick testing or fixtures.",
      intro:
        "Use this batch BTC address generator to create multiple random Bitcoin addresses at once for testing, fixtures, and wallet QA flows.",
      exampleHeading: "Example Usage",
      explanationHeading: "Batch BTC Address Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a small batch of mainnet addresses for parser or import testing.",
        "Create testnet address fixtures for wallet onboarding screens.",
        "Produce sample address sets with private keys for local QA data.",
      ],
      explanation:
        "A batch BTC address generator is useful when you need more than one sample address at a time. Instead of repeatedly clicking a single generator, you can choose a batch size and output a structured list of random Bitcoin addresses along with their key material for local testing. This is helpful for fixture generation, import validation, address table rendering, and wallet flow QA. The tool is intentionally simple and browser-side, which keeps it fast and static-site compatible while still producing realistic address data for development use.",
      faq: [
        {
          question: "How many addresses can I generate at once?",
          answer: "This tool supports small batches for quick testing and sample data generation.",
        },
        {
          question: "Does it support testnet output too?",
          answer: "Yes. You can switch between mainnet and testnet generation.",
        },
        {
          question: "Is this meant for production custody use?",
          answer: "No. It is primarily a browser-side developer and QA utility.",
        },
      ],
    },
    "ordinal-size-calculator": {
      title: "Ordinal Size Calculator",
      seoTitle: "Ordinal Size Calculator | Kaya",
      description: "Estimate reveal size, script bytes, and chunk count for Ordinals content.",
      intro:
        "Use this ordinal size calculator to estimate chunk count, inscription script bytes, and reveal transaction size from content size assumptions.",
      exampleHeading: "Example Usage",
      explanationHeading: "Ordinal Size Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how many chunks are needed for a larger inscription payload.",
        "Compare reveal size assumptions for P2TR and P2WPKH style outputs.",
        "Preview how content byte size affects reveal transaction footprint.",
      ],
      explanation:
        "An ordinal size calculator helps you estimate how large an inscription reveal path may become before you build the full transaction. By taking content byte size, MIME type length, chunk size, and a reveal output assumption, it approximates chunk count, script bytes, reveal bytes, and reveal vbytes. This is useful for UI planning, fee sensitivity checks, and first-pass product design around inscription workflows. It is not a full script compiler, but it gives a quick practical estimate that is often enough for early planning.",
      faq: [
        {
          question: "Why does content need chunking?",
          answer: "Because larger inscription payloads are commonly split into smaller script pushes instead of one giant data push.",
        },
        {
          question: "Is this a precise script-level simulator?",
          answer: "No. It is a practical size estimator rather than an exact script constructor.",
        },
        {
          question: "Why estimate reveal vbytes?",
          answer: "Because reveal size strongly affects inscription fee planning and UX cost previews.",
        },
      ],
    },
    "transaction-analyzer": {
      title: "Transaction Analyzer",
      seoTitle: "Transaction Analyzer | Kaya",
      description: "Analyze a raw signed EVM transaction and summarize gas, bytes, and signature data.",
      intro:
        "Use this transaction analyzer to inspect a raw signed EVM transaction and summarize fields like type, calldata bytes, fee model, and signature parts.",
      exampleHeading: "Example Usage",
      explanationHeading: "Transaction Analyzer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a signed raw transaction and inspect whether it is legacy or EIP-1559 style.",
        "Check calldata size, zero bytes, and intrinsic gas assumptions quickly.",
        "Review signature fields and fee settings before relaying a transaction elsewhere.",
      ],
      explanation:
        "A transaction analyzer helps you inspect a raw signed EVM transaction beyond simple field decoding. It summarizes chain context, gas settings, calldata size, zero and non-zero byte counts, intrinsic calldata gas, and signature parts in a compact view. That makes it useful when debugging signed payloads, checking fee model assumptions, or comparing how much calldata overhead a transaction carries. It is a good complement to a basic transaction decoder because it focuses on operational characteristics rather than only structural fields.",
      faq: [
        {
          question: "How is this different from a transaction decoder?",
          answer: "A decoder focuses on the fields themselves, while this analyzer also summarizes byte-level and gas-related characteristics.",
        },
        {
          question: "Does it support EIP-1559 transactions?",
          answer: "Yes. It can summarize legacy and typed transaction fee fields when present.",
        },
        {
          question: "Why count zero and non-zero calldata bytes?",
          answer: "Because they affect intrinsic calldata gas cost on EVM chains.",
        },
      ],
    },
    "gas-optimization-analyzer": {
      title: "Gas Optimization Analyzer",
      seoTitle: "Gas Optimization Analyzer | Kaya",
      description: "Estimate calldata gas overhead and fee savings from a possible gas reduction.",
      intro:
        "Use this gas optimization analyzer to estimate calldata byte overhead, fee cost, and potential savings from a projected gas reduction.",
      exampleHeading: "Example Usage",
      explanationHeading: "Gas Optimization Analyzer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how much calldata contributes to intrinsic gas for a transaction payload.",
        "Compare current fee cost against a hypothetical optimized gas usage target.",
        "Check how zero-byte density affects calldata gas characteristics.",
      ],
      explanation:
        "A gas optimization analyzer helps you translate calldata structure and gas reduction ideas into fee impact. By combining gas used, gas price, calldata bytes, and a projected optimization percentage, the tool estimates current cost, optimized cost, and possible savings in ETH terms. This is useful for contract teams, frontend engineers, and analysts who want a lightweight way to reason about calldata overhead and performance improvements without setting up a full profiling workflow. It is not a replacement for profiler traces, but it is a fast first-pass economics tool.",
      faq: [
        {
          question: "Does this tool optimize my contract automatically?",
          answer: "No. It estimates the impact of a hypothetical gas reduction rather than changing code for you.",
        },
        {
          question: "Why does calldata byte composition matter?",
          answer: "Because zero and non-zero bytes have different intrinsic gas costs on EVM chains.",
        },
        {
          question: "Is this enough for production gas benchmarking?",
          answer: "No. It is a directional cost estimator, not a substitute for trace-based benchmarking.",
        },
      ],
    },
    "psbt-builder": {
      title: "PSBT Builder",
      seoTitle: "PSBT Builder | Kaya",
      description: "Build a simple Bitcoin PSBT from input, recipient, and optional change details.",
      intro:
        "Use this PSBT builder to create a simple Bitcoin PSBT from one input, one recipient output, and an optional change output directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "PSBT Builder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Build a simple unsigned PSBT for a wallet or signer to complete later.",
        "Create a base64 PSBT from a known UTXO and recipient address.",
        "Generate a quick PSBT skeleton with an optional change output.",
      ],
      explanation:
        "A PSBT builder helps you turn basic transaction details into a Partially Signed Bitcoin Transaction that another wallet or signer can inspect and complete. This lightweight version focuses on a simple structure: one input, one recipient, and optional change. That is enough for testing, wallet handoff flows, demos, and front-end product checks. It also outputs both base64 and hex forms, which makes it easier to pass the PSBT into other systems. For more complex multisig or advanced scripting cases you will still want deeper tooling, but this is a useful static-site builder for common simple flows.",
      faq: [
        {
          question: "What is a PSBT builder used for?",
          answer: "It creates a transaction draft in PSBT form so another wallet or signer can review and sign it.",
        },
        {
          question: "Does this tool sign the transaction?",
          answer: "No. It only builds the PSBT structure and leaves signing to another tool or wallet.",
        },
        {
          question: "Why output both base64 and hex?",
          answer: "Because different wallets and services accept different PSBT encodings.",
        },
      ],
    },
    "ordinal-fee-estimator": {
      title: "Ordinal Fee Estimator",
      seoTitle: "Ordinal Fee Estimator | Kaya",
      description: "Estimate commit and reveal fees for a simple Ordinals inscription flow.",
      intro:
        "Use this ordinal fee estimator to estimate commit fee, reveal fee, total fee, and postage for a simple Ordinals inscription flow.",
      exampleHeading: "Example Usage",
      explanationHeading: "Ordinal Fee Estimator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how content size changes the reveal fee for an inscription.",
        "Compare P2TR and P2WPKH style reveal assumptions.",
        "Calculate total fee plus postage before building an inscription flow.",
      ],
      explanation:
        "An ordinal fee estimator gives you a rough cost estimate for a simple inscription flow by separating commit and reveal fees. It uses content size, fee rate, output type assumptions, and postage to estimate total spend. This is useful when you want a quick planning number before building the full commit-reveal transaction sequence. Exact inscription cost depends on script details and construction choices, but a lightweight estimator is still valuable for product previews, UI planning, and user education around inscription size and fee sensitivity.",
      faq: [
        {
          question: "Why are there separate commit and reveal fees?",
          answer: "Because many inscription flows use a two-step structure, with one transaction committing and another revealing the content.",
        },
        {
          question: "What is postage?",
          answer: "Postage is the amount of satoshis carried with the inscription output itself, separate from fees.",
        },
        {
          question: "Is this an exact inscription fee calculator?",
          answer: "No. It is a simplified estimator meant for quick planning rather than exact script-level accounting.",
        },
      ],
    },
    "ordinal-inscription-builder": {
      title: "Ordinal Inscription Builder",
      seoTitle: "Ordinal Inscription Builder | Kaya",
      description: "Build a simple Ordinals inscription manifest and content preview in the browser.",
      intro:
        "Use this ordinal inscription builder to prepare a lightweight inscription manifest, content hex preview, and reveal planning data directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Ordinal Inscription Builder Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Turn inscription text into a content hex preview before deeper transaction work.",
        "Prepare MIME type, postage, and destination fields in one place.",
        "Create a simple inscription draft for demos or front-end flow planning.",
      ],
      explanation:
        "An ordinal inscription builder helps you prepare the content and metadata side of an inscription before you move into a full transaction flow. It turns text content into a hex preview, keeps MIME and postage details together, and outputs a lightweight manifest that can feed later fee or PSBT steps. This is useful for prototypes, content preparation, and UI workflows where you want a structured inscription draft without building the full script path yet.",
      faq: [
        {
          question: "Does this build a signed inscription transaction?",
          answer: "No. It prepares content and metadata rather than a fully signed on-chain transaction.",
        },
        {
          question: "Why output content hex?",
          answer: "Because it helps you inspect how the inscription payload is encoded before later construction steps.",
        },
        {
          question: "Is this still useful without wallet connectivity?",
          answer: "Yes. It is designed as a browser-side planning and preview tool.",
        },
      ],
    },
    "multi-chain-tx-viewer": {
      title: "Multi Chain TX Viewer",
      seoTitle: "Multi Chain TX Viewer | Kaya",
      description: "Query the same EVM transaction hash across multiple preset chains.",
      intro:
        "Use this multi chain tx viewer to check the same transaction hash across Ethereum, Base, Arbitrum, and Optimism from one place.",
      exampleHeading: "Example Usage",
      explanationHeading: "Multi Chain TX Viewer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check which preset chain a transaction hash actually belongs to.",
        "Compare transaction and receipt availability across multiple EVM networks.",
        "Quickly rule out chain confusion during support or debugging work.",
      ],
      explanation:
        "A multi chain tx viewer helps when you have a transaction hash but are not fully sure which EVM network it belongs to, or you want to compare multiple networks quickly. Instead of querying one chain at a time, the tool checks a preset group of RPC endpoints and returns transaction and receipt results together. This makes it useful for support, cross-chain operations, and debugging flows where hash context can get mixed up.",
      faq: [
        {
          question: "Does this search every EVM chain?",
          answer: "No. It checks a small preset list of major chains rather than the entire EVM ecosystem.",
        },
        {
          question: "Why might a hash exist on one chain but not another?",
          answer: "Because transaction hashes are chain-specific and only exist where the transaction was actually broadcast.",
        },
        {
          question: "Does it include receipt data too?",
          answer: "Yes. The viewer queries both transaction and receipt data when available.",
        },
      ],
    },
    "oracle-delay-analyzer": {
      title: "Oracle Delay Analyzer",
      seoTitle: "Oracle Delay Analyzer | Kaya",
      description: "Measure oracle update lag against a reference timestamp and heartbeat.",
      intro:
        "Use this oracle delay analyzer to compare an oracle update timestamp against a reference timestamp and expected heartbeat interval.",
      exampleHeading: "Example Usage",
      explanationHeading: "Oracle Delay Analyzer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Measure how stale an oracle update is relative to a current reference time.",
        "See how many expected heartbeat intervals were missed.",
        "Classify feed freshness as fresh, stale, or critical.",
      ],
      explanation:
        "An oracle delay analyzer helps you turn raw timestamps into a clearer operational signal. By comparing an oracle update time against a reference time and expected heartbeat interval, the tool shows total lag, minutes of delay, missed heartbeat counts, and a simple freshness classification. This is useful for monitoring dashboards, incident review, and DeFi product logic where stale oracle data creates risk.",
      faq: [
        {
          question: "What is an oracle heartbeat?",
          answer: "It is the expected maximum interval between normal oracle updates under the feed's operating assumptions.",
        },
        {
          question: "Why track missed heartbeats?",
          answer: "Because it shows how far behind the feed is relative to expected update cadence.",
        },
        {
          question: "Is this protocol-specific oracle logic?",
          answer: "No. It is a generic lag analyzer based on timestamps and heartbeat assumptions.",
        },
      ],
    },
    "contract-bytecode-analyzer": {
      title: "Contract Bytecode Analyzer",
      seoTitle: "Contract Bytecode Analyzer | Kaya",
      description: "Inspect contract bytecode size, metadata hints, and EIP-170 usage.",
      intro:
        "Use this contract bytecode analyzer to inspect a contract bytecode hex string, measure code size, detect common metadata patterns, and compare the size against EIP-170 limits.",
      exampleHeading: "Example Usage",
      explanationHeading: "Contract Bytecode Analyzer Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Measure whether runtime or creation bytecode is close to the EIP-170 contract size limit.",
        "Check whether a bytecode blob appears to contain Solidity metadata.",
        "Inspect byte prefixes and suffixes when comparing contract build outputs.",
      ],
      explanation:
        "A contract bytecode analyzer helps you inspect the structure and size of an EVM bytecode blob before deployment or during debugging. By pasting the bytecode, you can quickly see how many bytes it contains, how many 32-byte words it spans, whether it appears to include metadata, and how close it is to the EIP-170 contract size limit. This is useful when optimizing contract builds, comparing compiler outputs, reviewing deployment artifacts, or checking whether a code sample is runtime bytecode or something larger. It gives you fast feedback without opening a full development environment.",
      faq: [
        {
          question: "What is EIP-170?",
          answer: "EIP-170 sets a maximum size for deployed contract runtime bytecode on Ethereum.",
        },
        {
          question: "Does metadata count toward contract size?",
          answer: "Yes. Metadata bytes are part of the bytecode length unless removed before deployment.",
        },
        {
          question: "Can this tool prove whether bytecode is creation code or runtime code?",
          answer: "Not with full certainty, but it can provide size hints and patterns that help you inspect the blob more quickly.",
        },
      ],
    },
    "prompt-formatter": {
      title: "Prompt Formatter",
      seoTitle: "Prompt Formatter | Kaya",
      description: "Clean up prompt structure, spacing, and inline sections for reuse.",
      intro:
        "Use this prompt formatter to clean up messy prompt text, normalize spacing, and separate inline sections into a more reusable prompt structure.",
      exampleHeading: "Example Usage",
      explanationHeading: "Prompt Formatter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Clean up a rough draft prompt before saving it into your workflow.",
        "Split inline fields like tone, audience, and format into clearer sections.",
        "Make prompts easier to reuse across AI chat, writing, and coding tasks.",
      ],
      explanation:
        "A prompt formatter helps turn messy or one-line prompt drafts into cleaner, more reusable instructions. Instead of leaving all details packed into a single sentence, the tool normalizes spacing, removes noise, and separates obvious inline sections such as audience, tone, constraints, and output format. This is useful when you write prompts quickly and want a more readable version before storing, sharing, or iterating on it. The goal is not to change your intent, but to make the structure easier for both humans and AI systems to follow.",
      faq: [
        {
          question: "Does this change the meaning of my prompt?",
          answer: "It tries to preserve the meaning while making the structure cleaner and easier to read.",
        },
        {
          question: "Can it separate inline fields automatically?",
          answer: "Yes. It can pull out simple inline sections such as labels followed by a colon when the pattern is clear.",
        },
        {
          question: "Is this useful for prompt libraries?",
          answer: "Yes. Cleanly formatted prompts are easier to store, compare, and reuse across projects.",
        },
      ],
    },
    "text-to-markdown": {
      title: "Text to Markdown",
      seoTitle: "Text to Markdown | Kaya",
      description: "Turn plain text notes into a simple markdown structure instantly.",
      intro:
        "Use this text to markdown tool to turn rough plain text notes into a cleaner markdown structure with headings and list preservation.",
      exampleHeading: "Example Usage",
      explanationHeading: "Text to Markdown Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Turn raw meeting notes into a markdown outline.",
        "Convert plain text release notes into a simple shareable format.",
        "Prepare copied notes for markdown-based docs or AI context files.",
      ],
      explanation:
        "A text to markdown tool is useful when you have plain text notes that need a little structure before you use them in docs, wikis, prompts, or markdown-based systems. This version converts the first main line into a heading, preserves simple list items, and turns section-like blocks into a more readable markdown outline. It is helpful for quick cleanup rather than full semantic conversion. That makes it a practical browser-side tool for developers, writers, and AI users who often move between raw notes and markdown workflows.",
      faq: [
        {
          question: "Will it preserve bullet lists?",
          answer: "Yes. Existing simple bullet or numbered list lines are preserved where possible.",
        },
        {
          question: "Does it produce perfect markdown every time?",
          answer: "No. It provides a useful first pass, especially for rough notes, but you may still want small manual edits.",
        },
        {
          question: "Why convert text into markdown at all?",
          answer: "Markdown is easier to reuse in docs, README files, notes apps, and many AI or developer workflows.",
        },
      ],
    },
    "markdown-preview": {
      title: "Markdown Preview",
      seoTitle: "Markdown Preview | Kaya",
      description: "Preview markdown with headings, lists, and inline formatting in the browser.",
      intro:
        "Use this markdown preview tool to render headings, paragraphs, lists, and simple inline formatting from markdown text instantly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Markdown Preview Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Preview markdown notes before pasting them into a README or docs page.",
        "Check how headings and bullet lists will render from raw markdown text.",
        "Inspect simple formatting like inline code, bold, and italics quickly.",
      ],
      explanation:
        "A markdown preview tool gives you fast feedback on how raw markdown text will look after rendering. That is useful when you are editing notes, README content, changelogs, prompts, or AI-generated markdown and want to confirm the structure before using it elsewhere. This lightweight preview focuses on the most common formatting patterns such as headings, paragraphs, list items, inline code, bold, and emphasis. For quick editing and validation, that is often enough to catch obvious formatting issues without switching into a heavier editor.",
      faq: [
        {
          question: "Does it support full markdown syntax?",
          answer: "No. This preview focuses on common structures like headings, paragraphs, lists, and simple inline formatting.",
        },
        {
          question: "Why use a preview instead of reading raw markdown?",
          answer: "Because rendered output often reveals formatting mistakes that are harder to spot in plain text.",
        },
        {
          question: "Is this useful for AI-generated markdown?",
          answer: "Yes. It is a quick way to inspect whether generated markdown looks structurally correct before reuse.",
        },
      ],
    },
    "json-to-prompt": {
      title: "JSON to Prompt",
      seoTitle: "JSON to Prompt | Kaya",
      description: "Turn structured JSON fields into a readable prompt template.",
      intro:
        "Use this JSON to prompt tool to convert structured JSON fields into a readable prompt layout for AI workflows, docs, and prompt templates.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON to Prompt Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Turn a structured task config object into a readable prompt template.",
        "Convert app-side JSON settings into instructions for an LLM workflow.",
        "Make nested prompt data easier to inspect and edit manually.",
      ],
      explanation:
        "A JSON to prompt tool is useful when prompt inputs are already stored in structured form but still need to be read or edited by humans. Instead of staring at braces and quotes, you can turn objects and arrays into a cleaner prompt-style layout with labels, indentation, and bullet-like sections. This is especially helpful in AI apps, prompt libraries, and workflow tools where prompt fields are stored as JSON but shared as plain-text instructions. It makes the structured input easier to review without losing the underlying hierarchy.",
      faq: [
        {
          question: "Why convert JSON into a prompt at all?",
          answer: "Because prompt-like text is often easier to review, edit, and share than raw JSON objects.",
        },
        {
          question: "Does it preserve nested structure?",
          answer: "Yes. Nested objects and arrays are rendered into indented sections to keep their structure readable.",
        },
        {
          question: "Can I use this with app config or workflow payloads?",
          answer: "Yes. It is useful for turning structured configs or payloads into human-readable instructions.",
        },
      ],
    },
    "ai-token-estimator": {
      title: "AI Token Estimator",
      seoTitle: "AI Token Estimator | Kaya",
      description: "Estimate prompt token usage from text length with a fast rough heuristic.",
      intro:
        "Use this AI token estimator to get a rough token estimate from your prompt text before sending it into an LLM workflow.",
      exampleHeading: "Example Usage",
      explanationHeading: "AI Token Estimator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Estimate how large a prompt is before sending it to a model.",
        "Compare short and long prompt drafts during iteration.",
        "Get a quick planning number when thinking about context window usage.",
      ],
      explanation:
        "An AI token estimator helps you get a rough sense of prompt size without running a full tokenizer. It counts characters, words, lines, and then uses a lightweight heuristic to estimate token usage. This is useful when you are drafting prompts, comparing versions, or deciding whether content may fit into a model context window. Because tokenization differs by model and language, the result is only an approximation, but it is still helpful for planning and quick checks when you do not need billing-grade precision.",
      faq: [
        {
          question: "Is this token estimate exact?",
          answer: "No. It is a rough heuristic meant for planning, not exact billing or model-specific token counts.",
        },
        {
          question: "Why can exact token counts vary?",
          answer: "Different models and tokenizers split text differently, especially across languages and symbols.",
        },
        {
          question: "When is a rough estimate still useful?",
          answer: "It is useful during drafting, iteration, and context planning when you only need a fast directional number.",
        },
      ],
    },
    "prompt-template-generator": {
      title: "Prompt Template Generator",
      seoTitle: "Prompt Template Generator | Kaya",
      description: "Generate reusable prompt templates for writing, coding, or research tasks.",
      intro:
        "Use this prompt template generator to build reusable prompt structures for writing, coding, and research tasks from a few high-level fields.",
      exampleHeading: "Example Usage",
      explanationHeading: "Prompt Template Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a writing prompt template from a topic, audience, and style constraints.",
        "Build a coding prompt skeleton before filling in project-specific details.",
        "Create a research prompt structure you can reuse across similar tasks.",
      ],
      explanation:
        "A prompt template generator helps you create repeatable prompt structures instead of rewriting the same instructions from scratch each time. You can define the task type, topic, audience, and constraints, then turn those inputs into a clean prompt scaffold that is easy to reuse. This is useful for building team prompt libraries, standardizing recurring workflows, and reducing inconsistencies between prompt drafts. The output is not meant to be the final answer itself. It is a reusable frame that you can refine, extend, and adapt for specific projects as your needs change.",
      faq: [
        {
          question: "What is a prompt template?",
          answer: "It is a reusable prompt structure you can fill with task-specific details instead of rewriting the full instruction each time.",
        },
        {
          question: "Why use a template instead of writing prompts from scratch?",
          answer: "Templates improve consistency, save time, and make recurring prompt workflows easier to maintain.",
        },
        {
          question: "Can I customize the generated template?",
          answer: "Yes. The generated output is a starting structure that you can edit, extend, and adapt freely.",
        },
      ],
    },
    "code-explainer-lite": {
      title: "Code Explainer Lite",
      seoTitle: "Code Explainer Lite | Kaya",
      description: "Explain code structure with a lightweight browser-side summary.",
      intro:
        "Use this code explainer lite tool to get a quick structural explanation of a code snippet directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Code Explainer Lite Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a small function to see its likely language and control-flow traits.",
        "Use it to skim unfamiliar snippets before deeper review.",
        "Get a quick summary of whether code contains loops, conditionals, returns, or async patterns.",
      ],
      explanation:
        "Code Explainer Lite gives you a fast first-pass summary of a code snippet without relying on a heavy backend model. It looks at visible patterns such as syntax style, line count, indentation, loops, conditionals, return statements, and async markers to produce a lightweight explanation. This makes it useful when you want a quick orientation step before manual review or deeper analysis. Because it is heuristic and browser-side, it is best treated as a structural helper rather than a full semantic explanation or code review. For short snippets and quick checks, that tradeoff keeps it fast and simple.",
      faq: [
        {
          question: "Is this a full AI code review?",
          answer: "No. It is a lightweight structural explainer, not a deep semantic analyzer or reviewer.",
        },
        {
          question: "What languages can it recognize?",
          answer: "It uses simple pattern matching, so it can guess common snippet styles, but it does not guarantee exact language detection.",
        },
        {
          question: "Why use a lightweight explainer?",
          answer: "It is fast, local, and useful for quick orientation when you only need a high-level read of a snippet.",
        },
      ],
    },
    "text-summarizer-lite": {
      title: "Text Summarizer Lite",
      seoTitle: "Text Summarizer Lite | Kaya",
      description: "Create a short summary from a longer text block with a simple heuristic.",
      intro:
        "Use this text summarizer lite tool to turn a longer text block into a short summary directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Text Summarizer Lite Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Summarize notes, docs, or copied paragraphs into a shorter version.",
        "Preview what the key opening sentences of a text imply.",
        "Create a quick summary before rewriting or formatting text elsewhere.",
      ],
      explanation:
        "Text Summarizer Lite is a lightweight way to compress longer text into a shorter form without sending it to a backend service. Instead of doing deep semantic reasoning, it uses simple sentence-based heuristics to surface a concise summary candidate. That makes it useful for quick previews, note cleanup, and basic drafting workflows where speed matters more than perfect abstraction. It works best as a fast browser-side helper for trimming long paragraphs into a short readable form. If you need nuanced understanding or highly polished summaries, you should still treat the result as a starting point rather than a final authoritative version.",
      faq: [
        {
          question: "Is this summary AI-generated?",
          answer: "No. It is produced with lightweight browser-side heuristics rather than a remote model.",
        },
        {
          question: "Does it always keep the exact meaning?",
          answer: "Not always. It is a quick compression tool, so you should review the result before relying on it.",
        },
        {
          question: "When is a lightweight summarizer useful?",
          answer: "It is useful for quick previews, note cleanup, and rough drafting when speed matters more than depth.",
        },
      ],
    },
    "keyword-extractor": {
      title: "Keyword Extractor",
      seoTitle: "Keyword Extractor | Kaya",
      description: "Extract repeated keyword candidates from a text block quickly.",
      intro:
        "Use this keyword extractor to pull out repeated keyword candidates from a text block for SEO, notes, and content review.",
      exampleHeading: "Example Usage",
      explanationHeading: "Keyword Extractor Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Extract likely repeated keywords from a draft article.",
        "Check which technical terms dominate a block of notes.",
        "Use it as a quick SEO sanity check before publishing.",
      ],
      explanation:
        "A keyword extractor helps you spot the terms that appear most often in a block of text. This lightweight version uses a simple frequency-based approach with stopword filtering, so it is fast and easy to run directly in the browser. It is useful for rough SEO checks, content review, note cleanup, and seeing whether a draft overuses or underuses certain terms. Because it does not understand full semantic intent, you should think of it as a quick signal tool rather than a complete keyword strategy engine. For fast inspections and first-pass review, though, it is often enough.",
      faq: [
        {
          question: "Does it understand semantic relevance?",
          answer: "No. It mainly looks at repeated terms, so it is better for quick inspection than deep topic analysis.",
        },
        {
          question: "Why are some common words removed?",
          answer: "Stopwords are filtered out so the result focuses more on meaningful terms instead of filler words.",
        },
        {
          question: "Is this good for SEO planning?",
          answer: "It is useful for a quick SEO sanity check, but full keyword planning still needs broader research and judgment.",
        },
      ],
    },
    "chat-format-converter": {
      title: "Chat Format Converter",
      seoTitle: "Chat Format Converter | Kaya",
      description: "Convert raw conversation text into chat-role lines or bullet notes.",
      intro:
        "Use this chat format converter to normalize raw conversation text into chat-role lines or a simple bullet-note format.",
      exampleHeading: "Example Usage",
      explanationHeading: "Chat Format Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert pasted conversation notes into user and assistant style lines.",
        "Turn a chat log into bullet notes for docs or tickets.",
        "Normalize inconsistent role labels before reusing a conversation in AI tooling.",
      ],
      explanation:
        "Chat Format Converter helps you turn messy conversation text into a more structured form. It is useful when you have copied notes, chat transcripts, or mixed role labels and want to normalize them for prompts, documentation, tickets, or internal workflows. You can convert the input into role-based lines or a compact bullet-note format depending on what you need next. This makes downstream editing and reuse easier because the conversation becomes more consistent and readable. It is a simple formatting aid, but that kind of cleanup often saves time when working with AI inputs or archived discussions.",
      faq: [
        {
          question: "What formats does it support?",
          answer: "It can normalize conversation text into chat-role lines or turn it into bullet-style notes.",
        },
        {
          question: "Does it preserve conversation order?",
          answer: "Yes. The tool keeps the original sequence while reformatting the content.",
        },
        {
          question: "Why convert chat logs at all?",
          answer: "Structured chat text is easier to reuse in prompts, docs, issue trackers, and review workflows.",
        },
      ],
    },
    "random-decision-maker": {
      title: "Random Decision Maker",
      seoTitle: "Random Decision Maker | Kaya",
      description: "Pick one option at random from a custom list instantly.",
      intro:
        "Use this random decision maker to choose one option from a list when you want a fast, neutral pick without overthinking.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random Decision Maker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Choose between several lunch, travel, or task options.",
        "Break a tie when multiple choices feel equally good.",
        "Use it as a lightweight picker inside planning or brainstorming.",
      ],
      explanation:
        "A random decision maker helps when you already have a shortlist but do not want to spend extra time deciding between similar options. You enter one item per line, and the tool picks one at random in the browser. This is useful for small personal choices, team tie-breakers, content ideas, or any low-stakes situation where a neutral pick is good enough. It will not tell you which option is objectively best, but it removes hesitation and helps you move forward quickly. For everyday decisions, that simplicity is often the whole point.",
      faq: [
        {
          question: "Does it rank the options first?",
          answer: "No. It treats each option as an equal candidate and picks one randomly.",
        },
        {
          question: "Can I enter as many options as I want?",
          answer: "Yes. You can paste a short or long list, as long as each option is on its own line.",
        },
        {
          question: "Is this useful for serious decisions?",
          answer: "It is better for low-stakes choices and tie-breakers than for important decisions that need analysis.",
        },
      ],
    },
    "random-number-generator": {
      title: "Random Number Generator",
      seoTitle: "Random Number Generator | Kaya",
      description: "Generate random integers or decimals within a chosen range.",
      intro:
        "Use this random number generator to create one or more random numbers inside a custom range, with optional decimals or unique-value mode.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random Number Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a few random integers between 1 and 100.",
        "Create decimal samples for testing or mock data.",
        "Pick unique numbers from a finite range without repeats.",
      ],
      explanation:
        "A random number generator creates unpredictable numeric values inside a range you choose. This version can produce integers or decimals, generate multiple outputs at once, and optionally avoid duplicates when you need unique integers. It is useful for testing, lightweight simulations, games, sample data, and everyday picks like drawing a number from a range. Because it runs instantly in the browser, you can change the bounds and get new output without any backend or page reload. That makes it a simple but very flexible utility.",
      faq: [
        {
          question: "Can it generate decimals?",
          answer: "Yes. Set the decimal precision above zero to generate decimal values instead of integers only.",
        },
        {
          question: "What does unique mode do?",
          answer: "It prevents duplicates, but only works when the integer range is large enough for the requested count.",
        },
        {
          question: "Is this useful for testing?",
          answer: "Yes. It is handy for quick sample data, range testing, and light simulation work.",
        },
      ],
    },
    "random-password-generator": {
      title: "Random Password Generator",
      seoTitle: "Random Password Generator | Kaya",
      description: "Generate random passwords with adjustable length and symbol options.",
      intro:
        "Use this random password generator to create strong passwords with configurable length, count, and symbol inclusion.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random Password Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a long password for a new account.",
        "Create several password candidates at once.",
        "Switch symbols on or off depending on site rules.",
      ],
      explanation:
        "A random password generator helps you create stronger passwords than you would normally make by hand. Instead of relying on memorable but weaker patterns, it uses browser randomness to produce unpredictable character sequences. This version lets you control password length, output count, and whether symbols should be included. That is useful when different websites have different password rules or when you want several options to choose from. For everyday security hygiene, a generated password is usually better than a reused or human-chosen one.",
      faq: [
        {
          question: "Why are random passwords safer?",
          answer: "They are harder to guess because they avoid common patterns, reused words, and predictable substitutions.",
        },
        {
          question: "Should I include symbols?",
          answer: "Usually yes, unless a specific service has compatibility rules that make symbols inconvenient.",
        },
        {
          question: "Can I generate multiple passwords at once?",
          answer: "Yes. The tool can create several password candidates in one run.",
        },
      ],
    },
    "random-color-generator": {
      title: "Random Color Generator",
      seoTitle: "Random Color Generator | Kaya",
      description: "Generate random hex colors and preview a quick palette.",
      intro:
        "Use this random color generator to build a quick palette of random hex colors and preview each swatch instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random Color Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a few random colors for mock UI exploration.",
        "Pick quick palette ideas for illustrations or dashboards.",
        "Create random hex samples for CSS testing.",
      ],
      explanation:
        "A random color generator creates hex colors you can use in design experiments, CSS testing, or quick inspiration work. This version outputs multiple colors at once and shows each one as a swatch, so you can judge the palette visually instead of reading codes alone. It is useful for prototyping, small design exercises, placeholder themes, or generating sample color data. The result is random rather than curated, but that can be valuable when you want variety quickly and plan to refine the palette afterward.",
      faq: [
        {
          question: "What format does it output?",
          answer: "It outputs standard hex colors such as #3fa2c7 that you can paste into CSS or design tools.",
        },
        {
          question: "Can I use these colors directly in CSS?",
          answer: "Yes. The generated hex values work directly in CSS, SVG, and most design software.",
        },
        {
          question: "Does random mean the palette will always look good?",
          answer: "No. Random output is best for exploration, and you may still want to refine the final choices manually.",
        },
      ],
    },
    "random-gradient-generator": {
      title: "Random Gradient Generator",
      seoTitle: "Random Gradient Generator | Kaya",
      description: "Generate random CSS linear gradients with instant preview output.",
      intro:
        "Use this random gradient generator to create CSS linear gradients with random colors and angles, then preview the result instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "Random Gradient Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate background ideas for landing pages or cards.",
        "Create random gradient strings for CSS experiments.",
        "Browse a few gradient directions and color mixes quickly.",
      ],
      explanation:
        "A random gradient generator gives you ready-to-use CSS linear gradients without manually choosing every angle and color stop. Each output includes a visual preview and the gradient string itself, so you can test ideas quickly in the browser and then copy the CSS into your own project. This is useful for design exploration, hero backgrounds, demo screens, or placeholder styling during frontend work. Because the output is random, some results will be stronger than others, but it is a fast way to explore combinations you might not have chosen yourself.",
      faq: [
        {
          question: "What kind of gradients does it generate?",
          answer: "This version generates CSS linear gradients with random angles and three color stops.",
        },
        {
          question: "Can I paste the result into CSS directly?",
          answer: "Yes. The output is a CSS gradient string that works in modern browsers.",
        },
        {
          question: "Why use a random gradient generator?",
          answer: "It is useful for quick visual exploration when you want fresh combinations without manual tweaking first.",
        },
      ],
    },
    "coin-flip-simulator": {
      title: "Coin Flip Simulator",
      seoTitle: "Coin Flip Simulator | Kaya",
      description: "Flip a virtual coin and track heads or tails results instantly.",
      intro:
        "Use this coin flip simulator to flip a virtual coin in the browser and keep a simple running count of heads and tails.",
      exampleHeading: "Example Usage",
      explanationHeading: "Coin Flip Simulator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Settle a quick yes-or-no decision with a virtual coin toss.",
        "Run a few flips to explain probability basics.",
        "Use it as a simple randomizer without carrying a real coin.",
      ],
      explanation:
        "A coin flip simulator gives you a fast digital version of a classic random choice. Instead of tossing a physical coin, you click once and the tool returns heads or tails immediately in the browser. This version also keeps a small running count so you can see how the distribution changes over multiple flips. That makes it useful for tie-breakers, classroom examples, simple games, or lightweight probability demos. It is a small tool, but it is practical because the result is instant and requires no setup.",
      faq: [
        {
          question: "Is this the same as a real coin toss?",
          answer: "It is a software randomizer, so it is not physically identical, but it serves the same quick decision purpose.",
        },
        {
          question: "Does it keep track of previous flips?",
          answer: "Yes. This version shows how many heads and tails have appeared so far.",
        },
        {
          question: "What is it useful for?",
          answer: "It is useful for tie-breakers, simple games, and quick probability demonstrations.",
        },
      ],
    },
    "dice-roll-simulator": {
      title: "Dice Roll Simulator",
      seoTitle: "Dice Roll Simulator | Kaya",
      description: "Roll one or more virtual dice and see the total immediately.",
      intro:
        "Use this dice roll simulator to roll one or more virtual dice in the browser and inspect each value plus the total score.",
      exampleHeading: "Example Usage",
      explanationHeading: "Dice Roll Simulator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Roll two dice for a board-game style move.",
        "Generate dice totals for quick tabletop testing.",
        "Simulate multiple dice without physical pieces.",
      ],
      explanation:
        "A dice roll simulator gives you virtual dice results instantly without needing real dice on hand. You can choose how many dice to roll, then see each individual value and the total combined score. This is useful for board-game helpers, tabletop prototypes, teaching probability, or any casual situation where you need a random number from a die. Because the result updates immediately in the browser, it is also convenient for lightweight demos and testing.",
      faq: [
        {
          question: "How many dice can I roll at once?",
          answer: "This version supports a small group of dice at once so the output stays easy to read.",
        },
        {
          question: "Does it show each die or only the total?",
          answer: "It shows both the individual die values and the total score.",
        },
        {
          question: "Can I use it for games?",
          answer: "Yes. It works well for quick board-game, tabletop, or classroom use.",
        },
      ],
    },
    "number-guessing-game": {
      title: "Number Guessing Game",
      seoTitle: "Number Guessing Game | Kaya",
      description: "Play a browser number guessing game with attempt tracking.",
      intro:
        "Use this number guessing game to guess a hidden number between 1 and 100, with instant higher-or-lower feedback and attempt counting.",
      exampleHeading: "Example Usage",
      explanationHeading: "Number Guessing Game Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Play a quick higher-or-lower guessing game in the browser.",
        "Use it as a small logic warm-up or break-time game.",
        "Reset and try to beat your previous attempt count.",
      ],
      explanation:
        "A number guessing game is a simple interactive puzzle where the browser picks a hidden number and you try to find it through repeated guesses. After each guess, the tool tells you whether your number is too high or too low, which helps you narrow the range until you find the correct answer. This version also tracks how many attempts you used. It is useful as a lightweight game, a logic exercise, or a quick interactive example of stateful browser behavior.",
      faq: [
        {
          question: "What range does it use?",
          answer: "This version uses a hidden number between 1 and 100.",
        },
        {
          question: "Does it tell me if I am too high or too low?",
          answer: "Yes. After every guess, you get immediate directional feedback.",
        },
        {
          question: "Can I start a new round?",
          answer: "Yes. The new game button resets the target number and attempt counter.",
        },
      ],
    },
    "click-speed-test": {
      title: "Click Speed Test",
      seoTitle: "Click Speed Test | Kaya",
      description: "Measure how many clicks you can make in a short timed test.",
      intro:
        "Use this click speed test to measure how many clicks you can make in five seconds and estimate your average clicks per second.",
      exampleHeading: "Example Usage",
      explanationHeading: "Click Speed Test Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Measure your click speed over a short fixed timer.",
        "Compare results with friends or between sessions.",
        "Use it as a simple browser interaction benchmark.",
      ],
      explanation:
        "A click speed test measures how many times you can click during a short time window. This version uses a fixed five-second round, then reports both the total clicks and an average clicks-per-second result. It is useful for casual challenges, quick interaction demos, or checking how steadily you can click under a time limit. Because everything runs locally in the browser, the feedback is immediate and the test is easy to repeat.",
      faq: [
        {
          question: "How long is the test?",
          answer: "This version runs for five seconds per round.",
        },
        {
          question: "What does clicks per second mean?",
          answer: "It is your total clicks divided by the round duration, giving an average speed.",
        },
        {
          question: "Can I retry the test?",
          answer: "Yes. You can start a new round or reset the current result at any time.",
        },
      ],
    },
    "reaction-time-test": {
      title: "Reaction Time Test",
      seoTitle: "Reaction Time Test | Kaya",
      description: "Test your visual reaction speed by clicking as soon as the panel changes.",
      intro:
        "Use this reaction time test to measure how quickly you respond when the panel changes state from waiting to ready.",
      exampleHeading: "Example Usage",
      explanationHeading: "Reaction Time Test Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Test how fast you react to a simple visual cue.",
        "Run several rounds and compare your response time.",
        "Use it as a lightweight browser reflex test.",
      ],
      explanation:
        "A reaction time test measures how quickly you can respond after a visual signal appears. In this version, you start the round, wait through a short unpredictable delay, and click as soon as the panel changes to the ready state. The tool then measures the time between the signal and your click in milliseconds. It is useful for reflex testing, casual challenges, or simple UI interaction demos. Because the wait interval is randomized, you cannot fully anticipate the moment, which makes the result more meaningful than a fixed countdown.",
      faq: [
        {
          question: "What happens if I click too early?",
          answer: "The tool marks the round as too early, because the reaction window had not started yet.",
        },
        {
          question: "What does the result show?",
          answer: "It shows your reaction time in milliseconds from the ready signal to your click.",
        },
        {
          question: "Why is the waiting period randomized?",
          answer: "A random delay reduces anticipation and makes the reflex measurement more realistic.",
        },
      ],
    },
    "typing-speed-test": {
      title: "Typing Speed Test",
      seoTitle: "Typing Speed Test | Kaya",
      description: "Measure typing speed, accuracy, and completion time in the browser.",
      intro:
        "Use this typing speed test to measure how fast and accurately you can type a short sample passage directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Typing Speed Test Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check your typing speed on a short timed passage.",
        "Compare WPM and accuracy after a few repeated runs.",
        "Use it as a quick productivity or keyboard warm-up test.",
      ],
      explanation:
        "A typing speed test measures how quickly and accurately you can reproduce a sample passage. This version starts timing when you begin typing, then estimates your words per minute, tracks accuracy, and shows total completion time. That makes it useful for casual practice, productivity checks, and comparing typing performance across sessions. Because the whole tool runs locally in the browser, it feels immediate and works without any backend service. For a lightweight typing benchmark, that is usually enough.",
      faq: [
        {
          question: "How is WPM estimated?",
          answer: "It uses the common approximation of five typed characters per word, divided by elapsed minutes.",
        },
        {
          question: "Does it track accuracy too?",
          answer: "Yes. It compares what you typed against the sample text and shows a percentage estimate.",
        },
        {
          question: "When does timing begin?",
          answer: "Timing begins automatically when you start typing into the input area.",
        },
      ],
    },
    "memory-game": {
      title: "Memory Game",
      seoTitle: "Memory Game | Kaya",
      description: "Play a simple card matching memory game with move counting.",
      intro:
        "Use this memory game to flip cards, match pairs, and track how many moves it takes to clear the board.",
      exampleHeading: "Example Usage",
      explanationHeading: "Memory Game Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Play a quick matching game as a short mental reset.",
        "Track how many moves you need to finish the board.",
        "Repeat the board to try to improve your short-term recall.",
      ],
      explanation:
        "A memory game tests short-term recall by asking you to uncover matching pairs from a shuffled set of hidden cards. Each move reveals two cards, and you try to remember their positions well enough to clear the board in fewer turns. This version keeps the rules minimal and tracks your move count plus matched pairs. It is useful as a lightweight game, a focus break, or a simple example of browser state and timed interaction. Because the game is small and immediate, it works well as a quick daily challenge.",
      faq: [
        {
          question: "How do I win?",
          answer: "You win by matching every pair on the board until all cards are revealed.",
        },
        {
          question: "What does the move count mean?",
          answer: "A move is counted each time you reveal a second card to complete a pair attempt.",
        },
        {
          question: "Can I reset the board?",
          answer: "Yes. The reset button shuffles a fresh board and clears the move count.",
        },
      ],
    },
    "2048-game": {
      title: "2048 Game",
      seoTitle: "2048 Game | Kaya",
      description: "Play a browser version of 2048 and merge tiles toward the winning block.",
      intro:
        "Use this 2048 game to merge matching number tiles, build bigger values, and push toward the 2048 winning tile directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "2048 Game Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Play a quick round of 2048 without leaving the tools page.",
        "Practice tile merging and space management strategy.",
        "Use it as a lightweight browser puzzle break.",
      ],
      explanation:
        "2048 is a simple but addictive puzzle game built around merging equal number tiles on a 4x4 board. Every move shifts the board in one direction, combines matching tiles, and spawns a new tile. The challenge is to keep enough open space while building larger numbers, ideally reaching the 2048 tile and beyond. This version keeps the interface minimal and focuses on the core board logic, score tracking, and direction controls. It works well as a quick puzzle break or a simple example of stateful browser gameplay.",
      faq: [
        {
          question: "How do you score points?",
          answer: "You gain points whenever two tiles merge, based on the value of the new tile created.",
        },
        {
          question: "When does the game end?",
          answer: "The game ends when the board is full and no adjacent tiles can still merge.",
        },
        {
          question: "Do I have to stop at 2048?",
          answer: "No. Reaching 2048 is the classic goal, but you can keep playing if moves remain.",
        },
      ],
    },
    "sudoku-generator": {
      title: "Sudoku Generator",
      seoTitle: "Sudoku Generator | Kaya",
      description: "Generate a browser sudoku puzzle with editable cells and answer checking.",
      intro:
        "Use this sudoku generator to load a fresh puzzle, fill the empty cells, and track how many entries match the generated solution.",
      exampleHeading: "Example Usage",
      explanationHeading: "Sudoku Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Open a fresh sudoku puzzle and solve it directly in the browser.",
        "Track how many blank cells you have filled so far.",
        "Use the correctness counter as a lightweight progress check.",
      ],
      explanation:
        "A sudoku generator creates a number puzzle where each row, column, and 3x3 block should contain the digits 1 through 9 without repetition. This version starts from a valid completed board, removes a set of cells, and lets you fill the blanks directly in the browser. It also keeps simple progress metrics such as how many blanks are filled and how many entries match the stored solution. That makes it useful as a casual logic puzzle, a daily brain warm-up, or a lightweight example of client-side puzzle generation and validation.",
      faq: [
        {
          question: "Does it generate a new board each time?",
          answer: "Yes. The puzzle is regenerated with a fresh transformed solution and a new set of blank cells.",
        },
        {
          question: "Can I type any number?",
          answer: "You can enter digits 1 through 9 in the editable cells, while the fixed clues stay locked.",
        },
        {
          question: "Does it tell me if the puzzle is solved?",
          answer: "Yes. When every blank matches the solution, the status switches to solved.",
        },
      ],
    },
    "spin-wheel-picker": {
      title: "Spin Wheel Picker",
      seoTitle: "Spin Wheel Picker | Kaya",
      description: "Pick a random option from a custom list with a wheel-style chooser.",
      intro:
        "Use this spin wheel picker to choose one option from a custom list when you want a playful random selection flow.",
      exampleHeading: "Example Usage",
      explanationHeading: "Spin Wheel Picker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Pick a random task, topic, or lunch option from a short list.",
        "Use it as a more playful alternative to a simple random chooser.",
        "Highlight one option from a brainstorming list without manual bias.",
      ],
      explanation:
        "A spin wheel picker is a lightweight random selection tool for moments when you want a little more ceremony than a plain list chooser. You provide one option per line, spin the picker, and the browser highlights a single selected result. This is useful for quick group choices, content prompts, warm-up exercises, or casual decision making. It does not perform weighted probabilities or advanced ranking, but for simple random picks it is fast, clear, and easy to reuse.",
      faq: [
        {
          question: "Does it support weighted options?",
          answer: "No. This version treats each option equally and selects one at random.",
        },
        {
          question: "Can I use my own option list?",
          answer: "Yes. Just enter one option per line and spin the picker.",
        },
        {
          question: "How is it different from a random decision tool?",
          answer: "It solves a similar problem, but presents the result in a more playful wheel-style flow.",
        },
      ],
    },
    "jpg-to-png": {
      title: "JPG to PNG Converter",
      seoTitle: "JPG to PNG Converter | Kaya",
      description: "Convert a JPG image into PNG format directly in the browser.",
      intro:
        "Use this JPG to PNG converter to upload a JPEG image, turn it into PNG in the browser, and preview the converted result instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "JPG to PNG Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a small JPEG image into PNG without using desktop software.",
        "Preview the converted PNG before saving or reusing it elsewhere.",
        "Use it for quick format changes during frontend or content work.",
      ],
      explanation:
        "A JPG to PNG converter changes a JPEG image into PNG format directly in the browser. This is useful when you need a PNG version for design work, transparent-background workflows, or tools that prefer PNG assets. In this static-site version, the conversion happens locally with browser APIs, so there is no backend upload step. That keeps the tool fast and lightweight for small format changes and quick previews.",
      faq: [
        {
          question: "Does this upload the image to a server?",
          answer: "No. The conversion happens in your browser using local file APIs and canvas rendering.",
        },
        {
          question: "Will PNG always be smaller than JPG?",
          answer: "Not necessarily. PNG and JPG use different compression methods, so file size can go up or down depending on the image.",
        },
        {
          question: "Can I preview the PNG result?",
          answer: "Yes. The tool shows the converted PNG result immediately after processing.",
        },
      ],
    },
    "image-to-base64": {
      title: "Image to Base64 Converter",
      seoTitle: "Image to Base64 Converter | Kaya",
      description: "Convert an uploaded image into a Base64 data URL instantly.",
      intro:
        "Use this image to Base64 converter to turn an uploaded image into a Base64 data URL and preview the result in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image to Base64 Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a local image into a data URL for HTML or CSS embedding.",
        "Preview the image while copying the Base64 string.",
        "Generate inline image content for quick frontend testing.",
      ],
      explanation:
        "An image to Base64 converter reads a local image file and turns it into a text-based data URL. This can be useful when you need to embed a small image directly inside HTML, CSS, JSON, or a quick prototype. Because the tool runs fully in the browser, it is a simple way to inspect the encoded result and confirm the image preview without using external utilities.",
      faq: [
        {
          question: "What is a Base64 data URL?",
          answer: "It is an inline string that contains both the file type and the encoded image content in one value.",
        },
        {
          question: "Why would I use Base64 instead of a file path?",
          answer: "Base64 is useful for inline embedding, quick demos, or transport scenarios where a single text string is easier to handle.",
        },
        {
          question: "Can I preview the image after conversion?",
          answer: "Yes. The tool shows both the Base64 output and an image preview.",
        },
      ],
    },
    "base64-to-image": {
      title: "Base64 to Image Converter",
      seoTitle: "Base64 to Image Converter | Kaya",
      description: "Decode a Base64 image string and preview it in the browser.",
      intro:
        "Use this Base64 to image converter to decode an image data URL or raw Base64 image string and preview the result instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "Base64 to Image Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Preview an image from a Base64 string copied from an API or database.",
        "Check whether a data URL is a valid image payload.",
        "Inspect encoded image content without extra desktop tools.",
      ],
      explanation:
        "A Base64 to image converter helps you turn encoded image text back into a visible preview. This is useful when image data is stored inline, returned by an API, or copied from a configuration or content payload. Instead of guessing what the string contains, you can paste it into the browser and verify the actual image result immediately.",
      faq: [
        {
          question: "Does it accept full data URLs?",
          answer: "Yes. You can paste a complete data URL or a raw Base64 image payload.",
        },
        {
          question: "Will it work with every Base64 string?",
          answer: "It works when the input is valid image data. Invalid or unrelated Base64 content will not render as an image.",
        },
        {
          question: "Why is this useful?",
          answer: "It is useful for debugging APIs, checking stored assets, and confirming encoded image content quickly.",
        },
      ],
    },
    "file-size-converter": {
      title: "File Size Converter",
      seoTitle: "File Size Converter | Kaya",
      description: "Convert file sizes across bytes, KB, MB, GB, and TB.",
      intro:
        "Use this file size converter to convert a value between bytes, KB, MB, GB, and TB with instant output in all supported units.",
      exampleHeading: "Example Usage",
      explanationHeading: "File Size Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a file size from MB into bytes and GB.",
        "Compare how the same size looks in several storage units.",
        "Use it for upload limits, asset planning, or documentation.",
      ],
      explanation:
        "A file size converter helps you move between common storage units such as bytes, KB, MB, GB, and TB. This is useful when you need to compare file limits, estimate download sizes, document upload policies, or translate technical values into more readable numbers. By showing all conversions at once, the tool makes it easier to understand the same amount of storage from several perspectives.",
      faq: [
        {
          question: "What units does it support?",
          answer: "This version supports bytes, KB, MB, GB, and TB in a standard 1024-based conversion flow.",
        },
        {
          question: "Why convert file sizes at all?",
          answer: "Because upload limits, storage plans, and documentation often use different units for the same value.",
        },
        {
          question: "Can I enter decimal values?",
          answer: "Yes. Decimal file size values are supported for the selected input unit.",
        },
      ],
    },
    "unit-converter-bytes": {
      title: "Bytes Unit Converter",
      seoTitle: "Bytes Unit Converter | Kaya",
      description: "Convert raw byte values into decimal and binary storage units.",
      intro:
        "Use this bytes unit converter to convert a raw byte value into decimal units like KB and MB, plus binary units like KiB and MiB.",
      exampleHeading: "Example Usage",
      explanationHeading: "Bytes Unit Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a raw byte value into both MB and MiB.",
        "Check the difference between decimal and binary storage units.",
        "Use it for technical docs, logs, or infrastructure metrics.",
      ],
      explanation:
        "A bytes unit converter starts from a raw byte count and shows how that value looks in both decimal and binary storage units. This matters because some tools use powers of 1000, while others use powers of 1024. By displaying both styles together, the tool helps you avoid confusion when comparing values across operating systems, documentation, cloud dashboards, or file-system reports.",
      faq: [
        {
          question: "What is the difference between MB and MiB?",
          answer: "MB is usually decimal and based on 1000, while MiB is binary and based on 1024.",
        },
        {
          question: "Why show both decimal and binary units?",
          answer: "Because different systems, tools, and docs often use different conventions for the same raw byte value.",
        },
        {
          question: "Is this only for file sizes?",
          answer: "No. It is useful for any storage or memory value that starts as raw bytes.",
        },
      ],
    },
    "png-to-jpg": {
      title: "PNG to JPG Converter",
      seoTitle: "PNG to JPG Converter | Kaya",
      description: "Convert a PNG image into JPG format directly in the browser.",
      intro:
        "Use this PNG to JPG converter to upload a PNG image, convert it to JPG in the browser, and preview the result immediately.",
      exampleHeading: "Example Usage",
      explanationHeading: "PNG to JPG Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a PNG asset into JPG for lightweight sharing.",
        "Quickly preview how a PNG image looks after JPG conversion.",
        "Change image format without opening separate editing software.",
      ],
      explanation:
        "A PNG to JPG converter is useful when you need to turn a PNG image into a JPEG file for easier sharing, compatibility, or potentially smaller file size. This browser-based version performs the conversion locally, so the image does not need to be uploaded to a server. It is a practical option for quick format changes, especially during content or frontend workflows.",
      faq: [
        {
          question: "What happens to transparency?",
          answer: "JPG does not support transparency, so transparent areas are filled with a solid background during conversion.",
        },
        {
          question: "Does this run in the browser only?",
          answer: "Yes. The conversion happens locally with browser APIs and canvas rendering.",
        },
        {
          question: "Why convert PNG to JPG?",
          answer: "It can help with compatibility or produce a smaller file for photographic-style images.",
        },
      ],
    },
    "image-format-converter": {
      title: "Image Format Converter",
      seoTitle: "Image Format Converter | Kaya",
      description: "Convert an image between PNG, JPG, and WEBP formats in the browser.",
      intro:
        "Use this image format converter to upload an image, choose PNG, JPG, or WEBP, and preview the converted result instantly.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image Format Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Switch a local image between PNG, JPG, and WEBP.",
        "Preview different output formats before reusing the result.",
        "Use one quick tool instead of separate format-specific converters.",
      ],
      explanation:
        "An image format converter helps you change one image format into another without leaving the browser. This version supports common output choices such as PNG, JPG, and WEBP, which covers many everyday web and content workflows. It is useful for testing image compatibility, preparing lighter assets, or quickly checking how one format compares to another. Because the conversion happens locally, it stays fast and backend-free.",
      faq: [
        {
          question: "What formats does it support?",
          answer: "This version supports PNG, JPG, and WEBP output formats.",
        },
        {
          question: "Why use a format converter instead of multiple separate tools?",
          answer: "A single converter is quicker when you want to compare several output formats from the same source image.",
        },
        {
          question: "Does the conversion happen locally?",
          answer: "Yes. The processing runs in your browser with local image data.",
        },
      ],
    },
    "image-resize-tool": {
      title: "Image Resize Tool",
      seoTitle: "Image Resize Tool | Kaya",
      description: "Resize an image to custom dimensions directly in the browser.",
      intro:
        "Use this image resize tool to change an image to custom width and height values, with optional aspect-ratio preservation.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image Resize Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Resize an image for a blog banner or social preview card.",
        "Scale an asset down to a smaller pixel size for quick testing.",
        "Keep aspect ratio while adjusting one dimension automatically.",
      ],
      explanation:
        "An image resize tool changes the pixel dimensions of an image without needing external editing software. This version lets you upload a local image, set target width and height, and optionally keep the original aspect ratio. It is useful for blog assets, demo images, previews, and any situation where an image needs to match a specific layout size. Since the resizing happens in the browser, the result appears immediately and does not require backend processing.",
      faq: [
        {
          question: "Can I keep the original aspect ratio?",
          answer: "Yes. The tool includes an option to preserve the original image proportions when changing size.",
        },
        {
          question: "What is the difference between resizing and cropping?",
          answer: "Resizing changes the dimensions of the whole image, while cropping removes part of the image area.",
        },
        {
          question: "Does it process the image locally?",
          answer: "Yes. The resizing is done in the browser using local image data.",
        },
      ],
    },
    "image-compress-tool": {
      title: "Image Compress Tool",
      seoTitle: "Image Compress Tool | Kaya",
      description: "Compress an image in the browser and compare original and output size.",
      intro:
        "Use this image compress tool to lower image quality, preview the result, and compare original versus compressed file size.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image Compress Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Reduce image size before uploading it to a website.",
        "Preview the quality tradeoff at different compression levels.",
        "Compare original and compressed byte size in one place.",
      ],
      explanation:
        "An image compress tool helps reduce file size by lowering image quality or switching to a more compact encoded result. This version focuses on a simple browser-based workflow: upload an image, choose a compression quality level, and preview the output along with an approximate size comparison. It is useful for web performance, upload limits, and quickly checking whether a smaller file still looks acceptable.",
      faq: [
        {
          question: "Will compression reduce quality?",
          answer: "Usually yes. Smaller files often come with some loss in visual detail, especially at lower quality settings.",
        },
        {
          question: "Why compare original and compressed size?",
          answer: "It helps you judge whether the quality tradeoff is worth the file-size savings.",
        },
        {
          question: "Does this require a server upload?",
          answer: "No. Compression happens locally in the browser.",
        },
      ],
    },
    "image-crop-tool": {
      title: "Image Crop Tool",
      seoTitle: "Image Crop Tool | Kaya",
      description: "Crop an image to a selected rectangle directly in the browser.",
      intro:
        "Use this image crop tool to choose X, Y, width, and height values, then crop the image locally and preview the result.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image Crop Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Crop a screenshot down to the relevant section.",
        "Trim extra edges from an asset before reusing it.",
        "Create a smaller focused image from a larger source.",
      ],
      explanation:
        "An image crop tool removes part of an image so you can keep only the region you actually need. This version uses simple numeric crop controls for X, Y, width, and height, which is useful when you want a fast, deterministic crop instead of a drag-based editor. It works well for screenshots, content assets, debugging visuals, or any browser-based workflow where a smaller focused image is enough.",
      faq: [
        {
          question: "What do X and Y mean?",
          answer: "They represent the starting coordinates of the crop area from the top-left corner of the source image.",
        },
        {
          question: "How is cropping different from resizing?",
          answer: "Cropping cuts away image area, while resizing keeps the full image but changes its dimensions.",
        },
        {
          question: "Can I preview the cropped result?",
          answer: "Yes. The cropped output appears immediately after applying the crop settings.",
        },
      ],
    },
    "json-formatter": {
      title: "JSON Formatter",
      seoTitle: "JSON Formatter | Kaya",
      description: "Format and pretty-print JSON instantly for easier reading and debugging.",
      intro:
        "Use this JSON formatter to pretty-print raw JSON with indentation. It runs in the browser and makes nested objects and arrays much easier to inspect.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Formatter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste minified JSON from an API response and turn it into readable structured output.",
        "Format nested objects and arrays before comparing payloads manually.",
        "Use the result when debugging API responses, config files, or JSON-based data flows.",
      ],
      explanation:
        "A JSON formatter takes raw JSON and rewrites it with line breaks and indentation so the structure becomes easier to read. This is useful when you are inspecting API responses, editing configuration files, or debugging payloads that arrive in minified form. Large JSON strings are difficult to reason about when everything appears on one line, especially with nested arrays and objects. This tool parses the input and returns a neatly formatted version instantly in the browser. That makes it a fast way to inspect data without opening a terminal or relying on external tooling.",
      faq: [
        {
          question: "Does this JSON formatter validate the input too?",
          answer: "Yes. If the JSON is invalid, the tool will show an error instead of formatted output.",
        },
        {
          question: "Can it handle nested arrays and objects?",
          answer: "Yes. Valid JSON structures are reformatted with standard indentation regardless of depth.",
        },
        {
          question: "Does the tool send my JSON anywhere?",
          answer: "No. Formatting happens in the browser with no backend dependency.",
        },
      ],
    },
    "json-validator": {
      title: "JSON Validator",
      seoTitle: "JSON Validator | Kaya",
      description: "Validate JSON input instantly and inspect the parsed result type.",
      intro:
        "Use this JSON validator to check whether your JSON is valid. It parses the input in the browser and reports either the parsed type or the exact parse error.",
      exampleHeading: "Example Usage",
      explanationHeading: "JSON Validator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a payload before sending it to an API to confirm the JSON is valid.",
        "Check whether a parsed top-level structure is an object, array, string, or null.",
        "Use the parse error message to find missing commas or broken quotes quickly.",
      ],
      explanation:
        "A JSON validator checks whether a string can be parsed as valid JSON. This is one of the most common debugging steps in frontend and backend work because a single missing comma or quote can break an entire request or configuration file. This tool parses the input directly in the browser and tells you whether the JSON is valid. If parsing succeeds, it also shows the type of the top-level value, such as object, array, or string. If parsing fails, it shows the error message immediately. That makes it useful for testing request bodies, configuration snippets, and copied data before using it elsewhere.",
      faq: [
        {
          question: "What kinds of JSON values can it validate?",
          answer: "It supports any valid JSON value, including objects, arrays, strings, numbers, booleans, and null.",
        },
        {
          question: "Will it show where the JSON is broken?",
          answer: "It shows the browser's parse error message, which often points to the location or reason for the failure.",
        },
        {
          question: "Is this different from the formatter?",
          answer: "Yes. The formatter focuses on readable output, while the validator focuses on whether the JSON parses successfully.",
        },
      ],
    },
    "base64-encode-decode": {
      title: "Base64 Encode Decode Tool",
      seoTitle: "Base64 Encode Decode | Kaya",
      description: "Encode text to Base64 or decode Base64 back into readable text instantly.",
      intro:
        "Use this Base64 encode decode tool to switch between plain text and Base64 instantly. It supports both directions in a single browser-side interface.",
      exampleHeading: "Example Usage",
      explanationHeading: "Base64 Encode Decode Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Encode plain text before embedding it in a simple transport format.",
        "Decode a Base64 string from logs or payloads into readable text.",
        "Quickly inspect tokens, test inputs, or encoded text snippets while debugging.",
      ],
      explanation:
        "Base64 is a text-based encoding format that turns binary or plain text data into an ASCII-safe string. It is commonly used in data URLs, tokens, simple payload wrappers, and transport scenarios where raw bytes are inconvenient. This tool lets you switch between text and Base64 in either direction without leaving the page. That is useful when debugging encoded values, checking payloads, or preparing content for APIs and browser features that rely on Base64-compatible strings. Everything runs directly in the browser, so results are immediate.",
      faq: [
        {
          question: "What is Base64 used for?",
          answer: "Base64 is commonly used to represent binary or text data as an ASCII-safe string for transport or embedding.",
        },
        {
          question: "Can I both encode and decode here?",
          answer: "Yes. The tool supports both modes from the same interface.",
        },
        {
          question: "Why would decoding fail?",
          answer: "Decoding fails when the input is not valid Base64 or contains an invalid encoded sequence.",
        },
      ],
    },
    "url-encode-decode": {
      title: "URL Encode Decode Tool",
      seoTitle: "URL Encode Decode | Kaya",
      description: "Encode or decode URL components for query strings, parameters, and safe links.",
      intro:
        "Use this URL encode decode tool to convert plain text into a URL-safe encoded string or decode an encoded component back into readable text.",
      exampleHeading: "Example Usage",
      explanationHeading: "URL Encode Decode Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Encode query parameter values that include spaces, symbols, or ampersands.",
        "Decode a percent-encoded URL component copied from browser output or logs.",
        "Use it when testing API query strings or constructing browser-safe links.",
      ],
      explanation:
        "URL encoding converts special characters into a percent-encoded form so they can be safely included inside query strings, path components, and other URL fragments. This matters whenever your text includes spaces, reserved punctuation, or non-ASCII characters that would otherwise be interpreted incorrectly. This tool lets you encode or decode URL components instantly in the browser. That makes it useful for debugging links, building API requests, and checking how browsers or services transform parameter values. It is especially handy when you need to inspect whether a string is already encoded or should be decoded before use.",
      faq: [
        {
          question: "When do I need URL encoding?",
          answer: "You need it when text contains characters that are not safe to place directly inside a URL component.",
        },
        {
          question: "Is this for full URLs or individual components?",
          answer: "It is best used for individual URL components such as query parameter values.",
        },
        {
          question: "Why does decoding sometimes fail?",
          answer: "It fails when the input is not valid percent-encoded text.",
        },
      ],
    },
    "uuid-generator": {
      title: "UUID Generator",
      seoTitle: "UUID Generator | Kaya",
      description: "Generate one or more UUID v4 values instantly in the browser.",
      intro:
        "Use this UUID generator to create one or more UUID v4 values instantly. It runs in the browser and is useful for testing, mock data, and temporary identifiers.",
      exampleHeading: "Example Usage",
      explanationHeading: "UUID Generator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Generate a single UUID for a temporary record or test object.",
        "Create multiple UUIDs at once for fixture data and demos.",
        "Regenerate a fresh batch instantly without reloading the page.",
      ],
      explanation:
        "A UUID generator creates unique identifier strings that are commonly used in databases, APIs, test fixtures, and distributed systems. UUID v4 values are random-based and are useful when you need IDs without coordinating a central sequence. This tool uses browser-side generation to create one or more UUIDs instantly, which makes it convenient for mock data, temporary records, integration testing, and quick debugging. Instead of opening a terminal or writing a short script, you can generate the values directly on the page and use them immediately.",
      faq: [
        {
          question: "What is a UUID v4?",
          answer: "UUID v4 is a randomly generated universally unique identifier format used widely across software systems.",
        },
        {
          question: "Can I generate multiple UUIDs at once?",
          answer: "Yes. The tool can generate a small batch of UUIDs in one go.",
        },
        {
          question: "Are these generated in the browser?",
          answer: "Yes. UUIDs are generated locally using the browser's built-in crypto API.",
        },
      ],
    },
    "working-days-exclude-weekends": {
      title: "Working Days Exclude Weekends Calculator",
      seoTitle: "Working Days Exclude Weekends | Kaya",
      description: "Add working days to a start date while skipping weekends automatically.",
      intro:
        "Use this working days exclude weekends calculator to add a number of working days to a start date. It skips Saturdays and Sundays automatically and returns the resulting business date.",
      exampleHeading: "Example Usage",
      explanationHeading: "Working Days Exclude Weekends Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Add 10 working days to a project start date without counting weekends.",
        "Use the result date for follow-up deadlines and operational scheduling.",
        "Check which weekday the resulting business day lands on.",
      ],
      explanation:
        "A working days exclude weekends calculator is useful when you need to move forward by business days instead of calendar days. This comes up in delivery estimates, settlement windows, support timelines, and project planning where Saturdays and Sundays should not count. Instead of manually stepping through a calendar, this tool takes a start date and a working-day count, then skips weekends automatically and returns the resulting date. It also shows the weekday of the result, which helps when planning operational handoffs or deadlines. For workflows based on Monday-to-Friday schedules, this is more practical than using a normal date calculator.",
      faq: [
        {
          question: "Does this tool skip weekends automatically?",
          answer: "Yes. Saturdays and Sundays are excluded when calculating the resulting working day.",
        },
        {
          question: "Can I use it for delivery or SLA dates?",
          answer: "Yes. It is a quick way to compute future dates based on business days instead of calendar days.",
        },
        {
          question: "Does it account for holidays?",
          answer: "Not yet. The current version excludes weekends only.",
        },
      ],
    },
    "countdown-timer-date": {
      title: "Countdown Timer To Date",
      seoTitle: "Countdown Timer To Date | Kaya",
      description: "Count down live to a target date and time with days, hours, minutes, and seconds.",
      intro:
        "Use this countdown timer to date to track the remaining time until a target date and time. It updates every second and breaks the countdown into days, hours, minutes, and seconds.",
      exampleHeading: "Example Usage",
      explanationHeading: "Countdown Timer To Date Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Set a launch date to see how much time remains until release.",
        "Use the +1 hour or +1 day shortcuts to test the live countdown quickly.",
        "Track event timing without needing a separate app or script.",
      ],
      explanation:
        "A countdown timer to date shows how much time remains between now and a chosen future moment. That is useful for launches, deadlines, maintenance windows, events, and any situation where a live remaining-time display matters. Instead of manually comparing dates or refreshing a clock, this tool updates every second in the browser and breaks the difference into days, hours, minutes, and seconds. Because it runs fully on the client side, it loads fast and stays static-site friendly. If the target time has already passed, the page tells you that as well. For simple event tracking and deadline awareness, this gives a quick, immediate answer.",
      faq: [
        {
          question: "Does the countdown update automatically?",
          answer: "Yes. The countdown refreshes every second in the browser.",
        },
        {
          question: "What happens if the target date is in the past?",
          answer: "The tool will show that the target time has already passed.",
        },
        {
          question: "Can I use it for launch dates or reminders?",
          answer: "Yes. It works well for release windows, events, maintenance, and other future timestamps.",
        },
      ],
    },
    "timezone-difference-calculator": {
      title: "Timezone Difference Calculator",
      seoTitle: "Timezone Difference Calculator | Kaya",
      description: "Compare two timezones and inspect their current offsets and local times instantly.",
      intro:
        "Use this timezone difference calculator to compare two timezones side by side. It shows each timezone's current offset and local time, which is useful for scheduling and remote collaboration.",
      exampleHeading: "Example Usage",
      explanationHeading: "Timezone Difference Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Compare Asia/Shanghai with New York before scheduling a meeting.",
        "Check the current local times in two regions at a glance.",
        "Inspect offset labels when debugging timezone-related display issues.",
      ],
      explanation:
        "A timezone difference calculator helps you compare how two regions relate to each other right now. This matters when coordinating meetings, checking support coverage, planning release windows, or debugging systems that display local times in multiple places. While a timezone converter translates a specific moment from one zone to another, this tool focuses on the current relationship between two zones: their live local times and offset labels. That makes it useful for quick operational checks and coordination work. Because it uses standard browser timezone data, it stays fast and requires no backend.",
      faq: [
        {
          question: "What does the offset label mean?",
          answer: "It shows how far a timezone is currently offset from UTC, such as UTC+8 or UTC-4.",
        },
        {
          question: "Is this different from a timezone converter?",
          answer: "Yes. This tool compares two zones directly, while a converter maps a specific date-time from one zone to another.",
        },
        {
          question: "Does it reflect daylight saving changes?",
          answer: "It uses the browser's current timezone data, so the displayed offsets follow the current environment rules.",
        },
      ],
    },
    "date-to-week-number": {
      title: "Date To Week Number Calculator",
      seoTitle: "Date To Week Number | Kaya",
      description: "Convert a date into its ISO week number and week year instantly.",
      intro:
        "Use this date to week number calculator to convert any date into its ISO week number. It also shows the ISO week year and weekday for the selected date.",
      exampleHeading: "Example Usage",
      explanationHeading: "Date To Week Number Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a date falls in ISO week 1, week 26, or week 52.",
        "See if a late-December date belongs to the next ISO week year.",
        "Use the weekday output when organizing weekly reporting or sprint cycles.",
      ],
      explanation:
        "A date to week number calculator converts a calendar date into its ISO week number, which is commonly used in reporting, planning, logistics, and sprint scheduling. ISO weeks follow a specific standard, and week numbering near the start or end of a year can be confusing because some dates belong to the previous or next ISO week year. This tool handles that logic for you by returning both the week number and the ISO week year, along with the weekday of the selected date. That makes it useful when your workflow is organized around weekly buckets rather than raw calendar dates.",
      faq: [
        {
          question: "What is an ISO week number?",
          answer: "It is a standardized week index used internationally for reporting and scheduling, where weeks begin on Monday.",
        },
        {
          question: "Why can the ISO week year differ from the calendar year?",
          answer: "Because dates near New Year can belong to the first or last ISO week of a neighboring year.",
        },
        {
          question: "Does the tool show the weekday too?",
          answer: "Yes. It returns the weekday alongside the ISO week number and week year.",
        },
      ],
    },
    "date-string-parser": {
      title: "Date String Parser",
      seoTitle: "Date String Parser | Kaya",
      description: "Parse a human-readable date string into ISO, UTC, local time, and timestamp output.",
      intro:
        "Use this date string parser to turn a readable date string into structured outputs such as ISO 8601, UTC, local time, and timestamp milliseconds.",
      exampleHeading: "Example Usage",
      explanationHeading: "Date String Parser Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste a string like `May 2, 2026 14:30 UTC` to inspect its parsed value.",
        "Compare local and UTC rendering of the same input during debugging.",
        "Use the timestamp output when passing parsed dates into code or APIs.",
      ],
      explanation:
        "A date string parser helps when you receive a readable date string and need to understand exactly how the browser interprets it. This is useful for debugging imported data, validating user input, and checking whether a date string includes enough timezone context. The tool takes a freeform input and, if JavaScript can parse it reliably, expands it into ISO 8601, UTC, local time, and timestamp milliseconds. That gives you a quick way to see whether a date string is being interpreted as expected. For developers working with mixed date formats, this is faster than opening a console repeatedly.",
      faq: [
        {
          question: "What kinds of strings work best?",
          answer: "Strings with clear month, day, year, and timezone information are usually the most reliable.",
        },
        {
          question: "Why compare UTC and local output?",
          answer: "It helps reveal how the same parsed moment is rendered in different display contexts.",
        },
        {
          question: "Can I get a timestamp from the parsed result?",
          answer: "Yes. The parser includes timestamp milliseconds in the output.",
        },
      ],
    },
    "time-duration-calculator": {
      title: "Time Duration Calculator",
      seoTitle: "Time Duration Calculator | Kaya",
      description: "Convert a duration into total seconds, minutes, hours, and milliseconds instantly.",
      intro:
        "Use this time duration calculator to convert a duration made of days, hours, minutes, and seconds into total values. It is useful for logs, intervals, and time-based formulas.",
      exampleHeading: "Example Usage",
      explanationHeading: "Time Duration Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert 1 day, 2 hours, 30 minutes, and 15 seconds into total seconds.",
        "Use the total milliseconds result in JavaScript timers or event delays.",
        "Check total hours or minutes for reporting and duration formulas.",
      ],
      explanation:
        "A time duration calculator converts a multi-part duration into total values that are easier to use in code, reports, and formulas. Instead of reasoning separately about days, hours, minutes, and seconds, you often need a single number such as total seconds, total minutes, or total milliseconds. This tool accepts those components and calculates all of the common totals at once. That makes it useful for interval settings, retry windows, timer logic, analytics, and any workflow where a structured duration needs to become a raw numeric value.",
      faq: [
        {
          question: "Can I combine days, hours, minutes, and seconds?",
          answer: "Yes. The tool converts the full combined duration into total seconds, minutes, hours, and milliseconds.",
        },
        {
          question: "Is the output useful for JavaScript timers?",
          answer: "Yes. The total milliseconds field is especially useful for browser and Node.js timing code.",
        },
        {
          question: "Does it support decimal values?",
          answer: "Yes. Numeric duration inputs can be converted as long as they parse correctly as numbers.",
        },
      ],
    },
    "subtract-time-from-date": {
      title: "Subtract Time From Date Calculator",
      seoTitle: "Subtract Time From Date Calculator | Kaya",
      description: "Subtract days, hours, and minutes from a date instantly and get local, UTC, and ISO output.",
      intro:
        "Use this subtract time from date calculator to move backward from a base date by days, hours, and minutes. It updates instantly and shows the result in local time, UTC, and ISO format.",
      exampleHeading: "Example Usage",
      explanationHeading: "Subtract Time From Date Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Subtract 2 hours from a deployment time to find the prep window start.",
        "Move backward by days and minutes when checking expiry or settlement logic.",
        "Use the UTC or ISO result directly for logs and API testing.",
      ],
      explanation:
        "A subtract time from date calculator helps you move backward from a given date-time by a chosen amount of time. This is useful when you need to calculate lead times, backtrack from deadlines, or verify reverse schedule logic in an application. Common examples include finding when a reminder should fire before an event, checking when an expiry window started, or confirming a previous settlement timestamp. This tool lets you enter a base date and subtract days, hours, and minutes at the same time. It then shows the resulting moment as local time, UTC, ISO 8601, and timestamp milliseconds, which makes it practical for both human reading and system debugging.",
      faq: [
        {
          question: "Can I subtract multiple units at once?",
          answer: "Yes. The tool supports subtracting days, hours, and minutes together from the same base date.",
        },
        {
          question: "Does it show machine-friendly output too?",
          answer: "Yes. Along with readable local and UTC time, the result includes ISO 8601 and timestamp milliseconds.",
        },
        {
          question: "Is it useful for deadline planning?",
          answer: "Yes. It is a quick way to backtrack from deadlines or event times without manual calendar math.",
        },
      ],
    },
    "business-days-calculator": {
      title: "Business Days Calculator",
      seoTitle: "Business Days Calculator | Kaya",
      description: "Count business days between two dates and separate working days from weekends instantly.",
      intro:
        "Use this business days calculator to count working days between two dates. It separates business days from weekend days and lets you choose whether to include the start date.",
      exampleHeading: "Example Usage",
      explanationHeading: "Business Days Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Calculate how many business days fall between two project dates.",
        "Separate weekend days from weekdays for SLA or payroll checks.",
        "Toggle whether the start date should count in the final total.",
      ],
      explanation:
        "A business days calculator counts how many weekdays fall inside a date range while excluding weekends. This is useful for project planning, delivery windows, HR workflows, support SLAs, and any process that runs on working days instead of calendar days. Manual counting gets tedious quickly, especially when the range spans multiple weeks. This tool takes a start date and end date, then returns business days, weekend days, and total days in the range. It also includes an option to count or skip the start date, which helps match different business rules. For date-range planning and operational work, that makes it much more reliable than eyeballing a calendar.",
      faq: [
        {
          question: "Does this business days calculator exclude weekends automatically?",
          answer: "Yes. Saturdays and Sundays are counted separately from business days.",
        },
        {
          question: "Can I include the start date?",
          answer: "Yes. There is an option to include or exclude the start date based on your counting rule.",
        },
        {
          question: "Does it account for public holidays?",
          answer: "Not yet. The current version handles weekdays versus weekends only.",
        },
      ],
    },
    "time-difference-calculator": {
      title: "Time Difference Calculator",
      seoTitle: "Time Difference Calculator | Kaya",
      description: "Calculate the difference between two times in hours and minutes instantly, including overnight spans.",
      intro:
        "Use this time difference calculator to measure the gap between two clock times. It handles same-day comparisons and can optionally treat an earlier end time as the next day.",
      exampleHeading: "Example Usage",
      explanationHeading: "Time Difference Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Compare `09:00` and `17:30` to get a workday duration.",
        "Turn on the next-day option to calculate overnight shifts like `22:00` to `06:00`.",
        "Use the total minutes result when you need a value for payroll or automation rules.",
      ],
      explanation:
        "A time difference calculator focuses on the gap between two clock times instead of two full dates. That is useful for work shifts, opening hours, support coverage, study sessions, or any schedule that repeats daily. The tricky case is when the end time is earlier than the start time, because that can either mean an invalid range or an overnight span that crosses midnight. This tool supports both cases by letting you choose whether an earlier end time should be treated as next day. It then returns the total duration in hours and minutes plus a simple readable breakdown. For day-to-day scheduling and operations work, this is faster than manually subtracting times or building a spreadsheet formula.",
      faq: [
        {
          question: "Can this time difference calculator handle overnight shifts?",
          answer: "Yes. Enable the next-day option and an earlier end time will be treated as crossing midnight.",
        },
        {
          question: "Does it calculate in minutes too?",
          answer: "Yes. The tool returns both total hours and total minutes, plus a simple hour-minute breakdown.",
        },
        {
          question: "Do I need to enter a date?",
          answer: "No. This tool is designed for time-only comparisons.",
        },
      ],
    },
    "add-time-to-date": {
      title: "Add Time to Date Calculator",
      seoTitle: "Add Time to Date Calculator | Kaya",
      description: "Add days, hours, and minutes to a date instantly and get the resulting local, UTC, and ISO time.",
      intro:
        "Use this add time to date calculator to add days, hours, and minutes to a base date. It updates instantly and shows the new result in local time, UTC, and ISO 8601 format.",
      exampleHeading: "Example Usage",
      explanationHeading: "Add Time to Date Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Add 1 day and 2 hours to a release timestamp to plan a deadline.",
        "Add minutes to a base time when checking reminder or expiry logic.",
        "Use the resulting UTC or ISO value directly in APIs or logs.",
      ],
      explanation:
        "An add time to date calculator helps you move forward from a starting date by a specific amount of time. This comes up often in product logic, reminders, expiry windows, settlement delays, and schedule planning. While the math sounds simple, it is still a repetitive task when you are checking dates manually or verifying application behavior. This tool lets you enter a base date-time and then add days, hours, and minutes on top of it. The result is shown immediately in local time, UTC, ISO 8601, and raw milliseconds so you can reuse it in different contexts. It is especially useful when you need a quick answer without opening a REPL, spreadsheet, or calendar app.",
      faq: [
        {
          question: "Can I add more than one unit at once?",
          answer: "Yes. You can add days, hours, and minutes together in the same calculation.",
        },
        {
          question: "Does the result show UTC too?",
          answer: "Yes. The tool shows the result in local time, UTC, ISO 8601, and timestamp milliseconds.",
        },
        {
          question: "Is this useful for expiry and reminder logic?",
          answer: "Yes. It is a quick way to validate future timestamps used in apps, APIs, and time-based workflows.",
        },
      ],
    },
    "age-calculator-exact": {
      title: "Exact Age Calculator",
      seoTitle: "Exact Age Calculator | Kaya",
      description: "Calculate exact age in years, months, and days from a birth date to any target date.",
      intro:
        "Use this exact age calculator to measure age from a birth date to any chosen date. It returns years, months, days, and supporting totals instantly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Exact Age Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Enter a birth date and use today as the target date to get current age.",
        "Pick a future date to see how old someone will be on an upcoming event.",
        "Use the total days output when you need a simpler numeric interval.",
      ],
      explanation:
        "An exact age calculator works out the precise gap between a birth date and another date, usually today. Instead of showing only years, it also breaks the result into months and days, which gives a more accurate answer around birthdays and partial months. This is useful for forms, eligibility checks, profile data, or simply answering how old someone is at a specific point in time. The tool also includes total days and an approximate total-months figure, which can be helpful when you need a raw duration instead of a calendar-style age. Because everything runs in the browser, the result updates instantly and stays static-site friendly.",
      faq: [
        {
          question: "Does this age calculator account for months and days?",
          answer: "Yes. It returns age as years, months, and days instead of only rounding to years.",
        },
        {
          question: "Can I calculate age on a future date?",
          answer: "Yes. You can choose any target date after the birth date.",
        },
        {
          question: "What if the target date is earlier than the birth date?",
          answer: "The tool treats that as invalid input and asks for a valid date range.",
        },
      ],
    },
    "date-format-converter": {
      title: "Date Format Converter",
      seoTitle: "Date Format Converter | Kaya",
      description: "Convert a date string into ISO, UTC, local time, and common date formats instantly.",
      intro:
        "Use this date format converter to turn a date string into multiple readable formats, including ISO 8601, UTC, local time, and common calendar layouts.",
      exampleHeading: "Example Usage",
      explanationHeading: "Date Format Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Paste an ISO timestamp and get `YYYY-MM-DD`, `DD/MM/YYYY`, and `MM/DD/YYYY` versions immediately.",
        "Check the UTC and local renderings of the same date string during debugging.",
        "Extract a Unix timestamp in seconds from a readable date input.",
      ],
      explanation:
        "A date format converter helps when the same date needs to be displayed in different layouts for APIs, logs, spreadsheets, or UI copy. One system may want ISO 8601, another may expect a slash-based calendar format, and a human reader may need a local-time rendering instead of a raw timestamp. This tool takes a single date input and expands it into several useful outputs at once, including ISO, UTC, local time, common date formats, and a seconds-based Unix timestamp. That makes it useful for developers, content editors, analysts, and anyone moving dates between systems that do not agree on presentation format.",
      faq: [
        {
          question: "What date inputs does this converter accept?",
          answer: "It works best with ISO strings and standard date-like inputs that JavaScript can parse reliably.",
        },
        {
          question: "Can it output a Unix timestamp too?",
          answer: "Yes. The tool includes a seconds-based Unix timestamp alongside formatted date strings.",
        },
        {
          question: "Why compare UTC and local output?",
          answer: "Because it helps reveal timezone-related differences when the same input is rendered in different environments.",
        },
      ],
    },
    "day-of-year-calculator": {
      title: "Day Of Year Calculator",
      seoTitle: "Day Of Year Calculator | Kaya",
      description: "Find the day number within the year and how many days remain instantly.",
      intro:
        "Use this day of year calculator to find which numbered day a date falls on within the year. It also shows how many days remain and whether the year is leap or common.",
      exampleHeading: "Example Usage",
      explanationHeading: "Day Of Year Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Check whether a date falls on day 122 or day 300 of the year.",
        "See how many days remain in the year for planning and reporting.",
        "Confirm whether the selected year is leap or common while calculating the day number.",
      ],
      explanation:
        "A day of year calculator tells you the numeric position of a date inside its year, such as day 32, day 180, or day 365. This is useful in analytics, reporting, seasonal planning, astronomy-style date references, and software systems that work with ordinal dates. Calculating the position manually is simple in theory but error-prone when leap years are involved. This tool takes a single date and returns its day number, how many days remain in the same year, and whether that year is leap or common. That gives you a quick, browser-based answer without needing a spreadsheet or script.",
      faq: [
        {
          question: "What is a day of year value?",
          answer: "It is the position of a date within the year, counted from January 1 as day 1.",
        },
        {
          question: "Does the calculator handle leap years?",
          answer: "Yes. Leap years change the total number of days and therefore affect the day-of-year position after February.",
        },
        {
          question: "Can I see how many days remain in the year too?",
          answer: "Yes. The tool includes the remaining days after the selected date.",
        },
      ],
    },
    "leap-year-checker": {
      title: "Leap Year Checker",
      seoTitle: "Leap Year Checker | Kaya",
      description: "Check whether a year is a leap year and see the February day count and matching rule.",
      intro:
        "Use this leap year checker to test whether a year is leap or common. It also shows the matching rule, February day count, and total days in the year.",
      exampleHeading: "Example Usage",
      explanationHeading: "Leap Year Checker Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Enter `2028` to confirm that it is a leap year with 29 days in February.",
        "Check century years like `1900` or `2000` and see which leap-year rule applies.",
        "Use the result when validating date logic in forms or scheduling systems.",
      ],
      explanation:
        "A leap year checker determines whether a year has 365 days or 366 days. This matters because calendar calculations can shift when February has 29 days instead of 28. The common rule is that years divisible by 4 are leap years, except years divisible by 100, unless they are also divisible by 400. That exception is where manual checks often go wrong. This tool takes a year input and shows whether it is leap or common, how many days February has, how many days the year contains, and which specific rule matched. It is useful for debugging date logic, validating forms, and checking edge cases around century years.",
      faq: [
        {
          question: "What makes a year a leap year?",
          answer: "A leap year is usually divisible by 4, except years divisible by 100 unless they are also divisible by 400.",
        },
        {
          question: "Why is 2000 a leap year but 1900 is not?",
          answer: "Because 2000 is divisible by 400, while 1900 is divisible by 100 but not 400.",
        },
        {
          question: "Does the tool show February day count too?",
          answer: "Yes. It tells you whether February has 28 or 29 days for the selected year.",
        },
      ],
    },
    "current-timestamp": {
      title: "Current Unix Timestamp",
      seoTitle: "Current Unix Timestamp | Kaya",
      description: "Get the current Unix timestamp in seconds and milliseconds with live UTC, local time, and ISO output.",
      intro:
        "Use this current Unix timestamp tool to get the live timestamp in seconds and milliseconds instantly. It updates every second and also shows UTC, local time, and ISO 8601 output for quick debugging.",
      exampleHeading: "Example Usage",
      explanationHeading: "Current Unix Timestamp Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Open the page to get the current Unix timestamp without typing anything.",
        "Copy the seconds value for APIs that expect standard Unix time.",
        "Use the milliseconds value for JavaScript logs, frontend timers, or analytics events.",
      ],
      explanation:
        "A current Unix timestamp is the current moment represented as the number of seconds or milliseconds since January 1, 1970 UTC. It is widely used in APIs, databases, browser events, and logging pipelines because it is compact and easy for programs to compare. This page gives you the current timestamp live in the browser, so you do not need to open a terminal or run a script just to fetch a fresh value. It also shows the same moment in UTC, ISO 8601, and local time, which makes it easier to confirm what a raw number actually means. If you are testing an endpoint, generating mock data, or checking log timing, this tool removes a repetitive step.",
      faq: [
        {
          question: "Does the current Unix timestamp update automatically?",
          answer: "Yes. The page updates every second in the browser, so the seconds and milliseconds values stay current.",
        },
        {
          question: "What is the difference between seconds and milliseconds?",
          answer: "Seconds are the standard Unix timestamp format, while milliseconds add three extra digits and are common in JavaScript and frontend event data.",
        },
        {
          question: "Is the timestamp based on my local timezone?",
          answer: "No. The Unix timestamp itself is timezone-independent. Timezone only affects how the readable local time is displayed.",
        },
      ],
    },
    "timestamp-milliseconds-converter": {
      title: "Timestamp Milliseconds Converter",
      seoTitle: "Timestamp Milliseconds Converter | Kaya",
      description: "Convert timestamp seconds to milliseconds and milliseconds to seconds instantly, with live date preview.",
      intro:
        "Use this timestamp milliseconds converter to switch between Unix timestamp seconds and milliseconds instantly. It updates both fields in the browser and includes UTC, ISO, and local date previews.",
      exampleHeading: "Example Usage",
      explanationHeading: "Timestamp Milliseconds Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Enter `1714651200` to convert a seconds timestamp into `1714651200000` milliseconds.",
        "Paste a JavaScript timestamp in milliseconds to get the shorter seconds version for backend APIs.",
        "Use the date preview to verify that the converted value still points to the expected moment.",
      ],
      explanation:
        "Many systems store Unix timestamps, but not all of them use the same unit. Backend APIs often expect seconds, while JavaScript and browser event data commonly use milliseconds. That small difference adds three extra digits and is a frequent source of bugs during debugging or data conversion. This timestamp milliseconds converter solves that by letting you edit either side and immediately see the converted value on the other side. It also shows a human-readable preview in UTC, ISO 8601, and local time, so you can verify that the result still represents the same point in time. If you regularly move data between databases, APIs, scripts, and frontend code, this tool helps prevent off-by-1000 mistakes.",
      faq: [
        {
          question: "How do I know whether a timestamp is seconds or milliseconds?",
          answer: "In practice, seconds are usually 10 digits for modern dates, while milliseconds are usually 13 digits.",
        },
        {
          question: "Why does converting seconds to milliseconds add three zeros?",
          answer: "Because one second equals 1000 milliseconds, so the numeric value is multiplied by 1000.",
        },
        {
          question: "Can I check the converted date too?",
          answer: "Yes. The tool includes UTC, ISO, and local previews so you can confirm the timestamp still maps to the right moment.",
        },
      ],
    },
    "date-difference-calculator": {
      title: "Date Difference Calculator",
      seoTitle: "Date Difference Calculator | Kaya",
      description: "Calculate the difference between two dates in days, hours, minutes, and seconds instantly.",
      intro:
        "Use this date difference calculator to measure the exact gap between two dates and times. It gives instant totals in days, hours, minutes, and seconds, plus a simple breakdown.",
      exampleHeading: "Example Usage",
      explanationHeading: "Date Difference Calculator Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Pick a start date and end date to calculate the total number of days between them.",
        "Use the hour and minute totals when checking SLA windows, deadlines, or event durations.",
        "Compare two timestamps quickly without opening a spreadsheet or writing a script.",
      ],
      explanation:
        "A date difference calculator tells you how far apart two points in time are. That sounds simple, but manual counting becomes annoying when the dates are far apart or when you need more than just days. Developers, analysts, and everyday users often need the same answer expressed in multiple ways, such as total days for reporting, total hours for duration checks, or a day-hour-minute-second breakdown for clarity. This tool takes two date-time inputs and calculates the difference instantly in the browser. It also shows whether the end date is later, earlier, or exactly the same moment. That makes it useful for planning, debugging time-based logic, measuring intervals, and checking schedule gaps without touching a spreadsheet.",
      faq: [
        {
          question: "Does this date difference calculator include time of day?",
          answer: "Yes. It compares full date-time inputs, not just calendar dates, so hours and minutes affect the result.",
        },
        {
          question: "Can the result be negative?",
          answer: "The tool shows direction separately and calculates the absolute gap, so you can still see whether the end date is earlier or later.",
        },
        {
          question: "Is the calculation done in the browser?",
          answer: "Yes. The difference is calculated instantly on the page with no backend required.",
        },
      ],
    },
    "timezone-converter": {
      title: "Timezone Converter",
      seoTitle: "Timezone Converter | Kaya",
      description: "Convert a date and time between timezones instantly with UTC and ISO output.",
      intro:
        "Use this timezone converter to translate a date and time from one timezone to another. Pick the source timezone, target timezone, and date, then get the converted time instantly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Timezone Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Convert a meeting time from UTC to Asia/Shanghai before sharing it with teammates.",
        "Check how a New York event time appears in London or Tokyo.",
        "Use the UTC and ISO outputs when you need a timezone-neutral value for APIs or storage.",
      ],
      explanation:
        "A timezone converter helps you take a date and time that belongs to one timezone and view the equivalent moment in another timezone. This matters whenever you schedule meetings, compare logs from different regions, or move timestamps between systems that display local time differently. The difficulty is that the same wall-clock time can mean different UTC moments depending on the source timezone and daylight saving rules. This tool handles that conversion directly in the browser. You choose the source timezone, the target timezone, and the original local date-time, then the page calculates the equivalent result along with UTC and ISO output. That makes it useful for remote teams, debugging international systems, and checking region-based event timing.",
      faq: [
        {
          question: "What is the difference between UTC and a local timezone?",
          answer: "UTC is a standard global reference time, while local timezones apply offsets and sometimes daylight saving rules on top of UTC.",
        },
        {
          question: "Does this timezone converter handle daylight saving changes?",
          answer: "It uses the browser's timezone data through the Intl API, so it follows the timezone rules available in the current environment.",
        },
        {
          question: "Do I need to install anything to use it?",
          answer: "No. The conversion runs in the browser with standard JavaScript APIs.",
        },
      ],
    },
    "timestamp-converter": {
      title: "Unix Timestamp Converter",
      seoTitle: "Unix Timestamp Converter | Kaya",
      description: "Convert Unix timestamps to readable dates and convert dates back to seconds or milliseconds instantly.",
      intro:
        "Use this Unix timestamp converter to switch between Unix time, UTC, local time, and ISO date strings. It handles both seconds and milliseconds, updates instantly in the browser, and works without any backend calls.",
      exampleHeading: "Example Usage",
      explanationHeading: "Unix Timestamp Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Input `1714651200` to get a readable UTC and local date.",
        "Pick a date with the date-time field to get both seconds and milliseconds.",
        "Use the live current timestamp block when you need a quick value for logs or APIs.",
      ],
      explanation:
        "A Unix timestamp is the number of seconds or milliseconds that have passed since January 1, 1970 UTC. Developers use it in APIs, databases, logs, and blockchain data because it is compact and unambiguous. The problem is that raw timestamps are hard to read at a glance, and some systems use seconds while others use milliseconds. This Unix timestamp converter solves that by detecting the unit, converting it to a human-readable date, and letting you reverse the process from a chosen date back into timestamp values. It runs fully in the browser, so the result is instant and private. If you are debugging an API response, checking event times, or validating stored values, this saves a few repetitive steps every time.",
      faq: [
        {
          question: "Does this Unix timestamp converter support seconds and milliseconds?",
          answer: "Yes. The tool detects the unit automatically based on the size of the number and shows both readable and raw outputs.",
        },
        {
          question: "Why does my timestamp look off by a few hours?",
          answer: "That is usually a timezone issue. Compare the UTC output with the local output to confirm whether the stored value is correct.",
        },
        {
          question: "Can I use negative Unix timestamps?",
          answer: "Yes. Negative values represent dates before January 1, 1970 UTC, as long as they stay inside the JavaScript Date range.",
        },
        {
          question: "Does this tool send data to a server?",
          answer: "No. All conversion logic runs in the browser, so there is no backend dependency for this page.",
        },
      ],
    },
  },
  zh: {
    "json-minifier": {
      title: "JSON 压缩工具",
      seoTitle: "JSON 压缩工具 | Kaya",
      description: "在线压缩 JSON，移除空白并输出紧凑单行结果。",
      intro:
        "这个 JSON 压缩工具可以把格式化后的 JSON 压缩成单行内容，适合测试请求体、查看紧凑结构和做传输前检查。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 压缩工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把带缩进的 JSON 压缩成单行 payload。",
        "在嵌入式字段或简单传输场景中使用紧凑 JSON。",
        "查看一段 JSON 去掉空白后的实际体积形态。",
      ],
      explanation:
        "JSON 压缩工具会去掉合法 JSON 中不必要的换行、缩进和空白字符，把它重新输出成尽可能紧凑的单行内容。这在测试接口、准备请求体、嵌入小型配置片段或查看压缩后数据形态时很常见。工具会先解析 JSON，再输出压缩结果，所以既能保证结构合法，又能把格式空白全部清掉。对于经常在可读形式和紧凑形式之间切换的开发者来说，这是一个很常用的小工具。",
      faq: [
        {
          question: "压缩 JSON 会改动数据内容吗？",
          answer: "不会。它只会移除格式空白，不会修改 JSON 的结构和值。",
        },
        {
          question: "非法 JSON 也能压缩吗？",
          answer: "不能。输入必须先是合法 JSON。",
        },
        {
          question: "什么时候适合用压缩后的 JSON？",
          answer: "适合做紧凑请求体、传输、嵌入配置片段或查看压缩后的原始形态。",
        },
      ],
    },
    "json-escape-unescape": {
      title: "JSON 转义还原工具",
      seoTitle: "JSON 转义还原工具 | Kaya",
      description: "对 JSON 字符串内容进行转义，或把转义后的字符串还原成可读文本。",
      intro:
        "这个 JSON 转义还原工具可以把普通文本转换成 JSON 安全字符串，也可以把转义后的 JSON 字符串重新还原成可读内容。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 转义还原工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把包含引号和换行的文本转义后再嵌入 JSON 字符串值里。",
        "把日志或序列化输出中的 JSON 字符串还原回普通文本。",
        "调试文本在 JSON 里的存储和传输形式时直接使用。",
      ],
      explanation:
        "JSON 转义工具适合处理“这段文本如何安全放进 JSON 字符串里”这种问题。像引号、换行、反斜杠这类字符，如果直接放进 JSON 字符串，往往会破坏结构，因此必须先做转义。这个工具支持双向处理：既可以把普通文本转成 JSON 字符串字面量，也可以把已转义的 JSON 字符串重新还原为可读内容。对于调试接口、检查序列化结果或分析日志中的转义文本来说，这类工具很方便。",
      faq: [
        {
          question: "JSON 转义是做什么的？",
          answer: "它会把引号、换行等特殊字符转换为适合放进 JSON 字符串里的形式。",
        },
        {
          question: "能反向还原吗？",
          answer: "可以。工具支持转义和还原两个方向。",
        },
        {
          question: "为什么还原有时会失败？",
          answer: "因为输入不是合法的 JSON 字符串字面量。",
        },
      ],
    },
    "word-character-counter": {
      title: "字数字符统计工具",
      seoTitle: "字数字符统计工具 | Kaya",
      description: "在线统计文本的单词数、字符数、行数和段落数。",
      intro:
        "这个字数字符统计工具可以即时统计文本的单词数、字符数、不含空格字符数、行数和段落数。",
      exampleHeading: "使用示例",
      explanationHeading: "字数字符统计工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "发布文章前先查看当前单词数是否符合目标范围。",
        "处理简介、标签或表单时，检查字符数是否超出限制。",
        "编辑多段文本时，同时查看行数和段落数。",
      ],
      explanation:
        "字数字符统计工具适合在同一个界面里快速查看一段文本的多个长度指标。除了常见的单词数，它还会统计总字符数、不含空格字符数、行数和段落数。这在写作、UI 文案、表单校验、内容发布以及任何有长度限制的场景里都非常常见。因为输入时结果会立即更新，所以你可以一边修改内容，一边观察各项计数的变化。对开发和内容编辑来说，这类工具都很实用。",
      faq: [
        {
          question: "空格会计入字符数吗？",
          answer: "会。工具会同时显示总字符数和去掉空格后的字符数。",
        },
        {
          question: "段落是怎么统计的？",
          answer: "段落通常按空行分隔的文本块来统计。",
        },
        {
          question: "适合检查 UI 字数限制吗？",
          answer: "适合。字符统计特别适合简介、标题、标签和输入框长度检查。",
        },
      ],
    },
    "text-case-converter": {
      title: "文本大小写转换工具",
      seoTitle: "文本大小写转换工具 | Kaya",
      description: "在小写、大写、标题式、句式和 slug 风格之间快速转换文本。",
      intro:
        "这个文本大小写转换工具可以把同一段文字快速转换成多种常见风格，包括小写、大写、标题式、句首大写和 slug 风格。",
      exampleHeading: "使用示例",
      explanationHeading: "文本大小写转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把混合格式文本转换成标题式，用于文章标题或 UI 标题。",
        "生成句首大写版本，方便整理普通内容文案。",
        "预览同一段文本对应的 slug 风格结果。",
      ],
      explanation:
        "文本大小写转换工具适合处理同一段文本在不同风格之间切换的需求。比如设计稿里希望是标题式，接口字段里需要小写，页面文案里又适合句首大写，URL 则可能更适合 slug 风格。与其反复手工改写，不如直接生成多种结果一起对比。这个工具会即时输出几种常见大小写风格，对于写标题、整理标签、准备标识符或做 URL 预处理都很方便。",
      faq: [
        {
          question: "支持哪些文本风格？",
          answer: "支持小写、大写、标题式、句首大写和 slug 风格。",
        },
        {
          question: "适合处理标题和标签吗？",
          answer: "适合。它很适合整理 UI 文案、标题和常见文本标识。",
        },
        {
          question: "slug 风格和专门的 slug 生成器一样吗？",
          answer: "它可以给出 slug 风格预览，但如果你主要目标是生成 URL slug，专门的 slug 生成器会更直接。",
        },
      ],
    },
    "slug-generator": {
      title: "Slug 生成器",
      seoTitle: "Slug 生成器 | Kaya",
      description: "把文本快速转换为适合 URL 的 slug。",
      intro:
        "这个 slug 生成器可以把标题或短语转换为适合 URL、路由、文件名和内容标识的简洁 slug。",
      exampleHeading: "使用示例",
      explanationHeading: "Slug 生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把文章标题转换为 URL 可用的 slug。",
        "在生成链接前先规范化带标点的文本。",
        "为路由、文件名或内容 ID 准备稳定的短标识。",
      ],
      explanation:
        "Slug 生成器会把可读文本转换为更适合 URL 使用的简洁字符串。这个过程通常包括统一小写、去掉或规范化重音符号、把空格和标点替换成短横线，并清理多余分隔符。slug 常见于博客文章链接、页面路由、文件名和内容标识，因为它既可读，又相对稳定。这个工具在浏览器里直接完成转换，所以在写内容、起路由名或整理导入标题时都很方便。",
      faq: [
        {
          question: "什么是 slug？",
          answer: "slug 是一种简化后的文本字符串，常用于 URL、路由或标识符，通常由小写单词和短横线组成。",
        },
        {
          question: "会去掉标点和空格吗？",
          answer: "会。工具会把不适合放进 URL 的字符清理或替换掉。",
        },
        {
          question: "可以直接用于博客链接吗？",
          answer: "可以。这正是 slug 生成器最常见的用途之一。",
        },
      ],
    },
    "duplicate-line-remover": {
      title: "重复行移除工具",
      seoTitle: "重复行移除工具 | Kaya",
      description: "即时移除文本中的重复行，并保留首次出现的内容。",
      intro:
        "这个重复行移除工具可以快速清理文本中的重复行。它支持保留首次出现、裁剪空白，以及控制是否保留空行。",
      exampleHeading: "使用示例",
      explanationHeading: "重复行移除工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把复制来的关键词或标签列表去重。",
        "在进一步处理前先清理纯文本导出里的重复行。",
        "保留每条内容第一次出现的位置，并去掉后续重复项。",
      ],
      explanation:
        "重复行移除工具会按行扫描输入文本，只保留每条内容第一次出现的版本。它适合处理日志片段、关键词列表、纯文本导出、配置项集合等容易出现重复值的内容。相比手动逐行检查，这种工具可以立即识别重复项并输出更干净的结果。为了适配真实输入，它还支持大小写敏感开关、裁剪行首尾空白，以及是否保留空行等选项。整个处理过程都在浏览器里完成，所以适合快速清理本地文本。",
      faq: [
        {
          question: "会保留第一条匹配的行吗？",
          answer: "会。工具会保留首次出现的内容，并移除后续重复项。",
        },
        {
          question: "能忽略大小写差异吗？",
          answer: "可以。关闭大小写敏感后，类似 Apple 和 apple 会被视为同一行。",
        },
        {
          question: "空行会怎么处理？",
          answer: "你可以自己选择保留空行还是直接移除。",
        },
      ],
    },
    "line-sorter": {
      title: "文本行排序工具",
      seoTitle: "文本行排序工具 | Kaya",
      description: "即时按升序或降序排序文本行，并支持清理选项。",
      intro:
        "这个文本行排序工具可以对多行文本做升序或降序排序，并支持裁剪空白、移除空行和控制大小写敏感。",
      exampleHeading: "使用示例",
      explanationHeading: "文本行排序工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把词条、ID 或配置项列表按字母顺序排列。",
        "在排序前顺手清理行首尾空白和空行。",
        "快速反转条目顺序，用于人工检查或调试对比。",
      ],
      explanation:
        "文本行排序工具会把输入内容拆成多行，并按选定规则重新排列顺序。这在整理关键词列表、比对复制来的 ID、清洗日志片段或准备配置项时非常常见。相比手工排序，直接粘贴全文本再即时输出会更快。这个版本还提供了裁剪行首尾空白、移除空行和控制大小写敏感的选项，所以在面对不规整输入时更实用。对于开发和内容整理场景，这类基础工具的使用频率通常很高。",
      faq: [
        {
          question: "支持倒序排序吗？",
          answer: "支持，可以在升序和降序之间切换。",
        },
        {
          question: "会自动删掉空行吗？",
          answer: "可以，但这是可选行为，你可以自行打开或关闭。",
        },
        {
          question: "排序时会修改每一行的内容吗？",
          answer: "默认只改变顺序；只有开启裁剪空白时，才会对行首尾空格做处理。",
        },
      ],
    },
    "random-string-generator": {
      title: "随机字符串生成器",
      seoTitle: "随机字符串生成器 | Kaya",
      description: "按自定义长度和字符集即时生成随机字符串。",
      intro:
        "这个随机字符串生成器可以直接在浏览器中生成一个或多个随机字符串，并支持长度、数量和字符集选项。",
      exampleHeading: "使用示例",
      explanationHeading: "随机字符串生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "为测试数据或临时标识生成随机字符串。",
        "组合字母、数字和符号来生成不同风格的值。",
        "在需要人工传递时排除易混淆字符，例如 0、O、1、l。",
      ],
      explanation:
        "随机字符串生成器会从你选择的字符集合中创建不可预测的文本值。它常见于测试数据、临时 token、内部标识、邀请码以及各种开发辅助场景。你可以控制是否包含小写字母、大写字母、数字和符号，也可以排除一些容易看错的字符，例如 O 和 0。这个工具直接使用浏览器提供的加密随机源，因此比简单的数学随机方式更可靠，也不需要后端参与。对于前端工具站来说，这是非常实用的一类基础生成器。",
      faq: [
        {
          question: "一次可以生成多个字符串吗？",
          answer: "可以，工具支持一次输出多条结果。",
        },
        {
          question: "能排除容易混淆的字符吗？",
          answer: "可以，像 0、O、1、l 这样的字符都可以排除。",
        },
        {
          question: "需要后端参与生成吗？",
          answer: "不需要。生成过程完全在浏览器中完成，并使用 Web Crypto。",
        },
      ],
    },
    "binary-to-text": {
      title: "二进制转文本工具",
      seoTitle: "二进制转文本工具 | Kaya",
      description: "把 8 位二进制字节即时转换为可读文本。",
      intro:
        "这个二进制转文本工具可以把 8 位二进制输入解码为可读文本，支持空格分隔、换行分隔，以及连续 bit 串自动按字节分组。",
      exampleHeading: "使用示例",
      explanationHeading: "二进制转文本工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把编程练习中的二进制字节序列解码回文本。",
        "检查简单的二进制载荷，并快速查看可读内容。",
        "直接粘贴一整段连续 bit 串，让工具自动按 8 位拆分。",
      ],
      explanation:
        "二进制转文本工具会把由 0 和 1 组成的字节组重新解码成字符。在最常见的场景里，每个字符会对应一个 8 位字节，因此工具会先把每组 bit 转成数值，再把整个字节序列按文本方式解码出来。它适合编程教学、底层调试、编码演示和小规模二进制示例检查。为了避免输出混乱结果，工具会先校验输入格式，只有完整且合法的 8 位字节组才会被解码。",
      faq: [
        {
          question: "输入必须是什么格式？",
          answer: "需要是只包含 0 和 1 的 8 位字节组。",
        },
        {
          question: "能直接粘贴一整串连续二进制吗？",
          answer: "可以。只要总长度能被 8 整除，工具会自动按字节分组。",
        },
        {
          question: "为什么会提示输入无效？",
          answer: "通常是因为某些分组不是完整 8 位，或者包含了 0 和 1 之外的字符。",
        },
      ],
    },
    "text-to-binary": {
      title: "文本转二进制工具",
      seoTitle: "文本转二进制工具 | Kaya",
      description: "把普通文本即时转换为 8 位二进制字节。",
      intro:
        "这个文本转二进制工具可以把普通文本转换为二进制字节，并支持空格分隔或按行分隔的输出形式。",
      exampleHeading: "使用示例",
      explanationHeading: "文本转二进制工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把短文本转换为二进制字节，用于学习或调试。",
        "查看字符串在字节层面的表示方式。",
        "在空格分隔和逐行输出两种二进制格式之间切换。",
      ],
      explanation:
        "文本转二进制工具会把普通字符映射到底层字节表示，并把每个字节显示为 8 位的 0/1 字符串。这个过程很适合用来理解编码方式、演示字节结构，或者在调试时检查字符串是如何被表示的。对于编程练习、协议演示和简单编码分析，这类工具非常直观。由于转换在浏览器里立即完成，你可以不断调整输入文本，并马上对比不同输出形式，而不需要依赖终端或后端服务。",
      faq: [
        {
          question: "输出一定是 8 位分组吗？",
          answer: "是的。每个字节都会显示成一个完整的 8 位二进制值。",
        },
        {
          question: "每个字节能单独占一行吗？",
          answer: "可以。工具支持空格分隔和逐行分隔两种输出方式。",
        },
        {
          question: "支持非英文字符吗？",
          answer: "支持。工具会把输入按 UTF-8 编码成字节，因此中文等字符也可以转换。",
        },
      ],
    },
    "unicode-converter": {
      title: "Unicode 转换工具",
      seoTitle: "Unicode 转换工具 | Kaya",
      description: "把文本转成 Unicode 编码点，或即时解码 Unicode 转义。",
      intro:
        "这个 Unicode 转换工具可以在普通文本和 Unicode 表示之间切换，支持 U+ 编码、常见转义序列以及基础 HTML 数字实体。",
      exampleHeading: "使用示例",
      explanationHeading: "Unicode 转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把文本转换为 Unicode 编码点，用于调试转义字符串。",
        "把复制来的 \\u4F60\\u597D 这类转义还原成可读字符。",
        "查看 emoji 或多语言文本对应的 Unicode 值。",
      ],
      explanation:
        "Unicode 转换工具适合处理普通文本和编码表示之间的来回切换。开发里经常会遇到日志、源码、JSON、HTML 或接口返回中的转义字符，这时你需要知道一段内容到底对应哪些编码点，或者把编码形式重新还原成可读文本。这个工具可以直接完成这些转换，因此在调试多语言字符串、排查字符渲染问题、检查转义内容时都很方便。相比手工查表或写临时代码，它会快很多。",
      faq: [
        {
          question: "支持哪些输入格式？",
          answer: "支持常见的 Unicode 转义、U+ 编码点表示，以及基础 HTML 数字实体。",
        },
        {
          question: "emoji 和中文也能处理吗？",
          answer: "可以。工具支持普通 Unicode 字符，包括 emoji 和多语言文本。",
        },
        {
          question: "什么时候会用到 Unicode 转换工具？",
          answer: "常见于调试转义字符串、检查编码内容或排查字符显示问题。",
        },
      ],
    },
    "text-diff-checker": {
      title: "文本差异比较工具",
      seoTitle: "文本差异比较工具 | Kaya",
      description: "逐行比较两段文本，并查看新增、删除和未变化的内容。",
      intro:
        "这个文本差异比较工具可以逐行比较两段文本，并直接高亮哪些行保持不变、被删除或被新增。",
      exampleHeading: "使用示例",
      explanationHeading: "文本差异比较工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在部署前比较两段配置片段的差异。",
        "检查旧版本和新版本文本之间到底改了哪些行。",
        "不打开 Git 或命令行，也能快速查看复制文本的行级变化。",
      ],
      explanation:
        "文本差异比较工具会把两段文本按行拆开，再展示它们之间的变化。它适合用来比对配置片段、列表、说明文档、导出内容以及各种复制过来的纯文本。相比手动来回扫两段内容，这种工具会更快地把未变化、新增和删除的行区分出来，并给出简洁结果。对于开发、运维、内容编辑等经常处理文本版本差异的场景，它是非常实用的小工具。",
      faq: [
        {
          question: "这是按行比较还是按字符比较？",
          answer: "当前版本主要做按行比较，更适合配置、列表和纯文本块场景。",
        },
        {
          question: "短文本和长列表都能用吗？",
          answer: "可以。只要是基于行的文本内容，都适合用这个工具比较。",
        },
        {
          question: "需要后端支持吗？",
          answer: "不需要。比较过程完全在浏览器里完成。",
        },
      ],
    },
    "regex-tester": {
      title: "正则测试工具",
      seoTitle: "正则测试工具 | Kaya",
      description: "即时测试正则表达式，并查看匹配位置和捕获组。",
      intro:
        "这个正则测试工具可以让你直接在浏览器里测试表达式、切换 flags，并查看所有匹配结果。",
      exampleHeading: "使用示例",
      explanationHeading: "正则测试工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在把表达式加进表单校验或解析器之前先测试效果。",
        "调试正则时查看匹配位置和捕获组内容。",
        "快速试验全局、忽略大小写、多行等 flags。",
      ],
      explanation:
        "正则测试工具适合在真正写进代码前，先确认一个正则表达式是否按预期工作。你可以输入 pattern、flags 和样本文本，工具会立即给出匹配结果。这样在做校验规则、内容提取、日志筛选或文本解析时，就不用反复改代码再运行。由于它会列出每一个匹配和捕获组，所以也更容易看出表达式到底匹配了什么、是不是写得过宽或者过严。",
      faq: [
        {
          question: "flags 也能一起测试吗？",
          answer: "可以。你可以输入常见的 JavaScript flags，例如 g、i、m。",
        },
        {
          question: "会显示捕获组吗？",
          answer: "会。如果表达式里有捕获组，工具会把对应内容列出来。",
        },
        {
          question: "为什么会提示正则无效？",
          answer: "通常是因为表达式语法本身有问题，或者 flags 组合不合法。",
        },
      ],
    },
    "regex-replace-tool": {
      title: "正则替换工具",
      seoTitle: "正则替换工具 | Kaya",
      description: "在浏览器中做基于正则的查找替换，并即时输出结果。",
      intro:
        "这个正则替换工具可以让你用正则表达式查找文本并立即替换，适合快速测试替换规则和文本清洗逻辑。",
      exampleHeading: "使用示例",
      explanationHeading: "正则替换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把连续空白替换成短横线，用于准备 slug 或标识符。",
        "利用正则和替换字符串对结构化文本做快速清洗。",
        "在写进代码前先预览一个替换规则的实际效果。",
      ],
      explanation:
        "正则替换工具可以把基于模式的文本替换流程可视化。相比直接在代码里试，它更适合先验证表达式、flags 和替换内容的组合是否正确。这个过程常见于内容清洗、命名规范化、日志整理、简单数据预处理等场景。输入一变化，输出就会立即更新，所以调试替换逻辑的效率很高。对于经常做文本转换的开发和内容工作流来说，这是很顺手的辅助工具。",
      faq: [
        {
          question: "替换时也能使用 flags 吗？",
          answer: "可以。你可以输入常见的 JavaScript 正则 flags，例如 g 或 i。",
        },
        {
          question: "结果会即时更新吗？",
          answer: "会。输入、表达式或替换内容变化后，结果会立刻刷新。",
        },
        {
          question: "适合在写代码前先测试替换逻辑吗？",
          answer: "很适合。这正是浏览器版正则替换工具的主要用途之一。",
        },
      ],
    },
    "hash-generator-md5-sha256": {
      title: "MD5 SHA-256 哈希生成器",
      seoTitle: "MD5 SHA-256 哈希生成器 | Kaya",
      description: "即时生成任意文本的 MD5 和 SHA-256 哈希值。",
      intro:
        "这个 MD5 SHA-256 哈希生成器可以在浏览器里直接生成两种常见哈希结果，输入变化后会立即更新。",
      exampleHeading: "使用示例",
      explanationHeading: "MD5 SHA-256 哈希生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "对一段测试字符串生成哈希，用来核对前后端结果是否一致。",
        "同时生成 MD5 和 SHA-256，方便做调试和校验。",
        "在准备 fixture、签名测试或内容校验时快速查看哈希输出。",
      ],
      explanation:
        "哈希生成器会把输入文本转换为固定长度的指纹值，只要输入变化，输出哈希也会变化。MD5 和 SHA-256 都是开发里常见的算法，虽然它们的安全性和适用场景不同，但在调试、校验、兼容旧流程、准备测试数据时都很常见。这个工具把两种结果放在同一页里同时输出，所以你可以快速比对，不需要再切换脚本或终端命令。对于浏览器端工具站来说，这是很实用的一类基础加密辅助工具。",
      faq: [
        {
          question: "MD5 和 SHA-256 有什么区别？",
          answer: "SHA-256 更现代也更强，MD5 更老，通常只用于兼容性或简单校验场景。",
        },
        {
          question: "MD5 适合做密码安全存储吗？",
          answer: "不适合。MD5 不应该用于安全密码存储。",
        },
        {
          question: "哈希是在本地生成的吗？",
          answer: "是的。整个过程都在浏览器里完成。",
        },
      ],
    },
    "hex-to-string-converter": {
      title: "十六进制转文本工具",
      seoTitle: "十六进制转文本工具 | Kaya",
      description: "把十六进制字节即时转换为可读 UTF-8 文本。",
      intro:
        "这个十六进制转文本工具可以把十六进制输入直接解码为可读文本，既支持连续十六进制字符串，也支持按空格分隔的字节形式。",
      exampleHeading: "使用示例",
      explanationHeading: "十六进制转文本工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把日志或协议示例里的十六进制字节还原成可读文本。",
        "检查某段 UTF-8 文本在十六进制表示下对应的内容。",
        "直接粘贴连续 hex 或空格分隔字节并即时解码。",
      ],
      explanation:
        "十六进制转文本工具会把十六进制字节重新解释为可读字符串。开发里这很常见，比如你会在日志、协议调试、测试数据、编码练习里看到十六进制表示的内容，但需要快速知道它实际对应什么文本。这个工具会先检查输入是否为合法的字节对，再按 UTF-8 解码为文本，因此比手动逐个转换要快得多。它适合用来排查编码问题、检查载荷内容和做简单的数据还原。",
      faq: [
        {
          question: "支持什么输入格式？",
          answer: "支持连续十六进制字符串，也支持按空格分隔的十六进制字节对。",
        },
        {
          question: "为什么会提示输入无效？",
          answer: "通常是因为出现了非十六进制字符，或者字符数量不是偶数。",
        },
        {
          question: "能解码 UTF-8 文本吗？",
          answer: "可以。工具会按 UTF-8 解释这些字节。",
        },
      ],
    },
    "string-to-hex-converter": {
      title: "文本转十六进制工具",
      seoTitle: "文本转十六进制工具 | Kaya",
      description: "把普通文本转换为十六进制字节，便于快速检查编码结果。",
      intro:
        "这个文本转十六进制工具可以把普通文本转换为十六进制字节输出，也支持按字节空格分隔，方便查看。",
      exampleHeading: "使用示例",
      explanationHeading: "文本转十六进制工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一段文本转换成 hex，再发送给按字节处理的系统。",
        "查看 UTF-8 文本到底映射成了哪些字节。",
        "在逐字节调试时生成更易读的空格分隔 hex 输出。",
      ],
      explanation:
        "文本转十六进制工具会展示一段文本底层对应的十六进制字节表示。它常用于协议调试、载荷检查、编码分析、测试数据准备以及各种字节级开发场景。与其手工查字符编码，不如直接把输入丢进工具里，马上看到 UTF-8 编码后的 hex 结果。因为整个过程在浏览器里即时完成，所以很适合做快速检查和辅助调试。",
      faq: [
        {
          question: "输出的是字节还是字符编码点？",
          answer: "输出的是 UTF-8 字节，并以十六进制形式展示。",
        },
        {
          question: "能让 hex 结果更易读吗？",
          answer: "可以。你可以切换成按字节空格分隔的格式。",
        },
        {
          question: "中文等非英文文本也能转换吗？",
          answer: "可以。工具支持 UTF-8，因此多语言文本也能正确转换。",
        },
      ],
    },
    "jwt-decoder": {
      title: "JWT 解码工具",
      seoTitle: "JWT 解码工具 | Kaya",
      description: "在浏览器中即时解码 JWT 的 header 和 payload。",
      intro:
        "这个 JWT 解码工具可以在不发送到服务端的前提下，直接解析 token 的 header 和 payload，并展示常见时间字段。",
      exampleHeading: "使用示例",
      explanationHeading: "JWT 解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一个 JWT，检查 header 里的 alg 和 typ 字段。",
        "查看 payload 中的 sub、exp、iat 等 claim。",
        "确认 token 是否带有签名段，以及签名部分的大致长度。",
      ],
      explanation:
        "JWT 解码工具适合在开发调试时快速查看一个 JSON Web Token 里实际包含了什么内容。JWT 常见于登录鉴权和 API 调用流程，结构通常是 header、payload 和 signature 三段。这个工具会在浏览器里直接解码 Base64URL 编码的前两段，并把常见的时间字段转成更可读的形式。它不会验证签名，只负责把内容解出来，因此很适合排查 token 结构、检查 claim 和确认过期时间等问题。",
      faq: [
        {
          question: "这个工具会验证 JWT 签名吗？",
          answer: "不会。它只负责解码结构，不做签名校验。",
        },
        {
          question: "能查看 exp 和 iat 这类时间字段吗？",
          answer: "可以。存在这些字段时，工具会转成可读时间显示。",
        },
        {
          question: "需要后端参与解码吗？",
          answer: "不需要。整个解码过程都在浏览器里完成。",
        },
      ],
    },
    "json-flatten-tool": {
      title: "JSON 扁平化工具",
      seoTitle: "JSON 扁平化工具 | Kaya",
      description: "把嵌套 JSON 即时展开为点路径键值对。",
      intro:
        "这个 JSON 扁平化工具可以把嵌套对象和数组转换成路径化的扁平结构，方便查看深层字段。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 扁平化工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把嵌套 API 响应先扁平化，再映射到表格或键值视图里。",
        "不手动展开整棵树，也能直接查看深层对象路径。",
        "把数组和对象转换为更适合调试的路径结构。",
      ],
      explanation:
        "JSON 扁平化工具会把深层嵌套的数据结构改写成更简单的路径键值对形式。这样做的好处是，不用一层层展开对象和数组，也能快速看清某个值到底位于哪条路径上。它非常适合做接口调试、数据比对、导出预处理以及复杂 payload 检查。对于经常处理 JSON 的开发者来说，这种路径视图比原始层级结构更容易扫描和比较。",
      faq: [
        {
          question: "嵌套路径是怎么表示的？",
          answer: "对象使用点路径，数组使用类似 items[0].name 这种索引路径。",
        },
        {
          question: "数组也支持扁平化吗？",
          answer: "支持。数组会按索引展开成对应路径。",
        },
        {
          question: "会修改原始 JSON 的值吗？",
          answer: "不会。工具只改变展示结构，不会改动数据本身。",
        },
      ],
    },
    "json-diff-viewer": {
      title: "JSON 差异查看工具",
      seoTitle: "JSON 差异查看工具 | Kaya",
      description: "比较两份 JSON，并查看新增、删除或变化的路径。",
      intro:
        "这个 JSON 差异查看工具可以比较两份 JSON 输入，并高亮扁平路径层面的新增、删除和变化项。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 差异查看工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "比较代码改动前后的 API 响应。",
        "检查两版 JSON payload 到底哪些字段发生了变化。",
        "不借助命令行，也能快速查看配置对象中的新增和删除路径。",
      ],
      explanation:
        "JSON 差异查看工具适合在两份结构化数据之间快速定位变化。这个版本会先把两边 JSON 扁平化成路径键值对，再逐个路径比较，因此即使原始结构很深，也更容易看出变化发生在哪。它适合用于接口调试、配置审核、fixture 更新和各种结构化数据回归检查。比起人工在两棵树里来回找差异，这种路径视图通常更快、更清晰。",
      faq: [
        {
          question: "嵌套 JSON 也能比较吗？",
          answer: "可以。工具会先把嵌套对象和数组展开成路径后再比较。",
        },
        {
          question: "会显示哪些类型的变化？",
          answer: "会显示新增路径、删除路径，以及值发生变化的路径。",
        },
        {
          question: "两边都必须是合法 JSON 吗？",
          answer: "是的。只有两侧都成功解析后才能执行比较。",
        },
      ],
    },
    "json-to-csv-converter": {
      title: "JSON 转 CSV 工具",
      seoTitle: "JSON 转 CSV 工具 | Kaya",
      description: "把 JSON 数组或对象即时转换为 CSV 行数据。",
      intro:
        "这个 JSON 转 CSV 工具可以把结构化 JSON 转成 CSV 输出，适合数组对象场景，也会把嵌套字段展开成路径列名。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 转 CSV 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 API 返回的对象数组转换为 CSV，再导入表格工具。",
        "把嵌套 JSON 行展开成点路径列，方便导出查看。",
        "不依赖后端，直接把 JSON 数组快速变成表格格式。",
      ],
      explanation:
        "JSON 转 CSV 工具适合把结构化数据快速变成更容易分享、导入或检查的表格形式。开发里经常会拿到对象数组、接口响应或导出数据，但很多时候更希望它以行列结构呈现。这个工具会在浏览器里直接读取 JSON，把嵌套字段展开为路径列名，并即时输出 CSV。这样无论是做调试、轻量报表，还是临时的数据整理，都比手工复制粘贴快得多。",
      faq: [
        {
          question: "最适合什么 JSON 结构？",
          answer: "最适合对象数组，但单个对象也可以作为一行进行转换。",
        },
        {
          question: "嵌套字段会怎么处理？",
          answer: "会展开成点路径或索引路径形式的列名。",
        },
        {
          question: "转换是在本地完成的吗？",
          answer: "是的。JSON 解析和 CSV 生成都在浏览器里完成。",
        },
      ],
    },
    "csv-to-json-converter": {
      title: "CSV 转 JSON 工具",
      seoTitle: "CSV 转 JSON 工具 | Kaya",
      description: "把带表头的 CSV 数据即时转换为结构化 JSON。",
      intro:
        "这个 CSV 转 JSON 工具可以把表格风格的 CSV 数据转换为结构化 JSON，对首行表头做字段映射，并可自动识别常见值类型。",
      exampleHeading: "使用示例",
      explanationHeading: "CSV 转 JSON 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把表格导出的 CSV 行转换成 JSON 对象列表。",
        "把简单 CSV 数据变成可直接用于接口或前端的结构化内容。",
        "在准备 mock 数据时自动识别布尔值和数字。",
      ],
      explanation:
        "CSV 转 JSON 工具会把类似表格的输入转换为 JSON 对象数组，并把第一行作为字段名。这个过程在处理表格导出、测试数据、接口入参、fixture 文件时非常常见。相比手工一列列映射，直接读取表头再生成结构化对象会高效很多。这个工具还支持简单的类型识别，因此像数字、布尔值和 null 这类常见值都可以自动转成更自然的 JSON 形式。",
      faq: [
        {
          question: "CSV 必须包含表头吗？",
          answer: "是的。工具会把第一行作为生成 JSON 对象的字段名。",
        },
        {
          question: "能自动识别数字和布尔值吗？",
          answer: "可以。开启类型识别后，会自动转换常见标量值。",
        },
        {
          question: "支持带引号的 CSV 单元格吗？",
          answer: "支持。解析器可以处理常见的带引号内容和转义引号。",
        },
      ],
    },
    "xml-to-json-converter": {
      title: "XML 转 JSON 工具",
      seoTitle: "XML 转 JSON 工具 | Kaya",
      description: "把 XML 节点、文本和属性转换为可读 JSON。",
      intro:
        "这个 XML 转 JSON 工具可以把 XML 内容转换为结构化 JSON，并保留属性、文本节点和重复子节点。",
      exampleHeading: "使用示例",
      explanationHeading: "XML 转 JSON 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 XML 接口响应转换为 JSON，方便在前端里查看。",
        "检查 XML 属性和子节点会映射成什么 JSON 结构。",
        "把重复标签转换成更适合调试的数组式输出。",
      ],
      explanation:
        "XML 转 JSON 工具可以把较难直接在前端处理的 XML 内容转换成更熟悉的 JSON 结构。它会解析标签层级、保留属性字段、记录文本内容，并在遇到重复子节点时自动整理成数组。对于调试 XML API、处理旧系统集成、迁移数据结构或快速检查 XML 文档内容来说，这种浏览器侧转换非常实用，也比手动阅读一大段 XML 清晰得多。",
      faq: [
        {
          question: "XML 属性会保留下来吗？",
          answer: "会。属性会放进专门的 attributes 字段中。",
        },
        {
          question: "重复的子节点会怎么处理？",
          answer: "同名重复子节点会被整理成数组。",
        },
        {
          question: "需要后端解析器吗？",
          answer: "不需要。工具直接使用浏览器内置的 XML 解析能力。",
        },
      ],
    },
    "yaml-to-json-converter": {
      title: "YAML 转 JSON 工具",
      seoTitle: "YAML 转 JSON 工具 | Kaya",
      description: "把常见 YAML 对象和列表即时转换为 JSON。",
      intro:
        "这个 YAML 转 JSON 工具可以把常见 YAML 映射和列表结构转换成 JSON，支持最常见的缩进对象与数组模式。",
      exampleHeading: "使用示例",
      explanationHeading: "YAML 转 JSON 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把小型 YAML 配置转换成 JSON，再用于 JavaScript 应用。",
        "把嵌套 YAML 对象和数组转换成更熟悉的 JSON 结构。",
        "快速把手写 YAML 内容整理成结构化前端数据。",
      ],
      explanation:
        "YAML 转 JSON 工具适合在配置、原型和开发辅助场景里快速完成数据格式转换。很多配置和说明文档会用 YAML 来写，但在前端工具链、接口交互和 JavaScript 环境里，JSON 往往更自然。这个工具专注于最常见的 YAML 形态，比如对象映射、列表、布尔值、数字、null 和基于缩进的嵌套结构。它会在浏览器里直接解析并输出格式化 JSON，对于日常开发中的小到中等片段非常够用。",
      faq: [
        {
          question: "支持哪些 YAML 特性？",
          answer: "支持常见对象映射、列表、数字、布尔值、null 以及基于缩进的嵌套结构。",
        },
        {
          question: "为什么有时候解析会失败？",
          answer: "通常是因为缩进不一致，或者使用了当前轻量解析器不支持的高级 YAML 语法。",
        },
        {
          question: "适合处理很大的生产级 YAML 文件吗？",
          answer: "更适合处理日常开发里常见的小到中等 YAML 片段。",
        },
      ],
    },
    "percentage-calculator": {
      title: "百分比计算器",
      seoTitle: "百分比计算器 | Kaya",
      description: "即时计算百分比、总量占比结果，以及反推总量。",
      intro:
        "这个百分比计算器可以快速解决常见百分比问题，包括求某个数占总量多少、某个百分比对应多少值，以及根据百分比反推原始总量。",
      exampleHeading: "使用示例",
      explanationHeading: "百分比计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "计算 25 占 200 的百分比是多少。",
        "快速求出总量的 15% 对应的实际数值。",
        "已知某个值占 15%，反推它原本对应的总量。",
      ],
      explanation:
        "百分比计算器适合处理最常见的比例类问题。你可能想知道一个数值占总量的多少百分比，也可能想算总量的某个百分比是多少，或者反过来根据一个部分值去推总量。这个工具会把几种常见百分比关系同时算出来，因此不需要来回切换公式。它很适合预算、价格分析、报表、成绩换算以及日常快速计算场景。",
      faq: [
        {
          question: "能同时算多种百分比关系吗？",
          answer: "可以。它会同时给出占比、百分比对应值，以及反推总量结果。",
        },
        {
          question: "为什么总量不能是 0？",
          answer: "因为百分比计算中的除法需要一个非零基数。",
        },
        {
          question: "除了金融场景还能用吗？",
          answer: "可以。统计、成绩、报表和各种比例类问题都适合用。",
        },
      ],
    },
    "discount-calculator": {
      title: "折扣计算器",
      seoTitle: "折扣计算器 | Kaya",
      description: "即时计算折扣金额和最终到手价。",
      intro:
        "这个折扣计算器可以根据原价和折扣百分比，快速算出省了多少钱，以及折后最终价格。",
      exampleHeading: "使用示例",
      explanationHeading: "折扣计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在下单前先确认商品折后实际价格。",
        "查看 20% 折扣到底能省下多少金额。",
        "对比多个促销方案在同一原价下的真实效果。",
      ],
      explanation:
        "折扣计算器的作用，是把“打几折”或“减百分之多少”转换成更直观的金额结果。输入原价和折扣比例后，你能直接看到节省金额和最终应付价格。这在购物、促销比较、报价、发票和运营活动里都很常见。与其手算或估算，不如直接输入数值，让工具即时给出准确结果，这样更适合快速决策。",
      faq: [
        {
          question: "这个工具会显示什么结果？",
          answer: "会显示折扣节省金额和折后最终价格。",
        },
        {
          question: "支持小数价格吗？",
          answer: "支持，例如 199.99 这样的价格可以直接计算。",
        },
        {
          question: "折扣和百分比减免是一个意思吗？",
          answer: "是的，百分比折扣就是从原价中按比例扣减。",
        },
      ],
    },
    "profit-loss-calculator": {
      title: "盈亏计算器",
      seoTitle: "盈亏计算器 | Kaya",
      description: "根据买入价、卖出价和数量计算盈亏金额与比例。",
      intro:
        "这个盈亏计算器可以根据成本价、卖出价和数量，快速算出单件盈亏、总盈亏，以及相对于成本的变化比例。",
      exampleHeading: "使用示例",
      explanationHeading: "盈亏计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "计算一批商品按高于成本价卖出后的总利润。",
        "查看一次低于买入价卖出的交易亏损比例。",
        "在成交前先估算每件和整体结果。",
      ],
      explanation:
        "盈亏计算器适合快速判断一笔交易或一次销售到底赚了还是亏了。输入成本价、卖出价和数量后，工具会给出单件盈亏、总盈亏以及相对于成本的比例变化。它适用于商品销售、库存核算、小型交易决策以及一般业务场景。相比只看价格差，加入数量和成本基准之后，结果会更完整，也更方便做判断。",
      faq: [
        {
          question: "亏损场景也能算吗？",
          answer: "可以。如果卖出价低于成本价，结果会自动显示为亏损。",
        },
        {
          question: "这里的百分比是按什么算的？",
          answer: "按成本价作为基准来计算变化比例。",
        },
        {
          question: "为什么成本价和数量必须大于 0？",
          answer: "因为比例计算需要成本作基准，而总盈亏需要数量参与放大。",
        },
      ],
    },
    "roi-calculator": {
      title: "ROI 计算器",
      seoTitle: "ROI 计算器 | Kaya",
      description: "根据成本和回报价值计算 ROI 与净收益。",
      intro:
        "这个 ROI 计算器可以帮助你衡量一项投入带来了多少净收益，以及这部分收益相对于成本的回报率。",
      exampleHeading: "使用示例",
      explanationHeading: "ROI 计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "计算一个项目在总投入和总回报下的 ROI。",
        "判断某次投资是正回报还是负回报。",
        "用同一套公式比较两项投入方案的表现。",
      ],
      explanation:
        "ROI 计算器会比较你投入了多少成本，以及最终拿回了多少价值，从而给出净收益和回报率百分比。它很适合项目分析、营销预算复盘、自由职业报价评估、个人投资判断等场景。相比只看总回报金额，ROI 更强调收益相对于成本到底值不值得，因此是更适合横向比较的指标。",
      faq: [
        {
          question: "ROI 是什么意思？",
          answer: "ROI 是 return on investment，表示投资回报率，也就是收益相对于投入成本的比例。",
        },
        {
          question: "ROI 会是负数吗？",
          answer: "会。如果回报价值低于投入成本，ROI 就会是负值。",
        },
        {
          question: "为什么投入成本必须大于 0？",
          answer: "因为 ROI 是以投入成本为基准来计算百分比的。",
        },
      ],
    },
    "compound-interest-calculator": {
      title: "复利计算器",
      seoTitle: "复利计算器 | Kaya",
      description: "估算带每月追加投入的复利增长结果。",
      intro:
        "这个复利计算器可以根据本金、年利率、复利频率、投资年限和每月追加金额，估算未来价值、总投入和累计收益。",
      exampleHeading: "使用示例",
      explanationHeading: "复利计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一笔储蓄在 10 年后的复利增长结果。",
        "查看每月追加投入会如何改变长期资金增长。",
        "比较不同复利频率和投入方案的简单预测结果。",
      ],
      explanation:
        "复利计算器适合用来粗略估算长期储蓄或投资的增长效果。除了初始本金，它还会考虑年利率、每年复利次数、投资时长，以及可选的每月追加金额。这样你能同时看到未来总价值、实际投入本金和复利带来的收益部分。对于储蓄计划、长期投资、退休准备和预算安排来说，这比用心算去估计增长更直观，也更容易比较不同方案。",
      faq: [
        {
          question: "什么是复利？",
          answer: "复利指的是收益会继续加入本金，后续增长会同时发生在原始本金和过去收益上。",
        },
        {
          question: "每月追加投入影响大吗？",
          answer: "通常影响很大，尤其是在年限较长时，持续追加会显著放大长期结果。",
        },
        {
          question: "这是保证收益预测吗？",
          answer: "不是。它只是基于你输入参数做出的数学投影，不代表真实保证结果。",
        },
      ],
    },
    "dca-investment-calculator": {
      title: "定投成本计算器",
      seoTitle: "定投成本计算器 | Kaya",
      description: "根据多次定投价格计算平均成本、累计数量和当前市值。",
      intro:
        "这个定投成本计算器可以根据多次等额买入价格，估算累计持仓数量、平均成本、当前市值以及盈亏情况。",
      exampleHeading: "使用示例",
      explanationHeading: "定投成本计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "模拟按固定预算持续买入股票或加密资产后的平均成本。",
        "查看在下跌区间继续买入会怎样拉低持仓成本。",
        "比较总投入和当前市值之间的差异。",
      ],
      explanation:
        "定投成本计算器适合用来分析 DCA，也就是按固定金额分批买入的策略。你可以输入每次买入金额、每一轮买入价格，以及当前市场价格，工具会计算总投入、累计买到的数量、平均持仓成本、当前市值和盈亏结果。它适用于长期投资、加密资产定投、基金定投和情景推演。相比只盯着某一次买入价格，这种方式更能看清一组分批买入之后的综合成本结构。",
      faq: [
        {
          question: "DCA 是什么？",
          answer: "DCA 是 dollar-cost averaging，也就是按固定金额、固定节奏持续买入的一种常见策略。",
        },
        {
          question: "为什么按固定金额而不是固定数量？",
          answer: "因为固定金额会在价格低时自动买到更多数量，在价格高时买到更少数量，这正是定投常见的核心逻辑。",
        },
        {
          question: "这个工具能用于股票和加密资产吗？",
          answer: "可以。只要有买入价格和当前价格，这套平均成本逻辑都适用。",
        },
      ],
    },
    "simple-interest-calculator": {
      title: "单利计算器",
      seoTitle: "单利计算器 | Kaya",
      description: "计算单利、累计利息和最终总金额。",
      intro:
        "这个单利计算器可以根据本金、年利率和时间，快速计算不含复利时的利息和最终金额。",
      exampleHeading: "使用示例",
      explanationHeading: "单利计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一笔定存按单利计算 3 年后能拿到多少利息。",
        "快速查看某个简单贷款或储蓄方案的最终总金额。",
        "把单利结果和复利方案做基础对比。",
      ],
      explanation:
        "单利计算器适合用来计算只按原始本金计息的场景。输入本金、年利率和时间后，工具会给出累计利息和最终金额。它常见于基础金融教学、短期借贷、简单储蓄方案和一些不涉及利滚利的场景。相比复利，单利的增长方式更线性，也更容易理解，因此很适合用来建立最基础的利率概念，或者在需要快速估算时直接使用。",
      faq: [
        {
          question: "什么是单利？",
          answer: "单利是只按原始本金计算利息，不会把过去的利息继续加入本金再计息。",
        },
        {
          question: "它和复利有什么区别？",
          answer: "复利会把已产生的利息继续滚入本金，单利则不会，所以复利长期增长通常更快。",
        },
        {
          question: "这个工具能用于贷款和储蓄吗？",
          answer: "可以，只要该场景采用固定单利公式，这个工具就适用。",
        },
      ],
    },
    "loan-payment-calculator": {
      title: "贷款月供计算器",
      seoTitle: "贷款月供计算器 | Kaya",
      description: "估算贷款月供、总利息和总还款额。",
      intro:
        "这个贷款月供计算器可以根据贷款金额、年利率和还款年限，估算每月还款额、总还款额和总利息。",
      exampleHeading: "使用示例",
      explanationHeading: "贷款月供计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "计算一笔 5 年期个人贷款的每月还款金额。",
        "查看延长贷款期限后总利息会增加多少。",
        "在多个贷款方案之间快速比较借款成本。",
      ],
      explanation:
        "贷款月供计算器用于估算等额分期贷款的每月还款情况。输入贷款金额、年利率和还款期数后，你可以看到每月月供、总还款额和整个周期内的利息成本。它适合用于个人贷款、车贷、教育贷款等场景。很多时候只看利率本身不够，因为还款期限也会明显影响总成本。通过把月供和总利息一起展示，这个工具可以帮助你更直观地判断贷款方案是否合适。",
      faq: [
        {
          question: "什么是等额分期贷款？",
          answer: "指每期还款里同时包含本金和利息，并在整个周期内逐步把贷款余额还清。",
        },
        {
          question: "为什么期限更长月供更低？",
          answer: "因为本金被分摊到更多期数里，但总利息通常也会因此增加。",
        },
        {
          question: "零利率贷款也能算吗？",
          answer: "可以。零利率时，月供就是贷款本金除以总月数。",
        },
      ],
    },
    "mortgage-calculator": {
      title: "房贷计算器",
      seoTitle: "房贷计算器 | Kaya",
      description: "估算房贷本金、月供、总利息和总支付金额。",
      intro:
        "这个房贷计算器可以根据房价、首付、年利率和贷款年限，估算贷款本金、月供、总利息和整体支付成本。",
      exampleHeading: "使用示例",
      explanationHeading: "房贷计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算首付 20% 时购房后的每月房贷支出。",
        "比较 15 年和 30 年房贷在总利息上的差异。",
        "先看清实际贷款本金，再决定预算范围。",
      ],
      explanation:
        "房贷计算器可以帮助你在看房或做预算时，更清楚地理解真实融资成本。输入房屋总价、首付比例或金额、贷款利率和年限后，工具会计算贷款本金、每月月供、总利息以及总支付金额。相比只看房屋挂牌价，这种方式更贴近真实现金流压力。尤其是在利率或贷款年限略有变化时，总成本可能差很多，因此用计算器先做比较，会比凭感觉判断更可靠。",
      faq: [
        {
          question: "这里包含房产税和保险吗？",
          answer: "不包含。当前版本只计算本金和利息，不含税费、保险或托管费用。",
        },
        {
          question: "为什么首付越高越有利？",
          answer: "因为贷款本金会更低，通常意味着月供和总利息都会下降。",
        },
        {
          question: "能比较 15 年和 30 年房贷吗？",
          answer: "可以，直接切换贷款年限就能比较月供压力和长期总利息。",
        },
      ],
    },
    "tax-calculator": {
      title: "税额计算器",
      seoTitle: "税额计算器 | Kaya",
      description: "根据税前金额和税率计算税额与含税总价。",
      intro:
        "这个税额计算器可以根据税前金额和税率，快速算出税额以及最终含税总价。",
      exampleHeading: "使用示例",
      explanationHeading: "税额计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在结账前给商品价格加上销售税。",
        "根据发票小计和税率快速估算最终总价。",
        "对比不同税率下的最终支付金额。",
      ],
      explanation:
        "税额计算器适合处理简单的按比例加税场景。输入税前金额和税率后，工具会给出税额以及最终含税总价。它适用于购物、报价、发票核算和预算预估等日常场景。相比手工心算或反复用计算器敲百分比，这种方式更快，也更不容易出错。对于需要频繁比较多个税率或多个价格的人来说，用工具直接看结果会更高效。",
      faq: [
        {
          question: "应该输入税前金额还是税后金额？",
          answer: "当前版本要求输入税前金额，工具会在此基础上向上加税。",
        },
        {
          question: "税率可以输入小数吗？",
          answer: "可以，可以直接输入 8.25、13 或 20 这类百分比数值。",
        },
        {
          question: "它能算累进税率吗？",
          answer: "不能。这个工具只适合简单固定税率的加税场景，不适合分级税制。",
        },
      ],
    },
    "vat-calculator": {
      title: "VAT 计算器",
      seoTitle: "VAT 计算器 | Kaya",
      description: "根据未税金额和 VAT 税率计算 VAT 与含税总价。",
      intro:
        "这个 VAT 计算器可以根据未税金额和 VAT 税率，快速算出 VAT 金额以及最终含税总价。",
      exampleHeading: "使用示例",
      explanationHeading: "VAT 计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "根据未税服务费金额为发票加上 VAT。",
        "查看最终价格中有多少部分来自 VAT。",
        "比较不同 VAT 税率下的定价结果。",
      ],
      explanation:
        "VAT 计算器适合在需要增值税定价的场景里快速拆分税前金额、VAT 金额和税后总价。它对跨境业务、开票、报价、财务核对和电商定价都很有用。通过把净额和 VAT 部分分开显示，你可以更清楚地理解最终价格是怎么构成的，也更方便和客户或同事沟通含税与未税金额。对于需要频繁处理不同 VAT 税率的人来说，这比手工计算更直接。",
      faq: [
        {
          question: "VAT 是什么？",
          answer: "VAT 是 value-added tax，也就是增值税，在很多国家和地区都会用于商品和服务定价。",
        },
        {
          question: "这里应该输入未税金额还是含税金额？",
          answer: "当前版本要求输入未税金额，然后计算 VAT 和最终含税总价。",
        },
        {
          question: "VAT 和销售税完全一样吗？",
          answer: "不完全一样。两者都属于消费相关税种，但征收方式和适用体系通常不同。",
        },
      ],
    },
    "currency-converter": {
      title: "汇率换算器",
      seoTitle: "汇率换算器 | Kaya",
      description: "根据自定义汇率在两种货币之间进行换算。",
      intro:
        "这个汇率换算器可以根据你输入的自定义汇率，快速在两种货币之间换算金额，并同时展示反向汇率。",
      exampleHeading: "使用示例",
      explanationHeading: "汇率换算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "根据手头汇率把 USD 快速换算成 EUR。",
        "在报价或发票场景里，直接应用指定汇率做金额换算。",
        "顺手检查反向汇率，避免看反报价方向。",
      ],
      explanation:
        "汇率换算器适合在你已经知道某个汇率、但需要快速换算金额时使用。因为这是一个静态站点工具，所以它不依赖实时 API，而是让你直接输入想采用的汇率。这种方式反而更适合发票、财务记录、内部结算和手动报价场景，因为你往往需要用指定汇率，而不是盲目跟随实时市场报价。工具还会同时展示反向汇率，方便你核对报价方向。",
      faq: [
        {
          question: "为什么这里是手动输入汇率？",
          answer: "因为它是静态站点兼容设计，同时也让你能直接应用自己指定的汇率，而不是依赖外部实时接口。",
        },
        {
          question: "适合拿来做发票换算吗？",
          answer: "适合。尤其是在你已经有一个会计或发票汇率需要套用的时候。",
        },
        {
          question: "什么是反向汇率？",
          answer: "反向汇率就是把报价反过来看，表示 1 单位目标货币能换回多少原始货币。",
        },
      ],
    },
    "exchange-rate-history-viewer": {
      title: "历史汇率查看器",
      seoTitle: "历史汇率查看器 | Kaya",
      description: "分析手动输入的历史汇率序列，查看涨跌、均值、高低点。",
      intro:
        "这个历史汇率查看器可以根据你粘贴的汇率时间序列，快速查看首尾涨跌、平均汇率、最高点和最低点。",
      exampleHeading: "使用示例",
      explanationHeading: "历史汇率查看器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一组 USD/EUR 月度汇率，快速查看区间变化。",
        "检查某段时间内的最高汇率和最低汇率。",
        "不打开表格，直接总结一组历史汇率数据。",
      ],
      explanation:
        "历史汇率查看器适合在你已经拿到一组汇率数据时，快速做一个轻量级回顾。因为它是静态站点工具，所以不依赖外部实时 API，而是让你自己粘贴日期和汇率序列。工具会帮你总结最新值、平均汇率、最高点、最低点以及首尾涨跌幅。这对财务记录、汇率复盘、预算规划和手动分析都很实用。相比每次都开表格去写公式，这种方式更快，也更适合临时查看。",
      faq: [
        {
          question: "为什么不是直接拉实时历史汇率？",
          answer: "因为这里采用静态优先方案，手动输入既能保持页面轻量，也能让你分析任何你自己认可的数据源。",
        },
        {
          question: "应该按什么格式粘贴？",
          answer: "每行使用 日期,汇率 的格式，例如 2024-01-01,1.08。",
        },
        {
          question: "首尾变化是什么意思？",
          answer: "它表示你输入的第一条汇率和最后一条汇率之间，整体涨了还是跌了多少百分比。",
        },
      ],
    },
    "inflation-calculator": {
      title: "通胀计算器",
      seoTitle: "通胀计算器 | Kaya",
      description: "按通胀率换算未来成本并比较购买力变化。",
      intro:
        "这个通胀计算器可以根据年通胀率和时间跨度，估算未来等值成本、剩余购买力以及累计通胀幅度。",
      exampleHeading: "使用示例",
      explanationHeading: "通胀计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算今天的预算在 10 年后大概要花多少钱。",
        "查看持续通胀下，购买力会下降多少。",
        "比较不同通胀假设下的长期规划差异。",
      ],
      explanation:
        "通胀计算器适合用来理解价格上涨会怎样影响货币价值。输入当前金额、年通胀率和年数后，工具会帮你估算未来同等消费可能需要多少钱、当前金额届时还剩多少购买力，以及整体累计通胀大概有多高。它适合预算规划、退休准备、工资讨论以及基础金融教育。相比单看百分比，直接看到金额层面的变化会更容易理解。",
      faq: [
        {
          question: "什么叫未来等值成本？",
          answer: "它表示未来为了买到今天同样东西，大概需要准备多少钱。",
        },
        {
          question: "为什么购买力会下降？",
          answer: "因为通胀意味着价格上升，同样的货币数量能买到的东西会变少。",
        },
        {
          question: "可以比较不同通胀假设吗？",
          answer: "可以，直接修改年通胀率就能快速对比不同情景。",
        },
      ],
    },
    "savings-growth-calculator": {
      title: "储蓄增长计算器",
      seoTitle: "储蓄增长计算器 | Kaya",
      description: "结合每月投入和收益率预测长期储蓄增长。",
      intro:
        "这个储蓄增长计算器可以根据初始金额、每月追加和年化收益率，预测未来储蓄余额、总投入和累计增长。",
      exampleHeading: "使用示例",
      explanationHeading: "储蓄增长计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算每月持续投入 15 年后储蓄大概会增长到多少。",
        "比较提高收益率假设后，最终余额会变化多少。",
        "看清最终余额里有多少来自投入，有多少来自增长。",
      ],
      explanation:
        "储蓄增长计算器适合用来做长期储蓄或投资余额预测。你输入初始金额、每月追加金额、年化收益率和年数后，工具会计算最终余额、总投入以及增长部分。它适合储蓄规划、长期投资比较和个人财务教育。把“自己投入了多少”和“收益带来了多少”拆开看，会更容易理解长期积累的来源，也方便你比较不同投入节奏或收益率假设下的结果。",
      faq: [
        {
          question: "这里默认按月复利吗？",
          answer: "是的。当前版本会把年化收益率换算成月度增长来做滚动计算。",
        },
        {
          question: "总投入包括什么？",
          answer: "包括初始金额以及整个周期内所有每月追加的金额。",
        },
        {
          question: "为什么要分开看增长和投入？",
          answer: "因为这样更容易判断最终结果里有多少来自储蓄习惯，有多少来自收益累积。",
        },
      ],
    },
    "stock-average-price-calculator": {
      title: "股票平均成本计算器",
      seoTitle: "股票平均成本计算器 | Kaya",
      description: "根据多笔买入批次计算股票平均成本、总股数和浮动盈亏。",
      intro:
        "这个股票平均成本计算器可以合并多笔买入批次，计算平均持仓成本、总股数，并结合当前价格估算浮动盈亏。",
      exampleHeading: "使用示例",
      explanationHeading: "股票平均成本计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把多次买入同一只股票的成本合并成一个平均价。",
        "根据当前市场价格快速查看持仓浮盈或浮亏。",
        "评估继续补仓后，平均持仓成本可能怎样变化。",
      ],
      explanation:
        "股票平均成本计算器适合用来整理多次买入同一资产后的综合成本。你输入每一批的股数和买入价格后，工具会汇总总股数、总成本和平均持仓价。如果再输入当前市场价格，它还会估算当前市值以及浮动盈亏。这对股票、ETF 和长期分批建仓都很有帮助。相比手动逐笔去算，加总后再看平均成本会更直观，也更方便你判断当前持仓的整体位置。",
      faq: [
        {
          question: "什么是平均持仓成本？",
          answer: "就是总投入成本除以当前持有的总股数，表示综合之后的平均买入价。",
        },
        {
          question: "这里会自动算手续费和税吗？",
          answer: "不会，除非你自己把这些成本折算进输入价格里。当前版本不会自动加入券商费用。",
        },
        {
          question: "不填当前价格也能用吗？",
          answer: "可以。不填当前价格时，工具仍然能算出平均成本，只是不会给出浮动盈亏。",
        },
      ],
    },
    "net-profit-margin-calculator": {
      title: "净利润率计算器",
      seoTitle: "净利润率计算器 | Kaya",
      description: "根据营收和支出计算净利润与净利率。",
      intro:
        "这个净利润率计算器可以根据营收和总支出，快速算出净利润金额以及净利润率百分比。",
      exampleHeading: "使用示例",
      explanationHeading: "净利润率计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "根据营收和支出计算某项业务剩下多少净利润。",
        "快速估算一个产品线或服务业务的净利率。",
        "比较不同时间段或不同业务之间的盈利效率。",
      ],
      explanation:
        "净利润率计算器适合用来衡量业务在扣除支出后，最终还留下多少利润。输入营收和支出后，工具会同时给出净利润金额和净利率百分比。它适合商业规划、创业看板、小型财务分析和快速单位经济性判断。相比只看绝对利润，利润率更适合跨时间和跨业务做比较，因此把两者一起看会更有判断价值。",
      faq: [
        {
          question: "什么是净利润率？",
          answer: "它表示营收中最终留下多少比例作为净利润。",
        },
        {
          question: "净利率会是负数吗？",
          answer: "会。如果支出高于营收，净利润和净利率都会变成负值。",
        },
        {
          question: "为什么既要看利润也要看利润率？",
          answer: "因为利润反映绝对结果，而利润率更能反映相对效率。",
        },
      ],
    },
    "break-even-calculator": {
      title: "盈亏平衡计算器",
      seoTitle: "盈亏平衡计算器 | Kaya",
      description: "根据固定成本和单位成本结构计算盈亏平衡点。",
      intro:
        "这个盈亏平衡计算器可以根据固定成本、单价和单位变动成本，估算达到盈亏平衡所需的销量、单位贡献利润和对应营收。",
      exampleHeading: "使用示例",
      explanationHeading: "盈亏平衡计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算产品至少要卖出多少件才能不亏不赚。",
        "检查单位贡献利润是否足够覆盖固定成本。",
        "比较不同定价方案下盈亏平衡点的变化。",
      ],
      explanation:
        "盈亏平衡计算器适合用来判断业务要卖到什么程度，才能刚好覆盖成本。输入固定成本、单位售价和单位变动成本后，工具会给出盈亏平衡销量、单位贡献利润以及对应营收。它很适合产品定价、商业规划、小企业预算和基础财务建模。通过这个工具，你可以更清楚地理解价格和成本结构之间的关系，从而判断当前商业模型是否有足够的空间去覆盖固定投入并实现增长。",
      faq: [
        {
          question: "什么是盈亏平衡点？",
          answer: "它表示总营收刚好覆盖总成本，既不盈利也不亏损的那个点。",
        },
        {
          question: "什么是单位贡献利润？",
          answer: "就是单价减去单位变动成本之后，每卖出一件能留下多少去覆盖固定成本。",
        },
        {
          question: "为什么单价必须高于单位变动成本？",
          answer: "因为如果每卖一件都连自身直接成本都覆盖不了，就无法实现盈亏平衡。",
        },
      ],
    },
    "evm-address-checker": {
      title: "EVM 地址校验工具",
      seoTitle: "EVM 地址校验工具 | Kaya",
      description: "校验 Ethereum / EVM 地址格式，以及 checksum 是否正确。",
      intro:
        "这个 EVM 地址校验工具可以检查 Ethereum 兼容地址是否有效，并同时展示其小写归一化结果和 EIP-55 checksum 状态。",
      exampleHeading: "使用示例",
      explanationHeading: "EVM 地址校验工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一个钱包地址是否是合法的 EVM 十六进制地址。",
        "验证一个混合大小写地址是否符合 EIP-55 checksum 规则。",
        "在前端存储或比较地址前先做归一化检查。",
      ],
      explanation:
        "EVM 地址校验工具适合在发送资产、处理用户输入或解析链上数据之前，先确认地址是否合法。它会检查地址格式是否正确、是否可以规范化，以及混合大小写形式是否符合 EIP-55 checksum 标准。checksum 的意义在于，它可以帮助识别部分输入错误，而纯小写地址做不到这一点。对于钱包、管理后台、合约运维面板、allowlist 系统，以及任何需要用户手工粘贴地址的应用来说，这一步都很有价值。",
      faq: [
        {
          question: "什么是 EVM 地址？",
          answer: "它是 Ethereum 及其他 EVM 兼容链上使用的 20 字节十六进制地址。",
        },
        {
          question: "这里的 checksum 是什么？",
          answer: "这里指 EIP-55 checksum，通过字母大小写模式帮助识别部分地址输入错误。",
        },
        {
          question: "全小写地址一定无效吗？",
          answer: "不一定。它可能仍然是有效地址，只是没有携带 checksum 信息。",
        },
      ],
    },
    "evm-checksum-converter": {
      title: "EVM Checksum 转换工具",
      seoTitle: "EVM Checksum 转换工具 | Kaya",
      description: "把 Ethereum / EVM 地址转换为 EIP-55 checksum 格式。",
      intro:
        "这个 EVM checksum 转换工具可以把普通小写地址快速转换为标准的 EIP-55 checksum 地址格式。",
      exampleHeading: "使用示例",
      explanationHeading: "EVM Checksum 转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一个全小写地址转换成适合展示的 checksum 格式。",
        "为后台面板、白名单或钱包列表统一地址格式。",
        "快速对比同一地址的小写版本和 checksum 版本。",
      ],
      explanation:
        "EVM checksum 转换工具会把一个合法的 Ethereum 兼容地址，重新输出为 EIP-55 标准大小写格式。这个格式是钱包、浏览器和很多开发工具里最常见的展示形式，也更容易在视觉上发现输入错误。对于做钱包、数据面板、合约管理工具或内部后台的人来说，把地址先转成 checksum 再展示，是一个更稳妥的默认做法。这个工具可以在浏览器里即时完成转换，不需要额外脚本。",
      faq: [
        {
          question: "它使用什么标准？",
          answer: "它使用 Ethereum 生态最常见的 EIP-55 checksum 标准。",
        },
        {
          question: "已经是 checksum 地址还可以再转吗？",
          answer: "可以。如果输入已经是标准 checksum 格式，输出会保持一致。",
        },
        {
          question: "checksum 会改变真实地址吗？",
          answer: "不会。它只改变字母大小写，不会改变底层地址本身。",
        },
      ],
    },
    "token-decimals-converter": {
      title: "Token Decimals 转换工具",
      seoTitle: "Token Decimals 转换工具 | Kaya",
      description: "根据 token decimals 在显示金额和链上原始整数值之间转换。",
      intro:
        "这个 token decimals 转换工具可以根据代币 decimals，在用户看到的显示金额和链上实际使用的原始整数值之间来回换算。",
      exampleHeading: "使用示例",
      explanationHeading: "Token Decimals 转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 1.5 个 USDC 转成 6 decimals 下的链上原始值。",
        "把 ERC-20 原始余额格式化成可读的代币数量。",
        "在构造转账或报价逻辑前先检查 token 数学是否正确。",
      ],
      explanation:
        "Token decimals 转换工具适合处理前端显示金额和链上整数值之间的切换。ERC-20 这类代币在合约里通常存储为整数，而钱包和应用界面会按 decimals 展示为带小数的人类可读金额。输入显示金额和 decimals 后，你可以得到调用合约时真正需要的原始整数值；输入原始整数值后，也可以把它还原成可读余额。这个工具对于做转账、报价、余额展示、调试接口返回和检查前端单位换算都非常实用。",
      faq: [
        {
          question: "为什么 token 要有 decimals？",
          answer: "因为合约内部通常只存整数，decimals 用来告诉前端应该把这个整数如何显示成带小数的金额。",
        },
        {
          question: "是不是所有 token 都是 18 位？",
          answer: "不是。很多 token 是 18 位，但像 USDC 这类常见 token 只有 6 位，所以必须按真实 decimals 处理。",
        },
        {
          question: "这个工具适合准备合约参数吗？",
          answer: "适合。输出的原始整数值就是你在很多合约调用里真正需要传入的数量。",
        },
      ],
    },
    "wei-eth-converter": {
      title: "Wei ETH 转换工具",
      seoTitle: "Wei ETH 转换工具 | Kaya",
      description: "在 wei、gwei 和 ETH 之间即时换算金额。",
      intro:
        "这个 wei ETH 转换工具可以在 wei、gwei 和 ETH 之间快速换算，适合 gas、余额和交易参数处理。",
      exampleHeading: "使用示例",
      explanationHeading: "Wei ETH 转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 1000000000000000000 wei 转成 1 ETH。",
        "查看一个 gwei gas price 对应多少 wei 或 ETH。",
        "把 RPC 返回的原始余额值格式化成可读 ETH。",
      ],
      explanation:
        "Wei ETH 转换工具适合任何涉及 Ethereum 余额或 gas 数值的场景。链上系统通常使用 wei 作为最小单位，而用户更常用 ETH 或 gwei 来理解金额。这个工具允许你以 wei、gwei 或 ETH 为输入，并即时看到其他两个单位的等价结果。它很适合钱包界面、合约测试、gas 估算、交易预览以及 RPC 数据调试。相比手动数 0 或自己换算单位，这种方式更快，也更不容易出错。",
      faq: [
        {
          question: "什么是 wei？",
          answer: "Wei 是 ETH 的最小单位，1 ETH 等于 1,000,000,000,000,000,000 wei。",
        },
        {
          question: "gwei 一般用来做什么？",
          answer: "Gwei 最常见的用途是表示 gas price，1 gwei 等于 1,000,000,000 wei。",
        },
        {
          question: "可以输入带小数的 ETH 吗？",
          answer: "可以，工具支持解析带小数的 ETH 或 gwei，并换算为 wei。",
        },
      ],
    },
    "gas-fee-calculator": {
      title: "Gas 手续费计算器",
      seoTitle: "Gas 手续费计算器 | Kaya",
      description: "根据 gas limit 和 gas price 计算 EVM 交易总手续费。",
      intro:
        "这个 gas 手续费计算器可以根据 gas limit 和 gas price，快速估算 EVM 交易总成本，并同时输出 wei、gwei 和 ETH。",
      exampleHeading: "使用示例",
      explanationHeading: "Gas 手续费计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "用 21000 gas 估算一笔普通 ETH 转账的手续费。",
        "比较不同 gas price 对总交易成本的影响。",
        "在交易预览里把 gas 结果直接换算成 ETH 展示。",
      ],
      explanation:
        "Gas 手续费计算器适合在发送交易前快速估算一笔 EVM 操作的成本。你输入 gas limit 和 gas price 后，工具会把它们相乘，并同时输出 wei、gwei 和 ETH 三种单位下的结果。它适合钱包界面、合约交互预览、gas 调试、区块浏览器数据核对，以及前端交易流程开发。相比手工数 0 或脑内换算单位，这种方式更直观，也更不容易因为单位错误而导致判断偏差。",
      faq: [
        {
          question: "什么是 gas limit？",
          answer: "Gas limit 是一笔交易最多允许消耗的 gas 数量。",
        },
        {
          question: "什么是 gas price？",
          answer: "Gas price 是每单位 gas 的价格，通常以 gwei 表示。",
        },
        {
          question: "这个工具会自动估算 gas 吗？",
          answer: "不会。它只根据你输入的值计算总成本，gas limit 仍然需要来自钱包、节点或你自己的逻辑估算。",
        },
      ],
    },
    "transaction-decoder": {
      title: "交易解码工具",
      seoTitle: "交易解码工具 | Kaya",
      description: "把原始签名 EVM 交易即时解码为可读字段。",
      intro:
        "这个交易解码工具可以把原始签名的 Ethereum 交易 hex 解析为 nonce、gas、收款地址、金额、签名等可读字段。",
      exampleHeading: "使用示例",
      explanationHeading: "交易解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "解码一个从钱包或脚本复制出来的原始交易 hex。",
        "在广播前检查一笔 EIP-1559 交易的 fee 字段。",
        "调试签名流程时对比不同环境生成的交易内容。",
      ],
      explanation:
        "交易解码工具适合在不发送交易的前提下，先检查一笔原始签名 EVM 交易里到底包含了什么。你输入原始交易 hex 后，工具会尝试解析 nonce、to、value、gas limit、fee 配置、签名字段以及哈希相关信息。这对钱包接入、交易构造器调试、脚本输出核对、RPC 数据排查都非常有帮助。相比直接面对一长串原始 hex，这种方式能更快确认真正编码进去的内容是否符合预期。",
      faq: [
        {
          question: "这个工具会广播交易吗？",
          answer: "不会。它只会在浏览器里本地解析原始交易内容，不会发送到链上。",
        },
        {
          question: "它支持 EIP-1559 交易吗？",
          answer: "支持。如果交易本身包含 maxFeePerGas 和 maxPriorityFeePerGas，这些字段会被解析出来。",
        },
        {
          question: "一定要输入已签名交易吗？",
          answer: "最常见场景是已签名原始交易，因为这样能同时看到完整 payload 和签名信息。",
        },
      ],
    },
    "calldata-decoder": {
      title: "Calldata 解码工具",
      seoTitle: "Calldata 解码工具 | Kaya",
      description: "根据提供的函数片段解码 EVM calldata。",
      intro:
        "这个 calldata 解码工具可以结合 Solidity 函数片段，解析 EVM 交易输入数据里的 selector、函数名和参数值。",
      exampleHeading: "使用示例",
      explanationHeading: "Calldata 解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "用 transfer 函数签名解码一段 ERC-20 transfer calldata。",
        "查看一段交易 input 里真正传入了哪些参数。",
        "检查前端构造的 calldata 是否和预期函数及参数一致。",
      ],
      explanation:
        "Calldata 解码工具适合在你已经知道或高度怀疑某段 input data 对应哪个函数时使用。你输入 Solidity 函数片段和 calldata 后，工具会按 ABI 规则解析函数 selector 和参数值。它很适合合约调试、审计检查、交易预览以及前端和脚本输出的对比。相比直接盯着长 hex 字符串，这种方式能更快看出参数顺序、类型和具体值是否有问题。",
      faq: [
        {
          question: "一定要提供精确的函数片段吗？",
          answer: "是的。Calldata 解码依赖正确的 Solidity 函数定义，函数签名不对就无法正确解释参数。",
        },
        {
          question: "这个工具会自动猜 ABI 吗？",
          answer: "不会。它不会自动猜测函数定义，需要你自己提供对应的函数片段。",
        },
        {
          question: "输出里会包含 selector 吗？",
          answer: "会。结果里会同时显示 selector 信息和解码后的参数。",
        },
      ],
    },
    "event-log-decoder": {
      title: "事件日志解码工具",
      seoTitle: "事件日志解码工具 | Kaya",
      description: "根据事件片段、topics 和 data 解码 EVM 日志。",
      intro:
        "这个事件日志解码工具可以结合 Solidity 事件片段，对 Ethereum 的 topics 和 data 做解码并还原事件参数。",
      exampleHeading: "使用示例",
      explanationHeading: "事件日志解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 ERC-20 Transfer 事件的 topics 和 data 解码为可读值。",
        "调试日志时区分 indexed 和非 indexed 事件参数。",
        "检查合约事件是否真的发出了前端预期的数值。",
      ],
      explanation:
        "事件日志解码工具适合在你已经知道事件定义的前提下，查看一条 Ethereum log 里真实记录了什么。你输入 Solidity 事件片段、topics 和 data 后，工具会把事件参数还原为可读结果。它对区块浏览器日志检查、链上监控、前端日志调试和合约审计都很有帮助。由于 Ethereum 事件把 indexed 参数放在 topics、其余参数放在 data 中，手工解析很容易出错，用工具直接查看会快很多。",
      faq: [
        {
          question: "Ethereum 日志里的 topics 是什么？",
          answer: "Topics 是定长字段，用来存放事件签名以及被标记为 indexed 的事件参数。",
        },
        {
          question: "为什么一定要有精确事件片段？",
          answer: "因为事件解码依赖正确的参数顺序、类型和 indexed 配置，定义不对就无法准确还原。",
        },
        {
          question: "能同时解码 indexed 和非 indexed 参数吗？",
          answer: "可以。只要事件片段匹配，工具会结合 topics 和 data 一起还原完整参数。",
        },
      ],
    },
    "abi-encode-tool": {
      title: "ABI 编码工具",
      seoTitle: "ABI 编码工具 | Kaya",
      description: "把 Solidity 类型和值即时 ABI 编码为 hex 结果。",
      intro:
        "这个 ABI 编码工具可以根据你输入的 Solidity 类型和值，在浏览器里直接生成对应的 ABI 编码 hex 结果。",
      exampleHeading: "使用示例",
      explanationHeading: "ABI 编码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 address 和 uint256 编码后再交给合约辅助逻辑使用。",
        "在调试前端交易构造器时，快速生成一段示例 ABI payload。",
        "先检查类型和值是否匹配，再继续拼接 calldata。",
      ],
      explanation:
        "ABI 编码工具会把 Solidity 类型和值转换成 EVM 实际使用的二进制兼容 hex 表示。它很适合在手工构造参数、调试合约集成、核对脚本输出，或者理解前端输入最终如何变成链上字节时使用。你输入一组 ABI 类型，以及顺序对应的 JSON 数组参数值后，工具会立即给出编码结果。对于需要处理低层合约交互的人来说，这能显著减少编码步骤里的试错成本。",
      faq: [
        {
          question: "ABI 是什么意思？",
          answer: "ABI 是 Application Binary Interface，Ethereum 合约用它来约定输入输出如何编码和解码。",
        },
        {
          question: "为什么参数值要用 JSON 数组输入？",
          answer: "因为编码器需要一组有顺序的参数值，并且要和同顺序的类型列表逐项对应。",
        },
        {
          question: "它等于完整的函数调用数据吗？",
          answer: "不完全等于。这个工具编码的是参数部分，完整 calldata 还需要再拼上 4 字节函数选择器。",
        },
      ],
    },
    "abi-decode-tool": {
      title: "ABI 解码工具",
      seoTitle: "ABI 解码工具 | Kaya",
      description: "在浏览器中把 ABI 编码的 hex 数据解码为 Solidity 值。",
      intro:
        "这个 ABI 解码工具可以根据你提供的 Solidity 类型，把 ABI 编码的 hex 数据解码为可读结果。",
      exampleHeading: "使用示例",
      explanationHeading: "ABI 解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "根据已知输出类型解码一次合约调用的返回数据。",
        "在调试前端时查看一段存储 payload 或编码结果的真实内容。",
        "把一段 ABI hex 数据还原为可读值，方便对比和排查。",
      ],
      explanation:
        "ABI 解码工具会把一段 EVM hex 数据按你指定的 Solidity 类型重新解释成可读值。它很适合查看合约返回数据、调试编码参数、核对脚本输出，或者解析某些已经拿到类型信息的链上 payload。相比直接面对一长串 hex，这种方式可以把地址、整数、字符串、数组等值重新还原出来，让问题定位更快。对于前端开发者和合约工程师来说，这是很常用的低层调试步骤。",
      faq: [
        {
          question: "解码时一定要有精确类型吗？",
          answer: "是的。ABI 解码依赖正确且有顺序的 Solidity 类型列表，类型不对就无法正确解释数据。",
        },
        {
          question: "它适合解码合约返回值吗？",
          answer: "适合。只要你知道返回值类型，就可以用它快速查看解码结果。",
        },
        {
          question: "为什么大整数会显示成字符串？",
          answer: "因为很多 EVM 整数超出 JavaScript 安全数字范围，用字符串能完整保留数值精度。",
        },
      ],
    },
    "keccak256-hash-generator": {
      title: "Keccak256 哈希生成器",
      seoTitle: "Keccak256 哈希生成器 | Kaya",
      description: "在浏览器中对文本或 hex 输入生成 Keccak-256 哈希。",
      intro:
        "这个 Keccak256 哈希生成器可以对普通文本或原始 hex 字节做哈希，适合以太坊函数选择器、签名和合约开发调试场景。",
      exampleHeading: "使用示例",
      explanationHeading: "Keccak256 哈希生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "对函数签名字符串做哈希，再继续推导 method selector。",
        "为合约开发或测试生成一段文本的 Keccak-256 哈希。",
        "在低层调试时对原始 hex 字节做哈希，而不是按 UTF-8 文本处理。",
      ],
      explanation:
        "Keccak256 哈希生成器是 Ethereum 开发里非常核心的基础工具，因为 EVM 在很多地方都会用到 Keccak-256。函数选择器、事件 topic、签名流程、checksum 规则等都和它有关。这个工具支持直接对普通文本或原始 hex 字节进行哈希，适合在调试 calldata、检查签名、推导 selector，或者对比脚本与合约输出时使用。对于前端工程师和合约开发者来说，浏览器里随手可用的 Keccak 工具能显著提升低层调试效率。",
      faq: [
        {
          question: "Keccak-256 和 SHA3-256 一样吗？",
          answer: "两者非常接近，但并不完全相同。Ethereum 使用的是 Keccak-256。",
        },
        {
          question: "什么时候该哈希文本，什么时候该哈希 hex 字节？",
          answer: "当你要处理 UTF-8 字符串本身时哈希文本；当你已经拿到编码后的原始字节时，应哈希 hex 字节。",
        },
        {
          question: "它为什么对 Ethereum 开发很重要？",
          answer: "因为 selector、topic、checksum、签名等很多 EVM 工作流都依赖这类哈希结果。",
        },
      ],
    },
    "signature-verifier": {
      title: "签名校验工具",
      seoTitle: "签名校验工具 | Kaya",
      description: "验证消息签名是否匹配预期的 EVM 地址。",
      intro:
        "这个签名校验工具可以检查一条 EIP-191 personal-sign 风格的消息签名，是否确实来自你预期的 Ethereum 地址。",
      exampleHeading: "使用示例",
      explanationHeading: "签名校验工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查用户登录消息签名是否真的来自他声称的钱包地址。",
        "在接受某个链下签名动作前先做本地验证。",
        "在浏览器里比对恢复出的签名地址和预期地址。",
      ],
      explanation:
        "签名校验工具适合处理基于钱包签名的登录、授权和链下确认场景。你输入原始消息、签名以及预期地址后，工具会恢复出真正的签名地址，并判断它是否匹配。它很适合调试钱包集成、验证消息流程、检查链下授权，以及排查前端签名逻辑问题。因为整个过程完全在浏览器里完成，所以非常适合快速确认 personal-sign 风格的消息签名是否正确。",
      faq: [
        {
          question: "这个工具校验哪一类签名？",
          answer: "它校验的是 EIP-191 personal-sign 风格的消息签名。",
        },
        {
          question: "为什么一定要有原始消息？",
          answer: "因为签名校验依赖完整且完全一致的原始消息内容，哪怕多一个空格都可能导致结果不同。",
        },
        {
          question: "签名明明有效，为什么还会校验失败？",
          answer: "常见原因包括消息内容变了、预期地址不对，或者签名其实来自另一种签名方案。",
        },
      ],
    },
    "recover-address-from-signature": {
      title: "签名恢复地址工具",
      seoTitle: "签名恢复地址工具 | Kaya",
      description: "根据消息和 EVM 签名恢复出签名地址。",
      intro:
        "这个签名恢复地址工具可以根据原始消息和 personal-sign 风格的 EVM 签名，直接恢复出对应的 Ethereum 地址。",
      exampleHeading: "使用示例",
      explanationHeading: "签名恢复地址工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从一个钱包登录签名中恢复出真正的签名地址。",
        "在应用逻辑比较前，先单独查看签名到底是谁发出的。",
        "调试签名流程时，不用再额外写一个临时脚本来恢复地址。",
      ],
      explanation:
        "签名恢复地址工具会根据原始消息和对应的 EVM 签名，直接在浏览器里恢复出签名地址。它适合在做登录、授权、签名确认或钱包调试时，先独立确认这段签名到底来自哪个地址。相比一开始就直接写业务校验逻辑，先恢复地址能帮助你更快定位问题，比如消息是否一致、签名是否正确、或者钱包返回的数据格式是否符合预期。这对于调试 Web3 前端交互非常实用。",
      faq: [
        {
          question: "恢复出地址就代表这个地址可信任吗？",
          answer: "不代表。它只说明这个地址生成了签名，是否信任仍然要由你的应用逻辑决定。",
        },
        {
          question: "它支持什么签名格式？",
          answer: "当前版本针对的是 personal-sign 风格的 EIP-191 消息签名。",
        },
        {
          question: "如果我还没有预期地址，也能用吗？",
          answer: "可以。这正是这个工具的价值：先恢复出地址，再决定后续如何比较或处理。",
        },
      ],
    },
    "btc-address-validator": {
      title: "BTC 地址校验工具",
      seoTitle: "BTC 地址校验工具 | Kaya",
      description: "在浏览器中校验 Bitcoin 的 base58 和 bech32 地址。",
      intro:
        "这个 BTC 地址校验工具可以检查 Bitcoin 地址是否有效，并识别它使用的是 base58、bech32 还是 bech32m 格式。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 地址校验工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在支付流程里先校验一个主网或测试网 Bitcoin 地址。",
        "判断一个地址属于 legacy base58 还是 segwit bech32 格式。",
        "调试钱包或交易所输入框时查看地址识别出的网络。",
      ],
      explanation:
        "BTC 地址校验工具适合在真正使用地址前，先确认它在结构上是否合法。它会检查常见的 Bitcoin 地址格式，包括 legacy base58、bech32 和 bech32m，并尽量识别主网、测试网或其他网络。对于钱包界面、支付表单、交易所提币页以及内部工具来说，这比简单写一个正则更可靠。因为 Bitcoin 的地址编码有多种形式，直接在浏览器里做格式与校验和验证，会更适合作为前端第一层检查。",
      faq: [
        {
          question: "这个工具支持哪些地址格式？",
          answer: "它支持常见的 Bitcoin 地址格式，包括 base58、bech32 和 bech32m。",
        },
        {
          question: "它能区分主网和测试网吗？",
          answer: "可以。它会根据地址前缀和编码特征识别大致网络类型。",
        },
        {
          question: "格式有效就代表地址一定有人在用吗？",
          answer: "不代表。它只能说明地址结构和校验和有效，不能说明地址是否有历史活动。",
        },
      ],
    },
    "btc-satoshi-converter": {
      title: "BTC Satoshi 转换工具",
      seoTitle: "BTC Satoshi 转换工具 | Kaya",
      description: "在 BTC 金额和 satoshi 之间即时换算。",
      intro:
        "这个 BTC satoshi 转换工具可以在用户可读的 BTC 金额和底层使用的 satoshi 整数值之间快速换算。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC Satoshi 转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 0.001 BTC 转成 satoshi 后再用于支付或交易参数。",
        "把 API 返回的 satoshi 余额转换成前端展示用的 BTC。",
        "不手动移动 8 位小数，直接检查 Bitcoin 金额换算。",
      ],
      explanation:
        "BTC satoshi 转换工具适合处理 Bitcoin 金额展示值和底层整数值之间的切换。Bitcoin 固定使用 8 位小数，所以前端常常需要把 BTC 显示金额转换为 satoshi，再用于存储、比较或交易构造；反过来，很多接口和钱包底层又会返回 satoshi，需要你把它换算回 BTC 才适合展示。这个工具支持双向转换，非常适合钱包界面、支付工具、交易表单和金额调试场景。",
      faq: [
        {
          question: "1 BTC 等于多少 satoshi？",
          answer: "1 BTC 等于 100,000,000 satoshi。",
        },
        {
          question: "可以输入带小数的 BTC 吗？",
          answer: "可以，当前工具支持最多 8 位小数的 BTC 输入。",
        },
        {
          question: "为什么很多接口更喜欢返回 satoshi？",
          answer: "因为整数值更适合底层计算和存储，可以避免浮点精度问题。",
        },
      ],
    },
    "btc-transaction-decoder": {
      title: "BTC 交易解码工具",
      seoTitle: "BTC 交易解码工具 | Kaya",
      description: "把原始 Bitcoin 交易即时解码为摘要字段。",
      intro:
        "这个 BTC 交易解码工具可以解析原始 Bitcoin 交易，并展示 txid、版本、是否带 witness、大小、权重和输出总额等摘要信息。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 交易解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "解码一个从钱包或区块浏览器复制出来的 Bitcoin 原始交易。",
        "检查一笔交易是否使用了 witness，以及它的大小有多大。",
        "在进入更细的输入输出调试前，先看交易摘要信息。",
      ],
      explanation:
        "BTC 交易解码工具适合在不手工解析每个字段的前提下，先快速查看一笔原始 Bitcoin 交易的核心摘要。输入交易 hex 后，工具会展示交易 ID、版本、locktime、是否包含 witness、字节大小、虚拟大小、权重以及输出总额等信息。它很适合钱包调试、API 返回核对、手续费判断和交易结构快速检查。相比一开始就看完整输入输出明细，这类摘要视图更适合做第一步排查。",
      faq: [
        {
          question: "这个工具会广播交易吗？",
          answer: "不会。它只会在浏览器里本地解析原始交易，不会提交到网络。",
        },
        {
          question: "它能识别 segwit 交易吗？",
          answer: "能。它会显示是否带有 witness 数据，并给出大小和权重相关信息。",
        },
        {
          question: "它和原始交易解析器有什么区别？",
          answer: "这个工具更偏摘要视图，而原始交易解析器会展示更详细的输入、输出、脚本和 witness 结构。",
        },
      ],
    },
    "btc-raw-transaction-parser": {
      title: "BTC 原始交易解析器",
      seoTitle: "BTC 原始交易解析器 | Kaya",
      description: "把 Bitcoin 原始交易解析为输入输出等详细结构。",
      intro:
        "这个 BTC 原始交易解析器可以把 Bitcoin 交易拆解为输入、输出、脚本字段、witness 数据以及可识别的输出地址。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 原始交易解析器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "查看一笔 Bitcoin 原始交易里的每个输入和输出明细。",
        "调试 scriptSig、witness 和 scriptPubKey 时直接检查真实内容。",
        "判断某个输出脚本是否能映射成标准 Bitcoin 地址。",
      ],
      explanation:
        "BTC 原始交易解析器会把一笔 Bitcoin 交易逐层拆开，让你看到每个输入和输出的细节。它会展示前序输出引用、sequence、scriptSig、witness、输出金额、scriptPubKey 以及在可能情况下解析出的地址。这对于 PSBT 调试、钱包开发、支付工具、低层交易分析和脚本核对都非常有帮助。当你已经不满足于摘要信息，而需要真正知道一笔交易里每个字段是什么时，这个工具就很有价值。",
      faq: [
        {
          question: "输入和输出分别是什么？",
          answer: "输入负责花费过去的 UTXO，输出则定义当前交易新生成的金额和锁定脚本。",
        },
        {
          question: "它能显示 witness 数据吗？",
          answer: "能。对于 segwit 交易，工具会把 witness 栈内容一并展示出来。",
        },
        {
          question: "所有输出脚本都一定能转成地址吗？",
          answer: "不一定。标准脚本通常可以，但一些非标准或自定义脚本不一定能映射成常见地址格式。",
        },
      ],
    },
    "btc-fee-calculator": {
      title: "BTC 手续费计算器",
      seoTitle: "BTC 手续费计算器 | Kaya",
      description: "根据输入输出总额计算 Bitcoin 手续费和费率。",
      intro:
        "这个 BTC 手续费计算器可以根据输入总额和输出总额计算交易手续费，并在提供 vsize 时继续算出 sat/vB 费率。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 手续费计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "用输入总额减输出总额，确认一笔 Bitcoin 交易实际支付了多少手续费。",
        "在知道虚拟大小时进一步算出 sat/vB 费率。",
        "检查一笔交易是手续费偏高还是偏低。",
      ],
      explanation:
        "BTC 手续费计算器适合用来快速核对一笔 Bitcoin 交易的手续费。它会用输入总额减去输出总额，得到手续费；如果你还知道交易的虚拟大小，它也会继续换算出 sat/vB 费率。这个工具很适合钱包手续费逻辑调试、提现记录复盘、历史交易分析和广播前的费用判断。相比手动把多个金额和大小值放到计算器里反复试算，这种方式更直接。",
      faq: [
        {
          question: "Bitcoin 手续费是怎么计算的？",
          answer: "就是输入总额减去输出总额，差值即为矿工费。",
        },
        {
          question: "sat/vB 是什么？",
          answer: "它表示每个 virtual byte 支付多少 satoshi，是 Bitcoin 最常见的费率单位。",
        },
        {
          question: "只想看总手续费，还需要交易大小吗？",
          answer: "不需要。只有你还想看费率时，才需要填写虚拟大小。",
        },
      ],
    },
    "btc-fee-estimator": {
      title: "BTC 手续费估算器",
      seoTitle: "BTC 手续费估算器 | Kaya",
      description: "根据虚拟大小和目标 sat/vB 费率估算 Bitcoin 手续费。",
      intro:
        "这个 BTC 手续费估算器可以根据交易虚拟大小和目标 sat/vB 费率，快速估算一笔 Bitcoin 交易的大致手续费。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 手续费估算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一笔 141 vbytes 交易在 12.5 sat/vB 下需要多少手续费。",
        "比较更高费率会把总手续费抬高到什么程度。",
        "把大小估算结果快速换算成 BTC 形式的费用预览。",
      ],
      explanation:
        "BTC 手续费估算器适合在交易还没最终构造出来之前，先粗略估算费用。只要你已经有大致的交易虚拟大小，以及想使用的 sat/vB 费率，工具就会帮你算出预期的 satoshi 手续费和 BTC 数值。它很适合钱包预览、费率比较、交易构造调试和广播前的成本评估。这个工具和交易大小计算器搭配使用效果尤其好，先估大小，再估费用，逻辑会更清晰。",
      faq: [
        {
          question: "sat/vB 是什么？",
          answer: "它表示每个 virtual byte 支付多少 satoshi，是 Bitcoin 最常见的手续费费率单位。",
        },
        {
          question: "一定要有精确大小吗？",
          answer: "不一定。做规划时大小估算通常就够用了，不过最终真实手续费还是取决于最后构造出的交易大小。",
        },
        {
          question: "它和手续费计算器有什么区别？",
          answer: "估算器是从大小和目标费率出发推算费用；手续费计算器则更适合从已知输入输出总额回算真实费用。",
        },
      ],
    },
    "btc-script-decoder": {
      title: "BTC 脚本解码工具",
      seoTitle: "BTC 脚本解码工具 | Kaya",
      description: "把 Bitcoin 脚本 hex 解码为 ASM 操作码和数据片段。",
      intro:
        "这个 BTC 脚本解码工具可以把 Bitcoin 的锁定脚本或解锁脚本 hex 转成 ASM 形式，并拆分出具体操作码和压栈数据。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 脚本解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把标准 P2PKH scriptPubKey 解码成更容易阅读的 ASM 形式。",
        "查看脚本里到底包含了哪些操作码和压栈数据。",
        "把交易解析器里的脚本 hex 进一步转成可读表示。",
      ],
      explanation:
        "BTC 脚本解码工具适合在你拿到一段 Bitcoin 脚本 hex 后，快速弄清它的结构。工具会把脚本转成 ASM 风格的可读格式，并把里面的 opcode 和数据压栈内容逐项列出来。它非常适合交易调试、脚本学习、钱包开发和低层 Bitcoin 分析。因为脚本决定了 UTXO 的花费条件，能快速把原始脚本看懂，会大幅提升你理解输入输出逻辑的效率。",
      faq: [
        {
          question: "它能解码哪些脚本？",
          answer: "只要是合法的 Bitcoin 脚本字节序列，它都可以还原成 opcode 和数据压栈结构，包括常见标准模板。",
        },
        {
          question: "这里的 ASM 是什么意思？",
          answer: "ASM 是一种可读脚本表示方式，会把原始 hex 翻译成操作码和数据，而不是只给你字节串。",
        },
        {
          question: "解码后就能知道脚本一定可花费吗？",
          answer: "不能。它只能展示脚本结构，是否可花费还取决于完整的 Bitcoin 脚本规则和解锁数据。",
        },
      ],
    },
    "btc-transaction-size-calculator": {
      title: "BTC 交易大小计算器",
      seoTitle: "BTC 交易大小计算器 | Kaya",
      description: "估算 Bitcoin 交易大小、vbytes 和权重单位。",
      intro:
        "这个 BTC 交易大小计算器可以根据常见输入输出脚本类型和数量，估算交易大小、vbytes 和权重单位。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 交易大小计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一笔 1 输入 2 输出的 segwit 交易大小。",
        "比较不同输入类型对 virtual size 的影响。",
        "在确定目标费率前先估算大概 vbytes。",
      ],
      explanation:
        "BTC 交易大小计算器适合在还没真正构造交易之前，先估算一笔 Bitcoin 交易大概会有多大。因为 Bitcoin 手续费通常按 virtual byte 计价，所以输入输出脚本类型和数量会直接影响成本。通过选择常见类型如 P2PKH、P2WPKH、嵌套 segwit 或 Taproot，再填写输入输出数量，你就能得到大致的 bytes、vbytes 和 weight 结果。它非常适合钱包界面、交易预览、手续费规划和成本比较。",
      faq: [
        {
          question: "什么是 vbyte？",
          answer: "Vbyte 是由权重换算出来的大小单位，也是 Bitcoin 最常见的手续费计价单位。",
        },
        {
          question: "为什么 segwit 交易的 vbytes 往往更低？",
          answer: "因为 witness 数据在 Bitcoin 权重公式里有折扣，所以换算后有效大小通常更小。",
        },
        {
          question: "这是精确值还是估算值？",
          answer: "这是基于常见脚本模板的估算值，足够适合做规划，但最终交易大小仍可能略有差异。",
        },
      ],
    },
    "btc-change-output-calculator": {
      title: "BTC 找零输出计算器",
      seoTitle: "BTC 找零输出计算器 | Kaya",
      description: "根据输入、收款金额和手续费计算 Bitcoin 找零输出。",
      intro:
        "这个 BTC 找零输出计算器可以根据输入总额、收款金额和手续费，计算出交易里剩余的找零输出大小。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 找零输出计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "计算一笔单收款 Bitcoin 交易应返回多少找零给自己。",
        "检查当前手续费设置下，找零是否还剩下足够有意义的数值。",
        "在构造支付交易前先核对钱包里的金额计算逻辑。",
      ],
      explanation:
        "BTC 找零输出计算器适合在构造或复核 Bitcoin 交易时，快速算出找零金额。你输入总输入金额、准备发送给收款方的金额，以及计划支付的手续费后，工具会给出剩余的找零输出值，支持 satoshi 和 BTC 两种形式。它很适合钱包界面、支付工具、PSBT 检查和手工交易规划。与此同时，它还能帮助你判断找零是否太小，以至于接近 dust 阈值，从而决定是否需要调整交易结构。",
      faq: [
        {
          question: "什么是找零输出？",
          answer: "找零输出就是扣除收款金额和手续费后，返回给发送方自己的那部分余额。",
        },
        {
          question: "找零可以为 0 吗？",
          answer: "可以。有些交易会故意不产生找零，而是把剩余金额全部算作手续费。",
        },
        {
          question: "为什么它适合和 dust 计算器一起用？",
          answer: "因为算出的找零如果太小，可能并不值得作为一个单独输出保留下来。",
        },
      ],
    },
    "btc-dust-limit-calculator": {
      title: "BTC Dust 阈值计算器",
      seoTitle: "BTC Dust 阈值计算器 | Kaya",
      description: "估算常见 Bitcoin 输出类型的 dust 阈值。",
      intro:
        "这个 BTC dust 阈值计算器可以根据输出类型和中继费率，估算一笔 Bitcoin 输出大概在什么数值以下会变得不经济。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC Dust 阈值计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一个 P2WPKH 输出在 1 sat/vB 下的大致 dust 阈值。",
        "比较不同输出类型的最小实用金额为什么会不同。",
        "检查某个找零输出是否太小，可能接近 dust。",
      ],
      explanation:
        "BTC dust 阈值计算器适合用来估算某个 Bitcoin 输出是否小到不值得花费。Dust 的核心逻辑是：如果将来花费这笔输出的成本接近甚至超过它本身的价值，那么它就没有实际意义。工具会根据常见输出类型和给定费率，给出一个经验性的 satoshi 阈值。它非常适合钱包开发、支付找零规划、输出策略设计和交易复核。虽然真实策略会受具体节点政策影响，但这个估算值已经足够适合大多数前端和产品决策场景。",
      faq: [
        {
          question: "Bitcoin 里的 dust 是什么？",
          answer: "Dust 指的是小到未来花费它时，手续费可能接近或超过它本身价值的输出。",
        },
        {
          question: "Dust 阈值是固定的吗？",
          answer: "不是。它会受到输出类型、策略假设和费率环境影响，所以这里给的是估算值。",
        },
        {
          question: "为什么不同输出类型的 dust 不一样？",
          answer: "因为它们未来被花费时的大小和成本不同，所以可接受的最小价值也不同。",
        },
      ],
    },
    "btc-locktime-calculator": {
      title: "BTC Locktime 计算器",
      seoTitle: "BTC Locktime 计算器 | Kaya",
      description: "把 Bitcoin nLockTime 在高度和时间戳语义之间转换和查看。",
      intro:
        "这个 BTC locktime 计算器可以解读原始 nLockTime，也可以把 UTC 日期转换为 Bitcoin 交易里使用的时间锁数值。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC Locktime 计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一个 raw locktime 到底代表区块高度还是 Unix 时间戳。",
        "把未来某个 UTC 时间转成可放进交易里的 locktime 数值。",
        "在调试 Bitcoin 原始交易时查看 locktime 字段的实际含义。",
      ],
      explanation:
        "BTC locktime 计算器适合用来理解或构造 Bitcoin 的 nLockTime 值。在 Bitcoin 中，小于 500,000,000 的 locktime 会被解释为区块高度；更大的值则会被视为 Unix 时间戳。这个工具支持两种方向：你可以输入一个原始 locktime 查看它的语义，也可以输入 UTC 日期时间，让工具帮你转换成时间锁形式。它非常适合交易规划、脚本分析、钱包调试和原始交易字段检查。",
      faq: [
        {
          question: "什么是 nLockTime？",
          answer: "nLockTime 是 Bitcoin 交易里的一个字段，用来限制交易最早何时才会被视为可打包。",
        },
        {
          question: "怎么判断 locktime 是高度还是时间？",
          answer: "小于 500,000,000 的值按区块高度解释，更大的值按 Unix 时间戳解释。",
        },
        {
          question: "只设置 locktime 就一定能延迟交易吗？",
          answer: "不一定。实际效果还和 sequence 等字段及 Bitcoin 的交易规则有关。",
        },
      ],
    },
    "btc-weight-calculator": {
      title: "BTC Weight 计算器",
      seoTitle: "BTC Weight 计算器 | Kaya",
      description: "估算 Bitcoin 交易的权重单位、见证字节和虚拟大小。",
      intro:
        "这个 BTC weight 计算器可以根据常见输入输出组合，估算 Bitcoin 交易的权重单位、见证字节、总字节和 vbytes。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC Weight 计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一个 1 输入 2 输出的 P2WPKH 交易大概有多少 vbytes。",
        "比较 P2TR 和 P2PKH 输入对 weight 的影响差异。",
        "在规划手续费前，先估算带 witness 的交易大小。",
      ],
      explanation:
        "BTC weight 计算器适合在 SegWit 规则下快速估算 Bitcoin 交易大小。它不仅显示总字节，还会拆开基础字节、见证字节、权重单位和虚拟字节。这样做很重要，因为 Bitcoin 的手续费通常按 sat/vB 计价，而 witness 数据在 weight 计算里会被折扣处理。这个工具非常适合钱包前端、手续费估算、交易模板规划，以及比较不同脚本类型的大小差异。它基于常见模板做估算，不是逐字节精确仿真，但对大多数产品和前端场景已经足够实用。",
      faq: [
        {
          question: "Bitcoin 的 transaction weight 是什么？",
          answer: "它是 SegWit 引入的大小计量方式，用来把基础字节和 witness 字节合并成一个与手续费相关的值。",
        },
        {
          question: "为什么 vbytes 和原始字节数不一样？",
          answer: "因为 witness 数据在 Bitcoin weight 规则下会被折扣，所以计费用的虚拟大小可能小于总原始字节。",
        },
        {
          question: "这个结果对所有脚本都完全精确吗？",
          answer: "不是。它基于常见输入输出模板估算，遇到特殊脚本路径时可能会有细微差异。",
        },
      ],
    },
    "psbt-decoder": {
      title: "PSBT 解码器",
      seoTitle: "PSBT 解码器 | Kaya",
      description: "把 Bitcoin PSBT 解码为可读的输入、输出和签名字段。",
      intro:
        "这个 PSBT 解码器可以直接在浏览器里查看 Bitcoin PSBT 的输入、输出、UTXO 信息、脚本字段和签名相关数据。",
      exampleHeading: "使用示例",
      explanationHeading: "PSBT 解码器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一个 base64 PSBT，检查每个输入是否已经带上 UTXO 信息。",
        "在把 PSBT 交给 signer 或钱包前，先解码查看结构。",
        "快速检查 redeem script、witness script 和 partial sig 数量。",
      ],
      explanation:
        "PSBT 解码器的作用，是把原始的 Partially Signed Bitcoin Transaction 还原成更适合人工查看的结构。这样你就可以更容易地检查输入引用、输出脚本、witness UTXO、redeem script、partial signature 和 finalization 状态，而不必依赖完整的钱包或节点环境。它特别适合调试多签流程、钱包交接、签名管线和基于 PSBT 的产品逻辑。由于 PSBT 常见的传输格式包括 base64 和 hex，这个工具同时支持两种形式，并统一输出为清晰可读的结构结果。",
      faq: [
        {
          question: "什么是 PSBT？",
          answer: "PSBT 是 Partially Signed Bitcoin Transaction 的缩写，用来在不同工具和 signer 之间传递未签名或部分签名的交易数据。",
        },
        {
          question: "支持 base64 和 hex 吗？",
          answer: "支持。这个工具可以识别并解析这两种常见 PSBT 编码形式。",
        },
        {
          question: "为什么签名前要先解码 PSBT？",
          answer: "因为这样可以先核对输入、输出和签名元数据，避免把不清楚的交易直接交给钱包处理。",
        },
      ],
    },
    "psbt-analyzer": {
      title: "PSBT 分析器",
      seoTitle: "PSBT 分析器 | Kaya",
      description: "分析 PSBT 的签名完成度、UTXO 覆盖情况和可见手续费。",
      intro:
        "这个 PSBT 分析器可以快速查看 Bitcoin PSBT 的签名完成度、UTXO 覆盖情况、finalize 状态以及手续费是否可见。",
      exampleHeading: "使用示例",
      explanationHeading: "PSBT 分析器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一个 PSBT 是否每个输入都带了足够的 UTXO 信息。",
        "查看当前有多少输入已经签名、多少已经 finalize。",
        "快速判断当前 PSBT 是否具备手续费计算条件。",
      ],
      explanation:
        "PSBT 分析器更关注可操作状态，而不是单纯逐字段解码。它会帮助你快速判断：是不是所有输入都带有 UTXO 数据、当前有多少输入已经签名、多少已经 finalize，以及当前 PSBT 是否已经包含足够的信息来估算手续费。这对钱包工作流、签名服务和多步骤 PSBT 管线非常有用，因为你通常需要先知道流程卡在哪一步，而不是手工逐项检查所有字段。相比原始解码结果，这种 readiness 视角更适合做运营排查和开发调试。",
      faq: [
        {
          question: "这里说的 UTXO 覆盖是什么意思？",
          answer: "指的是每个输入是否都包含了足够的引用 UTXO 数据，以支持签名检查和手续费可见性。",
        },
        {
          question: "它一定能算出手续费吗？",
          answer: "不一定。只有当 PSBT 里包含了足够的输入金额信息时，手续费才可见。",
        },
        {
          question: "既然有解码器，为什么还要分析器？",
          answer: "因为分析器会直接给出流程状态摘要，比人工逐字段查看更适合快速判断问题。",
        },
      ],
    },
    "nonce-checker": {
      title: "Nonce 查询工具",
      seoTitle: "Nonce 查询工具 | Kaya",
      description: "通过实时 RPC 节点查询 EVM 账户的 latest 和 pending nonce。",
      intro:
        "这个 nonce 查询工具可以通过实时 RPC 节点查询 EVM 账户的 latest nonce 和 pending nonce，适用于 Ethereum、Base、Arbitrum、Optimism 或自定义网络。",
      exampleHeading: "使用示例",
      explanationHeading: "Nonce 查询工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一个钱包是否有 pending 交易堵在已确认 nonce 前面。",
        "在手工发交易前，对比 latest 和 pending nonce。",
        "在 Base、Arbitrum、Optimism 或自定义 RPC 上查询 nonce 状态。",
      ],
      explanation:
        "Nonce 查询工具适合用来理解 EVM 账户当前的交易序列状态。它会同时查询 latest 已确认 nonce 和 pending nonce，并展示两者之间的差值。这个差值通常可以帮助你判断账户是否存在排队中的交易、未确认交易，或者为什么下一笔交易 nonce 不能简单按已确认状态来推。它在钱包调试、替换交易、手工签名以及排查 stuck pending 状态时都很有帮助。由于工具直接在浏览器里通过标准 JSON-RPC 查询，所以不需要后端也能拿到实时链上结果。",
      faq: [
        {
          question: "EVM nonce 是什么？",
          answer: "它是账户发送交易时使用的顺序号，每发出一笔交易都会递增。",
        },
        {
          question: "为什么要同时看 latest 和 pending？",
          answer: "因为两者差值可以帮助你判断是否有排队或未确认交易影响下一笔可用 nonce。",
        },
        {
          question: "一定要用我自己的 RPC 吗？",
          answer: "不一定。你可以直接使用预设节点，也可以填入自己的自定义 RPC。",
        },
      ],
    },
    "price-impact-calculator": {
      title: "Price Impact 计算器",
      seoTitle: "Price Impact 计算器 | Kaya",
      description: "根据储备、交易数量和手续费 bps 估算 AMM 价格影响。",
      intro:
        "这个 price impact 计算器可以根据池子储备、交易数量和手续费 bps，估算 AMM 的实际输出、成交价格和价格影响。",
      exampleHeading: "使用示例",
      explanationHeading: "Price Impact 计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算一笔交易在 constant-product 池子里大概能换出多少。",
        "比较理想无滑点输出和实际 AMM 输出之间的差异。",
        "在交易前检查手续费和成交规模如何影响执行价格。",
      ],
      explanation:
        "Price impact 计算器适合用来估算一笔 swap 会把 AMM 池子的价格推离多少。它会同时考虑曲线本身带来的滑点效果，以及交易手续费带来的额外损耗，从而给出理想输出、实际输出、价格影响、成交价格和交易后的池子价格。这个工具非常适合在规划交易规模、比较路径，或者向用户解释为什么大额交易执行更差时使用。它采用的是简单的 constant-product 模型，因此非常适合做第一轮 DeFi 分析和产品说明。",
      faq: [
        {
          question: "什么是 price impact？",
          answer: "它表示一笔交易把池子价格从交易前现货价推开了多少。",
        },
        {
          question: "Price impact 和手续费是一回事吗？",
          answer: "不是。手续费是显式成本，而 price impact 来自交易沿着 AMM 曲线移动。",
        },
        {
          question: "这个模型适用于所有 AMM 吗？",
          answer: "不完全适用。它基于简单的 constant-product 模型，更适合做快速估算而不是覆盖所有池子设计。",
        },
      ],
    },
    "btc-address-generator": {
      title: "BTC 地址生成器",
      seoTitle: "BTC 地址生成器 | Kaya",
      description: "在浏览器中随机生成 Bitcoin 地址及常见地址格式。",
      intro:
        "这个 BTC 地址生成器可以直接在浏览器里随机生成 Bitcoin 地址，并输出常见格式如 P2PKH、P2WPKH 和封装 SegWit 地址。",
      exampleHeading: "使用示例",
      explanationHeading: "BTC 地址生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "生成一个新的主网 Bitcoin 地址用于测试地址解析逻辑。",
        "切换到 testnet 后快速生成样例地址用于钱包 QA。",
        "比较同一随机密钥在 legacy 和 SegWit 下的地址表现。",
      ],
      explanation:
        "BTC 地址生成器适合快速生成随机 Bitcoin 地址，用于测试、演示和开发流程。这个版本会在浏览器里本地生成随机私钥，推导压缩公钥，再输出常见地址形式，比如 legacy P2PKH、原生 SegWit P2WPKH 和封装 SegWit P2SH-P2WPKH。它非常适合钱包界面联调、地址校验逻辑测试和样例数据生成。由于整个过程都在本地浏览器内完成，所以不需要后端服务，也符合静态站点的要求。",
      faq: [
        {
          question: "这里生成的是真实格式的 Bitcoin 地址吗？",
          answer: "是的。对所选网络来说，它们都是合法格式的地址。",
        },
        {
          question: "支持主网和测试网吗？",
          answer: "支持。你可以在 Bitcoin 主网和测试网之间切换。",
        },
        {
          question: "私钥输出是 WIF 吗？",
          answer: "不是。这个工具当前输出的是原始 hex 私钥，而不是 WIF 编码。",
        },
      ],
    },
    "batch-btc-address-generator": {
      title: "批量 BTC 地址生成器",
      seoTitle: "批量 BTC 地址生成器 | Kaya",
      description: "批量生成随机 Bitcoin 地址，适合测试和样例数据。",
      intro:
        "这个批量 BTC 地址生成器可以一次性生成多组随机 Bitcoin 地址，适合测试、样例数据和钱包 QA 场景。",
      exampleHeading: "使用示例",
      explanationHeading: "批量 BTC 地址生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "批量生成一组主网地址，测试导入或地址列表展示逻辑。",
        "生成一批 testnet 地址用于钱包 onboarding 场景联调。",
        "快速产出带私钥的样例地址数据供本地 QA 使用。",
      ],
      explanation:
        "批量 BTC 地址生成器适合在你一次需要多组地址时使用。相比反复点击单个生成器，这个工具可以指定数量，直接输出一组结构化的 Bitcoin 地址及对应密钥信息，用于开发测试、样例数据准备、导入校验和钱包界面联调。它的设计重点是简单、快速、纯前端，因此非常适合静态站点里的开发辅助工具定位。",
      faq: [
        {
          question: "一次最多能生成多少地址？",
          answer: "这个工具支持小批量快速生成，适合测试和样例数据准备。",
        },
        {
          question: "也支持 testnet 吗？",
          answer: "支持。你可以切换主网和测试网生成模式。",
        },
        {
          question: "适合拿来做生产托管吗？",
          answer: "不适合。它更偏向浏览器内的开发和 QA 工具。",
        },
      ],
    },
    "ordinal-size-calculator": {
      title: "Ordinals 大小计算器",
      seoTitle: "Ordinals 大小计算器 | Kaya",
      description: "估算 Ordinals 内容的 reveal 大小、脚本字节和分块数量。",
      intro:
        "这个 Ordinals 大小计算器可以根据内容大小、MIME 长度、分块大小和输出类型，预估 reveal 路径的脚本字节和交易大小。",
      exampleHeading: "使用示例",
      explanationHeading: "Ordinals 大小计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算更大的 inscription 内容需要分成多少块。",
        "比较 P2TR 和 P2WPKH 假设下 reveal 大小的差异。",
        "在真正构建交易前，先预览内容大小对 reveal 体积的影响。",
      ],
      explanation:
        "Ordinals 大小计算器适合在真正构建 inscription 交易前，先对 reveal 路径体积做一个快速估算。它会根据内容字节数、MIME 类型长度、分块大小和输出类型，预估分块数量、脚本字节、reveal bytes 和 reveal vbytes。这个结果很适合用来做费用敏感性分析、UI 规划和产品流程设计。它不是完整的脚本级模拟器，但对于第一轮规划来说已经很有帮助。",
      faq: [
        {
          question: "为什么内容会需要分块？",
          answer: "因为较大的 inscription 内容通常不会一次性作为单个超大数据 push 放进脚本里，而是会拆分。",
        },
        {
          question: "它是精确脚本模拟吗？",
          answer: "不是。它是一个实用的大小估算器，不是逐脚本级别的精确构造器。",
        },
        {
          question: "为什么要估算 reveal vbytes？",
          answer: "因为 reveal 大小会直接影响 inscription 成本和前端费用展示。",
        },
      ],
    },
    "transaction-analyzer": {
      title: "交易分析工具",
      seoTitle: "交易分析工具 | Kaya",
      description: "分析原始签名 EVM 交易，并汇总 gas、字节和签名信息。",
      intro:
        "这个交易分析工具可以对原始签名 EVM 交易做深入汇总，查看交易类型、calldata 字节特征、费用模型和签名字段。",
      exampleHeading: "使用示例",
      explanationHeading: "交易分析工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一段签名交易，快速判断它是 legacy 还是 EIP-1559 类型。",
        "查看 calldata 大小、零字节和非零字节数量。",
        "在转发交易前，先检查签名字段和费用设置。",
      ],
      explanation:
        "交易分析工具适合在基础字段解码之外，再往前一步看交易的行为特征。它会汇总链 ID、gas 设置、calldata 字节数、零字节和非零字节数量、intrinsic calldata gas，以及签名中的 `v`、`r`、`s` 等信息。这样做非常适合在调试签名载荷、检查费用模型，或者分析某笔交易的 calldata 成本结构时使用。相比只看字段值，这种分析视角更偏向工程和执行层面的可读性。",
      faq: [
        {
          question: "它和 transaction decoder 有什么区别？",
          answer: "Decoder 更偏向字段解码，而这个 analyzer 还会额外汇总字节级和 gas 层面的特征。",
        },
        {
          question: "支持 EIP-1559 交易吗？",
          answer: "支持。只要原始签名交易里带有相关字段，就会一并汇总展示。",
        },
        {
          question: "为什么要统计零字节和非零字节？",
          answer: "因为它们会直接影响 EVM 链上的 calldata intrinsic gas 成本。",
        },
      ],
    },
    "gas-optimization-analyzer": {
      title: "Gas 优化分析器",
      seoTitle: "Gas 优化分析器 | Kaya",
      description: "估算 calldata gas 开销，以及潜在优化后的手续费节省。",
      intro:
        "这个 gas 优化分析器可以根据 gas 用量、gas 价格、calldata 和潜在降耗比例，估算当前手续费成本和优化后节省。",
      exampleHeading: "使用示例",
      explanationHeading: "Gas 优化分析器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算某段 calldata 对 intrinsic gas 的贡献。",
        "比较当前成本和假设优化后 gas 用量下降时的手续费差异。",
        "查看零字节密度如何影响 calldata 成本结构。",
      ],
      explanation:
        "Gas 优化分析器适合把 calldata 结构和 gas 优化设想，快速转成更直观的手续费影响。你可以输入 gas used、gas price、calldata，以及一个预估的 gas 降幅，它会给出当前成本、优化后成本和潜在节省值。这个工具很适合合约团队、前端工程师和分析人员，在没有完整 profiler 的时候先做一轮方向性判断。它不能替代 trace 级基准测试，但非常适合做第一轮经济性分析。",
      faq: [
        {
          question: "它会自动帮我优化合约吗？",
          answer: "不会。它只负责估算假设降耗后的成本变化，不会修改代码。",
        },
        {
          question: "为什么 calldata 字节组成会重要？",
          answer: "因为在 EVM 规则下，零字节和非零字节对应的 intrinsic gas 成本不同。",
        },
        {
          question: "这能替代生产级 gas benchmarking 吗？",
          answer: "不能。它更适合做方向性成本估算，而不是完整的 trace 级性能分析。",
        },
      ],
    },
    "slippage-calculator": {
      title: "滑点计算器",
      seoTitle: "滑点计算器 | Kaya",
      description: "计算最少收到数量，以及相对容忍度的实际滑点。",
      intro:
        "这个滑点计算器可以根据预期输出、实际输出和滑点容忍度，快速计算最少收到数量以及当前实际滑点。",
      exampleHeading: "使用示例",
      explanationHeading: "滑点计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一笔 swap 的实际输出是否还在容忍范围内。",
        "在提交交易前先算出 minimum received。",
        "交易后快速对比预期输出和实际输出之间的差异。",
      ],
      explanation:
        "滑点计算器适合用来衡量真实成交结果和报价之间差了多少。你只需要输入预期输出、实际输出和可接受的滑点容忍度，就可以看到 minimum received，以及当前成交是否仍在容忍范围内。这类工具很适合 DEX 前端、交易结果复盘和用户教育，因为很多用户只知道设置了滑点，却不清楚这会如何影响实际成交。这个版本的重点是直观、快速、可解释，适合做下单前后的简单判断。",
      faq: [
        {
          question: "什么是滑点？",
          answer: "滑点就是报价输出和实际成交输出之间的差异。",
        },
        {
          question: "为什么要算 minimum received？",
          answer: "因为它代表在当前容忍度下，你至少应该收到多少，否则就超出设定范围了。",
        },
        {
          question: "滑点一定只是手续费造成的吗？",
          answer: "不是。手续费只是其中一部分，流动性深度、价格变化和路由也都会影响滑点。",
        },
      ],
    },
    "arbitrage-profit-calculator": {
      title: "套利利润计算器",
      seoTitle: "套利利润计算器 | Kaya",
      description: "在考虑手续费、滑点和转账成本后估算套利利润。",
      intro:
        "这个套利利润计算器可以在考虑买卖手续费、额外滑点和转账成本后，估算一笔套利交易的净利润和 ROI。",
      exampleHeading: "使用示例",
      explanationHeading: "套利利润计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一个看起来有价差的机会，在扣掉手续费后是否仍然赚钱。",
        "比较转账成本对跨平台套利结果的影响。",
        "估算某个套利方案的 break-even 卖价。",
      ],
      explanation:
        "套利利润计算器的核心作用，是把表面价差转化为更接近真实执行结果的净利润估算。它会同时考虑买入手续费、卖出手续费、额外滑点和固定转账或链上成本，因此比单看买卖价差更接近实际情况。很多看起来有利润的套利机会，在把这些摩擦成本加进去之后就会消失。这个工具适合做第一轮筛选、策略教育和前端预估，但它不是实时执行引擎，不能替代订单簿深度、延迟和流动性层面的真实建模。",
      faq: [
        {
          question: "为什么有价差也可能不赚钱？",
          answer: "因为手续费、滑点和转账成本可能会把看起来的价差全部吃掉。",
        },
        {
          question: "什么是 break-even 卖价？",
          answer: "它表示在当前所有成本条件下，至少卖到什么价格才不会亏损。",
        },
        {
          question: "这个结果能直接代表真实套利执行吗？",
          answer: "不能。它更适合做规划和筛选，真实执行还要考虑深度、延迟和滑点变化。",
        },
      ],
    },
    "liquidation-risk-calculator": {
      title: "清算风险计算器",
      seoTitle: "清算风险计算器 | Kaya",
      description: "估算抵押仓位的 LTV、清算价格和剩余缓冲。",
      intro:
        "这个清算风险计算器可以根据抵押物数量、价格、债务和清算阈值，估算当前 LTV、最大安全债务、清算价格和剩余价格缓冲。",
      exampleHeading: "使用示例",
      explanationHeading: "清算风险计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "估算抵押物价格还可以下跌多少才会触发清算。",
        "检查一个借贷仓位是否已经接近清算阈值。",
        "对比不同抵押物价格下的风险缓冲变化。",
      ],
      explanation:
        "清算风险计算器适合快速评估一个抵押借贷仓位离危险区还有多远。你输入抵押物数量、抵押物价格、债务规模和清算阈值后，就可以看到当前 LTV、最大安全债务、对应的清算价格，以及现价到清算价之间还剩多少缓冲空间。它很适合借贷协议、CDP 仓位、教育型页面和简单监控场景。这个计算器是简化模型，不会覆盖每个协议的额外规则、奖励机制和预言机细节，但做第一轮风险判断已经非常够用。",
      faq: [
        {
          question: "什么是清算价格？",
          answer: "它表示抵押物价格跌到这个位置时，仓位会达到清算阈值。",
        },
        {
          question: "LTV 是什么？",
          answer: "LTV 就是 loan-to-value，用来表示债务相对于抵押物价值的占比。",
        },
        {
          question: "它能完全替代协议自己的风险计算吗？",
          answer: "不能。不同借贷协议还会有额外规则、奖励和预言机机制，这里是一个简化估算工具。",
        },
      ],
    },
    "psbt-builder": {
      title: "PSBT 构建器",
      seoTitle: "PSBT 构建器 | Kaya",
      description: "根据输入、收款和找零信息构建一个简单的 Bitcoin PSBT。",
      intro:
        "这个 PSBT 构建器可以根据单个输入、一个收款输出和可选找零输出，直接在浏览器里生成简单的 Bitcoin PSBT。",
      exampleHeading: "使用示例",
      explanationHeading: "PSBT 构建器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "快速构建一个等待钱包或 signer 继续签名的简单 PSBT。",
        "根据已知 UTXO 和目标地址生成 base64 PSBT。",
        "为演示、钱包交接或测试流程生成一个带找零的 PSBT 草稿。",
      ],
      explanation:
        "PSBT 构建器适合把基础交易信息转成一个可交给其他钱包或 signer 继续处理的 Partially Signed Bitcoin Transaction。这个轻量版本专注于简单结构：单个输入、单个收款输出，以及一个可选找零输出。这样的能力已经足够覆盖很多测试、演示、钱包交接和前端产品检查场景。工具会同时输出 base64 和 hex 两种形式，方便接入不同系统。对于更复杂的多签或高级脚本场景，仍然需要更专业的工具，但这个版本已经适合大多数简单流程。",
      faq: [
        {
          question: "PSBT 构建器是做什么的？",
          answer: "它用来生成一个交易草稿的 PSBT 结构，方便后续交给其他钱包或 signer 审核和签名。",
        },
        {
          question: "它会直接签名吗？",
          answer: "不会。它只负责生成 PSBT 结构，不负责签名。",
        },
        {
          question: "为什么同时输出 base64 和 hex？",
          answer: "因为不同钱包和服务接受的 PSBT 编码形式并不完全一样。",
        },
      ],
    },
    "ordinal-fee-estimator": {
      title: "Ordinals 手续费估算器",
      seoTitle: "Ordinals 手续费估算器 | Kaya",
      description: "估算简单 Ordinals 铭文流程里的 commit 和 reveal 手续费。",
      intro:
        "这个 Ordinals 手续费估算器可以根据铭文字节数、费率、输出类型和 postage，快速估算 commit fee、reveal fee 和总成本。",
      exampleHeading: "使用示例",
      explanationHeading: "Ordinals 手续费估算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "查看内容大小变化会如何影响 inscription 的 reveal 手续费。",
        "比较 P2TR 和 P2WPKH 风格假设下的 reveal 成本差异。",
        "在真正构建 inscription 流程前，先估算手续费和 postage 总支出。",
      ],
      explanation:
        "Ordinals 手续费估算器适合在真正构建 inscription 流程前，先拿到一个粗略但实用的成本参考。它会把 commit 和 reveal 拆开估算，再结合内容字节数、费率、输出类型和 postage，给出总手续费和总成本。真实 inscription 的费用还会受到脚本细节和具体构造方式影响，但前端场景、产品预览和用户教育往往更需要一个快速方向性的数字，而不是逐字节的底层精算。这也是这个工具的定位。",
      faq: [
        {
          question: "为什么要分 commit fee 和 reveal fee？",
          answer: "因为很多 inscription 流程本来就是两步交易结构，一步提交，一步揭示内容。",
        },
        {
          question: "什么是 postage？",
          answer: "Postage 是留在 inscription 输出上的 satoshi 数量，它和手续费不是同一个概念。",
        },
        {
          question: "这个结果是精确费用吗？",
          answer: "不是。它是一个简化估算器，适合做快速规划而不是脚本级精确核算。",
        },
      ],
    },
    "ordinal-inscription-builder": {
      title: "Ordinals 铭文构建器",
      seoTitle: "Ordinals 铭文构建器 | Kaya",
      description: "在浏览器中构建简单的 Ordinals 铭文清单和内容预览。",
      intro:
        "这个 Ordinals 铭文构建器可以直接在浏览器里生成轻量级的铭文清单、内容 hex 预览，以及 reveal 规划所需的基础信息。",
      exampleHeading: "使用示例",
      explanationHeading: "Ordinals 铭文构建器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把铭文文本先转换成内容 hex 预览，再进入更深的构建流程。",
        "把 MIME type、postage 和 destination 等字段先整理好。",
        "为演示或前端流程设计先做一个简单 inscription 草案。",
      ],
      explanation:
        "Ordinals 铭文构建器适合在完整交易构造之前，先把内容和元信息整理成一个轻量级草案。它会把文本内容转成 hex 预览，同时保留 MIME 类型、目标地址和 postage 等基础字段，方便后续继续对接费用估算、PSBT 或更完整的构造逻辑。这个工具非常适合产品原型、演示流程和前端侧的内容准备步骤。",
      faq: [
        {
          question: "它会直接生成可签名的完整铭文交易吗？",
          answer: "不会。它更偏向内容和元信息准备，而不是完整签名交易构造。",
        },
        {
          question: "为什么要输出内容 hex？",
          answer: "因为这样更方便你在后续构造步骤里检查内容编码结果。",
        },
        {
          question: "不连钱包也有用吗？",
          answer: "有用。它本来就是一个偏浏览器侧的预览和规划工具。",
        },
      ],
    },
    "multi-chain-tx-viewer": {
      title: "多链交易查看器",
      seoTitle: "多链交易查看器 | Kaya",
      description: "在多个预设 EVM 链上查询同一个交易哈希。",
      intro:
        "这个多链交易查看器可以在 Ethereum、Base、Arbitrum 和 Optimism 等预设链上，同时查询同一个交易哈希。",
      exampleHeading: "使用示例",
      explanationHeading: "多链交易查看器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "快速确认一个交易哈希到底属于哪条预设链。",
        "同时比较多个 EVM 网络上 transaction 和 receipt 的返回结果。",
        "在排查跨链或支持问题时，先排除链别混淆。",
      ],
      explanation:
        "多链交易查看器适合在你拿到一个交易哈希，但不完全确定它属于哪条链时使用。相比一条链一条链去查，它会直接对预设 RPC 节点批量查询，并把 transaction 和 receipt 结果一起汇总返回。这个能力非常适合支持排查、跨链流程调试，以及一般的多链运营工作。",
      faq: [
        {
          question: "它会查询所有 EVM 链吗？",
          answer: "不会。它只查询一组预设的主流链，而不是覆盖全部 EVM 生态。",
        },
        {
          question: "为什么同一个哈希只会出现在某一条链上？",
          answer: "因为交易哈希是链内上下文生成的，只有真正广播过的那条链才会返回它。",
        },
        {
          question: "它会返回 receipt 吗？",
          answer: "会。只要节点能返回，工具会同时查询 transaction 和 receipt。",
        },
      ],
    },
    "oracle-delay-analyzer": {
      title: "预言机延迟分析器",
      seoTitle: "预言机延迟分析器 | Kaya",
      description: "根据参考时间戳和 heartbeat 评估预言机更新延迟。",
      intro:
        "这个预言机延迟分析器可以把 oracle 更新时间戳、参考时间戳和 heartbeat 结合起来，快速判断延迟程度。",
      exampleHeading: "使用示例",
      explanationHeading: "预言机延迟分析器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "判断某个 oracle 更新相对参考时间已经滞后了多久。",
        "查看当前大概错过了多少个预期 heartbeat 周期。",
        "把 feed 简单归类为 fresh、stale 或 critical。",
      ],
      explanation:
        "预言机延迟分析器适合把原始时间戳快速转成更好理解的运营信号。它会根据 oracle 更新时间、参考时间和预期 heartbeat，算出总延迟、分钟级延迟、错过的 heartbeat 数量，并给出一个简单的新鲜度分类。这个工具很适合监控看板、事故回顾，以及 DeFi 产品里对 stale oracle 风险做第一轮判断的场景。",
      faq: [
        {
          question: "什么是 oracle heartbeat？",
          answer: "它表示在正常假设下，一个 feed 预期最长多久应该更新一次。",
        },
        {
          question: "为什么要统计错过的 heartbeat？",
          answer: "因为这样可以更直观地看出 feed 相对于预期更新节奏已经落后了多少。",
        },
        {
          question: "这是协议专属的 oracle 逻辑吗？",
          answer: "不是。它是一个基于时间戳和 heartbeat 假设的通用延迟分析器。",
        },
      ],
    },
    "contract-bytecode-analyzer": {
      title: "合约字节码分析工具",
      seoTitle: "合约字节码分析工具 | Kaya",
      description: "分析合约字节码大小、metadata 特征和 EIP-170 占用情况。",
      intro:
        "这个合约字节码分析工具可以检查一段合约 bytecode 的大小、metadata 特征，以及它距离 EIP-170 大小限制还有多少空间。",
      exampleHeading: "使用示例",
      explanationHeading: "合约字节码分析工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "检查一段运行时代码或创建代码是否已经接近 EIP-170 限制。",
        "查看 bytecode 里是否带有常见 Solidity metadata 尾部。",
        "在比较不同编译产物时，快速看前缀、后缀和整体大小。",
      ],
      explanation:
        "合约字节码分析工具适合在部署前或调试合约构建产物时，快速了解一段 bytecode 的结构和体积。你可以看到它的总字节数、32 字节字数、是否可能包含 metadata、以及距离 EIP-170 合约大小限制还有多少空间。对于合约优化、编译输出对比、部署产物检查和调试字节码来源来说，这比手工数长度高效得多。它不需要完整开发环境就能给出很直接的体积与特征反馈。",
      faq: [
        {
          question: "EIP-170 是什么？",
          answer: "EIP-170 定义了 Ethereum 已部署合约运行时代码的最大大小限制。",
        },
        {
          question: "Metadata 会算进合约大小里吗？",
          answer: "会。只要 metadata 还在字节码里，它就属于整体长度的一部分。",
        },
        {
          question: "它能百分百判断这是创建代码还是运行时代码吗？",
          answer: "不能百分百判断，但它会给出一些尺寸和结构线索，帮助你更快做初步分析。",
        },
      ],
    },
    "prompt-formatter": {
      title: "Prompt 整理工具",
      seoTitle: "Prompt 整理工具 | Kaya",
      description: "整理 prompt 的结构、空白和内联字段，方便复用。",
      intro:
        "这个 prompt 整理工具可以把杂乱的一段提示词文本重新整理结构、规范空白，并拆出更适合复用的字段段落。",
      exampleHeading: "使用示例",
      explanationHeading: "Prompt 整理工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一段随手写的 prompt 草稿整理后再存进工作流。",
        "把 tone、audience、format 这类内联字段拆成更清晰的结构。",
        "让同一个 prompt 更容易复用到写作、对话和编码场景中。",
      ],
      explanation:
        "Prompt 整理工具适合把一段写得很快、结构不清晰的提示词，转换成更容易阅读和复用的版本。它会尽量规范空白、清理噪声，并把明显的内联字段，比如 audience、tone、constraints、output format 等拆开，让整体层次更清楚。它的目标不是改写你的意图，而是帮助你把提示词整理成更利于人类维护、也更利于 AI 读取的格式。对于积累 prompt 库和反复迭代指令的人来说，这种整理会很省时间。",
      faq: [
        {
          question: "它会改变我的 prompt 意思吗？",
          answer: "它的目标是保留原意，只调整结构和排版，让内容更清晰。",
        },
        {
          question: "会自动拆出内联字段吗？",
          answer: "会。对于形如 `label: value` 的简单字段，它会尽量识别并单独整理出来。",
        },
        {
          question: "适合做 prompt 库整理吗？",
          answer: "适合。结构清楚的 prompt 更容易保存、比较和复用。",
        },
      ],
    },
    "text-to-markdown": {
      title: "文本转 Markdown",
      seoTitle: "文本转 Markdown | Kaya",
      description: "把纯文本笔记即时转换为简单的 Markdown 结构。",
      intro:
        "这个文本转 Markdown 工具可以把普通纯文本笔记快速整理成带标题和列表结构的 Markdown。",
      exampleHeading: "使用示例",
      explanationHeading: "文本转 Markdown 说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把原始会议笔记快速转成 Markdown 大纲。",
        "把纯文本发布说明转换成更适合分享的结构化格式。",
        "把拷贝来的临时笔记整理成适合文档或 AI 上下文的内容。",
      ],
      explanation:
        "文本转 Markdown 工具适合处理只有纯文本、但需要稍微加一点结构的内容。它会把最前面的主要标题转换成 Markdown 标题，保留简单的列表项，并把段落块整理成更容易阅读的 Markdown 结构。它并不是完整的语义分析器，而是一个更适合“快速整理”的轻工具。对于开发者、写作者以及经常在纯文本和 Markdown 之间切换的人来说，这种一键转换通常已经足够实用。",
      faq: [
        {
          question: "会保留原来的列表吗？",
          answer: "会。已有的简单项目符号或编号列表会尽量保留下来。",
        },
        {
          question: "生成的 Markdown 一定完全正确吗？",
          answer: "不一定。它更像一个好用的初稿整理器，必要时你仍可以再手动微调。",
        },
        {
          question: "为什么要把文本转成 Markdown？",
          answer: "因为 Markdown 更适合放进文档、README、笔记系统以及很多 AI 和开发工作流里。",
        },
      ],
    },
    "markdown-preview": {
      title: "Markdown 预览工具",
      seoTitle: "Markdown 预览工具 | Kaya",
      description: "在浏览器中预览带标题、列表和行内格式的 Markdown。",
      intro:
        "这个 Markdown 预览工具可以在浏览器中即时渲染标题、段落、列表和简单行内格式，方便快速检查内容结构。",
      exampleHeading: "使用示例",
      explanationHeading: "Markdown 预览工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在把内容粘贴进 README 或文档前先做预览。",
        "快速检查标题和列表在 Markdown 里的渲染效果。",
        "查看行内代码、加粗和斜体等基础格式是否正确。",
      ],
      explanation:
        "Markdown 预览工具适合在你编辑笔记、README、更新日志、prompt 文本或 AI 生成内容时，先快速确认渲染效果。很多时候 raw markdown 看起来没问题，但真正渲染后才会暴露层级、列表或行内格式的问题。这个轻量预览器专注于最常见的格式，比如标题、段落、列表、行内代码、加粗和强调。对于快速验证结构来说，这通常已经够用，而且比切换到更重的编辑器更直接。",
      faq: [
        {
          question: "它支持完整 Markdown 语法吗？",
          answer: "不支持完整语法。当前更偏向支持最常见的标题、段落、列表和简单行内格式。",
        },
        {
          question: "为什么不直接看原始 Markdown？",
          answer: "因为渲染结果更容易暴露实际结构问题，很多错误在纯文本里并不明显。",
        },
        {
          question: "适合预览 AI 生成的 Markdown 吗？",
          answer: "适合。它非常适合快速检查 AI 生成内容的结构是否基本正确。",
        },
      ],
    },
    "json-to-prompt": {
      title: "JSON 转 Prompt",
      seoTitle: "JSON 转 Prompt | Kaya",
      description: "把结构化 JSON 字段转换为可读的 prompt 模板。",
      intro:
        "这个 JSON 转 Prompt 工具可以把结构化 JSON 字段快速整理成更适合阅读、编辑和分享的提示词格式。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 转 Prompt 说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一段结构化任务配置对象转换成可读的 prompt 模板。",
        "把应用里的 JSON 字段变成适合 LLM 工作流的指令文本。",
        "让嵌套 prompt 数据更容易人工检查和修改。",
      ],
      explanation:
        "JSON 转 Prompt 工具适合处理“底层存的是 JSON，但实际交流和编辑更适合文本”的场景。相比直接看一堆大括号和引号，它会把对象和数组转换成更清晰的标签、缩进和列表结构，让提示词内容更容易阅读。它对 AI 工作流、prompt 库、配置型应用和结构化指令系统都很有帮助。尤其是在你需要和其他人讨论 prompt 内容时，转成可读文本通常会比直接给 JSON 更直观。",
      faq: [
        {
          question: "为什么要把 JSON 转成 prompt？",
          answer: "因为 prompt 风格文本通常更适合阅读、编辑和分享，而原始 JSON 更偏向程序存储。",
        },
        {
          question: "会保留嵌套结构吗？",
          answer: "会。嵌套对象和数组会通过缩进和分段方式保留下来。",
        },
        {
          question: "适合拿来处理工作流配置吗？",
          answer: "适合。它很适合把结构化配置或 payload 变成更适合人工检查的说明文本。",
        },
      ],
    },
    "ai-token-estimator": {
      title: "AI Token 估算器",
      seoTitle: "AI Token 估算器 | Kaya",
      description: "基于文本长度快速粗略估算 prompt 的 token 数量。",
      intro:
        "这个 AI token 估算器可以根据文本长度、单词和换行情况，快速给出一个 prompt 的粗略 token 预估值。",
      exampleHeading: "使用示例",
      explanationHeading: "AI Token 估算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在把 prompt 发给模型前，先估算它大概有多大。",
        "比较长短不同的 prompt 草稿在 token 上的差异。",
        "快速判断内容是否可能接近模型上下文窗口限制。",
      ],
      explanation:
        "AI token 估算器适合在没有必要跑完整 tokenizer 的时候，先拿到一个大致的 token 数量参考。它会统计字符数、单词数、行数，并基于轻量规则给出近似 token 结果。因为不同模型和 tokenizer 的切分方式并不完全一样，所以这个结果不适合拿来做精确计费判断，但对于 prompt 草拟、版本比较、上下文规划和日常快速检查来说，已经非常实用。",
      faq: [
        {
          question: "这个 token 结果是精确的吗？",
          answer: "不是。它是一个近似估算值，适合做规划，不适合当作严格计费依据。",
        },
        {
          question: "为什么不同模型的 token 数可能不一样？",
          answer: "因为不同模型和 tokenizer 对文本、符号和不同语言的切分方式并不完全一致。",
        },
        {
          question: "既然不精确，为什么还要估算？",
          answer: "因为在草拟 prompt 和做上下文规划时，快速拿到一个方向性的数字往往已经足够有帮助。",
        },
      ],
    },
    "prompt-template-generator": {
      title: "Prompt 模板生成器",
      seoTitle: "Prompt 模板生成器 | Kaya",
      description: "为写作、编程和研究任务生成可复用的 prompt 模板。",
      intro:
        "这个 prompt 模板生成器可以根据任务类型、主题、受众和约束条件，快速生成可复用的 prompt 结构。",
      exampleHeading: "使用示例",
      explanationHeading: "Prompt 模板生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "根据主题、受众和风格要求生成写作 prompt 模板。",
        "先搭出编程任务的 prompt 骨架，再补充具体项目细节。",
        "生成可重复使用的研究型 prompt 结构，方便后续扩展。",
      ],
      explanation:
        "Prompt 模板生成器的作用，是把经常重复出现的提问结构先抽象成模板，而不是每次都从零开始写完整 prompt。你可以先定义任务类型、主题、目标读者和限制条件，再生成一份清晰的 prompt 框架。这样做特别适合团队协作、建立 prompt 库、统一工作流风格，以及减少不同人写 prompt 时的差异。它输出的不是最终答案，而是一个可以继续修改、补充和迭代的可复用结构。对经常需要反复写提示词的人来说，这样会省下不少整理时间。",
      faq: [
        {
          question: "什么是 prompt 模板？",
          answer: "它是一种可复用的提示词结构，你只需要替换具体任务内容，而不必每次重写完整指令。",
        },
        {
          question: "为什么不直接每次手写 prompt？",
          answer: "模板更省时间，也更容易保持风格一致，特别适合重复性较高的场景。",
        },
        {
          question: "生成出来后还能继续改吗？",
          answer: "可以。生成结果只是一个起点，你可以继续补充、删改和细化。",
        },
      ],
    },
    "code-explainer-lite": {
      title: "轻量代码解释器",
      seoTitle: "轻量代码解释器 | Kaya",
      description: "在浏览器里快速给出代码片段的轻量结构说明。",
      intro:
        "这个轻量代码解释器可以直接在浏览器里对代码片段做快速结构分析，帮助你先建立基础理解。",
      exampleHeading: "使用示例",
      explanationHeading: "轻量代码解释器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一个小函数，快速看看它可能属于哪种语言风格。",
        "在深入阅读前，先了解代码是否包含循环、条件或异步逻辑。",
        "快速浏览陌生片段的结构特征，再决定是否进一步分析。",
      ],
      explanation:
        "轻量代码解释器适合做代码片段的第一眼结构判断。它不会像完整模型那样做深层语义理解，而是基于常见语法特征、缩进、行数、循环、条件、返回语句和异步标记等信息，给出一份快速说明。这种方式的优点是足够快，也不依赖后端服务，适合在本地做初步浏览。它更像一个结构提示器，而不是严格意义上的代码审查工具。如果你只是想先判断一段代码大概在做什么、复杂度高不高、有没有明显控制流，这种轻量方式已经很有用。",
      faq: [
        {
          question: "这是完整的 AI 代码审查吗？",
          answer: "不是。它更偏向结构层面的快速解释，不是深度语义分析或正式 code review。",
        },
        {
          question: "它能识别哪些语言？",
          answer: "它通过常见模式做粗略判断，可以识别部分常见风格，但不保证绝对准确。",
        },
        {
          question: "为什么要用轻量解释器？",
          answer: "因为它更快、更本地化，适合先做初步判断，再决定是否继续深入分析。",
        },
      ],
    },
    "text-summarizer-lite": {
      title: "轻量文本摘要工具",
      seoTitle: "轻量文本摘要工具 | Kaya",
      description: "用简单规则把较长文本快速压缩成简短摘要。",
      intro:
        "这个轻量文本摘要工具可以直接在浏览器里把较长文本压缩成一段更短的摘要结果。",
      exampleHeading: "使用示例",
      explanationHeading: "轻量文本摘要工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把笔记、说明文档或长段落快速压缩成更短版本。",
        "先预览一段文字最核心的开头信息。",
        "在继续改写或整理之前，先生成一个粗略摘要。",
      ],
      explanation:
        "轻量文本摘要工具适合做快速压缩，而不是追求特别强的语义理解。它会使用句子级的简单规则，从原文中挑选出更适合作为摘要的内容，直接在浏览器中给出结果。这种方式非常适合快速预览、整理会议记录、压缩说明文字，或者在继续改写前先做一轮粗处理。因为它不是大模型生成，所以结果更偏向轻量和直接，也意味着你在正式使用前最好再人工过一遍。如果目标是提炼重点、节省初步整理时间，这种工具已经很实用了。",
      faq: [
        {
          question: "这是 AI 生成摘要吗？",
          answer: "不是。它主要基于轻量规则做句子选择，不依赖远程模型。",
        },
        {
          question: "它能完全保留原意吗？",
          answer: "不一定，所以更适合做初步压缩，正式使用前最好再人工检查。",
        },
        {
          question: "什么场景适合这种轻量摘要？",
          answer: "适合快速预览、笔记整理和草稿压缩，尤其是在你更看重速度的时候。",
        },
      ],
    },
    "keyword-extractor": {
      title: "关键词提取工具",
      seoTitle: "关键词提取工具 | Kaya",
      description: "快速从一段文本里提取高频关键词候选项。",
      intro:
        "这个关键词提取工具可以从文本中快速找出重复出现的关键词候选，适合 SEO、内容复盘和笔记整理。",
      exampleHeading: "使用示例",
      explanationHeading: "关键词提取工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从文章草稿里提取高频关键词，快速检查主题集中度。",
        "查看一段技术笔记里最常出现的术语。",
        "在发布内容前，先做一次简单的 SEO 关键词检查。",
      ],
      explanation:
        "关键词提取工具的核心作用，是帮助你快速看到一段文本中哪些词出现得最频繁。这个版本采用的是轻量级的词频统计加停用词过滤方式，因此速度快，也适合直接在浏览器里完成。它很适合做内容复盘、SEO 初步检查、笔记整理，或者观察一篇草稿是否在某些词上过度重复。因为它并不会真正理解完整语义，所以更适合做第一轮信号判断，而不是完整的关键词策略分析。但对于快速检查来说，这已经能提供很有价值的参考。",
      faq: [
        {
          question: "它会理解词语的真实语义吗？",
          answer: "不会。它主要依据出现频率做提取，更适合做快速检查而不是深层语义分析。",
        },
        {
          question: "为什么有些常见词没有显示出来？",
          answer: "因为工具会过滤停用词，避免结果被大量无意义的常见词干扰。",
        },
        {
          question: "这能直接拿来做 SEO 规划吗？",
          answer: "它适合做初步检查，但完整 SEO 规划仍然需要更广泛的关键词研究和判断。",
        },
      ],
    },
    "chat-format-converter": {
      title: "聊天格式转换工具",
      seoTitle: "聊天格式转换工具 | Kaya",
      description: "把原始对话文本转换成角色分行或项目符号笔记格式。",
      intro:
        "这个聊天格式转换工具可以把杂乱的对话文本整理成更规范的角色分行格式，或者转成简洁的笔记列表。",
      exampleHeading: "使用示例",
      explanationHeading: "聊天格式转换工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把复制出来的对话记录整理成 user 和 assistant 分行格式。",
        "把聊天记录转成项目符号笔记，便于写文档或提工单。",
        "在把对话导入 AI 工作流前，先统一角色标签和格式。",
      ],
      explanation:
        "聊天格式转换工具适合处理那些来源混乱、角色标记不统一或者格式不整齐的对话文本。你可以把原始聊天记录粘贴进来，再把它转换成更适合后续使用的结构，比如按角色分行，或者转成简洁的项目符号笔记。这样做的好处是，后续无论是继续写文档、整理讨论纪要，还是把内容拿去做 prompt 或工作流输入，都会更加清晰。它本质上是一个格式整理工具，但在实际工作里，这类前置清洗经常能省下不少重复整理的时间。",
      faq: [
        {
          question: "它支持哪些输出格式？",
          answer: "可以转换成角色分行格式，也可以转换成项目符号笔记格式。",
        },
        {
          question: "会打乱原本对话顺序吗？",
          answer: "不会。工具会保留原始顺序，只对格式进行整理。",
        },
        {
          question: "为什么要转换聊天记录？",
          answer: "因为结构更清晰的对话文本更适合继续复用到 prompt、文档、工单或审阅流程里。",
        },
      ],
    },
    "random-decision-maker": {
      title: "随机决策工具",
      seoTitle: "随机决策工具 | Kaya",
      description: "从自定义选项列表中即时随机选出一个结果。",
      intro:
        "这个随机决策工具可以从一组选项里即时随机挑出一个结果，适合在不想反复纠结时快速做选择。",
      exampleHeading: "使用示例",
      explanationHeading: "随机决策工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在多个午餐、任务或行程方案里随机选一个。",
        "当几个选项都差不多时，用它来打破僵局。",
        "在头脑风暴或计划阶段做一个轻量级快速选择。",
      ],
      explanation:
        "随机决策工具适合那些你已经列出了候选项，但又不想继续在相近选项之间反复犹豫的场景。你只需要每行输入一个选项，工具就会在浏览器里随机抽出一个结果。它很适合日常小选择、团队里低成本的平票处理、内容点子挑选，或者其他不需要复杂分析的轻决策场景。它不会告诉你哪个选项客观上最好，但它能帮你迅速结束犹豫，继续往前推进。",
      faq: [
        {
          question: "它会先帮我判断哪个更好吗？",
          answer: "不会。它把每个选项都视为平等候选，只负责随机选出一个。",
        },
        {
          question: "能输入很多选项吗？",
          answer: "可以。只要每个选项单独占一行，长短列表都能处理。",
        },
        {
          question: "适合做重要决定吗？",
          answer: "更适合低风险选择和打破僵局，不适合那些需要认真分析的重要决策。",
        },
      ],
    },
    "random-number-generator": {
      title: "随机数生成器",
      seoTitle: "随机数生成器 | Kaya",
      description: "在指定范围内生成随机整数或小数。",
      intro:
        "这个随机数生成器可以在自定义范围内批量生成随机整数或小数，并支持不重复模式。",
      exampleHeading: "使用示例",
      explanationHeading: "随机数生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在 1 到 100 之间生成几组随机整数。",
        "生成带小数位的随机测试数据。",
        "从一个有限整数范围内抽取不重复数字。",
      ],
      explanation:
        "随机数生成器适合在你需要快速得到一批随机数字时使用。你可以设置最小值、最大值、数量、小数位数，并在需要时开启不重复模式。它适用于测试数据、轻量模拟、小游戏、抽号场景，以及很多日常开发和实验工作。因为工具直接在浏览器中运行，所以修改范围后可以立即看到新的结果，不需要依赖后端接口或刷新页面。这让它虽然简单，但很灵活。",
      faq: [
        {
          question: "能生成小数吗？",
          answer: "能。把小数位设置为大于 0 的值，就会输出随机小数。",
        },
        {
          question: "不重复模式是什么意思？",
          answer: "表示生成的结果不会重复，但前提是整数范围必须足够大，能容纳你要求的数量。",
        },
        {
          question: "适合拿来做测试吗？",
          answer: "适合。它很适合快速生成样例数据、范围测试和一些轻量模拟场景。",
        },
      ],
    },
    "random-password-generator": {
      title: "随机密码生成器",
      seoTitle: "随机密码生成器 | Kaya",
      description: "按长度和符号选项即时生成随机密码。",
      intro:
        "这个随机密码生成器可以根据长度、数量和是否包含符号，快速生成多组高强度密码。",
      exampleHeading: "使用示例",
      explanationHeading: "随机密码生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "为新账号生成一个较长的安全密码。",
        "一次生成多组密码备选。",
        "根据不同网站规则决定是否包含符号。",
      ],
      explanation:
        "随机密码生成器适合在你需要新密码时，快速给出比人工想出来更难猜的结果。它利用浏览器随机性生成不可预测的字符组合，并允许你控制密码长度、生成数量以及是否包含符号。对于大多数日常账号来说，随机生成的密码通常比重复使用旧密码或自己手动拼接更安全。这个工具的重点就是简单直接，让你能很快得到一组可用的高强度密码。",
      faq: [
        {
          question: "为什么随机密码通常更安全？",
          answer: "因为它避免了常见单词、重复模式和人类容易采用的可预测替换方式。",
        },
        {
          question: "符号一定要开吗？",
          answer: "通常建议开启，但如果某些网站对符号支持不好，也可以临时关闭。",
        },
        {
          question: "能一次生成多个密码吗？",
          answer: "可以。这个工具支持一次输出多组密码候选。",
        },
      ],
    },
    "random-color-generator": {
      title: "随机颜色生成器",
      seoTitle: "随机颜色生成器 | Kaya",
      description: "生成随机十六进制颜色并预览调色板。",
      intro:
        "这个随机颜色生成器可以批量生成随机十六进制颜色，并直接预览每个颜色块。",
      exampleHeading: "使用示例",
      explanationHeading: "随机颜色生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "快速生成几种颜色，作为界面或插画的灵感参考。",
        "给 CSS 试验或占位主题准备随机色值。",
        "一次看多组十六进制颜色结果。",
      ],
      explanation:
        "随机颜色生成器适合在你需要快速得到一组颜色灵感或测试色值时使用。它会生成标准十六进制颜色，并把每个颜色直接显示成可视化色块，这样你不用只盯着代码去想象颜色长什么样。它适用于前端样式测试、设计草图、占位主题、示例数据以及一些轻量视觉探索。结果本身是随机的，所以不一定天然协调，但这恰好适合做发散式尝试，然后再从中挑选和微调。",
      faq: [
        {
          question: "输出是什么格式？",
          answer: "输出的是标准十六进制颜色，例如 #3fa2c7，可以直接用于 CSS 或设计工具。",
        },
        {
          question: "这些颜色能直接拿去写 CSS 吗？",
          answer: "可以。生成的十六进制颜色值可以直接用于 CSS、SVG 和大多数设计软件。",
        },
        {
          question: "随机生成的调色板一定好看吗？",
          answer: "不一定。它更适合探索和发散，正式使用前通常还需要人工挑选和优化。",
        },
      ],
    },
    "random-gradient-generator": {
      title: "随机渐变生成器",
      seoTitle: "随机渐变生成器 | Kaya",
      description: "生成随机 CSS 线性渐变并即时预览。",
      intro:
        "这个随机渐变生成器可以随机生成 CSS 线性渐变，包含角度和多组颜色，并直接展示预览。",
      exampleHeading: "使用示例",
      explanationHeading: "随机渐变生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "为页面背景、卡片或封面快速生成几种渐变方案。",
        "拿到可直接使用的 CSS 渐变字符串做样式试验。",
        "快速浏览不同角度和颜色组合的结果。",
      ],
      explanation:
        "随机渐变生成器适合在你不想手动一项项调颜色和角度时，直接产出一批可视化渐变背景。每个结果都包含实时预览和可直接使用的 CSS 线性渐变字符串，因此非常适合前端样式实验、封面背景、演示页和临时占位效果。由于输出是随机的，有些结果会更出彩，有些则更普通，但这类工具的价值就在于能快速探索你本来未必会主动尝试的颜色和方向组合。",
      faq: [
        {
          question: "这里生成的是什么类型的渐变？",
          answer: "当前版本生成的是 CSS 线性渐变，包含随机角度和三个颜色停点。",
        },
        {
          question: "结果可以直接复制到 CSS 里吗？",
          answer: "可以。输出就是标准 CSS 渐变字符串，现代浏览器都能直接使用。",
        },
        {
          question: "为什么要用随机渐变生成器？",
          answer: "因为它能帮你快速探索新组合，特别适合做视觉发散和前期试验。",
        },
      ],
    },
    "coin-flip-simulator": {
      title: "抛硬币模拟器",
      seoTitle: "抛硬币模拟器 | Kaya",
      description: "模拟抛硬币并即时统计正反面结果。",
      intro:
        "这个抛硬币模拟器可以在浏览器里快速完成一次虚拟抛硬币，并持续统计正反面次数。",
      exampleHeading: "使用示例",
      explanationHeading: "抛硬币模拟器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在两个选项之间快速做一个随机决定。",
        "用连续抛硬币结果演示基础概率概念。",
        "不拿真实硬币时，直接用浏览器完成随机正反面判断。",
      ],
      explanation:
        "抛硬币模拟器是现实中抛硬币的一个轻量数字版本。你只需要点击一下，工具就会立即返回正面或反面的结果，并且会顺手累计历史次数。它适合用来做快速二选一、课堂里的概率演示、小游戏中的随机判定，或者任何需要简单正反结果的场景。因为不用准备实体硬币，所以在日常使用里会更方便。",
      faq: [
        {
          question: "它和真实抛硬币完全一样吗？",
          answer: "不完全一样，它是软件随机结果，但在大多数轻量决策场景里用途相同。",
        },
        {
          question: "会记录之前抛过多少次吗？",
          answer: "会。当前版本会累计显示正面和反面的出现次数。",
        },
        {
          question: "适合用在哪些场景？",
          answer: "适合做快速二选一、小游戏和基础概率演示。",
        },
      ],
    },
    "dice-roll-simulator": {
      title: "掷骰子模拟器",
      seoTitle: "掷骰子模拟器 | Kaya",
      description: "模拟掷一个或多个骰子并查看总点数。",
      intro:
        "这个掷骰子模拟器可以在浏览器里掷一个或多个虚拟骰子，并同时显示每个骰子的点数和总和。",
      exampleHeading: "使用示例",
      explanationHeading: "掷骰子模拟器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "用两个骰子快速模拟桌游里的移动结果。",
        "给简单桌面游戏或概率演示生成点数。",
        "没有实体骰子时，直接做一次随机掷骰。",
      ],
      explanation:
        "掷骰子模拟器适合在你需要快速得到一个或多个骰子点数时使用。你可以设置骰子数量，然后一次性看到每个骰子的结果和总点数。它很适合桌游辅助、课堂概率示例、轻量游戏逻辑测试，以及任何临时需要骰子随机结果的场景。因为直接在浏览器里运行，所以不需要额外工具，点击就能得到结果。",
      faq: [
        {
          question: "一次能掷几个骰子？",
          answer: "当前版本支持一次掷少量多个骰子，方便结果保持清晰可读。",
        },
        {
          question: "会显示每个骰子的点数吗？",
          answer: "会。工具会同时展示每颗骰子的结果和总点数。",
        },
        {
          question: "可以用来做游戏吗？",
          answer: "可以，适合桌游、小型原型和课堂演示场景。",
        },
      ],
    },
    "number-guessing-game": {
      title: "猜数字游戏",
      seoTitle: "猜数字游戏 | Kaya",
      description: "在浏览器里玩猜数字小游戏并记录尝试次数。",
      intro:
        "这个猜数字游戏会在 1 到 100 之间生成一个隐藏数字，并根据你的输入即时提示偏大还是偏小。",
      exampleHeading: "使用示例",
      explanationHeading: "猜数字游戏说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "玩一个简单的高低提示猜数字小游戏。",
        "把它当作一个短暂的逻辑热身。",
        "重开新局，尝试用更少次数猜中。",
      ],
      explanation:
        "猜数字游戏是一个非常经典的轻量小游戏。浏览器会先生成一个隐藏数字，然后你通过不断输入数字，利用“太大了”或“太小了”的反馈逐步缩小范围，直到猜中为止。这个版本还会记录你总共尝试了多少次。它适合拿来做短暂放松、简单逻辑练习，或者当作一个很直观的前端状态交互示例来看。",
      faq: [
        {
          question: "数字范围是多少？",
          answer: "当前版本会在 1 到 100 之间随机生成隐藏数字。",
        },
        {
          question: "每次猜完都会提示方向吗？",
          answer: "会。你会立刻知道当前猜测是偏大还是偏小。",
        },
        {
          question: "可以重新开始吗？",
          answer: "可以，新游戏按钮会重置目标数字和尝试次数。",
        },
      ],
    },
    "click-speed-test": {
      title: "点击速度测试",
      seoTitle: "点击速度测试 | Kaya",
      description: "测试短时间内的点击速度和每秒点击数。",
      intro:
        "这个点击速度测试可以在固定 5 秒内统计你的点击次数，并计算平均每秒点击数。",
      exampleHeading: "使用示例",
      explanationHeading: "点击速度测试说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "测一下自己在短时间内能点多快。",
        "和朋友比较点击速度结果。",
        "把它当作一个轻量级浏览器交互测试。",
      ],
      explanation:
        "点击速度测试适合用来衡量你在一个短时间窗口里能完成多少次点击。这个版本采用固定 5 秒倒计时，结束后会给出总点击次数以及平均每秒点击数。它常见于轻量挑战、小游戏、浏览器交互演示或者单纯想测一下手速的时候。因为整个过程都在本地浏览器里完成，所以反馈非常直接，也便于你多次重复测试。",
      faq: [
        {
          question: "测试时长是多久？",
          answer: "当前版本每轮测试固定为 5 秒。",
        },
        {
          question: "每秒点击数是怎么来的？",
          answer: "它等于总点击次数除以测试时长，表示平均点击速度。",
        },
        {
          question: "可以反复重测吗？",
          answer: "可以。你可以随时重新开始或重置本轮结果。",
        },
      ],
    },
    "reaction-time-test": {
      title: "反应时间测试",
      seoTitle: "反应时间测试 | Kaya",
      description: "在面板变色时立即点击，测试视觉反应速度。",
      intro:
        "这个反应时间测试会在随机等待后切换状态，你需要在看到可点击信号后立刻点击，以测出反应时间。",
      exampleHeading: "使用示例",
      explanationHeading: "反应时间测试说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "测一下自己对视觉提示的反应速度。",
        "多做几轮，比较每次反应时间差异。",
        "把它当作一个轻量级浏览器反射测试。",
      ],
      explanation:
        "反应时间测试适合用来测量你在看到视觉信号之后，需要多久才能做出点击反应。你先启动测试，接着等待一个随机延迟，等面板切换到可点击状态后立刻点击，工具就会以毫秒为单位给出结果。因为等待时间不是固定的，所以你很难完全依赖预判，这也让测试比纯倒计时点击更有意义。它适合做轻量挑战、注意力测试和简单交互演示。",
      faq: [
        {
          question: "如果我点早了会怎样？",
          answer: "工具会提示你点早了，因为真正的反应窗口还没有开始。",
        },
        {
          question: "结果显示的是什么？",
          answer: "显示的是从可点击信号出现到你完成点击之间的毫秒数。",
        },
        {
          question: "为什么等待时间要随机？",
          answer: "随机延迟可以减少预判行为，让反应速度测试更接近真实情况。",
        },
      ],
    },
    "typing-speed-test": {
      title: "打字速度测试",
      seoTitle: "打字速度测试 | Kaya",
      description: "在浏览器里测试打字速度、准确率和完成时间。",
      intro:
        "这个打字速度测试可以根据一小段示例文字，统计你的打字速度、准确率和整体完成时间。",
      exampleHeading: "使用示例",
      explanationHeading: "打字速度测试说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "快速测一段文字的打字速度。",
        "多试几次，对比 WPM 和准确率变化。",
        "把它当作开始工作前的键盘热身测试。",
      ],
      explanation:
        "打字速度测试适合用来快速评估你在输入一段样本文字时的速度和准确程度。这个版本会在你开始输入时自动计时，然后根据输入内容估算每分钟字数、计算准确率，并显示整体耗时。它很适合做轻量练习、效率检查、键盘热身，或者单纯想知道自己最近的打字表现。由于工具完全在浏览器内运行，所以反馈很即时，也方便你反复练习。",
      faq: [
        {
          question: "WPM 是怎么估算的？",
          answer: "这里采用常见近似方法，把 5 个字符视为一个单词，再结合总耗时换算每分钟字数。",
        },
        {
          question: "会同时统计准确率吗？",
          answer: "会。工具会把你的输入和目标文本逐字符对比，给出一个准确率估算。",
        },
        {
          question: "什么时候开始计时？",
          answer: "当你开始在输入框里输入时，计时会自动开始。",
        },
      ],
    },
    "memory-game": {
      title: "记忆配对游戏",
      seoTitle: "记忆配对游戏 | Kaya",
      description: "玩一个简单的卡片配对记忆游戏并统计步数。",
      intro:
        "这个记忆配对游戏可以通过翻卡和配对的方式，测试短时记忆，并记录你完成整局所用的步数。",
      exampleHeading: "使用示例",
      explanationHeading: "记忆配对游戏说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在短时间内玩一局配对小游戏，做一次脑力切换。",
        "记录完成整局所需步数，尝试下一次做得更好。",
        "把它当作一个简单的记忆训练小游戏。",
      ],
      explanation:
        "记忆配对游戏是一种经典的短时记忆小游戏。牌面会先被打乱并盖住，你每次翻开两张，目标是在尽量少的步数里找到所有成对的卡片。这个版本会统计配对进度和总步数，因此你不仅能完成游戏，还能观察自己是否在下一轮有所提升。它很适合作为短暂休息、注意力切换，或者前端交互状态示例来看。",
      faq: [
        {
          question: "怎样算赢？",
          answer: "把所有卡片都成功配成对并全部翻开，就算完成这一局。",
        },
        {
          question: "步数是什么意思？",
          answer: "每当你翻开第二张卡片，完成一次配对尝试，就会记作一步。",
        },
        {
          question: "可以重新洗牌开始吗？",
          answer: "可以。重置按钮会生成新的牌面顺序，并清空当前步数。",
        },
      ],
    },
    "2048-game": {
      title: "2048 游戏",
      seoTitle: "2048 游戏 | Kaya",
      description: "在浏览器里玩 2048 方块合并游戏并冲击目标数字。",
      intro:
        "这个 2048 游戏可以让你在浏览器里通过合并相同数字方块，逐步冲向 2048 目标格。",
      exampleHeading: "使用示例",
      explanationHeading: "2048 游戏说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在工具页里快速玩一局 2048。",
        "练习如何通过合并和留空位来延长棋局。",
        "把它当作一个轻量级数字拼图休息项目。",
      ],
      explanation:
        "2048 是一个经典的数字合并拼图游戏。你每次把棋盘朝一个方向推动，相同数字的方块就会合并成更大的数值，同时棋盘会生成新的方块。核心挑战在于，既要不断制造更大的数字，又要避免棋盘被过早填满。这个版本保持了终端风格下的极简界面，重点提供核心合并逻辑、分数统计和方向控制。它适合做短时间的脑力放松，也适合当作一个很直观的浏览器状态游戏示例。",
      faq: [
        {
          question: "分数是怎么计算的？",
          answer: "每次两个方块成功合并时，系统会按照新生成方块的数值累加分数。",
        },
        {
          question: "什么时候算结束？",
          answer: "当棋盘被占满，并且相邻方块再也无法合并时，游戏结束。",
        },
        {
          question: "达到 2048 之后还能继续玩吗？",
          answer: "可以。2048 只是经典目标，只要还有合法移动，你就能继续玩下去。",
        },
      ],
    },
    "sudoku-generator": {
      title: "数独生成器",
      seoTitle: "数独生成器 | Kaya",
      description: "生成一个可填写的数独题目，并统计填写正确情况。",
      intro:
        "这个数独生成器可以快速生成一局可填写的数独题目，并统计你已经填写了多少格、其中多少格正确。",
      exampleHeading: "使用示例",
      explanationHeading: "数独生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "打开一局新的数独题目并直接在浏览器里填写。",
        "用已填写格数和正确格数来观察解题进度。",
        "把它当作一个日常逻辑热身工具。",
      ],
      explanation:
        "数独生成器适合用来获得一局轻量级的数字逻辑谜题。数独的目标，是让每一行、每一列以及每个 3x3 宫格都包含 1 到 9，且不重复。这个版本会从有效答案盘面出发，随机挖掉部分格子，然后让你在浏览器里直接填写剩余空位。工具还会给出填空进度和与答案一致的数量，方便你做一个简单的自检。它适合作为日常脑力训练、短暂专注练习，或者一个纯前端谜题工具的实现示例。",
      faq: [
        {
          question: "每次都会生成新题吗？",
          answer: "会。工具会基于新的盘面变换和新的挖空位置生成一局新题。",
        },
        {
          question: "所有格子都能输入吗？",
          answer: "不能。题目给出的固定提示格会锁定，只能填写空白格。",
        },
        {
          question: "会提示我已经解完了吗？",
          answer: "会。当所有空白格都与答案一致时，状态会变成已完成。",
        },
      ],
    },
    "spin-wheel-picker": {
      title: "转盘选择器",
      seoTitle: "转盘选择器 | Kaya",
      description: "从自定义选项里随机抽出一个结果，适合轻量选择。",
      intro:
        "这个转盘选择器可以从你输入的选项列表中随机抽出一个结果，适合做更有仪式感的随机决定。",
      exampleHeading: "使用示例",
      explanationHeading: "转盘选择器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从几个任务、主题或午餐方案里随机选一个。",
        "用比普通随机列表更有趣的方式做轻量选择。",
        "在一组头脑风暴结果里随机点出一个方向。",
      ],
      explanation:
        "转盘选择器适合那些你已经列出若干备选项，但希望用更轻松、更有一点仪式感的方式完成随机选择的场景。你只需要每行输入一个选项，然后点击开始，工具就会从中随机挑出一个结果并高亮显示。它很适合团队热身、话题选择、内容灵感抽取以及日常小决定。它不提供权重、排序或复杂概率逻辑，但对于简单随机挑选来说已经足够直接。",
      faq: [
        {
          question: "支持按权重抽取吗？",
          answer: "不支持。当前版本把所有选项都当作等概率候选。",
        },
        {
          question: "可以用自己的选项列表吗？",
          answer: "可以，只要每个选项单独占一行即可。",
        },
        {
          question: "它和随机决策工具有什么区别？",
          answer: "解决的问题相近，但转盘选择器更强调一种更有参与感的随机挑选体验。",
        },
      ],
    },
    "jpg-to-png": {
      title: "JPG 转 PNG 工具",
      seoTitle: "JPG 转 PNG 工具 | Kaya",
      description: "直接在浏览器里把 JPG 图片转换成 PNG。",
      intro:
        "这个 JPG 转 PNG 工具可以把上传的 JPEG 图片直接转换为 PNG，并在浏览器里立即预览结果。",
      exampleHeading: "使用示例",
      explanationHeading: "JPG 转 PNG 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "不打开桌面软件，直接把 JPEG 转成 PNG。",
        "先看一眼转换后的 PNG 再决定后续使用。",
        "在前端或内容处理流程里快速完成格式切换。",
      ],
      explanation:
        "JPG 转 PNG 工具适合在你需要把一张 JPEG 图片快速切换成 PNG 格式时使用。PNG 往往更适合一些设计工作、图像编辑流程或需要无损输出的场景。这个版本使用浏览器内置能力在本地完成转换，不依赖后端上传，因此对小体积图片来说足够轻便、快速，也更符合静态工具站的定位。",
      faq: [
        {
          question: "图片会上传到服务器吗？",
          answer: "不会。转换过程在浏览器本地完成，依赖的是 FileReader 和 canvas。",
        },
        {
          question: "PNG 一定会比 JPG 更小吗？",
          answer: "不一定。两种格式压缩方式不同，转换后体积可能更大，也可能更小。",
        },
        {
          question: "能直接看到转换结果吗？",
          answer: "可以。工具会立即显示转换后的 PNG 预览和对应 data URL。",
        },
      ],
    },
    "image-to-base64": {
      title: "图片转 Base64 工具",
      seoTitle: "图片转 Base64 工具 | Kaya",
      description: "把上传的图片即时转换为 Base64 data URL。",
      intro:
        "这个图片转 Base64 工具可以把本地图片转换成 Base64 data URL，并同时展示预览和编码结果。",
      exampleHeading: "使用示例",
      explanationHeading: "图片转 Base64 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把本地图片转成可嵌入 HTML 或 CSS 的 data URL。",
        "在复制 Base64 字符串时，同时确认图片预览是否正常。",
        "为前端联调或小型 demo 生成内联图片数据。",
      ],
      explanation:
        "图片转 Base64 工具适合在你需要把一个图片文件编码成文本形式时使用。Base64 data URL 常见于 HTML、CSS、JSON、接口返回值或者某些快速原型场景。这个工具会在浏览器中直接读取图片文件并输出完整 data URL，因此你不需要借助终端或外部脚本，也能快速看到编码结果和预览图像。",
      faq: [
        {
          question: "什么是 Base64 data URL？",
          answer: "它是一种把文件类型信息和编码后的图片内容合并到同一个字符串里的格式。",
        },
        {
          question: "为什么不用普通文件路径？",
          answer: "Base64 更适合内联嵌入、快速传输或一些只接受文本输入的场景。",
        },
        {
          question: "转换后能预览图片吗？",
          answer: "可以。工具会同时显示 Base64 结果和对应的图片预览。",
        },
      ],
    },
    "base64-to-image": {
      title: "Base64 转图片工具",
      seoTitle: "Base64 转图片工具 | Kaya",
      description: "把 Base64 图片字符串解码并在浏览器里预览。",
      intro:
        "这个 Base64 转图片工具可以把 data URL 或纯 Base64 图片字符串还原成可见图片，并即时预览。",
      exampleHeading: "使用示例",
      explanationHeading: "Base64 转图片工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把接口返回的 Base64 图片直接还原出来查看。",
        "检查一段 data URL 是否真的是有效图片。",
        "不借助桌面工具，直接预览编码后的图片内容。",
      ],
      explanation:
        "Base64 转图片工具适合在你拿到一段图片编码字符串后，快速确认它实际对应的图像内容。无论数据来自接口、数据库、配置文件还是临时复制的内容，都可以直接粘贴进来查看。这个过程完全在浏览器内完成，因此适合调试、联调和快速检查图片载荷是否正确。",
      faq: [
        {
          question: "支持完整 data URL 吗？",
          answer: "支持。你可以粘贴完整 data URL，也可以粘贴纯 Base64 图片内容。",
        },
        {
          question: "任意 Base64 字符串都能显示成图片吗？",
          answer: "不能。只有合法的图片 Base64 数据才能被还原并正常显示。",
        },
        {
          question: "这个工具适合什么场景？",
          answer: "适合接口调试、检查存储资产，以及快速确认编码图片内容。",
        },
      ],
    },
    "file-size-converter": {
      title: "文件大小换算器",
      seoTitle: "文件大小换算器 | Kaya",
      description: "在字节、KB、MB、GB、TB 之间换算文件大小。",
      intro:
        "这个文件大小换算器可以在常见存储单位之间快速换算，并同时展示所有结果。",
      exampleHeading: "使用示例",
      explanationHeading: "文件大小换算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一个 MB 数值同时换算成字节和 GB。",
        "查看同一大小在多个存储单位下的表达方式。",
        "用于上传限制、资源规划或文档说明。",
      ],
      explanation:
        "文件大小换算器适合在不同存储单位之间快速切换。字节、KB、MB、GB、TB 这些单位在上传限制、云存储方案、资源文档和前端资源管理里都很常见。通过一次性显示所有单位结果，这个工具可以帮助你更快理解同一个数值在不同视角下的大小，从而减少手算和单位换算错误。",
      faq: [
        {
          question: "支持哪些单位？",
          answer: "当前版本支持字节、KB、MB、GB 和 TB，并按常见 1024 进制进行换算。",
        },
        {
          question: "为什么要做文件大小换算？",
          answer: "因为不同工具、平台和文档经常用不同单位表示同一份文件大小。",
        },
        {
          question: "可以输入小数吗？",
          answer: "可以，当前版本支持对所选输入单位输入小数值。",
        },
      ],
    },
    "unit-converter-bytes": {
      title: "字节单位换算器",
      seoTitle: "字节单位换算器 | Kaya",
      description: "把原始字节值换算成十进制和二进制存储单位。",
      intro:
        "这个字节单位换算器可以把原始字节数同时换算为十进制单位和二进制单位，方便对照查看。",
      exampleHeading: "使用示例",
      explanationHeading: "字节单位换算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一个字节数同时换算成 MB 和 MiB。",
        "比较十进制单位和二进制单位的差别。",
        "用于技术文档、日志数据或基础设施指标查看。",
      ],
      explanation:
        "字节单位换算器适合在你已经拿到一个原始字节值时，快速看清它在不同单位体系里的表达方式。之所以要区分，是因为有些系统按 1000 进制显示 KB、MB，而有些系统按 1024 进制显示 KiB、MiB。把两套结果同时列出来，可以避免在操作系统、监控面板、云服务文档和底层日志之间来回切换时产生误解。",
      faq: [
        {
          question: "MB 和 MiB 有什么区别？",
          answer: "MB 通常按 1000 进制计算，而 MiB 按 1024 进制计算，所以相同字节数换算后结果会不同。",
        },
        {
          question: "为什么要同时显示十进制和二进制单位？",
          answer: "因为不同系统和文档会采用不同约定，把两套结果一起显示更便于对照。",
        },
        {
          question: "这个工具只能看文件大小吗？",
          answer: "不止，任何以字节为原始单位的存储或内存数值都适合用它来换算。",
        },
      ],
    },
    "png-to-jpg": {
      title: "PNG 转 JPG 工具",
      seoTitle: "PNG 转 JPG 工具 | Kaya",
      description: "直接在浏览器里把 PNG 图片转换成 JPG。",
      intro:
        "这个 PNG 转 JPG 工具可以把上传的 PNG 图片直接转换为 JPG，并立即在浏览器里预览结果。",
      exampleHeading: "使用示例",
      explanationHeading: "PNG 转 JPG 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 PNG 资源快速转成 JPG 便于分享。",
        "预览 PNG 在转换成 JPG 之后的效果。",
        "不打开额外编辑软件，直接完成格式切换。",
      ],
      explanation:
        "PNG 转 JPG 工具适合在你需要把 PNG 图片改成 JPG 格式时使用。常见原因包括兼容性、体积控制，或者某些内容流程更偏向 JPG。这个版本在浏览器里本地完成转换，不需要把图片上传到后端，因此对日常快速处理来说足够轻便，也符合静态工具站的使用方式。",
      faq: [
        {
          question: "透明背景会怎样？",
          answer: "JPG 不支持透明通道，所以透明区域会在转换时填充为纯色背景。",
        },
        {
          question: "转换是在浏览器里完成吗？",
          answer: "是的。处理过程完全依赖浏览器本地的 canvas 和文件 API。",
        },
        {
          question: "为什么要把 PNG 转成 JPG？",
          answer: "有时是为了兼容性，有时是为了让偏照片类图片获得更小的体积。",
        },
      ],
    },
    "image-format-converter": {
      title: "图片格式转换器",
      seoTitle: "图片格式转换器 | Kaya",
      description: "在浏览器里把图片转换成 PNG、JPG 或 WEBP。",
      intro:
        "这个图片格式转换器可以上传一张图片，然后在 PNG、JPG、WEBP 之间切换输出并即时预览结果。",
      exampleHeading: "使用示例",
      explanationHeading: "图片格式转换器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在 PNG、JPG、WEBP 之间快速切换同一张图片。",
        "对比不同输出格式下的预览效果。",
        "用一个工具完成多种常见图片格式转换。",
      ],
      explanation:
        "图片格式转换器适合在你想快速比较或切换常见图片格式时使用。这个版本支持 PNG、JPG 和 WEBP 输出，覆盖了大多数网页和内容处理的日常需求。因为转换过程在浏览器内完成，所以你可以直接查看结果，而不必依赖后端服务或打开本地编辑软件。对于静态站工具页来说，这种形式足够直接，也很实用。",
      faq: [
        {
          question: "支持哪些输出格式？",
          answer: "当前版本支持 PNG、JPG 和 WEBP 三种常见输出格式。",
        },
        {
          question: "为什么不用多个单独工具？",
          answer: "同一张图片经常需要快速比较多种输出格式，一个统一转换器会更高效。",
        },
        {
          question: "转换是在本地完成的吗？",
          answer: "是的，图片处理完全在浏览器本地进行。",
        },
      ],
    },
    "image-resize-tool": {
      title: "图片缩放工具",
      seoTitle: "图片缩放工具 | Kaya",
      description: "直接在浏览器里把图片缩放到自定义尺寸。",
      intro:
        "这个图片缩放工具可以把本地图片调整到指定宽高，并支持保持原始比例。",
      exampleHeading: "使用示例",
      explanationHeading: "图片缩放工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把一张图片调整成适合博客横幅的尺寸。",
        "把素材缩小到更适合测试或预览的像素大小。",
        "在保持比例的前提下只修改一个方向尺寸。",
      ],
      explanation:
        "图片缩放工具适合在你需要快速改变图片像素尺寸时使用。你可以上传本地图片，指定目标宽高，并在需要时保持原始比例不变。它很适合做博客配图、社交预览图、前端素材测试以及任何需要图片匹配固定布局尺寸的场景。因为缩放在浏览器内完成，所以结果能即时反馈，也不依赖后端服务。",
      faq: [
        {
          question: "可以保持原始比例吗？",
          answer: "可以，当前版本提供了保持长宽比的选项。",
        },
        {
          question: "缩放和裁剪有什么区别？",
          answer: "缩放是改变整张图片的尺寸，裁剪则是去掉图像的一部分区域。",
        },
        {
          question: "处理是在本地完成的吗？",
          answer: "是的，缩放过程完全在浏览器里执行。",
        },
      ],
    },
    "image-compress-tool": {
      title: "图片压缩工具",
      seoTitle: "图片压缩工具 | Kaya",
      description: "在浏览器里压缩图片并比较原始与输出大小。",
      intro:
        "这个图片压缩工具可以通过调整压缩质量来减小图片体积，并即时预览压缩结果和大小变化。",
      exampleHeading: "使用示例",
      explanationHeading: "图片压缩工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在上传图片前先减小体积。",
        "对比不同压缩质量下的预览效果。",
        "同时查看原始大小和压缩后大小的差异。",
      ],
      explanation:
        "图片压缩工具适合在你想减少图片体积、但又需要快速预览压缩结果时使用。这个版本通过调整输出质量来生成较小的 JPEG 结果，并同时展示原始和压缩后的近似大小。它适合网页性能优化、上传限制控制，以及快速判断某个压缩级别是否还能保持可接受的视觉质量。",
      faq: [
        {
          question: "压缩会影响画质吗？",
          answer: "通常会。文件越小，往往意味着细节会有一定损失，尤其是在较低质量设置下。",
        },
        {
          question: "为什么要同时显示前后大小？",
          answer: "这样更方便判断压缩带来的体积收益是否值得对应的画质取舍。",
        },
        {
          question: "需要上传到服务器吗？",
          answer: "不需要，压缩过程完全在浏览器本地完成。",
        },
      ],
    },
    "image-crop-tool": {
      title: "图片裁剪工具",
      seoTitle: "图片裁剪工具 | Kaya",
      description: "直接在浏览器里按矩形区域裁剪图片。",
      intro:
        "这个图片裁剪工具可以通过 X、Y、宽度和高度参数，快速裁出图片中的指定区域并即时预览。",
      exampleHeading: "使用示例",
      explanationHeading: "图片裁剪工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把截图裁成只保留关键内容的局部图。",
        "去掉图片边缘多余区域。",
        "从大图里裁出一个更聚焦的小图。",
      ],
      explanation:
        "图片裁剪工具适合在你只想保留图片中某一部分时使用。这个版本采用数值输入方式来控制 X、Y、宽度和高度，因此更偏向快速、可重复的裁剪，而不是拖拽式编辑器。它特别适合处理截图、文档配图、调试图片或任何你想保留局部区域的浏览器内工作流。",
      faq: [
        {
          question: "X 和 Y 表示什么？",
          answer: "它们表示裁剪区域左上角相对于原图左上角的起始坐标。",
        },
        {
          question: "裁剪和缩放有什么区别？",
          answer: "裁剪是去掉部分图像区域，缩放则是保留整张图但改变尺寸。",
        },
        {
          question: "裁完后能立即预览吗？",
          answer: "可以，应用裁剪参数后会直接显示裁剪结果。",
        },
      ],
    },
    "json-formatter": {
      title: "JSON 格式化工具",
      seoTitle: "JSON 格式化工具 | Kaya",
      description: "在线格式化 JSON，自动缩进并便于阅读和调试。",
      intro:
        "这个 JSON 格式化工具可以把原始 JSON 重新排版成带缩进的结构化内容，让嵌套对象和数组更容易阅读。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 格式化工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 API 返回的单行 JSON 粘贴进来，快速转成可读结构。",
        "在手工比对对象、数组和嵌套字段时，先格式化再检查。",
        "调试接口响应、配置文件或 JSON 数据流时直接使用。",
      ],
      explanation:
        "JSON 格式化工具的作用，是把原始 JSON 重新排版成更易读的结构。它在调试 API 响应、查看配置文件、检查埋点数据或分析复杂对象时非常常见。很多 JSON 在传输时会被压缩成单行，嵌套层级一多就很难用肉眼看清结构。这个工具会在浏览器里直接解析输入，并把合法 JSON 重新输出为带缩进、带换行的版本，让对象和数组层级更清晰。对于前后端调试来说，这比手动整理要快得多。",
      faq: [
        {
          question: "格式化时也会顺便校验 JSON 吗？",
          answer: "会。如果 JSON 本身不合法，工具会直接提示错误，而不会输出格式化结果。",
        },
        {
          question: "嵌套很深的 JSON 也能处理吗？",
          answer: "可以。只要是合法 JSON，不管对象和数组嵌套多深，都可以正常格式化。",
        },
        {
          question: "数据会被发到服务端吗？",
          answer: "不会。格式化过程完全在浏览器里完成。",
        },
      ],
    },
    "json-validator": {
      title: "JSON 校验工具",
      seoTitle: "JSON 校验工具 | Kaya",
      description: "在线校验 JSON 是否合法，并查看解析后的顶层类型。",
      intro:
        "这个 JSON 校验工具可以快速判断 JSON 是否合法。它会在浏览器中直接解析输入，并显示成功后的类型或失败时的错误信息。",
      exampleHeading: "使用示例",
      explanationHeading: "JSON 校验工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把请求体贴进来，在调用接口前先确认 JSON 语法合法。",
        "检查顶层解析结果到底是对象、数组、字符串还是 null。",
        "利用错误提示快速定位漏逗号、少引号等常见问题。",
      ],
      explanation:
        "JSON 校验工具用于判断一段文本能否被正确解析为 JSON。这是开发里最常见的调试动作之一，因为一个丢失的逗号或引号就足以让整段请求体、配置文件或数据片段失效。这个工具会直接在浏览器里解析输入，并告诉你它是否合法。如果合法，还会显示顶层值的类型，例如 object、array 或 string；如果不合法，则会立即给出解析错误。对于排查接口参数、配置片段和复制过来的数据，这类工具非常实用。",
      faq: [
        {
          question: "能校验哪些类型的 JSON？",
          answer: "只要是合法 JSON，都可以校验，包括对象、数组、字符串、数字、布尔值和 null。",
        },
        {
          question: "会告诉我哪里写错了吗？",
          answer: "会显示浏览器返回的解析错误信息，通常可以帮助你定位失败原因。",
        },
        {
          question: "它和 JSON 格式化工具有什么区别？",
          answer: "校验工具关注 JSON 能否成功解析，格式化工具则更强调把合法 JSON 输出成易读结构。",
        },
      ],
    },
    "base64-encode-decode": {
      title: "Base64 编解码工具",
      seoTitle: "Base64 编解码工具 | Kaya",
      description: "在线把文本编码为 Base64，或把 Base64 解码回可读文本。",
      intro:
        "这个 Base64 编解码工具可以在普通文本和 Base64 之间双向切换，适合调试编码内容、数据片段和简单载荷。",
      exampleHeading: "使用示例",
      explanationHeading: "Base64 编解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把普通文本编码成 Base64，用在简单传输场景中。",
        "把日志或载荷里的 Base64 字符串解码回可读文本。",
        "调试 token、数据片段或嵌入式内容时直接查看编码结果。",
      ],
      explanation:
        "Base64 是一种常见的文本编码形式，用来把二进制或普通文本转成更适合传输的 ASCII 字符串。它经常出现在 data URL、简单 token、载荷封装和某些浏览器功能里。这个工具可以在纯文本和 Base64 之间快速双向切换，因此很适合做编码检查、解码调试和测试输入准备。由于整个过程都在浏览器里运行，所以响应很快，也不会依赖后端服务。",
      faq: [
        {
          question: "Base64 通常用在什么场景？",
          answer: "它常用于把二进制或文本数据转换成 ASCII 安全字符串，以便嵌入、传输或封装。",
        },
        {
          question: "这里既能编码也能解码吗？",
          answer: "可以。工具支持双向切换。",
        },
        {
          question: "为什么解码有时会失败？",
          answer: "通常是因为输入内容不是合法 Base64，或者其中包含了无效编码片段。",
        },
      ],
    },
    "url-encode-decode": {
      title: "URL 编解码工具",
      seoTitle: "URL 编解码工具 | Kaya",
      description: "在线对 URL 片段进行编码或解码，适合参数和链接处理。",
      intro:
        "这个 URL 编解码工具可以把普通文本转换成 URL 安全格式，也可以把百分号编码文本解码回可读内容。",
      exampleHeading: "使用示例",
      explanationHeading: "URL 编解码工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "对包含空格、符号或 `&` 的查询参数值进行编码。",
        "把浏览器或日志中复制出来的百分号编码内容还原成可读文本。",
        "构造接口查询字符串或调试跳转链接时直接使用。",
      ],
      explanation:
        "URL 编码会把一些特殊字符转换成百分号编码形式，从而保证它们能安全出现在查询参数、路径片段或其他 URL 组件里。只要文本里包含空格、保留符号或非 ASCII 字符，就可能需要先做编码，否则浏览器或服务端会错误解释内容。这个工具支持 URL 组件的编码和解码，因此很适合调试链接、构造 API 参数、检查跳转地址，以及确认一段文本是不是已经被编码过。对于开发和排障来说，这是非常常见的一步。",
      faq: [
        {
          question: "什么时候需要做 URL 编码？",
          answer: "当文本中包含空格、特殊符号或其他不适合直接放进 URL 组件里的字符时，就需要编码。",
        },
        {
          question: "它适合处理完整 URL 还是单独片段？",
          answer: "更适合处理单独的 URL 组件，比如查询参数值。",
        },
        {
          question: "为什么解码有时会报错？",
          answer: "通常是因为输入内容不是合法的百分号编码文本。",
        },
      ],
    },
    "uuid-generator": {
      title: "UUID 生成器",
      seoTitle: "UUID 生成器 | Kaya",
      description: "在浏览器中即时生成一个或多个 UUID v4，适合测试和临时标识。",
      intro:
        "这个 UUID 生成器可以即时生成一个或多个 UUID v4，适合测试数据、临时标识和调试场景。",
      exampleHeading: "使用示例",
      explanationHeading: "UUID 生成器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "生成一个 UUID，用作临时记录或测试对象 ID。",
        "一次生成多个 UUID，用于 fixture 数据、演示数据或批量测试。",
        "点击重新生成，快速拿到一批新的唯一标识。",
      ],
      explanation:
        "UUID 生成器的作用，是快速创建唯一标识字符串。UUID v4 这种格式在数据库、API、测试数据和分布式系统里都非常常见，因为它不依赖中心序列，也适合在多环境里独立生成。这个工具使用浏览器内置的加密随机能力来生成一个或多个 UUID，因此非常适合拿来做 mock 数据、临时记录、接口调试和测试输入。相比打开终端或临时写脚本，直接在页面里生成会更快。",
      faq: [
        {
          question: "什么是 UUID v4？",
          answer: "UUID v4 是一种基于随机数生成的通用唯一标识格式，广泛用于软件系统中。",
        },
        {
          question: "可以一次生成多个吗？",
          answer: "可以。工具支持一次生成一小批 UUID。",
        },
        {
          question: "这些 UUID 是在浏览器中生成的吗？",
          answer: "是的。它们通过浏览器内置的 crypto API 在本地生成。",
        },
      ],
    },
    "working-days-exclude-weekends": {
      title: "工作日顺延计算器",
      seoTitle: "工作日顺延计算器 | Kaya",
      description: "在自动排除周末的前提下，把工作日数量加到开始日期上。",
      intro:
        "这个工作日顺延计算器可以把指定数量的工作日加到一个开始日期上，并自动跳过周六和周日，得到最终工作日期。",
      exampleHeading: "使用示例",
      explanationHeading: "工作日顺延计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从项目开始日期起顺延 10 个工作日，不把周末算进去。",
        "把结果日期用于后续跟进节点、交付窗口或内部排期。",
        "顺便查看结果那一天落在星期几。",
      ],
      explanation:
        "工作日顺延计算器适合处理“从某个日期往后加几个工作日”的问题。它常见于交付预估、结算窗口、客服 SLA 和项目排期，因为这些场景往往不按自然日计算，而是要跳过周六和周日。手动按日历一点点数会很慢，也容易出错。这个工具输入开始日期和工作日数量后，会自动跳过周末并返回最终日期，同时给出结果对应的星期，方便你继续安排后续任务或沟通节点。对于按周一到周五运作的流程来说，它比普通日期加法更贴合实际。",
      faq: [
        {
          question: "这个工具会自动跳过周末吗？",
          answer: "会。星期六和星期日不会计入工作日数量。",
        },
        {
          question: "适合算交付日或 SLA 截止日吗？",
          answer: "适合。它特别适合基于工作日而不是自然日的时间规划。",
        },
        {
          question: "会考虑节假日吗？",
          answer: "当前版本还不会，暂时只自动排除周末。",
        },
      ],
    },
    "countdown-timer-date": {
      title: "目标日期倒计时",
      seoTitle: "目标日期倒计时 | Kaya",
      description: "对目标日期时间进行实时倒计时，显示天、小时、分钟和秒。",
      intro:
        "这个目标日期倒计时工具可以实时显示距离某个目标日期时间还剩多少天、小时、分钟和秒，并且每秒自动更新。",
      exampleHeading: "使用示例",
      explanationHeading: "目标日期倒计时说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "设置一个发布时间，看看距离正式上线还剩多少时间。",
        "用 `+1 小时` 或 `+1 天` 快捷按钮快速测试倒计时逻辑。",
        "不需要额外应用或脚本，也能直观看到事件剩余时间。",
      ],
      explanation:
        "目标日期倒计时工具的作用，是持续显示从现在到某个未来时间点之间还剩多少时间。它适合上线时间、活动时间、维护窗口、截止日期以及任何需要“剩余时间”展示的场景。相比手动比较时间或者频繁刷新页面，这个工具会在浏览器里每秒自动更新，并把剩余时长拆成天、小时、分钟和秒，方便直观查看。如果目标时间已经过去，页面也会明确提示。对于简单的倒计时需求，这种纯前端方案足够轻量，也很适合静态网站。",
      faq: [
        {
          question: "倒计时会自动刷新吗？",
          answer: "会。页面中的倒计时每秒会自动更新一次。",
        },
        {
          question: "如果目标时间已经过去会怎样？",
          answer: "工具会直接提示目标时间已经过去，而不会继续显示负数倒计时。",
        },
        {
          question: "适合用来做上线或活动提醒吗？",
          answer: "适合。它很适合做发布窗口、活动开始、维护时间等场景的简单倒计时。",
        },
      ],
    },
    "timezone-difference-calculator": {
      title: "时区差计算器",
      seoTitle: "时区差计算器 | Kaya",
      description: "比较两个时区当前的偏移量和本地时间，适合排期和跨区协作。",
      intro:
        "这个时区差计算器可以并排比较两个时区当前的偏移和本地时间，适合远程协作、会议排期和时区显示排查。",
      exampleHeading: "使用示例",
      explanationHeading: "时区差计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "在安排会议前，对比 Asia/Shanghai 和 New York 当前的时间差。",
        "快速查看两个地区此刻分别显示的本地时间。",
        "排查前端显示中的时区偏移问题时，可直接查看当前 offset。",
      ],
      explanation:
        "时区差计算器用于回答“这两个地区现在差多少时区、各自现在几点”这样的问题。它特别适合跨地区会议安排、值班覆盖、发布时间协调，以及多地时间显示的排查。和时区转换器不同，这个工具并不是把某个具体时间从 A 转到 B，而是直接对比两个时区当前的关系，包括它们各自的本地时间和当前偏移。这样在做日常运营和协作时会更直接。它基于浏览器内置的时区数据运行，不需要后端支持。",
      faq: [
        {
          question: "这里的 offset 指的是什么？",
          answer: "offset 表示该时区当前相对 UTC 的偏移量，比如 UTC+8 或 UTC-4。",
        },
        {
          question: "它和时区转换器有什么区别？",
          answer: "时区差计算器主要对比两个时区当前关系，而时区转换器则是把某个具体时间从一个时区换算到另一个时区。",
        },
        {
          question: "会反映夏令时变化吗？",
          answer: "会依据当前浏览器环境里的时区数据来显示，所以会跟随环境中的夏令时规则。",
        },
      ],
    },
    "date-to-week-number": {
      title: "日期转周数计算器",
      seoTitle: "日期转周数计算器 | Kaya",
      description: "把一个日期转换为 ISO 周数、ISO 周所属年份和星期信息。",
      intro:
        "这个日期转周数计算器可以把任意日期转换为 ISO 周数，同时显示 ISO 周所属年份和该日期对应的星期。",
      exampleHeading: "使用示例",
      explanationHeading: "日期转周数计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "查看某个日期属于 ISO 第 1 周、第 26 周还是第 52 周。",
        "确认年末日期是否已经落入下一年的 ISO 周体系中。",
        "在周报、Sprint 或排期场景中直接获得周编号。",
      ],
      explanation:
        "日期转周数计算器适合把日历日期转换为 ISO 周数。这个格式常见于周报、物流计划、项目迭代、财务或运营按周统计等场景。ISO 周规则和自然年并不完全一致，尤其在每年年初和年末，某些日期会归属于前一年或下一年的 ISO 周，因此手动判断容易出错。这个工具会自动给出该日期的 ISO 周数、ISO 周所属年份，以及它对应的星期信息。对于按周管理的工作流来说，这比自己查规则快很多。",
      faq: [
        {
          question: "什么是 ISO 周数？",
          answer: "ISO 周数是一种国际通用的周编号规则，通常以周一作为一周开始。",
        },
        {
          question: "为什么 ISO 周所属年份可能和自然年不同？",
          answer: "因为靠近新年的日期可能被划入前一年或下一年的 ISO 周系统里。",
        },
        {
          question: "结果里会显示星期吗？",
          answer: "会。工具会同时返回该日期对应的星期信息。",
        },
      ],
    },
    "date-string-parser": {
      title: "日期字符串解析器",
      seoTitle: "日期字符串解析器 | Kaya",
      description: "把可读日期字符串解析为 ISO、UTC、本地时间和时间戳结果。",
      intro:
        "这个日期字符串解析器可以把可读日期字符串解析成结构化结果，包括 ISO 8601、UTC、本地时间和毫秒时间戳。",
      exampleHeading: "使用示例",
      explanationHeading: "日期字符串解析器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴 `May 2, 2026 14:30 UTC` 这样的字符串，查看浏览器最终如何解析。",
        "对比同一输入在 UTC 和本地时间下的显示效果，用于调试。",
        "把解析结果中的时间戳继续传给脚本或接口参数。",
      ],
      explanation:
        "日期字符串解析器适合处理“拿到一个日期字符串，但不确定浏览器会怎么解释它”这种场景。它常见于导入数据、用户输入校验、日志排查，以及需要确认日期字符串是否包含足够时区信息的时候。这个工具把一个自由格式输入交给浏览器解析，如果解析成功，就会展开成 ISO 8601、UTC、本地时间和毫秒时间戳，让你快速确认它到底被理解成了哪个具体时刻。对于开发和调试来说，这比反复打开控制台更直接。",
      faq: [
        {
          question: "什么样的字符串更容易稳定解析？",
          answer: "包含明确年月日和时区信息的日期字符串通常会更可靠。",
        },
        {
          question: "为什么要同时看 UTC 和本地时间？",
          answer: "因为这能帮助你看出同一个解析结果在不同时区显示下的差异。",
        },
        {
          question: "结果里有时间戳吗？",
          answer: "有。工具会同时给出毫秒时间戳，方便继续用于代码或接口。",
        },
      ],
    },
    "time-duration-calculator": {
      title: "时长计算器",
      seoTitle: "时长计算器 | Kaya",
      description: "把天、小时、分钟、秒组成的时长转换为总秒数、总分钟数、总小时数和毫秒数。",
      intro:
        "这个时长计算器可以把由天、小时、分钟和秒组成的时长，快速转换为总秒数、总分钟数、总小时数和总毫秒数。",
      exampleHeading: "使用示例",
      explanationHeading: "时长计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 1 天 2 小时 30 分 15 秒换算成总秒数。",
        "使用总毫秒数结果配置 JavaScript 定时器或延迟参数。",
        "把时长直接换成总小时数或总分钟数，用于报表和公式。",
      ],
      explanation:
        "时长计算器的作用，是把一个分散的时长结构转换成更适合计算和程序使用的总量。很多时候你拿到的是“几天几小时几分钟几秒”，但真正需要传给脚本、接口、报表或公式的，却是总秒数、总分钟数或总毫秒数。这个工具会把这些单位一次性合并并给出常用总量结果，因此特别适合定时器、重试间隔、超时设置、事件统计和持续时间分析。相比手动换算，它更快，也能减少单位换算错误。",
      faq: [
        {
          question: "可以同时输入天、小时、分钟和秒吗？",
          answer: "可以。工具会把所有单位合并后统一换算成总量。",
        },
        {
          question: "总毫秒数适合做什么？",
          answer: "它很适合直接用于 JavaScript 定时器、延迟配置或事件间隔设置。",
        },
        {
          question: "支持小数值吗？",
          answer: "支持。只要输入能被正常解析为数值，工具就会参与换算。",
        },
      ],
    },
    "subtract-time-from-date": {
      title: "日期减时间计算器",
      seoTitle: "日期减时间计算器 | Kaya",
      description: "在线从一个日期时间中减去天、小时和分钟，并即时得到新的结果。",
      intro:
        "这个日期减时间计算器可以从一个基础日期时间中减去天、小时和分钟，并立即输出本地时间、UTC、ISO 和时间戳结果。",
      exampleHeading: "使用示例",
      explanationHeading: "日期减时间计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从某个发布时间减去 2 小时，快速得到准备窗口的起点。",
        "向前回推若干天和分钟，用来验证过期逻辑或结算开始时间。",
        "直接复制 UTC 或 ISO 结果，用在日志或接口测试里。",
      ],
      explanation:
        "日期减时间计算器适合处理“从某个已知时间往前推多久”这类问题。它在排期、提醒、过期时间、订单窗口、结算时间和各种回溯逻辑中都很常见。手动做这类日期减法不复杂，但如果同时还要看本地时间、UTC 和系统可用格式，就很容易变得繁琐。这个工具允许你输入一个基础日期时间，再减去天、小时和分钟，页面会立即返回最终结果，并同时展示本地时间、UTC、ISO 8601 以及毫秒时间戳，适合人工阅读和系统调试两种场景。",
      faq: [
        {
          question: "能一次减去多个单位吗？",
          answer: "可以。你可以在同一次计算中同时减去天、小时和分钟。",
        },
        {
          question: "结果里会包含系统可用格式吗？",
          answer: "会。结果同时包含本地时间、UTC、ISO 8601 和毫秒时间戳。",
        },
        {
          question: "适合做截止时间回推吗？",
          answer: "适合。它很适合从某个已知时间向前倒推准备时间或触发时间。",
        },
      ],
    },
    "business-days-calculator": {
      title: "工作日计算器",
      seoTitle: "工作日计算器 | Kaya",
      description: "在线统计两个日期之间有多少个工作日，并区分周末天数。",
      intro:
        "这个工作日计算器可以统计两个日期之间的工作日数量，自动把周末单独区分出来，并支持选择是否把开始日期计入结果。",
      exampleHeading: "使用示例",
      explanationHeading: "工作日计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "统计一个项目起止日期之间总共有多少个工作日。",
        "把工作日和周末天数拆开，用于 SLA、排班或工资场景。",
        "根据规则决定是否把开始日期算入统计结果。",
      ],
      explanation:
        "工作日计算器的作用，是在一个日期区间里只统计工作日，同时把周末天数单独区分出来。它非常适合项目规划、交付窗口、人事流程、支持 SLA 和各种基于工作日而不是自然日的业务规则。手动去数周一到周五既慢又容易出错，尤其是跨几周甚至跨月的时候。这个工具会接收开始日期和结束日期，返回工作日数量、周末天数以及总天数，同时提供一个选项来决定是否把开始日期算入统计范围。对于日常运营和计划管理，这比肉眼看日历可靠得多。",
      faq: [
        {
          question: "这个工作日计算器会自动排除周末吗？",
          answer: "会。星期六和星期日会被单独统计，不会计入工作日数量。",
        },
        {
          question: "可以决定是否包含开始日期吗？",
          answer: "可以。工具提供了包含或排除开始日期的选项。",
        },
        {
          question: "会考虑法定节假日吗？",
          answer: "当前版本还没有加入节假日规则，暂时只区分工作日和周末。",
        },
      ],
    },
    "time-difference-calculator": {
      title: "时间差计算器",
      seoTitle: "时间差计算器 | Kaya",
      description: "在线计算两个时刻之间相差多少小时和分钟，支持跨天场景。",
      intro:
        "这个时间差计算器专门用来比较两个时刻之间的差值，既能处理同一天内的时间，也能按需处理跨午夜的情况。",
      exampleHeading: "使用示例",
      explanationHeading: "时间差计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "比较 `09:00` 和 `17:30`，快速得到一个工作时段的时长。",
        "开启跨天选项后，可以处理 `22:00` 到 `06:00` 这样的夜班时间。",
        "通过总分钟数结果，直接用于排班、工资或自动化规则计算。",
      ],
      explanation:
        "时间差计算器关注的是两个“时刻”之间差了多久，而不是两个完整日期之间的间隔。这类需求常见于排班、营业时段、学习时间、值班窗口和日常计划。最容易出错的地方是结束时间早于开始时间，因为这既可能意味着输入错误，也可能意味着时间跨过了午夜。这个工具通过一个简单选项来处理这种情况：如果你勾选跨天，就会把更早的结束时间按次日处理。然后页面会即时给出总小时数、总分钟数和更直观的小时分钟拆分结果，比手算或临时写表格公式要高效得多。",
      faq: [
        {
          question: "这个时间差计算器能处理夜班或跨天吗？",
          answer: "可以。开启跨天选项后，更早的结束时间会被视为第二天的时间。",
        },
        {
          question: "结果里会给总分钟数吗？",
          answer: "会。工具会同时给出总小时数、总分钟数和小时分钟拆分结果。",
        },
        {
          question: "需要输入具体日期吗？",
          answer: "不需要。这个工具专门面向仅比较时刻的场景。",
        },
      ],
    },
    "add-time-to-date": {
      title: "日期加时间计算器",
      seoTitle: "日期加时间计算器 | Kaya",
      description: "在线给一个日期增加天、小时和分钟，并即时得到新的结果时间。",
      intro:
        "这个日期加时间计算器可以在一个基础日期时间上继续增加天、小时和分钟，并立即返回本地时间、UTC、ISO 和时间戳结果。",
      exampleHeading: "使用示例",
      explanationHeading: "日期加时间计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "给一个发布时间增加 1 天 2 小时，用来规划截止时间。",
        "给基础时间增加若干分钟，快速验证提醒、过期时间或任务调度逻辑。",
        "直接复制结果里的 UTC 或 ISO 值，用于接口参数或日志验证。",
      ],
      explanation:
        "日期加时间计算器适合处理“从某个起始时间继续往后推多久”这类问题。它在产品逻辑、提醒时间、订单过期、任务调度、结算延迟和日常计划中都很常见。虽然本质只是加法，但手动去算日期和时间的叠加并不高效，尤其是当你同时要看本地时间、UTC 和可存储格式时。这个工具允许你输入一个基础日期时间，再额外增加天、小时和分钟，页面会立即输出最终结果，并同时展示本地时间、UTC、ISO 8601 以及毫秒时间戳，方便你在不同上下文中复用。",
      faq: [
        {
          question: "能同时增加多个单位吗？",
          answer: "可以。你可以在同一次计算里同时增加天、小时和分钟。",
        },
        {
          question: "结果会显示 UTC 吗？",
          answer: "会。页面会同时给出本地时间、UTC、ISO 8601 和毫秒时间戳。",
        },
        {
          question: "适合验证过期时间和提醒时间吗？",
          answer: "适合。这类工具很适合快速检查应用里的未来时间计算逻辑。",
        },
      ],
    },
    "age-calculator-exact": {
      title: "精确年龄计算器",
      seoTitle: "精确年龄计算器 | Kaya",
      description: "根据出生日期和目标日期，计算精确到年、月、日的年龄。",
      intro:
        "这个精确年龄计算器可以根据出生日期和任意目标日期，计算出精确到年、月、日的年龄，并给出总天数等辅助结果。",
      exampleHeading: "使用示例",
      explanationHeading: "精确年龄计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "输入出生日期，并以今天作为目标日期，直接得到当前年龄。",
        "选择未来某一天，看看到那一天时会是多少岁。",
        "查看总天数结果，适合需要纯数字区间的场景。",
      ],
      explanation:
        "精确年龄计算器的作用，是根据出生日期和目标日期，计算出准确的年龄差，而不仅仅是一个四舍五入后的年份。很多场景下，只看“几岁”是不够的，还需要知道相差几个月、几天，例如资料填写、资格校验、用户档案或者只是想更准确地回答某个日期时的年龄。这个工具会返回年、月、日形式的精确年龄，同时还给出总天数和约总月数，方便你在不同场景下选择更适合的表达方式。整个计算都在浏览器里完成，速度快，也适合静态站点部署。",
      faq: [
        {
          question: "这个年龄计算器会把月和天也算进去吗？",
          answer: "会。结果不仅有年份，还会细分到月和日。",
        },
        {
          question: "可以计算未来某一天的年龄吗？",
          answer: "可以。只要目标日期晚于出生日期，就可以正常计算。",
        },
        {
          question: "如果目标日期早于出生日期怎么办？",
          answer: "这种输入会被视为无效，工具会提示你选择正确的日期范围。",
        },
      ],
    },
    "date-format-converter": {
      title: "日期格式转换器",
      seoTitle: "日期格式转换器 | Kaya",
      description: "在线把一个日期字符串转换为 ISO、UTC、本地时间和常见日期格式。",
      intro:
        "这个日期格式转换器可以把同一个日期输入转换成多种常见格式，包括 ISO 8601、UTC、本地时间、标准日期格式和 Unix 时间戳。",
      exampleHeading: "使用示例",
      explanationHeading: "日期格式转换器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "粘贴一个 ISO 时间字符串，立即得到 `YYYY-MM-DD`、`DD/MM/YYYY` 和 `MM/DD/YYYY` 等格式。",
        "对比 UTC 和本地时间输出，快速检查同一输入在不同时区下的显示区别。",
        "把可读日期转换成秒级 Unix 时间戳，方便继续传给接口或脚本。",
      ],
      explanation:
        "日期格式转换器适合处理“同一个日期，要以不同形式展示或传递”的问题。一个系统可能需要 ISO 8601，另一个系统可能只接受斜杠日期格式，而给人阅读时又可能希望看到本地时间，而不是原始时间戳。这个工具把这些常见需求集中在一个页面里：你输入一次日期，页面就会同时输出 ISO、UTC、本地时间、常见日历格式，以及秒级 Unix 时间戳。对于开发者、运营、内容编辑和数据分析来说，这样可以减少来回复制、手动调整格式和临时写脚本的时间。",
      faq: [
        {
          question: "这个转换器支持什么输入格式？",
          answer: "优先推荐 ISO 字符串和 JavaScript 能稳定识别的标准日期输入。",
        },
        {
          question: "能顺便输出 Unix 时间戳吗？",
          answer: "可以。页面会同时给出秒级 Unix 时间戳。",
        },
        {
          question: "为什么要同时看 UTC 和本地时间？",
          answer: "因为这有助于快速发现同一输入在不同时区下的显示差异，尤其适合排查时间相关问题。",
        },
      ],
    },
    "day-of-year-calculator": {
      title: "一年中的第几天计算器",
      seoTitle: "一年中的第几天计算器 | Kaya",
      description: "在线计算某个日期是一年中的第几天，并查看当年剩余天数。",
      intro:
        "这个一年中的第几天计算器可以快速算出某个日期在当年中的序号，同时展示当年还剩多少天，以及该年是否为闰年。",
      exampleHeading: "使用示例",
      explanationHeading: "一年中的第几天计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "查看某个日期是当年的第 122 天还是第 300 天。",
        "计算从今天开始到年底还剩多少天，用于计划或报表场景。",
        "在计算日期序号时，同时确认所选年份是否为闰年。",
      ],
      explanation:
        "一年中的第几天计算器会告诉你某个日期在它所属年份中的位置，比如第 32 天、第 180 天或第 365 天。这类结果常用于分析报表、季节性规划、某些时间序号场景，以及需要使用 ordinal date 的系统里。理论上自己手算并不难，但一旦遇到闰年，二月之后的所有日期序号都会受到影响。这个工具输入一个日期后，会立即返回它在一年中的第几天、到年底还剩多少天，以及该年份是闰年还是平年。对于需要快速确认日期序号的人来说，这比手算和查表都更高效。",
      faq: [
        {
          question: "一年中的第几天是什么意思？",
          answer: "就是把 1 月 1 日记为第 1 天，然后看某个日期在这一年里排第几。",
        },
        {
          question: "会自动处理闰年吗？",
          answer: "会。闰年会影响二月之后所有日期的序号，工具会自动按闰年规则计算。",
        },
        {
          question: "能同时看到本年还剩多少天吗？",
          answer: "可以。工具会一起给出从该日期到当年结束的剩余天数。",
        },
      ],
    },
    "leap-year-checker": {
      title: "闰年判断器",
      seoTitle: "闰年判断器 | Kaya",
      description: "在线判断某一年是否为闰年，并查看二月天数和命中的判定规则。",
      intro:
        "这个闰年判断器可以快速判断某一年是闰年还是平年，同时显示二月天数、全年天数以及具体命中的判断规则。",
      exampleHeading: "使用示例",
      explanationHeading: "闰年判断器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "输入 `2028`，确认它是闰年，并且二月有 29 天。",
        "检查 `1900` 或 `2000` 这种世纪年份，看看究竟适用哪条规则。",
        "在处理表单或时间逻辑时，用它快速验证闰年边界情况。",
      ],
      explanation:
        "闰年判断器的作用，是快速判断某一年有 365 天还是 366 天。这个问题看似简单，但在实际开发中很容易在世纪年份上出错。常见规则是：能被 4 整除的年份通常是闰年；但如果还能被 100 整除，就不算闰年；除非它还能被 400 整除，才重新算作闰年。这个工具接收一个年份输入，然后直接告诉你它是闰年还是平年、二月有多少天、全年一共有多少天，以及具体命中了哪一条判定规则。对于日期逻辑、表单校验和边界测试来说，这种小工具很有用。",
      faq: [
        {
          question: "什么样的年份才算闰年？",
          answer: "通常要能被 4 整除，但能被 100 整除的年份不算；如果还能被 400 整除，则重新算作闰年。",
        },
        {
          question: "为什么 2000 是闰年，但 1900 不是？",
          answer: "因为 2000 能被 400 整除，而 1900 只能被 100 整除，不能被 400 整除。",
        },
        {
          question: "结果里会告诉我二月有多少天吗？",
          answer: "会。工具会明确显示该年份的二月有 28 天还是 29 天。",
        },
      ],
    },
    "current-timestamp": {
      title: "当前 Unix 时间戳",
      seoTitle: "当前 Unix 时间戳 | Kaya",
      description: "实时获取当前 Unix 时间戳，支持秒、毫秒、UTC、本地时间和 ISO 输出。",
      intro:
        "这个当前 Unix 时间戳工具可以实时显示当前秒级和毫秒级时间戳，并同步展示 UTC、本地时间和 ISO 8601 结果，适合调试接口、日志和前端事件。",
      exampleHeading: "使用示例",
      explanationHeading: "当前 Unix 时间戳说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "打开页面后无需输入，直接获取当前 Unix 时间戳。",
        "复制秒级时间戳，用在后端接口或数据库查询中。",
        "复制毫秒级时间戳，用在 JavaScript、前端埋点或浏览器事件中。",
      ],
      explanation:
        "当前 Unix 时间戳表示“此刻”距离 1970 年 1 月 1 日 UTC 已经过了多少秒或毫秒。它在接口调试、日志分析、数据库记录、浏览器事件和链上数据处理中都非常常见，因为程序更容易对这种纯数字格式进行存储和比较。这个页面会在浏览器里每秒自动刷新，直接给出当前秒级和毫秒级时间戳，不需要你再开终端或写一段脚本。同时它还显示 UTC、ISO 8601 和本地时间，方便你确认这个数字到底对应哪个具体时刻。无论你是在排查日志、测试参数，还是给数据打时间标签，这个工具都能省掉反复查询的步骤。",
      faq: [
        {
          question: "当前 Unix 时间戳会自动刷新吗？",
          answer: "会。页面会在浏览器里每秒自动更新一次，所以秒级和毫秒级值都会保持最新。",
        },
        {
          question: "秒级和毫秒级时间戳有什么区别？",
          answer: "秒级是更常见的标准 Unix 时间戳，毫秒级会多出三位，常见于 JavaScript 和前端事件数据。",
        },
        {
          question: "时间戳会受我本地时区影响吗？",
          answer: "不会。Unix 时间戳本身与时区无关，时区只会影响页面上可读时间的显示方式。",
        },
      ],
    },
    "timestamp-milliseconds-converter": {
      title: "秒毫秒时间戳转换器",
      seoTitle: "秒毫秒时间戳转换器 | Kaya",
      description: "在线完成秒级与毫秒级时间戳转换，并查看对应日期预览。",
      intro:
        "这个秒毫秒时间戳转换器可以在秒级 Unix 时间戳和毫秒级时间戳之间即时切换，同时展示 UTC、ISO 和本地时间预览。",
      exampleHeading: "使用示例",
      explanationHeading: "秒毫秒时间戳转换器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "输入 `1714651200`，立即得到对应的毫秒时间戳 `1714651200000`。",
        "把 JavaScript 中常见的毫秒时间戳贴进来，快速得到接口常用的秒级值。",
        "通过日期预览确认转换前后仍然指向同一个时间点。",
      ],
      explanation:
        "很多系统都使用 Unix 时间戳，但并不是所有地方都使用同一个单位。后端接口和数据库里经常使用秒，而 JavaScript、浏览器事件、埋点数据里又经常使用毫秒。两者只差三位数，却很容易在调试时造成错误。这个工具的作用就是在秒和毫秒之间即时换算，让你改任意一个输入框时，另一个结果马上联动更新。页面同时还会展示 UTC、ISO 8601 和本地时间预览，帮助你确认换算后的值依然对应同一个真实时刻。如果你经常在前后端、日志和数据脚本之间来回切换，这类小工具能明显减少低级错误。",
      faq: [
        {
          question: "怎么快速判断时间戳是秒还是毫秒？",
          answer: "现代时间通常秒级是 10 位左右，毫秒级是 13 位左右，这是一种很常见的经验判断方法。",
        },
        {
          question: "为什么秒转毫秒要多三个零？",
          answer: "因为 1 秒等于 1000 毫秒，所以数值上需要乘以 1000。",
        },
        {
          question: "能同时看到转换后的可读日期吗？",
          answer: "可以。页面会展示 UTC、ISO 和本地时间预览，方便你校验结果。",
        },
      ],
    },
    "date-difference-calculator": {
      title: "日期差计算器",
      seoTitle: "日期差计算器 | Kaya",
      description: "在线计算两个日期之间相差多少天、小时、分钟和秒。",
      intro:
        "这个日期差计算器可以即时计算两个日期时间之间的差值，输出总天数、总小时数、总分钟数、总秒数以及拆分结果。",
      exampleHeading: "使用示例",
      explanationHeading: "日期差计算器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "选择开始和结束时间，快速计算两个日期之间相差多少天。",
        "查看总小时数和总分钟数，适合排查时长、SLA 或倒计时逻辑。",
        "不需要打开表格或写脚本，也能快速比较两个时间点的差值。",
      ],
      explanation:
        "日期差计算器的作用是告诉你两个时间点之间到底差了多久。手动数天数只适合非常简单的情况，一旦跨月、跨年，或者你还需要小时、分钟和秒，人工处理就会变得很麻烦。这个工具直接接受两个日期时间输入，然后在浏览器里即时计算差值，并同时给出总天数、总小时数、总分钟数、总秒数，以及按天、小时、分钟、秒拆分的结果。它还会标明结束时间是更晚、更早还是和开始时间相同。对于做计划、看日志、排查定时任务、验证时间区间逻辑，这种工具比手算稳定得多。",
      faq: [
        {
          question: "这个日期差计算器会把时分秒也算进去吗？",
          answer: "会。它比较的是完整的日期时间，而不只是日历上的日期。",
        },
        {
          question: "如果结束时间比开始时间更早怎么办？",
          answer: "工具会单独标明时间方向，同时仍然展示两个时间点之间的绝对差值。",
        },
        {
          question: "计算过程需要后端吗？",
          answer: "不需要。整个差值计算都在浏览器中即时完成。",
        },
      ],
    },
    "timezone-converter": {
      title: "时区转换器",
      seoTitle: "时区转换器 | Kaya",
      description: "在线把一个日期时间从源时区转换到目标时区，并输出 UTC 与 ISO 结果。",
      intro:
        "这个时区转换器可以把某个时区下的日期时间，快速转换成另一个时区对应的本地显示时间，同时给出 UTC 和 ISO 结果。",
      exampleHeading: "使用示例",
      explanationHeading: "时区转换器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 UTC 的会议时间换算成 Asia/Shanghai，方便直接发给国内团队成员。",
        "查看纽约时间在伦敦或东京分别会显示成什么时间。",
        "需要存储到接口或数据库时，可以直接使用 UTC 和 ISO 输出。",
      ],
      explanation:
        "时区转换器适合处理“同一个时刻，在不同时区里应该怎么显示”这个问题。对于远程协作、跨地区日志分析、国际化产品和定时任务来说，这类换算非常常见。难点在于同样的本地时间字符串，在不同源时区下会对应完全不同的 UTC 时刻，而且某些时区还会受夏令时规则影响。这个工具允许你先指定原始日期时间属于哪个时区，再选择目标时区，页面会在浏览器里计算并展示换算后的对应时间，同时保留 UTC 和 ISO 8601 结果，便于你继续写入接口、数据库或调试输出。对于多地区协作和跨时区排查，这类工具很实用。",
      faq: [
        {
          question: "UTC 和本地时区有什么区别？",
          answer: "UTC 是统一参考时间，本地时区则是在 UTC 基础上叠加偏移量，有些地区还会受夏令时影响。",
        },
        {
          question: "这个时区转换器会处理夏令时吗？",
          answer: "会尽量依据浏览器当前环境中的 Intl 时区数据来处理，所以会遵循环境里可用的时区规则。",
        },
        {
          question: "使用时需要后端支持吗？",
          answer: "不需要。整个时区转换逻辑都在浏览器中完成。",
        },
      ],
    },
    "timestamp-converter": {
      title: "Unix 时间戳转换器",
      seoTitle: "Unix 时间戳转换器 | Kaya",
      description: "在线转换 Unix 时间戳与可读日期，支持秒和毫秒，前端即时输出。",
      intro:
        "这个 Unix 时间戳转换器可以在 Unix 时间、UTC、本地时间和 ISO 日期字符串之间快速切换。支持秒与毫秒自动识别，纯前端运行，无需后端。",
      exampleHeading: "使用示例",
      explanationHeading: "Unix 时间戳转换器说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "输入 `1714651200`，立即得到对应的 UTC 时间和本地时间。",
        "通过日期时间选择器输入一个具体时间，直接得到秒级和毫秒级时间戳。",
        "需要调试接口或日志时，可以直接使用页面中的实时当前时间戳。",
      ],
      explanation:
        "Unix 时间戳表示从协调世界时 1970 年 1 月 1 日 00:00:00 开始，到某个时间点累计经过的秒数或毫秒数。它在 API、数据库、日志系统和区块链数据里很常见，因为格式紧凑、易于程序处理，也不容易受地区日期写法影响。但原始数字本身并不直观，而且不同系统有的使用秒，有的使用毫秒，手动判断很容易出错。这个 Unix 时间戳转换器会自动识别输入单位，把时间戳转换成可读的 UTC、本地时间和 ISO 格式，同时也支持把具体日期反向转换为秒和毫秒。整个过程都在浏览器内完成，速度快，也更适合日常调试和校验。",
      faq: [
        {
          question: "这个 Unix 时间戳转换器支持秒和毫秒吗？",
          answer: "支持。工具会根据数字长度自动判断输入更像秒还是毫秒，并同时展示可读时间和原始值。",
        },
        {
          question: "为什么转换后的时间差了几个小时？",
          answer: "通常是时区显示不同导致的。你可以对照 UTC 和本地时间两栏来确认原始时间戳本身是否正确。",
        },
        {
          question: "能处理负数时间戳吗？",
          answer: "可以。负数表示 1970 年 1 月 1 日 UTC 之前的时间，只要仍处于 JavaScript Date 支持范围内即可。",
        },
        {
          question: "这个工具会把数据发到服务端吗？",
          answer: "不会。转换逻辑完全在浏览器中执行，没有后端依赖。",
        },
      ],
    },
  },
} as const;

const EXTRA_READY_TOOL_COPY = {
  en: {
    "pdf-to-image": {
      title: "PDF to Image Converter",
      seoTitle: "PDF to Image Converter | Kaya",
      description: "Render a PDF page into a downloadable PNG preview in the browser.",
      intro:
        "Use this PDF to image converter to open a PDF in your browser, pick a page, and export that page as a PNG image without uploading the file anywhere.",
      exampleHeading: "Example Usage",
      explanationHeading: "PDF to Image Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Export the first page of a PDF receipt as a PNG for chat or notes.",
        "Render a contract cover page into an image for quick preview sharing.",
        "Check how a PDF page looks at different render scales before saving it.",
      ],
      explanation:
        "A PDF to image converter is useful when you only need a visual snapshot of one PDF page instead of the whole document. This browser-based tool reads the PDF locally, renders the page you choose, and gives you an instant PNG preview and download link. Because the conversion stays in the browser, it works well for private files, quick previews, and simple exports without waiting on a backend. It is especially helpful when turning invoices, receipts, reports, or single slides into image assets you can paste into a message or document.",
      faq: [
        {
          question: "Does it upload my PDF to a server?",
          answer: "No. The PDF is processed locally in your browser.",
        },
        {
          question: "Can I choose which page to export?",
          answer: "Yes. You can enter a page number and render that page again.",
        },
        {
          question: "What image format does it export?",
          answer: "The current export format is PNG.",
        },
      ],
    },
    "image-to-pdf": {
      title: "Image to PDF Converter",
      seoTitle: "Image to PDF Converter | Kaya",
      description: "Combine one or more JPG or PNG images into a downloadable PDF file.",
      intro:
        "Use this image to PDF converter to combine one or more JPG or PNG files into a single PDF directly in the browser.",
      exampleHeading: "Example Usage",
      explanationHeading: "Image to PDF Converter Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Turn scanned JPG pages into one PDF document.",
        "Bundle a few screenshots into a PDF for review or sharing.",
        "Convert mobile photo receipts into a single downloadable PDF file.",
      ],
      explanation:
        "An image to PDF converter is helpful when you already have page images and want a single document container that is easier to store, send, or print. This tool accepts JPG and PNG files, creates one PDF page per image, and lets you download the result immediately. The logic runs in the browser, so there is no backend requirement and no need to hand files to a third-party service. For simple document assembly, scanned notes, screenshot bundles, and receipt archives, it is a fast static-site-friendly workflow.",
      faq: [
        {
          question: "Can I add multiple images at once?",
          answer: "Yes. Each selected image becomes its own page in the output PDF.",
        },
        {
          question: "Which image types are supported?",
          answer: "The tool currently supports PNG and JPEG images.",
        },
        {
          question: "Does it resize my images first?",
          answer: "No. Each PDF page uses the embedded image dimensions.",
        },
      ],
    },
    "pdf-merge-tool": {
      title: "PDF Merge Tool",
      seoTitle: "PDF Merge Tool | Kaya",
      description: "Merge multiple PDF files into one PDF in your browser.",
      intro:
        "Use this PDF merge tool to combine several PDF files into one document while keeping their page order.",
      exampleHeading: "Example Usage",
      explanationHeading: "PDF Merge Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Combine monthly reports into a single PDF archive.",
        "Merge an invoice and supporting appendix before sending.",
        "Join separate scan batches into one PDF document.",
      ],
      explanation:
        "A PDF merge tool is one of the most common document utilities because many workflows produce separate PDFs that need to be shared as one file. This browser-based version reads each selected PDF locally, copies the pages in order, and builds a combined output document. It is useful for receipts, reports, scanned pages, contracts, and any case where keeping everything in a single downloadable file is easier than juggling separate attachments. Since the work happens locally, it stays fast and static-site friendly.",
      faq: [
        {
          question: "Does it preserve the order of my files?",
          answer: "Yes. Files are merged in the same order you select them.",
        },
        {
          question: "Can I merge just two PDFs?",
          answer: "Yes. Two or more files are supported.",
        },
        {
          question: "Will the original PDFs be changed?",
          answer: "No. The tool only creates a new merged copy.",
        },
      ],
    },
    "pdf-split-tool": {
      title: "PDF Split Tool",
      seoTitle: "PDF Split Tool | Kaya",
      description: "Split a PDF by page ranges or export every page as separate files.",
      intro:
        "Use this PDF split tool to break one PDF into smaller files by page range, or leave the range blank to export each page separately.",
      exampleHeading: "Example Usage",
      explanationHeading: "PDF Split Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Export only pages 3 to 5 from a longer PDF.",
        "Split a scanned packet into one PDF per page.",
        "Create separate PDFs for selected chapters like 1-2, 4, and 7-9.",
      ],
      explanation:
        "A PDF split tool is useful when one document is too large, contains unrelated sections, or needs to be shared page by page. This tool lets you upload a PDF and either enter page ranges like 1-2,4,7-9 or leave the range blank to export each page as its own PDF file. The process is fully local in the browser, so it stays lightweight and private. It works well for contracts, reports, scans, and classroom material where only specific pages should be extracted.",
      faq: [
        {
          question: "How do I enter page ranges?",
          answer: "Use commas between ranges, for example 1-2,4,7-9.",
        },
        {
          question: "What happens if I leave the range blank?",
          answer: "The tool exports each page as a separate PDF file.",
        },
        {
          question: "Can I split just one page out of a document?",
          answer: "Yes. Enter a single page number like 4.",
        },
      ],
    },
    "pdf-compress-tool": {
      title: "PDF Compress Tool",
      seoTitle: "PDF Compress Tool | Kaya",
      description: "Run a lightweight browser-side PDF optimization pass and compare file size.",
      intro:
        "Use this PDF compress tool to run a lightweight browser-based optimization pass and compare the original size with the rewritten result.",
      exampleHeading: "Example Usage",
      explanationHeading: "PDF Compress Tool Explained",
      faqHeading: "FAQ",
      relatedHeading: "Related Tools",
      internalLinksHeading: "Internal Links",
      example: [
        "Rewrite a generated PDF and check whether the file becomes smaller.",
        "Compare the original size and optimized size before sharing a document.",
        "Run a quick local cleanup pass on a PDF without uploading it.",
      ],
      explanation:
        "A browser-side PDF compress tool cannot do every kind of deep compression that server software can, but it can still be useful for a light optimization pass. This tool reloads the PDF structure locally and saves a rewritten copy using a more compact object-stream style where possible. Some files shrink, some stay about the same, and some may even grow slightly depending on how they were created originally. The benefit is that the workflow remains private, instant, and static-site compatible for quick local checks.",
      faq: [
        {
          question: "Will every PDF become smaller?",
          answer: "No. Some PDFs shrink, while others may stay close to the same size.",
        },
        {
          question: "Does this reduce image quality?",
          answer: "No. This pass rewrites the PDF structure rather than re-encoding images.",
        },
        {
          question: "Is the file processed locally?",
          answer: "Yes. The optimization runs entirely in the browser.",
        },
      ],
    },
  },
  zh: {
    "pdf-to-image": {
      title: "PDF 转图片工具",
      seoTitle: "PDF 转图片工具 | Kaya",
      description: "在浏览器里把 PDF 某一页渲染为可下载的 PNG 图片。",
      intro:
        "这个 PDF 转图片工具可以直接在浏览器里读取 PDF，选择某一页并导出为 PNG 图片，不需要上传到服务器。",
      exampleHeading: "使用示例",
      explanationHeading: "PDF 转图片工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把 PDF 收据第一页导出成 PNG 方便发消息。",
        "把报告封面渲染成图片做快速预览。",
        "切换不同缩放比例后再导出页面图片。",
      ],
      explanation:
        "PDF 转图片工具适合只需要某一页视觉内容，而不是整份 PDF 文件的场景。你上传 PDF 后，工具会在浏览器里本地读取文件，渲染指定页并给出 PNG 预览和下载链接。因为整个过程不依赖后端，所以既适合私密文件，也适合快速导出单页截图。对于发票、收据、报告封面、演示页等内容，这种方式比先打开 PDF 再截图要更直接、也更稳定。",
      faq: [
        {
          question: "PDF 会上传到服务器吗？",
          answer: "不会，文件只会在当前浏览器里本地处理。",
        },
        {
          question: "可以选择导出哪一页吗？",
          answer: "可以，你可以输入页码并重新渲染该页。",
        },
        {
          question: "导出的图片格式是什么？",
          answer: "当前导出格式是 PNG。",
        },
      ],
    },
    "image-to-pdf": {
      title: "图片转 PDF 工具",
      seoTitle: "图片转 PDF 工具 | Kaya",
      description: "把一张或多张 JPG、PNG 图片合并成一个可下载的 PDF。",
      intro:
        "这个图片转 PDF 工具可以把一张或多张 JPG、PNG 图片在浏览器里直接组合成一个 PDF 文件。",
      exampleHeading: "使用示例",
      explanationHeading: "图片转 PDF 工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把扫描出来的多张 JPG 页面合并成一个 PDF。",
        "把几张截图打包成 PDF 方便分享或审阅。",
        "把手机拍的票据图片合并成一个文档文件。",
      ],
      explanation:
        "图片转 PDF 工具适合已经拿到页面图片，但最终希望以文档形式保存、发送或打印的场景。这个工具支持 JPG 和 PNG 文件，并会把每张图片放进独立的 PDF 页面里，最后直接生成一个可下载的 PDF。整个过程都在浏览器本地完成，不依赖后端，也不需要把文件交给第三方服务。对于扫描件、票据归档、截图整理和轻量文档打包来说，这种方式非常实用。",
      faq: [
        {
          question: "支持一次上传多张图片吗？",
          answer: "支持，每张图片都会变成输出 PDF 里的单独一页。",
        },
        {
          question: "支持哪些图片格式？",
          answer: "当前支持 PNG 和 JPEG。",
        },
        {
          question: "会先缩放图片再生成 PDF 吗？",
          answer: "不会，当前会按图片本身尺寸嵌入到 PDF 页面里。",
        },
      ],
    },
    "pdf-merge-tool": {
      title: "PDF 合并工具",
      seoTitle: "PDF 合并工具 | Kaya",
      description: "在浏览器里把多个 PDF 文件按顺序合并成一个。",
      intro:
        "这个 PDF 合并工具可以把多个 PDF 文件按你选择的顺序组合成一个新的 PDF 文档。",
      exampleHeading: "使用示例",
      explanationHeading: "PDF 合并工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "把多个月度报告合并成一个归档 PDF。",
        "把主文档和附件先合并后再发送。",
        "把分批扫描的页面整理成一份完整 PDF。",
      ],
      explanation:
        "PDF 合并工具是最常见的文档处理需求之一，因为很多工作流最终都会生成多份分开的 PDF 文件。这个浏览器端工具会在本地读取每个 PDF，按顺序复制它们的页面，并生成一个新的合并结果。它适合报告、票据、合同、扫描件和各类附件整理场景。由于处理过程完全本地化，所以既不依赖后端，也能保持较快的响应速度和更好的隐私性。",
      faq: [
        {
          question: "会保留我选择文件时的顺序吗？",
          answer: "会，工具会按你选择文件的顺序合并。",
        },
        {
          question: "只合并两个 PDF 也可以吗？",
          answer: "可以，只要有两个或更多文件就能使用。",
        },
        {
          question: "原始 PDF 会被修改吗？",
          answer: "不会，工具只会生成一个新的合并结果。",
        },
      ],
    },
    "pdf-split-tool": {
      title: "PDF 拆分工具",
      seoTitle: "PDF 拆分工具 | Kaya",
      description: "按页码范围拆分 PDF，或把每一页分别导出成独立文件。",
      intro:
        "这个 PDF 拆分工具可以根据页码范围拆出独立 PDF，也可以留空范围后按单页分别导出。",
      exampleHeading: "使用示例",
      explanationHeading: "PDF 拆分工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "从一个长 PDF 里只导出第 3 到第 5 页。",
        "把扫描文档逐页拆开，方便单独发送。",
        "按 1-2、4、7-9 这样的范围生成多份 PDF。",
      ],
      explanation:
        "PDF 拆分工具适合文档太长、内容不相关，或者只需要抽出一部分页面的情况。你可以上传一份 PDF，然后输入像 1-2,4,7-9 这样的页码范围；如果留空，工具会把每一页分别导出成独立的 PDF 文件。整个流程完全在浏览器里本地完成，所以很适合处理私密扫描件、合同节选、讲义资料和报告附件。相比手工截图或另存页面，这种方式更准确也更省时间。",
      faq: [
        {
          question: "页码范围应该怎么写？",
          answer: "用逗号分隔多个范围，例如 1-2,4,7-9。",
        },
        {
          question: "如果不填页码范围会怎样？",
          answer: "工具会把每一页分别导出成单独的 PDF 文件。",
        },
        {
          question: "只拆出某一页可以吗？",
          answer: "可以，直接输入单个页码，比如 4。",
        },
      ],
    },
    "pdf-compress-tool": {
      title: "PDF 压缩工具",
      seoTitle: "PDF 压缩工具 | Kaya",
      description: "做一次轻量浏览器端 PDF 优化，并比较前后文件大小。",
      intro:
        "这个 PDF 压缩工具会对 PDF 做一次轻量浏览器端结构优化，并直接比较原始体积和优化后体积。",
      exampleHeading: "使用示例",
      explanationHeading: "PDF 压缩工具说明",
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        "对导出的 PDF 先做一次本地优化，再看是否变小。",
        "对比优化前后大小后再决定是否发送文件。",
        "不上传文件，直接在浏览器里做一次轻量清理。",
      ],
      explanation:
        "浏览器端的 PDF 压缩工具无法覆盖所有服务器级深度压缩能力，但对于轻量优化场景依然很有价值。这个工具会在本地重新读取 PDF 结构，并尽可能用更紧凑的对象流方式重新保存。不同来源的 PDF 表现会不同，有的会变小，有的变化不大，少数甚至可能略大一些。它的优势在于无需后端、处理速度快，并且更适合做一次即时的本地结构优化检查。",
      faq: [
        {
          question: "每个 PDF 都一定会变小吗？",
          answer: "不一定，有些会变小，有些可能几乎不变。",
        },
        {
          question: "这个过程会降低图片质量吗？",
          answer: "不会，这一步主要是重写 PDF 结构，不会重新压缩图片内容。",
        },
        {
          question: "文件会在本地处理吗？",
          answer: "会，整个优化过程都在当前浏览器里完成。",
        },
      ],
    },
  },
} as const;

function buildPlaceholderContent(slug: string, name: string, locale: ToolLocale): ToolPageContent {
  const keyword = name.toLowerCase();

  if (locale === "zh") {
    return {
      title: name,
      seoTitle: `${name} | Kaya`,
      description: `${name} 页面已接入 Kaya Tools 结构，后续会补充可用前端功能和更完整的 SEO 内容。`,
      intro: `这个 ${name} 页面已经加入 tools 集合，当前先提供稳定路由、基础 SEO 结构和站内链接，后续会继续补齐可交互逻辑。`,
      exampleHeading: "使用示例",
      explanationHeading: `${name} 说明`,
      faqHeading: "常见问题",
      relatedHeading: "相关工具",
      internalLinksHeading: "站内链接建议",
      example: [
        `先通过 tools 集合页进入 ${name}，确认页面 URL 和分类入口已经固定。`,
        "可以先通过下方相关工具继续浏览同类工具页。",
        "后续该页面会从占位骨架逐步升级为完整可用工具。",
      ],
      explanation: `${name} 是 Kaya 工具库中的一个计划中页面。当前版本的主要作用是先把永久路由、metadata、标题层级和站内链接结构搭起来，这样后续新增功能时不会再反复调整 URL 或页面组织方式。虽然交互逻辑还没有接入，但页面已经接入同一套 terminal 风格视觉体系，工具集合页也能保持一致。对于 SEO 和站内结构来说，这种先搭框架、再逐步补功能的方式更适合批量扩展工具库。下一步会把这个占位页面替换为真正可用的纯前端工具，并补齐更具体的 FAQ、示例和搜索关键词内容。`,
      faq: [
        {
          question: `${name} 现在已经能用了吗？`,
          answer: "还没有。当前是路由和页面骨架已就绪，后续会继续补交互逻辑。",
        },
        {
          question: "后续会需要后端吗？",
          answer: "大多数工具会优先保持静态站点兼容，尽量只用浏览器端逻辑实现。",
        },
        {
          question: "为什么先上线路由再补功能？",
          answer: "这样可以先稳定工具库结构和内部链接，后面逐个补工具时更高效。",
        },
      ],
    };
  }

  return {
    title: name,
    seoTitle: `${name} | Kaya`,
    description: `${name} page on Kaya Tools. A search-focused tool entry with terminal-style UI and upcoming interactive functionality.`,
    intro: `This ${keyword} page is in the tools queue. The route is live now so it can be linked from the tools hub, and the working browser-based tool logic will be added next.`,
    exampleHeading: "Example Usage",
    explanationHeading: `${name} Explained`,
    faqHeading: "FAQ",
    relatedHeading: "Related Tools",
    internalLinksHeading: "Internal Links",
    example: [
      `Visit this page from the tools hub to preview the route and URL structure for ${keyword}.`,
      `Use related tools below to reach other utilities in the same category while this page is still being built.`,
      "Check back as more pages move from planned to live.",
    ],
    explanation: `${name} is planned as part of the broader Kaya tools library. The current version establishes the permanent route, metadata, heading structure, and internal-link placement so the section can grow cleanly over time. The interactive logic for this tool is not attached yet, but the page is already wired into the same terminal-style design system as the rest of the site. This lets the collection page stay consistent while individual tools are implemented one by one. For search structure, the page already includes a clear title, keyword-focused headings, a short explanation, and links to related tools. The next step is to replace this placeholder block with a fully working client-side utility and tool-specific FAQ content.`,
    faq: [
      {
        question: `Is the ${keyword} tool available yet?`,
        answer: "Not yet. The page route is ready, and the interactive logic is scheduled to be added in a later pass.",
      },
      {
        question: "Will this tool need a backend?",
        answer: "The plan is to keep tools static-site friendly wherever possible, with browser-side logic only.",
      },
      {
        question: "Why publish the route before the logic?",
        answer: "It helps build the tool library structure first, keeps internal linking stable, and makes later expansion faster.",
      },
    ],
  };
}

export function getToolPageContent(slug: string, locale: ToolLocale): ToolPageContent | null {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const readyCopy = {
    ...READY_TOOL_COPY[locale],
    ...EXTRA_READY_TOOL_COPY[locale],
  };

  const localizedReadyContent =
    tool.status === "ready" && slug in readyCopy
      ? readyCopy[slug as keyof typeof readyCopy]
      : null;

  return localizedReadyContent ?? buildPlaceholderContent(slug, tool.name, locale);
}

export function getToolPageMetadata(slug: string, locale: ToolLocale): Metadata | null {
  const content = getToolPageContent(slug, locale);
  if (!content) return null;

  const canonical = getToolPath(locale, slug);
  const languages = Object.fromEntries(toolLocales.map((item) => [item, getToolPath(item, slug)]));

  return {
    title: content.seoTitle,
    description: content.description,
    alternates: {
      canonical,
      languages,
    },
  };
}

export function getLocalizedRelatedTools(slug: string, locale: ToolLocale) {
  return getRelatedTools(slug).map((tool) => getLocalizedTool(tool.slug, locale)).filter(Boolean);
}

export function getLocalizedInternalLinks(category: ToolCategoryKey, locale: ToolLocale) {
  const categoryMeta = getLocalizedCategoryMeta(locale).find((item) => item.key === category);
  const ui = getToolUiText(locale);

  return [
    { href: getToolPath(locale), label: ui.allTools },
    { href: `${getToolPath(locale)}#${category}`, label: `${categoryMeta?.title ?? category} ${ui.categorySuffix}`.trim() },
    { href: "/search", label: ui.search },
    { href: "/blog", label: ui.blog },
  ];
}

export function getLocalizedToolCollection(locale: ToolLocale) {
  const categories = getLocalizedCategoryMeta(locale);
  return categories.map((category) => ({
    ...category,
    items: getToolsByCategory(category.key).map((tool) => getLocalizedTool(tool.slug, locale)),
  }));
}

export function getToolJsonLd(slug: string, locale: ToolLocale) {
  const content = getToolPageContent(slug, locale);
  const tool = getToolBySlug(slug);
  if (!content || !tool || tool.status !== "ready") {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "SoftwareApplication",
        name: content.title,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: content.description,
      },
    ],
  };
}

export { tools };
