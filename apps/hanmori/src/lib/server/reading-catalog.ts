import { z } from "zod";
import { readFile } from "node:fs/promises";
import path from "node:path";
import catalog from "../../content/reading-catalog.json";
import explanations from "../../content/reading-explanations.json";
import {
  readingPageSchema,
  type ReadingSet,
  type Explanation,
} from "../reading";
export const readingTypes = catalog.types;
export const answerSource = catalog.answerSource;
export const readingSets: ReadingSet[] = catalog.sets.map(
  ({ answers, ...set }) => set,
);
export const readingAnswerSets: (ReadingSet & {
  answers: Record<string, { answer: number; page: number }>;
})[] = catalog.sets.map((set) => ({
  ...set,
  answers: z
    .record(
      z.string(),
      z.object({
        answer: z.number().int().min(1).max(4),
        page: z.number().int().positive(),
      }),
    )
    .parse(set.answers),
}));
export const readingExplanations: Record<string, Explanation> = explanations;
export async function loadReadingPages(set: ReadingSet) {
  return Promise.all(
    set.pages.map(async (page) =>
      readingPageSchema.parse(
        JSON.parse(
          await readFile(
            path.join(
              process.cwd(),
              "src/content/reading-pages",
              `${page.id}.json`,
            ),
            "utf8",
          ),
        ),
      ),
    ),
  );
}
