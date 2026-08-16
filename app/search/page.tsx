import SearchClient from "@/components/SearchClient";
import { getAllPostsWithContent } from "@/lib/blog";

export default function SearchPage() {
  return <SearchClient items={getAllPostsWithContent()} />;
}
