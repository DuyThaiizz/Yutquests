"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useStudy } from "./StudyProvider";
import { type StudyNote, normalizedTerm } from "@/lib/personal-study";
import { Pagination, usePagination } from "./Pagination";
export function PersonalNotebook() {
  const { data, ready, putNote, putDeck, notify } = useStudy();
  const [query, setQuery] = useState(""),
    [editor, setEditor] = useState<StudyNote | null>(null),
    [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]),
    [name, setName] = useState(""),
    [deckId, setDeckId] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const editing = !!editor;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!editing || !dialog) return;
    const previous = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [editing]);
  const filtered = data.notes.filter((n) =>
    `${n.term} ${n.meaning}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pagination = usePagination(filtered, 12, query);
  const suggestions = editor
    ? data.vocabulary
        .filter(
          (w) =>
            !w.id.startsWith("note-") &&
            w.status === "published" &&
            w.korean === editor.term.trim(),
        )
        .slice(0, 5)
    : [];
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">나만의 단어장 · GHI CHÚ KHI HỌC</span>
          <h1>Từ vựng chưa biết</h1>
          <p>
            Bôi đen từ trong bài học hoặc ghi thủ công từ đề scan. Bổ sung nghĩa
            rồi chọn từ tạo bộ thẻ của riêng bạn.
          </p>
        </div>
        <Link href="/notebook" className="text-link">
          Về sổ từ
        </Link>
      </div>
      <div className="personal-grid">
        <section>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setEditor({
                id: crypto.randomUUID(),
                term: "",
                meaning: "",
                meaningLanguage: "vi",
                context: "Từ ghi thủ công khi luyện viết TOPIK",
                source: "/topik/writing",
                createdAt: new Date().toISOString(),
              });
              setError("");
            }}
          >
            + Ghi từ mới
          </button>
          <label htmlFor="note-search">Tìm trong ghi chú</label>
          <input
            id="note-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Từ Hàn hoặc nghĩa…"
          />
          <p className="results-count">
            {data.notes.length} từ đã ghi ·{" "}
            {data.notes.filter((n) => !n.meaning.trim()).length} từ cần tra
            nghĩa
          </p>
          {!ready ? (
            <p>Đang mở ghi chú…</p>
          ) : !filtered.length ? (
            <div className="empty-state">
              <h2>Ghi lại từ đầu tiên.</h2>
              <p>
                Bôi đen từ trong bài học hoặc chọn “Ghi từ mới” để nhập từ trong
                đề scan.
              </p>
              <Link className="button" href="/topik">
                Mở ôn tập TOPIK
              </Link>
            </div>
          ) : (
            pagination.items.map((note) => (
              <article className="personal-note panel" key={note.id}>
                <div className="personal-note-title">
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(note.id)}
                      onChange={(e) =>
                        setSelected((prev) =>
                          e.target.checked
                            ? [...prev, note.id]
                            : prev.filter((id) => id !== note.id),
                        )
                      }
                      aria-label={`Chọn ${note.term} vào bộ thẻ`}
                    />
                    <strong lang="ko">{note.term}</strong>
                  </label>
                  <button
                    className="text-link"
                    onClick={() => {
                      setEditor({ ...note });
                      setError("");
                    }}
                  >
                    Tra nghĩa / sửa
                  </button>
                </div>
                <p>
                  {note.meaning || "Chưa tra nghĩa · chưa đưa vào flashcard"}
                </p>
                <details>
                  <summary>Ngữ cảnh đã lưu</summary>
                  <p lang="ko">{note.context}</p>
                  <Link
                    href={
                      note.source.startsWith("/") &&
                      !note.source.startsWith("//")
                        ? note.source
                        : "/topik"
                    }
                  >
                    Trở lại bài học
                  </Link>
                </details>
              </article>
            ))
          )}
          <Pagination {...pagination} />
        </section>
        <aside>
          <form
            className="panel deck-builder"
            onSubmit={(e) => {
              e.preventDefault();
              if (!selected.length) {
                notify("Chọn ít nhất một từ để tạo bộ thẻ.");
                return;
              }
              if (data.decks.length >= 200 && !deckId) {
                notify("Đã đạt giới hạn 200 bộ thẻ.");
                return;
              }
              const failure = putDeck({
                id: deckId || crypto.randomUUID(),
                name: name.trim(),
                noteIds: selected,
              });
              if (failure) {
                notify(failure);
                return;
              }
              notify(
                "Đã lưu bộ thẻ cá nhân. Các từ có nghĩa đã sẵn sàng để ôn.",
              );
              setName("");
              setSelected([]);
              setDeckId("");
            }}
          >
            <span className="eyebrow">FLASHCARD CỦA BẠN</span>
            <h2>{deckId ? "Chỉnh sửa bộ thẻ" : "Tạo bộ thẻ riêng"}</h2>
            <label htmlFor="deck-name">Tên bộ thẻ</label>
            <input
              id="deck-name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Từ mới khi đọc TOPIK"
            />
            <p>
              Đã chọn {selected.length} từ. Từ chưa có nghĩa sẽ được giữ lại để
              bổ sung, chưa xuất hiện khi ôn.
            </p>
            <button
              className="button"
              disabled={!ready || !selected.length || !name.trim()}
            >
              Lưu bộ thẻ
            </button>
            {deckId && (
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setDeckId("");
                  setName("");
                  setSelected([]);
                }}
              >
                Hủy chỉnh sửa
              </button>
            )}
          </form>
          {data.decks.map((deck) => {
            const eligible = deck.noteIds.filter((id) =>
              data.notes.some((n) => n.id === id && n.meaning.trim()),
            ).length;
            return (
              <article className="panel personal-deck" key={deck.id}>
                <h3>{deck.name}</h3>
                <p>
                  {deck.noteIds.length} từ · {eligible} thẻ sẵn sàng
                </p>
                <div className="button-row">
                  {eligible > 0 && (
                    <Link
                      className="button secondary"
                      href={`/review?deck=${encodeURIComponent(deck.id)}`}
                    >
                      Ôn bộ thẻ
                    </Link>
                  )}
                  <button
                    className="text-link"
                    onClick={() => {
                      setDeckId(deck.id);
                      setName(deck.name);
                      setSelected(deck.noteIds);
                    }}
                  >
                    Sửa bộ thẻ
                  </button>
                </div>
              </article>
            );
          })}
        </aside>
      </div>
      {editor && (
        <dialog
          ref={dialogRef}
          className="note-dialog"
          aria-labelledby="note-editor-title"
          onCancel={() => setEditor(null)}
        >
          <form
            className="panel note-modal"
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditor(null);
            }}
            aria-labelledby="note-editor-title"
            onSubmit={(e) => {
              e.preventDefault();
              if (
                data.notes.some(
                  (n) =>
                    n.id !== editor.id &&
                    normalizedTerm(n.term) === normalizedTerm(editor.term),
                )
              ) {
                setError("Từ này đã có trong sổ.");
                return;
              }
              if (!normalizedTerm(editor.term)) {
                setError("Hãy nhập từ cần lưu.");
                return;
              }
              const failure = putNote(editor);
              if (failure) {
                setError(failure);
                return;
              }
              setEditor(null);
              notify("Đã lưu từ vào sổ và bộ thẻ của bạn.");
            }}
          >
            <h2 id="note-editor-title">Ghi từ mới & tra nghĩa</h2>
            <label htmlFor="note-term">Từ tiếng Hàn</label>
            <input
              id="note-term"
              autoFocus
              required
              maxLength={100}
              value={editor.term}
              onChange={(e) => setEditor({ ...editor, term: e.target.value })}
            />
            <label htmlFor="note-meaning">Nghĩa bạn muốn học</label>
            <textarea
              id="note-meaning"
              maxLength={300}
              value={editor.meaning}
              onChange={(e) =>
                setEditor({ ...editor, meaning: e.target.value })
              }
            />
            <label htmlFor="meaning-language">Ngôn ngữ nghĩa</label>
            <select
              id="meaning-language"
              value={editor.meaningLanguage}
              onChange={(e) =>
                setEditor({
                  ...editor,
                  meaningLanguage: e.target.value === "en" ? "en" : "vi",
                })
              }
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh</option>
            </select>
            <p>Gợi ý từ tủ sách hiện có (khớp đúng từ):</p>
            {suggestions.length ? (
              suggestions.map((w) => (
                <button
                  type="button"
                  className="dictionary-match"
                  key={w.id}
                  onClick={() =>
                    setEditor({
                      ...editor,
                      meaning: w.meaning,
                      meaningLanguage: w.meaningLanguage || "vi",
                    })
                  }
                >
                  {w.korean} — {w.meaning}
                </button>
              ))
            ) : (
              <p>
                Chưa có từ khớp. Thử nhập dạng từ điển, hoặc tự bổ sung nghĩa đã
                tra.
              </p>
            )}
            <p>
              <a
                className="text-link"
                href={`https://krdict.korean.go.kr/vie/dicMarinerSearch/search?mainSearchWord=${encodeURIComponent(editor.term.trim())}&nation=vie`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tra từ điển Hàn–Việt ↗
              </a>
            </p>
            <p>
              Mở từ điển của Viện Quốc ngữ Quốc gia Hàn Quốc ở tab mới. Chọn
              nghĩa hợp ngữ cảnh rồi ghi lại ở trên.
            </p>
            {error && <p role="alert">{error}</p>}
            <div className="button-row">
              <button className="button">Lưu ghi chú</button>
              <button
                type="button"
                className="button secondary"
                onClick={() => setEditor(null)}
              >
                Đóng
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
