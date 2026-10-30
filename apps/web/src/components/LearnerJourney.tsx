"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LEARNER_PROGRESS_EVENT,
  learnerStats,
  parseLearnerProgress,
  readLearnerProgress,
  type LearnerStats,
} from "@/lib/learnerProgress";

function useLearnerStats() {
  const [stats, setStats] = useState<LearnerStats>(() =>
    learnerStats(parseLearnerProgress(null)),
  );
  useEffect(() => {
    const refresh = () => setStats(learnerStats(readLearnerProgress()));
    refresh();
    window.addEventListener(LEARNER_PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(LEARNER_PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return stats;
}

export function LearnerStatusChip() {
  const stats = useLearnerStats();
  return (
    <Link
      className="learner-status-chip"
      href="/#daily-journey"
      aria-label={`${stats.streak} ngày học liên tiếp, ${stats.today.answered} trên ${stats.dailyGoal} câu hôm nay`}
    >
      <span aria-hidden="true">연</span>
      <strong>{stats.streak}</strong>
      <small>ngày</small>
    </Link>
  );
}

export function LearnerJourney() {
  const stats = useLearnerStats();
  const progress = Math.min(
    100,
    Math.round((stats.today.answered / stats.dailyGoal) * 100),
  );
  const remaining = Math.max(0, stats.dailyGoal - stats.today.answered);
  return (
    <section
      className="learner-journey"
      id="daily-journey"
      aria-labelledby="journey-title"
      data-motion="section"
    >
      <div className="section-shell learner-journey-grid">
        <div className="journey-intro">
          <h2 id="journey-title">
            Hôm nay,
            <br />
            giữ nhịp.
          </h2>
          <p>
            {remaining
              ? `Trả lời thêm ${remaining} câu để hoàn thành mục tiêu hôm nay.`
              : "Mục tiêu hôm nay đã hoàn thành. Hẹn gặp bạn ở lượt ngày mai."}
          </p>
          <Link className="button" href="/game">
            {stats.today.answered ? "Tiếp tục chơi" : "Bắt đầu chơi"}
          </Link>
        </div>
        <div className="journey-board">
          <div className="journey-metric journey-streak">
            <span>Chuỗi hiện tại</span>
            <strong>{stats.streak}</strong>
            <small>ngày liên tiếp</small>
          </div>
          <div className="journey-metric">
            <span>Độ chính xác</span>
            <strong>{stats.accuracy}%</strong>
            <small>{stats.matchesPlayed} ván đã chơi</small>
          </div>
          <div
            className="daily-progress"
            style={
              { "--daily-progress": `${progress}%` } as React.CSSProperties
            }
          >
            <div>
              <span>Mục tiêu ngày</span>
              <strong>
                {Math.min(stats.today.answered, stats.dailyGoal)} /{" "}
                {stats.dailyGoal}
              </strong>
            </div>
            <i>
              <b />
            </i>
          </div>
          <div className="week-route" aria-label="Tiến độ bảy ngày gần nhất">
            {stats.lastSevenDays.map((day, index) => (
              <span className={day.complete ? "is-complete" : ""} key={day.key}>
                <i>{day.complete ? "✓" : index + 1}</i>
                <small>{index === 6 ? "Hôm nay" : day.key.slice(5)}</small>
              </span>
            ))}
          </div>
          {stats.recentMistakes.length > 0 && (
            <p className="review-note">
              <span>Cần ôn lại</span>
              <strong lang="ko">{stats.recentMistakes[0]}</strong>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
