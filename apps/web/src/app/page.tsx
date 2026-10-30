import Image from "next/image";
import Link from "next/link";
import {
  HeroYutDemo,
  IdiomPreview,
  LearningLoop,
} from "@/components/LandingInteractions";
import { LearnerJourney } from "@/components/LearnerJourney";
import { StarlightField } from "@/components/StarlightField";

const team = [
  { name: "Lê Trần Khánh Linh", role: "Nội dung và trò chơi" },
  { name: "Tô Diệu Linh", role: "Nội dung và trò chơi" },
  { name: "Lương Phương Thảo", role: "Nội dung và trò chơi" },
  { name: "Nguyễn Phương Anh", role: "Nội dung và trò chơi" },
  { name: "Nguyễn Thành Thái", role: "UI/UX và trải nghiệm" },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <StarlightField />
        <div className="section-shell home-hero-grid">
          <div className="home-hero-copy" data-motion="hero">
            <h1>
              <span>Tung Yut.</span>
              <br />
              Mở khóa thành ngữ Hàn.
            </h1>
            <p>Trả lời đúng để giữ nước đi và đưa quân về nhà.</p>
            <div className="hero-actions">
              <Link className="button" href="/game">
                Bắt đầu lượt chơi
              </Link>
              <Link className="text-link" href="/guide">
                Đọc luật chơi
              </Link>
            </div>
          </div>
          <div className="home-hero-stage" data-motion="hero">
            <figure className="hero-mascot-card">
              <Image
                src="/images/yutquest-main-character-warm-v2.png"
                alt="Người dẫn đường ánh sao của Yutquest"
                fill
                priority
                sizes="(max-width: 960px) 100vw, 46vw"
              />
              <figcaption>
                <span lang="ko">별빛 안내자</span>
                <strong>Người dẫn đường ánh sao</strong>
              </figcaption>
            </figure>
            <HeroYutDemo />
          </div>
        </div>
      </section>

      <section
        className="score-line"
        aria-label="Thông tin một ván Yutquest"
        data-motion="section"
      >
        <div className="section-shell score-line-grid">
          <div>
            <strong>2 tới 6</strong>
            <span>người chơi</span>
          </div>
          <div>
            <strong>7+</strong>
            <span>độ tuổi</span>
          </div>
          <div>
            <strong>15 tới 30</strong>
            <span>phút mỗi ván</span>
          </div>
          <div>
            <strong>210</strong>
            <span>câu hỏi</span>
          </div>
        </div>
      </section>

      <LearnerJourney />

      <section
        className="learning-section"
        id="how-it-works"
        data-motion="section"
      >
        <div className="section-shell learning-heading">
          <h2>
            Ba nhịp.
            <br />
            Một cuộc đua.
          </h2>
          <p>
            May mắn cho bạn số bước. Kiến thức quyết định bạn có được giữ chúng.
          </p>
        </div>
        <div className="section-shell">
          <LearningLoop />
        </div>
      </section>

      <section className="card-story-section" data-motion="section">
        <div className="section-shell card-story-grid">
          <div className="card-story-copy">
            <h2>
              Một thẻ.
              <br />
              Hai ngôn ngữ.
            </h2>
            <p>
              60 biểu đạt cốt lõi mở thành 210 thử thách bằng tiếng Hàn và tiếng
              Việt.
            </p>
            <Link className="text-link" href="/cards">
              Mở thư viện thẻ
            </Link>
          </div>
          <IdiomPreview />
        </div>
      </section>

      <section className="makers-section" data-motion="section">
        <div className="section-shell makers-grid makers-grid-wide">
          <div className="makers-copy">
            <h2>
              Năm người.
              <br />
              Một bàn chơi.
            </h2>
            <p>
              Yutquest được tạo nên từ một niềm tin: trò chơi khiến ngôn ngữ ở
              lại lâu hơn.
            </p>
            <div className="maker-list">
              {team.map((member, index) => (
                <article key={member.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-close" data-motion="section">
        <div className="section-shell home-close-grid">
          <h2>
            Lượt đầu tiên
            <br />
            đang chờ.
          </h2>
          <div>
            <p>Không cần đăng ký. Chơi trực tiếp trên trình duyệt.</p>
            <Link className="button" href="/game">
              Tung bốn thanh Yut
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
