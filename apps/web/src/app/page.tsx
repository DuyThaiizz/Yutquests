import Image from "next/image";
import Link from "next/link";
import { HeroYutDemo, IdiomPreview, LearningLoop } from "@/components/LandingInteractions";

const team = [
  { name: "Lê Trần Khánh Linh", initials: "KL", role: "Nội dung & trò chơi" },
  { name: "Tô Diệu Linh", initials: "DL", role: "Nội dung & trò chơi" },
  { name: "Lương Phương Thảo", initials: "PT", role: "Nội dung & trò chơi" },
  { name: "Nguyễn Phương Anh", initials: "PA", role: "Nội dung & trò chơi" },
  { name: "Nguyễn Thành Thái", initials: "TT", role: "UI/UX & trải nghiệm" },
];

export default function Home() {
  return <div className="landing-page decal-landing">
    <section className="decal-hero">
      <div className="landing-shell decal-hero-grid">
        <div className="decal-hero-copy">
          <p className="decal-kicker">Korean learning card game</p>
          <h1><span className="decal-hero-line">Embark on a</span><br /><em>quest of knowledge.</em></h1>
          <p className="decal-lead">Tung Yut, giải mã thành ngữ và đưa quân cờ về nhà. Mỗi câu trả lời mở ra một mảnh nhỏ của ngôn ngữ và văn hóa Hàn Quốc.</p>
          <div className="decal-actions">
            <Link className="decal-primary" href="/game">Bắt đầu hành trình <span aria-hidden="true">→</span></Link>
            <Link className="decal-secondary" href="/guide">Khám phá luật chơi</Link>
          </div>
          <p className="decal-signature">Explore · Learn · Conquer</p>
        </div>
        <div className="decal-character-stage" aria-label="Nhân vật đồng hành của Yutquest">
          <div className="decal-character-frame">
            <Image src="/images/yutquest-main-character-warm-v2.png" alt="Nhân vật Yutquest với mái tóc tết và vòng sao" fill priority sizes="(max-width: 900px) 78vw, 38vw" />
          </div>
          <div className="decal-character-caption"><span>별빛 안내자</span><strong>Người dẫn đường ánh sao</strong></div>
        </div>
      </div>
      <div className="decal-hero-stats landing-shell">
        <div><strong>2–6</strong><span>người chơi</span></div>
        <div><strong>7+</strong><span>độ tuổi</span></div>
        <div><strong>15–30</strong><span>phút mỗi ván</span></div>
      </div>
    </section>

    <section className="decal-intro" id="how-it-works">
      <div className="landing-shell">
        <p className="decal-kicker decal-kicker-center">The learning quest</p>
        <h2>Ba nhịp chơi.<br /><em>Một hành trình đáng nhớ.</em></h2>
        <p className="decal-section-lead">May mắn quyết định số bước; kiến thức quyết định bạn có được giữ nước đi ấy hay không.</p>
        <LearningLoop />
      </div>
    </section>

    <section className="decal-play-section">
      <div className="landing-shell decal-play-grid">
        <div className="decal-play-copy">
          <p className="decal-kicker">Exciting gameplay</p>
          <h2>Tung một quẻ.<br /><em>Mở một thử thách.</em></h2>
          <p>Sau mỗi lần tung, một thẻ thành ngữ sẽ xuất hiện. Trả lời đúng để tiến theo kết quả; trả lời sai và quân cờ quay lại đúng ô trước lượt.</p>
          <ul>
            <li><span>01</span><div><strong>Roll</strong><small>Nhận từ một đến năm bước</small></div></li>
            <li><span>02</span><div><strong>Answer</strong><small>Chọn nghĩa đúng của thành ngữ</small></div></li>
            <li><span>03</span><div><strong>Move</strong><small>Giữ nước đi hoặc quay về</small></div></li>
          </ul>
        </div>
        <HeroYutDemo />
      </div>
    </section>

    <section className="decal-cards-section">
      <div className="landing-shell decal-cards-grid">
        <div className="decal-card-copy">
          <p className="decal-kicker">Learn Korean naturally</p>
          <h2>Mỗi tấm thẻ giữ<br /><em>một câu chuyện.</em></h2>
          <p>210 thử thách trải trên 60 biểu đạt cốt lõi—từ nghĩa tiếng Hàn, diễn giải tiếng Việt đến cách dùng theo ba cấp độ học.</p>
          <Link className="decal-text-link" href="/cards">Mở thư viện thành ngữ <span aria-hidden="true">→</span></Link>
        </div>
        <IdiomPreview />
      </div>
    </section>

    <section className="decal-team-section">
      <div className="landing-shell">
        <div className="decal-team-heading">
          <div><p className="decal-kicker">Made with wonder</p><h2>Những người tạo nên<br /><em>thế giới Yutquest.</em></h2></div>
          <p>Năm góc nhìn cùng gặp nhau ở một niềm tin: trò chơi có thể khiến việc học ngôn ngữ trở nên gần gũi, giàu cảm xúc và đáng nhớ hơn.</p>
        </div>
        <div className="decal-team-list">{team.map((member, index) => <article key={member.name}><div className="decal-member-avatar" aria-hidden="true"><b>{member.initials}</b><span>0{index + 1}</span></div><strong>{member.name}</strong><small>{member.role}</small></article>)}</div>
      </div>
    </section>

    <section className="decal-final-section">
      <div className="landing-shell decal-final-inner">
        <p className="decal-kicker decal-kicker-center">Your quest awaits</p>
        <h2>Đưa quân cờ đầu tiên<br /><em>vào một thế giới mới.</em></h2>
        <p>Không cần đăng ký. Bản chơi thử hoạt động trực tiếp trên trình duyệt.</p>
        <Link className="decal-primary decal-primary-light" href="/game">Chơi Yutquest ngay <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>;
}
