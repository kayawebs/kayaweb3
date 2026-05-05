"use client";

import { useEffect } from "react";

import { writeRecentToolSlug } from "@/components/tools/recent-tools";

export default function RecentToolTracker({ slug }: { slug: string }) {
  useEffect(() => {
    writeRecentToolSlug(slug);
  }, [slug]);

  return null;
}
