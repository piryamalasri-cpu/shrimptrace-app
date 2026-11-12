import React, { useState } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Truck,
  Upload,
  ArrowLeft,
} from 'lucide-react';
import { CustomerOrder } from '../types';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface ScanReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  onConfirmReceive: (orderId: string, receivedDateTime: string) => void;
  onReportIssue: (orderId: string, symptoms: string, photoFileName?: string) => void;
  initialOrderId?: string;
}

export const ScanReceiveModal: React.FC<ScanReceiveModalProps> = ({
  isOpen,
  onClose,
  orders,
  onConfirmReceive,
  onReportIssue,
  initialOrderId,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || orders[0]?.id || ''
  );
  const [inputBatchCode, setInputBatchCode] = useState<string>('SHR-2026-084');
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'scan' | 'detail' | 'report'>('scan');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  if (!isOpen) return null;

  const currentOrder =
    orders.find((o) => o.id === selectedOrderId || o.batchId === inputBatchCode) ||
    orders[0];

  const handleSimulateScan = () => {
    setIsScanning(true);
    playAudioBeep(580, 'sine', 0.2);
    setTimeout(() => {
      setIsScanning(false);
      setViewMode('detail');
    }, 1200);
  };

  const handleConfirm = () => {
    const now = new Date();
    const formatted = `${now.getDate()} ก.พ. 2569 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    playAudioBeep(720, 'sine', 0.25);
    if (currentOrder) {
      onConfirmReceive(currentOrder.id, formatted);
    }
  };

  const handleSendIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;
    playAudioBeep(450, 'triangle', 0.3);
    if (currentOrder) {
      onReportIssue(currentOrder.id, symptomsInput, uploadedFileName || 'problem_sample.jpg');
    }
    setViewMode('detail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl w-full max-w-[460px] max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6] border-b border-[#F2C9A0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {viewMode !== 'scan' && (
              <button
                onClick={() => setViewMode('scan')}
                className="w-8 h-8 rounded-full bg-white/80 border border-[#F2C9A0] flex items-center justify-center text-[#1A2B33]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1">
              <ChromaSticker src={STICKER_MAP.logo.src} size={28} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A2B33]">
                {viewMode === 'scan' && 'ระบบสแกนรับกุ้ง & เช็คย้อนกลับ'}
                {viewMode === 'detail' && 'ประวัติล็อต & ยืนยันรับกุ้ง'}
                {viewMode === 'report' && 'รายงานปัญหากุ้งล็อตนี้'}
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                บันทึกเวลาจริง และตรวจสอบที่มาตลอดวงจร
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#F2C9A0] flex items-center justify-center text-gray-700 hover:bg-gray-100"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {viewMode === 'scan' && (
            <div className="space-y-4 text-center">
              {/* Simulated Camera Viewfinder */}
              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-900 rounded-3xl overflow-hidden border-4 border-[#FF7A1A] flex flex-col items-center justify-center shadow-inner">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 border-4 border-t-[#FF7A1A] border-white/20 rounded-full animate-spin" />
                    <span className="text-white text-xs font-bold tracking-wide animate-pulse">
                      กำลังตรวจรหัส QR ล็อต...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Viewfinder crosshairs */}
                    <div className="w-44 h-44 border-2 border-dashed border-[#FF7A1A]/80 rounded-2xl flex items-center justify-center relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />
                      <Camera className="w-10 h-10 text-white/60 animate-pulse" />
                    </div>
                    <span className="text-white/80 text-xs mt-3 font-semibold">
                      ส่องกล้องไปที่ QR Code หน้าถุง/กล่องกุ้ง
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-base rounded-2xl shadow-lg shadow-[#FF7A1A]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>จำลองการสแกน QR Code</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#F2C9A0]/60" />
                <span className="flex-shrink mx-3 text-xs font-bold text-[#6B7280]">
                  หรือพิมพ์รหัสล็อตด้วยตนเอง
                </span>
                <div className="flex-grow border-t border-[#F2C9A0]/60" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputBatchCode}
                  onChange={(e) => setInputBatchCode(e.target.value)}
                  placeholder="เช่น SHR-2026-084"
                  className="flex-1 h-12 px-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-mono font-bold text-sm text-[#1A2B33] focus:border-[#FF7A1A] outline-none"
                />
                <button
                  onClick={() => setViewMode('detail')}
                  className="px-4 h-12 bg-[#1A2B33] text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                >
                  ค้นหาล็อต
                </button>
              </div>

              {/* Order quick select buttons */}
              <div className="text-left pt-2">
                <span className="text-xs font-bold text-[#1A2B33] block mb-2">
                  เลือกล็อตจากประวัติของคุณ:
                </span>
                <div className="space-y-1.5">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setSelectedOrderId(o.id);
                        setInputBatchCode(o.batchId);
                        setViewMode('detail');
                      }}
                      className="p-2.5 bg-white border border-[#F2C9A0] rounded-xl flex items-center justify-between text-xs cursor-pointer hover:border-[#FF7A1A]"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#FF7A1A]">
                          {o.batchId}
                        </span>
                        <span className="text-[#1A2B33] font-semibold block">
                          {o.farmName} • {o.breedName} ({o.quantityKg} กก.)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'detail' && currentOrder && (
            <div className="space-y-3.5">
              {/* Lot Passport Card */}
              <div className="p-4 bg-gradient-to-r from-[#FFF4EA] to-[#FFE9D6] border-2 border-[#FF7A1A] rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
                    รหัสล็อต: {currentOrder.batchId}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      currentOrder.status === 'รับกุ้งแล้ว'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : currentOrder.status === 'รอตรวจสอบจากโรงเพาะ'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    สถานะ: {currentOrder.status}
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#1A2B33]">
                  {currentOrder.farmName}
                </h4>
                <p className="text-xs text-[#1A2B33]/80">
                  {currentOrder.breedName} • จำนวน{' '}
                  <strong>{currentOrder.quantityKg.toLocaleString()} กก.</strong> • ยอด{' '}
                  <strong className="text-[#FF7A1A]">
                    ฿{currentOrder.totalPrice.toLocaleString()}
                  </strong>
                </p>
              </div>

              {/* Timestamp Tracking Card */}
              <div className="p-3.5 bg-white border border-[#F2C9A0] rounded-2xl space-y-2 text-xs">
                <span className="font-black text-[#1A2B33] block border-b border-[#F2C9A0]/50 pb-1">
                  ⏱️ บันทึกวันและเวลาอย่างละเอียด:
                </span>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">วันเวลาสั่งซื้อ:</span>
                  <span className="font-bold text-[#1A2B33]">
                    {currentOrder.orderDate}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">วันเวลานัดส่ง/จับ:</span>
                  <span className="font-bold text-[#1A2B33]">
                    {currentOrder.deliveryDate}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">วันเวลาที่สแกนรับ:</span>
                  <span className="font-bold text-emerald-700">
                    {currentOrder.receivedDate || 'ยังไม่ได้กดยืนยันรับกุ้ง'}
                  </span>
                </div>
              </div>

              {/* Full Traceability History Card */}
              <div className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl space-y-2 text-xs">
                <span className="font-black text-[#1A2B33] block border-b border-[#F2C9A0]/50 pb-1">
                  📋 ประวัติย้อนกลับ 6 หมวด (Traceability Complete):
                </span>
                <div className="space-y-1.5 text-[11px] leading-relaxed">
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">1. แหล่งพันธุ์:</span>
                    <span>พ่อแม่พันธุ์ SPF สหรัฐฯ ใบอนุญาต หนส. 2026/0142</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">2. อนุบาล:</span>
                    <span>โรงเพาะฟักไทยพัฒนา เจเนติกส์ ระยะ PL12 น้ำเค็ม 28 ppt</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">3. อาหาร:</span>
                    <span>อาร์ทีเมียฟักสด + อาหารเม็ดเสริมโปรตีน 40%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">4. สุขภาพ:</span>
                    <span>ตรวจ PCR ปลอดเชื้อ WSSV, EMS, EHP และปลอดสารตกค้าง</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">5. ฟาร์มเลี้ยง:</span>
                    <span>{currentOrder.farmName} ({currentOrder.farmAddress})</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#FF7A1A] shrink-0">6. ขนส่ง:</span>
                    <span>วิธี: {currentOrder.deliveryMethod} อุณหภูมิควบคุม 4 องศา</span>
                  </div>
                </div>
              </div>

              {/* Issue report display if exists */}
              {currentOrder.issueReport && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900">
                  <span className="font-bold block text-rose-950 mb-0.5">
                    ⚠️ ข้อมูลปัญหาที่รายงานไป:
                  </span>
                  <p>{currentOrder.issueReport.symptoms}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    รายงานเมื่อ: {currentOrder.issueReport.reportedAt} (ไฟล์: {currentOrder.issueReport.photoUrl})
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {currentOrder.status !== 'รับกุ้งแล้ว' && (
                  <button
                    onClick={handleConfirm}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ยืนยันรับกุ้งเรียบร้อย</span>
                  </button>
                )}

                <button
                  onClick={() => setViewMode('report')}
                  className="w-full h-12 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>รายงานปัญหาล็อตนี้ (กุ้งไม่ตรงไซส์ / มีอาการผิดปกติ)</span>
                </button>
              </div>
            </div>
          )}

          {viewMode === 'report' && currentOrder && (
            <form onSubmit={handleSendIssue} className="space-y-3.5">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                แจ้งปัญหาตรงถึงโรงเพาะและฟาร์มต้นทาง เพื่อทำการตรวจสอบย้อนกลับและรับผิดชอบ
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A2B33] block mb-1">
                  อาการหรือปัญหาที่พบ:
                </label>
                <textarea
                  rows={3}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="เช่น กุ้งว่ายผิดปกติ ลอยหัว มีจุดขาว หรือขนาดตัวแตกไซส์ชัดเจน..."
                  className="w-full p-3 bg-white border border-[#F2C9A0] rounded-xl text-xs font-medium text-[#1A2B33] focus:border-[#FF7A1A] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A2B33] block mb-1">
                  แนบรูปถ่ายกุ้ง / หน้าถุง (จำลอง):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadedFileName}
                    onChange={(e) => setUploadedFileName(e.target.value)}
                    placeholder="shrimp_problem_sample.jpg"
                    className="flex-1 h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs text-[#1A2B33]"
                  />
                  <label className="h-11 px-3 bg-[#FFF4EA] border border-[#F2C9A0] text-[#FF7A1A] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer hover:bg-[#FFE9D6]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>เลือกไฟล์</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedFileName(file.name);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('detail')}
                  className="w-1/3 h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold text-xs rounded-xl"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  ส่งรายงานปัญหาให้โรงเพาะ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
