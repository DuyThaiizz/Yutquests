import { describe, expect, it } from "vitest";
import { access } from "node:fs/promises";
import { POST } from "../app/api/writing/submit/route";
import { grammarPoints, publicWritingPrompt } from "./writing";
import { writingExercises } from "./server/writing-catalog";

const request = (body: unknown) =>
  POST(
    new Request("http://localhost/api/writing/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );

describe("TOPIK writing corpus and submission", () => {
  it("publishes 50 scanned question 51 prompts and 35 question 52 passages with complete guidance", async () => {
    expect(writingExercises.filter((item) => item.kind === 51)).toHaveLength(
      50,
    );
    expect(writingExercises.filter((item) => item.kind === 52)).toHaveLength(
      35,
    );
    expect(new Set(writingExercises.map((item) => item.id)).size).toBe(85);
    const grammarIds = new Set(grammarPoints.map((point) => point.id));
    for (const item of writingExercises) {
      expect(item.source).toBeTruthy();
      expect(item.page).toBeGreaterThan(0);
      for (const gap of ["ㄱ", "ㄴ"] as const) {
        expect(item.answers[gap].length).toBeGreaterThan(2);
        expect(item.explanations[gap].length).toBeGreaterThan(35);
      }
      for (const id of item.grammar) expect(grammarIds.has(id)).toBe(true);
      if (item.kind === 51) await access(`public${item.image}`);
      else {
        expect(item.prompt?.match(/\(ㄱ\)/g)).toHaveLength(1);
        expect(item.prompt?.match(/\(ㄴ\)/g)).toHaveLength(1);
        expect(item.answerPage).toBeGreaterThan(0);
        await access(`public${item.sourceImage}`);
        await access(`public${item.answerImage}`);
      }
      const publicItem = publicWritingPrompt(item);
      expect(publicItem).not.toHaveProperty("answers");
      expect(publicItem).not.toHaveProperty("explanations");
      expect(publicItem).not.toHaveProperty("answerSource");
      expect(publicItem).not.toHaveProperty("answerPage");
    }
  });

  it("only returns a reference after a complete submission, without claiming exact-match grading", async () => {
    for (const id of ["51-1", "52-70"] as const) {
      const response = await request({
        id,
        answers: { ㄱ: "제 답", ㄴ: "다른 답" },
      });
      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("no-store");
      const result = await response.json();
      expect(result.id).toBe(id);
      expect(result.answers.ㄱ).toBeTruthy();
      expect(result.explanations.ㄴ).toBeTruthy();
      expect(result).not.toHaveProperty("correct");
    }
  });

  it("rejects missing, oversized and unknown submissions", async () => {
    expect(
      (await request({ id: "51-1", answers: { ㄱ: "", ㄴ: "답" } })).status,
    ).toBe(400);
    expect(
      (
        await request({
          id: "51-1",
          answers: { ㄱ: "x".repeat(1001), ㄴ: "답" },
        })
      ).status,
    ).toBe(400);
    expect(
      (await request({ id: "51-999", answers: { ㄱ: "답", ㄴ: "답" } })).status,
    ).toBe(404);
  });

  it("flags source inconsistencies instead of treating PDF typos as model grammar", () => {
    expect(
      writingExercises.find((item) => item.id === "52-78")?.answers.ㄴ,
    ).toBe("없어지기 때문이다");
    expect(
      writingExercises.find((item) => item.id === "52-78")?.reviewNote,
    ).toBeTruthy();
    expect(
      writingExercises.find((item) => item.id === "52-102")?.answers.ㄱ,
    ).toBe("받지 않아서");
    expect(
      writingExercises.find((item) => item.id === "52-94")?.reviewNote,
    ).toBeTruthy();
  });
});
