import type { Metadata } from "next";

import PasteViewer from "@/components/paste/PasteViewer";

type PastePageProps = {
  params: Promise<{ code: string }>;
};

export const metadata: Metadata = {
  title: "Shared Paste | Kaya",
  robots: { index: false, follow: false },
};

export default async function PastePage({ params }: PastePageProps) {
  const { code } = await params;
  return <PasteViewer code={code} />;
}
