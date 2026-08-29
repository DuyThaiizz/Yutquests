"use client";

import { useMemo, useState } from "react";
import { questionCards } from "@/lib/questionCards";

const groups = [
  { value: "Tất cả", label: "Tất cả" },
  { value: "관용어", label: "Quán dụng ngữ" },
  { value: "한자성어", label: "Hán–Hàn" },
  { value: "속담", label: "Tục ngữ" },
] as const;
const levels = ["Tất cả cấp độ", "Nhận biết", "Thông hiểu", "Vận dụng", "Challenge/Review"] as const;
const pageSize = 18;

export function CardsExplorer() {
  const [group, setGroup] = useState<(typeof groups)[number]["value"]>("Tất cả");
  const [level, setLevel] = useState<(typeof levels)[number]>("Tất cả cấp độ");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("vi");
    return questionCards.filter((card) => {
      const matchesGroup = group === "Tất cả" || card.group === group;
      const matchesLevel = level === "Tất cả cấp độ" || card.level === level;
      const searchable = `${card.expression} ${card.koreanMeaning} ${card.vietnameseMeaning} ${card.id}`.toLocaleLowerCase("vi");
      return matchesGroup && matchesLevel && (!needle || searchable.includes(needle));
    });
  }, [group, level, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function changeFilters(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <section className="section section-shell card-library" aria-labelledby="library-title">
      <div className="library-toolbar">
        <div>
          <p className="kicker">Ngân hàng câu hỏi</p>
          <h2 id="library-title">{filtered.length.toString().padStart(3, "0")} thẻ đang mở</h2>
          <p className="library-note">Nguồn nội dung: YutQuest 210 · 60 nhận biết · 60 thông hiểu · 60 vận dụng · 30 ôn tập</p>
        </div>
        <div className="library-search-panel">
          <label>
            <span>Tìm biểu đạt</span>
            <input value={query} onChange={(event) => changeFilters(() => setQuery(event.target.value))} placeholder="Nhập tiếng Hàn hoặc nghĩa tiếng Việt…" type="search" />
          </label>
          <label>
            <span>Cấp độ</span>
            <select value={level} onChange={(event) => changeFilters(() => setLevel(event.target.value as (typeof levels)[number]))}>
              {levels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="filter-group library-group-filter" role="group" aria-label="Lọc thẻ theo nhóm biểu đạt">
        {groups.map((item) => (
          <button className={item.value === group ? "active" : ""} type="button" aria-pressed={item.value === group} onClick={() => changeFilters(() => setGroup(item.value))} key={item.value}>{item.label}</button>
        ))}
      </div>

      {visible.length ? <div className="library-grid library-grid-expanded">
        {visible.map((card) => (
          <details className="library-card library-card-expanded" key={card.id}>
            <summary>
              <span className="library-card-number">{card.id}</span>
              <span className="library-category">{card.groupLabel} · {card.level}</span>
              <strong lang="ko">{card.expression}</strong>
              <span className="library-korean-meaning" lang="ko">{card.koreanMeaning}</span>
              <span className="library-meaning">{card.vietnameseMeaning}</span>
              <span className="expand-label">Mở thử thách <span aria-hidden="true">＋</span></span>
            </summary>
            <div className="card-detail card-detail-expanded">
              <p><span>Nhiệm vụ</span>{card.taskType}</p>
              <p lang="ko"><span>Câu hỏi</span>{card.prompt}</p>
              {card.context && <p className="card-context" lang="ko"><span>Ngữ cảnh / lựa chọn</span>{card.context}</p>}
              <p className="card-answer"><span>Đáp án</span>{card.answer}</p>
            </div>
          </details>
        ))}
      </div> : <div className="library-empty"><strong>Không tìm thấy thẻ phù hợp.</strong><p>Thử một từ khóa khác hoặc mở rộng bộ lọc.</p></div>}

      {pageCount > 1 && <nav className="library-pagination" aria-label="Phân trang thư viện">
        <button disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">← Trang trước</button>
        <span>Trang {safePage} / {pageCount}</span>
        <button disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button">Trang sau →</button>
      </nav>}
    </section>
  );
}
