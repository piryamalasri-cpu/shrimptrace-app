import React, { useState } from 'react';
import { SHRIMP_BREEDS } from '../data/initialData';
import { Pond, ShrimpBreed } from '../types';
import { Check, Info, X, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeImage, getSafeStickerSrc, handleImageError, FALLBACK_SHRIMP_IMG } from '../utils/imageFallback';
import { playAudioBeep } from '../utils/audio';

interface BreedsViewProps {
  onBackToHome: () => void;
  onSelectBreed: (breed: ShrimpBreed, targetPondId?: string) => void;
  ponds?: Pond[];
}

export const BreedsView: React.FC<BreedsViewProps> = ({
  onBackToHome,
  onSelectBreed,
  ponds = [],
}) => {
  const [selectedBreed, setSelectedBreed] = useState<ShrimpBreed | null>(null);
  const [assigningBreed, setAssigningBreed] = useState<ShrimpBreed | null>(null);
  const [chosenPondId, setChosenPondId] = useState<string>(ponds[0]?.id || 'A1');

  const handleChoosePond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBreed) return;
    playAudioBeep(640, 'triangle', 0.2);
    onSelectBreed(assigningBreed, chosenPondId);
    setAssigningBreed(null);
  };

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="shrimp-card p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={getSafeStickerSrc(STICKER_MAP?.logo?.src)} size={48} alt="พันธุ์กุ้ง" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              สายพันธุ์กุ้งเศรษฐกิจไทย (ภาพถ่ายกุ้งจริง)
            </span>
            <h1 className="text-2xl font-black text-[#1A2B33] mt-0.5">
              เมนูพันธุ์กุ้ง 4 พันธุ์
            </h1>
          </div>
        </div>
        <p className="text-xs text-[#1A2B33]/70 font-semibold">
          ภาพถ่ายกุ้งจริง 100% ดูลักษณะเด่น ระยะเวลาเลี้ยง และราคารับซื้อ
        </p>
      </div>

      {/* 4 Breeds List with Big Real Shrimp Photo on Each Card */}
      <div className="space-y-4">
        {(SHRIMP_BREEDS || []).map((breed) => {
          const safeImg = getSafeImage(breed?.realImg, FALLBACK_SHRIMP_IMG);
          return (
            <div
              key={breed.id}
              className="shrimp-card bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Big Real Shrimp Photo */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={safeImg}
                  alt={breed.nameThai}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_SHRIMP_IMG)}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#F2C9A0] text-xs font-black text-[#FF7A1A]">
                {breed.waterEnv}
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-xl font-black">{breed.nameThai}</h3>
                <span className="text-xs text-white/90 font-mono">({breed.nameEng})</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-[#1A2B33]/80 leading-relaxed">
                <strong>ลักษณะเด่น:</strong> {breed.appearance}
              </p>

              {/* Price and days */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F2C9A0]/60">
                  <span className="text-gray-500 block text-[10px]">ระยะเวลาเลี้ยง</span>
                  <span className="font-bold text-sm text-[#1A2B33]">
                    {breed.daysToHarvest}
                  </span>
                </div>
                <div className="bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F2C9A0]/60">
                  <span className="text-gray-500 block text-[10px]">ราคาเฉลี่ย / กก.</span>
                  <span className="font-bold text-sm text-emerald-700">
                    {breed.avgPrice}
                  </span>
                </div>
              </div>

              {/* Action Buttons: รายละเอียด & เลี้ยงพันธุ์นี้ */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playAudioBeep(520, 'sine', 0.1);
                    setSelectedBreed(breed);
                  }}
                  className="h-13 w-1/3 bg-white border-2 border-[#F2C9A0] text-[#1A2B33] font-bold text-xs rounded-xl hover:bg-[#FFF4EA] transition-colors"
                >
                  รายละเอียด
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playAudioBeep(640, 'triangle', 0.15);
                    setAssigningBreed(breed);
                  }}
                  className="flex-1 h-13 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-xl shadow-md shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>เลี้ยงพันธุ์นี้</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: เลือกบ่อที่จะเลี้ยงพันธุ์นี้ */}
      {assigningBreed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-[28px] max-w-[420px] w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setAssigningBreed(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#1A2B33] mb-1">
              เลือกบ่อเลี้ยง: {assigningBreed.nameThai}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              ความเค็มที่เหมาะสม: {assigningBreed.optimalSalinityMin} -{' '}
              {assigningBreed.optimalSalinityMax} ppt ({assigningBreed.waterEnv})
            </p>

            <form onSubmit={handleChoosePond} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1A2B33] block mb-2">
                  เลือกว่าจะลงพันธุ์นี้ที่บ่อไหน:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {ponds.map((p) => (
                    <label
                      key={p.id}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                        chosenPondId === p.id
                          ? 'border-[#FF7A1A] bg-[#FFF4EA]'
                          : 'border-[#F2C9A0] bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-black text-sm text-[#1A2B33]">
                          {p.name} ({p.pondType})
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          ปัจจุบัน: {p.breed} • เค็ม {p.salinity} ppt
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="targetPond"
                        checked={chosenPondId === p.id}
                        onChange={() => setChosenPondId(p.id)}
                        className="w-4 h-4 text-[#FF7A1A]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningBreed(null)}
                  className="w-1/3 h-12 bg-white border border-[#F2C9A0] font-bold text-xs rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  ยืนยันลงกุ้งบ่อนี้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBreed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] max-w-[440px] w-full p-5 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedBreed(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={getSafeImage(selectedBreed.realImg, FALLBACK_SHRIMP_IMG)}
              alt={selectedBreed.nameThai}
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, FALLBACK_SHRIMP_IMG)}
              className="w-full h-44 rounded-2xl object-cover border border-[#F2C9A0] mb-3"
            />

            <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              {selectedBreed.waterEnv}
            </span>
            <h3 className="text-2xl font-black text-[#1A2B33] mt-1">
              {selectedBreed.nameThai}
            </h3>
            <span className="text-xs font-mono text-gray-500">
              {selectedBreed.nameEng}
            </span>

            <div className="my-3 p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1.5 leading-relaxed">
              <p>
                <strong>จุดเด่น:</strong> {selectedBreed.highlights}
              </p>
              <p>{selectedBreed.description}</p>
              <p>
                <strong>ความเค็มที่เหมาะสม:</strong> {selectedBreed.optimalSalinityMin} -{' '}
                {selectedBreed.optimalSalinityMax} ppt
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedBreed(null)}
                className="w-1/3 h-12 bg-white border border-[#F2C9A0] font-bold text-xs rounded-xl"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = selectedBreed;
                  setSelectedBreed(null);
                  setAssigningBreed(b);
                }}
                className="flex-1 h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs rounded-xl shadow-md"
              >
                เลือกเลี้ยงพันธุ์นี้
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
          <ChromaSticker src={getSafeStickerSrc(STICKER_MAP?.logo?.src)} size={28} />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>
    </div>
  );
};
