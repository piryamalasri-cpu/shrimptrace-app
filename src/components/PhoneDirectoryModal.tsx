import React from 'react';
import { Phone, PhoneCall, X, ShieldCheck } from 'lucide-react';
import { EMERGENCY_PHONES } from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface PhoneDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallSuccess: (msg: string) => void;
}

export const PhoneDirectoryModal: React.FC<PhoneDirectoryModalProps> = ({
  isOpen,
  onClose,
  onCallSuccess,
}) => {
  if (!isOpen) return null;

  const handleCall = (name: string, phone: string) => {
    playAudioBeep(520, 'sine', 0.2);
    onCallSuccess(`กำลังโทรหา ${name} (${phone})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-[440px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <ShrimpSticker size="md" withBadge />
          <div>
            <span className="text-[11px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
              สมุดโทรศัพท์ฉุกเฉินชาวฟาร์ม
            </span>
            <h3 className="text-xl font-bold text-[#1A2B33] mt-0.5">
              เบอร์ติดต่อด่วนทั้งหมด
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#1A2B33]/70 mb-4">
          แตะปุ่มโทรออกได้ทันที ไม่ต้องจำเบอร์ ไม่ต้องกดหาในเครื่อง:
        </p>

        <div className="space-y-2.5 mb-5">
          {EMERGENCY_PHONES.map((item) => (
            <div
              key={item.phone}
              className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl flex items-center justify-between gap-3 hover:bg-[#FFF4EA] transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2 py-0.2 rounded-md border border-[#F2C9A0]">
                    {item.tag}
                  </span>
                  <span className="font-bold text-sm text-[#1A2B33]">{item.name}</span>
                </div>
                <p className="text-xs font-mono font-bold text-[#FF7A1A] mt-1">{item.phone}</p>
                <p className="text-[10px] text-[#1A2B33]/60">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCall(item.name, item.phone)}
                className="h-10 px-3.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                โทร
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-xl hover:bg-[#FFF4EA]"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};
