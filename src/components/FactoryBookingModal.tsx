import React, { useState } from 'react';
import { CalendarCheck, Building2, Truck, Check, X, ShieldCheck } from 'lucide-react';
import { Pond } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface FactoryBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ponds: Pond[];
  onConfirmBooking: (booking: {
    pondId: string;
    factory: string;
    date: string;
    weightKg: number;
    sizeCount: number;
  }) => void;
}

export const FactoryBookingModal: React.FC<FactoryBookingModalProps> = ({
  isOpen,
  onClose,
  ponds,
  onConfirmBooking,
}) => {
  const [pondId, setPondId] = useState(ponds[0]?.id || 'A1');
  const [factory, setFactory] = useState('โรงงาน ซีพีเอฟ ซีฟู้ด มหาชัย');
  const [date, setDate] = useState('14 กุมภาพันธ์ 2569');
  const [weightKg, setWeightKg] = useState(3500);
  const [sizeCount, setSizeCount] = useState(50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.2);
    onConfirmBooking({ pondId, factory, date, weightKg, sizeCount });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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
              รหัสกุ้งรุ่นนี้ SHR-2026-084
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33] mt-0.5">
              สั่งจองคิวส่งโรงงานแปรรูป
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1A2B33] mb-1.5">
              เลือกบ่อที่จะจับกุ้ง:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ponds.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPondId(p.id)}
                  className={`py-3 px-2 rounded-2xl font-bold text-center border-2 transition-all ${
                    pondId === p.id
                      ? 'bg-[#FF7A1A] text-white border-[#FF7A1A] shadow-md'
                      : 'bg-white text-[#1A2B33] border-[#F2C9A0] hover:bg-[#FFF4EA]'
                  }`}
                >
                  บ่อ {p.id}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2B33] mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#FF7A1A]" /> โรงงานแปรรูปปลายทาง
            </label>
            <select
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
              className="w-full h-12 px-4 text-sm font-semibold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
            >
              <option value="โรงงาน ซีพีเอฟ ซีฟู้ด มหาชัย">โรงงาน ซีพีเอฟ ซีฟู้ด มหาชัย (สมุทรสาคร)</option>
              <option value="โรงงาน ไทยยูเนี่ยน กรุ๊ป สมุทรสาคร">โรงงาน ไทยยูเนี่ยน กรุ๊ป (TU Samut Sakhon)</option>
              <option value="โรงงาน สุราษฎร์ ซีฟู้ด โพรเซสซิ่ง">โรงงาน สุราษฎร์ ซีฟู้ด โพรเซสซิ่ง</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A2B33] mb-1">
                ประมาณน้ำหนักกุ้ง (กก.)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                min={100}
                step={100}
                required
                className="w-full h-12 px-3 text-base font-bold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A2B33] mb-1">
                ขนาดกุ้งเป้าหมาย (ตัว/กก.)
              </label>
              <select
                value={sizeCount}
                onChange={(e) => setSizeCount(Number(e.target.value))}
                className="w-full h-12 px-3 text-base font-bold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
              >
                <option value={40}>40 ตัว/กก. (ไซส์ใหญ่)</option>
                <option value={50}>50 ตัว/กก. (ไซส์มาตรฐาน)</option>
                <option value={60}>60 ตัว/กก.</option>
                <option value={70}>70 ตัว/กก.</option>
                <option value={80}>80 ตัว/กก.</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A2B33] mb-1">
              วันที่ต้องการจับกุ้งส่งเข้าโรงงาน
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full h-12 px-4 text-sm font-semibold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
              placeholder="เช่น 14 กุมภาพันธ์ 2569"
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              ระบบตรวจสอบระยะหยุดยาของบ่อนี้แล้ว: <strong>หยุดยาครบ 18 วัน (ผ่านเกณฑ์ 14 วัน)</strong> โรงงานพร้อมรับซื้อได้ทันที
            </span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-14 w-1/3 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-6 h-6" />
              ยืนยันการจองคิว
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
