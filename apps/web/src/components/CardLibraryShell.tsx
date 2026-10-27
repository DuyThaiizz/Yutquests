"use client";

import { useState } from "react";
import { BilingualFlashcards } from "@/components/BilingualFlashcards";
import { CardsExplorer } from "@/components/CardsExplorer";

type LibraryMode = "learn" | "practice";

export function CardLibraryShell() {
  const [mode, setMode] = useState<LibraryMode>("learn");

  return (
    <div className="card-library-shell">
      <div className="section-shell library-mode-bar">
        <div className="library-mode-copy">
          <span>Chọn cách học</span>
          <strong>{mode === "learn" ? "Ôn nghĩa bằng thẻ lật" : "Luyện tập bằng câu hỏi"}</strong>
        </div>
        <div className="library-mode-switch" role="tablist" aria-label="Chế độ thư viện">
          <button
            aria-controls="learn-library"
            aria-selected={mode === "learn"}
            className={mode === "learn" ? "is-active" : ""}
            onClick={() => setMode("learn")}
            role="tab"
            type="button"
          >
            <span>60</span>
            <strong>Học biểu đạt</strong>
          </button>
          <button
            aria-controls="practice-library"
            aria-selected={mode === "practice"}
            className={mode === "practice" ? "is-active" : ""}
            onClick={() => setMode("practice")}
            role="tab"
            type="button"
          >
            <span>210</span>
            <strong>Luyện câu hỏi</strong>
          </button>
        </div>
      </div>
      <div id={mode === "learn" ? "learn-library" : "practice-library"} role="tabpanel">
        {mode === "learn" ? <BilingualFlashcards /> : <CardsExplorer />}
      </div>
    </div>
  );
}
