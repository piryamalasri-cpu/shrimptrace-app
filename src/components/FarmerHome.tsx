import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  AlertTriangle,
  Wind,
  PhoneCall,
  Sparkles,
  Mic,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Pond, RoleId, UserProfile } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeStickerSrc } from '../utils/imageFallback';
import { playAudioBeep, speakThaiText } from '../utils/audio';

interface FarmerHomeProps {
  user: UserProfile;
  ponds: Pond[];
  currentRole: RoleId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectRole: (role: RoleId) => void;
  onOpenFeeding: () => void;
  onOpenWater: () => void;
  onOpenSickReport: () => void;
  onOpenOnboarding: () => void;
  onOpenPondDetail: (pond: Pond) => void;
  onOpenPhoneDirectory: () => void;
  onOpenDoctor: () => void;
  onOpenFactoryCall: () => void;
  onBatchLogYesterday: () => void;
  onToggleAeratorB2: () => void;
  onVoiceSpeechSubmit: (phrase: string) => void;
  onGoToTab: (tab: 'breeds' | 'diseases' | 'prices' | 'ponds') => void;
  onShowToast: (msg: string) => void;
  onOpenStickers: () => void;
  onOpenMyFarmProfile?: () => void;
  onOpenScanReceive?: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({
  user,
  ponds,
  currentRole,
  soundEnabled,
  onToggleSound,
  onSelectRole,
  onOpenFeeding,
  onOpenWater,
  onOpenSickReport,
  onOpenOnboarding,
  onOpenPondDetail,
  onOpenPhoneDirectory,
  onOpenDoctor,
  onOpenFactoryCall,
  onBatchLogYesterday,
  onToggleAeratorB2,
  onVoiceSpeechSubmit,
  onGoToTab,
  onShowToast,
  onOpenStickers,
  onOpenMyFarmProfile,
  onOpenScanReceive,
}) => {
  const [speechInput, setSpeechInput] = useState('บ่อ A3 ให้อาหาร 2 โล กินหมด');
  const [isListeningMic, setIsListeningMic] = useState(false);

  // Requirement 4: If farm/pond data is not ready, show loading card first, do not render images
  if (!user || !ponds || (ponds || []).length === 0) {
    return (
      <div className="shrimp-card p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm text-center max-w-[480px] mx-auto my-6 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF7A1A] border-t-transparent animate-spin mx-auto mb-3" />
        <h4 className="text-base font-black text-[#1A2B33]">กำลังโหลดข้อมูลฟาร์มกุ้ง...</h4>
        <p className="text-xs text-[#1A2B33]/60 mt-1">กรุณารอสักครู่ ระบบกำลังจัดเตรียมข้อมูลบ่อ</p>
      </div>
    );
  }

  const handleHearWarning = () => {
    speakThaiText('วันนี้บ่อ B2 น้ำไม่ดี อย่าลืมไปดู');
  };

  const handleMicClick = () => {
    setIsListeningMic(true);
    playAudioBeep(640, 'sine', 0.2);
    setSpeechInput('กำลังฟังเสียง...');

    setTimeout(() => {
      setSpeechInput('บ่อ A3 ให้อาหาร 2 โล กินหมด');
      setIsListeningMic(false);
      playAudioBeep(880, 'triangle', 0.2);
    }, 1400);
  };

  const handleParseAndSave = () => {
    playAudioBeep(720, 'sine', 0.2);
    onVoiceSpeechSubmit(speechInput);
  };

  const safePonds = ponds || [];
  const pondB2 = safePonds.find((p) => p?.id === 'B2') || safePonds[3] || safePonds[0] || {
    id: 'B2',
    name: 'บ่อ B2',
    aeratorRunning: false,
    waterStatus: 'warning',
    waterStatusText: 'น้ำเริ่มแย่',
    conditionText: 'ต้องดู',
  };

  // Safe sticker sources
  const logoSticker = getSafeStickerSrc(STICKER_MAP?.logo?.src);
  const pondSticker = getSafeStickerSrc(STICKER_MAP?.pond?.src);
  const alertSticker = getSafeStickerSrc(STICKER_MAP?.alert?.src);
  const feedSticker = getSafeStickerSrc(STICKER_MAP?.feed?.src);
  const waterSticker = getSafeStickerSrc(STICKER_MAP?.water?.src);
  const sickSticker = getSafeStickerSrc(STICKER_MAP?.sick?.src);

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* 1. ส่วนหัวการ์ดใหญ่โค้งด้านบน */}
      <div className="shrimp-card p-4 sm:p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShrimpSticker size="sm" withBadge />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A1A]">
                <span>แอปกุ้ง • ใช้ง่าย</span>
                <span>•</span>
                <span className="text-[#1A2B33]/60 font-semibold">วันนี้ • 12 ก.พ. 2026</span>
              </div>
              <h2 className="text-xl font-black text-[#1A2B33]">แอปกุ้งของฉัน</h2>
            </div>
          </div>

          {/* ปุ่ม "เสียงเปิด" ด้านขวา */}
          <button
            onClick={onToggleSound}
            className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
              soundEnabled
                ? 'bg-white border-[#F2C9A0] text-[#FF7A1A]'
                : 'bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF7A1A]" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'เสียงเปิด' : 'เสียงปิด'}</span>
          </button>
        </div>

        {/* แถบสลับบทบาท 3 ปุ่มด้านใน */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FFF4EA] rounded-2xl border border-[#F2C9A0]">
          {[
            { id: 'hatchery' as RoleId, label: 'โรงเพาะฟัก', sub: 'ลูกกุ้ง' },
            { id: 'owner' as RoleId, label: 'คนเลี้ยง', sub: 'เลี้ยงกุ้ง' },
            { id: 'customer' as RoleId, label: 'ลูกค้า', sub: 'ตลาด & ซื้อ' },
          ].map((role) => {
            const isSelected = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  playAudioBeep(560, 'sine', 0.1);
                  onSelectRole(role.id);
                }}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-white text-[#FF7A1A] font-black shadow-sm border border-[#F2C9A0]'
                    : 'bg-[#FFF4EA] text-[#1A2B33]/80 font-bold hover:bg-[#FFE9D6]'
                }`}
              >
                <span className="block text-xs sm:text-sm leading-tight">{role.label}</span>
                <span className="text-[10px] text-[#1A2B33]/60 leading-none">{role.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action: โปรไฟล์ฟาร์มของฉัน & สแกนรับลูกกุ้ง */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenMyFarmProfile}
          className="h-14 p-2.5 bg-[#FFFEFB] hover:bg-[#FFF4EA] border-2 border-[#F2C9A0] rounded-2xl flex items-center gap-2.5 transition-all text-left shadow-xs active:scale-98"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0">
            <ChromaSticker src={pondSticker} size={28} alt="โปรไฟล์ฟาร์ม" />
          </div>
          <div>
            <span className="text-xs font-black text-[#1A2B33] block leading-tight">โปรไฟล์ฟาร์ม</span>
            <span className="text-[10px] text-[#FF7A1A] font-bold">ตั้งราคา / ดูออเดอร์</span>
          </div>
        </button>

        <button
          onClick={onOpenScanReceive}
          className="h-14 p-2.5 bg-[#FFFEFB] hover:bg-[#FFF4EA] border-2 border-[#F2C9A0] rounded-2xl flex items-center gap-2.5 transition-all text-left shadow-xs active:scale-98"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center p-1 shrink-0">
            <ChromaSticker src={logoSticker} size={28} alt="สแกนรับลูกกุ้ง" />
          </div>
          <div>
            <span className="text-xs font-black text-[#1A2B33] block leading-tight">สแกนรับลูกกุ้ง</span>
            <span className="text-[10px] text-emerald-700 font-bold">QR ย้อนกลับหน้าถุง</span>
          </div>
        </button>
      </div>

      {/* 2. การ์ดขาว: คนเลี้ยงกุ้ง / [ชื่อฟาร์ม] • [จังหวัด] + ป้าย "พร้อมใช้" สีเขียว */}
      <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#1A2B33]">
              คนเลี้ยงกุ้ง / {user?.farmName || 'ฟาร์มกุ้ง'} • {user?.province || 'ไทย'}
            </span>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
            พร้อมใช้
          </span>
        </div>

        {/* ปุ่ม 2 ปุ่ม: "สอนใช้งาน" (พื้นส้มอ่อน) / "ฟังเสียงเตือน" (พื้นส้มเข้ม) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onOpenOnboarding}
            className="h-13 bg-[#FFF4EA] hover:bg-[#FFE9D6] border-2 border-[#F2C9A0] text-[#1A2B33] font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-[#FF7A1A]" />
            <span>สอนใช้งาน</span>
          </button>
          <button
            onClick={handleHearWarning}
            className="h-13 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#FF7A1A]/20"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>ฟังเสียงเตือน</span>
          </button>
        </div>

        {/* ปุ่มดูชุดสติกเกอร์ 15 แบบ */}
        <button
          onClick={onOpenStickers}
          className="mt-2.5 w-full py-2.5 px-3 bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6] hover:from-[#FFE9D6] hover:to-[#FFD8B8] border border-[#FF7A1A]/40 rounded-xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <ChromaSticker src={logoSticker} size={26} alt="สติกเกอร์ 15 แบบ" />
            <span className="text-xs font-bold text-[#1A2B33]">
              ชุดสติกเกอร์ 15 ชิ้น สไตล์ 2.5D ขอบขาว
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#FF7A1A] flex items-center gap-0.5">
            ดูทั้งหมด <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* 3. การ์ดเตือนสีแดงอ่อน */}
      <div className="shrimp-card p-4 sm:p-5 bg-rose-50/90 border-2 border-rose-300 rounded-[24px] shadow-xs">
        <div className="flex items-start gap-3 mb-2.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-rose-300 flex items-center justify-center shrink-0 p-1 shadow-xs">
            <ChromaSticker src={alertSticker} size={40} alt="เตือน" />
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-950">
              บ่อ B2 น้ำไม่ดี ให้รีบไปดู
            </h3>
            <p className="text-xs text-rose-900 leading-relaxed mt-0.5">
              น้ำอันตราย • กุ้งอาจไม่สบาย • เปิดใบพัดเพิ่ม แล้วหยุดให้อาหารก่อน
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={onToggleAeratorB2}
            className={`h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              pondB2?.aeratorRunning
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{pondB2?.aeratorRunning ? 'ใบพัด B2 เปิดแล้ว' : 'เปิดใบพัด B2'}</span>
          </button>
          <button
            onClick={handleHearWarning}
            className="h-12 bg-white hover:bg-rose-50 border border-rose-300 text-rose-900 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <Volume2 className="w-4 h-4 text-rose-600" />
            <span>ฟังอีกครั้ง</span>
          </button>
        </div>
      </div>

      {/* 4. หัวข้อ "วันนี้จะทำอะไรดี? กดปุ่มใหญ่ๆ ได้เลย ไม่ต้องพิมพ์" */}
      <div className="space-y-2.5">
        <h3 className="text-base font-black text-[#1A2B33] px-1">
          วันนี้จะทำอะไรดี? กดปุ่มใหญ่ๆ ได้เลย ไม่ต้องพิมพ์
        </h3>

        {/* 3 ปุ่มใหญ่เต็มความกว้าง (Full Width 56-64px) พร้อมสติกเกอร์ 2.5D ขอบขาว */}
        {/* 1. ให้อาหาร (พื้นเขียว) */}
        <button
          onClick={onOpenFeeding}
          className="w-full h-18 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-md shadow-emerald-700/20 active:scale-98 transition-all border-2 border-white/70"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center p-1 shrink-0">
              <ChromaSticker src={feedSticker} size={40} alt="ให้อาหาร" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black block leading-tight">1. ให้อาหาร</span>
              <span className="text-xs text-white/90">ให้อาหารกุ้ง เลือกบ่อ แล้วกดจบ</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 shrink-0" />
        </button>

        {/* 2. วัดน้ำ (พื้นส้มเหลือง) */}
        <button
          onClick={onOpenWater}
          className="w-full h-18 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF7A1A] text-white flex items-center justify-between shadow-md shadow-[#FF7A1A]/20 active:scale-98 transition-all border-2 border-white/70"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center p-1 shrink-0">
              <ChromaSticker src={waterSticker} size={40} alt="วัดน้ำ" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black block leading-tight">2. วัดน้ำ</span>
              <span className="text-xs text-white/90">ดูว่าน้ำดี หรือ น้ำเริ่มแย่</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 shrink-0" />
        </button>

        {/* 3. แจ้งว่ากุ้งป่วย (พื้นแดง) */}
        <button
          onClick={onOpenSickReport}
          className="w-full h-18 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white flex items-center justify-between shadow-md shadow-rose-700/20 active:scale-98 transition-all border-2 border-white/70"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center p-1 shrink-0">
              <ChromaSticker src={sickSticker} size={40} alt="แจ้งว่ากุ้งป่วย" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black block leading-tight">3. แจ้งว่ากุ้งป่วย</span>
              <span className="text-xs text-white/90">กุ้งไม่สบาย กดแจ้งหมอเลย</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 shrink-0" />
        </button>
      </div>

      {/* 5. ส่วน "บ่อของฉัน • 4 บ่อ" + ลิงก์ดูทั้งหมด */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <ChromaSticker src={pondSticker} size={28} alt="บ่อของฉัน" />
            <h3 className="text-base font-black text-[#1A2B33]">บ่อของฉัน • {safePonds.length} บ่อ</h3>
          </div>
          <button
            onClick={() => onGoToTab('ponds')}
            className="text-xs font-bold text-[#FF7A1A] hover:underline flex items-center gap-0.5"
          >
            ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* การ์ด 2 คอลัมน์ กดการ์ดแล้วเปิด modal รายละเอียดบ่อ */}
        <div className="grid grid-cols-2 gap-2.5">
          {(safePonds || []).map((p) => {
            const isGood = p?.waterStatus === 'good';
            const isWarning = p?.waterStatus === 'warning';

            const statusDot = isGood ? '🟢' : isWarning ? '🟡' : '🔴';
            const badgeColor = isGood
              ? 'bg-emerald-100 text-emerald-800'
              : isWarning
              ? 'bg-amber-100 text-amber-900'
              : 'bg-rose-100 text-rose-900';

            return (
              <div
                key={p?.id || Math.random().toString()}
                onClick={() => {
                  playAudioBeep(520, 'sine', 0.1);
                  if (p) onOpenPondDetail(p);
                }}
                className="shrimp-card p-3 sm:p-3.5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-2xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-base text-[#1A2B33]">{p?.name || 'บ่อ'}</span>
                    <span className="text-xs">{statusDot}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${badgeColor}`}>
                      {p?.waterStatusText || 'ปกติ'} / {p?.conditionText || 'ปกติ'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#1A2B33]/80 space-y-0.5">
                    <p>อายุ <strong>{p?.ageDays ?? 0} วัน</strong></p>
                    <p>กุ้งหนัก <strong>{p?.weightGrams ?? 0} กรัม</strong></p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#FF7A1A] mt-2 pt-1 border-t border-[#F2C9A0]/40 flex items-center justify-between">
                  <span>แตะดูรายละเอียด</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* แถบคำอธิบายสี */}
        <div className="p-2.5 bg-[#FFF9F2] rounded-xl border border-[#F2C9A0]/60 flex items-center justify-between text-[11px] font-bold text-[#1A2B33]">
          <span>🟢 น้ำดี = สบายใจ</span>
          <span>🟡 น้ำเริ่มแย่ = ต้องดู</span>
          <span>🔴 น้ำอันตราย = รีบไปดู</span>
        </div>
      </div>

      {/* 6. ส่วน "โทรหาคนช่วย กดแล้วโทรได้เลย ไม่ต้องจำเบอร์" */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <h3 className="text-sm font-black text-[#1A2B33] mb-2.5">
          โทรหาคนช่วย กดแล้วโทรได้เลย ไม่ต้องจำเบอร์
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* ปุ่ม โทรหาหมอ 081-234-5678 (เขียว) */}
          <button
            onClick={onOpenDoctor}
            className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex flex-col items-center justify-center shadow-xs transition-all active:scale-95"
          >
            <span className="flex items-center gap-1 font-black">
              <PhoneCall className="w-3.5 h-3.5" /> โทรหาหมอ
            </span>
            <span className="text-[10px] font-mono text-white/90">081-234-5678</span>
          </button>

          {/* ปุ่ม โทรหาโรงงาน 02-345-6789 (ส้ม) */}
          <button
            onClick={onOpenFactoryCall}
            className="h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs sm:text-sm rounded-2xl flex flex-col items-center justify-center shadow-xs transition-all active:scale-95"
          >
            <span className="flex items-center gap-1 font-black">
              <PhoneCall className="w-3.5 h-3.5" /> โทรหาโรงงาน
            </span>
            <span className="text-[10px] font-mono text-white/90">02-345-6789</span>
          </button>
        </div>

        {/* ปุ่ม "ดูเบอร์ทั้งหมด" เปิด modal */}
        <button
          onClick={onOpenPhoneDirectory}
          className="w-full h-10 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold text-xs rounded-xl hover:bg-[#FFF4EA] transition-colors"
        >
          ดูเบอร์ทั้งหมด (สัตวแพทย์ / กรมประมง / รถห้องเย็น)
        </button>
      </div>

      {/* 7. การ์ดเล็ก 3 ใบ: พันธุ์กุ้ง เลือกพันธุ์ / โรคกุ้ง ดูอาการ / ราคากุ้ง วันนี้ • 190 บาท */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onGoToTab('breeds')}
          className="p-2.5 bg-[#FFFDF9] hover:bg-[#FFF4EA] border border-[#F2C9A0] rounded-2xl text-center transition-all shadow-xs"
        >
          <span className="text-lg block mb-0.5">🦐</span>
          <span className="text-xs font-black text-[#1A2B33] block">พันธุ์กุ้ง</span>
          <span className="text-[10px] text-[#FF7A1A] font-bold">เลือกพันธุ์</span>
        </button>

        <button
          onClick={() => onGoToTab('diseases')}
          className="p-2.5 bg-[#FFFDF9] hover:bg-[#FFF4EA] border border-[#F2C9A0] rounded-2xl text-center transition-all shadow-xs"
        >
          <span className="text-lg block mb-0.5">🩺</span>
          <span className="text-xs font-black text-[#1A2B33] block">โรคกุ้ง</span>
          <span className="text-[10px] text-rose-600 font-bold">ดูอาการ</span>
        </button>

        <button
          onClick={() => onGoToTab('prices')}
          className="p-2.5 bg-[#FFFDF9] hover:bg-[#FFF4EA] border border-[#F2C9A0] rounded-2xl text-center transition-all shadow-xs"
        >
          <span className="text-lg block mb-0.5">💰</span>
          <span className="text-xs font-black text-[#1A2B33] block">ราคากุ้ง</span>
          <span className="text-[10px] text-emerald-700 font-bold">วันนี้ • 190 บาท</span>
        </button>
      </div>

      {/* 8. ปุ่มใหญ่ "✦ ใช้เหมือนเมื่อวาน" + ข้อความใต้ปุ่ม */}
      <div className="p-4 bg-gradient-to-r from-[#FFF4EA] via-[#FFEEDF] to-[#FFF4EA] border-2 border-[#FF7A1A] rounded-[24px] shadow-sm text-center">
        <button
          onClick={onBatchLogYesterday}
          className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xl font-black rounded-2xl shadow-lg shadow-[#FF7A1A]/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-6 h-6" />
          <span>✦ ใช้เหมือนเมื่อวาน</span>
        </button>
        <p className="text-xs font-bold text-[#1A2B33] mt-2">
          ปุ่มนี้ใหญ่ที่สุด กดครั้งเดียวจบ ไม่ต้องกรอกทุกบ่อ
        </p>
      </div>

      {/* 9. ส่วน "พูดแทนพิมพ์ กดไมค์ แล้วพูดว่า “บ่อ A3 ให้อาหาร 2 โล กินหมด”" */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <h3 className="text-sm font-black text-[#1A2B33] mb-1">
          พูดแทนพิมพ์ กดไมค์ แล้วพูดว่า “บ่อ A3 ให้อาหาร 2 โล กินหมด”
        </h3>
        <p className="text-[11px] text-[#1A2B33]/60 mb-2.5">
          เหมาะกับคนมือเปียก ไม่ต้องพิมพ์
        </p>

        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleMicClick}
              className={`h-12 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0 ${
                isListeningMic
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-[#FFF4EA] hover:bg-[#FFE9D6] border-[#F2C9A0] text-[#FF7A1A]'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isListeningMic ? 'กำลังฟัง...' : '🎤 กดไมค์ แล้วพูด'}</span>
            </button>
            <input
              type="text"
              value={speechInput}
              onChange={(e) => setSpeechInput(e.target.value)}
              className="flex-1 h-12 px-3 text-xs sm:text-sm bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A] font-semibold text-[#1A2B33]"
            />
          </div>

          <button
            onClick={handleParseAndSave}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>แปลงเป็นข้อมูล + บันทึก</span>
          </button>
        </div>
      </div>

      {/* MANDATORY BIG ORANGE "กลับหน้าหลัก" BUTTON AS SPECIFIED IN USER PROMPT */}
      <div className="pt-2">
        <button
          onClick={() => {
            playAudioBeep(600, 'sine', 0.1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onShowToast('คุณอยู่ที่หน้าหลักแล้ว');
          }}
          className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xl font-black rounded-2xl shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <ShrimpSticker size="sm" />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>
    </div>
  );
};
