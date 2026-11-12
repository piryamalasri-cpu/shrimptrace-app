/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_USER,
  INITIAL_PONDS,
  INITIAL_SALES_RECORDS,
  INITIAL_CUSTOMER_ORDERS,
  INITIAL_PAYMENT_SLIPS,
  ROLES,
} from './data/initialData';
import {
  CustomerOrder,
  NavTabId,
  PaymentSlip,
  Pond,
  RoleId,
  SalesRecord,
  ShrimpBreed,
  UserProfile,
  WaterStatus,
} from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { FarmerHome } from './components/FarmerHome';
import { HatcheryView } from './components/HatcheryView';
import { CustomerView } from './components/CustomerView';
import { FarmerProfileView } from './components/FarmerProfileView';
import { PondsView } from './components/PondsView';
import { TodayTasksView } from './components/TodayTasksView';
import { BreedsView } from './components/BreedsView';
import { DiseasesView } from './components/DiseasesView';
import { PricesView } from './components/PricesView';
import { SellShrimpView } from './components/SellShrimpView';
import { MoneyView } from './components/MoneyView';
import { ScanReceiveModal } from './components/ScanReceiveModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { VoiceMicModal } from './components/VoiceMicModal';
import { DoctorCallModal } from './components/DoctorCallModal';
import { FactoryCallModal } from './components/FactoryCallModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { RoleSelectModal } from './components/RoleSelectModal';
import { WaterQualityModal } from './components/WaterQualityModal';
import { FeedingModal } from './components/FeedingModal';
import { ReportSickModal } from './components/ReportSickModal';
import { EhpWarningModal } from './components/EhpWarningModal';
import { FactoryBookingModal } from './components/FactoryBookingModal';
import { PhoneDirectoryModal } from './components/PhoneDirectoryModal';
import { PondDetailModal } from './components/PondDetailModal';
import { StickerGalleryModal } from './components/StickerGalleryModal';
import { FloatingChat } from './components/FloatingChat';
import { playAudioBeep, speakThaiText } from './utils/audio';

export default function App() {
  // Authentication & Profile State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [currentRole, setCurrentRole] = useState<RoleId>('owner');

  // Navigation State (Farmer Tabs)
  const [activeTab, setActiveTab] = useState<NavTabId>('home');

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Business Data State
  const [ponds, setPonds] = useState<Pond[]>(INITIAL_PONDS);
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>(INITIAL_SALES_RECORDS);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(INITIAL_CUSTOMER_ORDERS);
  const [paymentSlips, setPaymentSlips] = useState<PaymentSlip[]>(INITIAL_PAYMENT_SLIPS);

  // Modals Visibility State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showVoiceMic, setShowVoiceMic] = useState(false);
  const [showDoctorCall, setShowDoctorCall] = useState(false);
  const [showFactoryCall, setShowFactoryCall] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [showSickReport, setShowSickReport] = useState(false);
  const [showEhpWarning, setShowEhpWarning] = useState(false);
  const [showFactoryBooking, setShowFactoryBooking] = useState(false);
  const [showPhoneDirectory, setShowPhoneDirectory] = useState(false);
  const [showStickerGallery, setShowStickerGallery] = useState(false);
  const [showScanReceive, setShowScanReceive] = useState(false);
  const [scanReceiveOrderId, setScanReceiveOrderId] = useState<string | undefined>(undefined);
  const [selectedPondForDetail, setSelectedPondForDetail] = useState<Pond | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3800);
  };

  // Login handler
  const handleLogin = (role: RoleId, email: string) => {
    setCurrentRole(role);
    setUser((prev) => ({ ...prev, role, email }));
    setIsLoggedIn(true);
    setActiveTab('home');
    const roleTitle = ROLES.find((r) => r.id === role)?.titleThai;
    showToast(`เข้าสู่ระบบสำเร็จในฐานะ "${roleTitle}"`);
  };

  const handleLogout = () => {
    playAudioBeep(440, 'sine', 0.2);
    setIsLoggedIn(false);
  };

  // Update Profile Settings Handler (Propagates globally immediately)
  const handleSaveSettings = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    showToast('บันทึกข้อมูลฟาร์มสำเร็จ อัปเดตชื่อทั่วทั้งระบบแล้ว');
  };

  // Role Switcher Handler (strictly 3 roles)
  const handleSelectRole = (role: RoleId) => {
    setCurrentRole(role);
    setUser((prev) => ({ ...prev, role }));
    setActiveTab('home');
    const roleTitle = ROLES.find((r) => r.id === role)?.titleThai;
    showToast(`สลับบทบาทเป็น "${roleTitle}" แล้ว`);
  };

  // Toggle Aerator for B2
  const handleToggleAeratorB2 = () => {
    playAudioBeep(640, 'sine', 0.2);
    setPonds((prev) =>
      prev.map((p) =>
        p.id === 'B2'
          ? {
              ...p,
              aeratorRunning: true,
              waterStatus: 'warning',
              waterStatusText: 'น้ำเริ่มแย่',
              conditionText: 'กำลังฟื้นฟู',
              warningNote: 'เปิดใบพัดเติมออกซิเจนเรียบร้อยแล้ว กุ้งเริ่มว่ายเป็นกลุ่มปกติ',
            }
          : p
      )
    );
    showToast('เปิดใบพัดเติมอากาศบ่อ B2 เรียบร้อยแล้ว กำลังเร่งออกซิเจนก้นบ่อ');
  };

  // Toggle Aerator for any pond
  const handleToggleAeratorAny = (pondId: string) => {
    setPonds((prev) =>
      prev.map((p) =>
        p.id === pondId
          ? {
              ...p,
              aeratorRunning: !p.aeratorRunning,
            }
          : p
      )
    );
    const target = ponds.find((p) => p.id === pondId);
    showToast(`${target?.aeratorRunning ? 'ปิด' : 'เปิด'}เครื่องตีน้ำบ่อ ${pondId} เรียบร้อย`);
  };

  // Batch "เหมือนเมื่อวาน" (1-click 20 ponds log simulation)
  const handleBatchLogYesterday = () => {
    playAudioBeep(640, 'triangle', 0.25);
    setPonds((prev) =>
      prev.map((p) => ({
        ...p,
        lastFedKg: p.id === 'A1' ? 35 : p.id === 'A2' ? 30 : p.id === 'B1' ? 28 : 20,
        feedTrayConsumedPercent: 90,
      }))
    );
    showToast('บันทึก 20 บ่อ เรียบร้อย ข้อมูลเหมือนเมื่อวาน');
  };

  // Water Quality Save
  const handleSaveWater = (pondId: string, status: WaterStatus, note: string) => {
    setPonds((prev) =>
      prev.map((p) =>
        p.id === pondId
          ? {
              ...p,
              waterStatus: status,
              waterStatusText: status === 'good' ? 'น้ำดี' : status === 'warning' ? 'น้ำเริ่มแย่' : 'น้ำอันตราย',
              conditionText: status === 'good' ? 'ปกติ' : status === 'warning' ? 'ต้องดู' : 'อันตราย',
              warningNote: note || (status === 'good' ? undefined : p.warningNote),
            }
          : p
      )
    );
    showToast(`บันทึกค่าน้ำบ่อ ${pondId}: สถานะ ${status === 'good' ? 'น้ำดี' : status === 'warning' ? 'น้ำเริ่มแย่' : 'น้ำอันตราย'}`);
  };

  // Feeding Save
  const handleSaveFeeding = (pondId: string, feedKg: number, trayPercent: number) => {
    setPonds((prev) =>
      prev.map((p) =>
        p.id === pondId
          ? {
              ...p,
              lastFedKg: feedKg,
              feedTrayConsumedPercent: trayPercent,
            }
          : p
      )
    );
    showToast(`บันทึกให้อาหารบ่อ ${pondId}: ${feedKg} กก. (เช็คยอ ${trayPercent}%) เรียบร้อย`);
  };

  // Sick Report Submit
  const handleReportSick = (pondId: string, symptoms: string[]) => {
    setPonds((prev) =>
      prev.map((p) =>
        p.id === pondId
          ? {
              ...p,
              waterStatus: 'danger',
              waterStatusText: 'น้ำอันตราย',
              conditionText: 'อันตราย',
              warningNote: `แจ้งเตือนอาการ: ${symptoms.join(', ')}`,
            }
          : p
      )
    );
    showToast(`บันทึกรายงานกุ้งป่วยบ่อ ${pondId} สำเร็จ ส่งต่อข้อมูลถึงหมอกุ้งแล้ว`);
  };

  // Speech to text parse & save
  const handleVoiceSpeechSubmit = (phrase: string) => {
    showToast(`แปลงเป็นข้อมูลสำเร็จ: บันทึก "${phrase}" ลงสมุดฟาร์มแล้ว`);
  };

  // Add Breed to My Ponds
  const handleSelectBreed = (breed: ShrimpBreed) => {
    showToast(`เพิ่มสายพันธุ์ "${breed.nameThai}" เข้าสู่แผนการเลี้ยงบ่อของฉันแล้ว`);
  };

  // Add Sales Record (Hatchery)
  const handleAddSalesRecord = (record: Omit<SalesRecord, 'id'>) => {
    const newRec: SalesRecord = {
      ...record,
      id: `SL-00${salesRecords.length + 1}`,
    };
    setSalesRecords([newRec, ...salesRecords]);
    showToast(`เพิ่มบันทึกส่งมอบลูกกุ้งรุ่น ${record.batchId} สำเร็จ`);
  };

  // Pond Add, Edit, Delete Handlers
  const handleAddPond = (newPond: Pond) => {
    setPonds((prev) => [...prev, newPond]);
    showToast(`เพิ่มบ่อใหม่ "${newPond.name}" เรียบร้อยแล้ว`);
  };

  const handleEditPond = (updatedPond: Pond) => {
    setPonds((prev) => prev.map((p) => (p.id === updatedPond.id ? updatedPond : p)));
    showToast(`แก้ไขข้อมูลบ่อ "${updatedPond.name}" สำเร็จ`);
  };

  const handleDeletePond = (pondId: string) => {
    setPonds((prev) => prev.filter((p) => p.id !== pondId));
    showToast(`ลบบ่อ ${pondId} เรียบร้อย`);
  };

  // Customer Order & Slip Handlers
  const handleAddCustomerOrder = (order: CustomerOrder, slip: PaymentSlip) => {
    setCustomerOrders((prev) => [order, ...prev]);
    setPaymentSlips((prev) => [slip, ...prev]);
    showToast(`สั่งซื้อกุ้งสำเร็จ รหัสออเดอร์ ${order.id} ได้รับสลิปเรียบร้อย`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setCustomerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleConfirmScanReceive = (orderId: string, receivedDateTime: string) => {
    setCustomerOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.batchId === orderId
          ? { ...o, status: 'รับกุ้งแล้ว', receivedDate: receivedDateTime }
          : o
      )
    );
    setShowScanReceive(false);
    showToast(`ยืนยันการรับกุ้งล็อต ${orderId} สำเร็จ บันทึกประวัติเรียบร้อย`);
  };

  const handleReportScanIssue = (orderId: string, symptoms: string, photoFileName?: string) => {
    setCustomerOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.batchId === orderId
          ? {
              ...o,
              status: 'รายงานปัญหา',
              issueReport: {
                symptoms,
                photoUrl: photoFileName,
                reportedAt: new Date().toLocaleDateString('th-TH'),
              },
            }
          : o
      )
    );
    showToast(`แจ้งรายงานปัญหาของล็อต ${orderId} เรียบร้อยแล้ว`);
  };

  // Return Auth screen if logged out
  if (!isLoggedIn) {
    return (
      <>
        <AuthScreen
          onLogin={handleLogin}
          onOpenOnboarding={() => setShowOnboarding(true)}
          initialUser={user}
        />
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF7A1A]/20">
      {/* Top Navbar */}
      <Navbar
        user={user}
        currentRole={currentRole}
        onOpenSettings={() => setShowSettings(true)}
        onOpenRoleSelect={() => setShowRoleSelect(true)}
        onLogout={handleLogout}
        onTriggerVoiceAlert={() => speakThaiText('วันนี้บ่อ B2 น้ำไม่ดี อย่าลืมไปดู')}
        onOpenStickers={() => setShowStickerGallery(true)}
      />

      {/* Main Content Area - Mobile-Centric Max Width 480px */}
      <main className="flex-1 max-w-[480px] w-full mx-auto px-3 pt-3">
        {/* ========================================================= */}
        {/* ROLE 1: CUSTOMER ROLE (Strict separation: customer tabs) */}
        {/* ========================================================= */}
        {currentRole === 'customer' ? (
          <CustomerView
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast('คุณอยู่ที่หน้าตลาดกุ้ง');
            }}
            onShowToast={showToast}
            onOpenScanReceive={(orderId) => {
              setScanReceiveOrderId(orderId);
              setShowScanReceive(true);
            }}
            customerOrders={customerOrders}
            onAddCustomerOrder={handleAddCustomerOrder}
          />
        ) : currentRole === 'hatchery' ? (
          /* ========================================================= */
          /* ROLE 2: HATCHERY ROLE (Strict separation: hatchery tabs)  */
          /* ========================================================= */
          <HatcheryView
            user={user}
            salesRecords={salesRecords}
            onAddSalesRecord={handleAddSalesRecord}
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast('คุณอยู่ที่หน้าหลักโรงเพาะฟัก');
            }}
            onShowToast={showToast}
          />
        ) : (
          /* ========================================================= */
          /* ROLE 3: FARMER OWNER (Ponds, Tasks, Farm Profile, etc.)   */
          /* ========================================================= */
          <>
            {activeTab === 'home' && (
              <ErrorBoundary fallbackTitle="เกิดข้อผิดพลาดในหน้าเจ้าของฟาร์ม">
                <FarmerHome
                  user={user}
                  ponds={ponds}
                  currentRole={currentRole}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => {
                    setSoundEnabled(!soundEnabled);
                    showToast(!soundEnabled ? 'เปิดเสียงแจ้งเตือนแล้ว' : 'ปิดเสียงแจ้งเตือนแล้ว');
                  }}
                  onSelectRole={handleSelectRole}
                  onOpenFeeding={() => setShowFeedingModal(true)}
                  onOpenWater={() => setShowWaterModal(true)}
                  onOpenSickReport={() => setShowSickReport(true)}
                  onOpenOnboarding={() => setShowOnboarding(true)}
                  onOpenPondDetail={(pond) => setSelectedPondForDetail(pond)}
                  onOpenPhoneDirectory={() => setShowPhoneDirectory(true)}
                  onOpenDoctor={() => setShowDoctorCall(true)}
                  onOpenFactoryCall={() => setShowFactoryCall(true)}
                  onBatchLogYesterday={handleBatchLogYesterday}
                  onToggleAeratorB2={handleToggleAeratorB2}
                  onVoiceSpeechSubmit={handleVoiceSpeechSubmit}
                  onGoToTab={(tab) => setActiveTab(tab)}
                  onShowToast={showToast}
                  onOpenStickers={() => setShowStickerGallery(true)}
                  onOpenMyFarmProfile={() => setActiveTab('myfarm')}
                  onOpenScanReceive={() => setShowScanReceive(true)}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'myfarm' && (
              <ErrorBoundary fallbackTitle="เกิดข้อผิดพลาดในหน้าโปรไฟล์ฟาร์ม">
                <FarmerProfileView
                  user={user}
                  customerOrders={customerOrders}
                  paymentSlips={paymentSlips}
                  onUpdateUser={handleSaveSettings}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onBackToHome={() => setActiveTab('home')}
                  onShowToast={showToast}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'ponds' && (
              <ErrorBoundary fallbackTitle="เกิดข้อผิดพลาดในหน้าบ่อของฉัน">
                <PondsView
                  ponds={ponds}
                  onOpenWater={() => setShowWaterModal(true)}
                  onOpenFeeding={() => setShowFeedingModal(true)}
                  onOpenPondDetail={(pond) => setSelectedPondForDetail(pond)}
                  onBackToHome={() => setActiveTab('home')}
                  onAddPond={handleAddPond}
                  onEditPond={handleEditPond}
                  onDeletePond={handleDeletePond}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'tasks' && (
              <TodayTasksView
                onBackToHome={() => setActiveTab('home')}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'sell' && (
              <SellShrimpView
                ponds={ponds}
                onOpenBooking={() => setShowFactoryBooking(true)}
                onOpenFactoryCall={() => setShowFactoryCall(true)}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'money' && (
              <MoneyView
                onBackToHome={() => setActiveTab('home')}
                onGoToSell={() => setActiveTab('sell')}
              />
            )}

            {activeTab === 'breeds' && (
              <BreedsView
                onBackToHome={() => setActiveTab('home')}
                onSelectBreed={handleSelectBreed}
              />
            )}

            {activeTab === 'diseases' && (
              <DiseasesView
                onBackToHome={() => setActiveTab('home')}
                onOpenDoctor={() => setShowDoctorCall(true)}
              />
            )}

            {activeTab === 'prices' && (
              <PricesView
                onBackToHome={() => setActiveTab('home')}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* 2-Row 8-Button Bottom Navigation (Only visible for Farmer Owner, as Customer and Hatchery have their own dedicated navigation) */}
      {currentRole === 'owner' && (
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      )}

      {/* Floating Chat Widget on bottom-right */}
      <FloatingChat />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-[#1A2B33] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-[#FF7A1A] animate-fadeIn max-w-[90vw] text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A1A] animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* All Dialogs & Modals */}
      <ScanReceiveModal
        isOpen={showScanReceive}
        onClose={() => setShowScanReceive(false)}
        orders={customerOrders}
        onConfirmReceive={handleConfirmScanReceive}
        onReportIssue={handleReportScanIssue}
        initialOrderId={scanReceiveOrderId}
      />

      <StickerGalleryModal
        isOpen={showStickerGallery}
        onClose={() => setShowStickerGallery(false)}
      />

      <PhoneDirectoryModal
        isOpen={showPhoneDirectory}
        onClose={() => setShowPhoneDirectory(false)}
        onCallSuccess={showToast}
      />

      <PondDetailModal
        pond={selectedPondForDetail}
        onClose={() => setSelectedPondForDetail(null)}
        onOpenWater={(pondId) => {
          setShowWaterModal(true);
        }}
        onOpenFeeding={(pondId) => {
          setShowFeedingModal(true);
        }}
        onToggleAerator={handleToggleAeratorAny}
      />

      <VoiceMicModal
        isOpen={showVoiceMic}
        onClose={() => setShowVoiceMic(false)}
        onSuccess={showToast}
      />

      <DoctorCallModal
        isOpen={showDoctorCall}
        onClose={() => setShowDoctorCall(false)}
        onSuccess={showToast}
      />

      <FactoryCallModal
        isOpen={showFactoryCall}
        onClose={() => setShowFactoryCall(false)}
        onSuccess={showToast}
        onBookQueue={() => setShowFactoryBooking(true)}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onSave={handleSaveSettings}
      />

      <RoleSelectModal
        isOpen={showRoleSelect}
        onClose={() => setShowRoleSelect(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
      />

      <WaterQualityModal
        isOpen={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        ponds={ponds}
        onSave={handleSaveWater}
      />

      <FeedingModal
        isOpen={showFeedingModal}
        onClose={() => setShowFeedingModal(false)}
        ponds={ponds}
        onSave={handleSaveFeeding}
      />

      <ReportSickModal
        isOpen={showSickReport}
        onClose={() => setShowSickReport(false)}
        ponds={ponds}
        onOpenDoctor={() => setShowDoctorCall(true)}
        onSubmitReport={handleReportSick}
      />

      <EhpWarningModal
        isOpen={showEhpWarning}
        onClose={() => setShowEhpWarning(false)}
        onOpenDoctor={() => setShowDoctorCall(true)}
        onAppliedSteps={handleToggleAeratorB2}
      />

      <FactoryBookingModal
        isOpen={showFactoryBooking}
        onClose={() => setShowFactoryBooking(false)}
        ponds={ponds}
        onConfirmBooking={(b) => {
          showToast(`จองคิวส่ง ${b.factory} สำเร็จ! นัดหมาย ${b.date} (${b.weightKg} กก.)`);
        }}
      />
    </div>
  );
}
