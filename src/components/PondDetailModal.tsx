import React from 'react';
import { Pond } from '../types';
import { SHRIMP_BREEDS } from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeImage, getSafeStickerSrc, handleImageError, FALLBACK_SHRIMP_IMG } from '../utils/imageFallback';
import {
  X,
  Droplets,
  Utensils,
  AlertTriangle,
  Wind,
  CheckCircle2,
  Calendar,
  Weight,
  Layers,
} from 'lucide-react';
import { playAudioBeep } from '../utils/audio';

interface PondDetailModalProps {
  pond: Pond | null;
  onClose: () => void;
  onOpenWater: (pondId: string) => void;
  onOpenFeeding: (pondId: string) => void;
  onToggleAerator: (pondId: string) => void;
}

export const PondDetailModal: React.FC<PondDetailModalProps> = ({
  pond,
  onClose,
  onOpenWater,
  onOpenFeeding,
  onToggleAerator,
}) => {
  if (!pond) return null;

  const isGood = pond.waterStatus === 'good';
  const isWarning = pond.waterStatus === 'warning';
  const isDanger = pond.waterStatus === 'danger';

  const badgeBg = isGood
    ? 'bg-emerald-600 text-white'
    : isWarning
    ? 'bg-amber-500 text-white'
    : 'bg-rose-600 text-white';

  const breedData = SHRIMP_BREEDS.find((b) => b.id === pond.breedId) || SHRIMP_BREEDS[0];
  const breedImgSrc =
    pond.breedImg ||
    breedData?.realImg ||
    '/src/assets/images/real_shrimp_vannamei_1794481099500.jpg';

  // Salinity suitability check
  const isSalinityOk =
    pond.salinity >= breedData.optimalSalinityMin &&
    pond.salinity <= breedData.optimalSalinityMax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="shrimp-card w-full max-w-[460px] max-h-[92vh] overflow-y-auto p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Pond Badge and Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0">
            <ChromaSticker src={getSafeStickerSrc(STICKER_MAP?.pond?.src)} size={48} alt="บ่อ" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                {pond.waterStatusText} ({pond.conditionText})
              </span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                {pond.pondType}
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#1A2B33] mt-0.5">{pond.name}</h3>
          </div>
        </div>

        {/* Breed Passport Card with Real Shrimp Photo */}
        <div className="p-3 bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6] border border-[#F2C9A0] rounded-2xl flex items-center gap-3 mb-4">
          <img
            src={getSafeImage(breedImgSrc, FALLBACK_SHRIMP_IMG)}
            alt={pond.breed}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_SHRIMP_IMG)}
            className="w-16 h-16 rounded-xl object-cover border border-[#F2C9A0]"
          />
          <div className="flex-1 text-xs space-y-0.5">
            <span className="font-black text-sm text-[#FF7A1A] block">{pond.breed}</span>
            <p className="text-gray-700">
              ขนาด <strong>{pond.areaRai} ไร่</strong> • ลง <strong>{pond.stockedCount.toLocaleString()} ตัว</strong>
            </p>
            <p className="text-gray-600 text-[11px]">
              วันที่ลง: {pond.stockingDate} (อายุ {pond.ageDays} วัน)
            </p>
          </div>
        </div>

        {/* Dynamic Salinity Warning Banner if Not Optimal */}
        {!isSalinityOk && (
          <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 mb-3 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>ความเค็มปัจจุบันไม่เหมาะกับ {pond.breed}!</span>
            </div>
            <p>
              ปัจจุบันวัดได้ <strong>{pond.salinity} ppt</strong> แต่เกณฑ์ที่เหมาะสมคือ{' '}
              <strong>{breedData.optimalSalinityMin} - {breedData.optimalSalinityMax} ppt</strong>
            </p>
          </div>
        )}

        {/* Complete 7 Water Parameters with Values and Colors */}
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-black text-[#1A2B33] flex items-center justify-between">
            <span>ค่าน้ำที่มีผลต่อการเลี้ยง (7 ค่าหลัก)</span>
            <button
              onClick={() => {
                onClose();
                onOpenWater(pond.id);
              }}
              className="text-[#FF7A1A] hover:underline"
            >
              แก้ไขค่าน้ำ
            </button>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">pH (กรด-ด่าง)</span>
                <span className="font-black text-[#1A2B33]">{pond.ph}</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.ph >= 7.5 && pond.ph <= 8.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {pond.ph >= 7.5 && pond.ph <= 8.5 ? 'ดี (7.5-8.5)' : 'ผิดเกณฑ์'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">DO (ออกซิเจน)</span>
                <span className="font-black text-[#1A2B33]">{pond.dissolvedOxygen} mg/L</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.dissolvedOxygen >= 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {pond.dissolvedOxygen >= 5 ? 'ดี (>5)' : 'ต่ำอันตราย'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">แอมโมเนีย (NH3)</span>
                <span className="font-black text-[#1A2B33]">{pond.ammonia} ppm</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.ammonia < 0.1 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {pond.ammonia < 0.1 ? 'ดี (<0.1)' : 'สูงอันตราย'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">ไนไตรท์ (NO2)</span>
                <span className="font-black text-[#1A2B33]">{pond.nitrite} ppm</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.nitrite < 0.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {pond.nitrite < 0.5 ? 'ดี (<0.5)' : 'สูงอันตราย'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">อัลคาไลน์นิตี้</span>
                <span className="font-black text-[#1A2B33]">{pond.alkalinity} ppm</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.alkalinity >= 100 && pond.alkalinity <= 150 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {pond.alkalinity >= 100 && pond.alkalinity <= 150 ? 'ดี (100-150)' : 'เฝ้าดู'}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 block">ความเค็ม (Salinity)</span>
                <span className="font-black text-[#1A2B33]">{pond.salinity} ppt</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSalinityOk ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {isSalinityOk ? 'ดีตามพันธุ์' : 'ไม่เหมาะ'}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] text-gray-500 block">อุณหภูมิน้ำ</span>
              <span className="font-black text-[#1A2B33]">{pond.temperature} °C</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pond.temperature >= 28 && pond.temperature <= 32 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {pond.temperature >= 28 && pond.temperature <= 32 ? 'ดี (28-32 °C)' : 'เฝ้าดู'}
            </span>
          </div>
        </div>

        {/* Aerator Status and Control */}
        <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl flex items-center justify-between mb-4">
          <div>
            <span className="font-bold text-xs text-[#1A2B33] block">
              กังหันใบพัดตีน้ำ: {pond.aeratorRunning ? 'กำลังทำงาน' : 'ปิดอยู่'}
            </span>
            <span className="text-[11px] text-gray-500">
              {pond.aeratorRunning ? 'เติมออกซิเจนก้นบ่อตลอดเวลา' : 'กดเพื่อเปิดเติมออกซิเจน'}
            </span>
          </div>
          <button
            onClick={() => {
              playAudioBeep(620, 'sine', 0.2);
              onToggleAerator(pond.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pond.aeratorRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {pond.aeratorRunning ? 'ปิดใบพัด' : 'เปิดใบพัด'}
          </button>
        </div>

        {/* Quick Buttons: วัดน้ำ / ให้อาหาร */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenWater(pond.id);
            }}
            className="h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <Droplets className="w-4 h-4" />
            <span>บันทึกค่าน้ำ</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenFeeding(pond.id);
            }}
            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-4 h-4" />
            <span>บันทึกอาหาร</span>
          </button>
        </div>
      </div>
    </div>
  );
};
