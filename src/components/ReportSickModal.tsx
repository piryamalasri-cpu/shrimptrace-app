import React, { useState } from 'react';
import { AlertCircle, PhoneCall, ShieldAlert, Check, X, Stethoscope } from 'lucide-react';
import { Pond } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface ReportSickModalProps {
  isOpen: boolean;
  onClose: () => void;
  ponds: Pond[];
  onOpenDoctor: () => void;
  onSubmitReport: (pondId: string, symptoms: string[]) => void;
}

const COMMON_SYMPTOMS = [
  'ขี้ขาวลอยเป็นแพผิวน้ำ (เสี่ยง EHP)',
  'จุดขาวกลมๆ ใต้เปลือกหัว (เสี่ยง WSSV)',
  'ตับลีบ ตับซีด ไม่กินอาหาร (เสี่ยง EMS)',
  'กุ้งลอยหัวตามขอบบ่อ ออกซิเจนตก',
  'ตัวแดง ขากรรไกรช้ำ (ติดเชื้อวิบริโอ)',
  'เปลือกนิ่ม ไม่ยอมแข็งตัวหลังลอกคราบ',
];

export const ReportSickModal: React.FC<ReportSickModalProps> = ({
  isOpen,
  onClose,
  ponds,
  onOpenDoctor,
  onSubmitReport,
}) => {
  const [selectedPondId, setSelectedPondId] = useState(ponds.find(p => p.waterStatus !== 'good')?.id || 'B2');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['ขี้ขาวลอยเป็นแพผิวน้ำ (เสี่ยง EHP)']);

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    playAudioBeep(520, 'sine', 0.1);
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = () => {
    playAudioBeep(720, 'triangle', 0.2);
    onSubmitReport(selectedPondId, selectedSymptoms);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-rose-300 rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
              สายด่วนแจ้งเหตุกุ้งป่วย
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-900 mt-0.5">
              แจ้งว่ากุ้งป่วย / อาการผิดปกติ
            </h3>
          </div>
        </div>

        {/* Pond Selector */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#1A2B33] mb-1.5">
            พบอาการที่บ่อไหน?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ponds.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPondId(p.id)}
                className={`py-3 px-2 rounded-2xl font-bold text-center border-2 transition-all ${
                  selectedPondId === p.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : 'bg-white text-[#1A2B33] border-[#F2C9A0] hover:bg-rose-50'
                }`}
              >
                บ่อ {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms checklist */}
        <div className="mb-5 space-y-2">
          <label className="block text-sm font-bold text-[#1A2B33]">
            อาการที่สังเกตเห็น (กดเลือกได้หลายข้อ):
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {COMMON_SYMPTOMS.map((sym) => {
              const checked = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    checked
                      ? 'bg-rose-50 border-rose-400 font-bold text-rose-950'
                      : 'bg-white border-[#F2C9A0] text-[#1A2B33] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <span className="text-sm">{sym}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      checked ? 'bg-rose-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-6 h-6" />
            ส่งแจ้งเตือนและบันทึกประวัติทันที
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDoctor();
            }}
            className="w-full h-12 bg-white border-2 border-[#FF7A1A] text-[#FF7A1A] text-base font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-5 h-5" /> โทรปรึกษาหมอกุ้งด่วน (ฟรี)
          </button>
        </div>
      </div>
    </div>
  );
};
