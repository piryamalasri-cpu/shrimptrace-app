import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MapPin,
  Edit3,
  Camera,
  CheckCircle2,
  Clock,
  Truck,
  PlusCircle,
  Receipt,
  ShoppingBag,
  ExternalLink,
  QrCode,
  DollarSign,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { CustomerOrder, HatcherySeedProduct, PaymentSlip, UserProfile } from '../types';
import { INITIAL_HATCHERY_SEEDS } from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeStickerSrc, getSafeImage, handleImageError, FALLBACK_FARM_IMG, FALLBACK_SHRIMP_IMG } from '../utils/imageFallback';
import { playAudioBeep } from '../utils/audio';

interface FarmerProfileViewProps {
  user: UserProfile;
  customerOrders: CustomerOrder[];
  paymentSlips: PaymentSlip[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  onOpenSeedOrderModal?: (seed: HatcherySeedProduct) => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  user,
  customerOrders,
  paymentSlips,
  onUpdateUser,
  onUpdateOrderStatus,
  onBackToHome,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'info' | 'orders' | 'slips' | 'orderseed'>('info');
  const [isEditing, setIsEditing] = useState(false);

  // Profile fields state
  const [farmName, setFarmName] = useState(user.farmName || 'ฟาร์มสมชาย ซีฟู้ด (บางบ่อ)');
  const [ownerName, setOwnerName] = useState(user.name || 'สมชาย เจริญฟาร์ม');
  const [phone, setPhone] = useState(user.phone || '081-998-7654');
  const [province, setProvince] = useState(user.province || 'สมุทรปราการ');
  const [address, setAddress] = useState(user.address || '88/2 หมู่ 4 ต.บางบ่อ อ.บางบ่อ จ.สมุทรปราการ');
  const [description, setDescription] = useState(
    user.description || 'ฟาร์มกุ้งขาวแวนนาไมและกุ้งกุลาดำระบบปิด มาตรฐาน GAP และโค้ดตรวจสอบย้อนกลับสากล'
  );

  // Farm photos gallery
  const [farmPhotos, setFarmPhotos] = useState<string[]>([
    '/src/assets/images/real_farm_landscape_1794481102462.jpg',
    '/src/assets/images/real_shrimp_vannamei_1794481099500.jpg',
    '/src/assets/images/real_shrimp_monodon_1794481100219.jpg',
  ]);

  // Shrimp pricing setup state
  const [vannameiPrice, setVannameiPrice] = useState(190);
  const [monodonPrice, setMonodonPrice] = useState(290);
  const [isSavedPrice, setIsSavedPrice] = useState(false);

  // Seed shrimp from hatchery
  const [seeds, setSeeds] = useState<HatcherySeedProduct[]>(INITIAL_HATCHERY_SEEDS);
  const [selectedSeedForOrder, setSelectedSeedForOrder] = useState<HatcherySeedProduct | null>(null);
  const [orderSeedQty, setOrderSeedQty] = useState(1000000);
  const [orderSeedDeliveryDate, setOrderSeedDeliveryDate] = useState('20 กุมภาพันธ์ 2569');

  // Selected slip modal
  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(640, 'sine', 0.2);
    onUpdateUser({
      farmName,
      name: ownerName,
      phone,
      province,
      address,
      description,
    });
    setIsEditing(false);
    onShowToast('บันทึกข้อมูลฟาร์มของคุณสำเร็จ');
  };

  const handleSavePrices = () => {
    playAudioBeep(680, 'sine', 0.15);
    setIsSavedPrice(true);
    onShowToast('อัปเดตราคาเสนอขายหน้าบ่อเรียบร้อยแล้ว ลูกค้าในตลาดจะเห็นราคานี้ทันที');
    setTimeout(() => setIsSavedPrice(false), 3000);
  };

  const handleToggleStatus = (order: CustomerOrder) => {
    playAudioBeep(600, 'sine', 0.15);
    const nextStatus: CustomerOrder['status'] =
      order.status === 'รอจัดส่ง' ? 'กำลังจัดส่ง' : order.status === 'กำลังจัดส่ง' ? 'รับกุ้งแล้ว' : 'รอจัดส่ง';
    onUpdateOrderStatus(order.id, nextStatus);
    onShowToast(`เปลี่ยนสถานะออเดอร์ ${order.id} เป็น "${nextStatus}" เรียบร้อย`);
  };

  const handleConfirmOrderSeed = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(720, 'triangle', 0.2);
    onShowToast(`ส่งคำสั่งซื้อ ${selectedSeedForOrder?.breedName} จำนวน ${(orderSeedQty / 1000000).toFixed(1)} ล้านตัว ถึงโรงเพาะฟักเรียบร้อย`);
    setSelectedSeedForOrder(null);
  };

  return (
    <div className="space-y-4 pb-28 max-w-[480px] w-full mx-auto">
      {/* Top Banner Card */}
      <div className="shrimp-card p-4 sm:p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={getSafeStickerSrc(STICKER_MAP?.pond?.src)} size={48} alt="โปรไฟล์ฟาร์ม" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              โปรไฟล์ฟาร์มของฉัน
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A2B33] mt-0.5 leading-tight">
              {farmName}
            </h1>
          </div>
        </div>

        <p className="text-xs text-[#1A2B33]/70 font-semibold mb-3">
          จัดการหน้าร้านในตลาด ออเดอร์จากลูกค้า และสั่งลูกกุ้งเข้าฟาร์ม
        </p>

        {/* 4 Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setSubTab('info');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              subTab === 'info'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>🏡 ข้อมูลฟาร์ม</span>
            <span className="text-[10px]">ตั้งราคา/รูป</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setSubTab('orders');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              subTab === 'orders'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>📦 ออเดอร์</span>
            <span className="text-[10px]">{(customerOrders || []).length} รายการ</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setSubTab('slips');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              subTab === 'slips'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>🧾 สลิปเงิน</span>
            <span className="text-[10px]">เวลาโอนจริง</span>
          </button>

          <button
            onClick={() => {
              playAudioBeep(520, 'sine', 0.1);
              setSubTab('orderseed');
            }}
            className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
              subTab === 'orderseed'
                ? 'bg-[#FF7A1A] text-white shadow-xs scale-102'
                : 'bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33]'
            }`}
          >
            <span>🦐 สั่งลูกกุ้ง</span>
            <span className="text-[10px]">จากโรงเพาะ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: INFO & PRICING & PHOTOS */}
      {/* ========================================================================= */}
      {subTab === 'info' && (
        <div className="space-y-4">
          {/* Farm Photo Hero */}
          <div className="shrimp-card overflow-hidden bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="relative h-44 w-full bg-[#FFE9D6]">
              <img
                src={getSafeImage(farmPhotos?.[0], FALLBACK_FARM_IMG)}
                alt={farmName || 'ฟาร์ม'}
                onError={(e) => handleImageError(e, FALLBACK_FARM_IMG)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div className="text-white">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                    ✓ ผ่านมาตรฐาน GAP
                  </span>
                  <h3 className="text-xl font-black mt-1">{farmName}</h3>
                  <p className="text-xs text-white/90">เจ้าของ: {ownerName} • จ.{province}</p>
                </div>
              </div>
            </div>

            {/* Photo Gallery Thumbnails */}
            <div className="p-3 bg-[#FFFDF9] border-t border-[#F2C9A0]/50 flex gap-2 overflow-x-auto">
              {(farmPhotos || []).map((photo, i) => {
                const safeSrc = getSafeImage(photo, FALLBACK_FARM_IMG);
                return (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-[#F2C9A0] shrink-0">
                    <img
                      src={safeSrc}
                      alt=""
                      onError={(e) => handleImageError(e, FALLBACK_FARM_IMG)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
              <button
                onClick={() => {
                  playAudioBeep(600, 'sine', 0.1);
                  onShowToast('เพิ่มรูปภาพบรรยากาศบ่อกุ้งเรียบร้อย');
                }}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-[#FF7A1A] bg-[#FFF4EA] text-[#FF7A1A] flex flex-col items-center justify-center text-[10px] font-bold shrink-0 hover:bg-[#FFE9D6]"
              >
                <Camera className="w-4 h-4 mb-0.5" />
                <span>+ เพิ่มรูป</span>
              </button>
            </div>
          </div>

          {/* Pricing Setup */}
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">ตั้งราคาขายกุ้งหน้าบ่อ (สำหรับลูกค้า)</h3>
                <p className="text-xs text-[#1A2B33]/70">ราคานี้จะแสดงบนการ์ดฟาร์มในหน้าตลาดกุ้งทันที</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1A2B33] block">กุ้งขาวแวนนาไม (ไซส์ 40-50 ตัว/กก.)</span>
                  <span className="text-[10px] text-[#1A2B33]/60">พร้อมจับ มีปริมาณ ~1,200 กก.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={vannameiPrice}
                    onChange={(e) => setVannameiPrice(Number(e.target.value))}
                    className="w-20 h-10 px-2 text-center font-black text-sm bg-white border border-[#F2C9A0] rounded-lg text-[#FF7A1A]"
                  />
                  <span className="font-bold text-[#1A2B33]">บ./กก.</span>
                </div>
              </div>

              <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1A2B33] block">กุ้งกุลาดำลายเสือ (ไซส์ 30 ตัว/กก.)</span>
                  <span className="text-[10px] text-[#1A2B33]/60">พร้อมจับ มีปริมาณ ~600 กก.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={monodonPrice}
                    onChange={(e) => setMonodonPrice(Number(e.target.value))}
                    className="w-20 h-10 px-2 text-center font-black text-sm bg-white border border-[#F2C9A0] rounded-lg text-[#FF7A1A]"
                  />
                  <span className="font-bold text-[#1A2B33]">บ./กก.</span>
                </div>
              </div>

              <button
                onClick={handleSavePrices}
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSavedPrice ? 'บันทึกราคาเรียบร้อยแล้ว!' : 'บันทึกราคาขายหน้าบ่อ'}</span>
              </button>
            </div>
          </div>

          {/* Edit Farm Profile Card */}
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <h3 className="text-base font-black text-[#1A2B33]">ข้อมูลติดต่อและที่อยู่ฟาร์ม</h3>
              <button
                onClick={() => {
                  playAudioBeep(520, 'sine', 0.1);
                  setIsEditing(!isEditing);
                }}
                className="h-8 px-3 bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-xs font-bold text-[#FF7A1A] rounded-lg"
              >
                {isEditing ? 'ยกเลิก' : 'แก้ไข'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">ชื่อฟาร์ม:</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ชื่อเจ้าของฟาร์ม:</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">เบอร์โทรศัพท์:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">จังหวัด:</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                      className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">ที่อยู่ฟาร์ม (สำหรับลูกค้านำรถมารับ):</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">คำแนะนำฟาร์ม:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs"
                >
                  บันทึกข้อมูลฟาร์ม
                </button>
              </form>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl space-y-1">
                  <span className="text-[10px] text-[#1A2B33]/60 block">เจ้าของฟาร์ม</span>
                  <p className="text-sm font-black text-[#1A2B33]">{ownerName}</p>
                  <p className="text-[#1A2B33]/80">📞 {phone}</p>
                  <p className="text-[#1A2B33]/80">📍 {address}</p>
                </div>
                <div className="p-3 bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl">
                  <span className="text-[10px] text-[#1A2B33]/60 block mb-0.5">คำแนะนำฟาร์ม</span>
                  <p className="text-xs text-[#1A2B33] leading-relaxed">{description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: CUSTOMER ORDERS MANAGEMENT */}
      {/* ========================================================================= */}
      {subTab === 'orders' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">รายการสั่งซื้อจากลูกค้า (Customer Orders)</h3>
                <p className="text-xs text-[#1A2B33]/70">กดเปลี่ยนสถานะ: รอจัดส่ง ➔ กำลังจัดส่ง ➔ รับกุ้งแล้ว</p>
              </div>
            </div>

            <div className="space-y-3">
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl text-xs space-y-2 hover:border-[#FF7A1A] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-black text-sm text-[#FF7A1A]">{ord.id}</span>
                      <h4 className="font-black text-[#1A2B33]">{ord.buyerName}</h4>
                      <span className="text-[10px] text-[#1A2B33]/60">📞 {ord.buyerPhone}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        ord.status === 'รับกุ้งแล้ว'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'กำลังจัดส่ง'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-[#F2C9A0]/50 space-y-0.5 text-[11px]">
                    <div className="flex justify-between">
                      <span>สินค้า: <strong>{ord.breedName}</strong></span>
                      <strong className="text-[#FF7A1A]">{ord.quantityKg} กก.</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>วิธีรับ: <strong>{ord.deliveryMethod}</strong></span>
                      <strong className="text-emerald-700">฿ {ord.totalPrice.toLocaleString()}</strong>
                    </div>
                    <p className="text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                      📍 ส่งที่: {ord.buyerAddress}
                    </p>
                  </div>

                  {/* Status Toggle Action Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => handleToggleStatus(ord)}
                      className="w-full h-11 bg-[#FFF4EA] hover:bg-[#FFE9D6] border border-[#FF7A1A] text-[#FF7A1A] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs"
                    >
                      <Truck className="w-4 h-4" />
                      <span>
                        กดเพื่อเปลี่ยนสถานะ (ปัจจุบัน: <strong>{ord.status}</strong>)
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: PAYMENT SLIPS WITH TIMESTAMPS */}
      {/* ========================================================================= */}
      {subTab === 'slips' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">สลิปการชำระเงินจากลูกค้า</h3>
                <p className="text-xs text-[#1A2B33]/70">บันทึกเวลาสั่งซื้อและเวลาชำระเงินจริง</p>
              </div>
            </div>

            <div className="space-y-3">
              {paymentSlips.map((slip) => (
                <div
                  key={slip.id}
                  onClick={() => setSelectedSlip(slip)}
                  className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl text-xs space-y-1.5 cursor-pointer hover:border-[#FF7A1A] transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-sm text-[#FF7A1A]">{slip.slipNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ ชำระแล้ว
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#1A2B33]">
                    <span>{slip.breedName} ({slip.quantityKg} กก.)</span>
                    <strong className="text-base text-emerald-700">฿ {slip.amount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#1A2B33]/60 pt-1 border-t border-[#F2C9A0]/40">
                    <span>สั่งซื้อ: {slip.orderDateTime}</span>
                    <span>ส่งมอบ: {slip.deliveryDateTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: ORDER SEEDS FROM HATCHERIES */}
      {/* ========================================================================= */}
      {subTab === 'orderseed' && (
        <div className="space-y-4">
          <div className="shrimp-card p-4 sm:p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <h3 className="text-base font-black text-[#1A2B33]">สั่งซื้อลูกกุ้งจากโรงเพาะฟัก</h3>
                <p className="text-xs text-[#1A2B33]/70">ลูกกุ้งปลอดโรค SPF ตรวจแล็บ PCR ผ่าน 100%</p>
              </div>
            </div>

            <div className="space-y-3">
              {seeds.map((s) => (
                <div key={s.id} className="p-3.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm text-[#1A2B33]">{s.breedName}</h4>
                      <span className="text-[11px] text-[#1A2B33]/70 block">{s.stage}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      SPF ปลอดโรค
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#FFF4EA] p-2 rounded-xl border border-[#F2C9A0]/60">
                    <span className="text-xs text-[#1A2B33]/80">ราคา:</span>
                    <strong className="text-base font-black text-[#FF7A1A] tabular-nums">
                      {s.pricePerUnit} บาท/ตัว
                    </strong>
                  </div>

                  <button
                    onClick={() => {
                      playAudioBeep(560, 'sine', 0.1);
                      setSelectedSeedForOrder(s);
                    }}
                    className="w-full h-11 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs text-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>สั่งซื้อลูกกุ้งรุ่นนี้</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER SEED DIALOG */}
      {selectedSeedForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[420px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
            <button
              onClick={() => setSelectedSeedForOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
            >
              <X className="w-6 h-6" />
            </button>

            <ShrimpSticker size="sm" withBadge className="mx-auto mb-2" />
            <h3 className="text-lg font-black text-[#1A2B33] text-center">
              ยืนยันการสั่งลูกกุ้งเข้าฟาร์ม
            </h3>
            <p className="text-xs text-[#1A2B33]/70 text-center mb-3">
              {selectedSeedForOrder.breedName} ({selectedSeedForOrder.stage})
            </p>

            <form onSubmit={handleConfirmOrderSeed} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">จำนวนลูกกุ้งที่ต้องการ (ตัว):</label>
                <input
                  type="number"
                  value={orderSeedQty}
                  onChange={(e) => setOrderSeedQty(Number(e.target.value))}
                  step={100000}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">วันที่ต้องการให้มาส่ง:</label>
                <input
                  type="text"
                  value={orderSeedDeliveryDate}
                  onChange={(e) => setOrderSeedDeliveryDate(e.target.value)}
                  required
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                />
              </div>

              <div className="p-3 bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl flex justify-between items-center">
                <span>ยอดเงินรวมประมาณ:</span>
                <strong className="text-lg font-black text-emerald-700">
                  ฿ {(orderSeedQty * selectedSeedForOrder.pricePerUnit).toLocaleString()}
                </strong>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSeedForOrder(null)}
                  className="h-12 w-1/3 bg-white border border-[#F2C9A0] font-bold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black rounded-xl shadow-xs"
                >
                  ยืนยันสั่งซื้อ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYMENT SLIP DETAIL (NO PRINT / NO PDF) */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="shrimp-card w-full max-w-[400px] p-5 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#1A2B33]">ใบเสร็จการชำระเงิน</h3>
            <span className="font-mono text-xs font-bold text-[#FF7A1A]">{selectedSlip.slipNumber}</span>

            <div className="bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl p-3 text-xs text-left space-y-1.5 my-3">
              <p>• <strong>สินค้า:</strong> {selectedSlip.breedName}</p>
              <p>• <strong>ปริมาณ:</strong> {selectedSlip.quantityKg} กก.</p>
              <p>• <strong>ยอดเงิน:</strong> <strong className="text-emerald-700 font-bold">฿ {selectedSlip.amount.toLocaleString()}</strong></p>
              <p>• <strong>เวลาสั่งซื้อ:</strong> {selectedSlip.orderDateTime}</p>
              <p>• <strong>เวลาส่งมอบ:</strong> {selectedSlip.deliveryDateTime}</p>
            </div>

            <button
              onClick={() => setSelectedSlip(null)}
              className="w-full h-12 bg-[#FF7A1A] text-white font-bold rounded-xl"
            >
              ปิดหน้าต่าง
            </button>
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
