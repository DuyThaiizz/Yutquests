"use client";
import Link from "next/link";
import { BookOpen, Flame, Sparkles } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { localDay, studyStats } from "@/lib/learning";
import { lessons } from "@/lib/catalog";
import { Motif } from "./Brand";
export function Progress() {
  const { data } = useStudy();
  const stats = studyStats(data);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    const day = localDay(date);
    return {
      day,
      label: new Intl.DateTimeFormat("vi", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date),
      count: data.days.find((item) => item.date === day)?.words.length ?? 0,
    };
  });
  const max = Math.max(5, ...days.map((day) => day.count));
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">나의 여정 · NHÌN LẠI CHẶNG ĐƯỜNG</span>
          <h1>Bạn đã đi được từng này rồi.</h1>
          <p>Không so với ai khác. Chỉ cần tốt hơn mình của hôm qua.</p>
        </div>
        <Link href="/account" className="text-link">
          Đổi mục tiêu hằng ngày
        </Link>
      </div>
      <div className="progress-grid">
        <div className="metric-card">
          <BookOpen size={23} />
          <strong>{stats.learned}</strong>
          <span>Từ vựng đã học / {stats.total} từ</span>
        </div>
        <div className="metric-card">
          <Flame size={23} />
          <strong>{stats.streak}</strong>
          <span>Ngày học liên tiếp</span>
        </div>
        <div className="metric-card">
          <Sparkles size={23} />
          <strong>{stats.xp}</strong>
          <span>XP từ bài luyện tập</span>
        </div>
      </div>
      <section className="chart-panel">
        <div className="section-heading">
          <h2>Nhịp học 7 ngày qua</h2>
          <span className="eyebrow">SỐ TỪ ĐÃ ÔN MỖI NGÀY</span>
        </div>
        <div
          className="bar-chart"
          role="img"
          aria-label={days
            .map((day) => `${day.label}: ${day.count} từ`)
            .join(", ")}
        >
          {days.map((day) => (
            <div className="bar-column" key={day.day}>
              <strong>{day.count}</strong>
              <div
                className="bar"
                style={{ height: `${(day.count / max) * 125}px` }}
              />
              <span>{day.label}</span>
            </div>
          ))}
        </div>
        <p className="storage-note">
          Ôn ít nhất 5 từ mỗi ngày để giữ streak. Ngày học tính theo giờ Việt
          Nam.
        </p>
      </section>
      <section className="chart-panel">
        <h2>Những chủ đề bạn đã đi qua</h2>
        {lessons.map((lesson) => {
          const words = data.vocabulary.filter(
            (word) =>
              word.lessonId === lesson.id && word.status === "published",
          );
          const learned = words.filter((word) => data.reviews[word.id]).length;
          return (
            <Link
              href={`/courses/${lesson.id}`}
              className="course-progress-row"
              key={lesson.id}
            >
              <Motif kind={lesson.motif} />
              <div>
                <h3>{lesson.title}</h3>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${words.length ? (learned / words.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <span>
                {learned}/{words.length} từ
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
