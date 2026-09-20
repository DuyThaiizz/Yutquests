"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { lessons } from "@/lib/catalog";
import { choicesFor, isCorrectAnswer, shuffled } from "@/lib/learning";
import type { Vocabulary } from "@/lib/models";
interface Question {
  word: Vocabulary;
  choices: string[];
}
export function Practice() {
  const { data, ready, review } = useStudy();
  const param = useSearchParams().get("lesson");
  const [lesson, setLesson] = useState(
    lessons.some((item) => item.id === param) ? param! : "all",
  );
  const [mode, setMode] = useState<"choice" | "fill">("choice");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState(false),
    [score, setScore] = useState(0);
  const locked = useRef(false);
  const question = questions?.[index];
  const correct = question
    ? isCorrectAnswer(question.word, answer, mode)
    : false;
  function start() {
    const all = data.vocabulary.filter((item) => item.status === "published");
    const chosen = shuffled(
      all.filter((item) => lesson === "all" || item.lessonId === lesson),
    ).slice(0, 5);
    setQuestions(
      chosen.map((word) => ({ word, choices: choicesFor(word, all) })),
    );
    setIndex(0);
    setScore(0);
    setAnswer("");
    setChecked(false);
    locked.current = false;
  }
  function check() {
    if (!question || !answer.trim() || locked.current) return;
    locked.current = true;
    setChecked(true);
    if (correct) setScore((value) => value + 1);
    review(question.word.id, correct ? "good" : "again", correct);
  }
  function next() {
    setIndex((value) => value + 1);
    setAnswer("");
    setChecked(false);
    locked.current = false;
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">연습 · THỬ SỨC MỘT CHÚT</span>
          <h1>Học rồi, mình cùng thử nhé.</h1>
          <p>Không sao nếu chưa đúng. Mỗi lần thử là một lần nhớ thêm.</p>
        </div>
      </div>
      <div className="session-wrap">
        {!ready ? (
          <p className="loading-text">Đang chuẩn bị bài tập…</p>
        ) : questions && index >= questions.length ? (
          <div className="empty-state">
            <div className="result-symbol">
              <Check size={42} />
            </div>
            <h2>Bạn đã hoàn thành bài luyện!</h2>
            <p>
              {score === questions.length
                ? "Rất tốt! Những từ này đang dần trở nên quen thuộc."
                : "Những từ chưa nhớ đã được hẹn ôn lại sau 10 phút."}
            </p>
            <div className="summary-stats">
              <div>
                <strong>
                  {score}/{questions.length}
                </strong>
                <span>Câu trả lời đúng</span>
              </div>
              <div>
                <strong>
                  {questions.length
                    ? Math.round((score / questions.length) * 100)
                    : 0}
                  %
                </strong>
                <span>Độ chính xác</span>
              </div>
            </div>
            <p>+10 XP cho mỗi từ trả lời đúng lần đầu trong ngày.</p>
            <div className="button-row">
              <button className="button" onClick={() => setQuestions(null)}>
                Luyện thêm một lượt
              </button>
              <Link href="/progress" className="button secondary">
                Xem tiến độ
              </Link>
            </div>
          </div>
        ) : question ? (
          <>
            <div className="session-heading">
              <span>
                {mode === "choice" ? "Chọn nghĩa đúng" : "Viết từ tiếng Hàn"}
              </span>
              <strong>
                Câu {index + 1} / {questions!.length}
              </strong>
              <button className="text-link" onClick={() => setQuestions(null)}>
                Kết thúc
              </button>
            </div>
            <div className="progress-track">
              <span
                style={{ width: `${(index / questions!.length) * 100}%` }}
              />
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (checked) next();
                else check();
              }}
            >
              <div className="question-card">
                <span className="eyebrow">
                  {mode === "choice"
                    ? "TỪ NÀY CÓ NGHĨA LÀ GÌ?"
                    : "TỪ TIẾNG HÀN NÀO CÓ NGHĨA LÀ…"}
                </span>
                <h2
                  className={mode === "fill" ? "vietnamese-question" : ""}
                  lang={mode === "choice" ? "ko" : "vi"}
                >
                  {mode === "choice"
                    ? question.word.korean
                    : question.word.meaning}
                </h2>
                <p>
                  {mode === "choice"
                    ? question.word.romanization
                    : "Nhập Hangul, không cần phiên âm."}
                </p>
                {mode === "choice" ? (
                  <div className="answers">
                    {question.choices.map((choice, i) => (
                      <button
                        type="button"
                        key={choice}
                        disabled={checked}
                        aria-pressed={answer === choice}
                        className={`answer ${answer === choice ? "selected" : ""} ${checked && choice === question.word.meaning ? "correct" : ""} ${checked && answer === choice && !correct ? "wrong" : ""}`}
                        onClick={() => setAnswer(choice)}
                      >
                        <span>{String.fromCharCode(65 + i)}</span>
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <label>
                    <span className="sr-only">Đáp án tiếng Hàn</span>
                    <input
                      className="question-input"
                      lang="ko"
                      autoComplete="off"
                      value={answer}
                      disabled={checked}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Nhập từ tiếng Hàn…"
                    />
                  </label>
                )}
              </div>
              {checked && (
                <div
                  className={`feedback ${correct ? "" : "wrong"}`}
                  role="status"
                >
                  <strong>
                    {correct
                      ? "Chính xác! Bạn nhớ rất tốt."
                      : `Đáp án là: ${mode === "choice" ? question.word.meaning : question.word.korean}`}
                  </strong>
                  <p>
                    <span lang="ko">{question.word.example}</span>
                    <br />
                    {question.word.translation}
                  </p>
                </div>
              )}
              <div className="question-action">
                <button
                  className="button"
                  type="submit"
                  disabled={!answer.trim()}
                >
                  {checked
                    ? index === questions!.length - 1
                      ? "Xem kết quả"
                      : "Câu tiếp theo"
                    : "Kiểm tra đáp án"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <section className="session-start">
            <span className="eyebrow">5 CÂU HỎI · MỘT KHOẢNG NGHỈ NHỎ</span>
            <h2 style={{ marginTop: 12 }}>Biến từ mới thành điều quen.</h2>
            <p>
              Bài tập được tạo từ các từ vựng đã xuất bản. Bạn nhận điểm cho câu
              trả lời đúng đầu tiên của mỗi từ trong ngày.
            </p>
            <label htmlFor="practice-lesson">Chủ đề luyện tập</label>
            <select
              id="practice-lesson"
              value={lesson}
              onChange={(event) => setLesson(event.target.value)}
            >
              <option value="all">Tất cả bài học</option>
              {lessons.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <label>Dạng bài tập</label>
            <div className="tabs">
              <button
                className={mode === "choice" ? "selected" : ""}
                aria-pressed={mode === "choice"}
                onClick={() => setMode("choice")}
              >
                Trắc nghiệm
              </button>
              <button
                className={mode === "fill" ? "selected" : ""}
                aria-pressed={mode === "fill"}
                onClick={() => setMode("fill")}
              >
                Điền từ tiếng Hàn
              </button>
            </div>
            <button
              className="button"
              disabled={
                !data.vocabulary.some(
                  (item) =>
                    item.status === "published" &&
                    (lesson === "all" || item.lessonId === lesson),
                )
              }
              onClick={start}
            >
              Bắt đầu luyện tập <ArrowRight size={17} />
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
