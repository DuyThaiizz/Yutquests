"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page empty-state">
      <h1>Trang chưa tải được.</h1>
      <p>Hãy thử tải lại. Tiến độ đã lưu trên thiết bị vẫn được giữ nguyên.</p>
      <button className="button" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
