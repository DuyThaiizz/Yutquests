import { z } from "zod";
import type { StudyData, Vocabulary } from "./models";
export const noteSchema = z.object({
  id: z.string().min(1).max(95),
  term: z.string().trim().min(1).max(100),
  meaning: z.string().trim().max(300),
  meaningLanguage: z.enum(["vi", "en"]).default("vi"),
  context: z.string().max(1000),
  source: z.string().max(500),
  createdAt: z.string().datetime(),
});
export const deckSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(80),
  noteIds: z.array(z.string()).max(5000),
});
export type StudyNote = z.infer<typeof noteSchema>;
export type PersonalDeck = z.infer<typeof deckSchema>;
export function normalizedTerm(value: string) {
  return value.normalize("NFC").trim().replace(/\s+/g, " ");
}
export function saveNote(notes: StudyNote[], note: StudyNote): StudyNote[] {
  const parsed = noteSchema.parse({ ...note, term: normalizedTerm(note.term) });
  const existing = notes.find(
    (item) =>
      normalizedTerm(item.term) === parsed.term && item.id !== parsed.id,
  );
  if (existing)
    throw new Error(
      "Từ này đã có trong mục từ vựng chưa biết. Hãy chỉnh sửa mục đã lưu.",
    );
  return notes.some((item) => item.id === parsed.id)
    ? notes.map((item) => (item.id === parsed.id ? parsed : item))
    : [...notes, parsed];
}

export function applyNote(data: StudyData, note: StudyNote): StudyData {
  const parsed = noteSchema.parse({ ...note, term: normalizedTerm(note.term) });
  if (data.notes.length >= 5000 && !data.notes.some((n) => n.id === parsed.id))
    throw new Error("Sổ đã đạt giới hạn 5.000 từ.");
  const notes = saveNote(data.notes, parsed);
  const card: Vocabulary = {
    id: `note-${parsed.id}`,
    lessonId: "personal",
    korean: parsed.term,
    meaning: parsed.meaning || "Chưa tra nghĩa",
    meaningLanguage: parsed.meaningLanguage,
    romanization: "",
    example: parsed.context.slice(0, 500),
    translation: "",
    wordType: "",
    level: null,
    status: parsed.meaning ? "published" : "draft",
    sourcePage: null,
  };
  return {
    ...data,
    notes,
    vocabulary: [...data.vocabulary.filter((w) => w.id !== card.id), card],
  };
}
export function applyDeck(data: StudyData, deck: PersonalDeck): StudyData {
  const parsed = deckSchema.parse(deck);
  if (data.decks.length >= 200 && !data.decks.some((d) => d.id === parsed.id))
    throw new Error("Đã đạt giới hạn 200 bộ thẻ.");
  if (
    !parsed.noteIds.length ||
    parsed.noteIds.some((id) => !data.notes.some((n) => n.id === id))
  )
    throw new Error("Chọn ít nhất một từ đã lưu cho bộ thẻ.");
  return {
    ...data,
    decks: [
      ...data.decks.filter((d) => d.id !== parsed.id),
      { ...parsed, noteIds: [...new Set(parsed.noteIds)] },
    ],
  };
}
export function noteContext(text: string, term: string) {
  const index = text.indexOf(term);
  const start = Math.max(0, index - 80);
  return text.slice(start, start + 240).trim() || term;
}
