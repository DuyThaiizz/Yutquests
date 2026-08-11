import type { Metadata } from "next";
import { CardsExplorer } from "@/components/CardsExplorer";

export const metadata: Metadata = {
  title: "Thư viện thẻ thành ngữ",
  description: "Khám phá những thành ngữ tiếng Hàn xuất hiện trong Yutquest.",
};

export default function CardsPage() {
  return (
    <>
      <section className="page-hero page-hero-cards">
        <div className="section-shell page-hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> Bộ thẻ ngôn ngữ</p>
            <h1>Học một câu.<br /><em>Hiểu cả ngữ cảnh.</em></h1>
          </div>
          <p>Mỗi thẻ gồm nghĩa bóng, nghĩa đen và một ví dụ đời thường. Bộ thẻ hiện là nội dung mẫu cho bản thử Yutquest.</p>
        </div>
      </section>
      <CardsExplorer />
    </>
  );
}
