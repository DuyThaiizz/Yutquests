"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { WordCard } from "./Courses";
import { originalGrammar } from "@/lib/source-catalog";
import { GrammarCard } from "./Library";
import { Pagination, usePagination } from "./Pagination";
export function Notebook() {
  const { data, ready } = useStudy();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState<"saved" | "learned" | "all" | "grammar">(
      "saved",
    );
  const words = data.vocabulary.filter(
    (word) =>
      word.status === "published" &&
      (filter === "all" ||
        (filter === "saved"
          ? data.saved.includes(word.id)
          : data.reviews[word.id])) &&
      `${word.korean} ${word.meaning} ${word.romanization}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const pagination = usePagination(words, 16, `${query}|${filter}`);
  const grammars = originalGrammar.filter(
    (item) =>
      data.saved.includes(`grammar-${item.index}`) &&
      `${item.pattern} ${item.meaning}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const grammarPagination = usePagination(grammars, 12, query);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">나의 단어장 · GÓP NHẶT TỪNG TỪ</span>
          <h1>Một cuốn sổ, rất riêng bạn.</h1>
          <p>Giữ lại những từ yêu thích và những điều mình muốn nhớ.</p>
        </div>
        <Link href="/review" className="text-link">
          Ôn bằng flashcard <ArrowRight size={17} />
        </Link>
      </div>
      <div className="toolbar">
        <Link className="button secondary" href="/notebook/unknown">
          Từ vựng chưa biết & bộ thẻ riêng
        </Link>
        <div className="tabs">
          {(
            [
              { id: "saved", label: "Đã lưu" },
              { id: "learned", label: "Đã học" },
              { id: "all", label: "Tất cả từ" },
              { id: "grammar", label: "Ngữ pháp đã lưu" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              className={filter === item.id ? "selected" : ""}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <span className="sr-only">Tìm từ vựng</span>
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm từ Hàn, nghĩa Anh hoặc Việt…"
          />
        </label>
      </div>
      {!ready ? (
        <p className="loading-text">Đang mở sổ từ…</p>
      ) : filter === "grammar" ? (
        <>
          <p className="catalog-count">{grammars.length} cấu trúc đã lưu</p>
          <div className="grammar-grid">
            {grammarPagination.items.map((item) => (
              <GrammarCard item={item} key={item.index} />
            ))}
          </div>
          <Pagination {...grammarPagination} />
          {!grammars.length && (
            <div className="empty-state">
              <h2>Ghi lại cấu trúc đầu tiên.</h2>
              <p>Lưu những cấu trúc muốn nhớ từ Tủ sách TOPIK II.</p>
              <Link className="button" href="/library?tab=grammar">
                Khám phá ngữ pháp
              </Link>
            </div>
          )}
        </>
      ) : words.length ? (
        <>
          <p className="catalog-count">{words.length} từ vựng</p>
          <div className="word-list">
            {pagination.items.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
          <Pagination {...pagination} />
        </>
      ) : (
        <div className="empty-state notebook-empty">
          <span className="empty-symbol" lang="ko">
            기록
          </span>
          <h2>
            {query ? "Chưa tìm thấy từ này." : "Trang đầu tiên đang chờ bạn."}
          </h2>
          <p>
            {query
              ? "Thử tìm bằng từ khóa khác."
              : filter === "saved"
                ? "Nhấn biểu tượng đánh dấu ở mỗi từ để thêm vào cuốn sổ của bạn."
                : "Bắt đầu một bài học để ghi lại những từ đầu tiên."}
          </p>
          <Link className="button" href="/courses">
            Khám phá từ mới <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </div>
  );
}
