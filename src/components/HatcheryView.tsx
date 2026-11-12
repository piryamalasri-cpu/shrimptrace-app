import React, { useState } from 'react';
import {
  QrCode,
  FileCheck2,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Building,
  User,
  Phone,
  MapPin,
  ClipboardList,
  Layers,
  Activity,
  HeartPulse,
  FishSymbol,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Info,
} from 'lucide-react';
import {
  BiosecurityEntryRecord,
  BroodstockRecord,
  DailyWaterLogRecord,
  FeedingLogRecord,
  HatcheryNavTabId,
  HatcherySeedProduct,
  HealthDailyRecord,
  LabPcrRecord,
  LarvalStageRecord,
  MedicationRecord,
  MovementDocRecord,
  PaymentSlip,
  SalesRecord,
  SeedDeliveryLot,
  TankPrepRecord,
  UserProfile,
  WaterTreatmentRecord,
} from '../types';
import {
  INITIAL_BIOSECURITY,
  INITIAL_BROODSTOCKS,
  INITIAL_FEEDING_LOGS,
  INITIAL_HATCHERY_SEEDS,
  INITIAL_HATCHERY_WATER,
  INITIAL_HEALTH_RECORDS,
  INITIAL_LAB_PCR,
  INITIAL_LARVAL_STAGES,
  INITIAL_MEDICATIONS,
  INITIAL_MOVEMENT_DOCS,
  INITIAL_SEED_DELIVERIES,
  INITIAL_TANK_PREP,
  INITIAL_WATER_TREATMENTS,
} from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface HatcheryViewProps {
  user: UserProfile;
  salesRecords: SalesRecord[];
  onAddSalesRecord: (record: Omit<SalesRecord, 'id'>) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

export const HatcheryView: React.FC<HatcheryViewProps> = ({
  user,
  salesRecords,
  onAddSalesRecord,
  onBackToHome,
  onShowToast,
}) => {
  // Navigation tabs within Hatchery View
  const [activeTab, setActiveTab] = useState<HatcheryNavTabId>('traceability');
  
  // Traceability Categories 1-6
  const [activeTraceCategory, setActiveTraceCategory] = useState<number>(1);

  // Traceability State Data
  const [broodstocks, setBroodstocks] = useState<BroodstockRecord[]>(INITIAL_BROODSTOCKS);
  const [larvalStages, setLarvalStages] = useState<LarvalStageRecord[]>(INITIAL_LARVAL_STAGES);
  const [movementDocs, setMovementDocs] = useState<MovementDocRecord[]>(INITIAL_MOVEMENT_DOCS);
  const [tankPreps, setTankPreps] = useState<TankPrepRecord[]>(INITIAL_TANK_PREP);
  const [waterLogs, setWaterLogs] = useState<DailyWaterLogRecord[]>(INITIAL_HATCHERY_WATER);
  const [treatments, setTreatments] = useState<WaterTreatmentRecord[]>(INITIAL_WATER_TREATMENTS);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLogRecord[]>(INITIAL_FEEDING_LOGS);
  const [healthLogs, setHealthLogs] = useState<HealthDailyRecord[]>(INITIAL_HEALTH_RECORDS);
  const [pcrLogs, setPcrLogs] = useState<LabPcrRecord[]>(INITIAL_LAB_PCR);
  const [medications, setMedications] = useState<MedicationRecord[]>(INITIAL_MEDICATIONS);
  const [biosecurityLogs, setBiosecurityLogs] = useState<BiosecurityEntryRecord[]>(INITIAL_BIOSECURITY);
  const [seedDeliveries, setSeedDeliveries] = useState<SeedDeliveryLot[]>(INITIAL_SEED_DELIVERIES);

  // Seed Menu State
  const [seedProducts, setSeedProducts] = useState<HatcherySeedProduct[]>(INITIAL_HATCHERY_SEEDS);
  const [showAddSeedModal, setShowAddSeedModal] = useState(false);
  const [newSeedBreed, setNewSeedBreed] = useState('กุ้งขาวแวนนาไม (PL12)');
  const [newSeedStage, setNewSeedStage] = useState('PL12 (โพสต์ลาร์วา)');
  const [newSeedPrice, setNewSeedPrice] = useState(0.18);
  const [newSeedStock, setNewSeedStock] = useState(2500000);
  const [newSeedTarget, setNewSeedTarget] = useState<'ลูกค้าทั่วไป' | 'ฟาร์มเลี้ยง' | 'ทั้งสองกลุ่ม'>('ฟาร์มเลี้ยง');

  // Traceability Modals
  const [showQrBagModal, setShowQrBagModal] = useState(false);
  const [selectedBagLot, setSelectedBagLot] = useState<SeedDeliveryLot | null>(INITIAL_SEED_DELIVERIES[0]);
  const [showNewLotModal, setShowNewLotModal] = useState(false);
  const [newLotBatch, setNewLotBatch] = useState('SHR-2026-085');
  const [newLotBreed, setNewLotBreed] = useState('กุ้งขาวแวนนาไม SPF');
  const [newLotQuantity, setNewLotQuantity] = useState(2000000);
  const [newLotRecipient, setNewLotRecipient] = useState('ฟาร์มโชคทวี อะควา (สุราษฎร์ธานี)');
  const [newLotRecipientType, setNewLotRecipientType] = useState<'ฟาร์ม' | 'ลูกค้าทั่วไป'>('ฟาร์ม');
  const [newLotDocNo, setNewLotDocNo] = useState('หนส. 2026/0312');

  // Biosecurity Modal
  const [showBiosecurityModal, setShowBiosecurityModal] = useState(false);
  const [bioName, setBioName] = useState('');
  const [bioType, setBioType] = useState<'บุคลากร' | 'บุคคลภายนอก'>('บุคลากร');
  const [bioOrg, setBioOrg] = useState('');
  const [bioPurpose, setBioPurpose] = useState('');

  // Daily Water Log Modal
  const [showWaterLogModal, setShowWaterLogModal] = useState(false);
  const [wTank, setWTank] = useState('ถังอนุบาล T-04');
  const [wTemp, setWTemp] = useState(29.0);
  const [wSalinity, setWSalinity] = useState(28);
  const [wPh, setWPh] = useState(8.1);
  const [wDo, setWDo] = useState(6.5);
  const [wAlk, setWAlk] = useState(135);
  const [wAmmonia, setWAmmonia] = useState(0.03);
  const [wNitrite, setWNitrite] = useState(0.05);

  // Feed Log Modal
  const [showFeedLogModal, setShowFeedLogModal] = useState(false);
  const [fTank, setFTank] = useState('ถังอนุบาล T-04');
  const [fFeedType, setFFeedType] = useState<'อาหารมีชีวิต (อาร์ทีเมีย)' | 'อาหารสำเร็จรูป'>('อาหารมีชีวิต (อาร์ทีเมีย)');
  const [fBrand, setFBrand] = useState('Artemia Premium Gold');
  const [fMeals, setFMeals] = useState(6);
  const [fGrams, setFGrams] = useState(150);

  // PCR Modal
  const [showPcrModal, setShowPcrModal] = useState(false);
  const [pcrTestType, setPcrTestType] = useState<'WSSV' | 'EMS' | 'EHP' | 'Vibrio / แบคทีเรีย'>('WSSV');
  const [pcrResult, setPcrResult] = useState<'ผ่าน (ปลอดเชื้อ)' | 'ไม่ผ่าน (พบเชื้อ)'>('ผ่าน (ปลอดเชื้อ)');
  const [pcrSample, setPcrSample] = useState<'ลูกกุ้ง' | 'น้ำ'>('ลูกกุ้ง');

  // Medication Modal
  const [showMedModal, setShowMedModal] = useState(false);
  const [medTradeName, setMedTradeName] = useState('');
  const [medActive, setMedActive] = useState('');
  const [medPurpose, setMedPurpose] = useState('');
  const [medAmount, setMedAmount] = useState('');
  const [medWithdrawal, setMedWithdrawal] = useState(0);

  // Copy Link State
  const [copiedLink, setCopiedLink] = useState(false);

  // Profile Edit State
  const [hatcheryName, setHatcheryName] = useState('โรงเพาะฟักไทยพัฒนา เจเนติกส์ (ระยอง)');
  const [hatcheryPhone, setHatcheryPhone] = useState('038-889-1122');
  const [hatcheryAddress, setHatcheryAddress] = useState('99 หมู่ 3 ต.เพ อ.เมือง จ.ระยอง 21160');
  const [hatcheryCertNo, setHatcheryCertNo] = useState('สป. 21020005/2567 (มาตรฐาน มกษ. 7422)');
  const [hatcheryDesc, setHatcheryDesc] = useState('โรงเพาะฟักลูกกุ้งมาตรฐาน GAP ปลอดเชื้อ SPF 100% ตรวจ PCR ทุกรุ่นก่อนส่งมอบ');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleCopyTraceLink = (batchId: string) => {
    playAudioBeep(680, 'sine', 0.15);
    navigator.clipboard?.writeText(`https://shrimptrace.co.th/trace/${batchId}`);
    setCopiedLink(true);
    onShowToast(`คัดลอกลิงก์ตรวจสอบย้อนกลับรุ่น ${batchId} แล้ว`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(720, 'triangle', 0.2);
    const newLot: SeedDeliveryLot = {
      id: `LOT-0${seedDeliveries.length + 1}`,
      batchId: newLotBatch,
      seedQuantity: Number(newLotQuantity),
      stage: 'PL12',
      recipientName: newLotRecipient,
      recipientType: newLotRecipientType,
      movementDocNo: newLotDocNo,
      deliveryDate: '12 ก.พ. 2569',
      deliveryTime: '09:00',
      status: 'จัดส่งแล้ว',
      hatcheryName: hatcheryName,
      breed: newLotBreed,
    };
    setSeedDeliveries([newLot, ...seedDeliveries]);
    setSelectedBagLot(newLot);
    setShowNewLotModal(false);
    setShowQrBagModal(true);
    onShowToast(`สร้างล็อตลูกกุ้ง ${newLotBatch} พร้อมคิวอาร์โค้ดหน้าถุงแล้ว`);
  };

  const handleAddSeedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.15);
    const newProd: HatcherySeedProduct = {
      id: `SEED-0${seedProducts.length + 1}`,
      breedName: newSeedBreed,
      stage: newSeedStage,
      pricePerUnit: Number(newSeedPrice),
      stockQuantity: Number(newSeedStock),
      targetGroup: newSeedTarget,
    };
    setSeedProducts([...seedProducts, newProd]);
    setShowAddSeedModal(false);
    onShowToast(`เพิ่มรายการลูกกุ้ง "${newSeedBreed}" ลงเมนูเรียบร้อย`);
  };

  const handleAddBiosecurity = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(640, 'sine', 0.15);
    const newBio: BiosecurityEntryRecord = {
      id: `BIO-0${biosecurityLogs.length + 1}`,
      type: bioType,
      name: bioName || 'นายสมพร ชัยวัฒน์',
      departmentOrOrg: bioOrg || 'ฝ่ายซ่อมบำรุง',
      purpose: bioPurpose || 'ตรวจสอบระบบเติมออกซิเจน',
      timeIn: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      timeOut: '17:00',
      date: '12 ก.พ. 2569',
    };
    setBiosecurityLogs([newBio, ...biosecurityLogs]);
    setShowBiosecurityModal(false);
    setBioName('');
    setBioOrg('');
    setBioPurpose('');
    onShowToast('บันทึกการเข้า-ออกพื้นที่เพาะฟักเรียบร้อย');
  };

  const handleAddWaterLog = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.15);
    const newLog: DailyWaterLogRecord = {
      id: `HW-0${waterLogs.length + 1}`,
      tankId: wTank,
      date: '12 ก.พ. 2569',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      temp: Number(wTemp),
      salinity: Number(wSalinity),
      ph: Number(wPh),
      dissolvedOxygen: Number(wDo),
      alkalinity: Number(wAlk),
      ammonia: Number(wAmmonia),
      nitrite: Number(wNitrite),
    };
    setWaterLogs([newLog, ...waterLogs]);
    setShowWaterLogModal(false);
    onShowToast(`บันทึกค่าน้ำ ${wTank} เรียบร้อย ค่าน้ำอยู่ในเกณฑ์มาตรฐาน`);
  };

  const handleAddFeedLog = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.15);
    const newLog: FeedingLogRecord = {
      id: `FL-0${feedingLogs.length + 1}`,
      tankId: fTank,
      stage: 'PL12',
      feedType: fFeedType,
      brand: fBrand,
      source: 'ผ่านการฆ่าเชื้อด้วย UV และตรวจสารตกค้าง',
      mealsPerDay: Number(fMeals),
      feedGramsPerMeal: Number(fGrams),
      feedTime: '06:00, 10:00, 14:00, 18:00, 22:00, 02:00',
    };
    setFeedingLogs([newLog, ...feedingLogs]);
    setShowFeedLogModal(false);
    onShowToast(`บันทึกการให้อาหาร ${fTank} เรียบร้อย`);
  };

  const handleAddPcrLog = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(720, 'sine', 0.15);
    const newLog: LabPcrRecord = {
      id: `PCR-0${pcrLogs.length + 1}`,
      date: '12 ก.พ. 2569',
      sampleType: pcrSample,
      testType: pcrTestType,
      result: pcrResult,
      fileName: `pcr_${pcrTestType.toLowerCase()}_result.pdf`,
    };
    setPcrLogs([newLog, ...pcrLogs]);
    setShowPcrModal(false);
    onShowToast(`บันทึกผลตรวจ PCR โรค ${pcrTestType}: ${pcrResult}`);
  };

  const handleAddMedLog = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(640, 'sine', 0.15);
    const safeDate = medWithdrawal === 0
      ? 'ปลอดภัยทันที (ไม่ใช่ยาปฏิชีวนะ)'
      : `ต้องเว้นระยะ ${medWithdrawal} วัน พร้อมส่งมอบหลังพ้นกำหนด`;
    const newMed: MedicationRecord = {
      id: `MED-0${medications.length + 1}`,
      tradeName: medTradeName || 'วิตามินรวมเข้มข้น + บาซิลลัส',
      activeIngredient: medActive || 'Probiotics & Multivitamins',
      purpose: medPurpose || 'บำรุงตับ เสริมภูมิคุ้มกันลูกกุ้ง',
      amountUsed: medAmount || '20 กรัม / น้ำ 10 ตัน',
      usedDate: '12 กุมภาพันธ์ 2569',
      withdrawalDays: Number(medWithdrawal),
      safeReadyDate: safeDate,
      isWithinWithdrawal: Number(medWithdrawal) > 0,
    };
    setMedications([newMed, ...medications]);
    setShowMedModal(false);
    setMedTradeName('');
    setMedActive('');
    setMedPurpose('');
    setMedAmount('');
    onShowToast('บันทึกการใช้ยา/สารชีวภัณฑ์และคำนวณระยะหยุดยาแล้ว');
  };

  const traceCategories = [
    { id: 1, title: '1. ข้อมูลพื้นฐาน & แหล่งที่มา', subtitle: 'พ่อแม่พันธุ์, ตัวอ่อน, หนส.' },
    { id: 2, title: '2. เตรียมบ่อ & ค่าน้ำ', subtitle: 'ล้างฆ่าเชื้อ, พักบ่อ, ค่าน้ำ 7 ตัว' },
    { id: 3, title: '3. การให้อาหาร', subtitle: 'อาร์ทีเมีย, อาหารสำเร็จรูป, ปริมาณ' },
    { id: 4, title: '4. สุขภาพ & ใช้ยา/เคมี', subtitle: 'อัตรารอด, ตรวจ PCR, ระยะหยุดยา' },
    { id: 5, title: '5. ความปลอดภัยทางชีวภาพ', subtitle: 'ประวัติเข้า-ออก บุคลากร & ภายนอก' },
    { id: 6, title: '6. ส่งมอบ & QR หน้าถุง', subtitle: 'สร้าง QR โค้ด, ติดถุง, ประวัติย้อนกลับ' },
  ];

  return (
    <div className="space-y-4 pb-28 max-w-[480px] w-full mx-auto">
      {/* Top Header Card */}
      <div className="shrimp-card p-4 sm:p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={STICKER_MAP.hatchery.src} size={48} alt="โรงเพาะฟัก" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              บทบาท: เจ้าของโรงเพาะฟัก
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A2B33] mt-0.5 leading-tight">
              {hatcheryName}
            </h1>
          </div>
        </div>

        <p className="text-xs text-[#1A2B33]/70 font-semibold mb-3">
          เพาะลูกกุ้งปลอดโรค ตรวจ PCR ออกใบรับรองและระบบ Traceability ครบวงจร 6 ด้าน
        </p>

        {/* 4 Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setActiveTab('traceability');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              activeTab === 'traceability'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>📋 บันทึกย้อน</span>
            <span className="text-[10px]">Trace 6 ด้าน</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setActiveTab('seeds');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              activeTab === 'seeds'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>🦐 เมนูลูกกุ้ง</span>
            <span className="text-[10px]">ขายฟาร์ม/ลูกค้า</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setActiveTab('orders');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>📦 ส่งมอบ</span>
            <span className="text-[10px]">{seedDeliveries.length} ล็อต</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setActiveTab('profile');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              activeTab === 'profile'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>🏢 โปรไฟล์</span>
            <span className="text-[10px]">โรงเพาะ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 6-CATEGORY TRACEABILITY SYSTEM */}
      {/* ========================================================================= */}
      {activeTab === 'traceability' && (
        <div className="space-y-4">
          {/* Quick Category Selector */}
          <div className="shrimp-card p-3 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <span className="text-xs font-black text-[#1A2B33] block mb-2 px-1">
              หมวดหมู่การตรวจสอบย้อนกลับ (เลือกเพื่อดูหรือบันทึก):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {traceCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playAudioBeep(560, 'sine', 0.1);
                    setActiveTraceCategory(c.id);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    activeTraceCategory === c.id
                      ? 'bg-[#FFF4EA] border-[#FF7A1A] shadow-xs'
                      : 'bg-[#FFFDF9] border-[#F2C9A0]/60 hover:bg-[#FFF4EA]/50'
                  }`}
                >
                  <p className="text-xs font-black text-[#1A2B33] truncate">{c.title}</p>
                  <p className="text-[10px] text-[#1A2B33]/60 truncate">{c.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 1. ข้อมูลพื้นฐานและแหล่งที่มา */}
          {activeTraceCategory === 1 && (
            <div className="space-y-3">
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      1
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">พ่อแม่พันธุ์กุ้ง (Broodstock)</h3>
                      <p className="text-xs text-[#1A2B33]/70">บันทึกแหล่งที่มา ใบรับรอง SPF และประวัติเคลื่อนย้าย</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {broodstocks.map((b) => (
                    <div key={b.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-sm text-[#1A2B33]">{b.breed}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          SPF ปลอดเชื้อ 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A2B33]/80">
                        📍 <strong>แหล่งที่มา:</strong> {b.source}
                      </p>
                      <p className="text-[11px] text-[#1A2B33]/80">
                        📜 <strong>เลขที่ใบรับรอง:</strong> <span className="font-mono font-bold text-[#FF7A1A]">{b.certNumber}</span>
                      </p>
                      <p className="text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                        🗓️ วันนำเข้า: {b.importDate} | {b.movementHistory}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ปริมาณและระยะการพัฒนาการ */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <h3 className="text-sm font-black text-[#1A2B33] mb-2.5">
                  ตัวอ่อนในแต่ละระยะ (Nauplii ➔ Zoea ➔ Mysis ➔ PL)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {larvalStages.map((st) => (
                    <div key={st.id} className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#F2C9A0] text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-sm text-[#1A2B33]">{st.stageName}</span>
                        <span className="text-[10px] font-bold text-[#FF7A1A]">{st.pondTankId}</span>
                      </div>
                      <p className="text-xs font-black text-emerald-700 tabular-nums">
                        {(st.quantity / 1000000).toFixed(1)} ล้านตัว
                      </p>
                      <span className="text-[10px] text-[#1A2B33]/60 block mt-0.5">ปล่อยลงถัง: {st.stockedDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movement Permit Document With 2-Year Retention Warning & Countdown */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A2B33]">
                      หนส. และใบกำกับการจำหน่าย (เก็บรักษา 2 ปี)
                    </h3>
                    <p className="text-[10px] text-[#1A2B33]/60">มาตรฐานการตรวจสอบย้อนกลับกรมประมง</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl mb-3 text-xs text-amber-900 leading-relaxed font-medium">
                  ⚠️ <strong>กฎหมายประมง:</strong> ต้องเก็บรักษาเอกสาร หนส. และข้อมูลการซื้อขายไว้ไม่น้อยกว่า <strong>2 ปี (730 วัน)</strong> เพื่อพร้อมรับการตรวจประเมิน GAP
                </div>

                <div className="space-y-2">
                  {movementDocs.map((doc) => (
                    <div key={doc.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-black text-sm text-[#FF7A1A]">{doc.docNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          คงอยู่ครบ 2 ปี
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A2B33]/80">คู่ค้า: {doc.traderName}</p>
                      <div className="flex justify-between text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                        <span>วันที่ออก: {doc.date}</span>
                        <strong className="text-amber-800">เก็บรักษาถึง: {doc.retentionUntil}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. การเตรียมบ่อและการจัดการน้ำ */}
          {activeTraceCategory === 2 && (
            <div className="space-y-3">
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      2
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">การเตรียมถังอนุบาล & พักบ่อ</h3>
                      <p className="text-xs text-[#1A2B33]/70">การล้าง ฆ่าเชื้อ และตากถังพักน้ำ</p>
                    </div>
                  </div>
                </div>

                {tankPreps.map((tp) => (
                  <div key={tp.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-[#1A2B33]">{tp.tankId}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {tp.readyDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1A2B33]/80">
                      🧼 <strong>วิธีทำความสะอาด:</strong> {tp.cleaningMethod}
                    </p>
                    <p className="text-[11px] text-[#1A2B33]/80">
                      🧪 <strong>การฆ่าเชื้อ:</strong> {tp.disinfectionMethod}
                    </p>
                    <p className="text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                      ⏱️ ระยะเวลาพักบ่อ: <strong>{tp.restingDays} วัน</strong>
                    </p>
                  </div>
                ))}
              </div>

              {/* บันทึกค่าน้ำประจำวัน 7 ค่า */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div>
                    <h3 className="text-sm font-black text-[#1A2B33]">ค่าน้ำประจำวันในถังอนุบาล (7 ค่า)</h3>
                    <p className="text-[10px] text-[#1A2B33]/60">อุณหภูมิ, ความเค็ม, pH, DO, แอลคาไลน์, แอมโมเนีย, ไนไตรต์</p>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowWaterLogModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>จดค่าน้ำ</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {waterLogs.map((w) => (
                    <div key={w.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm text-[#1A2B33]">{w.tankId}</span>
                        <span className="text-[10px] font-mono text-[#1A2B33]/60">{w.date} เวลา {w.time} น.</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center font-bold">
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">อุณหภูมิ</span>
                          <span className="text-xs text-[#1A2B33]">{w.temp}°C</span>
                        </div>
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">ความเค็ม</span>
                          <span className="text-xs text-[#1A2B33]">{w.salinity} ppt</span>
                        </div>
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">pH</span>
                          <span className="text-xs text-emerald-700">{w.ph}</span>
                        </div>
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">DO ออกซิเจน</span>
                          <span className="text-xs text-emerald-700">{w.dissolvedOxygen}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-center font-bold">
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">แอลคาลินิตี้</span>
                          <span className="text-xs text-[#1A2B33]">{w.alkalinity} ppm</span>
                        </div>
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">แอมโมเนีย</span>
                          <span className="text-xs text-emerald-700">{w.ammonia} ppm</span>
                        </div>
                        <div className="p-1.5 bg-white border border-[#F2C9A0]/50 rounded-lg">
                          <span className="text-[9px] text-[#1A2B33]/60 block">ไนไตรต์</span>
                          <span className="text-xs text-emerald-700">{w.nitrite} ppm</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* การบำบัดน้ำ */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <h3 className="text-sm font-black text-[#1A2B33] mb-2">
                  การบำบัดน้ำ (คลอรีน, UV, โอโซน)
                </h3>
                <div className="space-y-2">
                  {treatments.map((t) => (
                    <div key={t.id} className="p-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FF7A1A]">{t.agentType}</span>
                        <span className="text-[10px] text-[#1A2B33]/60">{t.usedDate}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#1A2B33]">{t.amount}</p>
                      <p className="text-[10px] text-[#1A2B33]/70">{t.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. การให้อาหาร */}
          {activeTraceCategory === 3 && (
            <div className="space-y-3">
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      3
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">บันทึกการให้อาหารลูกกุ้ง</h3>
                      <p className="text-xs text-[#1A2B33]/70">อาหารมีชีวิต (อาร์ทีเมีย) และอาหารสำเร็จรูป</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowFeedLogModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>จดให้อาหาร</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {feedingLogs.map((f) => (
                    <div key={f.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm text-[#1A2B33]">{f.tankId} ({f.stage})</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FFF4EA] text-[#FF7A1A] font-bold text-[10px] border border-[#F2C9A0]">
                          {f.mealsPerDay} มื้อ/วัน
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A2B33]/80">
                        🦐 <strong>ชนิดอาหาร:</strong> {f.feedType}
                      </p>
                      <p className="text-[11px] text-[#1A2B33]/80">
                        🏷️ <strong>ยี่ห้อ / แหล่งผลิต:</strong> {f.brand}
                      </p>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-[#F2C9A0]/40">
                        <span>ปริมาณ: <strong>{f.feedGramsPerMeal} กรัม/มื้อ</strong></span>
                        <span className="text-[#1A2B33]/60">{f.feedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. สุขภาพและการใช้ยา/สารเคมี */}
          {activeTraceCategory === 4 && (
            <div className="space-y-3">
              {/* Daily Health & Survival */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      4
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">สุขภาพ & อัตรารอดประจำวัน</h3>
                      <p className="text-xs text-[#1A2B33]/70">สังเกตอาการผิดปกติและประเมินอัตราตาย</p>
                    </div>
                  </div>
                </div>

                {healthLogs.map((h) => (
                  <div key={h.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-[#1A2B33]">{h.tankId}</span>
                      <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        อัตรารอด {h.survivalRatePercent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1A2B33]/80">🩺 <strong>อาการ:</strong> {h.abnormalSymptoms}</p>
                    <div className="flex justify-between text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                      <span>อัตราตาย: {h.mortalityCount} ตัว</span>
                      <span>วันที่ตรวจสอบ: {h.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PCR Test Results */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div>
                    <h3 className="text-sm font-black text-[#1A2B33]">ผลตรวจเชื้อระดับ DNA (PCR Lab)</h3>
                    <p className="text-[10px] text-[#1A2B33]/60">WSSV, EMS, EHP และเชื้อแบคทีเรียเรืองแสง</p>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowPcrModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>เพิ่มผล PCR</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {pcrLogs.map((p) => (
                    <div key={p.id} className="p-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <span className="font-black text-[#1A2B33] text-sm">โรค {p.testType}</span>
                        <span className="text-[10px] text-[#1A2B33]/60 block">ตรวจจาก: ตัวอย่าง{p.sampleType} ({p.date})</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                        ✓ {p.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication & Withdrawal Calculation */}
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div>
                    <h3 className="text-sm font-black text-[#1A2B33]">การใช้ยา/สารเคมี & ระยะหยุดยา</h3>
                    <p className="text-[10px] text-[#1A2B33]/60">คำนวณวันปลอดภัยก่อนส่งมอบลูกกุ้ง</p>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowMedModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>จดการใช้ยา</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medications.map((m) => (
                    <div key={m.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-sm text-[#1A2B33]">{m.tradeName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {m.safeReadyDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A2B33]/80">สารสำคัญ: {m.activeIngredient}</p>
                      <p className="text-[11px] text-[#1A2B33]/80">วัตถุประสงค์: {m.purpose} ({m.amountUsed})</p>
                      <div className="flex justify-between text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                        <span>วันที่ใช้: {m.usedDate}</span>
                        <strong className="text-emerald-800">ระยะหยุดยา: {m.withdrawalDays} วัน</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ความปลอดภัยทางชีวภาพ (Biosecurity) */}
          {activeTraceCategory === 5 && (
            <div className="space-y-3">
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      5
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">บันทึกการเข้า-ออกพื้นที่เพาะฟัก</h3>
                      <p className="text-xs text-[#1A2B33]/70">มาตรการควบคุมสุขอนามัยและบุคคลภายนอก</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowBiosecurityModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>ลงชื่อเข้าพื้นที่</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {biosecurityLogs.map((b) => (
                    <div key={b.id} className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-sm text-[#1A2B33]">{b.name}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.type === 'บุคลากร' ? 'bg-[#FFF4EA] text-[#FF7A1A]' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {b.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A2B33]/80">สังกัด / หน่วยงาน: {b.departmentOrOrg}</p>
                      <p className="text-[11px] text-[#1A2B33]/80">วัตถุประสงค์: {b.purpose}</p>
                      <div className="flex justify-between text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                        <span>เวลาเข้า: {b.timeIn} น. | เวลาออก: {b.timeOut} น.</span>
                        <span>{b.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. ส่งมอบ & คิวอาร์โค้ดหน้าถุง (QR Trace Code Generator & Bag Label) */}
          {activeTraceCategory === 6 && (
            <div className="space-y-3">
              <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-sm font-bold text-[#FF7A1A]">
                      6
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#1A2B33]">สร้างคิวอาร์โค้ดหน้าถุงลูกกุ้ง</h3>
                      <p className="text-xs text-[#1A2B33]/70">ออก QR Code ติดข้างถุง เพื่อให้ผู้รับสแกนตรวจย้อนกลับ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playAudioBeep(520, 'sine', 0.1);
                      setShowNewLotModal(true);
                    }}
                    className="h-8 px-2.5 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>สร้างล็อตส่งมอบ</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {seedDeliveries.map((lot) => (
                    <div
                      key={lot.id}
                      className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs space-y-2 hover:border-[#FF7A1A] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-black text-base text-[#FF7A1A]">{lot.batchId}</span>
                          <span className="text-xs font-bold text-[#1A2B33] block">{lot.recipientName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {lot.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#1A2B33]/80 bg-white p-2 rounded-lg border border-[#F2C9A0]/50">
                        <div>
                          <span>สายพันธุ์: <strong>{lot.breed}</strong></span>
                        </div>
                        <div>
                          <span>จำนวน: <strong>{(lot.seedQuantity / 1000000).toFixed(2)} ล้านตัว</strong></span>
                        </div>
                        <div>
                          <span>ระยะ: <strong>{lot.stage}</strong></span>
                        </div>
                        <div>
                          <span>เลข หนส.: <strong className="font-mono">{lot.movementDocNo}</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            playAudioBeep(560, 'sine', 0.1);
                            setSelectedBagLot(lot);
                            setShowQrBagModal(true);
                          }}
                          className="flex-1 h-9 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs shadow-xs"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>ดูป้ายหน้าถุง & QR</span>
                        </button>
                        <button
                          onClick={() => handleCopyTraceLink(lot.batchId)}
                          className="h-9 px-3 bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-lg flex items-center justify-center gap-1 text-xs"
                          title="คัดลอกลิงก์ตรวจสอบย้อนกลับ"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#FF7A1A]" />
                          <span>คัดลอกลิงก์</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SEED MENU (ขายให้ฟาร์ม & ขายให้ลูกค้า) */}
      {/* ========================================================================= */}
      {activeTab === 'seeds' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">รายการลูกกุ้งที่พร้อมส่งมอบ</h3>
                <p className="text-xs text-[#1A2B33]/70">มีป้ายกลุ่มเป้าหมาย (ขายให้ฟาร์ม / ขายให้ลูกค้า)</p>
              </div>
              <button
                onClick={() => {
                  playAudioBeep(520, 'sine', 0.1);
                  setShowAddSeedModal(true);
                }}
                className="h-9 px-3 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>เพิ่มชนิดลูกกุ้ง</span>
              </button>
            </div>

            <div className="space-y-3">
              {seedProducts.map((p) => (
                <div key={p.id} className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-sm text-[#1A2B33]">{p.breedName}</span>
                      <span className="text-[11px] text-[#1A2B33]/70 block">{p.stage}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      p.targetGroup === 'ฟาร์มเลี้ยง'
                        ? 'bg-blue-100 text-blue-800'
                        : p.targetGroup === 'ลูกค้าทั่วไป'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      🏷️ {p.targetGroup}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#FFF4EA] p-2 rounded-xl border border-[#F2C9A0]/60">
                    <span className="text-xs text-[#1A2B33]/80">ราคาเสนอขาย:</span>
                    <strong className="text-base font-black text-[#FF7A1A] tabular-nums">
                      {p.pricePerUnit} บาท/ตัว
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-[#1A2B33]/70">
                    <span>คงเหลือในโรงเพาะ:</span>
                    <strong className="font-bold text-[#1A2B33]">{(p.stockQuantity / 1000000).toFixed(2)} ล้านตัว</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ORDERS & DISPATCH LOG */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">รายการจัดส่งลูกกุ้ง (Dispatch & Deliveries)</h3>
                <p className="text-xs text-[#1A2B33]/70">ตรวจสอบสถานะการรับมอบและเวลาจริง</p>
              </div>
            </div>

            <div className="space-y-3">
              {seedDeliveries.map((lot) => (
                <div key={lot.id} className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-black text-sm text-[#FF7A1A]">{lot.batchId}</span>
                      <h4 className="font-black text-[#1A2B33]">{lot.recipientName}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {lot.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#1A2B33]/80 space-y-0.5">
                    <p>พันธุ์: {lot.breed} ({lot.stage})</p>
                    <p>จำนวน: {lot.seedQuantity.toLocaleString()} ตัว</p>
                    <p>เลข หนส.: {lot.movementDocNo}</p>
                  </div>

                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-900 flex justify-between items-center">
                    <span>🚚 ออกเดินทาง: {lot.deliveryDate} เวลา {lot.deliveryTime} น.</span>
                    {lot.receivedTime && <span>✓ รับมอบ: {lot.receivedTime} น.</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HATCHERY PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <h3 className="text-base font-black text-[#1A2B33]">ข้อมูลโรงเพาะฟัก (Hatchery Profile)</h3>
              <button
                onClick={() => {
                  playAudioBeep(520, 'sine', 0.1);
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="h-8 px-3 bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-xs font-bold text-[#FF7A1A] rounded-lg"
              >
                {isEditingProfile ? 'ยกเลิก' : 'แก้ไข'}
              </button>
            </div>

            {isEditingProfile ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  playAudioBeep(680, 'triangle', 0.2);
                  setIsEditingProfile(false);
                  onShowToast('อัปเดตข้อมูลโรงเพาะฟักเรียบร้อย');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold mb-1">ชื่อโรงเพาะฟัก:</label>
                  <input
                    type="text"
                    value={hatcheryName}
                    onChange={(e) => setHatcheryName(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">เบอร์โทรศัพท์:</label>
                  <input
                    type="text"
                    value={hatcheryPhone}
                    onChange={(e) => setHatcheryPhone(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">เลขทะเบียนรับรองมาตรฐาน (GAP/มกษ.):</label>
                  <input
                    type="text"
                    value={hatcheryCertNo}
                    onChange={(e) => setHatcheryCertNo(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ที่ตั้ง:</label>
                  <input
                    type="text"
                    value={hatcheryAddress}
                    onChange={(e) => setHatcheryAddress(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">คำอธิบาย:</label>
                  <textarea
                    value={hatcheryDesc}
                    onChange={(e) => setHatcheryDesc(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs"
                >
                  บันทึกข้อมูลโรงเพาะฟัก
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl space-y-1.5">
                  <span className="text-[10px] text-[#1A2B33]/60 block">ชื่อสถานประกอบการ</span>
                  <p className="text-base font-black text-[#1A2B33]">{hatcheryName}</p>
                  <p className="text-[#1A2B33]/80">📞 {hatcheryPhone}</p>
                  <p className="text-[#1A2B33]/80">📍 {hatcheryAddress}</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 block">มาตรฐานการรับรอง</span>
                  <p className="text-xs font-black text-emerald-900">{hatcheryCertNo}</p>
                  <p className="text-[11px] text-emerald-800/80">ระบบควบคุมทางชีวภาพและปลอดโรค SPF 100%</p>
                </div>

                <div className="p-3 bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl">
                  <span className="text-[10px] text-[#1A2B33]/60 block mb-0.5">คำแนะนำโรงเพาะ</span>
                  <p className="text-xs text-[#1A2B33] leading-relaxed">{hatcheryDesc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: QR CODE BAG LABEL (NO PRINT / NO PDF PER RULE) */}
      {/* ========================================================================= */}
      {showQrBagModal && selectedBagLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[420px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative text-center">
            <button
              onClick={() => setShowQrBagModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
            >
              <X className="w-6 h-6" />
            </button>

            <ShrimpSticker size="sm" withBadge className="mx-auto mb-2" />
            <h3 className="text-lg font-black text-[#1A2B33]">
              ป้ายติดข้างถุงลูกกุ้ง & QR Code
            </h3>
            <p className="text-xs text-[#1A2B33]/70 mb-3">
              ใช้ติดข้างถุง / กล่องโฟม ให้ฟาร์มสแกนรับเข้าบ่อได้ทันที
            </p>

            {/* Simulated Bag Sticker Frame */}
            <div className="bg-white border-2 border-dashed border-[#FF7A1A] p-4 rounded-2xl text-left space-y-2 mb-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#F2C9A0]/60 pb-2">
                <div>
                  <span className="text-[10px] text-[#FF7A1A] font-bold block">รหัสลูกกุ้งรุ่นนี้</span>
                  <strong className="font-mono text-base font-black text-[#1A2B33]">{selectedBagLot.batchId}</strong>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  PCR ปลอดโรค 100%
                </span>
              </div>

              {/* QR Code Canvas Representation */}
              <div className="w-40 h-40 mx-auto bg-white p-2 border-2 border-[#FF7A1A] rounded-xl flex items-center justify-center my-2 shadow-xs">
                <QrCode className="w-32 h-32 text-[#1A2B33]" />
              </div>

              <div className="text-xs space-y-1 bg-[#FFFDF9] p-2.5 rounded-xl border border-[#F2C9A0]/40">
                <p>• <strong>สายพันธุ์:</strong> {selectedBagLot.breed} ({selectedBagLot.stage})</p>
                <p>• <strong>จำนวน:</strong> {selectedBagLot.seedQuantity.toLocaleString()} ตัว</p>
                <p>• <strong>ผู้รับมอบ:</strong> {selectedBagLot.recipientName}</p>
                <p>• <strong>โรงเพาะฟัก:</strong> {selectedBagLot.hatcheryName}</p>
                <p>• <strong>เลข หนส.:</strong> <span className="font-mono">{selectedBagLot.movementDocNo}</span></p>
                <p>• <strong>วันส่งมอบ:</strong> {selectedBagLot.deliveryDate} เวลา {selectedBagLot.deliveryTime} น.</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCopyTraceLink(selectedBagLot.batchId)}
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLink ? 'คัดลอกเรียบร้อยแล้ว!' : 'คัดลอกลิงก์ตรวจสอบย้อนกลับ'}</span>
              </button>
              <button
                onClick={() => setShowQrBagModal(false)}
                className="w-full h-11 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-xl"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW LOT */}
      {/* ========================================================================= */}
      {showNewLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[420px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button
              onClick={() => setShowNewLotModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-black text-[#1A2B33] mb-3">
              สร้างล็อตส่งมอบลูกกุ้งใหม่
            </h3>

            <form onSubmit={handleCreateLot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">รหัสกุ้งรุ่นนี้ (Batch):</label>
                  <input
                    type="text"
                    value={newLotBatch}
                    onChange={(e) => setNewLotBatch(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">จำนวน (ตัว):</label>
                  <input
                    type="number"
                    value={newLotQuantity}
                    onChange={(e) => setNewLotQuantity(Number(e.target.value))}
                    step={100000}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">สายพันธุ์ลูกกุ้ง:</label>
                <select
                  value={newLotBreed}
                  onChange={(e) => setNewLotBreed(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                >
                  <option value="กุ้งขาวแวนนาไม SPF">กุ้งขาวแวนนาไม SPF</option>
                  <option value="กุ้งกุลาดำ SPF">กุ้งกุลาดำ SPF</option>
                  <option value="กุ้งก้ามกรามคัดเพศผู้">กุ้งก้ามกรามคัดเพศผู้</option>
                  <option value="กุ้งแชบ๊วยธรรมชาติ">กุ้งแชบ๊วยธรรมชาติ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">ชื่อผู้รับมอบ / ฟาร์ม:</label>
                <input
                  type="text"
                  value={newLotRecipient}
                  onChange={(e) => setNewLotRecipient(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ประเภทผู้รับ:</label>
                  <select
                    value={newLotRecipientType}
                    onChange={(e) => setNewLotRecipientType(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  >
                    <option value="ฟาร์ม">ฟาร์มเลี้ยง</option>
                    <option value="ลูกค้าทั่วไป">ลูกค้าทั่วไป</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">เลข หนส.:</label>
                  <input
                    type="text"
                    value={newLotDocNo}
                    onChange={(e) => setNewLotDocNo(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLotModal(false)}
                  className="h-12 w-1/3 bg-white border border-[#F2C9A0] font-bold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs"
                >
                  ออก QR หน้าถุง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER QUICK MODALS: ADD SEED, BIOSECURITY, WATER, FEED, PCR, MED */}
      {/* ========================================================================= */}
      {showAddSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowAddSeedModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">เพิ่มชนิดลูกกุ้งในเมนู</h3>
            <form onSubmit={handleAddSeedProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ชื่อสายพันธุ์และระยะ:</label>
                <input
                  type="text"
                  value={newSeedBreed}
                  onChange={(e) => setNewSeedBreed(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ราคา/ตัว (บาท):</label>
                  <input
                    type="number"
                    step={0.01}
                    value={newSeedPrice}
                    onChange={(e) => setNewSeedPrice(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">จำนวนในสต็อก (ตัว):</label>
                  <input
                    type="number"
                    step={100000}
                    value={newSeedStock}
                    onChange={(e) => setNewSeedStock(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">กลุ่มเป้าหมาย:</label>
                <select
                  value={newSeedTarget}
                  onChange={(e) => setNewSeedTarget(e.target.value as any)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                >
                  <option value="ฟาร์มเลี้ยง">ฟาร์มเลี้ยง</option>
                  <option value="ลูกค้าทั่วไป">ลูกค้าทั่วไป</option>
                  <option value="ทั้งสองกลุ่ม">ทั้งสองกลุ่ม</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกลูกกุ้งลงเมนู
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Biosecurity Entry Modal */}
      {showBiosecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowBiosecurityModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">บันทึกการเข้า-ออกพื้นที่เพาะฟัก</h3>
            <form onSubmit={handleAddBiosecurity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ชื่อ-นามสกุล:</label>
                <input
                  type="text"
                  placeholder="เช่น นายกิตติศักดิ์ พานิชย์"
                  value={bioName}
                  onChange={(e) => setBioName(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ประเภท:</label>
                  <select
                    value={bioType}
                    onChange={(e) => setBioType(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  >
                    <option value="บุคลากร">บุคลากรประจำ</option>
                    <option value="บุคคลภายนอก">บุคคลภายนอก</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">สังกัด/แผนก:</label>
                  <input
                    type="text"
                    placeholder="เช่น ฝ่ายอนุบาล"
                    value={bioOrg}
                    onChange={(e) => setBioOrg(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">วัตถุประสงค์การเข้าพื้นที่:</label>
                <input
                  type="text"
                  placeholder="เช่น วัดค่าน้ำรอบเช้าและให้อาหาร"
                  value={bioPurpose}
                  onChange={(e) => setBioPurpose(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกการเข้าพื้นที่
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Daily Water Log Modal */}
      {showWaterLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[420px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowWaterLogModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">จดค่าน้ำประจำวัน 7 ตัว</h3>
            <form onSubmit={handleAddWaterLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ถังอนุบาล:</label>
                <input
                  type="text"
                  value={wTank}
                  onChange={(e) => setWTank(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">อุณหภูมิ (°C):</label>
                  <input
                    type="number"
                    step={0.1}
                    value={wTemp}
                    onChange={(e) => setWTemp(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ความเค็ม (ppt):</label>
                  <input
                    type="number"
                    value={wSalinity}
                    onChange={(e) => setWSalinity(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">pH:</label>
                  <input
                    type="number"
                    step={0.1}
                    value={wPh}
                    onChange={(e) => setWPh(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">DO ออกซิเจน (mg/L):</label>
                  <input
                    type="number"
                    step={0.1}
                    value={wDo}
                    onChange={(e) => setWDo(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกค่าน้ำ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feed Log Modal */}
      {showFeedLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowFeedLogModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">จดบันทึกการให้อาหารลูกกุ้ง</h3>
            <form onSubmit={handleAddFeedLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ถังอนุบาล:</label>
                <input
                  type="text"
                  value={fTank}
                  onChange={(e) => setFTank(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">ชนิดอาหาร:</label>
                <select
                  value={fFeedType}
                  onChange={(e) => setFFeedType(e.target.value as any)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                >
                  <option value="อาหารมีชีวิต (อาร์ทีเมีย)">อาหารมีชีวิต (อาร์ทีเมีย)</option>
                  <option value="อาหารสำเร็จรูป">อาหารสำเร็จรูป</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">มื้อต่อวัน:</label>
                  <input
                    type="number"
                    value={fMeals}
                    onChange={(e) => setFMeals(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">กรัมต่อมื้อ:</label>
                  <input
                    type="number"
                    value={fGrams}
                    onChange={(e) => setFGrams(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกการให้อาหาร
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PCR Modal */}
      {showPcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowPcrModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">เพิ่มผลตรวจแล็บ PCR</h3>
            <form onSubmit={handleAddPcrLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">เชื้อที่ตรวจ:</label>
                <select
                  value={pcrTestType}
                  onChange={(e) => setPcrTestType(e.target.value as any)}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                >
                  <option value="WSSV">WSSV (ไวรัสดวงขาว)</option>
                  <option value="EMS">EMS (โรคตายด่วน)</option>
                  <option value="EHP">EHP (โรคขี้ขาว)</option>
                  <option value="Vibrio / แบคทีเรีย">Vibrio / แบคทีเรียเรืองแสง</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ตัวอย่างทดสอบ:</label>
                  <select
                    value={pcrSample}
                    onChange={(e) => setPcrSample(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  >
                    <option value="ลูกกุ้ง">ลูกกุ้ง</option>
                    <option value="น้ำ">น้ำอนุบาล</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">ผลการตรวจ:</label>
                  <select
                    value={pcrResult}
                    onChange={(e) => setPcrResult(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  >
                    <option value="ผ่าน (ปลอดเชื้อ)">ผ่าน (ปลอดเชื้อ)</option>
                    <option value="ไม่ผ่าน (พบเชื้อ)">ไม่ผ่าน (พบเชื้อ)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกผลแล็บ PCR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Medication Modal */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button onClick={() => setShowMedModal(false)} className="absolute top-4 right-4 p-2 text-[#1A2B33]/70">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-black text-[#1A2B33] mb-3">บันทึกการใช้ยา & คำนวณระยะหยุดยา</h3>
            <form onSubmit={handleAddMedLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ชื่อการค้า / ชื่อสาร:</label>
                <input
                  type="text"
                  placeholder="เช่น โพรไบโอติกบาซิลลัส หรือ วิตามินซี"
                  value={medTradeName}
                  onChange={(e) => setMedTradeName(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">ปริมาณที่ใช้:</label>
                  <input
                    type="text"
                    placeholder="เช่น 50 กรัม/น้ำ 10 ตัน"
                    value={medAmount}
                    onChange={(e) => setMedAmount(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ระยะหยุดยา (วัน):</label>
                  <input
                    type="number"
                    value={medWithdrawal}
                    onChange={(e) => setMedWithdrawal(Number(e.target.value))}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs mt-2"
              >
                บันทึกและคำนวณวันปลอดภัย
              </button>
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
          <ShrimpSticker size="sm" />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>
    </div>
  );
};
