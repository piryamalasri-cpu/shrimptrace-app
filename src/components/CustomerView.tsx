import React, { useState } from 'react';
import {
  Megaphone,
  Tag,
  ShoppingBag,
  Receipt,
  Search,
  Star,
  MapPin,
  Truck,
  Phone,
  ChevronRight,
  Filter,
  ArrowLeft,
  X,
  Send,
  CheckCircle2,
  QrCode,
  DollarSign,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  BuyingBroadcast,
  CustomerNavTabId,
  CustomerOrder,
  FarmListing,
  FarmReview,
  FarmShrimpProduct,
  PaymentSlip,
  ShrimpBreed,
  ShrimpDisease,
} from '../types';
import {
  FARM_LISTINGS,
  INITIAL_BROADCASTS,
  INITIAL_CUSTOMER_ORDERS,
  INITIAL_PAYMENT_SLIPS,
  SHRIMP_BREEDS,
  SHRIMP_DISEASES,
} from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { getSafeImage, getSafeStickerSrc, handleImageError, FALLBACK_FARM_IMG, FALLBACK_SHRIMP_IMG } from '../utils/imageFallback';
import { BreedsView } from './BreedsView';
import { DiseasesView } from './DiseasesView';
import { PricesView } from './PricesView';
import { playAudioBeep } from '../utils/audio';

interface CustomerViewProps {
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  onOpenScanReceive: (orderId?: string) => void;
  customerOrders: CustomerOrder[];
  onAddCustomerOrder: (order: CustomerOrder, slip: PaymentSlip) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onBackToHome,
  onShowToast,
  onOpenScanReceive,
  customerOrders,
  onAddCustomerOrder,
}) => {
  // Navigation within Customer Role: strictly 6 bottom items
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerNavTabId>('market');

  // Broadcasts state
  const [broadcasts, setBroadcasts] = useState<BuyingBroadcast[]>(INITIAL_BROADCASTS);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  // New broadcast form state
  const [bBreed, setBBreed] = useState('กุ้งขาวแวนนาไม');
  const [bKg, setBKg] = useState(500);
  const [bPrice, setBPrice] = useState(190);
  const [bProvince, setBProvince] = useState('สมุทรปราการ');
  const [bDate, setBDate] = useState('18 กุมภาพันธ์ 2569');
  const [bPhone, setBPhone] = useState('081-998-8877');
  const [bBuyerName, setBBuyerName] = useState('ร้านอาหารน้องกุ้ง');
  const [bNote, setBNote] = useState('ต้องการกุ้งสดเป็น ไซส์สม่ำเสมอ');

  // Farm Market state
  const [farms, setFarms] = useState<FarmListing[]>(FARM_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreedFilter, setSelectedBreedFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'ฟาร์มส่งให้' | 'ไปรับเอง'>('all');

  // Farm Profile modal/detail view
  const [selectedFarm, setSelectedFarm] = useState<FarmListing | null>(null);
  const [farmTab, setFarmTab] = useState<'products' | 'reviews' | 'chat'>('products');

  // Review Form state
  const [reviewName, setReviewName] = useState('คุณประเสริฐ (ร้านอาหารไทย)');
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('กุ้งสดมาก ไซส์ตรงปก ส่งเร็วทันใจครับ');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Farm Chat state
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: 'user' | 'farm'; text: string; time: string }[]>>({
    'farm-1': [
      { sender: 'farm', text: 'สวัสดีครับ ฟาร์มสมชาย ซีฟู้ด ยินดีต้อนรับ มีกุ้งขาวแวนนาไมไซส์ 40-50 ตัว/กก. พร้อมส่งครับ', time: '09:00' },
    ],
    'farm-2': [
      { sender: 'farm', text: 'สวัสดีค่ะ ฟาร์มรุ่งเรือง กุ้งกุลาดำไซส์ 30 ตัว/กก. ลายเสือสวยสด นัดรับหน้าบ่อได้เลยนะคะ', time: '10:15' },
    ],
  });
  const [chatInput, setChatInput] = useState('');

  // Order & Payment flow state
  const [orderingProduct, setOrderingProduct] = useState<{ farm: FarmListing; product: FarmShrimpProduct } | null>(null);
  const [orderKg, setOrderKg] = useState(100);
  const [orderDelivery, setOrderDelivery] = useState<'ฟาร์มส่งให้' | 'ไปรับเอง'>('ฟาร์มส่งให้');
  const [orderBuyerName, setOrderBuyerName] = useState('สมหมาย สุขใจ (ร้านอาหารชายเล)');
  const [orderBuyerPhone, setOrderBuyerPhone] = useState('085-112-9988');
  const [orderBuyerAddress, setOrderBuyerAddress] = useState('14/2 ต.แหลมฟ้าผ่า อ.พระสมุทรเจดีย์ จ.สมุทรปราการ');
  const [orderDate, setOrderDate] = useState('14 กุมภาพันธ์ 2569');

  // QR Payment Modal
  const [paymentModalData, setPaymentModalData] = useState<{
    order: CustomerOrder;
    slip: PaymentSlip;
  } | null>(null);

  // Slips viewer modal
  const [slips, setSlips] = useState<PaymentSlip[]>(INITIAL_PAYMENT_SLIPS);
  const [selectedSlip, setSelectedSlip] = useState<PaymentSlip | null>(null);

  // Filtered farms
  const filteredFarms = farms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.products.some((p) => p.breedName.includes(searchQuery));

    const matchesBreed =
      selectedBreedFilter === 'all' ||
      f.products.some((p) => p.breedId === selectedBreedFilter);

    const matchesDelivery =
      deliveryFilter === 'all' ||
      f.deliveryOption === deliveryFilter ||
      f.deliveryOption === 'ทั้งสองแบบ';

    return matchesSearch && matchesBreed && matchesDelivery;
  });

  // Handle Post Broadcast
  const handlePostBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(640, 'sine', 0.2);
    const now = new Date();
    const newB: BuyingBroadcast = {
      id: `BC-00${broadcasts.length + 1}`,
      breed: bBreed,
      quantityKg: Number(bKg),
      budgetPricePerKg: Number(bPrice),
      province: bProvince,
      neededDate: bDate,
      phone: bPhone,
      buyerName: bBuyerName,
      note: bNote,
      createdAt: `${now.getDate()} ก.พ. 2569 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    };
    setBroadcasts([newB, ...broadcasts]);
    setShowBroadcastForm(false);
    onShowToast(`ลงประกาศซื้อ ${bBreed} ${bKg} กก. สำเร็จ! ฟาร์มต่างๆ จะติดต่อกลับ`);
  };

  // Handle Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm) return;
    playAudioBeep(600, 'sine', 0.2);
    const newRev: FarmReview = {
      id: `rev-${Date.now()}`,
      buyerName: reviewName,
      rating: reviewStars,
      comment: reviewComment,
      date: 'วันนี้',
    };
    const updated = {
      ...selectedFarm,
      reviews: [newRev, ...selectedFarm.reviews],
      reviewCount: selectedFarm.reviewCount + 1,
    };
    setSelectedFarm(updated);
    setFarms(farms.map((f) => (f.id === updated.id ? updated : f)));
    setShowReviewForm(false);
    onShowToast('เขียนรีวิวสำเร็จ ขอบคุณสำหรับข้อเสนอแนะ');
  };

  // Handle Send Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedFarm) return;
    playAudioBeep(520, 'sine', 0.1);
    const farmId = selectedFarm.id;
    const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: chatInput, time: nowTime };
    const currentList = chatMessages[farmId] || [];
    setChatMessages({ ...chatMessages, [farmId]: [...currentList, userMsg] });
    setChatInput('');

    // Auto reply from farm
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const farmReply = {
        sender: 'farm' as const,
        text: `ขอบคุณที่สนใจครับ ทาง ${selectedFarm.name} ได้รับข้อความแล้ว จะจัดเตรียมกุ้งคุณภาพให้ท่านตามนัดหมายครับ`,
        time: replyTime,
      };
      setChatMessages((prev) => ({ ...prev, [farmId]: [...(prev[farmId] || []), farmReply] }));
      playAudioBeep(680, 'sine', 0.15);
    }, 1000);
  };

  // Submit Order -> Open QR Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingProduct) return;
    playAudioBeep(660, 'sine', 0.2);
    const now = new Date();
    const formattedNow = `${now.getDate()} ก.พ. 2569 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const batchId = `SHR-2026-0${85 + customerOrders.length}`;
    const totalPrice = orderKg * orderingProduct.product.pricePerKg;

    const newOrder: CustomerOrder = {
      id: `ORD-00${customerOrders.length + 1}`,
      batchId,
      farmId: orderingProduct.farm.id,
      farmName: orderingProduct.farm.name,
      farmAddress: orderingProduct.farm.address,
      farmPhone: orderingProduct.farm.phone,
      breedName: orderingProduct.product.breedName,
      quantityKg: Number(orderKg),
      pricePerKg: orderingProduct.product.pricePerKg,
      totalPrice,
      deliveryMethod: orderDelivery,
      orderDate: formattedNow,
      deliveryDate: `${orderDate} 10:00`,
      status: 'รอจัดส่ง',
      buyerName: orderBuyerName,
      buyerPhone: orderBuyerPhone,
      buyerAddress: orderBuyerAddress,
      slipId: `SLIP-2026-0${85 + customerOrders.length}`,
    };

    const newSlip: PaymentSlip = {
      id: `SLIP-2026-0${85 + customerOrders.length}`,
      orderId: newOrder.id,
      slipNumber: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      farmName: orderingProduct.farm.name,
      breedName: `${orderingProduct.product.breedName} (${orderKg} กก.)`,
      quantityKg: Number(orderKg),
      amount: totalPrice,
      orderDateTime: formattedNow,
      deliveryDateTime: `${orderDate} 10:00`,
      status: 'paid',
    };

    setPaymentModalData({ order: newOrder, slip: newSlip });
    setOrderingProduct(null);
  };

  // Confirm Paid in QR Modal
  const handleConfirmPaid = () => {
    if (!paymentModalData) return;
    playAudioBeep(750, 'triangle', 0.25);
    onAddCustomerOrder(paymentModalData.order, paymentModalData.slip);
    setSlips([paymentModalData.slip, ...slips]);
    setPaymentModalData(null);
    onShowToast('ชำระเงินสำเร็จ! คำสั่งซื้อถูกบันทึกในประวัติและสลิปแล้ว');
    setActiveCustomerTab('history');
  };

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* Customer Mode Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-700 text-white rounded-[24px] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center p-1">
            <ChromaSticker src={STICKER_MAP.money.src} size={36} alt="ลูกค้า" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wide uppercase bg-white/25 px-2 py-0.5 rounded-full">
              โหมดผู้ใช้งาน / ลูกค้า (Customer)
            </span>
            <h2 className="text-xl font-black mt-0.5">ตลาดซื้อขายกุ้งไทย</h2>
            <p className="text-xs text-white/90">สั่งกุ้งสดตรงจากฟาร์ม ปลอดโรค ตรวจย้อนกลับได้ 100%</p>
          </div>
        </div>
      </div>

      {/* RENDER VIEWS ACCORDING TO ACTIVE CUSTOMER TAB */}

      {/* 1. BROADCAST TAB (ประกาศซื้อ) */}
      {activeCustomerTab === 'broadcast' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#1A2B33]">ประกาศรับซื้อกุ้ง</h3>
              <p className="text-xs text-[#6B7280]">ลงประกาศให้ฟาร์มกุ้งทั่วประเทศติดต่อเสนอราคา</p>
            </div>
            <button
              onClick={() => setShowBroadcastForm(!showBroadcastForm)}
              className="px-3.5 py-2 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              <span>{showBroadcastForm ? 'ปิดฟอร์ม' : '+ ลงประกาศ'}</span>
            </button>
          </div>

          {/* Broadcast Form */}
          {showBroadcastForm && (
            <form
              onSubmit={handlePostBroadcast}
              className="p-4 bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-2xl shadow-sm space-y-3 animate-fadeIn"
            >
              <h4 className="text-sm font-black text-[#1A2B33]">กรอกข้อมูลที่ต้องการรับซื้อ</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">พันธุ์กุ้ง:</label>
                  <select
                    value={bBreed}
                    onChange={(e) => setBBreed(e.target.value)}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  >
                    {SHRIMP_BREEDS.map((b) => (
                      <option key={b.id} value={b.nameThai}>
                        {b.nameThai}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">จำนวน (กก.):</label>
                  <input
                    type="number"
                    value={bKg}
                    onChange={(e) => setBKg(Number(e.target.value))}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">ราคาที่รับได้ (บ./กก.):</label>
                  <input
                    type="number"
                    value={bPrice}
                    onChange={(e) => setBPrice(Number(e.target.value))}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">จังหวัดที่รับ:</label>
                  <input
                    type="text"
                    value={bProvince}
                    onChange={(e) => setBProvince(e.target.value)}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">วันที่ต้องการกุ้ง:</label>
                  <input
                    type="text"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[#1A2B33] block mb-1">ชื่อผู้ซื้อ/ร้าน:</label>
                    <input
                      type="text"
                      value={bBuyerName}
                      onChange={(e) => setBBuyerName(e.target.value)}
                      className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A2B33] block mb-1">เบอร์ติดต่อ:</label>
                    <input
                      type="text"
                      value={bPhone}
                      onChange={(e) => setBPhone(e.target.value)}
                      className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-[#1A2B33] block mb-1">หมายเหตุ:</label>
                  <input
                    type="text"
                    value={bNote}
                    onChange={(e) => setBNote(e.target.value)}
                    className="w-full h-11 px-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Megaphone className="w-4 h-4" />
                <span>ยืนยันลงประกาศรับซื้อ</span>
              </button>
            </form>
          )}

          {/* Broadcasts List */}
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-2xl shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF7A1A] bg-[#FFF4EA] px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
                    {b.breed}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">โพสต์เมื่อ: {b.createdAt}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-base font-black text-[#1A2B33]">{b.buyerName}</h4>
                    <p className="text-xs text-[#6B7280]">
                      📍 {b.province} • ต้องการวันที่ <strong>{b.neededDate}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700">
                      ฿{b.budgetPricePerKg}
                    </span>
                    <span className="text-xs text-gray-500 block">/ กก.</span>
                  </div>
                </div>
                <div className="p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/50 text-xs flex justify-between items-center">
                  <span>
                    จำนวนที่รับ: <strong>{b.quantityKg.toLocaleString()} กก.</strong>
                  </span>
                  <a
                    href={`tel:${b.phone}`}
                    className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1 hover:bg-emerald-700"
                  >
                    <Phone className="w-3 h-3" /> โทร {b.phone}
                  </a>
                </div>
                {b.note && <p className="text-[11px] text-gray-600">หมายเหตุ: {b.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FARM MARKET TAB (ตลาดฟาร์มกุ้ง) */}
      {activeCustomerTab === 'market' && !selectedFarm && (
        <div className="space-y-3.5">
          {/* Search & Filter Bar */}
          <div className="p-3.5 bg-white border-2 border-[#F2C9A0] rounded-2xl shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อฟาร์ม จังหวัด หรือพันธุ์กุ้ง..."
                className="w-full h-11 pl-10 pr-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs font-semibold text-[#1A2B33] focus:border-[#FF7A1A] outline-none"
              />
            </div>

            <div className="flex gap-2 text-xs">
              {/* Breed filter */}
              <select
                value={selectedBreedFilter}
                onChange={(e) => setSelectedBreedFilter(e.target.value)}
                className="flex-1 h-10 px-2.5 bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl text-[#1A2B33] font-bold text-xs"
              >
                <option value="all">ทุกสายพันธุ์</option>
                <option value="vannamei">กุ้งขาวแวนนาไม</option>
                <option value="monodon">กุ้งกุลาดำ</option>
                <option value="rosenbergii">กุ้งก้ามกราม</option>
                <option value="merguiensis">กุ้งแชบ๊วย</option>
              </select>

              {/* Delivery filter */}
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value as any)}
                className="flex-1 h-10 px-2.5 bg-[#FFF4EA] border border-[#F2C9A0] rounded-xl text-[#1A2B33] font-bold text-xs"
              >
                <option value="all">วิธีรับทั้งหมด</option>
                <option value="ฟาร์มส่งให้">ฟาร์มส่งให้</option>
                <option value="ไปรับเอง">ไปรับเอง</option>
              </select>
            </div>
          </div>

          {/* Farms List */}
          <div className="space-y-4">
            {filteredFarms.map((farm) => (
              <div
                key={farm.id}
                onClick={() => {
                  playAudioBeep(540, 'sine', 0.1);
                  setSelectedFarm(farm);
                  setFarmTab('products');
                }}
                className="bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Real Farm Photo on Top */}
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={farm.heroImg}
                    alt={farm.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-black text-[#1A2B33] flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{farm.rating}</span>
                    <span className="text-[10px] text-gray-500">({farm.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-black">{farm.name}</h3>
                    <p className="text-xs text-white/90 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {farm.province} • โดย {farm.ownerName}
                    </p>
                  </div>
                </div>

                {/* Farm Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
                      {farm.products[0]?.breedName || 'กุ้งคุณภาพ'}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1 font-medium">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" /> {farm.deliveryOption}
                    </span>
                  </div>

                  {/* Product Snippet with Real Shrimp Image */}
                  {farm.products[0] && (
                    <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0]/60 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={farm.products[0].realImg}
                          alt={farm.products[0].breedName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#F2C9A0]"
                        />
                        <div>
                          <span className="text-xs font-black text-[#1A2B33] block">
                            ไซส์ {farm.products[0].sizeCount}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            เหลือ {farm.products[0].availableKg.toLocaleString()} กก.
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-700">
                          ฿{farm.products[0].pricePerKg}
                        </span>
                        <span className="text-[10px] text-gray-500 block">/ กก.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[#F2C9A0]/40 text-xs text-[#FF7A1A] font-bold">
                    <span>แตะดูเมนูกุ้ง / รีวิว / แชทร้าน</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FARM PROFILE VIEW (3 TABS: เมนูกุ้ง / รีวิว / แชทร้าน) */}
      {selectedFarm && (
        <div className="space-y-4 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => setSelectedFarm(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A1A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้ารายการฟาร์ม
          </button>

          {/* Farm Header Banner with Real Photo */}
          <div className="bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px] overflow-hidden shadow-sm">
            <div className="relative h-44 w-full">
              <img
                src={selectedFarm.heroImg}
                alt={selectedFarm.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-bold bg-[#FF7A1A] px-2 py-0.5 rounded-full">
                  ฟาร์มมาตรฐาน GAP
                </span>
                <h2 className="text-2xl font-black mt-1">{selectedFarm.name}</h2>
                <p className="text-xs text-white/90">
                  {selectedFarm.ownerName} • {selectedFarm.phone}
                </p>
                <p className="text-[11px] text-white/80">{selectedFarm.address}</p>
              </div>
            </div>

            {/* 3 Tabs Header: เมนูกุ้ง / รีวิวจากผู้ซื้อ / แชทคุยกับร้าน */}
            <div className="grid grid-cols-3 border-t border-[#F2C9A0]">
              <button
                onClick={() => setFarmTab('products')}
                className={`py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  farmTab === 'products'
                    ? 'border-[#FF7A1A] text-[#FF7A1A] bg-[#FFF4EA]'
                    : 'border-transparent text-[#1A2B33] hover:bg-[#FFFDF9]'
                }`}
              >
                1. เมนูกุ้ง
              </button>
              <button
                onClick={() => setFarmTab('reviews')}
                className={`py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  farmTab === 'reviews'
                    ? 'border-[#FF7A1A] text-[#FF7A1A] bg-[#FFF4EA]'
                    : 'border-transparent text-[#1A2B33] hover:bg-[#FFFDF9]'
                }`}
              >
                2. รีวิว ({selectedFarm.reviews.length})
              </button>
              <button
                onClick={() => setFarmTab('chat')}
                className={`py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                  farmTab === 'chat'
                    ? 'border-[#FF7A1A] text-[#FF7A1A] bg-[#FFF4EA]'
                    : 'border-transparent text-[#1A2B33] hover:bg-[#FFFDF9]'
                }`}
              >
                3. แชทร้าน
              </button>
            </div>
          </div>

          {/* TAB 1: เมนูกุ้ง */}
          {farmTab === 'products' && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-[#1A2B33]">รายการกุ้งสดของ {selectedFarm.name}</h3>
              {selectedFarm.products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-white border-2 border-[#F2C9A0] rounded-2xl shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.realImg}
                      alt={p.breedName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F2C9A0]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
                        {p.breedName}
                      </span>
                      <h4 className="text-base font-black text-[#1A2B33] mt-1">
                        ไซส์ {p.sizeCount}
                      </h4>
                      <p className="text-xs text-gray-600">
                        พร้อมจับ: <strong>{p.readyDate}</strong> • เหลือ{' '}
                        <strong>{p.availableKg.toLocaleString()} กก.</strong>
                      </p>
                      <span className="text-lg font-black text-emerald-700 block mt-0.5">
                        ฿{p.pricePerKg} <span className="text-xs text-gray-500 font-normal">/ กก.</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playAudioBeep(640, 'sine', 0.15);
                      setOrderingProduct({ farm: selectedFarm, product: p });
                    }}
                    className="w-full h-12 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>สั่งซื้อกุ้งตัวนี้</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: รีวิวจากผู้ซื้อ */}
          {farmTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#1A2B33]">รีวิวจากผู้ซื้อจริง</h3>
                  <p className="text-xs text-[#6B7280]">
                    คะแนนเฉลี่ย {selectedFarm.rating} จาก {selectedFarm.reviews.length} รีวิว
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3 py-1.5 bg-[#FFF4EA] border border-[#FF7A1A] text-[#FF7A1A] font-bold text-xs rounded-xl hover:bg-[#FFE9D6]"
                >
                  {showReviewForm ? 'ปิดฟอร์ม' : '+ เขียนรีวิว'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-4 bg-white border-2 border-[#FF7A1A] rounded-2xl shadow-xs space-y-3 animate-fadeIn"
                >
                  <h4 className="text-xs font-black text-[#1A2B33]">เขียนรีวิวให้ {selectedFarm.name}</h4>
                  <div>
                    <label className="text-xs font-bold text-[#1A2B33] block mb-1">ชื่อผู้ซื้อ:</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A2B33] block mb-1">ให้คะแนนดาว:</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewStars(s)}
                          className="p-1 text-amber-400"
                        >
                          <Star
                            className={`w-6 h-6 ${s <= reviewStars ? 'fill-amber-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A2B33] block mb-1">ความเห็น:</label>
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    ส่งรีวิว
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-2.5">
                {selectedFarm.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-white border border-[#F2C9A0] rounded-2xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A2B33]">{r.buyerName}</span>
                      <span className="text-[11px] text-gray-500">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-0.5">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: แชทร้าน */}
          {farmTab === 'chat' && (
            <div className="bg-white border-2 border-[#F2C9A0] rounded-2xl overflow-hidden shadow-xs flex flex-col h-[380px]">
              {/* Chat Header */}
              <div className="p-3 bg-[#FFF4EA] border-b border-[#F2C9A0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF7A1A] text-white font-black text-xs flex items-center justify-center">
                    🦐
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2B33]">{selectedFarm.name}</h4>
                    <span className="text-[10px] text-emerald-700 font-semibold">● กำลังออนไลน์</span>
                  </div>
                </div>
                <button
                  onClick={() => setFarmTab('products')}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#FFFDF9]">
                {(chatMessages[selectedFarm.id] || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#FF7A1A] text-white rounded-br-xs'
                          : 'bg-white border border-[#F2C9A0] text-[#1A2B33] rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-2.5 bg-white border-t border-[#F2C9A0] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="พิมพ์ข้อความคุยกับฟาร์ม..."
                  className="flex-1 h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-xs outline-none focus:border-[#FF7A1A]"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-[#FF7A1A] text-white rounded-xl flex items-center justify-center hover:bg-[#E65800]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ORDER FORM MODAL */}
      {orderingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-[28px] max-w-[440px] w-full p-5 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setOrderingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#1A2B33] mb-1">สั่งซื้อกุ้งสด</h3>
            <p className="text-xs text-gray-500 mb-3">{orderingProduct.farm.name}</p>

            {/* Selected item pill */}
            <div className="p-3 bg-[#FFF4EA] border border-[#F2C9A0] rounded-2xl flex items-center gap-3 mb-4">
              <img
                src={orderingProduct.product.realImg}
                alt=""
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-[#1A2B33] block">
                  {orderingProduct.product.breedName} (ไซส์ {orderingProduct.product.sizeCount})
                </span>
                <span className="text-xs font-black text-emerald-700">
                  ฿{orderingProduct.product.pricePerKg} / กก.
                </span>
              </div>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">จำนวนที่สั่ง (กิโลกรัม):</label>
                <input
                  type="number"
                  min={10}
                  max={orderingProduct.product.availableKg}
                  value={orderKg}
                  onChange={(e) => setOrderKg(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-bold text-sm text-[#1A2B33]"
                  required
                />
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-900">ยอดเงินรวม:</span>
                <span className="text-xl font-black text-emerald-700">
                  ฿{(orderKg * orderingProduct.product.pricePerKg).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">วิธีรับสินค้า:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderDelivery('ฟาร์มส่งให้')}
                    className={`h-11 rounded-xl border font-bold text-xs ${
                      orderDelivery === 'ฟาร์มส่งให้'
                        ? 'bg-[#FF7A1A] text-white border-[#FF7A1A]'
                        : 'bg-white border-[#F2C9A0] text-[#1A2B33]'
                    }`}
                  >
                    🚚 ฟาร์มส่งให้
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderDelivery('ไปรับเอง')}
                    className={`h-11 rounded-xl border font-bold text-xs ${
                      orderDelivery === 'ไปรับเอง'
                        ? 'bg-[#FF7A1A] text-white border-[#FF7A1A]'
                        : 'bg-white border-[#F2C9A0] text-[#1A2B33]'
                    }`}
                  >
                    🏪 ไปรับเองที่บ่อ
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">ชื่อผู้ซื้อ:</label>
                <input
                  type="text"
                  value={orderBuyerName}
                  onChange={(e) => setOrderBuyerName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">เบอร์ติดต่อ:</label>
                <input
                  type="text"
                  value={orderBuyerPhone}
                  onChange={(e) => setOrderBuyerPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">ที่อยู่จัดส่ง / นัดรับ:</label>
                <textarea
                  rows={2}
                  value={orderBuyerAddress}
                  onChange={(e) => setOrderBuyerAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1A2B33] block mb-1">วันที่ต้องการรับ:</label>
                <input
                  type="text"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-13 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-xl shadow-lg shadow-[#FF7A1A]/20 mt-2 flex items-center justify-center gap-1.5"
              >
                <span>ไปหน้าสแกนจ่ายเงิน</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR PAYMENT SCREEN MODAL */}
      {paymentModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-[#FF7A1A] rounded-[28px] max-w-[420px] w-full p-5 text-center shadow-2xl relative">
            <button
              onClick={() => setPaymentModalData(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF4EA] px-3 py-1 rounded-full border border-[#F2C9A0]">
              สแกนจ่ายเงิน (PromptPay QR)
            </span>
            <h3 className="text-2xl font-black text-[#1A2B33] mt-1.5">
              ฿{paymentModalData.order.totalPrice.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500">
              {paymentModalData.order.farmName} • {paymentModalData.order.breedName} ({paymentModalData.order.quantityKg} กก.)
            </p>

            {/* CSS Simulated QR Frame */}
            <div className="my-4 p-4 bg-white border-2 border-slate-900 rounded-3xl w-52 h-52 mx-auto flex flex-col items-center justify-center shadow-md relative">
              <div className="w-full h-full border-4 border-dashed border-[#1A2B33] rounded-2xl flex flex-col items-center justify-center gap-1.5 p-2 bg-slate-50">
                <QrCode className="w-20 h-20 text-[#1A2B33]" />
                <span className="text-[10px] font-mono font-bold text-[#1A2B33]">
                  {paymentModalData.slip.slipNumber}
                </span>
                <span className="text-[9px] text-gray-500">PromptPay ธนาคารแห่งประเทศไทย</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl text-left text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">ผู้สั่ง:</span>
                <span className="font-bold">{paymentModalData.order.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วิธีรับ:</span>
                <span className="font-bold">{paymentModalData.order.deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ที่อยู่จัดส่ง:</span>
                <span className="font-medium truncate max-w-[200px]">{paymentModalData.order.buyerAddress}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPaid}
                className="flex-1 h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ฉันจ่ายแล้ว</span>
              </button>
              <button
                onClick={handleConfirmPaid}
                className="flex-1 h-13 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>ตรวจสอบการจ่าย</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. HISTORY TAB (ประวัติการซื้อ & สแกนรับกุ้ง) */}
      {activeCustomerTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#1A2B33]">ประวัติกุ้งล็อตที่ซื้อ</h3>
              <p className="text-xs text-[#6B7280]">ตรวจสถานะการส่งมอบและสแกนยืนยันรับกุ้ง</p>
            </div>
            <button
              onClick={() => onOpenScanReceive()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>สแกนรับกุ้ง</span>
            </button>
          </div>

          <div className="space-y-3">
            {customerOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onOpenScanReceive(ord.id)}
                className="p-4 bg-white border-2 border-[#F2C9A0] rounded-2xl shadow-xs space-y-2.5 cursor-pointer hover:border-[#FF7A1A]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-[#FF7A1A] bg-[#FFF4EA] px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
                    ล็อต: {ord.batchId}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      ord.status === 'รับกุ้งแล้ว'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-[#1A2B33]">{ord.farmName}</h4>
                  <p className="text-xs text-gray-600">
                    {ord.breedName} • {ord.quantityKg.toLocaleString()} กก. • ยอดรวม{' '}
                    <strong className="text-emerald-700">฿{ord.totalPrice.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="p-2.5 bg-[#FFFDF9] rounded-xl border border-[#F2C9A0]/50 text-[11px] text-gray-600 flex justify-between items-center">
                  <span>สั่ง: {ord.orderDate}</span>
                  <span>ส่ง: {ord.deliveryDate}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#FF7A1A] font-bold pt-1 border-t border-[#F2C9A0]/40">
                  <span>แตะเพื่อดูประวัติล็อต / แสกนรับกุ้ง</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SLIPS TAB (สลิป) */}
      {activeCustomerTab === 'slips' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-[#1A2B33]">สลิปการจ่ายเงินทั้งหมด</h3>
            <p className="text-xs text-[#6B7280]">หลักฐานการชำระเงิน พร้อมวันเวลาสั่งและส่งมอบ</p>
          </div>

          <div className="space-y-3">
            {slips.map((slp) => (
              <div
                key={slp.id}
                onClick={() => setSelectedSlip(slp)}
                className="p-4 bg-white border-2 border-[#F2C9A0] rounded-2xl shadow-xs space-y-2 cursor-pointer hover:border-[#FF7A1A]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-600">
                    {slp.slipNumber}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ชำระสำเร็จ
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-sm font-black text-[#1A2B33]">{slp.farmName}</h4>
                    <span className="text-xs text-gray-500">{slp.breedName}</span>
                  </div>
                  <span className="text-lg font-black text-emerald-700">
                    ฿{slp.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 flex justify-between pt-1 border-t border-gray-100">
                  <span>สั่ง: {slp.orderDateTime}</span>
                  <span>ส่ง: {slp.deliveryDateTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DISEASES TAB (โรคกุ้ง) */}
      {activeCustomerTab === 'diseases' && (
        <DiseasesView
          onBackToHome={() => setActiveCustomerTab('market')}
          onOpenDoctor={() => onShowToast('โทรติดต่อหมอกุ้ง: 081-234-5678')}
        />
      )}

      {/* 6. BREEDS TAB (พันธุ์กุ้ง พร้อมรูปจริง) */}
      {activeCustomerTab === 'breeds' && (
        <BreedsView
          onBackToHome={() => setActiveCustomerTab('market')}
          onSelectBreed={(breed) => {
            setSelectedBreedFilter(breed.id);
            setActiveCustomerTab('market');
            onShowToast(`เลือกดูฟาร์มที่มี "${breed.nameThai}"`);
          }}
        />
      )}

      {/* 7. PRICES TAB (ราคากุ้ง) */}
      {activeCustomerTab === 'prices' && (
        <PricesView
          onBackToHome={() => setActiveCustomerTab('market')}
          onShowToast={onShowToast}
        />
      )}

      {/* FULL SLIP PREVIEW MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FFFEFB] border-2 border-emerald-500 rounded-[28px] max-w-[400px] w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-700">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-[#1A2B33]">สลิปการโอนเงินสำเร็จ</h3>
            <span className="font-mono text-xs text-gray-500">{selectedSlip.slipNumber}</span>

            <div className="my-4 py-3 border-y border-dashed border-[#F2C9A0] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ฟาร์มผู้รับเงิน:</span>
                <span className="font-bold text-[#1A2B33]">{selectedSlip.farmName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">รายการ:</span>
                <span className="font-bold text-[#1A2B33]">{selectedSlip.breedName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วันเวลาสั่งซื้อ:</span>
                <span className="font-bold text-[#1A2B33]">{selectedSlip.orderDateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วันเวลานัดส่ง:</span>
                <span className="font-bold text-[#1A2B33]">{selectedSlip.deliveryDateTime}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-100">
                <span className="font-bold text-gray-700">ยอดเงินสุทธิ:</span>
                <span className="text-lg font-black text-emerald-700">
                  ฿{selectedSlip.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSlip(null)}
              className="w-full h-12 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700"
            >
              ปิดสลิป
            </button>
          </div>
        </div>
      )}

      {/* MANDATORY BIG ORANGE "กลับหน้าหลัก" BUTTON AS SPECIFIED */}
      <div className="pt-2">
        <button
          onClick={onBackToHome}
          className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-xl font-black rounded-2xl shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <ChromaSticker src={STICKER_MAP.logo.src} size={28} />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>

      {/* STRICT CUSTOMER 6-MENU BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFEFB]/98 backdrop-blur-md border-t-2 border-[#F2C9A0] shadow-[0_-6px_24px_rgba(255,122,26,0.12)]">
        <div className="max-w-[480px] mx-auto px-2 pt-2 pb-1.5">
          <div className="grid grid-cols-6 gap-1">
            {/* 1. ประกาศซื้อ = ไอคอนลำโพงส้ม */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('broadcast');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'broadcast'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <Megaphone className="w-5 h-5 text-orange-500 drop-shadow-xs" />
              <span className="text-[10px] font-black leading-tight mt-0.5">ประกาศซื้อ</span>
            </button>

            {/* 2. ราคากุ้ง = ไอคอนป้ายราคา / เหรียญบาทเขียว */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('prices');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'prices'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <Tag className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-black leading-tight mt-0.5">ราคากุ้ง</span>
            </button>

            {/* 3. โรคกุ้ง = ไอคอนกุ้งป่วย + กากบาทแดง */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('diseases');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'diseases'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <span className="text-base leading-none">🩺</span>
              <span className="text-[10px] font-black leading-tight mt-0.5">โรคกุ้ง</span>
            </button>

            {/* 4. พันธุ์กุ้ง = ไอคอนรูปกุ้งหลายพันธุ์ */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('breeds');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'breeds'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <span className="text-base leading-none">🦐</span>
              <span className="text-[10px] font-black leading-tight mt-0.5">พันธุ์กุ้ง</span>
            </button>

            {/* 5. ประวัติการซื้อ = ไอคอนถุงช้อปปิ้ง / ตะกร้า */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('history');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'history'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-black leading-tight mt-0.5">ประวัติซื้อ</span>
            </button>

            {/* 6. สลิป = ไอคอนใบเสร็จ / สลิป */}
            <button
              onClick={() => {
                playAudioBeep(560, 'sine', 0.1);
                setActiveCustomerTab('slips');
                setSelectedFarm(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all relative ${
                activeCustomerTab === 'slips'
                  ? 'bg-[#FF7A1A] text-white shadow-md scale-[1.02]'
                  : 'bg-[#FFF4EA] text-[#1A2B33] hover:bg-[#FFE9D6] border border-[#F2C9A0]/60'
              }`}
            >
              <Receipt className="w-5 h-5 text-teal-700" />
              <span className="text-[10px] font-black leading-tight mt-0.5">สลิป</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
