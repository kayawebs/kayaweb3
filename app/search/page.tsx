import SearchClient from "@/components/SearchClient";
import { getAllPostsWithContent } from "@/lib/blog";

export default function SearchPage() {
  const items = getAllPostsWithContent();
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <SearchClient items={items} />
      </main>
    </div>
  );
}

