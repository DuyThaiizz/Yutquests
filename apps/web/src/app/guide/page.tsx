import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cách chơi", description: "Luật chơi Yutquest trong ba phút." };

const outcomes = [
  ["도 · Do", "1 bước", "1 mặt phẳng"],
  ["개 · Gae", "2 bước", "2 mặt phẳng"],
  ["걸 · Geol", "3 bước", "3 mặt phẳng"],
  ["윷 · Yut", "4 bước", "4 mặt phẳng · tung lại"],
  ["모 · Mo", "5 bước", "0 mặt phẳng · tung lại"],
];

export default function GuidePage() {
  return (
    <>
      <section className="page-hero guide-hero">
        <div className="section-shell page-hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> Hướng dẫn nhanh</p>
            <h1>Hiểu luật trong<br /><em>ba phút.</em></h1>
          </div>
          <p>Yutquest giữ lại cốt lõi của Yut Nori: tung thanh, chọn đường và đưa quân về đích. Thẻ thành ngữ xuất hiện giữa các lượt chơi.</p>
        </div>
      </section>

      <section className="section section-shell guide-intro">
        <div className="guide-index">
          <span>01</span><p>Mục tiêu</p>
        </div>
        <div>
          <p className="kicker">Mục tiêu của ván chơi</p>
          <h2>Đưa toàn bộ quân<br />về nhà trước.</h2>
          <p className="guide-lead">Mỗi người điều khiển đội quân của mình quanh bàn cờ. Bạn có thể đi đường dài an toàn, rẽ vào đường tắt hoặc bắt quân đối thủ để giành thêm lượt.</p>
          <div className="goal-diagram" aria-label="Sơ đồ từ điểm xuất phát đến đích">
            <span>Xuất phát</span><i /><i /><i /><strong>Đích</strong>
          </div>
        </div>
      </section>

      <section className="guide-dark">
        <div className="section section-shell">
          <div className="section-heading split-heading">
            <div><p className="kicker kicker-light">Kết quả thanh Yut</p><h2>Năm kết quả.<br />Một chút may mắn.</h2></div>
            <p>Bốn thanh gỗ có một mặt phẳng và một mặt cong. Tổ hợp mặt ngửa tạo ra số bước đi.</p>
          </div>
          <div className="outcome-table">
            {outcomes.map(([name, steps, rule], index) => (
              <div className="outcome-row" key={name}>
                <span>0{index + 1}</span><strong>{name}</strong><b>{steps}</b><p>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-shell learning-rules">
        <div className="section-heading split-heading">
          <div><p className="kicker">Điểm khác biệt</p><h2>Thẻ học không làm<br />ngắt mạch cuộc chơi.</h2></div>
          <p>Khi quân dừng ở ô chủ đề, người chơi nhận một câu hỏi ngắn. Đáp án xuất hiện ngay sau lựa chọn để việc học diễn ra tức thời.</p>
        </div>
        <ol className="rule-sequence">
          <li><span>1</span><div><strong>Dừng ở ô màu</strong><p>Màu ô quyết định chủ đề của thẻ.</p></div></li>
          <li><span>2</span><div><strong>Chọn nghĩa phù hợp</strong><p>Một câu hỏi, ba lựa chọn, không áp lực thời gian.</p></div></li>
          <li><span>3</span><div><strong>Nhận giải thích</strong><p>Xem nghĩa đen, nghĩa bóng và cách dùng thực tế.</p></div></li>
        </ol>
      </section>

      <section className="guide-cta">
        <div className="section-shell">
          <p>Đã nắm luật cơ bản?</p>
          <h2>Tự tay tung thử một lượt.</h2>
          <Link className="button button-light" href="/game">Mở bản thử <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
