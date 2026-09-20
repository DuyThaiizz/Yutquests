import { describe, it, expect } from "vitest";
import { access } from "node:fs/promises";
import { gradeReading } from "./reading";
import {
  readingSets,
  readingAnswerSets,
  readingExplanations,
  readingTypes,
  loadReadingPages,
} from "./server/reading-catalog";
import { POST } from "../app/api/reading/submit/route";
const set = readingAnswerSets.find((s) => s.id === "reading-1-35")!;
const send = (body: unknown) =>
  POST(
    new Request("http://localhost/api/reading/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
describe("Imported reading corpus and grading", () => {
  it("covers 18 types, eight exams and 396 usable questions without duplicated exam/question identities", () => {
    expect(readingTypes).toHaveLength(18);
    expect(readingSets).toHaveLength(144);
    expect(new Set(readingSets.map((s) => s.exam)).size).toBe(8);
    const ids = readingSets.flatMap((s) =>
      s.numbers.map((n) => `${s.exam}-${n}`),
    );
    expect(ids).toHaveLength(396);
    expect(new Set(ids).size).toBe(396);
    expect(Object.keys(readingExplanations).sort()).toEqual(ids.sort());
    for (const key of ids) {
      expect(readingExplanations[key].reason.length).toBeGreaterThan(50);
      expect(readingExplanations[key].elimination.length).toBeGreaterThan(50);
    }
  });
  it("keeps the appended exam 35 chart in its correct type and isolates broken source pages", () => {
    expect(
      readingSets.find((s) => s.id === "reading-3a-35")?.pages[0],
    ).toMatchObject({ id: "10-09", page: 9 });
    expect(readingSets.find((s) => s.id === "reading-13-36")?.numbers).toEqual([
      39,
    ]);
    expect(readingSets.find((s) => s.id === "reading-16-41")?.numbers).toEqual(
      [],
    );
    expect(readingSets.find((s) => s.id === "reading-16-47")?.pages[0].id).toBe(
      "08-05",
    );
  });
  it("validates every selectable page and its rendered original asset", async () => {
    for (const s of readingSets) {
      const pages = await loadReadingPages(s);
      expect(pages.length).toBe(s.pages.length);
      for (const page of pages) {
        await access(`public/reading/${page.id}.webp`);
        for (const w of page.words) {
          expect(w.x).toBeGreaterThanOrEqual(0);
          expect(w.y).toBeGreaterThanOrEqual(0);
          expect(w.x + w.width).toBeLessThanOrEqual(page.width + 2);
          expect(w.y + w.height).toBeLessThanOrEqual(page.height + 2);
        }
      }
    }
  });
  it("does not send answer keys or explanations in the public set model", () => {
    for (const s of readingSets) {
      expect(s).not.toHaveProperty("answers");
      expect(s).not.toHaveProperty("explanations");
    }
  });
  it("grades right, wrong and omitted answers with per-question explanations", () => {
    const a = set.answers["1"].answer;
    const wrong = (set.answers["2"].answer % 4) + 1;
    const result = gradeReading(
      set,
      { "1": a, "2": wrong },
      set.answers,
      readingExplanations,
    );
    expect(result.correct).toBe(1);
    expect(result.total).toBe(4);
    expect(result.rows[2].chosen).toBeNull();
    expect(result.rows[0].explanation).toBeTruthy();
  });
  it.each<Record<string, number>>([
    { "50": 1 },
    { "01": 1 },
    { "1": 5 },
    { "1": 1.5 },
  ])("rejects forged question or option: %j", (answers) => {
    expect(() =>
      gradeReading(set, answers, set.answers, readingExplanations),
    ).toThrow();
  });
  it("returns a no-store result through the real submission route", async () => {
    const res = await send({
      setId: set.id,
      answers: { "1": set.answers["1"].answer },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect((await res.json()).correct).toBe(1);
  });
  it.each([
    ["unknown", {}, 404],
    ["reading-16-41", {}, 422],
    ["reading-13-36", { "40": 1 }, 400],
    ["reading-1-35", { "1": 0 }, 400],
  ])("protects %s from invalid submissions", async (setId, answers, status) => {
    expect((await send({ setId, answers })).status).toBe(status);
  });
  it("rejects malformed JSON", async () => {
    expect(
      (
        await POST(
          new Request("http://localhost", { method: "POST", body: "{bad" }),
        )
      ).status,
    ).toBe(400);
  });
  it("enforces bytes even when content-length is absent", async () => {
    expect(
      (
        await POST(
          new Request("http://localhost", {
            method: "POST",
            body: "한".repeat(3000),
          }),
        )
      ).status,
    ).toBe(413);
  });
});
