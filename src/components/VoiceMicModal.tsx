import React, { useState } from 'react';
import { Mic, CheckCircle2, X, RefreshCw, Volume2 } from 'lucide-react';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep, speakThaiText } from '../utils/audio';

interface VoiceMicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const VoiceMicModal: React.FC<VoiceMicModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [stage, setStage] = useState<'idle' | 'listening' | 'parsed'>('idle');
  const [selectedPhrase, setSelectedPhrase] = useState('บ่อ A3 2 โล กินหมด');
  const [parsedData, setParsedData] = useState({
    pond: 'A3',
    feedKg: 2,
    trayStatus: 'กินหมด 100% (ยอแห้ง)',
    status: 'น้ำดี ปกติ',
  });

  if (!isOpen) return null;

  const handleStartListening = (phrase = selectedPhrase) => {
    setSelectedPhrase(phrase);
    setStage('listening');
    playAudioBeep(600, 'sine', 0.2);

    setTimeout(() => {
      // Parse phrases
      if (phrase.includes('A3')) {
        setParsedData({
          pond: 'A3',
          feedKg: 2,
          trayStatus: 'กินหมด 100% (ยอแห้ง)',
          status: 'น้ำดี กุ้งแข็งแรง',
        });
      } else if (phrase.includes('B2')) {
        setParsedData({
          pond: 'B2',
          feedKg: 1.5,
          trayStatus: 'เหลือก้นยอ 40% (กุ้งกินช้า)',
          status: 'น้ำเริ่มแย่ เฝ้าระวัง',
        });
      } else {
        setParsedData({
          pond: 'A1',
          feedKg: 3,
          trayStatus: 'กินหมด 95%',
          status: 'น้ำดี ปกติ',
        });
      }
      setStage('parsed');
      playAudioBeep(880, 'triangle', 0.25);
    }, 1600);
  };

  const handleConfirm = () => {
    playAudioBeep(700, 'sine', 0.15);
    onSuccess(`บันทึกเสียงสำเร็จ: บ่อ ${parsedData.pond} ให้อาหาร ${parsedData.feedKg} กก. ${parsedData.trayStatus}`);
    setStage('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
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
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33]">
              บันทึกด้วยเสียงอัจฉริยะ 🎙️
            </h3>
            <p className="text-sm text-[#1A2B33]/70">
              กดปุ่มไมค์แล้วพูด เช่น "บ่อ A3 2 โล กินหมด"
            </p>
          </div>
        </div>

        {stage === 'idle' && (
          <div className="text-center py-6">
            <button
              onClick={() => handleStartListening('บ่อ A3 2 โล กินหมด')}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#FF7A1A] to-[#FFA654] text-white flex flex-col items-center justify-center mx-auto shadow-lg shadow-[#FF7A1A]/30 hover:scale-105 active:scale-95 transition-all border-4 border-white"
            >
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 mb-1" />
              <span className="text-xs font-bold">กดเพื่อพูด</span>
            </button>

            <div className="mt-6 text-left">
              <span className="text-xs font-semibold text-[#1A2B33]/60 uppercase tracking-wide">
                ลองกดตัวอย่างคำพูดชาวฟาร์ม:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'บ่อ A3 2 โล กินหมด',
                  'บ่อ B2 อาหารโลครึ่ง ขี้ขาวลอย',
                  'บ่อ A1 3 โล น้ำดีมาก',
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => handleStartListening(phrase)}
                    className="px-3.5 py-2 text-sm font-medium bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl text-[#1A2B33] hover:bg-[#FFE9D6] transition-colors"
                  >
                    🗣️ "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'listening' && (
          <div className="text-center py-8">
            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FF7A1A]/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-[#FF7A1A] text-white flex items-center justify-center shadow-lg">
                <Mic className="w-10 h-10 animate-bounce" />
              </div>
            </div>
            <p className="text-lg font-bold text-[#FF7A1A]">กำลังฟังเสียงของคุณ...</p>
            <p className="text-sm text-[#1A2B33]/60 mt-1">"{selectedPhrase}"</p>
          </div>
        )}

        {stage === 'parsed' && (
          <div className="py-2">
            <div className="p-4 bg-[#FFF9F2] border border-[#F2C9A0] rounded-2xl mb-5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2C9A0]/50">
                <span className="text-xs text-[#1A2B33]/60">เสียงที่แปลงได้</span>
                <span className="text-xs font-semibold text-[#FF7A1A] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI แปลงแม่นยำ 100%
                </span>
              </div>
              <p className="text-base font-bold text-[#1A2B33] bg-white p-2.5 rounded-lg border border-[#F2C9A0]/40">
                "{selectedPhrase}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-[#F2C9A0]/30">
                  <span className="text-xs text-[#1A2B33]/60 block">หมายเลขบ่อ</span>
                  <span className="font-bold text-lg text-[#1A2B33]">{parsedData.pond}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#F2C9A0]/30">
                  <span className="text-xs text-[#1A2B33]/60 block">ปริมาณอาหาร</span>
                  <span className="font-bold text-lg text-[#FF7A1A]">{parsedData.feedKg} กิโลกรัม</span>
                </div>
                <div className="col-span-2 bg-white p-2.5 rounded-lg border border-[#F2C9A0]/30">
                  <span className="text-xs text-[#1A2B33]/60 block">ผลเช็คยอ</span>
                  <span className="font-bold text-[#1A2B33]">{parsedData.trayStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleConfirm}
                className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-6 h-6" />
                ยืนยันบันทึกข้อมูลนี้
              </button>
              <button
                onClick={() => setStage('idle')}
                className="w-full h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] text-sm font-semibold rounded-2xl hover:bg-[#FFF4EA] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> พูดใหม่อีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
