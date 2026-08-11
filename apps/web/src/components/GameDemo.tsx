"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { idioms } from "@/lib/idioms";

type Phase = "ready" | "question" | "answered" | "finished";

const outcomes = [
  { name: "Do", korean: "도", steps: 1 },
  { name: "Gae", korean: "개", steps: 2 },
  { name: "Geol", korean: "걸", steps: 3 },
  { name: "Yut", korean: "윷", steps: 4 },
  { name: "Mo", korean: "모", steps: 5 },
];

// Traditional Yut-nori outer route. Start and home share the lower-right corner.
const route = [
  [88, 88], [72, 88], [56, 88], [40, 88], [24, 88], [8, 88],
  [8, 72], [8, 56], [8, 40], [8, 24], [8, 8],
  [24, 8], [40, 8], [56, 8], [72, 8], [88, 8],
  [88, 24], [88, 40], [88, 56], [88, 72], [88, 88],
] as const;

const boardNodes = [
  ...route.slice(0, -1),
  [24, 24], [40, 40], [50, 50], [60, 60], [76, 76],
  [76, 24], [60, 40], [40, 60], [24, 76],
] as const;

export function GameDemo() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [position, setPosition] = useState(0);
  const [displayPosition, setDisplayPosition] = useState(0);
  const [originPosition, setOriginPosition] = useState(0);
  const [roll, setRoll] = useState(outcomes[0]);
  const [cardIndex, setCardIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentCard = idioms[cardIndex % idioms.length];

  useEffect(() => () => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
  }, []);

  function throwYut() {
    const nextRoll = outcomes[Math.floor(Math.random() * outcomes.length)];
    setOriginPosition(position);
    setRoll(nextRoll);
    setSelected(null);
    setPhase("question");
  }

  function answer(option: string) {
    if (phase !== "question") return;
    const isCorrect = option === currentCard.meaning;
    const attemptedPosition = Math.min(originPosition + roll.steps, route.length - 1);
    setSelected(option);
    setDisplayPosition(attemptedPosition);

    if (isCorrect) {
      setPosition(attemptedPosition);
      setPhase(attemptedPosition === route.length - 1 ? "finished" : "answered");
      return;
    }

    setPhase("answered");
    returnTimer.current = setTimeout(() => setDisplayPosition(originPosition), 720);
  }

  function nextTurn() {
    setCardIndex((value) => value + 1);
    setSelected(null);
    setDisplayPosition(position);
    setPhase("ready");
  }

  function restart() {
    setPosition(0);
    setDisplayPosition(0);
    setOriginPosition(0);
    setCardIndex(0);
    setSelected(null);
    setPhase("ready");
  }

  const [pieceX, pieceY] = route[displayPosition];
  const pieceStyle = { "--piece-x": `${pieceX}%`, "--piece-y": `${pieceY}%` } as CSSProperties;
  const correct = selected === currentCard.meaning;

  return (
    <div className="section-shell demo-shell decal-demo-shell">
      <div className="game-board-panel decal-board-panel">
        <div className="board-title-row">
          <div><span>윷놀이</span><strong>Bàn cờ Yut truyền thống</strong></div>
          <small>Đường ngoài · 2 đường tắt · 1 tâm chung</small>
        </div>
        <div className="traditional-yut-board" aria-label={`Quân của bạn đang ở bước ${position} trên đường về nhà`}>
          <div className="board-path board-path-square" />
          <div className="board-path board-path-diagonal board-path-one" />
          <div className="board-path board-path-diagonal board-path-two" />
          {boardNodes.map(([x, y], index) => (
            <span
              className={`traditional-node ${index === 22 ? "center-node" : ""} ${index < 20 && index === displayPosition ? "is-current" : ""}`}
              key={`${x}-${y}-${index}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {index === 0 && <small>출발<br />집</small>}
              {index === 22 && <small>방</small>}
            </span>
          ))}
          <span className="game-piece cute-piece" style={pieceStyle}><b>말</b></span>
          {phase === "question" && <span className="target-hint" style={{ left: `${route[Math.min(originPosition + roll.steps, 20)][0]}%`, top: `${route[Math.min(originPosition + roll.steps, 20)][1]}%` }}>+{roll.steps}</span>}
        </div>
        <div className="cute-board-legend">
          <span><i className="legend-you" /> Quân của bạn</span>
          <span><i className="legend-route" /> Đường truyền thống</span>
          <span><i className="legend-shortcut" /> Đường tắt</span>
        </div>
      </div>

      <aside className="game-console decal-console">
        <div className="prototype-badge"><span /> Bản chơi thử · chạy ngay trên trình duyệt</div>
        <div className="turn-progress" aria-label="Tiến trình lượt chơi">
          {["Tung", "Trả lời", "Di chuyển"].map((label, i) => <span className={(phase === "ready" ? i === 0 : phase === "question" ? i <= 1 : i <= 2) ? "active" : ""} key={label}><i>{i + 1}</i>{label}</span>)}
        </div>

        {phase === "ready" && <div className="console-state state-ready">
          <p className="mini-label">Lượt của bạn</p>
          <h2>Tung Yut,<br /><em>mở một thử thách.</em></h2>
          <div className="demo-sticks" aria-hidden="true"><i /><i /><i /><i /></div>
          <p className="rule-note">Trả lời đúng để tiến. Trả lời sai, quân sẽ quay về vị trí trước lượt tung.</p>
          <button className="button game-action" type="button" onClick={throwYut}>Tung bốn thanh Yut <span aria-hidden="true">→</span></button>
        </div>}

        {phase === "question" && <div className="console-state question-state">
          <div className="roll-result"><span>Kết quả</span><strong>{roll.korean} · {roll.name}</strong><b>+{roll.steps} bước</b></div>
          <p className="mini-label">Thẻ thành ngữ</p>
          <h2 lang="ko">{currentCard.korean}</h2>
          <p className="question-reading">{currentCard.reading}</p>
          <p className="question-prompt">Thành ngữ này có nghĩa là gì?</p>
          <div className="answer-list">
            {currentCard.options.map((option) => <button type="button" onClick={() => answer(option)} key={option}>{option}<span aria-hidden="true">→</span></button>)}
          </div>
        </div>}

        {(phase === "answered" || phase === "finished") && <div className="console-state result-state" aria-live="polite">
          <div className={`result-mark ${correct ? "correct" : "incorrect"}`}>{correct ? "✓" : "×"}</div>
          <p className="mini-label">{correct ? "Chính xác rồi!" : "Gần đúng rồi!"}</p>
          <h2>{currentCard.meaning}</h2>
          {!correct && <p className="your-answer">Bạn chọn: <s>{selected}</s></p>}
          <div className="meaning-box"><span>Nghĩa đen</span><strong>{currentCard.literal}</strong><p>{currentCard.example}</p></div>
          <p className={`move-confirmation ${correct ? "move-forward" : "move-back"}`}>{correct ? <>Quân được tiến <strong>{roll.steps} bước</strong>.</> : <>Quân quay về <strong>vị trí trước lượt tung</strong>.</>}</p>
          {phase === "finished" ? <button className="button game-action" type="button" onClick={restart}>Chơi lại từ đầu</button> : <button className="button game-action" type="button" onClick={nextTurn}>Lượt tiếp theo <span aria-hidden="true">→</span></button>}
        </div>}
      </aside>
    </div>
  );
}
