"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookmarkPlus, X } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { normalizedTerm, noteContext } from "@/lib/personal-study";

export function SelectionNote() {
  const { data, ready, putNote, notify } = useStudy();
  const path = usePathname();
  const [selection, setSelection] = useState<{
    term: string;
    context: string;
    source: string;
  } | null>(null);
  const [editing, setEditing] = useState(false),
    [term, setTerm] = useState(""),
    [meaning, setMeaning] = useState(""),
    [language, setLanguage] = useState<"vi" | "en">("vi"),
    [error, setError] = useState("");
  useEffect(() => {
    setSelection(null);
    setEditing(false);
  }, [path]);
  useEffect(() => {
    function capture() {
      if (editing) return;
      const s = window.getSelection();
      const text = s?.toString().trim();
      const node = s?.anchorNode?.parentElement;
      if (
        !text ||
        text.length > 100 ||
        !node?.closest("main") ||
        node.closest("input,textarea,[data-note-ui]")
      ) {
        setSelection(null);
        return;
      }
      const context = noteContext(
        node.closest("[data-reading-context],p,article")?.textContent || text,
        text,
      );
      setSelection({
        term: text,
        context,
        source: window.location.pathname + window.location.search,
      });
    }
    document.addEventListener("selectionchange", capture);
    return () => document.removeEventListener("selectionchange", capture);
  }, [editing]);
  if (!selection || !ready) return null;
  return (
    <aside
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setEditing(false);
          setSelection(null);
        }
      }}
      className="selection-note"
      data-note-ui
      aria-label="Lưu từ đang chọn"
    >
      {!editing ? (
        <>
          <span lang="ko">{selection.term}</span>
          <button
            className="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setTerm(selection.term);
              setMeaning("");
              setLanguage("vi");
              setError("");
              setEditing(true);
            }}
          >
            <BookmarkPlus size={16} /> Lưu từ chưa biết
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const clean = normalizedTerm(term);
            if (data.notes.some((n) => normalizedTerm(n.term) === clean)) {
              setError(
                "Từ này đã có trong sổ. Mở mục Từ vựng chưa biết để chỉnh sửa.",
              );
              return;
            }
            if (data.notes.length >= 5000) {
              setError("Sổ đã đạt giới hạn 5.000 từ.");
              return;
            }
            if (!clean) {
              setError("Hãy nhập từ cần lưu.");
              return;
            }
            const failure = putNote({
              id: crypto.randomUUID(),
              term: clean,
              meaning: meaning.trim(),
              meaningLanguage: language,
              context: selection.context,
              source: selection.source,
              createdAt: new Date().toISOString(),
            });
            if (failure) {
              setError(failure);
              return;
            }
            notify("Đã lưu vào Từ vựng chưa biết.");
            setSelection(null);
            setEditing(false);
            window.getSelection()?.removeAllRanges();
          }}
        >
          <h3>Ghi lại từ mới</h3>
          <p>Kiểm tra lại chữ nếu đang đọc đề quét. Có thể tra nghĩa sau.</p>
          <label htmlFor="selected-term">Từ hoặc cụm từ</label>
          <input
            id="selected-term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
            maxLength={100}
            autoFocus
          />
          <label htmlFor="selected-meaning">Nghĩa / ghi chú của bạn</label>
          <input
            id="selected-meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            maxLength={300}
          />
          <label htmlFor="selection-language">Ngôn ngữ nghĩa</label>
          <select
            id="selection-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value === "en" ? "en" : "vi")}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
          </select>
          {error && <p role="alert">{error}</p>}
          <div className="button-row">
            <button className="button">Lưu vào từ vựng chưa biết</button>
            <Link
              href="/notebook/unknown"
              onClick={() => {
                setSelection(null);
                setEditing(false);
              }}
            >
              Mở sổ từ
            </Link>
          </div>
        </form>
      )}
      <button
        className="icon-button selection-close"
        aria-label="Đóng ghi chú"
        onClick={() => {
          setSelection(null);
          setEditing(false);
          window.getSelection()?.removeAllRanges();
        }}
      >
        <X size={18} />
      </button>
    </aside>
  );
}
