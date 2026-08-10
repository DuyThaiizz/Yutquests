import type { Metadata } from "next";
import { GameDemo } from "@/components/GameDemo";

export const metadata: Metadata = { title: "Bản thử trò chơi", description: "Trải nghiệm vòng chơi mẫu của Yutquest." };

export default function GamePage() {
  return (
    <section className="game-page">
      <div className="section-shell game-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> Bản thử tương tác</p>
          <h1>Một lượt Yutquest</h1>
        </div>
        <p><strong>Đây là prototype giao diện.</strong> Vòng tung — hỏi — di chuyển hoạt động cục bộ; phòng chơi trực tuyến đang được phát triển.</p>
      </div>
      <GameDemo />
    </section>
  );
}
