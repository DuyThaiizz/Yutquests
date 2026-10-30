import type { Metadata } from "next";
import Link from "next/link";
import { GuideJumpNav } from "@/components/GuideJumpNav";

export const metadata: Metadata = {
  title: "Luật chơi đầy đủ",
  description:
    "Luật Yutquest: tung Yut, trả lời thẻ, đi đường tắt, hợp quân, bắt quân và về đích.",
};

const outcomes = [
  {
    korean: "도",
    name: "Do",
    steps: "1 bước",
    faces: "3 mặt úp, 1 mặt ngửa",
    bonus: false,
  },
  {
    korean: "개",
    name: "Gae",
    steps: "2 bước",
    faces: "2 mặt úp, 2 mặt ngửa",
    bonus: false,
  },
  {
    korean: "걸",
    name: "Geol",
    steps: "3 bước",
    faces: "1 mặt úp, 3 mặt ngửa",
    bonus: false,
  },
  {
    korean: "윷",
    name: "Yut",
    steps: "4 bước",
    faces: "4 mặt ngửa",
    bonus: true,
  },
  { korean: "모", name: "Mo", steps: "5 bước", faces: "4 mặt úp", bonus: true },
];

const specialRules = [
  {
    title: "Rẽ vào đường tắt",
    text: "Quân phải dừng đúng ô góc. Từ lượt kế tiếp, bạn có thể chọn đường chéo.",
  },
  {
    title: "Hợp quân",
    text: "Dừng đúng ô của quân cùng đội để ghép chúng và di chuyển cả cụm trong một lượt.",
  },
  {
    title: "Bắt quân đối thủ",
    text: "Dừng đúng ô của đối thủ để đưa quân đó về điểm xuất phát và nhận thêm lượt tung.",
  },
  {
    title: "Về đích chính xác",
    text: "Số bước phải đủ để tới ô đích và rời bàn. Nếu chưa đủ, quân đứng yên.",
  },
];

export default function GuidePage() {
  return (
    <div className="rules-page">
      <section className="page-hero rules-hero">
        <div className="section-shell page-hero-grid">
          <div data-motion="hero">
            <h1>
              Luật chơi,
              <br />
              không đoán.
            </h1>
          </div>
          <p data-motion="hero">
            Hai đội. Bốn thanh Yut. Đưa cả bốn quân về nhà.
          </p>
        </div>
      </section>

      <GuideJumpNav />

      <section
        className="rules-overview"
        id="setup"
        aria-labelledby="rules-objective"
        data-motion="section"
      >
        <div className="section-shell rules-overview-grid">
          <h2 id="rules-objective">
            Đưa bốn quân
            <br />
            về nhà trước.
          </h2>
          <div>
            <p className="guide-lead">
              Chơi với 2 người hoặc 2 đội. Mỗi bên có 4 quân; bên đầu tiên đưa
              cả 4 quân đi trọn vòng và rời bàn sẽ thắng.
            </p>
            <div className="rules-facts">
              <article>
                <strong>2</strong>
                <span>người hoặc đội</span>
              </article>
              <article>
                <strong>4</strong>
                <span>quân mỗi bên</span>
              </article>
              <article>
                <strong>4</strong>
                <span>thanh Yut</span>
              </article>
              <article>
                <strong>1</strong>
                <span>đội chiến thắng</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="rules-turn-section" id="turn" data-motion="section">
        <div className="section-shell rules-turn-grid">
          <h2>
            Tung. Trả lời.
            <br />
            Rồi di chuyển.
          </h2>
          <ol className="rules-turn-flow">
            <li>
              <div>
                <strong>Tung bốn thanh Yut</strong>
                <p>Kết quả xác định số bước tiềm năng.</p>
              </div>
            </li>
            <li>
              <div>
                <strong>Rút một thẻ</strong>
                <p>Trả lời câu hỏi thành ngữ sau cú tung.</p>
              </div>
            </li>
            <li>
              <div>
                <strong>Chốt nước đi</strong>
                <p>Đúng thì tiến. Sai thì đứng yên.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section
        className="rules-outcomes"
        id="outcomes"
        aria-labelledby="outcome-title"
        data-motion="section"
      >
        <div className="section-shell">
          <div className="split-heading">
            <h2 id="outcome-title">
              Năm kết quả.
              <br />
              Hai lượt thưởng.
            </h2>
            <p>Mặt úp có ba dấu X. Yut hoặc Mo cho bạn thêm một lượt tung.</p>
          </div>
          <div className="rules-outcome-grid">
            {outcomes.map((outcome) => (
              <article
                className={outcome.bonus ? "is-bonus" : ""}
                key={outcome.name}
              >
                <b lang="ko">{outcome.korean}</b>
                <div>
                  <strong>{outcome.name}</strong>
                  <span>{outcome.steps}</span>
                  <p>{outcome.faces}</p>
                </div>
                {outcome.bonus && <small>Tung thêm</small>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rules-special-section"
        id="strategy"
        data-motion="section"
      >
        <div className="section-shell rules-special-grid">
          <h2>
            Bốn luật đổi
            <br />
            cả đường đua.
          </h2>
          <ol>
            {specialRules.map((rule) => (
              <li key={rule.title}>
                <h3>{rule.title}</h3>
                <p>{rule.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rules-example" id="finish" data-motion="section">
        <div className="section-shell rules-example-grid">
          <div className="rules-example-mark" aria-hidden="true">
            결
          </div>
          <div>
            <h2>
              Còn 2 ô?
              <br />
              Hãy tung Geol.
            </h2>
            <p>
              Ba bước gồm hai bước tới đích và một bước rời bàn. Chặng cuối vẫn
              cần tính toán chính xác.
            </p>
          </div>
        </div>
      </section>

      <section className="guide-cta" data-motion="section">
        <div className="section-shell guide-cta-grid">
          <h2>
            Tự tay tung
            <br />
            một lượt.
          </h2>
          <Link className="button" href="/game">
            Mở bản chơi thử
          </Link>
        </div>
      </section>
    </div>
  );
}
