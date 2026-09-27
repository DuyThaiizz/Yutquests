"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, PenLine } from "lucide-react";
import type { ReadingType, ReadingSet } from "@/lib/reading";
export function ReadingLibrary({
  types,
  sets,
}: {
  types: ReadingType[];
  sets: ReadingSet[];
}) {
  const [typeId, setTypeId] = useState(types[0].id);
  const type = types.find((t) => t.id === typeId)!;
  return (
    <div className="page reading-library">
      <Link href="/library" className="text-link">
        ← Tủ sách TOPIK
      </Link>
      <header className="reading-intro">
        <div>
          <span className="eyebrow">유형별 연습 · ÔN TẬP THEO TỪNG DẠNG</span>
          <h1>
            Đọc kỹ hơn.
            <br />
            <em>Hiểu sâu hơn.</em>
          </h1>
          <p>
            Chọn một dạng, luyện một bài. Nộp bài để đối chiếu đáp án và học từ
            những chỗ chưa đúng.
          </p>
        </div>
        <div className="reading-mark" lang="ko">
          읽<br />기
        </div>
      </header>
      <div className="skill-tabs">
        <span className="active">
          <BookOpen size={20} /> Đọc hiểu · 읽기
        </span>
        <span>
          <Headphones size={20} /> Nghe <small>Sẽ phát triển</small>
        </span>
        <Link href="/topik/writing">
          <PenLine size={20} /> Viết · 쓰기
        </Link>
      </div>
      <label className="reading-type-select">
        Dạng bài đọc hiểu
        <select
          value={typeId}
          onChange={(event) => setTypeId(event.target.value)}
        >
          {types.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id.toUpperCase()} · {item.title} · Câu {item.start}–
              {item.end}
            </option>
          ))}
        </select>
      </label>
      <div className="reading-library-grid">
        <nav className="reading-types" aria-label="Dạng bài đọc hiểu">
          {types.map((t) => (
            <button
              key={t.id}
              aria-pressed={typeId === t.id}
              className={typeId === t.id ? "selected" : ""}
              onClick={() => setTypeId(t.id)}
            >
              <span>{t.id.toUpperCase()}</span>
              <div>
                <strong>{t.title}</strong>
                <small>
                  Câu {t.start}–{t.end}
                </small>
              </div>
            </button>
          ))}
        </nav>
        <section className="reading-set-list">
          <span className="eyebrow">
            DẠNG {type.id.toUpperCase()} · CÂU {type.start}–{type.end}
          </span>
          <h2>{type.title}</h2>
          <p>{type.description}</p>
          <div className="exam-grid">
            {sets
              .filter((s) => s.typeId === typeId)
              .sort((a, b) => a.exam - b.exam)
              .map((s) =>
                s.numbers.length === 0 ? (
                  <article className="exam-card" key={s.id}>
                    <span className="eyebrow">TOPIK II · CHỜ BỔ SUNG ĐỀ</span>
                    <h3>Kỳ {s.exam}</h3>
                    <p>{s.sourceNote}</p>
                  </article>
                ) : (
                  <Link
                    key={s.id}
                    href={`/topik/reading/${s.id}`}
                    className="exam-card"
                  >
                    <span className="eyebrow">TOPIK II</span>
                    <h3>Kỳ {s.exam}</h3>
                    <p>
                      {s.numbers.length} câu · {s.pages.length} trang đề gốc
                    </p>
                    <span>
                      {s.sourceNote ? "1 câu · nguồn thiếu 2 câu" : "Làm bài"}{" "}
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                ),
              )}
          </div>
          <div className="notice-panel">
            <p>
              Đề và bảng đáp án từ bộ tài liệu huongiu bạn đã cung cấp. Lời giải
              được biên soạn riêng, có dẫn chứng để bạn đối chiếu. Bôi đen chữ
              trên đề để ghi lại từ chưa biết.
            </p>
          </div>
          <Link className="button secondary" href="/notebook/unknown">
            Mở từ vựng chưa biết & bộ thẻ cá nhân
          </Link>
        </section>
      </div>
    </div>
  );
}
