import React, { useState } from 'react';
import { LogIn, KeyRound, Mail, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { RoleId, UserProfile } from '../types';
import { ROLES } from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface AuthScreenProps {
  onLogin: (role: RoleId, email: string) => void;
  onOpenOnboarding: () => void;
  initialUser: UserProfile;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onOpenOnboarding,
}) => {
  const [email, setEmail] = useState('demo@shrimptrace.co.th');
  const [password, setPassword] = useState('123456');
  const [selectedRole, setSelectedRole] = useState<RoleId>('owner');
  const [step, setStep] = useState<'credentials' | 'role_select'>('credentials');

  const handleQuickDemo = () => {
    playAudioBeep(650, 'sine', 0.2);
    setStep('role_select');
  };

  const handleFinishLogin = (role: RoleId = selectedRole) => {
    playAudioBeep(720, 'sine', 0.2);
    onLogin(role, email);
  };

  return (
    <div className="min-h-screen py-6 px-3 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-[480px] mx-auto relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center mb-2">
            <ShrimpSticker size="hero" withBadge />
          </div>
          <h1 className="text-3xl font-black text-[#1A2B33] tracking-tight">
            ShrimpTrace
          </h1>
          <p className="text-lg font-bold text-[#FF7A1A]">
            กุ้งไทยตรวจวงจร MVP
          </p>
          <p className="text-xs text-[#1A2B33]/70 mt-0.5">
            Thai Shrimp ERP & Traceability แอปเดียวจบ ภาษาไทยทั้งหมด
          </p>
        </div>

        {step === 'credentials' ? (
          /* Step 1: Login Credentials */
          <div className="shrimp-card p-5 sm:p-7 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2C9A0]/50">
              <span className="text-xs font-bold text-[#1A2B33] flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-[#FF7A1A]" /> ลงทะเบียน / เข้าสู่ระบบ
              </span>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="text-[11px] font-bold text-[#FF7A1A] hover:underline flex items-center gap-1 bg-[#FFF4EA] px-2.5 py-1 rounded-full border border-[#F2C9A0]"
              >
                <HelpCircle className="w-3.5 h-3.5" /> แนะนำ 3 ขั้นตอน
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuickDemo();
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-[#1A2B33] mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#FF7A1A]" /> อีเมลเข้าใช้งาน
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-13 px-4 text-sm font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
                  placeholder="demo@shrimptrace.co.th"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2B33] mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#FF7A1A]" /> รหัสผ่าน
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-13 px-4 text-sm font-semibold text-[#1A2B33] bg-[#FFFDF9] border-2 border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
                  placeholder="123456"
                />
              </div>

              <div className="bg-[#FFF4EA] border border-[#F2C9A0] rounded-2xl p-3 text-xs text-[#1A2B33]/80 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF7A1A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1A2B33] block">กรอกข้อมูลทดลองไว้ล่วงหน้าแล้ว:</span>
                  <span className="font-mono text-[#FF7A1A] font-bold">demo@shrimptrace.co.th</span> / <span className="font-mono text-[#FF7A1A] font-bold">123456</span> แก้ได้
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full h-16 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-lg font-black rounded-2xl shadow-xl shadow-[#FF7A1A]/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  เข้าทดลองใช้เลย (ไม่ต้องสมัคร)
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishLogin('owner')}
                  className="w-full h-12 bg-white border border-[#F2C9A0] text-[#1A2B33] text-xs font-bold rounded-xl hover:bg-[#FFF4EA] transition-colors"
                >
                  เข้าใช้งานทันทีในฐานะ "เจ้าของฟาร์ม (Owner)"
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Role Selection (3 Roles Only) */
          <div className="shrimp-card p-5 sm:p-7 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2C9A0]/50">
              <div>
                <span className="text-[10px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-2 py-0.5 rounded-full border border-[#F2C9A0]">
                  ขั้นตอนที่ 2
                </span>
                <h3 className="text-xl font-black text-[#1A2B33] mt-0.5">
                  เลือกบทบาท (3 บทบาทเท่านั้น)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs font-semibold text-[#1A2B33]/60 hover:text-[#1A2B33] underline"
              >
                ย้อนกลับ
              </button>
            </div>

            {/* 3 Roles: 2 Columns on top, 3rd centered below */}
            <div className="space-y-2.5 mb-5">
              <div className="grid grid-cols-2 gap-2">
                {ROLES.slice(0, 2).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      handleFinishLogin(role.id);
                    }}
                    className={`text-center p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between ${
                      selectedRole === role.id
                        ? 'bg-[#FFF4EA] border-[#FF7A1A] shadow-md shadow-[#FF7A1A]/10 scale-[1.01]'
                        : 'bg-white border-[#F2C9A0] hover:bg-[#FFFDF9]'
                    }`}
                  >
                    <div className="mb-1.5">
                      <ShrimpSticker size="sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#1A2B33]">
                        {role.titleThai}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#1A2B33]/60">
                        ({role.titleEng})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 3rd Role: ผู้ใช้งาน / ลูกค้า (Customer) */}
              {ROLES[2] && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(ROLES[2].id);
                    handleFinishLogin(ROLES[2].id);
                  }}
                  className={`w-full text-center p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between ${
                    selectedRole === ROLES[2].id
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.01]'
                      : 'bg-white border-[#F2C9A0] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <div className="mb-1.5">
                    <ShrimpSticker size="sm" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 mb-1 inline-block">
                      {ROLES[2].badge}
                    </span>
                    <h4 className="text-sm font-black text-[#1A2B33]">
                      {ROLES[2].titleThai}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#1A2B33]/60">
                      ({ROLES[2].titleEng})
                    </span>
                  </div>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleFinishLogin(selectedRole)}
              className="w-full h-14 bg-[#FF7A1A] hover:bg-[#E65800] text-white text-base font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              เข้าสู่ระบบด้วยบทบาทนี้ <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="text-center mt-5 text-[11px] text-[#1A2B33]/60 font-semibold">
          ฟอนต์ตัวใหญ่ ปุ่มสูง 56-64px อ่านกลางแดดได้ มือเปียกกดได้
        </div>
      </div>
    </div>
  );
};
