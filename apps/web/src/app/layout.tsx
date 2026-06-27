import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Yut Nori – Trò Chơi Truyền Thống Hàn Quốc',
  description: 'Trải nghiệm phiên bản kỹ thuật số của trò chơi truyền thống Hàn Quốc',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Sử dụng Inter và Plus Jakarta Sans để hỗ trợ Tiếng Việt hoàn hảo */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased pt-[68px] min-h-screen flex flex-col bg-[#FDF9F1]">
        
        {/* Navigation Bar - Đã Việt Hóa */}
        <nav className="fixed top-0 left-0 right-0 h-[68px] bg-white/90 backdrop-blur-md border-b border-[#AECFF7]/30 flex items-center px-8 z-50 transition-all">
          <Link href="/" className="font-serif font-bold text-xl text-[#3A80CC] flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#85B8EF] to-[#3A80CC] flex items-center justify-center text-white text-sm font-bold shadow-md">
              윷
            </div>
            Yut Nori
          </Link>

          <ul className="hidden md:flex gap-2 list-none">
            <li>
              <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] transition-colors">
                🏛 Về Chúng Tôi
              </Link>
            </li>
            <li>
              <Link href="/game" className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] transition-colors">
                🎮 Phòng Chơi
              </Link>
            </li>
            <li>
              <Link href="/guide" className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] transition-colors">
                📖 Hướng Dẫn
              </Link>
            </li>
            <li>
              <Link href="/forum" className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] transition-colors">
                💬 Cộng Đồng
              </Link>
            </li>
            <li>
              <Link href="/cards" className="flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] transition-colors">
                🃏 Thư Viện Thẻ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1E2B3C] text-white py-12 px-8 text-center mt-auto border-t border-[#AECFF7]/20">
          <div className="font-serif text-2xl font-bold text-[#85B8EF] mb-3">윷놀이</div>
          <p className="text-sm text-[#718096]">Yut Nori Digital · Gìn giữ Di sản Hàn Quốc · Kết nối Thế giới</p>
        </footer>

      </body>
    </html>
  );
}