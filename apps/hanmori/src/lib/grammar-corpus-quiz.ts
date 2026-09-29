import originalGrammar from "../content/topik-grammar.json";
import type { GrammarQuizItem } from "./grammar-workshop";

export const GRAMMAR_CORPUS_SET_SIZE = 10;

type SourceRow = (typeof originalGrammar)[number];

function distinctMeaning(a: SourceRow, b: SourceRow) {
  return (
    a.meaning.trim().toLocaleLowerCase("en") !==
    b.meaning.trim().toLocaleLowerCase("en")
  );
}

function distractorsFor(target: SourceRow): SourceRow[] {
  const candidates = originalGrammar
    .filter((row) => row.index !== target.index && distinctMeaning(row, target))
    .sort(
      (a, b) =>
        Math.abs(a.index - target.index) - Math.abs(b.index - target.index) ||
        a.index - b.index,
    );
  const picked: SourceRow[] = [];
  for (const candidate of candidates) {
    if (picked.every((row) => distinctMeaning(row, candidate))) {
      picked.push(candidate);
      if (picked.length === 3) break;
    }
  }
  if (picked.length !== 3)
    throw new Error("Không đủ cấu trúc để tạo đáp án nhiễu.");
  return picked;
}

export const grammarCorpusQuestions: readonly GrammarQuizItem[] =
  originalGrammar.map((row) => {
    const correct = (row.index - 1) % 4;
    const options = distractorsFor(row);
    options.splice(correct, 0, row);
    return {
      id: "corpus-grammar-" + row.index,
      pattern: row.pattern,
      translation: row.translation,
      source: {
        document: "TOPIK-Ⅱ-Grammar.pdf.pdf",
        location: "trang " + row.page + ", mục #" + row.index,
      },
      quiz: {
        sentence: row.example,
        correct,
        choices: options.map((option) => ({
          text: option.pattern,
          reason:
            option.index === row.index
              ? "Đúng theo mục #" +
                row.index +
                ": " +
                row.pattern +
                " mang nghĩa “" +
                row.meaning +
                "”. Bản dịch của ví dụ: “" +
                row.translation +
                "”"
              : option.pattern +
                " ở mục #" +
                option.index +
                " mang nghĩa “" +
                option.meaning +
                "”. Tài liệu gắn câu ví dụ này với mục #" +
                row.index +
                ", không phải mục #" +
                option.index +
                ".",
        })),
      },
    };
  });

export const grammarCorpusSets: readonly (readonly GrammarQuizItem[])[] =
  Array.from(
    {
      length: Math.ceil(
        grammarCorpusQuestions.length / GRAMMAR_CORPUS_SET_SIZE,
      ),
    },
    (_, index) =>
      grammarCorpusQuestions.slice(
        index * GRAMMAR_CORPUS_SET_SIZE,
        (index + 1) * GRAMMAR_CORPUS_SET_SIZE,
      ),
  );
