import type { StudyData } from "./models";
import { studyDataSchema } from "./models";
import { seedVocabulary } from "./catalog";

export * from "./learning-core";
import { emptyStudyData } from "./learning-core";
export function freshStudyData(): StudyData {
  return { ...emptyStudyData(), vocabulary: seedVocabulary };
}
export function parseStudyData(raw: string): StudyData {
  const stored = studyDataSchema.parse(JSON.parse(raw));
  const known = new Set(stored.vocabulary.map((word) => word.id));
  // Add newly shipped lessons without discarding local progress or teacher edits.
  return {
    ...stored,
    vocabulary: [
      ...stored.vocabulary,
      ...seedVocabulary.filter((word) => !known.has(word.id)),
    ],
  };
}
const baseline = new Map(
  seedVocabulary.map((word) => [word.id, JSON.stringify(word)]),
);
export function serializeStudyData(data: StudyData): string {
  // The bundled corpus is immutable; persist only local additions and overrides.
  return JSON.stringify({
    ...data,
    vocabulary: data.vocabulary.filter(
      (word) => baseline.get(word.id) !== JSON.stringify(word),
    ),
  });
}
