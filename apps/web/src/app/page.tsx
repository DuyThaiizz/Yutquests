'use client';
import React from 'react';
import Link from 'next/link';

// Placeholder cho các component tính năng (Bạn sẽ thay bằng component thật sau)
const AuthFormPlaceholder = () => (
  <div className="bg-white/50 p-4 rounded-xl text-center text-[#4A5568] text-sm border border-[#AECFF7]/30 backdrop-blur-sm">
    Khu vực <span className="font-bold text-[#3A80CC]">Đăng nhập / Đăng ký</span>
  </div>
);

const GameClientPlaceholder = () => (
  <div className="bg-gradient-to-r from-[#FFF0F5] to-[#EEF5FF] p-4 rounded-xl text-center text-[#4A5568] text-sm border border-[#FFB3D4]/30 backdrop-blur-sm mt-3">
    Khu vực <span className="font-bold text-[#F06CA0]">Nhập ID để vào phòng</span>
  </div>
);

export default function HomePage() {
  return (
    <div className="animate-in fade-in duration-700 font-sans bg-[#FFFFFF] text-[#1E2B3C] overflow-hidden">
      
      {/* 
        HERO SECTION: Phong cách DayByKorea kết hợp màu Yutnori Pastel
        Bố cục căn giữa, chữ lớn, Orbs (khối cầu) mờ trôi nổi tạo cảm giác không gian
      */}
      <section className="relative pt-32 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center">
        
        {/* Floating Background Orbs (Hiệu ứng ánh sáng mờ) */}
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-[#AECFF7] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-[#FFB3D4] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EEF5FF]/80 backdrop-blur-md border border-[#AECFF7]/50 text-[#3A80CC] text-[0.75rem] font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F06CA0] animate-pulse"></span>
            Khám phá văn hóa qua trò chơi
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-[5rem] font-extrabold text-[#1E2B3C] mb-6 leading-[1.1] tracking-tight font-serif">
            Yut Nori Kỹ Thuật Số<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A80CC] to-[#F06CA0]">
              Mang Di Sản Ra Thế Giới
            </span>
          </h1>
          
          <p className="text-[#4A5568] text-[1.1rem] md:text-[1.2rem] leading-relaxed max-w-2xl mb-12">
            Trải nghiệm tựa game cờ truyền thống được yêu thích nhất Hàn Quốc. Học văn hóa, kết nối với bạn bè, và tận hưởng niềm vui của Yut Nori bất chấp mọi khoảng cách.
          </p>
          
          {/* Glassmorphism Box cho Đăng nhập (Thay thế hình ảnh bàn cờ) */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[24px] p-6 md:p-8 max-w-xl w-full mb-12 shadow-[0_20px_60px_rgba(90,155,223,0.1)]">
            <h3 className="text-[0.85rem] font-bold text-[#3A80CC] mb-4 uppercase tracking-wider text-left">Cổng Truy Cập</h3>
            <AuthFormPlaceholder />
            <GameClientPlaceholder />
          </div>

          {/* Nút Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/game" className="px-8 py-4 bg-gradient-to-r from-[#3A80CC] to-[#5A9BDF] hover:-translate-y-1 text-white font-bold rounded-full transition-all shadow-[0_8px_24px_rgba(58,128,204,0.3)] text-[0.95rem]">
              Vào phòng chơi ngay →
            </Link>
            <Link href="/guide" className="px-8 py-4 bg-white border border-[#D6E8FF] text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] font-bold rounded-full transition-all shadow-sm text-[0.95rem]">
              📖 Hướng dẫn luật chơi
            </Link>
          </div>
        </div>
      </section>

      {/* ĐỘI NGŨ CỦA CHÚNG TÔI (Who We Are) */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-[#EEF5FF]/40 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#3A80CC] mb-3">Đội ngũ phát triển</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2B3C]">Thành viên của nhóm phát triển dự án</h2>
            <div className="w-12 h-1.5 bg-gradient-to-r from-[#3A80CC] to-[#F06CA0] rounded-full mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Teacher/Team Cards mang phong cách Pastel Glass */}
            {[
              { name: 'Lê Trần Khánh Linh', role: 'Trưởng nhóm', initial: 'Lin', desc: 'Trưởng nhóm phát triển dự án.', color: 'from-[#AECFF7] to-[#D6E8FF]' },
              { name: 'Tô Diệu Linh', role: 'Thiết Kế THẺ BÀI', initial: 'DIỆU', desc: 'Kết hợp thẩm mỹ truyền thống Hàn Quốc vào những lá bài mang phong cáchhiện đại.', color: 'from-[#FFD6E8] to-[#FFF0F5]' },
              { name: 'Lương Phương Thảo', role: 'Thiết Kế Trò Chơi', initial: 'Thảo', desc: 'Nghiên cứu luật chơi Yut Nori và chuyển thể thành cơ chế kỹ thuật số.', color: 'from-[#AECFF7] to-[#FFD6E8]' },
              { name: 'Nguyễn Phương Anh', role: 'Nghiên cứu viên', initial: 'Anh', desc: 'Nghiên cứu và phân tích các khía cạnh văn hóa và lịch sử của trò chơi Yut Nori.', color: 'from-[#D6E8FF] to-[#AECFF7]' },
              { name: 'Nguyễn Thành Thái', role: 'Thiết kế UI/UX', initial: 'Thái', desc: 'Kết hợp thẩm mỹ truyền thống Hàn Quốc vào trải nghiệm web hiện đại.', color: 'from-[#FFD6E8] to-[#FFF0F5]' },
            ].map((member, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md p-8 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#EEF5FF] text-center hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-[72px] h-[72px] mx-auto rounded-full bg-gradient-to-br ${member.color} border-2 border-white shadow-sm flex items-center justify-center text-2xl font-serif font-bold text-[#1E2B3C] mb-4`}>
                  {member.initial}
                </div>
                <h3 className="font-bold text-[#1E2B3C] text-[1.05rem]">{member.name}</h3>
                <div className="text-[0.75rem] font-bold uppercase tracking-wider text-[#3A80CC] mt-1 mb-3">{member.role}</div>
                <p className="text-[0.85rem] text-[#718096] leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* NGUỒN CẢM HỨNG (Inspiration) */}
      <section className="py-24 px-6 bg-[#FAFCFF] border-y border-[#EEF5FF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#3A80CC] mb-3">Động lực phát triển</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2B3C]">Nguồn cảm hứng của dự án</h2>
            <div className="w-12 h-1.5 bg-gradient-to-r from-[#3A80CC] to-[#F06CA0] rounded-full mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border-t-4 border-[#3A80CC] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎴</div>
              <h4 className="font-bold text-[#1E2B3C] mb-2">Thanh Yut Truyền Thống</h4>
              <p className="text-[#718096] text-[0.85rem]">Bốn thanh gỗ định đoạt nước đi — mỗi lần tung là một lần hé mở vận mệnh vũ trụ.</p>
            </div>
            <div className="bg-white border-t-4 border-[#F06CA0] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🏯</div>
              <h4 className="font-bold text-[#1E2B3C] mb-2">Văn Hóa Dân Gian</h4>
              <p className="text-[#718096] text-[0.85rem]">Bảng màu Dancheong, giấy Hanji và họa tiết kiến trúc truyền thống tạo nên linh hồn dự án.</p>
            </div>
            <div className="bg-white border-t-4 border-[#3A80CC] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="font-bold text-[#1E2B3C] mb-2">Giáo Dục Chủ Động</h4>
              <p className="text-[#718096] text-[0.85rem]">Biến những giá trị truyền thống phức tạp trở nên dễ tiếp cận thông qua lối chơi tương tác.</p>
            </div>
            <div className="bg-white border-t-4 border-[#F06CA0] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🌏</div>
              <h4 className="font-bold text-[#1E2B3C] mb-2">Cộng Đồng Toàn Cầu</h4>
              <p className="text-[#718096] text-[0.85rem]">Dành cho hàng triệu người Hàn Quốc và những người yêu văn hóa muốn tìm về cội nguồn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI (Benefits) */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <p className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#F06CA0] mb-3">Tầm Nhìn</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E2B3C] mb-16">Giá trị cốt lõi mang lại</h2>
        
        <div className="space-y-12">
          <div className="flex gap-6 items-start group">
            <div className="font-serif text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#85B8EF] to-[#F472B6] w-16 shrink-0 group-hover:scale-110 transition-transform">01</div>
            <div>
              <h4 className="text-xl font-bold text-[#1E2B3C] mb-2">Học văn hóa một cách tự nhiên</h4>
              <p className="text-[#4A5568] leading-relaxed text-[0.95rem]">Mỗi ván đấu là một trải nghiệm văn hóa. Từ thuật ngữ đến thiết kế, người chơi tiếp thu truyền thống Hàn Quốc thông qua lối chơi — không cần ghi nhớ máy móc.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start group">
            <div className="font-serif text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#85B8EF] to-[#F472B6] w-16 shrink-0 group-hover:scale-110 transition-transform">02</div>
            <div>
              <h4 className="text-xl font-bold text-[#1E2B3C] mb-2">Kết nối bất chấp khoảng cách</h4>
              <p className="text-[#4A5568] leading-relaxed text-[0.95rem]">Dù ở Seoul hay Hà Nội, Yut Nori mang gia đình và bạn bè lại gần nhau xuyên qua các múi giờ. Phòng chơi riêng tư tạo cảm giác như đang ngồi chung một bàn cờ.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start group">
            <div className="font-serif text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#85B8EF] to-[#F472B6] w-16 shrink-0 group-hover:scale-110 transition-transform">03</div>
            <div>
              <h4 className="text-xl font-bold text-[#1E2B3C] mb-2">Tương tác để học hỏi</h4>
              <p className="text-[#4A5568] leading-relaxed text-[0.95rem]">Hệ thống thẻ bài và hướng dẫn của chúng tôi biến việc học thụ động thành sự tham gia chủ động. Kiến thức văn hóa trở thành phần thưởng tự nhiên sau những phút giây giải trí.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}