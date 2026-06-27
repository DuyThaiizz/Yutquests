'use client';
import React, { useState } from 'react';
import BoardRenderer from '@/components/BoardRenderer';

export default function GameBoard() {
  const [roomName, setRoomName] = useState('Phòng của tôi');
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  
  // Trạng thái các thanh Yut: true = ngửa (sáng), false = úp (tối)
  const [stickStates, setStickStates] = useState([true, true, true, true]); 
  const [rollResult, setRollResult] = useState('—');
  const [logs, setLogs] = useState<string[]>(['── Trò chơi sẵn sàng. Hãy tạo phòng để bắt đầu. ──']);
  const [isRolling, setIsRolling] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleCreateRoom = () => {
    const newId = 'YN-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomId(newId);
    setGameStarted(true);
    addLog(`🏠 Đã tạo phòng "${roomName}"! ID: ${newId}`);
    addLog(`🎮 Trò chơi bắt đầu! Lượt của bạn đầu tiên.`);
  };

  const handleRollYut = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Thời gian cho animation xoay vòng (800ms)
    setTimeout(() => {
      const finalStates = [Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5];
      setStickStates(finalStates);
      setIsRolling(false);

      const upCount = finalStates.filter(Boolean).length;
      const names = ['모 (Mo) — Đi 5', '도 (Do) — Đi 1', '개 (Gae) — Đi 2', '걸 (Geol) — Đi 3', '윷 (Yut) — Đi 4'];
      const resultName = names[upCount];
      
      setRollResult(resultName);
      addLog(`🎲 Bạn tung được: ${resultName}`);

      if (upCount === 0 || upCount === 4) {
        addLog('✨ Tuyệt vời! Bạn được tung thêm lượt nữa!');
      }
    }, 800);
  };

  const handleReset = () => {
    setGameStarted(false);
    setRoomId(null);
    setStickStates([true, true, true, true]);
    setRollResult('—');
    setLogs(['── Trò chơi đã đặt lại. Hãy tạo phòng để bắt đầu. ──']);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-6 items-start font-sans">
      
      {/* CỘT TRÁI: BẢNG ĐIỀU KHIỂN CHUNG */}
      <div className="space-y-5">
        
        {/* Cài Đặt */}
        <div className="bg-white/80 backdrop-blur-md border border-[#AECFF7]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[0.95rem] font-bold text-[#1E2B3C] mb-5 pb-3 border-b border-[#AECFF7]/30 font-serif">⚙️ Cài Đặt Phòng</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#718096] mb-1">Tên phòng</label>
              <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} disabled={gameStarted} className="w-full px-3 py-2 bg-white/90 border border-[#D6E8FF] rounded-xl focus:outline-none focus:border-[#85B8EF] text-[#1E2B3C] text-[0.88rem] disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-[0.8rem] font-semibold text-[#718096] mb-1">Chế độ chơi</label>
              <select disabled={gameStarted} className="w-full px-3 py-2 bg-white/90 border border-[#D6E8FF] rounded-xl focus:outline-none focus:border-[#85B8EF] text-[#1E2B3C] text-[0.88rem] disabled:opacity-50">
                <option>Đấu với Bot (AI)</option>
                <option>Phòng Riêng Của Bạn</option>
              </select>
            </div>
            <button onClick={handleCreateRoom} disabled={gameStarted} className="w-full mt-2 bg-gradient-to-br from-[#85B8EF] to-[#3A80CC] hover:-translate-y-[2px] text-white font-semibold py-2.5 rounded-full transition-transform shadow-[0_4px_18px_rgba(58,128,204,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 text-[0.88rem]">
              🚀 Tạo Phòng Ngay
            </button>
          </div>
        </div>

        {/* Trạng thái ván đấu */}
        <div className="bg-white/80 backdrop-blur-md border border-[#AECFF7]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[0.95rem] font-bold text-[#1E2B3C] mb-5 pb-3 border-b border-[#AECFF7]/30 font-serif">📊 Trạng Thái</h3>
          <div className="space-y-2 text-[0.84rem]">
            <div className="flex justify-between"><span className="text-[#718096]">Mã Phòng ID</span><span className="font-semibold text-[#3A80CC] font-mono">{roomId || '—'}</span></div>
            <div className="flex justify-between"><span className="text-[#718096]">Tình trạng</span><span className="font-semibold text-[#1E2B3C] flex items-center gap-1.5">{gameStarted ? <><span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>Đang diễn ra</> : <><span className="w-2 h-2 rounded-full bg-[#FF8DBD]"></span>Đang chờ</>}</span></div>
            <div className="flex justify-between"><span className="text-[#718096]">Lượt đi</span><span className="font-medium text-[#1E2B3C]">{gameStarted ? 'Lượt của bạn' : '—'}</span></div>
          </div>
        </div>

        {/* Danh sách người chơi */}
        <div className="bg-white/80 backdrop-blur-md border border-[#AECFF7]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[0.95rem] font-bold text-[#1E2B3C] mb-5 pb-3 border-b border-[#AECFF7]/30 font-serif">👥 Người Chơi</h3>
          <div className="space-y-2">
            <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${gameStarted ? 'bg-[#EEF5FF] border-[#3A80CC]' : 'bg-transparent border-transparent'}`}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#85B8EF] to-[#3A80CC] flex items-center justify-center text-white text-[0.72rem] font-bold flex-shrink-0">P1</div>
              <div className="flex-1"><div className="text-[0.87rem] font-semibold text-[#1E2B3C]">Bạn (Người)</div><div className="text-[0.76rem] text-[#718096]">0 cờ về đích</div></div>
              <div className="text-[0.78rem] text-[#4ade80] font-semibold">● Lượt</div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-transparent border border-transparent">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF8DBD] to-[#F06CA0] flex items-center justify-center text-white text-[0.72rem] font-bold flex-shrink-0">AI</div>
              <div className="flex-1"><div className="text-[0.87rem] font-semibold text-[#1E2B3C]">Bot (Máy)</div><div className="text-[0.76rem] text-[#718096]">0 cờ về đích</div></div>
              <div className="text-[0.78rem] text-[#718096]">Chờ</div>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: BÀN CỜ VÀ YUT */}
      <div className="bg-white/75 backdrop-blur-md border border-[#AECFF7]/40 rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
        <h3 className="text-[0.95rem] font-serif font-bold text-[#718096] mb-6">Bàn Cờ Yut Nori</h3>
        
        <BoardRenderer />
        
        {/* Khu Vực Tung Xúc Xắc */}
        <div className="mt-8 w-full flex flex-col items-center">
          <div className="text-[0.78rem] font-semibold text-[#718096] mb-4">Tung Thanh Yut:</div>
          
          {/* Thanh Yut có Animation 3D */}
          <div className="flex gap-4 mb-6" style={{ perspective: '1000px' }}>
            {stickStates.map((isUp, idx) => (
              <div 
                key={idx} 
                className="relative w-10 h-32 transition-transform duration-[800ms] ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isRolling 
                    ? `rotateX(${720 + Math.random() * 360}deg) rotateY(${Math.random() * 90 - 45}deg) translateY(-40px)` 
                    : isUp ? 'rotateX(0deg)' : 'rotateX(180deg)'
                }}
              >
                {/* Mặt ngửa (Sáng/Phẳng) - Điểm */}
                <div className="absolute inset-0 bg-[#e8d5b2] border-[1.5px] border-[#c4a87a] rounded-xl flex items-center justify-center shadow-sm" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="w-[3px] h-[60%] bg-[#c4a87a]/50 rounded-full" />
                </div>
                {/* Mặt úp (Tối/Cong) - Không có điểm */}
                <div className="absolute inset-0 bg-[#3d2b1a] border-[1.5px] border-[#1a0f00] rounded-xl shadow-inner" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}></div>
              </div>
            ))}
          </div>

          <div className="text-[1.6rem] font-bold text-[#3A80CC] font-serif min-h-[40px] mb-4">{rollResult}</div>
          
          <div className="flex gap-3">
            <button onClick={handleRollYut} disabled={!gameStarted || isRolling} className="px-6 py-2.5 bg-gradient-to-br from-[#85B8EF] to-[#3A80CC] hover:-translate-y-[2px] text-white font-semibold rounded-full transition-transform shadow-[0_4px_18px_rgba(58,128,204,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 text-[0.88rem]">
              🎲 Tung Yut
            </button>
            <button onClick={handleReset} className="px-5 py-2.5 bg-white/80 border border-[#AECFF7]/80 text-[#4A5568] hover:bg-[#EEF5FF] hover:text-[#3A80CC] font-semibold rounded-full transition-colors text-[0.88rem]">
              ↺ Đặt lại
            </button>
          </div>
        </div>

        {/* Nhật ký */}
        <div className="mt-6 w-full text-left">
          <div className="text-[0.78rem] font-semibold text-[#718096] mb-2">Nhật ký trò chơi</div>
          <div className="h-28 overflow-y-auto bg-[#EEF5FF] border border-[#D6E8FF] rounded-xl p-3 text-[0.8rem] text-[#718096] space-y-1.5 leading-[1.8]">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}