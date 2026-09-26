"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Volume2,
  ArrowUpRight,
  Check,
  Flame,
  Sparkles,
} from "lucide-react";
import { useStudy } from "./StudyProvider";
import { lessons } from "@/lib/catalog";
import { studyStats, localDay } from "@/lib/learning-core";
import { Motif } from "./Brand";
import { usePronunciation } from "./Pronunciation";
import { CorpusHighlights } from "./Library";
export function Dashboard() {
  const { data } = useStudy();
  const stats = studyStats(data);
  const speak = usePronunciation();
  const dayWord =
    data.vocabulary.find(
      (word) => word.id === "feelings-4" && word.status === "published",
    ) ?? data.vocabulary.find((word) => word.status === "published");
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    return {
      date: localDay(date),
      label: new Intl.DateTimeFormat("vi", {
        weekday: "narrow",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date),
    };
  });
  return (
    <div className="page dashboard">
      <div className="page-heading">
        <div>
          <div className="eyebrow">반가워요 · RẤT VUI ĐƯỢC GẶP BẠN</div>
          <h1>
            Chào {data.name === "Bạn" ? "bạn" : data.name}, cùng học nhé
            <span className="greeting-flower">✳</span>
          </h1>
          <p>Một chút mỗi ngày. Một hành trình thật xa.</p>
        </div>
        <Link href="/courses" className="text-link heading-link">
          Lộ trình của mình <ArrowUpRight size={17} />
        </Link>
      </div>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="hero-label">
            <span /> HÀNH TRÌNH CHINH PHỤC TIẾNG HÀN
          </span>
          <h2>
            Mỗi từ mới,
            <br />
            một thế giới <em>mở ra.</em>
          </h2>
          <p>
            Gom từng từ nhỏ, chạm gần hơn với những
            <br className="desktop-break" /> câu chuyện và con người xứ Hàn.
          </p>
          <Link className="button hero-button" href="/courses">
            Bắt đầu hành trình <ArrowRight size={18} />
          </Link>
          <div className="hero-footnote">
            <span lang="ko">배움의 즐거움</span>
            <span>Niềm vui từ những điều mới</span>
          </div>
        </div>
        <div className="hero-stamp" lang="ko">
          매일
          <br />
          한걸음
        </div>
        <div className="hero-caption">
          MỘT CHÚT BÌNH YÊN. MỘT CHÚT TIẾNG HÀN.
        </div>
      </section>
      <div className="stats-strip">
        <div>
          <span className="stat-icon sage">
            <BookOpen size={21} />
          </span>
          <span>
            <strong>
              {stats.learned} <small>từ vựng</small>
            </strong>
            <p>Đã gặp trên hành trình</p>
          </span>
        </div>
        <div>
          <span className="stat-icon peach">
            <Layers size={21} />
          </span>
          <span>
            <strong>
              {stats.due} <small>từ đến hạn</small>
            </strong>
            <p>Ôn lại để nhớ lâu hơn</p>
          </span>
          <Link href="/review" aria-label="Ôn các từ đến hạn">
            <ArrowUpRight size={19} />
          </Link>
        </div>
        <div>
          <span className="stat-icon butter">
            <Target size={21} />
          </span>
          <span>
            <strong>
              {stats.today}/{data.dailyGoal} <small>từ hôm nay</small>
            </strong>
            <p>Mỗi bước nhỏ đều có ý nghĩa</p>
          </span>
          <div
            className="mini-ring"
            style={
              {
                "--progress": `${Math.min(100, (stats.today / data.dailyGoal) * 100)}%`,
              } as React.CSSProperties
            }
          >
            <span>
              {stats.today >= data.dailyGoal ? (
                <Check size={14} />
              ) : (
                <Sparkles size={14} />
              )}
            </span>
          </div>
        </div>
      </div>
      <CorpusHighlights />
      <div className="dashboard-grid">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">TỪ NHỮNG ĐIỀU GẦN GŨI</span>
              <h2>Hôm nay, khám phá gì?</h2>
            </div>
            <Link href="/courses" className="text-link">
              Tất cả bài học <ArrowRight size={16} />
            </Link>
          </div>
          <div className="lesson-grid home-lessons">
            {lessons.slice(0, 3).map((lesson, index) => {
              const words = data.vocabulary.filter(
                (word) =>
                  word.lessonId === lesson.id && word.status === "published",
              );
              const learned = words.filter(
                (word) => data.reviews[word.id],
              ).length;
              return (
                <Link
                  href={`/courses/${lesson.id}`}
                  className="lesson-card"
                  key={lesson.id}
                >
                  <div className={`lesson-art ${lesson.color}`}>
                    <span className="lesson-korean" lang="ko">
                      {lesson.korean}
                    </span>
                    <Motif kind={lesson.motif} />
                    <span className="lesson-number">
                      BÀI {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="lesson-body">
                    <div className="lesson-meta">
                      <span>TOPIK {lesson.level}</span>
                      <span>{words.length} từ vựng</span>
                    </div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                    <div className="lesson-bottom">
                      <span>
                        {learned
                          ? `${learned}/${words.length} từ đã học`
                          : "Bắt đầu khám phá"}
                      </span>
                      <ArrowUpRight size={19} />
                    </div>
                    <div className="progress-track">
                      <span
                        style={{
                          transform: `scaleX(${words.length ? learned / words.length : 0})`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/review" className="review-banner">
            <span className="review-banner-symbol" lang="ko">
              복습
            </span>
            <div>
              <h3>Gặp lại từ cũ, ghi nhớ thêm sâu.</h3>
              <p>Dành vài phút cùng bộ flashcard của bạn.</p>
            </div>
            <span className="round-arrow">
              <ArrowRight size={20} />
            </span>
          </Link>
        </section>
        <aside className="daily-aside">
          {dayWord && (
            <section className="daily-word">
              <div className="section-heading">
                <span className="eyebrow">오늘의 단어 · TỪ HÔM NAY</span>
                <span className="sparkle">✧</span>
              </div>
              <span className="daily-korean" lang="ko">
                {dayWord.korean}
              </span>
              <span className="romanization">{dayWord.romanization}</span>
              <h3>{dayWord.meaning}</h3>
              <p>
                {dayWord.example}
                <br />
                <span>{dayWord.translation}</span>
              </p>
              <button
                className="audio-button"
                onClick={() => speak(dayWord.korean)}
              >
                <Volume2 size={17} /> Nghe phát âm
              </button>
            </section>
          )}
          <section className="habit-card">
            <div className="section-heading">
              <h3>Giữ một thói quen nhỏ</h3>
              <Flame size={20} />
            </div>
            <div className="week-dots">
              {days.map((day, index) => {
                const done = data.days.some(
                  (item) => item.date === day.date && item.words.length >= 5,
                );
                return (
                  <div key={day.date}>
                    <span>{day.label}</span>
                    <span
                      className={`day-dot ${done ? "done" : ""} ${index === 6 ? "today" : ""}`}
                    >
                      {done ? <Check size={13} /> : index === 6 ? "·" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <p>
              {stats.streak
                ? `${stats.streak} ngày liên tiếp. Bạn đang làm rất tốt!`
                : "Ôn 5 từ để bắt đầu chuỗi ngày học của bạn."}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
