import writing52Raw from "@/content/writing-52.json";
import { z } from "zod";
import { writing51 } from "./writing-51";
import type { WritingExercise } from "@/lib/writing";

const writing52Schema = z
  .object({
    id: z.string().regex(/^52-\d{2,3}$/),
    kind: z.literal(52),
    number: z.number().int().min(1).max(999),
    title: z.string().min(1),
    prompt: z.string().min(30),
    source: z.string().min(1),
    sourceImage: z.string().regex(/^\/writing\/52-page-\d{2}\.webp$/),
    page: z.number().int().min(1).max(7),
    answerSource: z.string().min(1),
    answerImage: z.string().regex(/^\/writing\/52-key-\d{2}\.webp$/),
    answerPage: z.number().int().min(1).max(6),
    answers: z.object({ ㄱ: z.string().min(1), ㄴ: z.string().min(1) }),
    explanations: z.object({ ㄱ: z.string().min(30), ㄴ: z.string().min(30) }),
    grammar: z.array(z.string().min(1)).min(1),
    reviewNote: z.string().optional(),
  })
  .strict()
  .refine(
    (item) => item.id === `52-${item.number}`,
    "Mismatched TOPIK writing number",
  );
export const writing52: WritingExercise[] = z
  .array(writing52Schema)
  .length(35)
  .parse(writing52Raw);
export const writingExercises: WritingExercise[] = [...writing51, ...writing52];

export function findWritingExercise(id: string) {
  return writingExercises.find((exercise) => exercise.id === id);
}
