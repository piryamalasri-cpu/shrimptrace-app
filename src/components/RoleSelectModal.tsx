import React from 'react';
import { Check, X, ShieldCheck, Home, ShoppingBag } from 'lucide-react';
import { RoleId } from '../types';
import { ROLES } from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep } from '../utils/audio';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: RoleId;
  onSelectRole: (role: RoleId) => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const handleSelect = (roleId: RoleId) => {
    playAudioBeep(620, 'sine', 0.15);
    onSelectRole(roleId);
    onClose();
  };

  const getRoleIcon = (roleId: RoleId) => {
    if (roleId === 'hatchery') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center p-1 shadow-xs">
          <ChromaSticker src={STICKER_MAP.hatchery.src} size={48} alt="โรงเพาะฟัก" />
        </div>
      );
    }
    if (roleId === 'owner') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center p-1 shadow-xs">
          <ChromaSticker src={STICKER_MAP.pond.src} size={48} alt="คนเลี้ยงกุ้ง" />
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center p-1 shadow-xs">
        <ChromaSticker src={STICKER_MAP.money.src} size={48} alt="ลูกค้า" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="shrimp-card w-full max-w-[460px] max-h-[92vh] overflow-y-auto p-5 sm:p-6 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FFE9D6] text-[#1A2B33]/70"
          aria-label="ปิด"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-1.5">
            <ChromaSticker src={STICKER_MAP.logo.src} size={64} alt="โลโก้กุ้ง" />
          </div>
          <h2 className="text-2xl font-black text-[#1A2B33]">
            เลือกบทบาท (3 บทบาท)
          </h2>
          <p className="text-xs text-[#1A2B33]/70 mt-0.5">
            เลือกหน้าที่ของคุณในระบบวงจรกุ้งไทย
          </p>
        </div>

        {/* 3 Roles: 2 Columns on top (Hatchery & Farmer), 3rd centered below (Customer) */}
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.slice(0, 2).map((role) => {
              const isSelected = role.id === currentRole;
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelect(role.id)}
                  className={`text-center p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between relative active:scale-98 ${
                    isSelected
                      ? 'bg-[#FFF4EA] border-[#FF7A1A] shadow-md shadow-[#FF7A1A]/10'
                      : 'bg-[#FFFEFB] border-[#F2C9A0] hover:bg-[#FFFDF9]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-[#FF7A1A] text-white p-1 rounded-full shadow">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="mb-2">
                    {getRoleIcon(role.id)}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#FF7A1A] bg-white px-2 py-0.5 rounded-full border border-[#F2C9A0] mb-1 inline-block">
                      {role.badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-[#1A2B33]">
                      {role.titleThai}
                    </h4>
                    <p className="text-[11px] text-[#1A2B33]/70 mt-1 line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3rd Role: ผู้ใช้งาน / ลูกค้า (Customer) */}
          {ROLES[2] && (
            <button
              onClick={() => handleSelect(ROLES[2].id)}
              className={`w-full text-center p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between relative active:scale-98 ${
                currentRole === ROLES[2].id
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-[#FFFEFB] border-[#F2C9A0] hover:bg-[#FFFDF9]'
              }`}
            >
              {currentRole === ROLES[2].id && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="mb-2">
                {getRoleIcon(ROLES[2].id)}
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 mb-1 inline-block">
                  {ROLES[2].badge}
                </span>
                <h4 className="text-base font-black text-[#1A2B33]">
                  {ROLES[2].titleThai}
                </h4>
                <p className="text-[11px] text-[#1A2B33]/70 mt-1 max-w-xs mx-auto leading-relaxed">
                  {ROLES[2].description}
                </p>
              </div>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] font-bold text-sm rounded-xl hover:bg-[#FFF4EA]"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};
