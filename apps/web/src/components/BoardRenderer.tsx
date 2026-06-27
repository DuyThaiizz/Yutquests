'use client';
import React from 'react';

// Bảng 5 màu tuần hoàn cho các ô cờ (Chuẩn bị cho Question Phase theo yêu cầu CEO)
const NODE_COLORS = [
  { fill: '#d9667c', stroke: '#9c3f52' }, // Rose
  { fill: '#b98a5e', stroke: '#7a5a39' }, // Brown
  { fill: '#7fd4b0', stroke: '#3f9c79' }, // Mint
  { fill: '#e0a83e', stroke: '#a8761e' }, // Gold
  { fill: '#eef2f7', stroke: '#aab4c2' }, // Snow
];

export default function BoardRenderer() {
  const getColor = (index: number) => NODE_COLORS[index % NODE_COLORS.length];

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto rounded-[20px] overflow-hidden border-[16px] border-[#4E2A2A] shadow-2xl bg-[#2a1b42] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-[92%] h-[92%] block">
        {/* Khung nối các đường đi */}
        <line x1="40" y1="40" x2="360" y2="360" stroke="#4E2A2A" strokeWidth="2.5" />
        <line x1="360" y1="40" x2="40" y2="360" stroke="#4E2A2A" strokeWidth="2.5" />
        <rect x="40" y="40" width="320" height="320" fill="none" stroke="#4E2A2A" strokeWidth="2.5" />

        {/* Các ô dọc theo viền (Edges) */}
        {[
          { cx: 104, cy: 40, c: 1 }, { cx: 168, cy: 40, c: 2 }, { cx: 232, cy: 40, c: 3 }, { cx: 296, cy: 40, c: 4 },
          { cx: 360, cy: 104, c: 0 }, { cx: 360, cy: 168, c: 1 }, { cx: 360, cy: 232, c: 2 }, { cx: 360, cy: 296, c: 3 },
          { cx: 296, cy: 360, c: 4 }, { cx: 232, cy: 360, c: 0 }, { cx: 168, cy: 360, c: 1 }, { cx: 104, cy: 360, c: 2 },
          { cx: 40, cy: 296, c: 3 }, { cx: 40, cy: 232, c: 4 }, { cx: 40, cy: 168, c: 0 }, { cx: 40, cy: 104, c: 1 }
        ].map((pos, i) => {
          const col = getColor(pos.c);
          return <circle key={`edge-${i}`} cx={pos.cx} cy={pos.cy} r="10" fill={col.fill} stroke={col.stroke} strokeWidth="2" />;
        })}

        {/* Các ô đường chéo cắt ngang (Diagonals) */}
        {[
          { cx: 96, cy: 96, c: 2 }, { cx: 152, cy: 152, c: 3 },
          { cx: 304, cy: 96, c: 4 }, { cx: 248, cy: 152, c: 0 },
          { cx: 96, cy: 304, c: 1 }, { cx: 152, cy: 248, c: 2 },
          { cx: 304, cy: 304, c: 3 }, { cx: 248, cy: 248, c: 4 }
        ].map((pos, i) => {
          const col = getColor(pos.c);
          return <circle key={`diag-${i}`} cx={pos.cx} cy={pos.cy} r="10" fill={col.fill} stroke={col.stroke} strokeWidth="2" />;
        })}

        {/* 4 Góc lớn của bàn cờ */}
        {[
          { cx: 40, cy: 40, c: 0, text: 'VÀO' },
          { cx: 360, cy: 40, c: 1, text: '↩' },
          { cx: 360, cy: 360, c: 2, text: '↩' },
          { cx: 40, cy: 360, c: 3, text: '↩' }
        ].map((pos, i) => {
          const col = getColor(pos.c);
          return (
            <g key={`corner-${i}`}>
              <circle cx={pos.cx} cy={pos.cy} r="20" fill={col.fill} stroke={col.stroke} strokeWidth="3" />
              <text x={pos.cx} y={pos.cy + 4} textAnchor="middle" fill="#1A1A1A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{pos.text}</text>
            </g>
          );
        })}

        {/* Huy hiệu Tâm (Center Medallion) */}
        <circle cx="200" cy="200" r="26" fill="#D4AF37" stroke="#8B1A1A" strokeWidth="4" />
        <circle cx="200" cy="200" r="18" fill="#1a1a1a" opacity="0.15" />
        <text x="200" y="204" textAnchor="middle" fill="#4E2A2A" fontSize="12" fontWeight="bold" fontFamily="sans-serif">TÂM</text>

        {/* Cờ mô phỏng P1 (Sẽ thay đổi bằng Logic Phase 4) */}
        <circle cx="40" cy="40" r="12" fill="#3A80CC" stroke="#ffffff" strokeWidth="2" />
        <text x="40" y="44" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">P1</text>
        
        <circle cx="64" cy="40" r="12" fill="#D44F85" stroke="#ffffff" strokeWidth="2" />
        <text x="64" y="44" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AI</text>
      </svg>
    </div>
  );
}