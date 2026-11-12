import React, { useState } from 'react';
import { STICKERS, StickerInfo } from '../assets/stickers';
import { ChromaSticker } from './ChromaSticker';
import { X, Download, Eye, Sparkles, Check } from 'lucide-react';

interface StickerGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StickerGalleryModal: React.FC<StickerGalleryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerInfo | null>(null);
  const [keyOutBg, setKeyOutBg] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (sticker: StickerInfo) => {
    // Download directly
    const link = document.createElement('a');
    link.href = sticker.src;
    link.download = `shrimptrace_sticker_${sticker.num}_${sticker.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedId(sticker.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#FFFEFB] border border-[#F2C9A0] rounded-[24px] shadow-[0_16px_40px_rgba(255,122,26,0.18)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F2C9A0]/50 flex items-center justify-between bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6]">
          <div className="flex items-center gap-2.5">
            <ChromaSticker src={STICKERS[0].src} size="sm" keyOutMagenta={true} />
            <div>
              <h2 className="text-xl font-bold text-[#1A2B33]">
                สติกเกอร์ ShrimpTrace 15 ชิ้น
              </h2>
              <p className="text-xs text-[#6B7280]">
                สไตล์ 2.5D น่ารัก ขอบขาวหนา ตัวกลม แก้มชมพู
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 border border-[#F2C9A0] flex items-center justify-center text-[#1A2B33] hover:bg-white active:scale-95 transition-all"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="px-5 py-2.5 bg-[#FFF9F3] border-b border-[#F2C9A0]/40 flex items-center justify-between text-xs">
          <span className="text-[#6B7280] font-medium">
            ทั้งหมด {STICKERS.length} รายการ (สร้างครบ 15/15)
          </span>
          <button
            onClick={() => setKeyOutBg(!keyOutBg)}
            className="px-3 py-1 rounded-full border border-[#FF7A1A]/30 bg-white text-[#FF7A1A] font-semibold flex items-center gap-1.5 hover:bg-[#FFF4EA] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {keyOutBg ? 'โหมด: โปร่งใสตัดชมพู' : 'โหมด: ต้นฉบับ #FF00FF'}
          </button>
        </div>

        {/* Stickers Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STICKERS.map((st) => (
            <div
              key={st.id}
              onClick={() => setSelectedSticker(st)}
              className="bg-white border border-[#F2C9A0]/60 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer hover:border-[#FF7A1A] hover:shadow-[0_8px_20px_rgba(255,122,26,0.12)] transition-all group relative"
            >
              <span className="absolute top-2 left-2 text-[10px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-1.5 py-0.5 rounded-full border border-[#F2C9A0]/60">
                #{st.num}
              </span>

              <div className="my-2 h-24 flex items-center justify-center">
                <ChromaSticker
                  src={st.src}
                  size="xl"
                  keyOutMagenta={keyOutBg}
                  className="group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="font-bold text-sm text-[#1A2B33] line-clamp-1">
                {st.title}
              </div>
              <div className="text-[11px] text-[#6B7280] line-clamp-2 mt-0.5 leading-tight">
                {st.description}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(st);
                }}
                className="mt-2.5 w-full py-1 text-xs font-semibold rounded-lg bg-[#FFF4EA] text-[#FF7A1A] border border-[#F2C9A0]/60 hover:bg-[#FF7A1A] hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                {copiedId === st.id ? (
                  <>
                    <Check className="w-3 h-3" /> โหลดแล้ว
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" /> บันทึก
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F2C9A0]/50 bg-[#FFFDF9] flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">
            💡 นำไปใช้ในแอปหรือพิมพ์ป้ายติดบ่อกุ้งได้ทันที
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#FF7A1A] text-white font-bold text-sm shadow-[0_4px_12px_rgba(255,122,26,0.3)] hover:brightness-105 active:scale-95 transition-all"
          >
            เรียบร้อย
          </button>
        </div>
      </div>

      {/* Enlarged Preview Modal */}
      {selectedSticker && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedSticker(null)}
        >
          <div
            className="bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSticker(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-3 py-1 rounded-full border border-[#F2C9A0] mb-2">
              ชิ้นที่ {selectedSticker.num} จาก 15
            </span>
            <h3 className="text-xl font-bold text-[#1A2B33]">
              {selectedSticker.title}
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 mb-4">
              {selectedSticker.description}
            </p>

            <div className="bg-[#FFF4EA]/50 rounded-2xl p-4 flex items-center justify-center my-3 border border-[#F2C9A0]/50 min-h-[220px]">
              <ChromaSticker
                src={selectedSticker.src}
                size={180}
                keyOutMagenta={keyOutBg}
              />
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setKeyOutBg(!keyOutBg)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-[#F2C9A0] bg-white text-[#1A2B33] hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#FF7A1A]" />
                {keyOutBg ? 'ดูแบบพื้นชมพู' : 'ดูแบบตัดโปร่งใส'}
              </button>
              <button
                onClick={() => handleDownload(selectedSticker)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#FF7A1A] text-white hover:brightness-105 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(255,122,26,0.3)]"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลดรูป
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
