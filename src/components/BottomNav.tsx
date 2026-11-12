import React from 'react';
import { NavTabId } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface BottomNavProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const row1Tabs: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'home', label: 'หน้าหลัก', icon: '🦐' },
    { id: 'ponds', label: 'บ่อของฉัน', icon: '🦐' },
    { id: 'tasks', label: 'งานวันนี้', icon: '📋' },
    { id: 'sell', label: 'ขายกุ้ง', icon: '🚚' },
  ];

  const row2Tabs: { id: NavTabId; label: string; icon: string }[] = [
    { id: 'breeds', label: 'พันธุ์กุ้ง', icon: '🦐' },
    { id: 'diseases', label: 'โรคกุ้ง', icon: '🩺' },
    { id: 'prices', label: 'ราคากุ้ง', icon: '💰' },
    { id: 'money', label: 'ดูเงิน', icon: '💵' },
  ];

  const handleSelect = (tab: NavTabId) => {
    playAudioBeep(560, 'sine', 0.1);
    onChangeTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFEFB]/98 backdrop-blur-md border-t-2 border-[#F2C9A0] shadow-[0_-6px_24px_rgba(255,122,26,0.12)]">
      <div className="max-w-[480px] mx-auto px-2 pt-2 pb-1">
        {/* Row 1: 4 Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-1.5">
          {row1Tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`h-12 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                  isActive
                    ? 'bg-[#FF7A1A] text-white shadow-md shadow-[#FF7A1A]/30 scale-[1.02]'
                    : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
                }`}
              >
                <span className="text-xs leading-none mb-0.5">{t.icon}</span>
                <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: 4 Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-1.5">
          {row2Tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`h-12 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                  isActive
                    ? 'bg-[#FF7A1A] text-white shadow-md shadow-[#FF7A1A]/30 scale-[1.02]'
                    : 'bg-[#FFFDF9] text-[#1A2B33] hover:bg-[#FFF4EA] border border-[#F2C9A0]/60'
                }`}
              >
                <span className="text-xs leading-none mb-0.5">{t.icon}</span>
                <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Help Text As Explicitly Required */}
        <div className="text-center pb-1">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#FF7A1A] bg-[#FFF4EA] py-0.5 px-2 rounded-full inline-block border border-[#F2C9A0]/50">
            ตัวใหญ่ กดง่าย • หลงทางกดปุ่ม กลับหน้าหลัก ได้เสมอ
          </p>
        </div>
      </div>
    </nav>
  );
};
