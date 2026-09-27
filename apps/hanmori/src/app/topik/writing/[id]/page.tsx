import { notFound } from "next/navigation";
import { WritingExercise } from "@/components/WritingExercise";
import {
  findWritingExercise,
  writingExercises,
} from "@/lib/server/writing-catalog";
import { publicWritingPrompt } from "@/lib/writing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = findWritingExercise(id);
  return {
    title: item ? `${item.title} · Luyện viết TOPIK` : "Bài viết TOPIK",
  };
}
export function generateStaticParams() {
  return writingExercises.map(({ id }) => ({ id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = findWritingExercise(id);
  if (!item) notFound();
  const siblings = writingExercises.filter(
    (candidate) => candidate.kind === item.kind,
  );
  const index = siblings.findIndex((candidate) => candidate.id === id);
  return (
    <WritingExercise
      key={id}
      exercise={publicWritingPrompt(item)}
      previous={siblings[index - 1]?.id}
      next={siblings[index + 1]?.id}
    />
  );
}
