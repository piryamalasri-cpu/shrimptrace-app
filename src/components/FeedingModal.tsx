import React, { useState } from 'react';
import { CheckCircle2, Utensils, X, Plus, Minus, Sparkles } from 'lucide-react';
import { Pond } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface FeedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ponds: Pond[];
  onSave: (pondId: string, feedKg: number, trayPercent: number) => void;
}

export const FeedingModal: React.FC<FeedingModalProps> = ({
  isOpen,
  onClose,
  ponds,
  onSave,
}) => {
  const [selectedPondId, setSelectedPondId] = useState(ponds[0]?.id || 'A1');
  const [feedKg, setFeedKg] = useState(35);
  const [trayPercent, setTrayPercent] = useState(95);

  if (!isOpen) return null;

  const handleAdjustFeed = (amount: number) => {
    playAudioBeep(520, 'sine', 0.1);
    setFeedKg((prev) => Math.max(1, prev + amount));
  };

  const handleSave = () => {
    playAudioBeep(640, 'sine', 0.2);
    onSave(selectedPondId, feedKg, trayPercent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <ShrimpSticker size="md" withBadge />
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              เมนูเร่งด่วน 1 ใน 3 ปุ่มหลัก
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33] mt-0.5">
              ให้อาหารกุ้ง / เช็คยอ
            </h3>
          </div>
        </div>

        {/* Pond Selector */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-[#1A2B33] mb-1.5">
            เลือกบ่อที่ให้อาหาร:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ponds.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPondId(p.id)}
                className={`py-3 px-2 rounded-2xl font-bold text-center border-2 transition-all ${
                  selectedPondId === p.id
                    ? 'bg-[#FF7A1A] text-white border-[#FF7A1A] shadow-md'
                    : 'bg-white text-[#1A2B33] border-[#F2C9A0] hover:bg-[#FFF4EA]'
                }`}
              >
                บ่อ {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Amount Stepper */}
        <div className="mb-5 p-4 bg-[#FFF9F2] border border-[#F2C9A0] rounded-2xl">
          <label className="block text-sm font-bold text-[#1A2B33] mb-2 text-center">
            ปริมาณอาหารมื้อนี้ (กิโลกรัม)
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleAdjustFeed(-5)}
              className="w-12 h-12 rounded-2xl bg-white border border-[#F2C9A0] text-lg font-bold text-[#1A2B33] hover:bg-[#FFE9D6] transition-colors flex items-center justify-center shadow-sm"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleAdjustFeed(-1)}
              className="w-12 h-12 rounded-2xl bg-white border border-[#F2C9A0] text-[#1A2B33] hover:bg-[#FFE9D6] transition-colors flex items-center justify-center shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="w-32 text-center">
              <span className="text-4xl font-extrabold text-[#FF7A1A] tabular-nums block">
                {feedKg}
              </span>
              <span className="text-xs text-[#1A2B33]/60 font-medium">กิโลกรัม (กก.)</span>
            </div>

            <button
              type="button"
              onClick={() => handleAdjustFeed(1)}
              className="w-12 h-12 rounded-2xl bg-white border border-[#F2C9A0] text-[#1A2B33] hover:bg-[#FFE9D6] transition-colors flex items-center justify-center shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleAdjustFeed(5)}
              className="w-12 h-12 rounded-2xl bg-white border border-[#F2C9A0] text-lg font-bold text-[#1A2B33] hover:bg-[#FFE9D6] transition-colors flex items-center justify-center shadow-sm"
            >
              +5
            </button>
          </div>
        </div>

        {/* Feed Tray Consumption Rate */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#1A2B33] mb-2">
            ผลตรวจยออาหารรอบล่าสุด:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'ยอแห้ง 100%', percent: 100, desc: 'กินหมดเกลี้ยง' },
              { label: 'เหลือนิด 85%', percent: 85, desc: 'กินตามเกณฑ์' },
              { label: 'เหลือเยอะ 50%', percent: 50, desc: 'กินช้า ผิดปกติ' },
            ].map((opt) => (
              <button
                key={opt.percent}
                type="button"
                onClick={() => setTrayPercent(opt.percent)}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  trayPercent === opt.percent
                    ? 'bg-[#FFF4EA] border-[#FF7A1A] shadow-md ring-2 ring-[#FF7A1A]/20'
                    : 'bg-white border-[#F2C9A0] hover:bg-[#FFFDF9]'
                }`}
              >
                <span className="block font-bold text-sm text-[#1A2B33]">{opt.label}</span>
                <span className="text-[11px] text-[#1A2B33]/60">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-14 w-1/3 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            บันทึกการให้อาหาร
          </button>
        </div>
      </div>
    </div>
  );
};
