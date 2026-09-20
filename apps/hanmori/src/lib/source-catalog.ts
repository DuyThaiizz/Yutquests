import vocabularySource from "../content/topik-vocabulary.json";
import grammarSource from "../content/topik-grammar.json";
import sourceManifest from "../content/sources.json";
import type { Lesson, Vocabulary } from "./models";

export const originalVocabulary = vocabularySource;
export const originalGrammar = grammarSource;
export const sources = sourceManifest;
export const TOPIK_GROUP_SIZE = 40;
export function topikLessonId(index: number) {
  return `topik-${String(Math.ceil(index / TOPIK_GROUP_SIZE)).padStart(2, "0")}`;
}
export function levelLabel(item: { level: number | null }) {
  return item.level === null ? "TOPIK II" : `TOPIK ${item.level}`;
}
export const topikLessons: Lesson[] = Array.from(
  { length: Math.ceil(vocabularySource.length / TOPIK_GROUP_SIZE) },
  (_, group) => {
    const start = group * TOPIK_GROUP_SIZE + 1,
      end = Math.min(start + TOPIK_GROUP_SIZE - 1, vocabularySource.length);
    const first = vocabularySource[start - 1],
      last = vocabularySource[end - 1];
    return {
      id: topikLessonId(start),
      title: `Từ vựng ${start}–${end}`,
      korean: `${first.korean} · ${last.korean}`,
      description: `Nhóm ${group + 1} · Từ ${first.korean} đến ${last.korean}. Giữ nguyên nghĩa tiếng Anh trong tài liệu.`,
      level: null,
      category: "TOPIK II · Hàn–Anh",
      motif: group % 3 === 0 ? "book" : group % 3 === 1 ? "mountain" : "flower",
      color: ["blue", "sage", "butter", "peach", "lavender"][group % 5],
      sourceId: "topik-vocabulary",
    };
  },
);
// One original row (2334, 취업) has no English meaning. Preserve it in the
// source browser, but never generate a flashcard/quiz with an invented answer.
export const importedVocabulary: Vocabulary[] = vocabularySource
  .filter((row) => row.english.length > 0)
  .map((row) => ({
    id: `topik-v-${row.index}`,
    lessonId: topikLessonId(row.index),
    korean: row.korean,
    meaning: row.english,
    romanization: "",
    example: "",
    translation: "",
    wordType: "",
    level: null,
    status: "published",
    sourcePage: row.page,
    sourceId: "topik-vocabulary",
    sourceIndex: row.index,
    meaningLanguage: "en",
  }));
export type SourceGrammar = (typeof grammarSource)[number];
