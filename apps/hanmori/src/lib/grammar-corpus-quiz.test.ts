import { describe, expect, it } from "vitest";
import originalGrammar from "../content/topik-grammar.json";
import {
  GRAMMAR_CORPUS_SET_SIZE,
  grammarCorpusQuestions,
  grammarCorpusSets,
} from "./grammar-corpus-quiz";
import { gradeGrammarQuiz } from "./grammar-workshop";

describe("148-question TOPIK grammar bank", () => {
  it("covers every source entry exactly once in manageable sets", () => {
    expect(grammarCorpusQuestions).toHaveLength(originalGrammar.length);
    expect(grammarCorpusQuestions).toHaveLength(148);
    expect(grammarCorpusSets).toHaveLength(15);
    expect(grammarCorpusSets.flat().map((question) => question.id)).toEqual(
      originalGrammar.map((row) => "corpus-grammar-" + row.index),
    );
    expect(
      grammarCorpusSets
        .slice(0, -1)
        .every((set) => set.length === GRAMMAR_CORPUS_SET_SIZE),
    ).toBe(true);
    expect(grammarCorpusSets.at(-1)).toHaveLength(8);
  });

  it("keeps the original example, English translation and page, with one correct pattern", () => {
    for (const [index, question] of grammarCorpusQuestions.entries()) {
      const source = originalGrammar[index];
      expect(question.quiz.sentence).toBe(source.example);
      expect(question.translation).toBe(source.translation);
      expect(question.source.location).toContain("trang " + source.page);
      expect(question.quiz.choices).toHaveLength(4);
      expect(question.quiz.choices[question.quiz.correct].text).toBe(
        source.pattern,
      );
      expect(
        new Set(question.quiz.choices.map((choice) => choice.text)).size,
      ).toBe(4);
      expect(
        question.quiz.choices.every((choice) => choice.reason.length > 40),
      ).toBe(true);
      const meanings = question.quiz.choices.map((choice) => {
        const row = originalGrammar.find(
          (item) => item.pattern === choice.text,
        );
        expect(row).toBeDefined();
        return row!.meaning.trim().toLowerCase();
      });
      expect(new Set(meanings).size).toBe(4);
    }
  });

  it("grades a corpus set, including omissions and wrong answers", () => {
    const set = grammarCorpusSets[0];
    expect(gradeGrammarQuiz(set, {})).toBe(0);
    const answers = Object.fromEntries(
      set.map((item) => [item.id, item.quiz.correct]),
    );
    expect(gradeGrammarQuiz(set, answers)).toBe(10);
    answers[set[0].id] = (set[0].quiz.correct + 1) % 4;
    delete answers[set[1].id];
    expect(gradeGrammarQuiz(set, answers)).toBe(8);
  });
});
