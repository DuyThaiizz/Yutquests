"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Headphones,
  PenLine,
  Search,
} from "lucide-react";
import { grammarPoints, type WritingPrompt } from "@/lib/writing";

export function WritingLibrary({ exercises }: { exercises: WritingPrompt[] }) {
  const [kind, setKind] = useState<51 | 52>(51);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showGrammar, setShowGrammar] = useState(false);
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return exercises.filter(
      (item) =>
        item.kind === kind &&
        (!query ||
          `${item.number} ${item.title}`
            .toLocaleLowerCase("vi")
            .includes(query)),
    );
  }, [exercises, kind, search]);
  const pageCount = Math.max(1, Math.ceil(visible.length / 10));
  const shown = visible.slice(page * 10, page * 10 + 10);
  return (
    <div className="page writing-library">
      <Link href="/library" className="text-link">
        ← Tủ sách TOPIK
      </Link>
      <header className="writing-hero">
        <div>
          <h1>
            Viết từng câu.
            <br />
            <em>Hiểu từng lựa chọn.</em>
          </h1>
          <p>
            Luyện điền hai chỗ trống của câu 51 và 52. Sau khi nộp, đối chiếu
            lời giải theo ngữ cảnh và ôn lại cấu trúc ngữ pháp liên quan.
          </p>
        </div>
        <div className="writing-seal" aria-hidden="true">
          <span>TOPIK Ⅱ</span>
          <strong lang="ko">쓰기</strong>
          <small>51 · 52</small>
        </div>
      </header>
      <nav className="skill-tabs" aria-label="Kỹ năng TOPIK">
        <Link href="/topik">
          <BookOpen size={20} /> Đọc hiểu · 읽기
        </Link>
        <span>
          <Headphones size={20} /> Nghe <small>Sẽ phát triển</small>
        </span>
        <span className="active">
          <PenLine size={20} /> Viết · 쓰기
        </span>
      </nav>
      <div className="writing-switch" role="group" aria-label="Dạng câu viết">
        <button
          className={kind === 51 ? "selected" : ""}
          aria-pressed={kind === 51}
          onClick={() => {
            setKind(51);
            setSearch("");
            setPage(0);
          }}
        >
          <b>51</b>
          <span>
            Thông báo · thư · lời mời<small>50 bài từ đề scan</small>
          </span>
        </button>
        <button
          className={kind === 52 ? "selected" : ""}
          aria-pressed={kind === 52}
          onClick={() => {
            setKind(52);
            setSearch("");
            setPage(0);
          }}
        >
          <b>52</b>
          <span>
            Đoạn văn giải thích<small>35 bài có đáp án tham khảo</small>
          </span>
        </button>
      </div>
      <div className="writing-section-head">
        <div>
          <h2>
            Câu {kind} <span lang="ko">쓰기</span>
          </h2>
          <p>
            {kind === 51
              ? "Điền thông tin phù hợp với giọng điệu của một thông báo hay thư ngắn."
              : "Theo mạch lập luận để điền hai ý còn thiếu trong đoạn văn."}
          </p>
        </div>
        <label className="writing-search">
          <Search size={18} />
          <span className="sr-only">Tìm bài luyện viết</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Tìm số bài hoặc chủ đề"
          />
        </label>
      </div>
      <div className="writing-list" aria-live="polite">
        {shown.map((item) => (
          <Link
            href={`/topik/writing/${item.id}`}
            className="writing-list-row"
            key={item.id}
          >
            <span className="writing-list-no">
              {kind === 51 ? String(item.number).padStart(2, "0") : item.number}
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>
                {kind === 51
                  ? `Bài ${item.number} · trang ${item.page}`
                  : `Kỳ ${item.number} · trang ${item.page}`}
              </small>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
        {visible.length === 0 && (
          <p className="writing-empty">
            Không tìm thấy bài này. Hãy thử số bài hoặc một từ khác trong chủ
            đề.
          </p>
        )}
      </div>
      {visible.length > 10 && (
        <nav className="writing-pages" aria-label="Trang bài luyện viết">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            ← Trước
          </button>
          <span>
            Trang {page + 1} / {pageCount}
          </span>
          <button
            disabled={page + 1 >= pageCount}
            onClick={() => setPage(page + 1)}
          >
            Tiếp →
          </button>
        </nav>
      )}
      <div className="writing-grammar-intro">
        <div>
          <h2>Bảng ngữ pháp 51–52</h2>
          <p>
            Nhìn cấu trúc theo chức năng: mời, yêu cầu, đặt điều kiện, giải
            thích nguyên nhân và kết luận.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => setShowGrammar(!showGrammar)}
          aria-expanded={showGrammar}
        >
          {showGrammar ? "Thu gọn bảng" : "Xem bảng ngữ pháp"}
        </button>
      </div>
      {showGrammar && (
        <div className="writing-grammar-table-wrap">
          <table className="writing-grammar-table">
            <thead>
              <tr>
                <th>Cấu trúc</th>
                <th>Nghĩa & cách dùng</th>
                <th>Ví dụ</th>
                <th>Câu</th>
              </tr>
            </thead>
            <tbody>
              {grammarPoints.map((point) => (
                <tr key={point.id} id={`grammar-${point.id}`}>
                  <th scope="row" lang="ko">
                    {point.form}
                  </th>
                  <td>
                    <strong>{point.meaning}</strong>
                    <span>{point.use}</span>
                    <small>Nguồn: {point.source}</small>
                  </td>
                  <td lang="ko">{point.example}</td>
                  <td>{point.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="writing-source-note">
        Câu 51: lời giải tham khảo được biên soạn từ 50 đề scan, không có đáp án
        trong PDF. Câu 52: đáp án từ tài liệu bạn cung cấp; các lỗi biên tập
        được đánh dấu ở từng bài. Bài viết mở, vì vậy trang này không chấm khớp
        chữ tuyệt đối.
      </p>
    </div>
  );
}
