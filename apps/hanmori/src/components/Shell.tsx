"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  House,
  BookOpen,
  Layers,
  LibraryBig,
  PencilLine,
  Bookmark,
  ChartNoAxesCombined,
  Settings2,
  Menu,
  X,
  ArrowUpRight,
  Flame,
  ChevronRight,
} from "lucide-react";
import { Brand } from "./Brand";
import { useStudy } from "./StudyProvider";
import { studyStats } from "@/lib/learning";
const links = [
  { href: "/", title: "Góc học tập", icon: House },
  { href: "/library", title: "Tủ sách TOPIK II", icon: LibraryBig },
  { href: "/courses", title: "Khám phá bài học", icon: BookOpen },
  { href: "/review", title: "Ôn tập flashcard", icon: Layers },
  { href: "/practice", title: "Luyện tập", icon: PencilLine },
  { href: "/notebook", title: "Sổ từ của mình", icon: Bookmark },
  { href: "/progress", title: "Hành trình của bạn", icon: ChartNoAxesCombined },
];
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = useStudy();
  const stats = studyStats(data);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="mobile-close icon-button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="school-label">
          <span className="school-dot" /> KHÔNG GIAN HỌC TIẾNG HÀN
        </div>
        <nav aria-label="Điều hướng chính">
          {links.map(({ href, title, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={`nav-item ${pathname === href ? "active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <Icon size={20} />
              <span>{title}</span>
              {href === "/review" && stats.due > 0 && (
                <span className="nav-count">{stats.due}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span lang="ko">천 리 길도 한 걸음부터</span>
            <p>
              Hành trình ngàn dặm
              <br />
              bắt đầu từ một bước chân.
            </p>
            <span className="tiny-flower">✳</span>
          </div>
          <Link
            className={`nav-item ${pathname === "/admin" ? "active" : ""}`}
            href="/admin"
            onClick={() => setOpen(false)}
          >
            <Settings2 size={19} /> Không gian giáo viên{" "}
            <ArrowUpRight size={15} />
          </Link>
          <Link
            href="/account"
            className="profile-link"
            onClick={() => setOpen(false)}
          >
            <span className="avatar">
              {data.name === "Bạn" ? "H" : data.name.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>
                {data.name === "Bạn" ? "Người bạn mới" : data.name}
              </strong>
              <small>Hồ sơ & mục tiêu</small>
            </span>
            <ChevronRight size={17} />
          </Link>
        </div>
      </aside>
      {open && (
        <button
          className="menu-overlay"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Mở menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
            <span>나의 작은 한국</span>
            <span className="topbar-divider" />
            <span>Một góc Hàn Quốc của bạn</span>
          </div>
          <div className="topbar-right">
            <Link href="/account" className="demo-pill">
              Bản trải nghiệm
            </Link>
            <Link
              href="/progress"
              className="streak-chip"
              aria-label={`${stats.streak} ngày liên tiếp`}
            >
              <Flame size={17} />
              <strong>{stats.streak}</strong>
              <span>ngày</span>
            </Link>
            <Link
              href="/account"
              className="small-avatar"
              aria-label="Tài khoản"
            >
              {data.name === "Bạn" ? "H" : data.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <span>
            hanmori <span className="footer-dot">·</span> Mỗi ngày, một chút
            tiếng Hàn.
          </span>
          <span>
            Dữ liệu trải nghiệm lưu trên thiết bị này{" "}
            <span lang="ko">한모리</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
