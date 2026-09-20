import { LessonDetail } from "@/components/Courses";
import { lessons } from "@/lib/catalog";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!lessons.some((lesson) => lesson.id === id)) notFound();
  return <LessonDetail id={id} />;
}
