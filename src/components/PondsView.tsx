import React, { useState } from 'react';
import { Pond, PondType, WaterStatus } from '../types';
import { SHRIMP_BREEDS } from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeImage, getSafeStickerSrc, handleImageError, FALLBACK_SHRIMP_IMG } from '../utils/imageFallback';
import {
  Plus,
  Droplets,
  Utensils,
  ChevronRight,
  Wind,
  Trash2,
  Edit2,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { playAudioBeep } from '../utils/audio';

interface PondsViewProps {
  ponds: Pond[];
  onOpenWater: (pondId?: string) => void;
  onOpenFeeding: (pondId?: string) => void;
  onOpenPondDetail: (pond: Pond) => void;
  onBackToHome: () => void;
  onAddPond: (pond: Pond) => void;
  onEditPond: (pond: Pond) => void;
  onDeletePond: (pondId: string) => void;
}

export const PondsView: React.FC<PondsViewProps> = ({
  ponds,
  onOpenWater,
  onOpenFeeding,
  onOpenPondDetail,
  onBackToHome,
  onAddPond,
  onEditPond,
  onDeletePond,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPond, setEditingPond] = useState<Pond | null>(null);

  // Form state
  const [formName, setFormName] = useState('บ่อ B3');
  const [formType, setFormType] = useState<PondType>('บ่อดิน');
  const [formBreedId, setFormBreedId] = useState('vannamei');
  const [formAreaRai, setFormAreaRai] = useState(4.0);
  const [formStockedCount, setFormStockedCount] = useState(200000);
  const [formStockingDate, setFormStockingDate] = useState('1 กุมภาพันธ์ 2569');

  const handleOpenAdd = () => {
    playAudioBeep(560, 'sine', 0.15);
    setEditingPond(null);
    setFormName(`บ่อ B${ponds.length + 1}`);
    setFormType('บ่อดิน');
    setFormBreedId('vannamei');
    setFormAreaRai(4.0);
    setFormStockedCount(200000);
    setFormStockingDate('1 กุมภาพันธ์ 2569');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Pond, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioBeep(520, 'sine', 0.1);
    setEditingPond(p);
    setFormName(p.name);
    setFormType(p.pondType);
    setFormBreedId(p.breedId || 'vannamei');
    setFormAreaRai(p.areaRai);
    setFormStockedCount(p.stockedCount);
    setFormStockingDate(p.stockingDate);
    setShowAddModal(true);
  };

  const handleDelete = (pondId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioBeep(450, 'triangle', 0.2);
    if (confirm(`คุณต้องการลบบ่อ ${pondId} ใช่หรือไม่?`)) {
      onDeletePond(pondId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.2);
    const breedObj = SHRIMP_BREEDS.find((b) => b.id === formBreedId) || SHRIMP_BREEDS[0];

    if (editingPond) {
      const updated: Pond = {
        ...editingPond,
        name: formName,
        pondType: formType,
        breedId: formBreedId,
        breed: breedObj.nameThai,
        areaRai: Number(formAreaRai),
        stockedCount: Number(formStockedCount),
        stockingDate: formStockingDate,
        breedImg: breedObj.realImg,
      };
      onEditPond(updated);
    } else {
      const newPond: Pond = {
        id: formName.replace(/\s+/g, ''),
        name: formName,
        pondType: formType,
        breedId: formBreedId,
        breed: breedObj.nameThai,
        areaRai: Number(formAreaRai),
        stockedCount: Number(formStockedCount),
        stockingDate: formStockingDate,
        ageDays: 12,
        weightGrams: 8.5,
        waterStatus: 'good',
        waterStatusText: 'น้ำดี',
        conditionText: 'ปกติ',
        ph: 8.0,
        dissolvedOxygen: 6.0,
        ammonia: 0.03,
        nitrite: 0.12,
        alkalinity: 120,
        salinity: breedObj.optimalSalinityMin + 5,
        temperature: 29.0,
        lastFedKg: 18,
        feedTrayConsumedPercent: 95,
        shrimpCount: Number(formStockedCount),
        shrimpPerKg: 110,
        aeratorRunning: true,
        breedImg: breedObj.realImg,
      };
      onAddPond(newPond);
    }
    setShowAddModal(false);
  };

  const safePonds = ponds || [];

  if (!ponds || safePonds.length === 0) {
    return (
      <div className="shrimp-card p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm text-center max-w-[480px] mx-auto my-6 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF7A1A] border-t-transparent animate-spin mx-auto mb-3" />
        <h4 className="text-base font-black text-[#1A2B33]">กำลังโหลดข้อมูลบ่อกุ้ง...</h4>
        <p className="text-xs text-[#1A2B33]/60 mt-1">กรุณารอสักครู่</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="shrimp-card p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={getSafeStickerSrc(STICKER_MAP?.pond?.src)} size={48} alt="บ่อของฉัน" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              บ่อทั้งหมด {safePonds.length} บ่อ
            </span>
            <h1 className="text-2xl font-black text-[#1A2B33] mt-0.5">
              บ่อของฉัน (My Ponds)
            </h1>
          </div>
        </div>
        <p className="text-xs text-[#1A2B33]/70 font-semibold">
          กดที่การ์ดบ่อเพื่อดูค่าน้ำ สุขภาพกุ้ง และเปิด/ปิดใบพัด
        </p>

        {/* Big "+ เพิ่มบ่อใหม่" Button */}
        <button
          onClick={handleOpenAdd}
          className="mt-3.5 w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-base rounded-2xl shadow-lg shadow-[#FF7A1A]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>+ เพิ่มบ่อใหม่</span>
        </button>
      </div>

      {/* Ponds List Cards */}
      <div className="space-y-3">
        {(safePonds || []).map((p) => {
          const isGood = p?.waterStatus === 'good';
          const isWarning = p?.waterStatus === 'warning';
          const isDanger = p?.waterStatus === 'danger';

          const statusDot = isGood ? '🟢' : isWarning ? '🟡' : '🔴';
          const badgeColor = isGood
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : isWarning
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-rose-100 text-rose-900 border-rose-300';

          const breedData = (SHRIMP_BREEDS || []).find((b) => b?.id === p?.breedId);
          const breedImgSrc = getSafeImage(p?.breedImg || breedData?.realImg, FALLBACK_SHRIMP_IMG);

          return (
            <div
              key={p?.id || Math.random().toString()}
              onClick={() => {
                playAudioBeep(520, 'sine', 0.1);
                if (p) onOpenPondDetail(p);
              }}
              className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              {/* Top Row: Name, Type, Status, Actions */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F2C9A0]/40">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-[#1A2B33]">{p?.name}</span>
                  <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                    {p?.pondType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                    {statusDot} {p?.waterStatusText}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(p, e)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF7A1A] hover:bg-[#FFF4EA]"
                    title="แก้ไขบ่อ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                    title="ลบบ่อ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content with Real Breed Thumbnail to Prevent Confusion */}
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#F2C9A0] shrink-0 bg-slate-100">
                  <img
                    src={breedImgSrc}
                    alt={p?.breed || 'กุ้ง'}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_SHRIMP_IMG)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="flex-1 text-xs space-y-0.5">
                  <span className="font-bold text-sm text-[#FF7A1A] block">
                    {p.breed}
                  </span>
                  <p className="text-[#1A2B33]/80">
                    ขนาด <strong>{p.areaRai} ไร่</strong> • ลง <strong>{p.stockedCount.toLocaleString()} ตัว</strong>
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    อายุ <strong>{p.ageDays} วัน</strong> • หนัก <strong>{p.weightGrams} กรัม</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-500 block">ออกซิเจน / pH</span>
                  <span className="font-bold text-xs text-[#1A2B33]">
                    DO {p.dissolvedOxygen} • pH {p.ph}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    เค็ม {p.salinity} ppt
                  </span>
                </div>
              </div>

              {/* Warning notice if water is danger */}
              {p.warningNote && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{p.warningNote}</span>
                </div>
              )}

              {/* Bottom Quick Row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F2C9A0]/40 text-xs">
                <span className="font-bold text-[#FF7A1A] flex items-center gap-1">
                  แตะดูค่าน้ำครบทุกตัว <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className={`text-[11px] font-bold ${p.aeratorRunning ? 'text-emerald-700' : 'text-gray-500'}`}>
                  {p.aeratorRunning ? '🌀 ตีน้ำเปิดอยู่' : '⚪ ตีน้ำปิดอยู่'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT POND MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-[28px] max-w-[440px] w-full p-5 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#1A2B33] mb-1">
              {editingPond ? 'แก้ไขข้อมูลบ่อ' : 'เพิ่มบ่อใหม่'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              กรอกข้อมูลเพื่อติดตามรอบการเลี้ยงและค่าน้ำตามพันธุ์
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">ชื่อบ่อ (เช่น B3):</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="เช่น บ่อ B3"
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold text-sm text-[#1A2B33]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">ประเภทบ่อ:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['บ่อดิน', 'บ่อปูน', 'บ่อปูผ้าใบ'] as PondType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className={`h-11 rounded-xl border font-bold text-xs ${
                        formType === t
                          ? 'bg-[#FF7A1A] text-white border-[#FF7A1A]'
                          : 'bg-white border-[#F2C9A0] text-[#1A2B33]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">พันธุ์กุ้งในบ่อ:</label>
                <select
                  value={formBreedId}
                  onChange={(e) => setFormBreedId(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold text-xs text-[#1A2B33]"
                >
                  {SHRIMP_BREEDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameThai} ({b.waterEnv})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">ขนาดบ่อ (ไร่):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formAreaRai}
                    onChange={(e) => setFormAreaRai(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">จำนวนที่ลง (ตัว):</label>
                  <input
                    type="number"
                    value={formStockedCount}
                    onChange={(e) => setFormStockedCount(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">วันที่ลงกุ้ง:</label>
                <input
                  type="text"
                  value={formStockingDate}
                  onChange={(e) => setFormStockingDate(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 h-12 bg-white border border-[#F2C9A0] font-bold text-xs rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingPond ? 'บันทึกการแก้ไข' : 'บันทึกบ่อใหม่'}
                </button>
              </div>
            </form>
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
