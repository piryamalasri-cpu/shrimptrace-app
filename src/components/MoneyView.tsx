import React from 'react';
import { DollarSign, TrendingUp, PieChart, Wallet, ArrowRight } from 'lucide-react';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface MoneyViewProps {
  onBackToHome: () => void;
  onGoToSell: () => void;
}

export const MoneyView: React.FC<MoneyViewProps> = ({ onBackToHome, onGoToSell }) => {
  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="shrimp-card p-5 sm:p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={STICKER_MAP.money.src} size={48} alt="ดูเงิน" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              กระเป๋าเงิน & กำไรฟาร์ม
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2B33] mt-0.5">
              ดูเงิน / สรุปต้นทุน-กำไร
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#1A2B33]/70 font-semibold">
          สรุปเงินสด รายรับ รายจ่ายรุ่นนี้ เข้าใจง่าย ไม่มีศัพท์บัญชียากๆ
        </p>
      </div>

      {/* Main Profit Projection Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-3xl shadow-lg shadow-emerald-700/20 text-center">
        <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide block">
          กำไรสุทธิประมาณการ (รุ่น SHR-2026-084)
        </span>
        <span className="text-4xl sm:text-5xl font-black tabular-nums block mt-1">
          + ฿ 392,500
        </span>
        <p className="text-xs text-white/80 mt-1">
          คิดจากราคาขาย ฿577,500 หักต้นทุนสะสม ฿185,000
        </p>

        <button
          onClick={onGoToSell}
          className="mt-4 px-6 h-12 bg-white text-emerald-800 font-bold text-sm rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow-sm inline-flex items-center gap-2"
        >
          <span>ไปที่หน้าขายกุ้ง</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2 Big Cards: Revenue vs Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 bg-[#FFFEFB] border-2 border-emerald-300 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-emerald-800 block">1. เงินคาดว่าจะได้ (รายรับ)</span>
          <span className="text-2xl font-black text-emerald-700 tabular-nums block mt-1">
            ฿ 577,500
          </span>
          <p className="text-[11px] text-[#1A2B33]/60 mt-1">
            3,500 กก. × ราคาเฉลี่ย 165 บ./กก.
          </p>
        </div>

        <div className="p-4 bg-[#FFFEFB] border-2 border-amber-300 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-amber-900 block">2. เงินที่จ่ายไปแล้ว (ต้นทุน)</span>
          <span className="text-2xl font-black text-rose-600 tabular-nums block mt-1">
            ฿ 185,000
          </span>
          <p className="text-[11px] text-[#1A2B33]/60 mt-1">
            ค่าลูกกุ้ง + ค่าอาหาร + ค่าไฟใบพัด
          </p>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="shrimp-card p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <h3 className="text-base font-bold text-[#1A2B33] mb-3">
          รายละเอียดเงินที่จ่ายไปในรุ่นนี้:
        </h3>
        <div className="space-y-2.5 text-xs text-[#1A2B33]">
          <div className="flex justify-between p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/40">
            <span>ค่าลูกกุ้ง PL12 (โชคดี ฟาร์ม)</span>
            <strong className="text-rose-600 font-bold">฿ 45,000</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/40">
            <span>ค่าอาหารเม็ดโปรตีนสูง</span>
            <strong className="text-rose-600 font-bold">฿ 92,000</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/40">
            <span>ค่าไฟฟ้าเครื่องตีน้ำ / ปั๊มน้ำ</span>
            <strong className="text-rose-600 font-bold">฿ 32,000</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/40">
            <span>ค่าแร่ธาตุ ปูนขาว จุลินทรีย์</span>
            <strong className="text-rose-600 font-bold">฿ 16,000</strong>
          </div>
        </div>
      </div>

      {/* MANDATORY BIG ORANGE "กลับหน้าหลัก" BUTTON */}
      <div className="pt-2">
        <button
          onClick={onBackToHome}
          className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xl font-black rounded-2xl shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <ShrimpSticker size="sm" />
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
};
