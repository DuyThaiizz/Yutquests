import { z } from "zod";
export const readingPageSchema = z.object({
  id: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  text: z.string(),
  words: z.array(
    z.object({
      text: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    }),
  ),
});
export type ReadingPage = z.infer<typeof readingPageSchema>;
export interface ReadingSet {
  id: string;
  typeId: string;
  exam: number;
  sourceNote?: string;
  numbers: number[];
  pages: { id: string; page: number; file: string }[];
}
export interface ReadingType {
  id: string;
  title: string;
  description: string;
  start: number;
  end: number;
}
export const submissionSchema = z.object({
  setId: z.string().max(60),
  answers: z.record(z.string(), z.number().int().min(1).max(4)),
});
export interface Explanation {
  reason: string;
  elimination: string;
  evidence?: string;
}
export interface ReadingResult {
  setId: string;
  correct: number;
  total: number;
  rows: {
    number: number;
    chosen: number | null;
    answer: number;
    answerPage: number;
    explanation: Explanation | null;
  }[];
}
export function gradeReading(
  set: ReadingSet,
  answers: Record<string, number>,
  key: Record<string, { answer: number; page: number }>,
  explanations: Record<string, Explanation>,
): ReadingResult {
  if (
    !set.numbers.length ||
    Object.entries(answers).some(
      ([n, v]) =>
        !set.numbers.map(String).includes(n) ||
        !Number.isInteger(v) ||
        v < 1 ||
        v > 4,
    )
  )
    throw new Error("Đáp án chứa câu ngoài bài học.");
  const rows = set.numbers.map((number) => ({
    number,
    chosen: answers[String(number)] ?? null,
    answer: key[String(number)].answer,
    answerPage: key[String(number)].page,
    explanation: explanations[`${set.exam}-${number}`] ?? null,
  }));
  return {
    setId: set.id,
    correct: rows.filter((r) => r.chosen === r.answer).length,
    total: rows.length,
    rows,
  };
}
