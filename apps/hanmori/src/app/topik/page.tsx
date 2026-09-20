import { ReadingLibrary } from "@/components/ReadingLibrary";
import { readingTypes, readingSets } from "@/lib/server/reading-catalog";
export const metadata = { title: "Ôn tập TOPIK theo từng dạng" };
export default function Page() {
  return <ReadingLibrary types={readingTypes} sets={readingSets} />;
}
