import { describe, it, expect } from "vitest";
import {
  originalGrammar,
  originalVocabulary,
  importedVocabulary,
  topikLessons,
  sources,
} from "./source-catalog";
import { vocabularySchema } from "./models";
import {
  freshStudyData,
  parseStudyData,
  serializeStudyData,
  recordReview,
  choicesFor,
} from "./learning";
describe("Complete imported PDF corpus", () => {
  it("preserves all 2662 vocabulary and 148 grammar source indexes without duplicates", () => {
    expect(originalVocabulary.map((row) => row.index)).toEqual(
      Array.from({ length: 2662 }, (_, i) => i + 1),
    );
    expect(originalGrammar.map((row) => row.index)).toEqual(
      Array.from({ length: 148 }, (_, i) => i + 1),
    );
  });
  it("quarantines exactly the one missing meaning without inventing content", () => {
    expect(
      originalVocabulary.filter((row) => !row.english).map((row) => row.index),
    ).toEqual([2334]);
    expect(importedVocabulary).toHaveLength(2661);
    expect(
      importedVocabulary.find((word) => word.sourceIndex === 2334),
    ).toBeUndefined();
  });
  it("every learning item preserves original Hangul, English and page provenance", () => {
    for (const word of importedVocabulary) {
      expect(vocabularySchema.safeParse(word).success).toBe(true);
      const source = originalVocabulary[word.sourceIndex! - 1];
      expect([word.korean, word.meaning, word.sourcePage]).toEqual([
        source.korean,
        source.english,
        source.page,
      ]);
      expect(word.meaningLanguage).toBe("en");
      expect(word.level).toBeNull();
    }
  });
  it("groups every usable word into exactly one of 67 lessons of at most 40 items", () => {
    expect(topikLessons).toHaveLength(67);
    for (const lesson of topikLessons) {
      const words = importedVocabulary.filter(
        (word) => word.lessonId === lesson.id,
      );
      expect(words.length).toBeGreaterThan(0);
      expect(words.length).toBeLessThanOrEqual(40);
    }
    expect(new Set(importedVocabulary.map((word) => word.id)).size).toBe(2661);
  });
  it("preserves all original grammar examples and source page bounds", () => {
    for (const grammar of originalGrammar) {
      expect(grammar.pattern).toMatch(/[가-힣ㄱ-ㅎ]/);
      expect(grammar.example).toMatch(/[가-힣]/);
      expect(grammar.meaning.length).toBeGreaterThan(0);
      expect(grammar.translation.length).toBeGreaterThan(0);
      expect(grammar.page).toBeGreaterThanOrEqual(1);
      expect(grammar.page).toBeLessThanOrEqual(5);
    }
    expect(sources.map((item) => item.pages)).toEqual([34, 5]);
  });
  it("upgrades yesterday’s local progress without deleting reviews or custom edits", () => {
    let data = freshStudyData();
    data = {
      ...data,
      vocabulary: data.vocabulary.filter((word) => !word.sourceId),
    };
    data = recordReview(
      data,
      "greetings-1",
      "good",
      new Date("2026-09-17T08:00:00Z"),
    );
    data.vocabulary[0] = {
      ...data.vocabulary[0],
      meaning: "Lời chào tùy chỉnh",
    };
    const migrated = parseStudyData(JSON.stringify(data));
    expect(migrated.reviews["greetings-1"]).toBeDefined();
    expect(
      migrated.vocabulary.find((word) => word.id === "greetings-1")?.meaning,
    ).toBe("Lời chào tùy chỉnh");
    expect(migrated.vocabulary.filter((word) => word.sourceId)).toHaveLength(
      2661,
    );
  });
  it("stores small changes rather than writing the whole PDF corpus on every answer", () => {
    const data = recordReview(
      freshStudyData(),
      "topik-v-1",
      "good",
      new Date("2026-09-18T08:00:00Z"),
    );
    const raw = serializeStudyData(data);
    expect(raw.length).toBeLessThan(2000);
    expect(parseStudyData(raw)).toEqual(data);
  });
  it("does not resurrect a withdrawn imported word when restoring storage", () => {
    const data = freshStudyData();
    data.vocabulary = data.vocabulary.map((word) =>
      word.id === "topik-v-1" ? { ...word, status: "archived" } : word,
    );
    expect(
      parseStudyData(serializeStudyData(data)).vocabulary.find(
        (word) => word.id === "topik-v-1",
      )?.status,
    ).toBe("archived");
  });
  it("keeps answer choices in English for the English source corpus", () => {
    const data = freshStudyData();
    const word = importedVocabulary[0];
    const choices = choicesFor(word, data.vocabulary, () => 0.5);
    expect(choices).toHaveLength(4);
    expect(
      choices.every((choice) =>
        importedVocabulary.some((item) => item.meaning === choice),
      ),
    ).toBe(true);
  });
});
