import type { Metadata } from "next";
import { CardLibraryShell } from "@/components/CardLibraryShell";

export const metadata: Metadata = {
  title: "Thư viện thẻ thành ngữ",
  description:
    "Khám phá 210 thẻ học tiếng Hàn trong Yutquest với nghĩa tiếng Hàn và tiếng Việt.",
};

export default function CardsPage() {
  return (
    <div className="cards-page">
      <section className="page-hero cards-hero">
        <div className="section-shell page-hero-grid">
          <div data-motion="hero">
            <h1>
              60 biểu đạt.
              <br />
              210 thử thách.
            </h1>
          </div>
          <p data-motion="hero">
            Học nghĩa bằng thẻ lật, rồi luyện cách dùng qua ba cấp độ.
          </p>
        </div>
      </section>
      <CardLibraryShell />
    </div>
  );
}
