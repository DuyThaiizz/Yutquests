import { describe, it, expect } from "vitest";
import {
  applyNote,
  applyDeck,
  noteSchema,
  noteContext,
} from "./personal-study";
import {
  freshStudyData,
  parseStudyData,
  serializeStudyData,
  recordReview,
} from "./learning";
const note = noteSchema.parse({
  id: "test-note",
  term: "학교",
  meaning: "school",
  meaningLanguage: "en",
  context: "학교에 가요.",
  source: "/topik/reading/reading-1-35",
  createdAt: "2026-09-20T00:00:00Z",
});
describe("Personal notes to flashcards", () => {
  it("migrates old device data without dropping saved progress", () => {
    const old = {
      ...freshStudyData(),
      notes: undefined,
      decks: undefined,
      name: "Test",
      saved: ["v-1"],
    };
    const data = parseStudyData(JSON.stringify(old));
    expect(data.notes).toEqual([]);
    expect(data.decks).toEqual([]);
    expect(data.name).toBe("Test");
    expect(data.saved).toEqual(["v-1"]);
  });
  it("keeps notes without meaning out of published flashcards", () => {
    const data = applyNote(freshStudyData(), { ...note, meaning: "" });
    expect(data.notes).toHaveLength(1);
    expect(data.vocabulary.find((w) => w.id === "note-test-note")?.status).toBe(
      "draft",
    );
  });
  it("updates one stable card and preserves language, deck membership and review history through reload", () => {
    let data = applyNote(freshStudyData(), note);
    data = applyDeck(data, {
      id: "deck",
      name: "My reading",
      noteIds: [note.id, note.id],
    });
    data = recordReview(
      data,
      "note-test-note",
      "good",
      new Date("2026-09-20T00:00:00Z"),
    );
    data = applyNote(data, { ...note, meaning: "a school" });
    const restored = parseStudyData(serializeStudyData(data));
    expect(restored.decks[0].noteIds).toEqual([note.id]);
    expect(restored.notes[0].meaning).toBe("a school");
    expect(
      restored.vocabulary.filter((w) => w.id === "note-test-note"),
    ).toHaveLength(1);
    expect(
      restored.vocabulary.find((w) => w.id === "note-test-note"),
    ).toMatchObject({
      meaning: "a school",
      meaningLanguage: "en",
      status: "published",
    });
    expect(restored.reviews["note-test-note"].repetitions).toBe(1);
  });
  it("rejects duplicates including decomposed Hangul and blank terms", () => {
    const data = applyNote(freshStudyData(), note);
    expect(() =>
      applyNote(data, {
        ...note,
        id: "other",
        term: " " + note.term.normalize("NFD") + " ",
      }),
    ).toThrow();
    expect(() => applyNote(data, { ...note, term: "   " })).toThrow();
  });
  it("does not create a deck from stale or empty note selections", () => {
    expect(() =>
      applyDeck(freshStudyData(), {
        id: "d",
        name: "test",
        noteIds: ["missing"],
      }),
    ).toThrow();
    expect(() =>
      applyDeck(freshStudyData(), { id: "d", name: "test", noteIds: [] }),
    ).toThrow();
  });
  it("keeps the highlighted word in context near the end of a long page", () => {
    const context = noteContext("x".repeat(3000) + " 학교 yyy", "학교");
    expect(context).toContain("학교");
    expect(context.length).toBeLessThanOrEqual(1000);
  });
});
