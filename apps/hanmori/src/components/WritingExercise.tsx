"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Send } from "lucide-react";
import { z } from "zod";
import { grammarPoints, type WritingPrompt } from "@/lib/writing";

const draftSchema = z.object({
  ㄱ: z.string().max(1000),
  ㄴ: z.string().max(1000),
});
const resultSchema = z.object({
  id: z.string(),
  answers: z.object({ ㄱ: z.string(), ㄴ: z.string() }),
  explanations: z.object({ ㄱ: z.string(), ㄴ: z.string() }),
  answerSource: z.string(),
  answerPage: z.number().optional(),
  answerImage: z.string().optional(),
  reviewNote: z.string().optional(),
});
type Result = z.infer<typeof resultSchema>;
type Draft = z.infer<typeof draftSchema>;

export function WritingExercise({
  exercise,
  previous,
  next,
}: {
  exercise: WritingPrompt;
  previous?: string;
  next?: string;
}) {
  const [draft, setDraft] = useState<Draft>({ ㄱ: "", ㄴ: "" });
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showGrammar, setShowGrammar] = useState(false);
  const [zoom, setZoom] = useState(false);
  const storageKey = `hanmori-writing-${exercise.id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDraft(draftSchema.parse(JSON.parse(raw)));
    } catch {
      /* Corrupt or unavailable storage starts with a clean draft. */
    }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      /* Writing remains available without local storage. */
    }
  }, [draft, ready, storageKey]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: exercise.id, answers: draft }),
      });
      if (!response.ok)
        throw new Error(
          "Không mở được lời giải. Bài viết đã được giữ trên thiết bị; hãy thử lại.",
        );
      setResult(resultSchema.parse(await response.json()));
    } catch {
      setError(
        "Không mở được lời giải. Bài viết đã được giữ trên thiết bị; hãy thử lại.",
      );
    } finally {
      setPending(false);
    }
  }

  const matchingGrammar = grammarPoints.filter((point) =>
    exercise.grammar.includes(point.id),
  );
  const promptParts = exercise.prompt?.split(/(\([ㄱㄴ]\))/g);
  return (
    <div className="page writing-exercise">
      <Link href="/topik/writing" className="text-link">
        <ArrowLeft size={16} /> Tất cả bài luyện viết
      </Link>
      <header className="writing-exercise-head">
        <div>
          <span className="writing-kicker">
            TOPIK II · 쓰기 · CÂU {exercise.kind}
          </span>
          <h1>{exercise.title}</h1>
          <p>
            {exercise.kind === 51
              ? `Bài ${exercise.number}`
              : `Kỳ ${exercise.number}`}{" "}
            · Trang {exercise.page} của {exercise.source}
          </p>
        </div>
        <div className="writing-index" aria-label={`Câu ${exercise.kind}`}>
          <span>{exercise.kind}</span>
          <small>ㄱ · ㄴ</small>
        </div>
      </header>
      <div className="writing-studio">
        <section
          className="writing-prompt-panel"
          aria-labelledby="writing-prompt-title"
        >
          <div className="writing-panel-head">
            <div>
              <h2 id="writing-prompt-title">Đề bài gốc</h2>
              <p>Đọc trước và sau mỗi chỗ trống để xác định ý cần điền.</p>
            </div>
            {exercise.image ? (
              <div className="writing-image-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setZoom(!zoom)}
                  aria-pressed={zoom}
                >
                  {zoom ? "Thu nhỏ" : "Phóng to trong trang"}
                </button>
                <a
                  href={exercise.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Mở ảnh lớn <ExternalLink size={15} />
                </a>
              </div>
            ) : (
              exercise.sourceImage && (
                <a
                  href={exercise.sourceImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Xem trang PDF gốc <ExternalLink size={15} />
                </a>
              )
            )}
          </div>
          {exercise.image ? (
            <>
              <div className={`writing-source-image${zoom ? " zoomed" : ""}`}>
                <Image
                  src={exercise.image}
                  alt={`Trang đề gốc bài ${exercise.number}, câu 51 TOPIK II`}
                  width={910}
                  height={720}
                  sizes="(max-width: 900px) 100vw, 720px"
                  priority
                />
              </div>
              <p className="writing-pan-hint">
                Vuốt ngang để đọc rõ từng dòng trong đề scan.
              </p>
            </>
          ) : (
            <p className="writing-source-text" lang="ko">
              {promptParts?.map((part, index) =>
                /^\([ㄱㄴ]\)$/.test(part) ? (
                  <mark key={index}>{part}</mark>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
            </p>
          )}
          <p className="writing-citation">
            Nguồn: {exercise.source} · trang {exercise.page}.{" "}
            {exercise.kind === 51
              ? "Ảnh cắt từ bản scan; phần ô trả lời của tài liệu đã được thay bằng khung viết bên cạnh."
              : "Văn bản trích từ PDF để có thể bôi đen và ghi chú từ mới."}
          </p>
          <Link href="/notebook/unknown" className="writing-notebook-link">
            {exercise.kind === 51
              ? "Gặp từ lạ trong ảnh? Ghi thủ công vào sổ từ"
              : "Mở từ vựng chưa biết & thẻ ôn tập"}{" "}
            <ArrowRight size={15} />
          </Link>
        </section>
        <aside
          className="writing-answer-panel"
          aria-labelledby="writing-answer-title"
        >
          <h2 id="writing-answer-title">Bài viết của bạn</h2>
          <p>Viết câu hoặc cụm từ hoàn chỉnh để nối tự nhiên với văn bản.</p>
          <form onSubmit={submit}>
            {(["ㄱ", "ㄴ"] as const).map((gap) => (
              <label key={gap} className="writing-input">
                <span lang="ko">{gap}</span>
                <textarea
                  lang="ko"
                  value={draft[gap]}
                  onChange={(event) => {
                    setDraft((current) => ({
                      ...current,
                      [gap]: event.target.value,
                    }));
                    setResult(null);
                  }}
                  maxLength={1000}
                  required
                  disabled={!ready}
                  placeholder={`Điền phần ${gap} bằng tiếng Hàn…`}
                  aria-label={`Câu trả lời chỗ trống ${gap}`}
                />
              </label>
            ))}
            <p className="writing-save-note">
              Bản nháp được lưu trên thiết bị này. Lời giải chỉ mở sau khi bạn
              điền cả hai ô và nộp bài.
            </p>
            {error && (
              <p className="writing-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="button primary writing-submit"
              disabled={
                !ready || pending || !draft.ㄱ.trim() || !draft.ㄴ.trim()
              }
            >
              <Send size={17} />{" "}
              {pending
                ? "Đang mở lời giải…"
                : result
                  ? "Nộp lại bài viết"
                  : "Nộp bài và xem lời giải"}
            </button>
          </form>
          {result && (
            <div className="writing-feedback" aria-live="polite">
              <div className="writing-feedback-title">
                <Check size={18} />
                <h3>Đối chiếu bài viết</h3>
              </div>
              <p className="writing-feedback-hint">
                Câu viết có thể có nhiều cách đúng. Hãy kiểm tra ý, ngữ pháp và
                mức lịch sự; trang không gắn nhãn đúng/sai cho câu trả lời mở.
              </p>
              {(["ㄱ", "ㄴ"] as const).map((gap) => (
                <div className="writing-feedback-row" key={gap}>
                  <h4 lang="ko">{gap}</h4>
                  <span>Bạn viết</span>
                  <p lang="ko">{draft[gap]}</p>
                  <span>Đáp án tham khảo</span>
                  <p lang="ko" className="writing-reference">
                    {result.answers[gap]}
                  </p>
                  <span>Vì sao?</span>
                  <p>{result.explanations[gap]}</p>
                </div>
              ))}
              {result.reviewNote && (
                <p className="writing-review-note">
                  Lưu ý nguồn: {result.reviewNote}
                </p>
              )}
              <p className="writing-citation">
                Nguồn đáp án: {result.answerSource}
                {result.answerPage ? ` · trang ${result.answerPage}` : ""}.
              </p>
              {result.answerImage && (
                <a
                  href={result.answerImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="writing-notebook-link"
                >
                  Xem trang đáp án gốc <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
          <div className="writing-grammar-side">
            <button
              onClick={() => setShowGrammar(!showGrammar)}
              aria-expanded={showGrammar}
            >
              Ngữ pháp liên quan <span>{showGrammar ? "−" : "+"}</span>
            </button>
            {showGrammar && (
              <ul>
                {matchingGrammar.map((point) => (
                  <li key={point.id}>
                    <strong lang="ko">{point.form}</strong>
                    <span>{point.meaning}</span>
                    <small lang="ko">{point.example}</small>
                  </li>
                ))}
                <li>
                  <Link href="/topik/writing">
                    Xem bảng ngữ pháp đầy đủ <ArrowRight size={14} />
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </aside>
      </div>
      <nav className="writing-prev-next" aria-label="Chuyển bài viết">
        <span>
          {previous && (
            <Link href={`/topik/writing/${previous}`}>
              <ArrowLeft size={16} /> Bài trước
            </Link>
          )}
        </span>
        <span>
          {next && (
            <Link href={`/topik/writing/${next}`}>
              Bài tiếp <ArrowRight size={16} />
            </Link>
          )}
        </span>
      </nav>
    </div>
  );
}
