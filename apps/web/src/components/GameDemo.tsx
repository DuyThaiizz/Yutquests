"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { idioms } from "@/lib/idioms";

type Phase = "ready" | "question" | "answered" | "finished";
const moveNames = [
  { name: "Do", korean: "도", steps: 1 },
  { name: "Gae", korean: "개", steps: 2 },
  { name: "Geol", korean: "걸", steps: 3 },
  { name: "Yut", korean: "윷", steps: 4 },
  { name: "Mo", korean: "모", steps: 5 },
];
const track = [
  [8,86],[28,86],[48,86],[68,86],[88,86],[88,68],[88,48],[88,28],[88,8],[68,8],[48,8],[28,8],[8,8],[8,28],[8,48],[8,68],
];

export function GameDemo() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [position, setPosition] = useState(0);
  const [roll, setRoll] = useState(moveNames[0]);
  const [cardIndex, setCardIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const currentCard = idioms[cardIndex % idioms.length];

  function throwYut() {
    const nextRoll = moveNames[Math.floor(Math.random() * moveNames.length)];
    setRoll(nextRoll);
    setSelected(null);
    setPhase("question");
  }

  function answer(option: string) {
    if (phase !== "question") return;
    setSelected(option);
    const nextPosition = Math.min(position + roll.steps, track.length - 1);
    setPosition(nextPosition);
    setPhase(nextPosition === track.length - 1 ? "finished" : "answered");
  }

  function nextTurn() {
    setCardIndex((value) => value + 1);
    setSelected(null);
    setPhase("ready");
  }

  function restart() {
    setPosition(0);
    setCardIndex(0);
    setSelected(null);
    setPhase("ready");
  }

  const pieceStyle = { "--piece-x": `${track[position][0]}%`, "--piece-y": `${track[position][1]}%` } as CSSProperties;
  const correct = selected === currentCard.meaning;

  return (
    <div className="section-shell demo-shell">
      <div className="game-board-panel">
        <div className="game-board" aria-label={`Quân của bạn đang ở vị trí ${position + 1} trên 16`}>
          <div className="game-diagonals" />
          {track.map(([x,y], index) => <span className={`game-node ${index === position ? "current" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} key={`${x}-${y}`}><small>{index === 0 ? "출" : index === 15 ? "집" : ""}</small></span>)}
          <span className="game-center">윷<small>YUTQUEST</small></span>
          <span className="game-piece" style={pieceStyle}>말</span>
        </div>
        <div className="board-legend"><span><i className="legend-piece" /> Quân của bạn</span><span>출 Xuất phát</span><span>집 Về nhà</span></div>
      </div>

      <aside className="game-console">
        <div className="prototype-badge"><span /> Prototype · Chơi cục bộ</div>
        <div className="turn-progress" aria-label="Tiến trình lượt chơi">
          {["Tung", "Học", "Tiến"].map((label, i) => <span className={(phase === "ready" ? i === 0 : phase === "question" ? i <= 1 : i <= 2) ? "active" : ""} key={label}><i>{i + 1}</i>{label}</span>)}
        </div>

        {phase === "ready" && (
          <div className="console-state state-ready">
            <p className="mini-label">Lượt của bạn</p>
            <h2>Tung bốn<br />thanh Yut.</h2>
            <div className="demo-sticks" aria-hidden="true"><i /><i /><i /><i /></div>
            <button className="button game-action" type="button" onClick={throwYut}>Tung Yut <span aria-hidden="true">↗</span></button>
          </div>
        )}

        {phase === "question" && (
          <div className="console-state question-state">
            <div className="roll-result"><span>Kết quả</span><strong>{roll.korean} · {roll.name}</strong><b>+{roll.steps} bước</b></div>
            <p className="mini-label">Thẻ thành ngữ</p>
            <h2 lang="ko">{currentCard.korean}</h2>
            <p className="question-reading">{currentCard.reading}</p>
            <p className="question-prompt">Thành ngữ này có nghĩa là gì?</p>
            <div className="answer-list">
              {currentCard.options.map((option) => <button type="button" onClick={() => answer(option)} key={option}>{option}<span aria-hidden="true">→</span></button>)}
            </div>
          </div>
        )}

        {(phase === "answered" || phase === "finished") && (
          <div className="console-state result-state" aria-live="polite">
            <div className={`result-mark ${correct ? "correct" : "incorrect"}`}>{correct ? "✓" : "!"}</div>
            <p className="mini-label">{correct ? "Chính xác" : "Ghi nhớ nhé"}</p>
            <h2>{currentCard.meaning}</h2>
            {!correct && <p className="your-answer">Bạn chọn: <s>{selected}</s></p>}
            <div className="meaning-box"><span>Nghĩa đen</span><strong>{currentCard.literal}</strong><p>{currentCard.example}</p></div>
            <p className="move-confirmation">Quân đã tiến <strong>{roll.steps} bước</strong>.</p>
            {phase === "finished" ? <button className="button game-action" type="button" onClick={restart}>Chơi lại từ đầu</button> : <button className="button game-action" type="button" onClick={nextTurn}>Lượt tiếp theo <span aria-hidden="true">→</span></button>}
          </div>
        )}
      </aside>
    </div>
  );
}
