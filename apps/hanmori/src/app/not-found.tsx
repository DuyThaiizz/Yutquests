import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page empty-state">
      <span lang="ko" className="empty-symbol">
        길
      </span>
      <h1>Mình lạc đường một chút rồi.</h1>
      <p>Trang này không tồn tại. Cùng quay lại góc học tập nhé.</p>
      <Link className="button" href="/">
        Về góc học tập
      </Link>
    </div>
  );
}
