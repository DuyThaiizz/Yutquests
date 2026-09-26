"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  FileText,
  Search,
  ArrowRight,
  Bookmark,
  Volume2,
  ArrowUpRight,
  LibraryBig,
} from "lucide-react";
import {
  originalVocabulary,
  originalGrammar,
  topikLessons,
  TOPIK_GROUP_SIZE,
  type SourceGrammar,
} from "@/lib/source-catalog";
import { useStudy } from "./StudyProvider";
import { WordCard } from "./Courses";
import { usePronunciation } from "./Pronunciation";
import { Pagination, usePagination } from "./Pagination";

export function CorpusHighlights() {
  return (
    <section className="corpus-highlights">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TỦ SÁCH CỦA BẠN</span>
          <h2>Học liệu TOPIK II đã sẵn sàng.</h2>
        </div>
        <Link href="/library" className="text-link">
          Mở tủ sách <ArrowRight size={16} />
        </Link>
      </div>
      <div className="corpus-grid">
        <Link
          href="/library?tab=vocabulary"
          className="corpus-card vocab-corpus"
        >
          <div className="book-spine" lang="ko">
            <span>어휘</span>
            <small>TOPIK II</small>
          </div>
          <div>
            <span className="eyebrow">VOCABULARY · HÀN–ANH</span>
            <h3>
              2.662 từ.
              <br />
              Vạn điều để nói.
            </h3>
            <p>67 nhóm nhỏ · Theo đúng tài liệu gốc</p>
          </div>
          <ArrowUpRight size={22} />
        </Link>
        <Link
          href="/library?tab=grammar"
          className="corpus-card grammar-corpus"
        >
          <div className="book-spine" lang="ko">
            <span>문법</span>
            <small>TOPIK II</small>
          </div>
          <div>
            <span className="eyebrow">GRAMMAR · HÀN–ANH</span>
            <h3>
              Từ một cấu trúc,
              <br />
              mở rộng câu chuyện.
            </h3>
            <p>148 cấu trúc · Có ví dụ song ngữ</p>
          </div>
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </section>
  );
}
export function GrammarCard({ item }: { item: SourceGrammar }) {
  const { data, ready, toggleSaved } = useStudy();
  const speak = usePronunciation();
  const saved = data.saved.includes(`grammar-${item.index}`);
  return (
    <article className="grammar-entry">
      <div className="grammar-entry-top">
        <span className="grammar-index">
          {String(item.index).padStart(3, "0")}
        </span>
        <span className="eyebrow">TOPIK II · INTERMEDIATE</span>
        <button
          className={`icon-button ${saved ? "is-saved" : ""}`}
          aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ngữ pháp ${item.index}`}
          aria-pressed={saved}
          disabled={!ready}
          onClick={() => toggleSaved(`grammar-${item.index}`)}
        >
          <Bookmark size={17} />
        </button>
      </div>
      <h3 lang="ko">{item.pattern}</h3>
      <p className="grammar-meaning" lang="en">
        {item.meaning}
      </p>
      <div className="grammar-example">
        <span className="eyebrow">예문 · EXAMPLE</span>
        <p lang="ko">{item.example}</p>
        <p lang="en">{item.translation}</p>
        <button className="text-link" onClick={() => speak(item.example)}>
          <Volume2 size={15} /> Nghe câu ví dụ
        </button>
      </div>
      <p className="source-tag">
        TOPIK-Ⅱ-Grammar.pdf.pdf{" "}
        <span>
          · Trang {item.page} · #{item.index}
        </span>
      </p>
    </article>
  );
}
export function Library() {
  const params = useSearchParams();
  const tab = params.get("tab") === "grammar" ? "grammar" : "vocabulary";
  const initialPage = Number(params.get("sourcePage"));
  const { data } = useStudy();
  const [query, setQuery] = useState(""),
    [sourcePage, setSourcePage] = useState(
      Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 0,
    ),
    [group, setGroup] = useState("all");
  const words = data.vocabulary.filter(
    (word) =>
      word.sourceId === "topik-vocabulary" &&
      word.status === "published" &&
      (group === "all" || word.lessonId === group) &&
      (!sourcePage || word.sourcePage === sourcePage) &&
      `${word.korean} ${word.meaning} ${word.sourceIndex}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const grammar = originalGrammar.filter(
    (item) =>
      (!sourcePage || item.page === sourcePage) &&
      `${item.pattern} ${item.meaning} ${item.example} ${item.translation} ${item.index}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const vocabPagination = usePagination(
    words,
    12,
    `${query}|${sourcePage}|${group}`,
  );
  const grammarPagination = usePagination(
    grammar,
    12,
    `${query}|${sourcePage}`,
  );
  return (
    <div className="page library-page">
      <div className="library-heading">
        <div>
          <span className="eyebrow">나의 서재 · TỦ SÁCH TOPIK</span>
          <h1>
            Kiến thức mới.
            <br />
            <em>Hành trang dài lâu.</em>
          </h1>
          <p>
            Từ vựng, ngữ pháp và luyện đề theo dạng.
            <br />
            Giữ nguyên Hàn–Anh, để bạn dễ dàng đối chiếu.
          </p>
        </div>
        <div className="library-seal" lang="ko">
          배움
          <br />
          기록<span>TOPIK II</span>
        </div>
      </div>
      <Link href="/topik" className="reading-banner">
        <div>
          <span className="eyebrow">MỚI · 읽기</span>
          <strong>Ôn tập TOPIK theo từng dạng</strong>
          <p>
            18 nhóm đọc hiểu · 8 kỳ thi · Nộp bài, xem lời giải và ghi lại từ
            mới.
          </p>
        </div>
        <span>Vào luyện đọc →</span>
      </Link>
      <div className="library-tabs" aria-label="Loại tài liệu">
        <Link
          href="/library?tab=vocabulary"
          aria-current={tab === "vocabulary" ? "page" : undefined}
          className={tab === "vocabulary" ? "selected" : ""}
        >
          <BookOpen size={20} /> Từ vựng{" "}
          <span>{originalVocabulary.length.toLocaleString("vi")}</span>
        </Link>
        <Link
          href="/library?tab=grammar"
          aria-current={tab === "grammar" ? "page" : undefined}
          className={tab === "grammar" ? "selected" : ""}
        >
          <FileText size={20} /> Ngữ pháp <span>{originalGrammar.length}</span>
        </Link>
      </div>
      <div className="library-context">
        <LibraryBig size={18} />
        <p>
          {tab === "vocabulary"
            ? "topik-2662.pdf · 34 trang · 67 nhóm từ"
            : "TOPIK-Ⅱ-Grammar.pdf.pdf · 5 trang · 148 cấu trúc"}
          <span>
            Trình độ ghi trong tài liệu: TOPIK II — Intermediate. Không tự gán
            từng mục vào TOPIK 3, 4, 5 hay 6.
          </span>
        </p>
        {tab === "vocabulary" && (
          <Link
            className="button"
            href={`/review?lesson=${group === "all" ? "topik-01" : group}`}
          >
            Học flashcard <ArrowRight size={16} />
          </Link>
        )}
      </div>
      <div className="toolbar library-toolbar">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Tìm trong tài liệu</span>
          <input
            placeholder={
              tab === "grammar"
                ? "Tìm cấu trúc, ý nghĩa hoặc câu ví dụ…"
                : "Tìm từ Hàn, nghĩa Anh hoặc số thứ tự…"
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="compact-select">
          <span>Trang nguồn</span>
          <select
            aria-label="Trang nguồn"
            value={sourcePage}
            onChange={(event) => setSourcePage(Number(event.target.value))}
          >
            <option value={0}>Tất cả trang</option>
            {Array.from({ length: tab === "grammar" ? 5 : 34 }, (_, i) => (
              <option key={i} value={i + 1}>
                Trang {i + 1}
              </option>
            ))}
          </select>
        </label>
        {tab === "vocabulary" && (
          <label className="compact-select">
            <span>Nhóm học</span>
            <select
              aria-label="Nhóm học"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
            >
              <option value="all">Tất cả nhóm</option>
              {topikLessons.map((lesson, index) => (
                <option key={lesson.id} value={lesson.id}>
                  Nhóm {index + 1} · {index * TOPIK_GROUP_SIZE + 1}–
                  {Math.min((index + 1) * TOPIK_GROUP_SIZE, 2662)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <p className="catalog-count">
        {tab === "grammar" ? grammar.length : words.length}{" "}
        {tab === "grammar" ? "cấu trúc" : "từ có nghĩa"} phù hợp · Nguyên văn
        tài liệu Hàn–Anh
      </p>
      {tab === "grammar" ? (
        <>
          <div className="grammar-grid">
            {grammarPagination.items.map((item) => (
              <GrammarCard item={item} key={item.index} />
            ))}
          </div>
          <Pagination {...grammarPagination} />
        </>
      ) : (
        <>
          <div className="word-list library-words">
            {vocabPagination.items.map((word) => (
              <WordCard word={word} key={word.id} />
            ))}
          </div>
          <Pagination {...vocabPagination} />
          <div className="source-integrity-note">
            <InfoIcon />
            <p>
              <strong>Một chỗ trống trong bản gốc.</strong> Mục #2334 — 취업
              (trang 30) không có nghĩa tiếng Anh. Mục này được giữ trong ghi
              chú nguồn và chưa đưa vào flashcard hay bài tập để tránh tạo đáp
              án không có trong tài liệu.
            </p>
          </div>
        </>
      )}
      {(tab === "grammar" ? grammar.length : words.length) === 0 && (
        <div className="empty-state">
          <h2>Chưa tìm thấy mục phù hợp.</h2>
          <p>Thử đổi từ khóa hoặc bỏ bộ lọc trang và nhóm.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setSourcePage(0);
              setGroup("all");
            }}
          >
            Bỏ các bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
function InfoIcon() {
  return (
    <span className="info-letter" aria-hidden="true">
      i
    </span>
  );
}
