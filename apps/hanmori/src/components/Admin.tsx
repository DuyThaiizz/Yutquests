"use client";
import { useRef, useState } from "react";
import { Plus, Upload, FileText, Info, Search } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { lessons } from "@/lib/catalog";
import {
  vocabularySchema,
  extractionSchema,
  type Vocabulary,
} from "@/lib/models";
import { getSupabase } from "@/lib/supabase";
import { Pagination, usePagination } from "./Pagination";
const blank = (): Vocabulary => ({
  id: crypto.randomUUID(),
  lessonId: "greetings",
  korean: "",
  meaning: "",
  romanization: "",
  example: "",
  translation: "",
  wordType: "Danh từ",
  level: 1,
  status: "draft",
  sourcePage: null,
});
export function Admin() {
  const { data, ready, editWord, notify } = useStudy();
  const [editor, setEditor] = useState<Vocabulary | null>(null),
    [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">(
      "all",
    ),
    [query, setQuery] = useState(""),
    [uploadOpen, setUploadOpen] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [lesson, setLesson] = useState("greetings"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const uploadLock = useRef(false);
  const words = data.vocabulary.filter(
    (word) =>
      (filter === "all" || word.status === filter) &&
      `${word.korean} ${word.meaning}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const pagination = usePagination(words, 20, `${filter}|${query}`);
  function save() {
    if (!editor) return;
    const result = vocabularySchema.safeParse({ ...editor, status: "draft" });
    if (!result.success) {
      setError("Nhập từ tiếng Hàn và nghĩa; kiểm tra độ dài các trường.");
      return;
    }
    editWord(result.data);
    setEditor(null);
    setError("");
    notify("Đã lưu bản nháp. Hãy kiểm tra nội dung trước khi xuất bản.");
  }
  function status(word: Vocabulary, next: "published" | "archived") {
    editWord({ ...word, status: next });
    notify(
      next === "published"
        ? "Đã xuất bản trong bản trải nghiệm. Từ mới đã có trong bài học."
        : "Đã thu hồi. Từ này không còn xuất hiện trong bài học hoặc lịch ôn.",
    );
  }
  async function extract() {
    if (!file || uploadLock.current) return;
    uploadLock.current = true;
    setBusy(true);
    setError("");
    try {
      if (file.size > 10 * 1024 * 1024)
        throw new Error("PDF tối đa 10 MB. Hãy chia nhỏ tài liệu.");
      const client = getSupabase();
      if (!client)
        throw new Error(
          "Chưa kết nối dịch vụ AI và tài khoản trung tâm. Bạn có thể dùng “Thêm từ thủ công” để thử toàn bộ luồng duyệt.",
        );
      const {
        data: { session },
      } = await client.auth.getSession();
      if (!session)
        throw new Error(
          "Hãy đăng nhập bằng tài khoản giáo viên trong Tài khoản trước.",
        );
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: form,
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Không xử lý được PDF. Hãy thử lại.");
      const result = extractionSchema.parse(payload);
      const level = lessons.find((item) => item.id === lesson)!.level;
      for (const item of result.items)
        editWord({
          ...item,
          id: crypto.randomUUID(),
          lessonId: lesson,
          level,
          status: "draft",
        });
      setFilter("draft");
      setUploadOpen(false);
      setFile(null);
      notify(
        `Đã nhận ${result.items.length} từ chờ duyệt. Chưa có từ nào được xuất bản.`,
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Không xử lý được tài liệu. Hãy thử lại.",
      );
    } finally {
      uploadLock.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">선생님의 공간 · KHÔNG GIAN GIÁO VIÊN</span>
          <h1>Gieo những từ mới.</h1>
          <p>Biên soạn, kiểm tra và đưa những bài học tốt đến học sinh.</p>
        </div>
        <div className="admin-actions">
          <button
            className="button secondary"
            onClick={() => {
              setUploadOpen((value) => !value);
              setEditor(null);
              setError("");
            }}
          >
            <Upload size={16} /> Nhập PDF
          </button>
          <button
            className="button"
            onClick={() => {
              setEditor(blank());
              setUploadOpen(false);
              setError("");
            }}
          >
            <Plus size={17} /> Thêm từ thủ công
          </button>
        </div>
      </div>
      <div className="notice-panel">
        <Info size={18} />
        <p>
          Không gian giáo viên đang ở chế độ trải nghiệm trên thiết bị này. Bạn
          có thể thêm, sửa, duyệt và thu hồi học liệu. Trích xuất PDF thật cần
          tài khoản giáo viên và dịch vụ AI đã cấu hình.
        </p>
      </div>
      {uploadOpen && (
        <section className="editor">
          <h2>Từ giáo trình đến bài học</h2>
          <div className="upload-box">
            <FileText size={32} />
            <h3>Chọn tài liệu PDF</h3>
            <p>Tối đa 10 MB, 30 trang. Kết quả AI luôn cần được duyệt.</p>
            <label htmlFor="pdf-file" className="sr-only">
              Tài liệu PDF
            </label>
            <input
              id="pdf-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <label htmlFor="upload-lesson">Đưa nội dung vào bài học</label>
          <select
            id="upload-lesson"
            value={lesson}
            onChange={(event) => setLesson(event.target.value)}
          >
            {lessons.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <div className="button-row">
            <button
              className="button"
              disabled={!file || busy}
              onClick={extract}
            >
              {busy ? "Đang trích xuất…" : "Trích xuất để duyệt"}
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setUploadOpen(false)}
            >
              Đóng
            </button>
          </div>
          <p className="storage-note">
            Tài liệu sẽ được gửi đến dịch vụ AI của trung tâm để xử lý. Chỉ chọn
            tài liệu được phép sử dụng.
          </p>
        </section>
      )}
      {editor && (
        <form
          className="editor"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <h2>
            {data.vocabulary.some((word) => word.id === editor.id)
              ? "Kiểm tra & chỉnh sửa"
              : "Thêm một từ mới"}
          </h2>
          <p className="storage-note">
            Lưu nội dung sẽ chuyển mục này về bản nháp và ẩn khỏi bài học cho
            đến khi xuất bản lại.
          </p>
          <div className="form-grid">
            <div>
              <label htmlFor="edit-korean">Từ tiếng Hàn *</label>
              <input
                id="edit-korean"
                lang="ko"
                required
                maxLength={100}
                value={editor.korean}
                onChange={(event) =>
                  setEditor({ ...editor, korean: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="edit-meaning">
                Nghĩa{" "}
                {editor.meaningLanguage === "en" ? "tiếng Anh" : "tiếng Việt"} *
              </label>
              <input
                id="edit-meaning"
                required
                maxLength={300}
                value={editor.meaning}
                onChange={(event) =>
                  setEditor({ ...editor, meaning: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="edit-roman">Phiên âm</label>
              <input
                id="edit-roman"
                maxLength={150}
                value={editor.romanization}
                onChange={(event) =>
                  setEditor({ ...editor, romanization: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="edit-type">Loại từ</label>
              <select
                id="edit-type"
                value={editor.wordType}
                  onChange={(event) =>
                    setEditor({ ...editor, wordType: event.target.value })
                  }
                >
                  <option value="">Chưa ghi trong nguồn</option>
                  {[
                  "Danh từ",
                  "Động từ",
                  "Tính từ",
                  "Trạng từ",
                  "Lời chào",
                  "Biểu đạt",
                ].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-lesson">Bài học</label>
              <select
                id="edit-lesson"
                value={editor.lessonId}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    lessonId: event.target.value,
                    level: lessons.find(
                      (item) => item.id === event.target.value,
                    )!.level,
                  })
                }
              >
                {lessons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-page">Trang nguồn (nếu có)</label>
              <input
                id="edit-page"
                type="number"
                min={1}
                max={30}
                value={editor.sourcePage ?? ""}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    sourcePage: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="edit-example">Ví dụ tiếng Hàn</label>
              <textarea
                id="edit-example"
                maxLength={500}
                value={editor.example}
                onChange={(event) =>
                  setEditor({ ...editor, example: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="edit-translation">Dịch ví dụ</label>
              <textarea
                id="edit-translation"
                maxLength={500}
                value={editor.translation}
                onChange={(event) =>
                  setEditor({ ...editor, translation: event.target.value })
                }
              />
            </div>
          </div>
          <div className="button-row">
            <button className="button" type="submit">
              Lưu bản nháp
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                setEditor(null);
                setError("");
              }}
            >
              Hủy chỉnh sửa
            </button>
          </div>
        </form>
      )}
      {error && (
        <p role="alert" className="notice-panel">
          {error}
        </p>
      )}
      {editor &&
        editor.status !== "published" &&
        data.vocabulary.some(
          (word) => word.id === editor.id && word.status !== "published",
        ) && (
          <div className="panel" style={{ marginTop: 20 }}>
            <h2>Xuất bản nội dung đã kiểm tra</h2>
            <p>
              Hãy lưu bản nháp trước. Thao tác này xuất bản phiên bản đã lưu,
              không phải thay đổi chưa lưu trong biểu mẫu.
            </p>
            <button
              className="button"
              disabled={
                JSON.stringify(editor) !==
                JSON.stringify(
                  data.vocabulary.find((word) => word.id === editor.id),
                )
              }
              onClick={() => {
                const saved = data.vocabulary.find(
                  (word) => word.id === editor.id,
                );
                if (saved) {
                  status(saved, "published");
                  setEditor(null);
                }
              }}
            >
              Duyệt & xuất bản bản đã lưu
            </button>
          </div>
        )}
      <div className="toolbar">
        <div className="tabs">
          {(
            [
              { id: "all", label: "Tất cả" },
              { id: "draft", label: "Chờ duyệt" },
              { id: "published", label: "Đã xuất bản" },
              { id: "archived", label: "Đã thu hồi" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              aria-pressed={filter === item.id}
              className={filter === item.id ? "selected" : ""}
              onClick={() => setFilter(item.id)}
            >
              {item.label} (
              {
                data.vocabulary.filter(
                  (word) => item.id === "all" || word.status === item.id,
                ).length
              }
              )
            </button>
          ))}
        </div>
        <label className="search-field">
          <span className="sr-only">Tìm nội dung</span>
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm từ hoặc nghĩa…"
          />
        </label>
      </div>
      {!ready ? (
        <p className="loading-text">Đang tải nội dung…</p>
      ) : words.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">TỪ VỰNG</th>
                <th scope="col">NGHĨA / BÀI HỌC</th>
                <th scope="col">TRẠNG THÁI</th>
                <th scope="col">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {pagination.items.map((word) => (
                <tr key={word.id}>
                  <td className="korean-cell" lang="ko">
                    {word.korean}
                  </td>
                  <td>
                    {word.meaning}
                    <br />
                    <small style={{ color: "var(--muted)" }}>
                      {lessons.find((item) => item.id === word.lessonId)?.title}
                      {word.sourcePage ? ` · Trang ${word.sourcePage}` : ""}
                    </small>
                  </td>
                  <td>
                    <span className={`status-badge ${word.status}`}>
                      {word.status === "published"
                        ? "Đã xuất bản"
                        : word.status === "draft"
                          ? "Chờ duyệt"
                          : "Đã thu hồi"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => {
                          setEditor({ ...word });
                          setUploadOpen(false);
                          setError("");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Xem / sửa
                      </button>
                      {word.status === "published" ? (
                        <button onClick={() => status(word, "archived")}>
                          Thu hồi
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditor({ ...word });
                            setUploadOpen(false);
                            setError("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          Kiểm tra
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <h2>Chưa có nội dung trong mục này.</h2>
          <p>Thêm từ thủ công hoặc chọn trạng thái khác để xem.</p>
        </div>
      )}
      <Pagination {...pagination} />
    </div>
  );
}
