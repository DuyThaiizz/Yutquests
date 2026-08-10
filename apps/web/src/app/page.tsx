import Link from "next/link";
import { HeroYutDemo, IdiomPreview, LearningLoop } from "@/components/LandingInteractions";

const team = [
  ["01", "Lê Trần Khánh Linh", "Trưởng nhóm"],
  ["02", "Tô Diệu Linh", "Thiết kế thẻ bài"],
  ["03", "Lương Phương Thảo", "Thiết kế trò chơi"],
  ["04", "Nguyễn Phương Anh", "Nghiên cứu văn hóa"],
  ["05", "Nguyễn Thành Thái", "Thiết kế UI/UX"],
];

export default function Home() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-shell landing-hero-grid">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span /> Trò chơi ngôn ngữ lấy cảm hứng từ Hàn Quốc</p>
            <h1>
              Tung một quẻ Yut.<br />
              <em>Mở một cách hiểu.</em>
            </h1>
            <p className="landing-lead">
              Yutquest biến thành ngữ tiếng Hàn thành những khoảnh khắc khám phá trên bàn cờ — nơi may mắn, chiến thuật và văn hóa cùng tạo nên một cuộc chơi đáng nhớ.
            </p>
            <div className="landing-actions">
              <Link className="landing-primary" href="/game">Bắt đầu một lượt <span aria-hidden="true">→</span></Link>
              <Link className="landing-secondary" href="/guide">Xem cách chơi <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="landing-proof" aria-label="Thông tin nhanh về Yutquest">
              <div><strong>04</strong><span>thanh Yut</span></div>
              <div><strong>08</strong><span>thẻ mẫu</span></div>
              <div><strong>03</strong><span>nhịp chơi</span></div>
            </div>
          </div>
          <HeroYutDemo />
        </div>
        <div className="hero-scroll-note" aria-hidden="true"><i /> Cuộn để khám phá</div>
      </section>

      <section className="landing-manifesto">
        <div className="landing-shell manifesto-grid">
          <p className="manifesto-index">01 — Ý tưởng</p>
          <div>
            <p className="manifesto-lead">Không phải một bộ flashcard khoác áo trò chơi.</p>
            <h2>Kiến thức trở thành <em>một phần của nước đi.</em></h2>
          </div>
          <p className="manifesto-note">
            Mỗi thẻ đến đúng lúc người chơi tò mò nhất. Bạn đoán, nhận phản hồi tức thì và tiếp tục tiến quân — nhờ vậy, việc học không làm đứt mạch cuộc vui.
          </p>
        </div>
      </section>

      <section className="landing-loop-section" id="how-it-works">
        <div className="landing-shell">
          <div className="landing-section-head">
            <div>
              <p className="landing-kicker">Vòng lặp học tập</p>
              <h2>Ba nhịp. Một hành trình liền mạch.</h2>
            </div>
            <p>Chọn từng nhịp để xem cách luật chơi truyền thống và nội dung ngôn ngữ nâng đỡ nhau.</p>
          </div>
          <LearningLoop />
        </div>
      </section>

      <section className="landing-cards-section">
        <div className="landing-shell cards-layout">
          <div className="cards-copy">
            <p className="landing-kicker landing-kicker-light">Bộ thẻ thành ngữ</p>
            <h2>Một câu ngắn.<br />Cả một thế giới phía sau.</h2>
            <p>
              Không dừng ở bản dịch. Mỗi thẻ nối cách nói với hình ảnh, tình huống đời thường và sắc thái văn hóa để người học hiểu vì sao người Hàn thật sự dùng câu đó.
            </p>
            <ul>
              <li><span>01</span> Nghĩa đen để nhớ hình ảnh</li>
              <li><span>02</span> Nghĩa bóng để hiểu hàm ý</li>
              <li><span>03</span> Ví dụ để biết cách dùng</li>
            </ul>
          </div>
          <IdiomPreview />
        </div>
      </section>

      <section className="landing-culture-section">
        <div className="landing-shell culture-grid">
          <div className="culture-art" aria-hidden="true">
            <span className="culture-sun" />
            <span className="culture-word" lang="ko">말</span>
            <span className="culture-gloss">lời nói · quân cờ</span>
            <i className="culture-stick culture-stick-one" />
            <i className="culture-stick culture-stick-two" />
          </div>
          <div className="culture-copy">
            <p className="landing-kicker">Văn hóa trong chuyển động</p>
            <h2>Di sản sống khi ta cùng chơi với nó.</h2>
            <p>
              Yut Nori đã kết nối các gia đình Hàn Quốc qua nhiều thế hệ. Yutquest giữ lại nhịp tung, sự hồi hộp và tinh thần quây quần ấy, rồi mở thêm một cánh cửa cho người học hôm nay.
            </p>
            <blockquote>
              “말” vừa có nghĩa là <strong>lời nói</strong>, vừa là <strong>quân cờ</strong> trong Yut Nori. Một từ nhỏ gói trọn tinh thần Yutquest.
            </blockquote>
            <Link className="landing-text-link" href="/guide">Đọc câu chuyện trò chơi <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="landing-team-section">
        <div className="landing-shell">
          <div className="landing-section-head team-heading">
            <div>
              <p className="landing-kicker">Những người làm nên Yutquest</p>
              <h2>Năm góc nhìn. Một bàn chơi.</h2>
            </div>
            <p>Một dự án nhỏ được tạo nên bằng nghiên cứu, thử nghiệm và tình yêu dành cho cách ngôn ngữ đưa con người đến gần văn hóa hơn.</p>
          </div>
          <div className="landing-team-list">
            {team.map(([number, name, role]) => (
              <article key={name}>
                <span>{number}</span>
                <h3>{name}</h3>
                <p>{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="landing-shell final-cta-inner">
          <p className="landing-kicker landing-kicker-light">Bàn cờ đang chờ</p>
          <h2>Tung Yut đầu tiên.<br /><em>Học câu đầu tiên.</em></h2>
          <p>Không cần đăng ký. Bản thử hoạt động trực tiếp trên trình duyệt.</p>
          <Link className="landing-primary landing-primary-light" href="/game">Chơi bản thử ngay <span aria-hidden="true">→</span></Link>
          <span className="final-cta-mark" aria-hidden="true">윷</span>
        </div>
      </section>
    </div>
  );
}
