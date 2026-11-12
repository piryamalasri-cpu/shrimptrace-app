import React, { useState, useEffect } from 'react';
import { User, Building, Phone, MapPin, Check, X } from 'lucide-react';
import { UserProfile } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

const THAI_PROVINCES = [
  'สมุทรปราการ',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ระยอง',
  'จันทบุรี',
  'ตราด',
  'สุราษฎร์ธานี',
  'นครศรีธรรมราช',
  'สงขลา',
  'กระบี่',
  'พังงา',
  'ภูเก็ต',
  'ตรัง',
  'สตูล',
  'เพชรบุรี',
  'ประจวบคีรีขันธ์',
  'สมุทรสาคร',
  'สมุทรสงคราม',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    farmName: user.farmName,
    phone: user.phone,
    province: user.province,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name,
        farmName: user.farmName,
        phone: user.phone,
        province: user.province,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(680, 'sine', 0.2);
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-lg p-6 sm:p-8 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <ShrimpSticker size="md" withBadge />
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A2B33]">
              ตั้งค่าข้อมูลฟาร์มและผู้ใช้งาน
            </h3>
            <p className="text-xs sm:text-sm text-[#1A2B33]/70">
              เมื่อกดบันทึก ข้อมูลจะอัปเดตทั่วทั้งแอปทันที
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1A2B33] mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FF7A1A]" /> ชื่อผู้ใช้ / ผู้จัดการฟาร์ม
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full h-14 px-4 text-base font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-2xl focus:outline-none focus:border-[#FF7A1A] transition-colors"
              placeholder="เช่น สมชาย เจริญฟาร์ม"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A2B33] mb-1.5 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#FF7A1A]" /> ชื่อฟาร์ม / ชื่อสถานที่
            </label>
            <input
              type="text"
              value={formData.farmName}
              onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              required
              className="w-full h-14 px-4 text-base font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-2xl focus:outline-none focus:border-[#FF7A1A] transition-colors"
              placeholder="เช่น ฟาร์มสมชาย ซีฟู้ด (บางบ่อ)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1A2B33] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#FF7A1A]" /> เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full h-14 px-4 text-base font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-2xl focus:outline-none focus:border-[#FF7A1A] transition-colors"
                placeholder="081-998-7654"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2B33] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF7A1A]" /> จังหวัด
              </label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full h-14 px-4 text-base font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-2xl focus:outline-none focus:border-[#FF7A1A] transition-colors cursor-pointer"
              >
                {THAI_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-14 sm:w-1/3 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold rounded-2xl hover:bg-[#FFF4EA] transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Check className="w-6 h-6" />
              บันทึกข้อมูลทันที
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
