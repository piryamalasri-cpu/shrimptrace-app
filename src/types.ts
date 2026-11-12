export type RoleId = 
  | 'hatchery'   // เจ้าของโรงเพาะฟัก
  | 'owner'      // เจ้าของฟาร์ม (คนเลี้ยงกุ้ง)
  | 'customer';   // ผู้ใช้งาน / ลูกค้า (Customer)

export type FarmerNavTabId = 
  | 'home'       // หน้าหลัก
  | 'ponds'      // บ่อของฉัน
  | 'tasks'      // งานวันนี้
  | 'sell'       // ขายกุ้ง
  | 'breeds'     // พันธุ์กุ้ง
  | 'diseases'   // โรคกุ้ง
  | 'prices'     // ราคากุ้ง
  | 'money'      // ดูเงิน
  | 'myfarm'     // โปรไฟล์ฟาร์มของฉัน
  | 'orderseed';  // สั่งลูกกุ้งจากโรงเพาะ

export type CustomerNavTabId =
  | 'broadcast'  // ประกาศซื้อ (ไอคอนลำโพงส้ม)
  | 'market'     // ตลาดฟาร์มกุ้ง
  | 'prices'     // ราคากุ้ง (ป้ายราคา/เหรียญบาทเขียว)
  | 'diseases'   // โรคกุ้ง (กุ้งป่วย+กากบาทแดง)
  | 'breeds'     // พันธุ์กุ้ง (รูปกุ้งหลายพันธุ์)
  | 'history'    // ประวัติการซื้อ (ถุงช้อปปิ้ง/ตะกร้า)
  | 'slips';     // สลิป (ใบเสร็จ/สลิป)

export type HatcheryNavTabId =
  | 'profile'      // โปรไฟล์โรงเพาะของฉัน
  | 'seeds'        // ลูกกุ้งของฉัน
  | 'orders'       // ออเดอร์ลูกกุ้ง
  | 'traceability' // บันทึก Traceability โรงเพาะ
  | 'chat'         // แชทลูกค้า
  | 'slips';       // สลิป & ประวัติส่งมอบ

export type NavTabId = FarmerNavTabId | CustomerNavTabId | HatcheryNavTabId;

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  farmName: string;
  province: string;
  address: string;
  description: string;
  avatarUrl?: string;
  role: RoleId;
}

export type WaterStatus = 'good' | 'warning' | 'danger'; // น้ำดี, น้ำเริ่มแย่, น้ำอันตราย
export type PondType = 'บ่อดิน' | 'บ่อปูน' | 'บ่อปูผ้าใบ';

export interface Pond {
  id: string;
  name: string;
  pondType: PondType;
  breedId: string;
  breed: string;
  areaRai: number;
  stockedCount: number;
  stockingDate: string;
  ageDays: number;
  weightGrams: number;
  waterStatus: WaterStatus;
  waterStatusText: string;
  conditionText: string; // ปกติ, ต้องดู, อันตราย
  
  // Water parameters
  ph: number;              // 7.5 - 8.5
  dissolvedOxygen: number; // > 5 mg/L
  ammonia: number;         // < 0.1 ppm
  nitrite: number;         // < 0.5 ppm
  alkalinity: number;      // 100 - 150 ppm
  salinity: number;        // ppt (เกณฑ์ตามพันธุ์)
  temperature: number;     // 28 - 32 °C
  
  lastFedKg: number;
  feedTrayConsumedPercent: number;
  shrimpCount: number;
  shrimpPerKg: number;
  aeratorRunning?: boolean;
  warningNote?: string;
  breedImg?: string;
}

export interface ShrimpBreed {
  id: string;
  nameThai: string;
  nameEng: string;
  daysToHarvest: string;
  daysNumber: number;
  avgPrice: string;
  appearance: string;
  highlights: string;
  description: string;
  realImg: string;
  optimalSalinityMin: number;
  optimalSalinityMax: number;
  waterEnv: string;
}

export interface ShrimpDisease {
  id: string;
  code: string;
  nameThai: string;
  nameEng: string;
  severity: 'danger' | 'warning';
  severityText: string;
  colorTag: string;
  dangerPeriod: string;
  symptoms: string[];
  remedy: string[];
}

export interface PriceRow {
  sizeCount: number; // 40, 50, 60, 70, 80
  priceToday: number;
  priceYesterday: number;
  diff: number;
  diffTrend: 'up' | 'down' | 'same';
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  completed: boolean;
  pond: string;
}

export interface BuyingBroadcast {
  id: string;
  breed: string;
  quantityKg: number;
  budgetPricePerKg: number;
  province: string;
  neededDate: string;
  phone: string;
  buyerName: string;
  note?: string;
  createdAt: string;
}

export interface FarmReview {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FarmShrimpProduct {
  id: string;
  breedId: string;
  breedName: string;
  sizeCount: string;
  pricePerKg: number;
  availableKg: number;
  readyDate: string;
  realImg: string;
}

export interface FarmListing {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  province: string;
  address: string;
  rating: number;
  reviewCount: number;
  heroImg: string;
  deliveryOption: 'ฟาร์มส่งให้' | 'ไปรับเอง' | 'ทั้งสองแบบ';
  deliveryFeeNote: string;
  products: FarmShrimpProduct[];
  reviews: FarmReview[];
}

export interface CustomerOrder {
  id: string;
  batchId: string;
  farmId: string;
  farmName: string;
  farmAddress: string;
  farmPhone: string;
  breedName: string;
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  deliveryMethod: 'ไปรับเอง' | 'ฟาร์มส่งให้';
  orderDate: string;
  deliveryDate: string;
  receivedDate?: string;
  status: 'รอจัดส่ง' | 'กำลังจัดส่ง' | 'รับกุ้งแล้ว' | 'รอตรวจสอบจากโรงเพาะ' | 'รายงานปัญหา';
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  slipId?: string;
  issueReport?: {
    symptoms: string;
    photoUrl?: string;
    reportedAt: string;
  };
}

export interface PaymentSlip {
  id: string;
  orderId: string;
  slipNumber: string;
  farmName: string;
  breedName: string;
  quantityKg: number;
  amount: number;
  orderDateTime: string;
  deliveryDateTime: string;
  status: 'paid';
}

// Hatchery Traceability Types
export interface HatcherySeedProduct {
  id: string;
  breedName: string;
  stage: string; // e.g. PL10, PL12
  pricePerUnit: number; // บาท / ตัว
  stockQuantity: number;
  targetGroup: 'ลูกค้าทั่วไป' | 'ฟาร์มเลี้ยง' | 'ทั้งสองกลุ่ม';
}

export interface BroodstockRecord {
  id: string;
  source: string;
  importDate: string;
  breed: string;
  spfCertified: boolean;
  certNumber: string;
  movementHistory: string;
}

export interface LarvalStageRecord {
  id: string;
  stageName: 'Nauplii' | 'Zoea' | 'Mysis' | 'PL';
  quantity: number;
  pondTankId: string;
  stockedDate: string;
}

export interface MovementDocRecord {
  id: string;
  docNumber: string;
  traderName: string;
  date: string;
  retentionUntil: string;
  fileName: string;
  isCompliant2Years: boolean;
}

export interface TankPrepRecord {
  id: string;
  tankId: string;
  cleaningMethod: string;
  disinfectionMethod: string;
  restingDays: number;
  readyDate: string;
}

export interface DailyWaterLogRecord {
  id: string;
  tankId: string;
  date: string;
  time: string;
  temp: number;
  salinity: number;
  ph: number;
  dissolvedOxygen: number;
  alkalinity: number;
  ammonia: number;
  nitrite: number;
}

export interface WaterTreatmentRecord {
  id: string;
  agentType: 'คลอรีน' | 'UV' | 'สารฆ่าเชื้อ' | 'โอโซน';
  amount: string;
  usedDate: string;
  notes: string;
}

export interface FeedingLogRecord {
  id: string;
  tankId: string;
  stage: string;
  feedType: 'อาหารมีชีวิต (อาร์ทีเมีย)' | 'อาหารสำเร็จรูป';
  brand: string;
  source: string;
  mealsPerDay: number;
  feedGramsPerMeal: number;
  feedTime: string;
}

export interface HealthDailyRecord {
  id: string;
  tankId: string;
  date: string;
  survivalRatePercent: number;
  abnormalSymptoms: string;
  mortalityCount: number;
}

export interface LabPcrRecord {
  id: string;
  date: string;
  sampleType: 'ลูกกุ้ง' | 'น้ำ';
  testType: 'WSSV' | 'EMS' | 'EHP' | 'Vibrio / แบคทีเรีย';
  result: 'ผ่าน (ปลอดเชื้อ)' | 'ไม่ผ่าน (พบเชื้อ)';
  fileName: string;
}

export interface MedicationRecord {
  id: string;
  tradeName: string;
  activeIngredient: string;
  purpose: string;
  amountUsed: string;
  usedDate: string;
  withdrawalDays: number;
  safeReadyDate: string;
  isWithinWithdrawal: boolean;
}

export interface BiosecurityEntryRecord {
  id: string;
  type: 'บุคลากร' | 'บุคคลภายนอก';
  name: string;
  departmentOrOrg: string;
  purpose: string;
  timeIn: string;
  timeOut: string;
  date: string;
}

export interface SeedDeliveryLot {
  id: string;
  batchId: string;
  seedQuantity: number;
  stage: string;
  recipientName: string;
  recipientType: 'ฟาร์ม' | 'ลูกค้าทั่วไป';
  movementDocNo: string;
  deliveryDate: string;
  deliveryTime: string;
  receivedDate?: string;
  receivedTime?: string;
  status: 'จัดส่งแล้ว' | 'รับกุ้งแล้ว' | 'รอตรวจสอบจากโรงเพาะ';
  issueNotes?: string;
  hatcheryName: string;
  breed: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface SalesRecord {
  id: string;
  farmName: string;
  batchId: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  pcrResult: string;
  deliveryDate: string;
}
