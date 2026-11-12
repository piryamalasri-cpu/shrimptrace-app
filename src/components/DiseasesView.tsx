import React, { useState } from 'react';
import { SHRIMP_DISEASES } from '../data/initialData';
import { ShrimpDisease } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import {
  PhoneCall,
  X,
  Eye,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { playAudioBeep } from '../utils/audio';

interface DiseasesViewProps {
  onBackToHome: () => void;
  onOpenDoctor: () => void;
}

export const DiseasesView: React.FC<DiseasesViewProps> = ({
  onBackToHome,
  onOpenDoctor,
}) => {
  const [inspectModal, setInspectModal] = useState<{
    disease: ShrimpDisease;
    type: 'symptoms' | 'remedy';
  } | null>(null);

  const handleOpenInspect = (disease: ShrimpDisease, type: 'symptoms' | 'remedy') => {
    playAudioBeep(520, 'sine', 0.1);
    setInspectModal({ disease, type });
  };

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="shrimp-card p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <ShrimpSticker size="xl" withBadge />
          <div>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
              คู่มือสุขภาพ & โรคกุ้ง
            </span>
            <h1 className="text-2xl font-black text-[#1A2B33] mt-0.5">
              เมนูโรคกุ้ง 5 โรค
            </h1>
          </div>
        </div>
        <p className="text-xs text-[#1A2B33]/70 font-semibold">
          ภาษาบ้านๆ เข้าใจง่าย สีแดง = อันตรายมาก, สีเหลือง = เฝ้าดู
        </p>
      </div>

      {/* 5 Diseases Cards */}
      <div className="space-y-3">
        {SHRIMP_DISEASES.map((dis, idx) => {
          const isDanger = dis.severity === 'danger';
          const borderColor = isDanger ? 'border-rose-300' : 'border-amber-300';
          const badgeBg = isDanger ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white';

          const stickerKey =
            dis.id === 'softshell' ? 'soft_shell' : (dis.id as keyof typeof STICKER_MAP);
          const stickerSrc = STICKER_MAP[stickerKey]?.src;

          return (
            <div
              key={dis.id}
              className={`shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 ${borderColor} rounded-[24px] shadow-sm`}
            >
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#F2C9A0]/40">
                <div className="flex items-center gap-3">
                  {stickerSrc ? (
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
                      <ChromaSticker src={stickerSrc} size={40} alt={dis.nameThai} />
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 text-sm font-bold shadow-xs ${
                        isDanger ? 'bg-rose-600' : 'bg-amber-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-[#1A2B33]">
                      {dis.nameThai}
                    </h3>
                    <span className="text-[11px] text-[#1A2B33]/60 font-medium">
                      ช่วงอายุ: {dis.dangerPeriod}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${badgeBg}`}>
                  {dis.severityText}
                </span>
              </div>

              {/* Symptom summary */}
              <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F2C9A0]/50 text-xs text-[#1A2B33] mb-3 leading-relaxed">
                <span className="font-bold text-[#FF7A1A] block text-[11px]">อาการหลัก:</span>
                {dis.symptoms[0]} • {dis.symptoms[1]}
              </div>

              {/* 3 Working Buttons: ดูอาการ / วิธีแก้เบื้องต้น / โทรหาหมอ */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenInspect(dis, 'symptoms')}
                  className="h-11 bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33] font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF7A1A]" />
                  <span>ดูอาการ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenInspect(dis, 'remedy')}
                  className="h-11 bg-[#FFF4EA] hover:bg-[#FFE9D6] border border-[#FF7A1A] text-[#FF7A1A] font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>วิธีแก้</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenDoctor}
                  className="h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>โทรหาหมอ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* INSPECT MODAL */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[420px] p-5 sm:p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button
              onClick={() => setInspectModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <ShieldAlert className={`w-8 h-8 ${inspectModal.disease.severity === 'danger' ? 'text-rose-600' : 'text-amber-500'}`} />
              <div>
                <span className="text-[10px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
                  {inspectModal.type === 'symptoms' ? 'ลักษณะอาการ' : 'วิธีแก้เบื้องต้น'}
                </span>
                <h3 className="text-xl font-black text-[#1A2B33] mt-0.5">
                  {inspectModal.disease.nameThai}
                </h3>
              </div>
            </div>

            <div className="space-y-2 mb-5 max-h-56 overflow-y-auto pr-1">
              {(inspectModal.type === 'symptoms'
                ? inspectModal.disease.symptoms
                : inspectModal.disease.remedy
              ).map((line, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl flex items-start gap-2 text-xs leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-[#FF7A1A] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#1A2B33] font-medium">{line}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInspectModal(null)}
                className="h-12 w-1/3 bg-white border border-[#F2C9A0] font-bold text-xs rounded-xl"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectModal(null);
                  onOpenDoctor();
                }}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>โทรหาหมอกุ้งทันที</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY BIG ORANGE "กลับหน้าหลัก" BUTTON */}
      <div className="pt-2">
        <button
          onClick={onBackToHome}
          className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xl font-black rounded-2xl shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <ShrimpSticker size="sm" />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>
    </div>
  );
};
