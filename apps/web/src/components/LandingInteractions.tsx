"use client";

import Link from "next/link";
import { useState } from "react";
import { idioms } from "@/lib/idioms";

const outcomes = [
  { name: "Do", korean: "도", steps: 1, faces: [true, false, false, false], note: "Một bước để bắt đầu hành trình." },
  { name: "Gae", korean: "개", steps: 2, faces: [true, true, false, false], note: "Hai bước — vừa đủ để chạm một ô học." },
  { name: "Geol", korean: "걸", steps: 3, faces: [true, true, true, false], note: "Ba bước mở ra một lựa chọn chiến thuật." },
  { name: "Yut", korean: "윷", steps: 4, faces: [true, true, true, true], note: "Bốn bước và bạn được tung thêm một lần." },
  { name: "Mo", korean: "모", steps: 5, faces: [false, false, false, false], note: "Năm bước — cú tung hiếm nhất trên bàn." },
];

const loop = [
  {
    id: "throw",
    number: "01",
    label: "Tung",
    korean: "던지다",
    title: "May mắn tạo nhịp.",
    text: "Bốn thanh Yut quyết định số bước. Kết quả luôn đủ bất ngờ để mỗi lượt chơi có một câu chuyện riêng.",
  },
  {
    id: "learn",
    number: "02",
    label: "Học",
    korean: "배우다",
    title: "Ngữ cảnh tạo trí nhớ.",
    text: "Thẻ thành ngữ xuất hiện đúng lúc, cho bạn chọn nghĩa rồi giải thích nghĩa đen, nghĩa bóng và cách dùng.",
  },
  {
    id: "move",
    number: "03",
    label: "Tiến",
    korean: "나아가다",
    title: "Chiến thuật tạo động lực.",
    text: "Đường tắt, bắt quân và lượt thưởng biến kiến thức vừa học thành một phần có ý nghĩa của cuộc chơi.",
  },
];

export function HeroYutDemo() {
  const [resultIndex, setResultIndex] = useState(1);
  const [throws, setThrows] = useState(0);
  const result = outcomes[resultIndex];

  function throwYut() {
    const offset = 1 + Math.floor(Math.random() * (outcomes.length - 1));
    const next = (resultIndex + offset) % outcomes.length;
    setResultIndex(next);
    setThrows((value) => value + 1);
  }

  return (
    <div className="landing-playground" aria-label="Bản thử tung thanh Yut">
      <div className="playground-topline">
        <span>Thử một lượt</span>
        <span className="playground-status"><i /> Tương tác trực tiếp</span>
      </div>

      <div className="playground-stage">
        <div className="throw-orbit orbit-one" aria-hidden="true" />
        <div className="throw-orbit orbit-two" aria-hidden="true" />
        <div className="landing-sticks" aria-hidden="true" data-throws={throws}>
          {result.faces.map((flat, index) => (
            <i className={flat ? "is-flat" : "is-round"} key={`${throws}-${index}`}>
              <span>{flat ? "●" : ""}</span>
            </i>
          ))}
        </div>
        <div className="landing-result" aria-live="polite">
          <span className="result-korean" lang="ko">{result.korean}</span>
          <div>
            <p>{result.name}</p>
            <strong>+{result.steps} bước</strong>
          </div>
        </div>
      </div>

      <div className="playground-footer">
        <p>{result.note}</p>
        <button className="throw-button" type="button" onClick={throwYut}>
          Tung lại <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="mini-track" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <i className={index <= result.steps ? "is-active" : ""} key={index} />
        ))}
        <span style={{ left: `${12 + result.steps * 11}%` }}>말</span>
      </div>
    </div>
  );
}

export function LearningLoop() {
  const [active, setActive] = useState(0);
  const item = loop[active];

  return (
    <div className="loop-experience">
      <div className="loop-tabs" role="tablist" aria-label="Ba nhịp chơi của Yutquest">
        {loop.map((step, index) => (
          <button
            aria-controls="loop-panel"
            aria-selected={active === index}
            className={active === index ? "is-active" : ""}
            id={`loop-tab-${step.id}`}
            key={step.id}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span>{step.number}</span>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`loop-tab-${item.id}`}
        className={`loop-panel loop-panel-${item.id}`}
        id="loop-panel"
        role="tabpanel"
      >
        <div className="loop-visual" aria-hidden="true">
          <span className="loop-korean" lang="ko">{item.korean}</span>
          <div className="loop-mark"><i /><i /><i /><i /></div>
          <small>YUTQUEST · 0{active + 1}</small>
        </div>
        <div className="loop-copy">
          <p className="landing-kicker">Nhịp {item.number}</p>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <button type="button" onClick={() => setActive((active + 1) % loop.length)}>
            Nhịp tiếp theo <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function IdiomPreview() {
  const featured = idioms.slice(0, 4);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = featured[active];

  function move(direction: number) {
    setActive((value) => (value + direction + featured.length) % featured.length);
    setRevealed(false);
  }

  return (
    <div className="idiom-experience">
      <div className="idiom-deck">
        <div className="deck-shadow deck-shadow-one" aria-hidden="true" />
        <div className="deck-shadow deck-shadow-two" aria-hidden="true" />
        <article className={`featured-idiom ${revealed ? "is-revealed" : ""}`}>
          <div className="featured-card-head">
            <span>{item.category}</span>
            <span>0{active + 1} / 04</span>
          </div>
          <div className="featured-card-body">
            <p className="featured-korean" lang="ko">{item.korean}</p>
            <p className="featured-reading">{item.reading}</p>
            {revealed ? (
              <div className="featured-answer" aria-live="polite">
                <span>Nghĩa bóng</span>
                <strong>{item.meaning}</strong>
                <p>Nghĩa đen: {item.literal}</p>
              </div>
            ) : (
              <button type="button" onClick={() => setRevealed(true)}>
                Lật để khám phá nghĩa <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>
          <span className="featured-seal" aria-hidden="true">윷</span>
        </article>
      </div>

      <div className="deck-controls">
        <button aria-label="Thẻ thành ngữ trước" onClick={() => move(-1)} type="button">←</button>
        <div><span style={{ width: `${((active + 1) / featured.length) * 100}%` }} /></div>
        <button aria-label="Thẻ thành ngữ tiếp theo" onClick={() => move(1)} type="button">→</button>
      </div>
      <Link className="landing-text-link" href="/cards">Xem toàn bộ thư viện <span aria-hidden="true">↗</span></Link>
    </div>
  );
}
