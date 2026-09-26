"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowLeft,
  Layers,
  Bookmark,
  Volume2,
} from "lucide-react";
import { lessons } from "@/lib/catalog";
import { useStudy } from "./StudyProvider";
import { Motif } from "./Brand";
import { usePronunciation } from "./Pronunciation";
import type { Vocabulary } from "@/lib/models";
import { levelLabel } from "@/lib/source-catalog";
import { SourceTag } from "./SourceTag";
import { Pagination, usePagination } from "./Pagination";

export function Courses() {
  const { data } = useStudy();
  const [level, setLevel] = useState(0),
    [query, setQuery] = useState("");
  const filtered = lessons.filter(
    (lesson) =>
      (!level ||
        (level === 7 ? lesson.level === null : lesson.level === level)) &&
      `${lesson.title} ${lesson.korean} ${lesson.category}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const pagination = usePagination(filtered, 12, `${level}|${query}`);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">배움의 길 · KHÁM PHÁ</span>
          <h1>Mỗi bài học, một câu chuyện.</h1>
          <p>Bắt đầu từ những điều gần gũi, học theo nhịp riêng của bạn.</p>
        </div>
      </div>
      <div className="toolbar">
        <div className="tabs" aria-label="Lọc cấp độ">
          {[0, 7, 1, 2, 3, 4, 5, 6].map((item) => (
            <button
              key={item}
              aria-pressed={level === item}
              className={level === item ? "selected" : ""}
              onClick={() => setLevel(item)}
            >
              {item === 7
                ? "TOPIK II · Tài liệu"
                : item
                  ? `TOPIK ${item}`
                  : "Tất cả"}
            </button>
          ))}
        </div>
        <label className="search-field">
          <span className="sr-only">Tìm bài học</span>
          <Search size={17} />
          <input
            placeholder="Tìm chủ đề bạn muốn học…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className="catalog-count">
        {filtered.length} bài học{" "}
        {level > 3 && level < 7 ? "· Nội dung đang được biên soạn" : ""}
      </p>
      {filtered.length ? (
        <div className="lesson-grid course-grid">
          {pagination.items.map((lesson) => {
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
                key={lesson.id}
                className="lesson-card"
              >
                <div className={`lesson-art ${lesson.color}`}>
                  <span className="lesson-korean" lang="ko">
                    {lesson.korean}
                  </span>
                  <Motif kind={lesson.motif} />
                  <span className="lesson-number">
                    {lesson.category.toLocaleUpperCase("vi")}
                  </span>
                </div>
                <div className="lesson-body">
                  <div className="lesson-meta">
                    <span>{levelLabel(lesson)}</span>
                    <span>
                      {words.length} từ
                      {lesson.grammar ? " · 1 ngữ pháp" : " · Hàn–Anh"}
                    </span>
                  </div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                  <div className="lesson-bottom">
                    <span>
                      {learned
                        ? `${learned}/${words.length} từ đã học`
                        : "Khám phá bài học"}
                    </span>
                    <ArrowUpRight size={18} />
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
      ) : (
        <div className="empty-state">
          <span className="empty-symbol" lang="ko">
            배움
          </span>
          <h2>
            {level > 3 ? "Hành trình này sắp mở." : "Chưa tìm thấy bài học."}
          </h2>
          <p>
            {level > 3
              ? "Bạn có thể khám phá các bài học sơ cấp và trung cấp đang có."
              : "Thử tìm bằng một từ khác hoặc bỏ bộ lọc cấp độ."}
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setLevel(0);
              setQuery("");
            }}
          >
            Xem tất cả bài học
          </button>
        </div>
      )}
      <Pagination {...pagination} />
    </div>
  );
}
export function WordCard({ word }: { word: Vocabulary }) {
  const { data, ready, toggleSaved } = useStudy();
  const speak = usePronunciation();
  const saved = data.saved.includes(word.id);
  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <h3 lang="ko">{word.korean}</h3>
          <span className="romanization">{word.romanization}</span>
        </div>
        <div className="word-actions">
          <button
            aria-label={`Nghe ${word.korean}`}
            onClick={() => speak(word.korean)}
          >
            <Volume2 size={18} />
          </button>
          <button
            className={saved ? "saved" : ""}
            aria-pressed={saved}
            disabled={!ready}
            aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${word.korean}`}
            onClick={() => toggleSaved(word.id)}
          >
            <Bookmark size={18} />
          </button>
        </div>
      </div>
      <h4 lang={word.meaningLanguage ?? "vi"}>{word.meaning}</h4>
      <p>
        <span lang="ko" style={{ color: "var(--ink)", fontSize: "13px" }}>
          {word.example}
        </span>
        <span>{word.translation}</span>
      </p>
      {word.wordType && <span className="word-type">{word.wordType}</span>}
      <SourceTag word={word} />
    </article>
  );
}
export function LessonDetail({ id }: { id: string }) {
  const lesson = lessons.find((item) => item.id === id)!;
  const { data, ready } = useStudy();
  const words = data.vocabulary.filter(
    (word) => word.lessonId === id && word.status === "published",
  );
  return (
    <div className="page">
      <Link href="/courses" className="back-link">
        <ArrowLeft size={16} /> Khám phá bài học
      </Link>
      <div className={`lesson-header ${lesson.color}`}>
        <Motif kind={lesson.motif} />
        <div>
          <span className="eyebrow">
            {levelLabel(lesson)} · {words.length} TỪ VỰNG
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>
        </div>
        <Link className="button" href={`/review?lesson=${id}`}>
          <Layers size={17} /> Học bằng flashcard
        </Link>
      </div>
      <div className="section-heading">
        <h2>Từ vựng trong bài</h2>
        <Link href={`/practice?lesson=${id}`} className="text-link">
          Luyện tập bài này <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="word-list">
        {words.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
      {!ready ? (
        <p className="loading-text" role="status">
          Đang mở từ vựng trong bài…
        </p>
      ) : (
        !words.length && (
          <p className="empty-state">
            Bài học này chưa có từ vựng được xuất bản.
          </p>
        )
      )}
      {lesson.grammar && (
        <section className="grammar-card">
          <span className="eyebrow">문법 · MỘT CHÚT NGỮ PHÁP</span>
          <h3 lang="ko">{lesson.grammar.pattern}</h3>
          <p>{lesson.grammar.explanation}</p>
          <blockquote lang="ko">
            {lesson.grammar.example}
            <span lang="vi">{lesson.grammar.translation}</span>
          </blockquote>
        </section>
      )}
    </div>
  );
}
