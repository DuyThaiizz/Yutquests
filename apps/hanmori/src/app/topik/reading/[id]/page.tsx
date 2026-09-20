import { notFound } from "next/navigation";
import {
  readingSets,
  readingTypes,
  loadReadingPages,
  answerSource,
} from "@/lib/server/reading-catalog";
import { ReadingExercise } from "@/components/ReadingExercise";
export const metadata = { title: "Luyện đọc hiểu TOPIK" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const set = readingSets.find((s) => s.id === id);
  if (!set || !set.numbers.length) notFound();
  return (
    <ReadingExercise
      key={set.id}
      set={set}
      type={readingTypes.find((t) => t.id === set.typeId)!}
      pages={await loadReadingPages(set)}
      answerSource={answerSource}
    />
  );
}
