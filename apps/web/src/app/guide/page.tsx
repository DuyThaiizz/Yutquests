import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Luật chơi đầy đủ", description: "Luật chơi Yutquest đầy đủ: tung Yut, trả lời thẻ, đường tắt, hợp quân, bắt quân và về đích." };

const outcomes = [
  { korean: "도", name: "Do", steps: "1 bước", faces: "3 mặt úp · 1 mặt ngửa", bonus: false },
  { korean: "개", name: "Gae", steps: "2 bước", faces: "2 mặt úp · 2 mặt ngửa", bonus: false },
  { korean: "걸", name: "Geol", steps: "3 bước", faces: "1 mặt úp · 3 mặt ngửa", bonus: false },
  { korean: "윷", name: "Yut", steps: "4 bước", faces: "4 mặt ngửa", bonus: true },
  { korean: "모", name: "Mo", steps: "5 bước", faces: "4 mặt úp", bonus: true },
];

const specialRules = [
  { number: "01", title: "Rẽ vào đường tắt", text: "Muốn rẽ qua đường chéo, quân phải dừng đúng tại một ô góc. Từ lượt tiếp theo, bạn có thể chọn đường tắt. Nếu đi vượt qua góc, quân tiếp tục theo đường vuông bên ngoài." },
  { number: "02", title: "Hợp quân", text: "Khi một quân phía sau dừng đúng ô có quân cùng đội, các quân hợp lại. Từ đó, một kết quả tung có thể di chuyển cả cụm quân cùng lúc." },
  { number: "03", title: "Bắt quân đối thủ", text: "Dừng đúng ô của đối thủ để đưa quân đó về ô xuất phát và nhận thêm một lượt tung. Nếu số bước đưa bạn vượt qua đối thủ, bạn chỉ đi tiếp và không bắt quân." },
  { number: "04", title: "Về đích chính xác", text: "Quân chỉ rời bàn khi số bước đủ để đi qua ô đích. Ví dụ: nếu còn 2 ô tới đích, cần Geol (3 bước) để đến đích rồi thoát khỏi bàn; kết quả không đủ thì quân đứng yên." },
];

export default function GuidePage() {
  return (
    <main className="rules-page">
      <section className="page-hero guide-hero rules-hero">
        <div className="section-shell page-hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> Sách hướng dẫn YutQuest</p>
            <h1>Hiểu trọn luật.<br /><em>Sẵn sàng nhập cuộc.</em></h1>
          </div>
          <p>Hai đội, bốn thanh Yut và 210 thử thách ngôn ngữ. Đây là luật đầy đủ được hệ thống lại từ sách hướng dẫn của dự án.</p>
        </div>
      </section>

      <section className="section section-shell rules-overview" aria-labelledby="rules-objective">
        <div className="rules-chapter"><span>Chương 01</span><p>Thiết lập & mục tiêu</p></div>
        <div className="rules-overview-copy">
          <p className="kicker">Bắt đầu ván chơi</p>
          <h2 id="rules-objective">Đưa bốn quân<br />về nhà trước.</h2>
          <p className="guide-lead">YutQuest chơi với 2 người hoặc 2 đội, tương ứng quân xanh và quân đỏ. Mỗi bên có 4 quân; đội đầu tiên đưa cả 4 quân đi trọn vòng và rời bàn sẽ chiến thắng.</p>
          <div className="rules-facts">
            <article><strong>2</strong><span>người hoặc đội</span></article>
            <article><strong>4</strong><span>quân mỗi bên</span></article>
            <article><strong>4</strong><span>thanh Yut</span></article>
            <article><strong>1</strong><span>đội chiến thắng</span></article>
          </div>
        </div>
      </section>

      <section className="rules-turn-section">
        <div className="section section-shell rules-turn-grid">
          <div>
            <p className="kicker kicker-light">Mỗi lượt chơi</p>
            <h2>Tung. Trả lời.<br />Rồi mới di chuyển.</h2>
          </div>
          <ol className="rules-turn-flow">
            <li><span>1</span><div><strong>Tung bốn thanh Yut</strong><p>Kết quả xác định số bước tiềm năng của quân.</p></div></li>
            <li><span>2</span><div><strong>Rút một thẻ bất kỳ</strong><p>Trả lời câu hỏi thành ngữ trên thẻ sau mỗi lần tung.</p></div></li>
            <li><span>3</span><div><strong>Chốt nước đi</strong><p>Đúng thì di chuyển theo kết quả; sai thì quân đứng yên và lượt chuyển sang bên kia.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section-shell rules-outcomes" aria-labelledby="outcome-title">
        <div className="section-heading split-heading">
          <div><p className="kicker">Chương 02 · Kết quả tung</p><h2 id="outcome-title">Năm kết quả.<br />Hai lượt thưởng.</h2></div>
          <p>Mặt úp là mặt có ba dấu X. Khi tung được Yut hoặc Mo, bạn được tung thêm một lần và cộng kết quả mới vào chuỗi di chuyển.</p>
        </div>
        <div className="rules-outcome-grid">
          {outcomes.map((outcome, index) => <article className={outcome.bonus ? "is-bonus" : ""} key={outcome.name}>
            <span>0{index + 1}</span><b lang="ko">{outcome.korean}</b><div><strong>{outcome.name} · {outcome.steps}</strong><p>{outcome.faces}</p></div>{outcome.bonus && <small>+ Tung thêm</small>}
          </article>)}
        </div>
      </section>

      <section className="rules-special-section">
        <div className="section section-shell">
          <div className="section-heading split-heading">
            <div><p className="kicker kicker-light">Chương 03 · Chiến thuật</p><h2>Bốn luật làm thay đổi<br />cả đường đua.</h2></div>
            <p>Đi đúng ô quan trọng hơn chỉ đi thật xa: ô góc mở đường tắt, ô có quân tạo cơ hội hợp quân hoặc bắt quân.</p>
          </div>
          <div className="rules-special-grid">{specialRules.map((rule) => <article key={rule.number}><span>{rule.number}</span><h3>{rule.title}</h3><p>{rule.text}</p></article>)}</div>
        </div>
      </section>

      <section className="section section-shell rules-example">
        <div className="rules-example-mark" aria-hidden="true">결</div>
        <div><p className="kicker">Ví dụ về đích</p><h2>Còn 2 ô?<br />Hãy tung Geol.</h2><p>Ba bước gồm hai bước tới ô đích và một bước để rời bàn. Quy tắc này khiến chặng cuối vẫn cần tính toán chính xác.</p></div>
      </section>

      <section className="guide-cta rules-cta">
        <div className="section-shell">
          <p>Đã nắm trọn luật?</p>
          <h2>Tự tay tung thử một lượt.</h2>
          <Link className="button button-light" href="/game">Mở bản chơi thử <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
