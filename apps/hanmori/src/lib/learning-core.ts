import type { Grade, ReviewState, StudyData, Vocabulary } from "./models";

export const STORAGE_KEY = "hanmori-study-v1";
export function emptyStudyData(): StudyData {
  return {
    version: 1,
    name: "Bạn",
    saved: [],
    reviews: {},
    days: [],
    vocabulary: [],
    dailyGoal: 5,
    notes: [],
    decks: [],
  };
}

export function localDay(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function scheduleReview(
  previous: ReviewState | undefined,
  grade: Grade,
  now: Date,
): ReviewState {
  const oldInterval = previous?.interval ?? 0;
  const interval =
    grade === "again"
      ? 0
      : grade === "hard"
        ? Math.max(1, Math.ceil(oldInterval * 1.2))
        : grade === "good"
          ? Math.max(1, Math.ceil(oldInterval * 2.5))
          : Math.max(4, Math.ceil(oldInterval * 3));
  return {
    due: new Date(
      now.getTime() +
        (grade === "again" ? 10 * 60 * 1000 : interval * 86400000),
    ).toISOString(),
    interval,
    repetitions: (previous?.repetitions ?? 0) + 1,
    lapses: (previous?.lapses ?? 0) + (grade === "again" ? 1 : 0),
    lastReviewed: now.toISOString(),
  };
}
export function recordReview(
  data: StudyData,
  wordId: string,
  grade: Grade,
  now: Date,
  correctExercise = false,
): StudyData {
  if (
    !data.vocabulary.some(
      (word) => word.id === wordId && word.status === "published",
    )
  )
    throw new Error("Nội dung không còn được xuất bản.");
  const day = localDay(now);
  const existing = data.days.find((item) => item.date === day) ?? {
    date: day,
    words: [],
    correctWords: [],
  };
  const updated = {
    ...existing,
    words: [...new Set([...existing.words, wordId])],
    correctWords: correctExercise
      ? [...new Set([...existing.correctWords, wordId])]
      : existing.correctWords,
  };
  return {
    ...data,
    reviews: {
      ...data.reviews,
      [wordId]: scheduleReview(data.reviews[wordId], grade, now),
    },
    days: [...data.days.filter((item) => item.date !== day), updated].slice(
      -3650,
    ),
  };
}
export function studyStats(data: StudyData, now = new Date()) {
  const today = localDay(now),
    yesterday = localDay(new Date(now.getTime() - 86400000));
  const activeDays = new Set(
    data.days.filter((day) => day.words.length >= 5).map((day) => day.date),
  );
  let streak = 0;
  let cursor = activeDays.has(today) ? today : yesterday;
  while (activeDays.has(cursor)) {
    streak++;
    cursor = localDay(
      new Date(new Date(`${cursor}T12:00:00+07:00`).getTime() - 86400000),
    );
  }
  const words = data.vocabulary.filter((word) => word.status === "published");
  return {
    xp: data.days.reduce((sum, day) => sum + day.correctWords.length * 10, 0),
    streak,
    learned: words.filter((word) => data.reviews[word.id]).length,
    due: words.filter(
      (word) =>
        data.reviews[word.id] && new Date(data.reviews[word.id].due) <= now,
    ).length,
    today: data.days.find((day) => day.date === today)?.words.length ?? 0,
    total: words.length,
  };
}
export function normalizeAnswer(answer: string) {
  return answer
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("vi");
}
export function isCorrectAnswer(
  word: Vocabulary,
  answer: string,
  mode: "choice" | "fill",
) {
  return (
    normalizeAnswer(answer) ===
    normalizeAnswer(mode === "choice" ? word.meaning : word.korean)
  );
}
export function shuffled<T>(items: T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function choicesFor(
  word: Vocabulary,
  all: Vocabulary[],
  random = Math.random,
): string[] {
  const options = [
    ...new Set(
      all
        .filter(
          (item) =>
            item.status === "published" &&
            item.meaning !== word.meaning &&
            item.korean !== word.korean &&
            (item.meaningLanguage ?? "vi") === (word.meaningLanguage ?? "vi"),
        )
        .map((item) => item.meaning),
    ),
  ];
  return shuffled(
    [word.meaning, ...shuffled(options, random).slice(0, 3)],
    random,
  );
}

export function prioritizeReview(
  words: Vocabulary[],
  reviews: StudyData["reviews"],
): Vocabulary[] {
  return [...words].sort((a, b) =>
    (reviews[a.id]?.lastReviewed ?? "").localeCompare(
      reviews[b.id]?.lastReviewed ?? "",
    ),
  );
}
