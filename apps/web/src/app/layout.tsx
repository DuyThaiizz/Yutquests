import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { MobileMenu } from "@/components/MobileMenu";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Yutquest — Chơi Yut, học thành ngữ Hàn",
    template: "%s | Yutquest",
  },
  description:
    "Yutquest biến trò chơi Yut Nori truyền thống thành hành trình học thành ngữ và khám phá văn hóa Hàn Quốc.",
  keywords: ["Yut Nori", "thành ngữ tiếng Hàn", "trò chơi học tập", "văn hóa Hàn Quốc"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Yutquest — Chơi Yut, học thành ngữ Hàn",
    description: "Tung Yut, mở khóa thành ngữ và khám phá văn hóa Hàn Quốc qua từng nước đi.",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Yutquest — trò chơi học thành ngữ Hàn lấy cảm hứng từ Yut Nori" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yutquest — Chơi Yut, học thành ngữ Hàn",
    description: "Tung Yut, mở khóa thành ngữ và khám phá văn hóa Hàn Quốc qua từng nước đi.",
    images: ["/og.png"],
  },
};

const navItems = [
  { href: "/", label: "Giới thiệu" },
  { href: "/guide", label: "Cách chơi" },
  { href: "/cards", label: "Thẻ thành ngữ" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={geist.variable}>
        <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
        <header className="site-header">
          <div className="nav-shell">
            <Link className="brand" href="/" aria-label="Yutquest — Trang chủ">
              <span className="brand-mark" aria-hidden="true">윷</span>
              <span>Yutquest</span>
            </Link>
            <nav className="desktop-nav" aria-label="Điều hướng chính">
              {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            </nav>
            <Link className="button button-small header-cta" href="/game">Chơi bản thử <ArrowIcon /></Link>
            <MobileMenu items={navItems} />
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="footer-grid">
            <div>
              <Link className="brand brand-light" href="/">
                <span className="brand-mark brand-mark-light" aria-hidden="true">윷</span>
                <span>Yutquest</span>
              </Link>
              <p>Chơi để hiểu ngôn ngữ.<br />Học để gần hơn với văn hóa.</p>
            </div>
            <div className="footer-links">
              <p className="footer-label">Khám phá</p>
              {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
              <Link href="/game">Bản thử trò chơi</Link>
            </div>
            <div className="footer-stamp" aria-label="Dự án học tập và bảo tồn văn hóa">
              <span>놀이</span>
              <small>Văn hóa qua trò chơi</small>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Yutquest</span>
            <span>Một dự án game-based learning</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}
