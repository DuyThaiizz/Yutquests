export const LEARNER_PROGRESS_KEY = "yutquest.learner-progress.v1";
export const LEARNER_PROGRESS_EVENT = "yutquest-progress";
export const DAILY_ANSWER_GOAL = 5;

export type DayProgress = {
  answered: number;
  correct: number;
  matches: number;
};

export type LearnerProgress = {
  version: 1;
  days: Record<string, DayProgress>;
  totalAnswered: number;
  totalCorrect: number;
  matchesPlayed: number;
  matchesWon: number;
  recentMistakes: string[];
};

export type LearnerStats = {
  todayKey: string;
  today: DayProgress;
  dailyGoal: number;
  streak: number;
  longestStreak: number;
  accuracy: number;
  matchesPlayed: number;
  matchesWon: number;
  recentMistakes: string[];
  lastSevenDays: Array<{ key: string; complete: boolean }>;
};

const emptyProgress = (): LearnerProgress => ({
  version: 1,
  days: {},
  totalAnswered: 0,
  totalCorrect: 0,
  matchesPlayed: 0,
  matchesWon: 0,
  recentMistakes: [],
});

export function vietnamDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function shiftDateKey(key: string, days: number) {
  const date = new Date(`${key}T12:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return vietnamDateKey(date);
}

function safeCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

export function parseLearnerProgress(value: unknown): LearnerProgress {
  if (!value || typeof value !== "object") return emptyProgress();
  const input = value as Partial<LearnerProgress>;
  const days: Record<string, DayProgress> = {};
  if (input.days && typeof input.days === "object") {
    Object.entries(input.days).forEach(([key, day]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !day || typeof day !== "object") return;
      const candidate = day as Partial<DayProgress>;
      days[key] = {
        answered: safeCount(candidate.answered),
        correct: safeCount(candidate.correct),
        matches: safeCount(candidate.matches),
      };
    });
  }
  return {
    version: 1,
    days,
    totalAnswered: safeCount(input.totalAnswered),
    totalCorrect: safeCount(input.totalCorrect),
    matchesPlayed: safeCount(input.matchesPlayed),
    matchesWon: safeCount(input.matchesWon),
    recentMistakes: Array.isArray(input.recentMistakes)
      ? input.recentMistakes.filter((item): item is string => typeof item === "string").slice(0, 8)
      : [],
  };
}

export function readLearnerProgress(): LearnerProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(LEARNER_PROGRESS_KEY);
    return raw ? parseLearnerProgress(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function saveLearnerProgress(progress: LearnerProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEARNER_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent(LEARNER_PROGRESS_EVENT, { detail: progress }));
}

export function learnerStats(progress = readLearnerProgress(), now = new Date()): LearnerStats {
  const todayKey = vietnamDateKey(now);
  const today = progress.days[todayKey] ?? { answered: 0, correct: 0, matches: 0 };
  const completed = (key: string) => (progress.days[key]?.answered ?? 0) >= DAILY_ANSWER_GOAL;
  const startKey = completed(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;
  let cursor = startKey;
  while (completed(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  const keys = Object.keys(progress.days).sort();
  let longestStreak = 0;
  let running = 0;
  let previous = "";
  keys.forEach((key) => {
    if (!completed(key)) return;
    running = previous && shiftDateKey(previous, 1) === key ? running + 1 : 1;
    longestStreak = Math.max(longestStreak, running);
    previous = key;
  });
  return {
    todayKey,
    today,
    dailyGoal: DAILY_ANSWER_GOAL,
    streak,
    longestStreak,
    accuracy: progress.totalAnswered ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0,
    matchesPlayed: progress.matchesPlayed,
    matchesWon: progress.matchesWon,
    recentMistakes: progress.recentMistakes,
    lastSevenDays: Array.from({ length: 7 }, (_, index) => {
      const key = shiftDateKey(todayKey, index - 6);
      return { key, complete: completed(key) };
    }),
  };
}

export function recordLearnerAnswer(expression: string, correct: boolean) {
  const progress = readLearnerProgress();
  const key = vietnamDateKey();
  const day = progress.days[key] ?? { answered: 0, correct: 0, matches: 0 };
  progress.days[key] = {
    ...day,
    answered: day.answered + 1,
    correct: day.correct + (correct ? 1 : 0),
  };
  progress.totalAnswered += 1;
  progress.totalCorrect += correct ? 1 : 0;
  progress.recentMistakes = correct
    ? progress.recentMistakes.filter((item) => item !== expression)
    : [expression, ...progress.recentMistakes.filter((item) => item !== expression)].slice(0, 8);
  saveLearnerProgress(progress);
  return learnerStats(progress);
}

export function recordLearnerMatch(won: boolean) {
  const progress = readLearnerProgress();
  const key = vietnamDateKey();
  const day = progress.days[key] ?? { answered: 0, correct: 0, matches: 0 };
  progress.days[key] = { ...day, matches: day.matches + 1 };
  progress.matchesPlayed += 1;
  progress.matchesWon += won ? 1 : 0;
  saveLearnerProgress(progress);
  return learnerStats(progress);
}

