import React from 'react';
import { Settings, Users, LogOut, Volume2, Sparkles } from 'lucide-react';
import { RoleId, UserProfile } from '../types';
import { ROLES } from '../data/initialData';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import { playAudioBeep, speakThaiText } from '../utils/audio';

interface NavbarProps {
  user: UserProfile;
  currentRole: RoleId;
  onOpenSettings: () => void;
  onOpenRoleSelect: () => void;
  onLogout: () => void;
  onTriggerVoiceAlert: () => void;
  onOpenStickers: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentRole,
  onOpenSettings,
  onOpenRoleSelect,
  onLogout,
  onTriggerVoiceAlert,
  onOpenStickers,
}) => {
  const roleInfo = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFEFB]/95 backdrop-blur-md border-b border-[#F2C9A0] px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFF4EA] to-[#FFE9D6] border-2 border-[#F2C9A0] flex items-center justify-center p-1 shadow-xs">
            <ChromaSticker src={STICKER_MAP.logo.src} size={36} alt="โลโก้กุ้งส้ม" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-[#1A2B33] tracking-tight">
                ShrimpTrace
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
                กุ้งไทยตรวจวงจร
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#1A2B33]/70 font-medium truncate max-w-[130px] sm:max-w-xs">
              {user.farmName}
            </p>
          </div>
        </div>

        {/* Action Controls & Role Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Sticker Gallery Button */}
          <button
            onClick={onOpenStickers}
            title="ดูชุดสติกเกอร์กุ้ง 15 แบบ"
            className="h-9 px-2 sm:px-2.5 bg-[#FFF4EA] hover:bg-[#FFE9D6] border border-[#FF7A1A]/40 text-[#FF7A1A] rounded-xl flex items-center gap-1 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A1A]" />
            <span className="hidden sm:inline">สติกเกอร์ 15 ชิ้น</span>
          </button>
          {/* Thai Voice Reader Quick Button */}
          <button
            onClick={onTriggerVoiceAlert}
            title="กดฟังเสียงอ่านแจ้งเตือนวันนี้"
            className="h-10 px-2.5 sm:px-3 bg-[#FFF4EA] hover:bg-[#FFE9D6] border border-[#F2C9A0] text-[#FF7A1A] rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">ฟังเสียงเตือน</span>
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={onOpenRoleSelect}
            className="h-10 px-3 bg-[#FFF4EA] hover:bg-[#FFE9D6] border border-[#F2C9A0] text-[#1A2B33] rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <ChromaSticker src={STICKER_MAP.logo.src} size={20} alt="กุ้ง" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-[#1A2B33]/60 block leading-none">บทบาท</span>
              <span className="text-xs font-bold text-[#FF7A1A] leading-tight block">
                {roleInfo.titleThai}
              </span>
            </div>
            <span className="sm:hidden text-xs font-bold text-[#FF7A1A]">
              {roleInfo.titleThai}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-white hover:bg-[#FFF4EA] border border-[#F2C9A0] text-[#1A2B33] flex items-center justify-center transition-colors shadow-sm"
            title="ตั้งค่าชื่อฟาร์มและข้อมูลผู้ใช้"
            aria-label="ตั้งค่า"
          >
            <Settings className="w-4 h-4 text-[#FF7A1A]" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-xl bg-white hover:bg-rose-50 border border-[#F2C9A0] text-rose-600 flex items-center justify-center transition-colors shadow-sm"
            title="ออกจากระบบ"
            aria-label="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
