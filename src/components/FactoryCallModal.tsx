import React, { useState } from 'react';
import { PhoneCall, Building2, MapPin, X, CalendarCheck } from 'lucide-react';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface FactoryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onBookQueue?: () => void;
}

export const FactoryCallModal: React.FC<FactoryCallModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onBookQueue,
}) => {
  const [isCalling, setIsCalling] = useState(false);

  if (!isOpen) return null;

  const handleCall = () => {
    setIsCalling(true);
    playAudioBeep(520, 'sine', 0.3);
    setTimeout(() => {
      setIsCalling(false);
      onSuccess('กำลังต่อสายฝ่ายจัดซื้อวัตถุดิบ บมจ.ซีพีเอฟ ซีฟู้ด มหาชัย (034-889-999)');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-md p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <ShrimpSticker size="md" withBadge />
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
              คู่ค้าโรงงานรับซื้อหลัก
            </span>
            <h3 className="text-xl font-bold text-[#1A2B33] mt-1">
              โทรติดต่อโรงงานแปรรูป
            </h3>
          </div>
        </div>

        <div className="p-4 bg-[#FFF9F2] border border-[#F2C9A0] rounded-2xl mb-5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 flex items-center justify-center text-xl shrink-0">
              🏭
            </div>
            <div>
              <p className="font-bold text-[#1A2B33] text-base">โรงงาน ซีพีเอฟ ซีฟู้ด มหาชัย</p>
              <p className="text-xs text-[#1A2B33]/70 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#FF7A1A]" /> นิคมอุตสาหกรรมสมุทรสาคร
              </p>
              <p className="text-[11px] text-[#1A2B33]/60">ผู้ประสานงาน: คุณวิภาดา (ฝ่ายจัดซื้อกุ้งสด)</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#F2C9A0]/50 text-sm">
            <span className="text-[#1A2B33]/60 text-xs block">เบอร์โทรศัพท์ติดต่อตรง:</span>
            <span className="font-bold text-lg text-[#FF7A1A] tracking-wider">034-889-999 (ต่อ 104)</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCall}
            disabled={isCalling}
            className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            <PhoneCall className={`w-6 h-6 ${isCalling ? 'animate-bounce' : ''}`} />
            {isCalling ? 'กำลังต่อสายโรงงาน...' : 'โทรติดต่อโรงงานทันที'}
          </button>

          {onBookQueue && (
            <button
              onClick={() => {
                onClose();
                onBookQueue();
              }}
              className="w-full h-12 bg-white border-2 border-[#FF7A1A] text-[#FF7A1A] text-base font-bold rounded-2xl hover:bg-[#FFF4EA] transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              สั่งจองคิวส่งกุ้งล่วงหน้า
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full h-11 bg-white border border-[#F2C9A0] text-[#1A2B33]/80 text-sm font-semibold rounded-2xl hover:bg-[#FFF4EA] transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
