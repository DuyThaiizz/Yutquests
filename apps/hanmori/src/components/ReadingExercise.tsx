"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { z } from "zod";
import {
  Check,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Send,
  RotateCcw,
} from "lucide-react";
import type {
  ReadingPage,
  ReadingSet,
  ReadingType,
  ReadingResult,
} from "@/lib/reading";
const draftSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(1).max(4)),
  submitted: z.boolean(),
});
const resultSchema = z.object({
  setId: z.string(),
  correct: z.number(),
  total: z.number(),
  rows: z.array(
    z.object({
      number: z.number(),
      chosen: z.number().nullable(),
      answer: z.number(),
      answerPage: z.number(),
      explanation: z
        .object({
          reason: z.string(),
          elimination: z.string(),
          evidence: z.string().optional(),
        })
        .nullable(),
    }),
  ),
});
export function ReadingExercise({
  set,
  type,
  pages,
  answerSource,
}: {
  set: ReadingSet;
  type: ReadingType;
  pages: ReadingPage[];
  answerSource: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({}),
    [ready, setReady] = useState(false),
    [result, setResult] = useState<ReadingResult | null>(null),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false),
    [zoom, setZoom] = useState(false),
    [transcript, setTranscript] = useState(false),
    [sourcePage, setSourcePage] = useState(0);
  const [view, setView] = useState<"paper" | "answers">("paper");
  const restoring = useRef(false),
    canSave = useRef(true),
    lock = useRef(false);
  const storage = `hanmori-reading-${set.id}`;
  async function submit(values: Record<string, number>) {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/reading/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setId: set.id, answers: values }),
      });
      if (!response.ok)
        throw new Error(
          "Chưa chấm được bài. Bài làm vẫn được giữ; hãy thử nộp lại.",
        );
      const parsed = resultSchema.parse(await response.json());
      setResult(parsed);
      setView("answers");
      setConfirm(false);
    } catch {
      setError("Chưa chấm được bài. Bài làm vẫn được giữ; hãy thử nộp lại.");
    } finally {
      setPending(false);
      lock.current = false;
      restoring.current = false;
    }
  }
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storage);
      if (raw) {
        const saved = draftSchema.parse(JSON.parse(raw));
        if (
          Object.keys(saved.answers).some(
            (n) => !set.numbers.map(String).includes(n),
          )
        )
          throw new Error("Invalid draft");
        setAnswers(saved.answers);
        if (saved.submitted) {
          restoring.current = true;
          void submit(saved.answers);
        }
      }
    } catch {
      canSave.current = false;
      setError(
        "Bản lưu của bài này không đọc được. Bản cũ được giữ nguyên; chọn Làm lại để bắt đầu bản mới.",
      );
    }
    setReady(true);
  }, [storage]);
  useEffect(() => {
    if (!ready || !canSave.current || restoring.current) return;
    try {
      localStorage.setItem(
        storage,
        JSON.stringify({ answers, submitted: !!result }),
      );
    } catch {
      setError(
        "Trình duyệt không lưu được bài làm. Hãy giữ trang này mở khi làm bài.",
      );
    }
  }, [answers, result, ready, storage]);
  const page = pages[sourcePage];
  const source = set.pages[sourcePage];
  const answered = Object.keys(answers).length;
  return (
    <div className="page reading-exercise">
      <Link href="/topik" className="text-link">
        <ArrowLeft size={15} /> Chọn dạng bài khác
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            읽기 · DẠNG {type.id.toUpperCase()} · KỲ {set.exam}
          </span>
          <h1>{type.title}</h1>
          <p>
            Câu {type.start}–{type.end} · Làm bài theo nhịp của bạn, không giới
            hạn thời gian.
          </p>
        </div>
        <Link href="/notebook/unknown" className="button secondary">
          Từ vựng chưa biết
        </Link>
      </div>
      {set.sourceNote && <p className="notice-panel">{set.sourceNote}</p>}
      <div
        className="reading-view-switch"
        role="group"
        aria-label="Không gian làm bài"
      >
        <button
          aria-pressed={view === "paper"}
          aria-controls="reading-paper"
          onClick={() => setView("paper")}
        >
          Đề bài
        </button>
        <button
          aria-pressed={view === "answers"}
          aria-controls="reading-answers"
          onClick={() => setView("answers")}
        >
          {result ? "Kết quả" : "Trả lời"}{" "}
          <span>
            {answered}/{set.numbers.length}
          </span>
        </button>
      </div>
      <div className="reading-workspace" data-view={view}>
        <section
          className="reading-paper"
          id="reading-paper"
          aria-label="Đề bài"
        >
          <div className="paper-toolbar">
            <div className="tabs">
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  className={i === sourcePage ? "selected" : ""}
                  aria-pressed={i === sourcePage}
                  onClick={() => setSourcePage(i)}
                >
                  Trang {i + 1}
                </button>
              ))}
            </div>
            <button
              className="text-link"
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? <ZoomOut size={17} /> : <ZoomIn size={17} />}{" "}
              {zoom ? "Thu gọn" : "Phóng to"}
            </button>
            <button
              className="text-link"
              aria-pressed={transcript}
              onClick={() => setTranscript(!transcript)}
            >
              {transcript ? "Đóng bản chữ" : "Bản chữ nhận dạng"}
            </button>
          </div>
          <p className="paper-hint">
            Bôi đen từ trên đề rồi chọn “Lưu từ chưa biết”. Chữ nhận dạng có thể
            sai dấu hoặc khoảng cách; kiểm tra với ảnh trước khi lưu.
          </p>
          <div className="paper-scroll">
            <div
              className={`source-sheet ${zoom ? "zoomed" : ""}`}
              style={{ aspectRatio: `${page.width}/${page.height}` }}
              data-reading-context
            >
              {/* The original page remains visible; OCR only supplies selectable text. */}
              <img
                src={`/reading/${page.id}.webp`}
                width={page.width}
                height={page.height}
                alt={`Đề đọc TOPIK kỳ ${set.exam}, trang nguồn ${source.page}`}
                draggable={false}
              />
              <div
                className="ocr-overlay"
                lang="ko"
                aria-label="Chữ nhận dạng để chọn từ"
              >
                {page.words.map((w, i) => (
                  <span
                    key={`${page.id}-${i}`}
                    style={{
                      left: `${(w.x / page.width) * 100}%`,
                      top: `${(w.y / page.height) * 100}%`,
                      width: `${(w.width / page.width) * 100}%`,
                      height: `${(w.height / page.height) * 100}%`,
                      fontSize: `${(w.height / page.width) * 85}cqw`,
                    }}
                  >
                    {w.text}{" "}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {transcript && (
            <div className="ocr-transcript" lang="ko" data-reading-context>
              <strong>Bản nhận dạng tự động — đối chiếu với ảnh gốc</strong>
              <p>{page.text}</p>
            </div>
          )}
          <p className="source-tag">
            {source.file} · Trang {source.page}
          </p>
        </section>
        <aside
          className="answer-panel panel"
          id="reading-answers"
          aria-label="Phiếu làm bài"
        >
          <span className="eyebrow">PHIẾU LÀM BÀI</span>
          <h2>{result ? "Kết quả của bạn" : "Chọn đáp án"}</h2>
          {result ? (
            <div className="reading-score">
              <strong>
                {result.correct}
                <small>/{result.total}</small>
              </strong>
              <span>
                câu đúng · {Math.round((result.correct / result.total) * 100)}%
              </span>
            </div>
          ) : (
            <p>
              {answered}/{set.numbers.length} câu đã chọn
            </p>
          )}
          {set.numbers.map((n) => {
            const row = result?.rows.find((r) => r.number === n);
            return (
              <fieldset key={n} disabled={!ready || pending || !!result}>
                <legend>
                  Câu {n}{" "}
                  {row && (
                    <span
                      className={
                        row.chosen === row.answer
                          ? "answer-correct"
                          : "answer-wrong"
                      }
                    >
                      {row.chosen === null
                        ? "Chưa trả lời"
                        : row.chosen === row.answer
                          ? "Đúng"
                          : "Sai"}
                    </span>
                  )}
                </legend>
                <div className="reading-choices">
                  {[1, 2, 3, 4].map((value) => (
                    <label
                      key={value}
                      className={`${answers[n] === value ? "picked" : ""} ${row?.answer === value ? "correct" : ""} ${row && row.chosen === value && row.chosen !== row.answer ? "wrong" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${n}`}
                        value={value}
                        checked={answers[n] === value}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [n]: value }))
                        }
                        aria-label={`Câu ${n}, đáp án ${value}`}
                      />
                      <span>{value}</span>
                      {row?.answer === value && <Check size={13} />}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
          {error && (
            <p className="form-message" role="alert">
              {error}
            </p>
          )}
          {!result && (
            <>
              <button
                className="button"
                disabled={!ready || pending}
                onClick={() =>
                  answered < set.numbers.length
                    ? setConfirm(true)
                    : void submit(answers)
                }
              >
                <Send size={16} />
                {pending ? "Đang chấm bài…" : "Nộp bài"}
              </button>
              {confirm && (
                <div className="confirmation">
                  <p>
                    Còn {set.numbers.length - answered} câu chưa chọn. Các câu
                    này sẽ tính là chưa đúng.
                  </p>
                  <button
                    className="button secondary"
                    disabled={pending}
                    onClick={() => void submit(answers)}
                  >
                    Vẫn nộp bài
                  </button>
                  <button
                    className="text-link"
                    onClick={() => setConfirm(false)}
                  >
                    Làm tiếp
                  </button>
                </div>
              )}
            </>
          )}
          {(result || !canSave.current) && (
            <button
              className="button secondary"
              onClick={() => {
                canSave.current = true;
                setResult(null);
                setAnswers({});
                setError("");
                setConfirm(false);
              }}
            >
              <RotateCcw size={16} /> Làm lại
            </button>
          )}
          <p className="storage-note">
            Bài làm được lưu trên trình duyệt này. Đáp án và lời giải chỉ xuất
            hiện sau khi nộp.
          </p>
        </aside>
      </div>
      {result && (
        <section className="reading-solutions" aria-label="Đáp án và lời giải">
          <span className="eyebrow">ĐỌC LẠI ĐỂ HIỂU SÂU</span>
          <h2>Đáp án & lời giải</h2>
          <p>
            Đáp án đối chiếu theo bảng huongiu. Phần giải thích được biên soạn
            riêng từ nội dung đề.
          </p>
          {result.rows.map((row) => (
            <article className="solution-card panel" key={row.number}>
              <div className="solution-heading">
                <h3>Câu {row.number}</h3>
                <span
                  className={
                    row.chosen === row.answer
                      ? "answer-correct"
                      : "answer-wrong"
                  }
                >
                  {row.chosen === null
                    ? "Bạn chưa trả lời"
                    : `Bạn chọn ${row.chosen}`}{" "}
                  · Đáp án {row.answer}
                </span>
              </div>
              {row.explanation ? (
                <>
                  <h4>Vì sao chọn đáp án {row.answer}?</h4>
                  <p>{row.explanation.reason}</p>
                  {row.explanation.evidence && (
                    <blockquote lang="ko">
                      {row.explanation.evidence}
                    </blockquote>
                  )}
                  <h4>Vì sao loại các đáp án còn lại?</h4>
                  <p>{row.explanation.elimination}</p>
                </>
              ) : (
                <p>
                  Chưa có lời giải được đối chiếu cho câu này. Hãy dùng đáp án
                  và đề gốc để kiểm tra; không suy diễn lý do từ số đáp án.
                </p>
              )}
              <small>
                {answerSource} · Trang {row.answerPage} · Kỳ {set.exam}, câu{" "}
                {row.number}
              </small>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
