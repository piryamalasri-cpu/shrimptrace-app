export interface StickerInfo {
  id: string;
  num: number;
  title: string;
  description: string;
  src: string;
}

export const STICKERS: StickerInfo[] = [
  {
    id: 'logo',
    num: 1,
    title: 'โลโก้กุ้งส้มตัวกลมยิ้ม',
    description: 'กุ้งส้มตัวกลมน่ารัก ยิ้มแก้มชมพู สัญลักษณ์ ShrimpTrace',
    src: '/src/assets/images/shrimp_logo_sticker_1794416778119.jpg',
  },
  {
    id: 'feed',
    num: 2,
    title: 'ให้อาหาร',
    description: 'ชามอาหารกุ้ง + กุ้งตัวเล็กโผล่มาเกาะขอบชาม',
    src: '/src/assets/images/feed_shrimp_sticker_1794416830933.jpg',
  },
  {
    id: 'water',
    num: 3,
    title: 'วัดน้ำ',
    description: 'หยดน้ำสีฟ้าอ่อน + หลอดทดลอง + เครื่องหมายถูกเขียว',
    src: '/src/assets/images/water_test_sticker_1794416833554.jpg',
  },
  {
    id: 'sick',
    num: 4,
    title: 'แจ้งว่ากุ้งป่วย',
    description: 'กุ้งหน้ากังวล + ปรอทวัดไข้ + หัวใจกาชาด',
    src: '/src/assets/images/sick_shrimp_sticker_1794416833663.jpg',
  },
  {
    id: 'alert',
    num: 5,
    title: 'เตือน',
    description: 'สามเหลี่ยมเตือนสีเหลือง หน้าตาแปลกใจน่ารัก',
    src: '/src/assets/images/alert_warning_sticker_1794416834321.jpg',
  },
  {
    id: 'pond',
    num: 6,
    title: 'บ่อของฉัน',
    description: 'บ่อกุ้ง + ใบพัดตีน้ำ + กุ้ง 2 ตัวเล่นน้ำ',
    src: '/src/assets/images/shrimp_pond_sticker_1794416835043.jpg',
  },
  {
    id: 'money',
    num: 7,
    title: 'ดูเงิน / ขายกุ้ง',
    description: 'เหรียญบาท + ธนบัตรไทย + กุ้งยิ้มรับทรัพย์',
    src: '/src/assets/images/sales_money_sticker_1794416870591.jpg',
  },
  {
    id: 'tasks',
    num: 8,
    title: 'งานวันนี้',
    description: 'คลิปบอร์ด checklist + เครื่องหมายถูกฟาร์ม',
    src: '/src/assets/images/daily_tasks_sticker_1794416857622.jpg',
  },
  {
    id: 'hatchery',
    num: 9,
    title: 'โรงเพาะฟัก',
    description: 'ถังเพาะลูกกุ้งตัวจิ๋ว + ฟองอากาศลอย',
    src: '/src/assets/images/hatchery_tank_sticker_1794416858886.jpg',
  },
  {
    id: 'factory',
    num: 10,
    title: 'โรงงานแปรรูป',
    description: 'ตึกโรงงาน + กล่องห้องเย็น + กุ้งคุณภาพ',
    src: '/src/assets/images/factory_cold_sticker_1794416859431.jpg',
  },
  {
    id: 'ems',
    num: 11,
    title: 'EMS / ตายด่วน',
    description: 'กุ้งตัวซีด หน้าเศร้า ตับลีบ มีหยดน้ำตา',
    src: '/src/assets/images/ems_shrimp_sticker_1794416859565.jpg',
  },
  {
    id: 'ehp',
    num: 12,
    title: 'EHP / ขี้ขาว',
    description: 'กุ้งตัวเล็กไม่เท่ากัน โตช้า + ขี้ขาวลอยน้ำ',
    src: '/src/assets/images/ehp_shrimp_sticker_1794416891569.jpg',
  },
  {
    id: 'wssv',
    num: 13,
    title: 'WSSV / ตัวแดงดวงขาว',
    description: 'กุ้งแดง มีจุดขาวกลมบนเปลือก',
    src: '/src/assets/images/wssv_shrimp_sticker_1794416892116.jpg',
  },
  {
    id: 'vibrio',
    num: 14,
    title: 'ตัวแดง / Vibrio',
    description: 'กุ้งแดง มีจุดเชื้อแบคทีเรียเล็กๆ',
    src: '/src/assets/images/vibrio_shrimp_sticker_1794416892493.jpg',
  },
  {
    id: 'soft_shell',
    num: 15,
    title: 'ตัวนิ่ม / เปลือกนิ่ม',
    description: 'กุ้งเปลือกอ่อนย้วย + หยดแร่ธาตุและประกายแคลเซียม',
    src: '/src/assets/images/soft_shell_sticker_1794416894015.jpg',
  },
];

const rawMap = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
if (rawMap.pond) {
  rawMap.my_pond = rawMap.pond;
}

export const STICKER_MAP: Record<string, StickerInfo> = new Proxy(rawMap, {
  get(target, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    if (prop === 'my_pond') {
      return target.pond || target.logo || STICKERS[0];
    }
    // Return default logo sticker instead of undefined
    return target.logo || STICKERS[0];
  },
});
