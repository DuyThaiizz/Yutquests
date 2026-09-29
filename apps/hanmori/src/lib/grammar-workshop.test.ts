import { describe, expect, it } from "vitest";
import {
  gradeGrammarQuiz,
  grammarLessons,
  grammarTopics,
  lessonsForTopic,
} from "./grammar-workshop";

describe("Grammar workshop", () => {
  it("offers four complete topics and a sourced explanation for every answer", () => {
    expect(grammarTopics).toHaveLength(4);
    expect(grammarLessons).toHaveLength(16);
    expect(new Set(grammarLessons.map((lesson) => lesson.id)).size).toBe(16);
    for (const topic of grammarTopics) {
      expect(lessonsForTopic(topic.id)).toHaveLength(4);
    }
    for (const lesson of grammarLessons) {
      expect(lesson.source.document).toBeTruthy();
      expect(lesson.source.location).toMatch(/slide|trang/);
      expect(lesson.example).toMatch(/[가-힣]/);
      expect(lesson.translation.length).toBeGreaterThan(12);
      expect(lesson.quiz.choices).toHaveLength(4);
      expect(
        new Set(lesson.quiz.choices.map((choice) => choice.text)).size,
      ).toBe(4);
      expect(lesson.quiz.correct).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correct).toBeLessThan(4);
      expect(
        lesson.quiz.choices.every((choice) => choice.reason.length > 20),
      ).toBe(true);
    }
  });

  it("grades unanswered and incorrect choices as zero while accepting the exact correct index", () => {
    const lessons = lessonsForTopic("connections");
    expect(gradeGrammarQuiz(lessons, {})).toBe(0);
    const right = Object.fromEntries(
      lessons.map((lesson) => [lesson.id, lesson.quiz.correct]),
    );
    expect(gradeGrammarQuiz(lessons, right)).toBe(4);
    const wrong = {
      ...right,
      [lessons[0].id]: (lessons[0].quiz.correct + 1) % 4,
    };
    expect(gradeGrammarQuiz(lessons, wrong)).toBe(3);
    delete wrong[lessons[1].id];
    expect(gradeGrammarQuiz(lessons, wrong)).toBe(2);
  });
});
