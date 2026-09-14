"use client";

import { useMemo, useState } from "react";
import { bilingualFlashcards, type FlashcardGroup } from "@/lib/bilingualFlashcards";

const filters: Array<{ value: "all" | FlashcardGroup; label: string }> = [
  { value: "all", label: "Cả 3 nhánh" },
  { value: "관용어", label: "Quán dụng ngữ" },
  { value: "한자성어", label: "Thành ngữ Hán–Hàn" },
  { value: "속담", label: "Tục ngữ" },
];
const pageSize = 12;

export function BilingualFlashcards() {
  const [group, setGroup] = useState<(typeof filters)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openCard, setOpenCard] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("vi");
    return bilingualFlashcards.filter((card) => {
      const matchesGroup = group === "all" || card.group === group;
      const searchable = `${card.expression} ${card.koreanMeaning} ${card.vietnameseMeaning}`.toLocaleLowerCase("vi");
      return matchesGroup && (!needle || searchable.includes(needle));
    });
  }, [group, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function resetView() {
    setPage(1);
    setOpenCard(null);
  }

  return (
    <section className="bilingual-library" aria-labelledby="bilingual-library-title">
      <div className="section-shell">
        <header className="bilingual-library-heading">
          <div>
            <p className="kicker">Thư viện song ngữ · 60 thẻ</p>
            <h2 id="bilingual-library-title">Một biểu đạt.<br /><em>Hai ngôn ngữ.</em></h2>
          </div>
          <p>Ôn nhanh nghĩa tiếng Việt, rồi lật thẻ để đọc cách giải thích tự nhiên bằng tiếng Hàn. Toàn bộ ba nhánh trong tài liệu YutQuest đều có mặt tại đây.</p>
        </header>

        <div className="bilingual-controls">
          <label>
            <span>Tìm trong 60 thẻ</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); resetView(); }}
              placeholder="Tìm bằng tiếng Hàn hoặc tiếng Việt…"
            />
          </label>
          <div className="bilingual-filter" role="group" aria-label="Chọn nhánh flashcard">
            {filters.map((filter) => <button
              className={group === filter.value ? "is-active" : ""}
              type="button"
              aria-pressed={group === filter.value}
              onClick={() => { setGroup(filter.value); resetView(); }}
              key={filter.value}
            >{filter.label}</button>)}
          </div>
        </div>

        <div className="bilingual-count"><strong>{String(filtered.length).padStart(2, "0")}</strong><span>flashcard phù hợp</span></div>

        {visible.length ? <div className="bilingual-card-grid">
          {visible.map((card) => {
            const isOpen = openCard === card.id;
            return <article className={`bilingual-card ${isOpen ? "is-open" : ""}`} key={card.id}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpenCard(isOpen ? null : card.id)}>
                <span className="bilingual-card-topline"><b>{card.id}</b><small>{card.groupLabel}</small></span>
                <span className="bilingual-card-inner">
                  <span className="bilingual-card-front">
                    <strong lang="ko">{card.expression}</strong>
                    <em>{card.vietnameseMeaning}</em>
                    <i>Lật thẻ <span aria-hidden="true">↗</span></i>
                  </span>
                  <span className="bilingual-card-back">
                    <small>Nghĩa tiếng Hàn</small>
                    <strong lang="ko">{card.koreanMeaning}</strong>
                    <em>{card.vietnameseMeaning}</em>
                    <i>Quay lại <span aria-hidden="true">↙</span></i>
                  </span>
                </span>
              </button>
            </article>;
          })}
        </div> : <div className="library-empty"><strong>Không tìm thấy flashcard.</strong><p>Hãy thử một từ khóa khác hoặc chọn cả ba nhánh.</p></div>}

        {pageCount > 1 && <nav className="library-pagination bilingual-pagination" aria-label="Phân trang flashcard song ngữ">
          <button type="button" disabled={safePage === 1} onClick={() => { setPage((value) => Math.max(1, value - 1)); setOpenCard(null); }}>← Trang trước</button>
          <span>Trang {safePage} / {pageCount}</span>
          <button type="button" disabled={safePage === pageCount} onClick={() => { setPage((value) => Math.min(pageCount, value + 1)); setOpenCard(null); }}>Trang sau →</button>
        </nav>}
      </div>
    </section>
  );
}
