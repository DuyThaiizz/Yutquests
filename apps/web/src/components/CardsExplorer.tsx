"use client";

import { useMemo, useState } from "react";
import { idioms } from "@/lib/idioms";

const categories = ["Tất cả", "Đời sống", "Thiên nhiên", "Cảm xúc", "Thử thách"] as const;

export function CardsExplorer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Tất cả");
  const visible = useMemo(() => category === "Tất cả" ? idioms : idioms.filter((item) => item.category === category), [category]);

  return (
    <section className="section section-shell card-library" aria-labelledby="library-title">
      <div className="library-toolbar">
        <div>
          <p className="kicker">Thư viện mẫu</p>
          <h2 id="library-title">{visible.length.toString().padStart(2, "0")} thẻ đang mở</h2>
        </div>
        <div className="filter-group" role="group" aria-label="Lọc thẻ theo chủ đề">
          {categories.map((item) => (
            <button className={item === category ? "active" : ""} type="button" aria-pressed={item === category} onClick={() => setCategory(item)} key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="library-grid">
        {visible.map((item) => (
          <details className="library-card" key={item.id}>
            <summary>
              <span className="library-card-number">{item.id.toString().padStart(2, "0")}</span>
              <span className="library-category">{item.category}</span>
              <strong lang="ko">{item.korean}</strong>
              <span className="library-reading">{item.reading}</span>
              <span className="library-meaning">{item.meaning}</span>
              <span className="expand-label">Mở thẻ <span aria-hidden="true">＋</span></span>
            </summary>
            <div className="card-detail">
              <p><span>Nghĩa đen</span>{item.literal}</p>
              <p><span>Trong câu</span>{item.example}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
