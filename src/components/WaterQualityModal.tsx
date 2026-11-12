import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  X,
  Droplets,
  Thermometer,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Pond, WaterStatus } from '../types';
import { SHRIMP_BREEDS } from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface WaterQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  ponds: Pond[];
  onSave: (
    pondId: string,
    status: WaterStatus,
    note: string,
    params?: {
      ph: number;
      dissolvedOxygen: number;
      ammonia: number;
      nitrite: number;
      alkalinity: number;
      salinity: number;
      temperature: number;
    }
  ) => void;
  initialPondId?: string;
}

export const WaterQualityModal: React.FC<WaterQualityModalProps> = ({
  isOpen,
  onClose,
  ponds,
  onSave,
  initialPondId,
}) => {
  const [selectedPondId, setSelectedPondId] = useState(
    initialPondId || ponds[0]?.id || 'A1'
  );

  const currentPond = ponds.find((p) => p.id === selectedPondId) || ponds[0];
  const currentBreed = SHRIMP_BREEDS.find((b) => b.id === currentPond?.breedId) || SHRIMP_BREEDS[0];

  // Water parameters state
  const [ph, setPh] = useState(currentPond?.ph || 7.9);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(currentPond?.dissolvedOxygen || 6.0);
  const [ammonia, setAmmonia] = useState(currentPond?.ammonia || 0.04);
  const [nitrite, setNitrite] = useState(currentPond?.nitrite || 0.15);
  const [alkalinity, setAlkalinity] = useState(currentPond?.alkalinity || 125);
  const [salinity, setSalinity] = useState(currentPond?.salinity || 15);
  const [temperature, setTemperature] = useState(currentPond?.temperature || 29.5);
  const [note, setNote] = useState('');

  // Update form when selected pond changes
  useEffect(() => {
    if (currentPond) {
      setPh(currentPond.ph);
      setDissolvedOxygen(currentPond.dissolvedOxygen);
      setAmmonia(currentPond.ammonia);
      setNitrite(currentPond.nitrite);
      setAlkalinity(currentPond.alkalinity);
      setSalinity(currentPond.salinity);
      setTemperature(currentPond.temperature);
      setNote(currentPond.warningNote || '');
    }
  }, [selectedPondId, currentPond]);

  if (!isOpen) return null;

  // Evaluation criteria
  const isPhGood = ph >= 7.5 && ph <= 8.5;
  const isPhWarn = (ph >= 7.2 && ph < 7.5) || (ph > 8.5 && ph <= 8.8);

  const isDoGood = dissolvedOxygen >= 5.0;
  const isDoWarn = dissolvedOxygen >= 4.0 && dissolvedOxygen < 5.0;

  const isNh3Good = ammonia < 0.1;
  const isNh3Warn = ammonia >= 0.1 && ammonia <= 0.25;

  const isNo2Good = nitrite < 0.5;
  const isNo2Warn = nitrite >= 0.5 && nitrite <= 0.8;

  const isAlkGood = alkalinity >= 100 && alkalinity <= 150;
  const isAlkWarn = (alkalinity >= 80 && alkalinity < 100) || (alkalinity > 150 && alkalinity <= 170);

  // Breed-specific salinity check!
  const isSalGood =
    salinity >= currentBreed.optimalSalinityMin &&
    salinity <= currentBreed.optimalSalinityMax;
  const isSalWarn =
    (salinity >= currentBreed.optimalSalinityMin - 3 && salinity < currentBreed.optimalSalinityMin) ||
    (salinity > currentBreed.optimalSalinityMax && salinity <= currentBreed.optimalSalinityMax + 4);

  const isTempGood = temperature >= 28 && temperature <= 32;
  const isTempWarn = (temperature >= 26 && temperature < 28) || (temperature > 32 && temperature <= 34);

  // Auto calculate overall status
  const hasDanger =
    !isPhGood && !isPhWarn ||
    dissolvedOxygen < 4.0 ||
    ammonia > 0.25 ||
    nitrite > 0.8 ||
    alkalinity < 80 ||
    !isSalGood && !isSalWarn ||
    temperature < 26 || temperature > 34;

  const hasWarning =
    !hasDanger &&
    (isPhWarn || isDoWarn || isNh3Warn || isNo2Warn || isAlkWarn || isSalWarn || isTempWarn);

  const calculatedStatus: WaterStatus = hasDanger ? 'danger' : hasWarning ? 'warning' : 'good';

  const handleSave = () => {
    playAudioBeep(640, 'sine', 0.2);
    onSave(selectedPondId, calculatedStatus, note, {
      ph: Number(ph),
      dissolvedOxygen: Number(dissolvedOxygen),
      ammonia: Number(ammonia),
      nitrite: Number(nitrite),
      alkalinity: Number(alkalinity),
      salinity: Number(salinity),
      temperature: Number(temperature),
    });
    onClose();
  };

  const getStatusBadge = (isGood: boolean, isWarn: boolean) => {
    if (isGood) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          🟢 น้ำดี
        </span>
      );
    }
    if (isWarn) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          🟡 เฝ้าดู
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
        🔴 อันตราย
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="shrimp-card w-full max-w-[460px] p-5 max-h-[92vh] overflow-y-auto bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0">
            <ChromaSticker src={STICKER_MAP.water.src} size={40} alt="วัดน้ำ" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
              ตรวจค่าน้ำครบ 7 ค่าหลัก
            </span>
            <h3 className="text-xl font-black text-[#1A2B33]">
              วัดน้ำ / บันทึกคุณภาพน้ำ
            </h3>
          </div>
        </div>

        {/* Pond Selector */}
        <div className="mb-3">
          <label className="text-xs font-bold text-[#1A2B33] block mb-1">
            เลือกบ่อที่ต้องการบันทึก:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {ponds.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPondId(p.id)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors ${
                  selectedPondId === p.id
                    ? 'bg-[#FF7A1A] text-white border-[#FF7A1A]'
                    : 'bg-white border-[#F2C9A0] text-[#1A2B33]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Pond Breed Notice */}
        <div className="p-3 bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6] border border-[#F2C9A0] rounded-xl flex items-center justify-between text-xs mb-3">
          <div>
            <span className="font-bold text-[#1A2B33] block">
              {currentPond.name} ({currentPond.pondType})
            </span>
            <span className="text-[#FF7A1A] font-bold">
              พันธุ์: {currentPond.breed} ({currentBreed.waterEnv})
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-gray-700 bg-white/80 px-2 py-1 rounded-lg">
            ความเค็มเหมาะสม: {currentBreed.optimalSalinityMin}-{currentBreed.optimalSalinityMax} ppt
          </span>
        </div>

        {/* Dynamic Breed Salinity Warning */}
        {(!isSalGood || !isSalWarn) && (
          <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 mb-3 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>ค่าความเค็มไม่เหมาะกับพันธุ์นี้!</span>
            </div>
            <p className="leading-relaxed">
              บ่อนี้เลี้ยง <strong>{currentPond.breed}</strong> ซึ่งต้องการความเค็มช่วง{' '}
              <strong>{currentBreed.optimalSalinityMin} - {currentBreed.optimalSalinityMax} ppt</strong>{' '}
              แต่ขณะนี้วัดได้ <strong>{salinity} ppt</strong> อาจทำให้กุ้งช็อก ลอกคราบไม่ออก หรือโตช้า
            </p>
            <p className="font-bold text-rose-800">
              💡 คำแนะนำ: {salinity < currentBreed.optimalSalinityMin ? 'เติมเกลือหรือน้ำเค็มเข้มข้นอย่างระมัดระวัง' : 'ถ่ายน้ำจืดสะอาดเข้าบ่อเพื่อเจือจางความเค็มทีละน้อย'}
            </p>
          </div>
        )}

        {/* 7 Water Parameters Inputs with Color Bars */}
        <div className="space-y-2.5 text-xs">
          {/* 1. pH */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                1. pH (กรด-ด่าง) <span className="text-gray-400 font-normal">ค่าดี 7.5 - 8.5</span>
              </span>
              {getStatusBadge(isPhGood, isPhWarn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isPhGood ? 'bg-emerald-500 w-3/4' : isPhWarn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 2. DO (ออกซิเจน) */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                2. DO (ออกซิเจนละลายน้ำ) <span className="text-gray-400 font-normal">ค่าดี มากกว่า 5 mg/L</span>
              </span>
              {getStatusBadge(isDoGood, isDoWarn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={dissolvedOxygen}
                onChange={(e) => setDissolvedOxygen(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isDoGood ? 'bg-emerald-500 w-4/5' : isDoWarn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. แอมโมเนีย (NH3) */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                3. แอมโมเนีย (NH3) <span className="text-gray-400 font-normal">ค่าดี น้อยกว่า 0.1 ppm</span>
              </span>
              {getStatusBadge(isNh3Good, isNh3Warn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                value={ammonia}
                onChange={(e) => setAmmonia(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isNh3Good ? 'bg-emerald-500 w-1/4' : isNh3Warn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-4/5'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4. ไนไตรท์ (NO2) */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                4. ไนไตรท์ (NO2) <span className="text-gray-400 font-normal">ค่าดี น้อยกว่า 0.5 ppm</span>
              </span>
              {getStatusBadge(isNo2Good, isNo2Warn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.05"
                value={nitrite}
                onChange={(e) => setNitrite(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isNo2Good ? 'bg-emerald-500 w-1/4' : isNo2Warn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-4/5'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 5. อัลคาไลน์นิตี้ */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                5. อัลคาไลน์นิตี้ <span className="text-gray-400 font-normal">ค่าดี 100 - 150 ppm</span>
              </span>
              {getStatusBadge(isAlkGood, isAlkWarn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={alkalinity}
                onChange={(e) => setAlkalinity(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isAlkGood ? 'bg-emerald-500 w-3/4' : isAlkWarn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 6. ความเค็ม (Salinity) */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                6. ความเค็ม (Salinity){' '}
                <span className="text-gray-400 font-normal">
                  เกณฑ์ {currentPond.breed}: {currentBreed.optimalSalinityMin}-{currentBreed.optimalSalinityMax} ppt
                </span>
              </span>
              {getStatusBadge(isSalGood, isSalWarn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={salinity}
                onChange={(e) => setSalinity(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isSalGood ? 'bg-emerald-500 w-3/4' : isSalWarn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 7. อุณหภูมิน้ำ */}
          <div className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#1A2B33]">
                7. อุณหภูมิน้ำ <span className="text-gray-400 font-normal">ค่าดี 28 - 32 °C</span>
              </span>
              {getStatusBadge(isTempGood, isTempWarn)}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-20 h-9 px-2 bg-[#FFFDF9] border border-[#F2C9A0] rounded-lg font-bold text-center text-sm"
              />
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isTempGood ? 'bg-emerald-500 w-3/4' : isTempWarn ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Note / Advice */}
        <div className="mt-3">
          <label className="text-xs font-bold text-[#1A2B33] block mb-1">
            บันทึกข้อความ / อาการสังเกต:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น เปิดใบพัดเพิ่ม 2 ตัว กุ้งเริ่มว่ายปกติ..."
            className="w-full h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs font-medium"
          />
        </div>

        {/* Summary Status Result */}
        <div className="mt-3.5 p-3 rounded-xl border flex items-center justify-between text-xs bg-slate-50">
          <span className="font-bold text-gray-700">สถานะน้ำโดยรวมที่คำนวณได้:</span>
          <span
            className={`font-black px-3 py-1 rounded-full ${
              calculatedStatus === 'good'
                ? 'bg-emerald-100 text-emerald-800'
                : calculatedStatus === 'warning'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-rose-100 text-rose-900'
            }`}
          >
            {calculatedStatus === 'good'
              ? '🟢 น้ำดี (สบายใจ)'
              : calculatedStatus === 'warning'
              ? '🟡 น้ำเริ่มแย่ (ต้องดู)'
              : '🔴 น้ำอันตราย (รีบไปดู)'}
          </span>
        </div>

        {/* Save Button */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 h-13 bg-white border border-[#F2C9A0] font-bold text-xs rounded-xl"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-13 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-xl shadow-md"
          >
            บันทึกค่าน้ำบ่อ {currentPond.name}
          </button>
        </div>
      </div>
    </div>
  );
};
