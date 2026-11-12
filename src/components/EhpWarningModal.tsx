import React from 'react';
import { AlertTriangle, CheckCircle2, PhoneCall, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface EhpWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctor: () => void;
  onAppliedSteps: () => void;
}

export const EhpWarningModal: React.FC<EhpWarningModalProps> = ({
  isOpen,
  onClose,
  onOpenDoctor,
  onAppliedSteps,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'ลดปริมาณอาหารลง 30% ทันที',
      desc: 'เนื่องจากกุ้งกินอาหารช้า การให้อาหารเท่าเดิมจะทำให้เกิดเศษอาหารตกค้างก้นบ่อ เน่าเสียและกลายเป็นแหล่งเพาะสปอร์ EHP',
    },
    {
      num: 2,
      title: 'คลุกสารสกัดกระเทียม + กรดอินทรีย์',
      desc: 'คลุกเคล้าอาหารเม็ดด้วยสารสกัดกระเทียมเข้มข้น 10 กรัม/กก. ผึ่งลม 20 นาที ช่วยยับยั้งสปอร์ไมโครสปอริเดียในเซลล์ตับกุ้ง',
    },
    {
      num: 3,
      title: 'เติมจุลินทรีย์บาซิลลัสคุมก้นบ่อ',
      desc: 'เติมจุลินทรีย์กลุ่ม Bacillus ลงน้ำช่วง 10:00 น. แดดจัด เพื่อเร่งย่อยสลายของเสียและแข่งขันแย่งอาหารกับเชื้อก่อโรค',
    },
    {
      num: 4,
      title: 'ดูดเลนก้นบ่อ และถ่ายน้ำสะอาด 10%',
      desc: 'เปิดกาลักน้ำดูดเลนสีดำสะสมออกอย่างช้าๆ แล้วเติมน้ำสะอาดที่ผ่านการกักฆ่าเชื้อแล้วเข้าบ่อ รักษาความเค็มไม่ให้เหวี่ยง',
    },
  ];

  const handleApply = () => {
    playAudioBeep(640, 'triangle', 0.2);
    onAppliedSteps();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-amber-400 rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-amber-50 text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                AI เฝ้าระวังโรคชีวภาพ
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                ความเสี่ยง 75%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33] mt-0.5">
              บ่อ B2 เสี่ยง EHP / ขี้ขาว
            </h3>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-900 mb-4 leading-relaxed">
          <span className="font-bold">สาเหตุที่ AI วิเคราะห์:</span> กุ้งกินอาหารลดลงต่อเนื่อง 2 วันติดต่อกัน ร่วมกับค่าแอมโมเนียในบ่อ B2 สูง 0.85 ppm และพบแนวฟองขี้ขาวลอยตามทิศทางลม
        </div>

        <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
          <h4 className="text-sm font-bold text-[#1A2B33]">
            4 ขั้นตอนแก้ปัญหาด่วน (ปฏิบัติทันที):
          </h4>
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-xl bg-[#FF7A1A] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {st.num}
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A2B33]">{st.title}</p>
                <p className="text-xs text-[#1A2B33]/70 mt-0.5 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleApply}
            className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            กดใช้ 4 ขั้นตอนนี้กับบ่อ B2 ทันที
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDoctor();
            }}
            className="w-full h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] text-sm font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-[#FF7A1A]" />
            โทรปรึกษาหมอกุ้งประจำเขตเพื่อส่งตรวจ PCR
          </button>
        </div>
      </div>
    </div>
  );
};
