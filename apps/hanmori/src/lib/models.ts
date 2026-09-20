import { z } from "zod";
import { noteSchema, deckSchema } from "./personal-study";

// null means the source specifies TOPIK II / Intermediate, not an exact TOPIK level.
export const levelSchema = z.number().int().min(1).max(6).nullable();
export const vocabularySchema = z.object({
  id: z.string().min(1).max(100),
  lessonId: z.string().min(1).max(100),
  korean: z.string().trim().min(1).max(100),
  meaning: z.string().trim().min(1).max(300),
  romanization: z.string().max(150).default(""),
  example: z.string().max(500).default(""),
  translation: z.string().max(500).default(""),
  wordType: z.string().max(50).default("Danh từ"),
  level: levelSchema,
  status: z.enum(["draft", "published", "archived"]),
  sourcePage: z.number().int().positive().nullable().default(null),
  sourceId: z.enum(["topik-vocabulary", "topik-grammar"]).optional(),
  sourceIndex: z.number().int().positive().optional(),
  meaningLanguage: z.enum(["vi", "en"]).optional(),
});
export type Vocabulary = z.infer<typeof vocabularySchema>;
export type Grade = "again" | "hard" | "good" | "easy";
export type View =
  | "home"
  | "courses"
  | "review"
  | "practice"
  | "notebook"
  | "progress"
  | "admin"
  | "account";
export interface Lesson {
  id: string;
  title: string;
  korean: string;
  description: string;
  level: number | null;
  category: string;
  motif: "sun" | "tea" | "home" | "flower" | "book" | "mountain";
  color: string;
  sourceId?: "topik-vocabulary";
  grammar?: {
    pattern: string;
    explanation: string;
    example: string;
    translation: string;
  };
}
export const reviewSchema = z.object({
  due: z.string().datetime(),
  interval: z.number().finite().nonnegative(),
  repetitions: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
  lastReviewed: z.string().datetime(),
});
export type ReviewState = z.infer<typeof reviewSchema>;
export const activitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  words: z.array(z.string()).max(2000),
  correctWords: z.array(z.string()).max(2000),
});
export const studyDataSchema = z.object({
  version: z.literal(1),
  name: z.string().max(60),
  saved: z.array(z.string()).max(10000),
  reviews: z.record(z.string(), reviewSchema),
  days: z.array(activitySchema).max(3650),
  vocabulary: z.array(vocabularySchema).max(10000),
  dailyGoal: z.union([z.literal(5), z.literal(10), z.literal(20)]),
  notes: z.array(noteSchema).max(5000).default([]),
  decks: z.array(deckSchema).max(200).default([]),
});
export type StudyData = z.infer<typeof studyDataSchema>;
export interface Member {
  tenantId: string;
  role: "student" | "teacher" | "admin";
  userId: string;
}
export const extractionSchema = z.object({
  items: z
    .array(
      z.object({
        korean: z.string().trim().min(1).max(100),
        meaning: z.string().trim().min(1).max(300),
        meaningLanguage: z.enum(["vi", "en"]).optional(),
        romanization: z.string().max(150).default(""),
        example: z.string().max(500).default(""),
        translation: z.string().max(500).default(""),
        wordType: z.string().max(50).default(""),
        sourcePage: z.number().int().min(1).max(30),
      }),
    )
    .min(1)
    .max(200),
});
