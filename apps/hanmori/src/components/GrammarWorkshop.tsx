"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, RotateCcw, Sparkles } from "lucide-react";
import {
  gradeGrammarQuiz,
  grammarLessons,
  grammarTopics,
  lessonsForTopic,
  type GrammarTopicId,
} from "@/lib/grammar-workshop";
import {
  grammarCorpusSets,
  grammarCorpusQuestions,
} from "@/lib/grammar-corpus-quiz";

type SessionSelection =
  | { kind: "curated"; topic: GrammarTopicId | "all" }
  | { kind: "corpus"; setIndex: number };

type Session = {
  selection: SessionSelection;
  answers: Record<string, number>;
  submitted: boolean;
};

function titleForSelection(selection: SessionSelection) {
  if (selection.kind === "corpus")
    return "Tủ sách TOPIK II · lượt " + (selection.setIndex + 1);
  if (selection.topic === "all") return "Ôn 16 câu theo chủ đề";
  const selectedTopic = selection.topic;
  return grammarTopics.find((item) => item.id === selectedTopic)?.label ?? "";
}

export function GrammarWorkshop() {
  const [topic, setTopic] = useState<GrammarTopicId>("connections");
  const [corpusSetIndex, setCorpusSetIndex] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const visibleLessons = lessonsForTopic(topic);
  const quizLessons = session
    ? session.selection.kind === "curated"
      ? lessonsForTopic(session.selection.topic)
      : grammarCorpusSets[session.selection.setIndex]
    : [];
  const answered = session ? Object.keys(session.answers).length : 0;
  const score = session ? gradeGrammarQuiz(quizLessons, session.answers) : 0;
  const sessionTitle = session ? titleForSelection(session.selection) : "";
  const nextCorpusSetIndex =
    session?.selection.kind === "corpus" &&
    session.selection.setIndex < grammarCorpusSets.length - 1
      ? session.selection.setIndex + 1
      : null;

  function start(selection: SessionSelection) {
    setSession({ selection, answers: {}, submitted: false });
    requestAnimationFrame(() =>
      document
        .getElementById("grammar-quiz")
        ?.scrollIntoView({ block: "start" }),
    );
  }

  function startCurated(nextTopic: GrammarTopicId | "all") {
    start({ kind: "curated", topic: nextTopic });
  }

  function choose(lessonId: string, choice: number) {
    setSession((current) =>
      current && !current.submitted
        ? { ...current, answers: { ...current.answers, [lessonId]: choice } }
        : current,
    );
  }

  function submit() {
    setSession((current) => (current ? { ...current, submitted: true } : null));
    requestAnimationFrame(() =>
      document
        .getElementById("grammar-result")
        ?.scrollIntoView({ block: "start" }),
    );
  }

  return (
    <div className="page grammar-workshop">
      <div className="grammar-hero">
        <div className="grammar-hero-copy">
          <span className="eyebrow">문법 연습장 · SỔ TAY NGỮ PHÁP</span>
          <h1>
            Đọc một câu.
            <br />
            <em>Hiểu cả cách nói.</em>
          </h1>
          <p>
            Học cấu trúc qua tình huống, rồi thử chọn đáp án. Mỗi câu đều giải
            thích vì sao đúng và vì sao các lựa chọn khác chưa hợp.
          </p>
          <div className="grammar-hero-actions">
            <button
              className="button"
              onClick={() => start({ kind: "corpus", setIndex: 0 })}
            >
              Luyện 10 câu từ Tủ sách <ArrowRight size={17} />
            </button>
            <a className="text-link" href="#grammar-corpus">
              Chọn lượt trong 148 câu
            </a>
          </div>
        </div>
        <div className="grammar-hero-note" aria-hidden="true">
          <span className="grammar-note-pin" />
          <small>오늘의 문장</small>
          <strong lang="ko">
            도서관에 가는
            <br />
            김에 책도 반납할게요.
          </strong>
          <span>Nhân tiện đến thư viện, tôi sẽ trả sách luôn.</span>
          <i>가는 김에</i>
        </div>
      </div>

      <div className="grammar-intro-strip">
        <span>
          <BookOpen size={17} /> 16 bài theo chủ đề · 148 câu từ Tủ sách
        </span>
        <span>
          <Sparkles size={17} /> Ví dụ Hàn–Việt & Hàn–Anh · có lời giải
        </span>
        <span>Biên soạn từ slide và PDF bạn cung cấp</span>
      </div>

      {session ? (
        <section
          id="grammar-quiz"
          className="grammar-quiz"
          aria-label="Bài trắc nghiệm ngữ pháp"
        >
          <div className="grammar-section-title">
            <div>
              <span className="eyebrow">LÀM BÀI · 연습</span>
              <h2>{sessionTitle}</h2>
            </div>
            <button className="text-link" onClick={() => setSession(null)}>
              ← Trở lại bài học
            </button>
          </div>
          <div className="grammar-quiz-status">
            <span>
              {session.submitted
                ? "Kết quả: " + score + "/" + quizLessons.length + " câu đúng"
                : "Đã chọn " + answered + "/" + quizLessons.length + " câu"}
            </span>
            <div className="grammar-progress-track" aria-hidden="true">
              <span
                style={{
                  width:
                    ((session.submitted ? score : answered) /
                      quizLessons.length) *
                      100 +
                    "%",
                }}
              />
            </div>
          </div>
          {session.submitted && (
            <div id="grammar-result" className="grammar-result" role="status">
              <div className="grammar-result-mark">
                <Check size={26} />
              </div>
              <div>
                <span className="eyebrow">ĐÃ NỘP BÀI</span>
                <h3>
                  {score}/{quizLessons.length} câu đúng
                </h3>
                <p>
                  Xem lại từng câu và phần giải thích bên dưới. Câu chưa chọn
                  được tính là chưa đúng.
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() => start(session.selection)}
              >
                <RotateCcw size={16} /> Làm lại
              </button>
            </div>
          )}
          <div className="grammar-questions">
            {quizLessons.map((lesson, index) => {
              const selected = session.answers[lesson.id];
              const correct = selected === lesson.quiz.correct;
              return (
                <fieldset
                  className={
                    "grammar-question " +
                    (session.submitted
                      ? correct
                        ? "is-correct"
                        : "is-wrong"
                      : "")
                  }
                  key={lesson.id}
                >
                  <legend>
                    <span>CÂU {String(index + 1).padStart(2, "0")}</span>
                    {session.submitted && (
                      <span className="grammar-answer-pattern" lang="ko">
                        {lesson.pattern}
                      </span>
                    )}
                  </legend>
                  {session.selection.kind === "corpus" && (
                    <p className="grammar-question-instruction">
                      Theo tài liệu gốc, câu ví dụ này minh họa cấu trúc nào?
                    </p>
                  )}
                  <p className="grammar-question-sentence" lang="ko">
                    {lesson.quiz.sentence}
                  </p>
                  <div className="grammar-options">
                    {lesson.quiz.choices.map((choice, choiceIndex) => (
                      <button
                        type="button"
                        className={
                          "grammar-option " +
                          (selected === choiceIndex ? "is-selected " : "") +
                          (session.submitted &&
                          selected === choiceIndex &&
                          !correct
                            ? "is-incorrect "
                            : "") +
                          (session.submitted &&
                          choiceIndex === lesson.quiz.correct
                            ? "is-answer"
                            : "")
                        }
                        aria-pressed={selected === choiceIndex}
                        disabled={session.submitted}
                        onClick={() => choose(lesson.id, choiceIndex)}
                        key={choiceIndex}
                      >
                        <span className="grammar-choice-letter">
                          {String.fromCharCode(65 + choiceIndex)}
                        </span>
                        <span lang="ko">{choice.text}</span>
                        {session.submitted &&
                          choiceIndex === lesson.quiz.correct && (
                            <span className="grammar-choice-status">
                              Đáp án đúng
                            </span>
                          )}
                        {session.submitted &&
                          selected === choiceIndex &&
                          choiceIndex !== lesson.quiz.correct && (
                            <span className="grammar-choice-status">
                              Bạn chọn
                            </span>
                          )}
                      </button>
                    ))}
                  </div>
                  {session.submitted && (
                    <div className="grammar-explanation">
                      <strong>
                        {correct
                          ? "Bạn đã chọn đúng."
                          : selected === undefined
                            ? "Bạn chưa chọn đáp án."
                            : "Đáp án này chưa đúng."}{" "}
                        Đáp án: {String.fromCharCode(65 + lesson.quiz.correct)}.
                      </strong>
                      <p className="grammar-explanation-main">
                        {lesson.quiz.choices[lesson.quiz.correct].reason}
                      </p>
                      <ul>
                        {lesson.quiz.choices.map(
                          (choice, choiceIndex) =>
                            choiceIndex !== lesson.quiz.correct && (
                              <li key={choiceIndex}>
                                <b>{String.fromCharCode(65 + choiceIndex)}.</b>{" "}
                                {choice.reason}
                              </li>
                            ),
                        )}
                      </ul>
                      <p className="grammar-explanation-source">
                        Đối chiếu: {lesson.source.document},{" "}
                        {lesson.source.location}
                      </p>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>
          {!session.submitted && (
            <div className="grammar-submit">
              <p>
                Bạn có thể nộp khi chưa chọn hết câu; câu bỏ trống sẽ tính là
                chưa đúng.
              </p>
              <button className="button" onClick={submit}>
                Nộp bài & xem lời giải <ArrowRight size={17} />
              </button>
            </div>
          )}
          {session.submitted && (
            <div className="grammar-next">
              {nextCorpusSetIndex !== null && (
                <button
                  className="button"
                  onClick={() =>
                    start({
                      kind: "corpus",
                      setIndex: nextCorpusSetIndex,
                    })
                  }
                >
                  Luyện lượt tiếp theo <ArrowRight size={17} />
                </button>
              )}
              <button className="button" onClick={() => setSession(null)}>
                Học tiếp các cấu trúc <ArrowRight size={17} />
              </button>
            </div>
          )}
        </section>
      ) : (
        <section
          id="grammar-topics"
          className="grammar-study"
          aria-label="Các nhóm ngữ pháp"
        >
          <div className="grammar-section-title">
            <div>
              <span className="eyebrow">CHỌN MỘT NHÓM ĐỂ BẮT ĐẦU</span>
              <h2>Học theo cách câu vận hành.</h2>
            </div>
            <p>
              Mỗi nhóm gồm 4 cấu trúc, một ví dụ và một câu luyện cho từng cấu
              trúc.
            </p>
          </div>
          <div
            className="grammar-topic-tabs"
            role="group"
            aria-label="Nhóm ngữ pháp"
          >
            {grammarTopics.map((item, index) => (
              <button
                key={item.id}
                className={
                  "grammar-topic-tab tone-" +
                  (index + 1) +
                  (topic === item.id ? " active" : "")
                }
                aria-pressed={topic === item.id}
                onClick={() => setTopic(item.id)}
              >
                <span lang="ko">{item.korean}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <div className="grammar-topic-heading">
            <p>
              {grammarTopics.find((item) => item.id === topic)?.description}
            </p>
            <div className="grammar-topic-actions">
              <button
                className="button secondary"
                onClick={() => startCurated("all")}
              >
                Ôn cả 16 câu
              </button>
              <button className="button" onClick={() => startCurated(topic)}>
                Luyện 4 câu của nhóm này <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="grammar-lesson-grid">
            {visibleLessons.map((lesson, index) => (
              <article className="grammar-lesson" key={lesson.id}>
                <div className="grammar-lesson-top">
                  <span>{String(index + 1).padStart(2, "0")} / 04</span>
                  <span lang="ko">
                    {
                      grammarTopics.find((item) => item.id === lesson.topic)
                        ?.korean
                    }
                  </span>
                </div>
                <h3 lang="ko">{lesson.pattern}</h3>
                <strong>{lesson.meaning}</strong>
                <p>{lesson.usage}</p>
                <div className="grammar-example-box">
                  <span>VÍ DỤ · 예문</span>
                  <p lang="ko">{lesson.example}</p>
                  <p>{lesson.translation}</p>
                </div>
                <p className="grammar-tip">
                  <b>Ghi nhớ:</b> {lesson.tip}
                </p>
                <small>
                  Nguồn tham khảo: {lesson.source.document},{" "}
                  {lesson.source.location}
                </small>
              </article>
            ))}
          </div>
          <div id="grammar-corpus" className="grammar-corpus-panel">
            <div>
              <span className="eyebrow">TOPIK II · NGÂN HÀNG HÀN–ANH</span>
              <h2>148 cấu trúc, 148 câu để nhận diện.</h2>
              <p>
                Mỗi câu lấy một ví dụ từ Tủ sách và hỏi cấu trúc mà tài liệu gốc
                gắn với ví dụ đó. Chia thành 15 lượt ngắn để bạn học lần lượt;
                phần giải thích giữ nghĩa tiếng Anh và số trang nguồn.
              </p>
            </div>
            <div className="grammar-corpus-controls">
              <label htmlFor="grammar-corpus-set">Chọn lượt ôn tập</label>
              <select
                id="grammar-corpus-set"
                value={corpusSetIndex}
                onChange={(event) =>
                  setCorpusSetIndex(Number(event.target.value))
                }
              >
                {grammarCorpusSets.map((set, index) => (
                  <option key={index} value={index}>
                    Lượt {index + 1} · Mục {index * 10 + 1}–
                    {index * 10 + set.length} ({set.length} câu)
                  </option>
                ))}
              </select>
              <button
                className="button"
                onClick={() =>
                  start({ kind: "corpus", setIndex: corpusSetIndex })
                }
              >
                Luyện {grammarCorpusSets[corpusSetIndex].length} câu{" "}
                <ArrowRight size={16} />
              </button>
              <small>
                {grammarCorpusQuestions.length} câu bao phủ toàn bộ 148 mục; câu
                hỏi và lời giải được tạo từ bảng Hàn–Anh đã có.
              </small>
            </div>
          </div>
          <div className="grammar-library-link">
            <span>Muốn tra thêm cấu trúc Hàn–Anh?</span>
            <Link href="/library?tab=grammar">
              Mở 148 cấu trúc trong Tủ sách <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
