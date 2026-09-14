import type { Metadata } from "next";
import { CardsExplorer } from "@/components/CardsExplorer";
import { BilingualFlashcards } from "@/components/BilingualFlashcards";

export const metadata: Metadata = {
  title: "Thư viện thẻ thành ngữ",
  description: "Khám phá 210 thẻ học tiếng Hàn trong Yutquest với nghĩa tiếng Hàn và tiếng Việt.",
};

export default function CardsPage() {
  return (
    <>
      <section className="page-hero page-hero-cards">
        <div className="section-shell page-hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> YutQuest 210</p>
            <h1>210 thử thách.<br /><em>60 biểu đạt cốt lõi.</em></h1>
          </div>
          <p>Khám phá quán dụng ngữ, thành ngữ Hán–Hàn và tục ngữ qua ba cấp độ. Mỗi thẻ đi cùng nghĩa tiếng Hàn, diễn giải tiếng Việt và một nhiệm vụ thực hành.</p>
        </div>
      </section>
      <BilingualFlashcards />
      <CardsExplorer />
    </>
  );
}
