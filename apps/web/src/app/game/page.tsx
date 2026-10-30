import type { Metadata } from "next";
import { GameDemo } from "@/components/GameDemo";

export const metadata: Metadata = {
  title: "Bản thử trò chơi",
  description: "Trải nghiệm vòng chơi mẫu của Yutquest.",
};

export default function GamePage() {
  return (
    <section className="game-page" data-motion="section">
      <div className="section-shell game-heading">
        <h1 data-motion="hero">
          Tung Yut.
          <br />
          Giữ nước đi.
        </h1>
        <p data-motion="hero">
          <strong>Đấu Haneul AI.</strong> Trả lời đúng để đưa quân về nhà.
        </p>
      </div>
      <GameDemo />
    </section>
  );
}
