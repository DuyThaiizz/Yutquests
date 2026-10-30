"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { idioms } from "@/lib/idioms";

const outcomes = [
  {
    name: "Do",
    korean: "도",
    steps: 1,
    faces: [true, false, false, false],
    note: "Một bước mở bàn.",
  },
  {
    name: "Gae",
    korean: "개",
    steps: 2,
    faces: [true, true, false, false],
    note: "Hai bước chạm ô học.",
  },
  {
    name: "Geol",
    korean: "걸",
    steps: 3,
    faces: [true, true, true, false],
    note: "Ba bước mở đường tắt.",
  },
  {
    name: "Yut",
    korean: "윷",
    steps: 4,
    faces: [true, true, true, true],
    note: "Bốn bước và thêm một lượt.",
  },
  {
    name: "Mo",
    korean: "모",
    steps: 5,
    faces: [false, false, false, false],
    note: "Năm bước, cú tung xa nhất.",
  },
];

const loop = [
  {
    id: "throw",
    number: "1",
    label: "Tung",
    korean: "던지다",
    title: "May mắn tạo nhịp.",
    text: "Bốn thanh Yut quyết định số bước của lượt.",
  },
  {
    id: "learn",
    number: "2",
    label: "Học",
    korean: "배우다",
    title: "Ngữ cảnh giữ nghĩa.",
    text: "Một thành ngữ xuất hiện ngay sau mỗi cú tung.",
  },
  {
    id: "move",
    number: "3",
    label: "Tiến",
    korean: "나아가다",
    title: "Kiến thức giữ bước.",
    text: "Trả lời đúng để tiến quân. Trả lời sai để đứng lại.",
  },
];

export function HeroYutDemo() {
  const [resultIndex, setResultIndex] = useState(1);
  const [throws, setThrows] = useState(0);
  const [throwing, setThrowing] = useState(false);
  const sticks = useRef<Array<HTMLSpanElement | null>>([]);
  const result = outcomes[resultIndex];

  function throwYut() {
    if (throwing) return;
    const offset = 1 + Math.floor(Math.random() * (outcomes.length - 1));
    const next = (resultIndex + offset) % outcomes.length;
    const targets = sticks.current.filter(Boolean) as HTMLSpanElement[];
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setThrowing(true);
    window.dispatchEvent(new CustomEvent("yutquest:throw"));

    if (reduced) {
      setResultIndex(next);
      setThrows((value) => value + 1);
      setThrowing(false);
      return;
    }

    gsap.set(targets, {
      transformPerspective: 800,
      transformOrigin: "50% 50%",
    });
    gsap.to(targets, {
      y: (index) => -92 - index * 9,
      rotationX: (index) => 320 + index * 48,
      rotationY: (index) => (index % 2 ? -1 : 1) * (180 + index * 32),
      rotationZ: (index) => (index - 1.5) * 28,
      duration: 0.48,
      ease: "power3.out",
      stagger: 0.045,
      repeat: 1,
      yoyo: true,
      overwrite: "auto",
      onComplete: () => {
        gsap.set(targets, { clearProps: "transform" });
        setResultIndex(next);
        setThrows((value) => value + 1);
        setThrowing(false);
      },
    });
  }

  return (
    <div className="yut-orbit" aria-label="Bản thử tung bốn thanh Yut">
      <div className="orbit-board" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="orbit-sticks" aria-hidden="true" data-throws={throws}>
        {result.faces.map((flat, index) => (
          <span
            className={flat ? "is-flat" : "is-round"}
            key={index}
            ref={(element) => {
              sticks.current[index] = element;
            }}
          >
            <i />
            <b>{flat ? "× × ×" : ""}</b>
          </span>
        ))}
      </div>
      <div className="orbit-result" aria-live="polite">
        <strong lang="ko">{result.korean}</strong>
        <span>{result.name}</span>
        <b>+{result.steps}</b>
      </div>
      <div className="orbit-control">
        <p>{result.note}</p>
        <button type="button" onClick={throwYut} disabled={throwing}>
          {throwing ? "Đang tung" : "Tung Yut"}
        </button>
      </div>
    </div>
  );
}

export function LearningLoop() {
  const [active, setActive] = useState(0);
  const item = loop[active];

  return (
    <div className="loop-experience">
      <div
        className="loop-tabs"
        role="tablist"
        aria-label="Ba nhịp chơi của Yutquest"
      >
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
        className="loop-panel"
        id="loop-panel"
        role="tabpanel"
      >
        <div className="loop-word" aria-hidden="true">
          <span lang="ko">{item.korean}</span>
          <i />
          <i />
          <i />
        </div>
        <div className="loop-copy">
          <span>Nhịp {item.number}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <button
            type="button"
            onClick={() => setActive((active + 1) % loop.length)}
          >
            Xem nhịp kế tiếp
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
    setActive(
      (value) => (value + direction + featured.length) % featured.length,
    );
    setRevealed(false);
  }

  return (
    <div className="idiom-experience">
      <article className={`featured-idiom ${revealed ? "is-revealed" : ""}`}>
        <div className="featured-card-head">
          <span>{item.category}</span>
          <span>
            Thẻ {active + 1} trong {featured.length}
          </span>
        </div>
        <div className="featured-card-body">
          <p className="featured-korean" lang="ko">
            {item.korean}
          </p>
          <p className="featured-reading">{item.reading}</p>
          {revealed ? (
            <div className="featured-answer" aria-live="polite">
              <span>Nghĩa bóng</span>
              <strong>{item.meaning}</strong>
              <p>Nghĩa đen: {item.literal}</p>
            </div>
          ) : (
            <button type="button" onClick={() => setRevealed(true)}>
              Lật để xem nghĩa
            </button>
          )}
        </div>
        <span className="featured-seal" aria-hidden="true">
          윷
        </span>
      </article>
      <div className="deck-controls">
        <button
          aria-label="Thẻ thành ngữ trước"
          onClick={() => move(-1)}
          type="button"
        >
          Trước
        </button>
        <div aria-hidden="true">
          <span
            style={{ transform: `scaleX(${(active + 1) / featured.length})` }}
          />
        </div>
        <button
          aria-label="Thẻ thành ngữ tiếp theo"
          onClick={() => move(1)}
          type="button"
        >
          Sau
        </button>
      </div>
      <Link className="text-link" href="/cards">
        Xem toàn bộ thư viện
      </Link>
    </div>
  );
}
