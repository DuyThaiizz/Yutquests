import { describe, it, expect } from "vitest";
import {
  prioritizeReview,
  freshStudyData,
  recordReview,
  scheduleReview,
  studyStats,
  localDay,
  normalizeAnswer,
  isCorrectAnswer,
  choicesFor,
  parseStudyData,
} from "./learning";
import { seedVocabulary } from "./catalog";
describe("Spaced repetition and real study state", () => {
  const now = new Date("2026-09-17T08:00:00Z");
  it("schedules forgotten words in ten minutes", () => {
    expect(scheduleReview(undefined, "again", now)).toMatchObject({
      due: "2026-09-17T08:10:00.000Z",
      interval: 0,
      lapses: 1,
      repetitions: 1,
    });
  });
  it.each([
    ["hard", 1],
    ["good", 1],
    ["easy", 4],
  ] as const)("schedules a new %s word after %d days", (grade, days) => {
    expect(scheduleReview(undefined, grade, now).interval).toBe(days);
  });
  it("lengthens remembered intervals and counts lapses", () => {
    const previous = scheduleReview(undefined, "easy", now);
    expect(scheduleReview(previous, "good", now).interval).toBe(10);
    expect(scheduleReview(previous, "again", now).lapses).toBe(1);
  });
  it("self-rating never awards competitive XP", () => {
    const data = recordReview(freshStudyData(), "greetings-1", "easy", now);
    expect(studyStats(data, now)).toMatchObject({
      xp: 0,
      learned: 1,
      today: 1,
    });
  });
  it("awards XP once per word per Vietnam day even after repeated submits", () => {
    let data = freshStudyData();
    for (let i = 0; i < 5; i++)
      data = recordReview(data, "greetings-1", "good", now, true);
    expect(studyStats(data, now).xp).toBe(10);
    expect(studyStats(data, now).today).toBe(1);
  });
  it("permits XP on a following local day", () => {
    let data = recordReview(freshStudyData(), "greetings-1", "good", now, true);
    data = recordReview(
      data,
      "greetings-1",
      "good",
      new Date("2026-09-17T17:01:00Z"),
      true,
    );
    expect(studyStats(data).xp).toBe(20);
  });
  it("uses the Vietnamese midnight boundary", () => {
    expect(localDay(new Date("2026-09-17T16:59:59Z"))).toBe("2026-09-17");
    expect(localDay(new Date("2026-09-17T17:00:00Z"))).toBe("2026-09-18");
  });
  it("does not build a streak from opening the site or repeated words", () => {
    let data = freshStudyData();
    for (let i = 0; i < 8; i++)
      data = recordReview(data, "greetings-1", "good", now);
    expect(studyStats(data, now).streak).toBe(0);
  });
  it("keeps yesterday’s completed streak until today ends", () => {
    let data = freshStudyData();
    for (const word of seedVocabulary.slice(0, 5))
      data = recordReview(data, word.id, "good", now);
    expect(studyStats(data, new Date("2026-09-18T08:00:00Z")).streak).toBe(1);
    expect(studyStats(data, new Date("2026-09-19T08:00:00Z")).streak).toBe(0);
  });
  it("excludes withdrawn content from review and stats without losing history", () => {
    let data = recordReview(freshStudyData(), "greetings-1", "again", now);
    data = {
      ...data,
      vocabulary: data.vocabulary.map((word) =>
        word.id === "greetings-1" ? { ...word, status: "archived" } : word,
      ),
    };
    expect(studyStats(data, new Date("2026-09-18T08:00:00Z")).due).toBe(0);
    expect(data.reviews["greetings-1"]).toBeDefined();
    expect(() => recordReview(data, "greetings-1", "good", now)).toThrow();
  });
  it("round-trips persisted progress and rejects corrupt input", () => {
    const data = recordReview(
      freshStudyData(),
      "greetings-1",
      "good",
      now,
      true,
    );
    expect(parseStudyData(JSON.stringify(data))).toEqual(data);
    expect(() =>
      parseStudyData('{"version":1,"reviews":{"x":{"interval":-1}}}'),
    ).toThrow();
  });
});
describe("Exercise generation and answer boundary", () => {
  it("normalizes composed/decomposed Korean and surrounding whitespace", () => {
    const word = seedVocabulary[0];
    expect(
      isCorrectAnswer(word, `  ${word.korean.normalize("NFD")}  `, "fill"),
    ).toBe(true);
  });
  it("does not remove Korean particles or accept romanization", () => {
    const word = seedVocabulary.find((item) => item.korean === "학교")!;
    expect(isCorrectAnswer(word, "학교에", "fill")).toBe(false);
    expect(isCorrectAnswer(word, "hakgyo", "fill")).toBe(false);
  });
  it("deduplicates distractors and includes exactly one correct answer", () => {
    const word = seedVocabulary[0];
    const choices = choicesFor(
      word,
      [...seedVocabulary, word, word],
      () => 0.5,
    );
    expect(choices).toHaveLength(4);
    expect(new Set(choices).size).toBe(4);
    expect(choices.filter((item) => item === word.meaning)).toHaveLength(1);
  });
  it("never includes an unpublished distractor", () => {
    const word = seedVocabulary[0];
    expect(
      choicesFor(word, [word, { ...seedVocabulary[1], status: "draft" }]),
    ).toEqual([word.meaning]);
  });
  it("preserves Vietnamese diacritics while normalizing case", () => {
    expect(normalizeAnswer("  Xin   Chào  ")).toBe("xin chào");
    expect(normalizeAnswer("Chao")).not.toBe(normalizeAnswer("Chào"));
  });
});

it("reaches unseen cards after a completed session instead of repeating the first ten", () => {
  const words = seedVocabulary.slice(0, 20);
  const reviews = Object.fromEntries(
    words
      .slice(0, 10)
      .map((w) => [
        w.id,
        scheduleReview(undefined, "good", new Date("2026-09-18T00:00:00Z")),
      ]),
  );
  expect(
    prioritizeReview(words, reviews)
      .slice(0, 10)
      .map((w) => w.id),
  ).toEqual(words.slice(10).map((w) => w.id));
  expect(words[0]).toEqual(seedVocabulary[0]);
});
