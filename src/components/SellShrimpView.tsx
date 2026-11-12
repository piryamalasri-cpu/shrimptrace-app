import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  CalendarCheck,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Pond } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface SellShrimpViewProps {
  ponds: Pond[];
  onOpenBooking: () => void;
  onOpenFactoryCall: () => void;
  onBackToHome: () => void;
}

export const SellShrimpView: React.FC<SellShrimpViewProps> = ({
  ponds,
  onOpenBooking,
  onOpenFactoryCall,
  onBackToHome,
}) => {
  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="shrimp-card p-5 sm:p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={STICKER_MAP.money.src} size={48} alt="ขายกุ้ง" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              เมนูขายกุ้งเข้าโรงงาน
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2B33] mt-0.5">
              ขายกุ้ง (จองคิว & เช็คราคา)
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#1A2B33]/70 font-semibold">
          เชื่อมต่อโรงงานรับซื้อ ตรวจระยะหยุดยาอัตโนมัติ ไม่โดนกดราคา
        </p>
      </div>

      {/* Batch Status Card */}
      <div className="shrimp-card p-5 bg-[#FFFEFB] border-2 border-emerald-400 rounded-[24px] shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2C9A0]/50">
          <div>
            <span className="text-[11px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
              กุ้งรุ่นนี้
            </span>
            <h3 className="text-lg font-bold text-[#1A2B33] mt-0.5">
              รหัสรุ่น: SHR-2026-084
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมจับขายได้
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#1A2B33]/80 mb-4">
          <div className="flex justify-between py-1 border-b border-[#F2C9A0]/30">
            <span>ระยะหยุดยา:</span>
            <strong className="text-emerald-700">ครบ 18 วัน (เกณฑ์ 14 วัน)</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2C9A0]/30">
            <span>ผลตรวจสารตกค้าง:</span>
            <strong className="text-emerald-700">0 ppm (ไม่พบสาร)</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2C9A0]/30">
            <span>ประมาณน้ำหนักพร้อมจับ:</span>
            <strong className="text-[#1A2B33]">3,500 กิโลกรัม</strong>
          </div>
          <div className="flex justify-between py-1">
            <span>ราคารับซื้อเฉลี่ย (ไซส์ 50):</span>
            <strong className="text-[#FF7A1A] font-bold">165 บาท / กก.</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onOpenBooking}
            className="flex-1 h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>สั่งจองคิวส่งโรงงาน</span>
          </button>
          <button
            onClick={onOpenFactoryCall}
            className="h-14 px-4 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold text-sm rounded-2xl hover:bg-[#FFF4EA] transition-colors flex items-center justify-center gap-2"
          >
            <Building2 className="w-5 h-5 text-[#FF7A1A]" />
            <span>โทรหาโรงงาน</span>
          </button>
        </div>
      </div>

      {/* Ponds Harvest Readiness */}
      <div>
        <h3 className="text-base font-bold text-[#1A2B33] mb-2.5 px-1">
          ความพร้อมในการจับกุ้งแต่ละบ่อ:
        </h3>
        <div className="space-y-2.5">
          {ponds.map((p) => (
            <div
              key={p.id}
              className="p-3.5 bg-[#FFFEFB] border border-[#F2C9A0] rounded-2xl flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-base text-[#1A2B33]">{p.name}</span>
                <p className="text-xs text-[#1A2B33]/60">
                  อายุ {p.ageDays} วัน • หนัก {p.weightGrams} กรัม ({p.shrimpPerKg} ตัว/กก.)
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.ageDays >= 40
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#FFF4EA] text-[#FF7A1A]'
                }`}
              >
                {p.ageDays >= 40 ? 'พร้อมขาย' : 'เลี้ยงต่ออีกนิด'}
              </span>
            </div>
          ))}
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
