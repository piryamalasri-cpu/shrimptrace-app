import React, { useState } from 'react';
import { QrCode, ClipboardEdit, Banknote, ChevronRight, CheckCircle, X } from 'lucide-react';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: '1. สแกน QR ตรวจสอบที่มา',
      subtitle: 'สแกนรับลูกกุ้งรุ่นนี้จากโรงเพาะฟัก',
      description: 'เพียงใช้มือถือสแกนคิวอาร์โค้ดที่กล่องลูกกุ้ง ระบบจะดึงรหัสรุ่น (Batch ID) ผลตรวจ PCR และประวัติพ่อแม่พันธุ์ลงบ่อให้อัตโนมัติ ไม่ต้องกรอกเอง',
      icon: (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFF4EA] border-2 border-[#F2C9A0] flex flex-col items-center justify-center shadow-inner mx-auto mb-4 relative">
          <QrCode className="w-14 h-14 text-[#FF7A1A]" />
          <div className="absolute -bottom-2 bg-[#FF7A1A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            SHR-2026-084
          </div>
        </div>
      ),
      tip: '💡 เคล็ดลับ: สแกนครั้งเดียว ข้อมูลเชื่อมต่อไปจนถึงโรงงานและผู้ส่งออก',
    },
    {
      stepNumber: 2,
      title: '2. กดบันทึกง่ายๆ วันละครั้ง',
      subtitle: 'จดค่าน้ำ ให้อาหาร แค่ปุ่มเดียวหรือพูดไมค์',
      description: 'ไม่ต้องพิมพ์ตัวเลขยากๆ แค่เลือก "น้ำดี / น้ำเริ่มแย่ / น้ำอันตราย" หรือกดปุ่ม "เหมือนเมื่อวาน" ก็บันทึกได้ทั้งฟาร์ม หรือจะกดพูด "บ่อ A3 2 โล กินหมด" ก็ทำได้ทันที',
      icon: (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFF4EA] border-2 border-[#F2C9A0] flex flex-col items-center justify-center shadow-inner mx-auto mb-4 relative">
          <ClipboardEdit className="w-14 h-14 text-[#FF7A1A]" />
          <div className="absolute -bottom-2 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> น้ำดี ปกติ
          </div>
        </div>
      ),
      tip: '💡 ปุ่มใหญ่ ตัวหนังสือชัด ออกแบบเพื่อคนเลี้ยงกุ้ง มือเปียกก็กดได้สบาย',
    },
    {
      stepNumber: 3,
      title: '3. กดขายกุ้ง รับเงินทันที',
      subtitle: 'เช็คราคาสด ตลาดทะเลไทย จองคิวโรงงาน',
      description: 'ดูราคาแบบเรียลไทม์ 40-80 ตัว/กก. มีระบบคำนวณเงินสด เมื่อกุ้งโตได้ขนาด กดจองคิวโรงงานแปรรูปได้ทันที โรงงานเห็นประวัติยาครบ รับซื้อได้ราคาสูง',
      icon: (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFF4EA] border-2 border-[#F2C9A0] flex flex-col items-center justify-center shadow-inner mx-auto mb-4 relative">
          <Banknote className="w-14 h-14 text-[#FF7A1A]" />
          <div className="absolute -bottom-2 bg-[#FF7A1A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            ฿ 190 / กก.
          </div>
        </div>
      ),
      tip: '💡 ตรวจสอบย้อนกลับ 100% เพิ่มความเชื่อมั่น โรงงานให้ราคาพรีเมียม',
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    playAudioBeep(520, 'sine', 0.15);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-10 bg-[#FF7A1A]'
                  : idx < currentStep
                  ? 'w-5 bg-[#FF7A1A]/40'
                  : 'w-2.5 bg-[#F2C9A0]'
              }`}
            />
          ))}
        </div>

        {/* Visual Graphic */}
        <div className="text-center">
          {current.icon}
          <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-3 py-1 rounded-full border border-[#F2C9A0]">
            ขั้นตอนที่ {current.stepNumber} จาก 3
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33] mt-2 mb-1">
            {current.title}
          </h3>
          <p className="text-sm font-semibold text-[#FF7A1A] mb-3">
            {current.subtitle}
          </p>
          <p className="text-sm sm:text-base text-[#1A2B33]/80 leading-relaxed max-w-md mx-auto mb-4 bg-[#FFFDF9] p-3 rounded-2xl border border-[#F2C9A0]/40">
            {current.description}
          </p>
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl font-medium mb-6">
            {current.tip}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="h-14 sm:w-1/3 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors"
            >
              ย้อนกลับ
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {currentStep < steps.length - 1 ? (
              <>
                เข้าใจแล้ว ไปต่อ <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                เริ่มใช้งาน ShrimpTrace เลย!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
