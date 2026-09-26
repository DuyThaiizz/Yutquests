"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, RotateCcw, Volume2, Bookmark } from "lucide-react";
import { useStudy } from "./StudyProvider";
import { usePronunciation } from "./Pronunciation";
import { lessons } from "@/lib/catalog";
import { scheduleReview, prioritizeReview } from "@/lib/learning-core";
import { levelLabel } from "@/lib/source-catalog";
import { SourceTag } from "./SourceTag";
import type { Grade } from "@/lib/models";
const grades: { grade: Grade; label: string }[] = [
  { grade: "again", label: "Chưa nhớ" },
  { grade: "hard", label: "Hơi khó" },
  { grade: "good", label: "Đã nhớ" },
  { grade: "easy", label: "Rất dễ" },
];
export function Review() {
  const { data, ready, review, toggleSaved } = useStudy();
  const search = useSearchParams();
  const lessonParam = search.get("lesson");
  const deckParam = search.get("deck");
  const deck = data.decks.find((item) => item.id === deckParam);
  const [lesson, setLesson] = useState(
    lessons.some((item) => item.id === lessonParam) ? lessonParam! : "all",
  );
  const [filter, setFilter] = useState<"due" | "new" | "all">(
    lessonParam || deckParam ? "all" : "due",
  );
  const [queue, setQueue] = useState<string[] | null>(null),
    [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false);
  const speak = usePronunciation();
  const lock = useRef(false);
  const available = prioritizeReview(
    data.vocabulary.filter(
      (word) =>
        word.status === "published" &&
        (!deckParam ||
          !!deck?.noteIds.some((id) => word.id === `note-${id}`)) &&
        (!!deckParam || lesson === "all" || word.lessonId === lesson) &&
        (filter === "all" ||
          (filter === "new"
            ? !data.reviews[word.id]
            : data.reviews[word.id] &&
              new Date(data.reviews[word.id].due) <= new Date())),
    ),
    data.reviews,
  );
  const word = queue
    ? data.vocabulary.find(
        (item) => item.id === queue[index] && item.status === "published",
      )
    : undefined;
  function grade(grade: Grade) {
    if (!word || !flipped || lock.current) return;
    lock.current = true;
    review(word.id, grade);
    setIndex((value) => value + 1);
    setFlipped(false);
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">복습 · GẶP LẠI ĐỂ NHỚ LÂU</span>
          <h1>Một tấm thẻ, một từ quen.</h1>
          <p>Thử nhớ nghĩa trước khi lật thẻ. Không cần vội vàng.</p>
          {deckParam && (
            <p>
              Bộ thẻ cá nhân: {deck?.name || "Không tìm thấy bộ thẻ"} ·{" "}
              <Link href="/notebook/unknown">Về ghi chú</Link>
            </p>
          )}
        </div>
      </div>
      <div className="session-wrap">
        {!ready ? (
          <p className="loading-text">Đang mở sổ học của bạn…</p>
        ) : queue && index >= queue.length ? (
          <div className="empty-state">
            <div className="result-symbol">
              <Check size={43} />
            </div>
            <h2>Thêm một bước nhỏ, thật đáng tự hào.</h2>
            <p>
              Bạn vừa ôn {queue.length} từ. Lịch ôn tiếp theo đã được cập nhật.
            </p>
            <div className="button-row">
              <button
                className="button"
                onClick={() => {
                  setQueue(null);
                  setIndex(0);
                  setFlipped(false);
                  lock.current = false;
                }}
              >
                Chọn bộ thẻ khác
              </button>
              <Link className="button secondary" href="/progress">
                Xem hành trình
              </Link>
            </div>
          </div>
        ) : queue && word ? (
          <>
            <div className="session-heading">
              <span>
                {deck?.name ||
                  lessons.find((item) => item.id === word.lessonId)?.title ||
                  "Từ vựng cá nhân"}
              </span>
              <strong>
                {index + 1} / {queue.length}
              </strong>
              <button
                className="text-link"
                onClick={() => {
                  setQueue(null);
                  setIndex(0);
                  setFlipped(false);
                  lock.current = false;
                }}
              >
                Kết thúc
              </button>
            </div>
            <div className="progress-track">
              <span style={{ transform: `scaleX(${index / queue.length})` }} />
            </div>
            <button
              className="flashcard"
              aria-label={flipped ? "Mặt nghĩa của thẻ" : "Lật thẻ xem nghĩa"}
              aria-pressed={flipped}
              onClick={() => {
                setFlipped((value) => !value);
                lock.current = false;
              }}
            >
              <span className="eyebrow">
                {flipped
                  ? "NGHĨA & VÍ DỤ"
                  : `${word.wordType ? word.wordType.toLocaleUpperCase("vi") + " · " : ""}${word.lessonId === "personal" ? "BỘ THẺ CÁ NHÂN" : levelLabel(word)}${word.meaningLanguage === "en" ? " · HÀN–ANH" : ""}`}
              </span>
              {flipped ? (
                <>
                  <strong className="flash-meaning">{word.meaning}</strong>
                  <p className="flash-example" lang="ko">
                    {word.example}
                  </p>
                  <p className="flash-translation">{word.translation}</p>
                </>
              ) : (
                <>
                  <span className="flash-korean" lang="ko">
                    {word.korean}
                  </span>
                  <span className="romanization">{word.romanization}</span>
                </>
              )}
              <span className="flash-hint">
                <RotateCcw
                  size={12}
                  style={{ verticalAlign: "middle", marginRight: 6 }}
                />
                {flipped
                  ? "Nhấn để xem lại từ Hàn"
                  : "Nhấn vào thẻ để khám phá nghĩa"}
              </span>
            </button>
            <SourceTag word={word} />
            <div className="flash-audio">
              <button
                className="audio-button"
                onClick={() => speak(word.korean)}
              >
                <Volume2 size={16} /> Nghe phát âm
              </button>
              <button
                className="audio-button"
                aria-pressed={data.saved.includes(word.id)}
                onClick={() => toggleSaved(word.id)}
              >
                <Bookmark size={16} />
                {data.saved.includes(word.id)
                  ? "Đã lưu vào sổ"
                  : "Lưu vào sổ từ"}
              </button>
            </div>
            {flipped ? (
              <>
                <p className="grade-heading">Bạn nhớ từ này đến đâu?</p>
                <div className="grade-buttons">
                  {grades.map((item) => {
                    const scheduled = scheduleReview(
                      data.reviews[word.id],
                      item.grade,
                      new Date(),
                    );
                    return (
                      <button
                        key={item.grade}
                        onClick={() => grade(item.grade)}
                      >
                        {item.label}
                        <small>
                          {item.grade === "again"
                            ? "Ôn sau 10 phút"
                            : `${scheduled.interval} ngày nữa`}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="study-tip">
                Lật thẻ rồi tự đánh giá để đặt lịch ôn phù hợp.
              </p>
            )}
          </>
        ) : queue ? (
          <div className="empty-state">
            <h2>Nội dung đã thay đổi.</h2>
            <p>Từ này đã được thu hồi. Hãy chọn lại bộ thẻ.</p>
            <button
              className="button"
              onClick={() => {
                setQueue(null);
                setIndex(0);
              }}
            >
              Chọn bộ thẻ
            </button>
          </div>
        ) : (
          <section className="session-start">
            <span className="eyebrow">MỖI NGÀY MỘT CHÚT</span>
            <h2 style={{ marginTop: 12 }}>Chọn những từ mình sẽ gặp.</h2>
            <p>
              Những từ chưa nhớ sẽ quay lại sớm hơn. Những từ đã quen sẽ được ôn
              thưa dần.
            </p>
            {!deckParam && (
              <>
                <label htmlFor="review-lesson">Chủ đề</label>
                <select
                  id="review-lesson"
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
              </>
            )}
            <div className="tabs">
              {(
                [
                  { value: "due", label: "Đến hạn ôn" },
                  { value: "new", label: "Từ mới" },
                  { value: "all", label: "Tất cả từ" },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  aria-pressed={filter === item.value}
                  className={filter === item.value ? "selected" : ""}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p>
              {available.length
                ? `${available.length} từ đang chờ bạn. Mỗi lượt học tối đa 10 từ.`
                : filter === "due"
                  ? "Chưa có từ đến hạn. Bạn có thể bắt đầu với một vài từ mới."
                  : "Chưa có từ phù hợp. Hãy chọn chủ đề khác."}
            </p>
            {available.length ? (
              <button
                className="button"
                onClick={() => {
                  setQueue(available.slice(0, 10).map((item) => item.id));
                  setIndex(0);
                  lock.current = false;
                }}
              >
                Bắt đầu ôn tập <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="button secondary"
                onClick={() => setFilter("all")}
              >
                Khám phá tất cả từ
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
