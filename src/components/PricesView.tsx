import React, { useState } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Bell,
  Calculator,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { PriceRow } from '../types';
import { INITIAL_PRICES, SEVEN_DAYS_PRICE_HISTORY } from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

interface PricesViewProps {
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

export const PricesView: React.FC<PricesViewProps> = ({ onBackToHome, onShowToast }) => {
  const [prices, setPrices] = useState<PriceRow[]>(INITIAL_PRICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateText, setLastUpdateText] = useState('08:00 น.');

  // Alert price setup
  const [alertTargetPrice, setAlertTargetPrice] = useState('180');
  const [alertConfigured, setAlertConfigured] = useState(false);

  // Revenue Calculator
  const [calcKg, setCalcKg] = useState(1500);
  const [calcSize, setCalcSize] = useState(50);

  // 2-second rotating load and fluctuation
  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    playAudioBeep(520, 'sine', 0.15);

    setTimeout(() => {
      setPrices((prev) =>
        prev.map((row) => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const newPrice = Math.max(100, row.priceToday + delta);
          const diff = newPrice - row.priceYesterday;
          const diffTrend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'same';
          return {
            ...row,
            priceToday: newPrice,
            diff,
            diffTrend,
          };
        })
      );
      setIsRefreshing(false);
      setLastUpdateText('ล่าสุดเมื่อสักครู่');
      playAudioBeep(880, 'triangle', 0.2);
      onShowToast('อัปเดตราคาแล้ว');
    }, 2000);
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep(640, 'sine', 0.2);
    setAlertConfigured(true);
    onShowToast(`ตั้งแจ้งเตือนราคา ฿${alertTargetPrice} เรียบร้อยแล้ว`);
  };

  const currentPriceForSize =
    prices.find((p) => p.sizeCount === calcSize)?.priceToday || 165;
  const calculatedTotal = calcKg * currentPriceForSize;

  const overallDiff = prices.reduce((acc, curr) => acc + curr.diff, 0);
  const isPriceUp = overallDiff >= 3;
  const isPriceDown = overallDiff < 0;

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* 1. แถบเขียว "● ราคาสด อัปเดตล่าสุดวันนี้ 08:00 น. จากตลาดทะเลไทย + สมาคมกุ้งไทย" */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-white animate-ping shrink-0" />
          <p className="font-black text-sm leading-tight">
            ● ราคาสด อัปเดตล่าสุดวันนี้ {lastUpdateText} จากตลาดทะเลไทย + สมาคมกุ้งไทย
          </p>
        </div>

        {/* ปุ่ม "อัปเดตราคาตอนนี้" หมุน 2 วินาที */}
        <button
          onClick={handleRefreshPrices}
          disabled={isRefreshing}
          className="w-full h-12 px-4 bg-white text-emerald-800 font-black text-xs sm:text-sm rounded-xl hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'กำลังหมุนโหลด 2 วินาที...' : 'อัปเดตราคาตอนนี้'}</span>
        </button>
      </div>

      {/* 2. การ์ดเขียว "ราคาขึ้นแล้ว พร้อมขาย!" / การ์ดเหลือง "ราคาลง รออีกหน่อยไหม?" */}
      {isPriceUp && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <h4 className="text-base font-black text-emerald-950">
              ราคาขึ้นแล้ว พร้อมขาย!
            </h4>
            <p className="text-xs text-emerald-800">
              ราคากลางปรับขึ้นต่อเนื่อง เหมาะแก่การสั่งจับกุ้งทำกำไร
            </p>
          </div>
        </div>
      )}

      {isPriceDown && (
        <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <h4 className="text-base font-black text-amber-950">
              ราคาลง รออีกหน่อยไหม?
            </h4>
            <p className="text-xs text-amber-900">
              ตลาดรับซื้อกุ้งเข้าเยอะ หากยังไม่แน่นบ่อ ชะลอจับ 3-5 วัน
            </p>
          </div>
        </div>
      )}

      {/* 3. ตารางราคา 40, 50, 60, 70, 80 ตัว/กก. */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <h3 className="text-base font-black text-[#1A2B33] mb-3">
          ตารางราคากุ้งขาวแวนนาไม (บาท/กก.)
        </h3>

        <div className="space-y-2">
          {prices.map((row) => {
            const isUp = row.diffTrend === 'up';
            const isDown = row.diffTrend === 'down';
            const isSame = row.diffTrend === 'same';

            return (
              <div
                key={row.sizeCount}
                className="p-3 bg-[#FFFDF9] border border-[#F2C9A0]/60 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="font-black text-sm text-[#1A2B33]">
                    {row.sizeCount} ตัว/กก.
                  </span>
                  <span className="text-[11px] text-[#1A2B33]/60 block">
                    เมื่อวาน {row.priceYesterday} บ.
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="text-xl font-black text-[#FF7A1A] tabular-nums">
                    {row.priceToday} บ.
                  </span>

                  <div className="w-16 text-right">
                    {isUp && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-0.5">
                        <ArrowUp className="w-3.5 h-3.5" /> +{row.diff} บ.
                      </span>
                    )}
                    {isDown && (
                      <span className="text-xs font-bold text-rose-700 flex items-center justify-end gap-0.5">
                        <ArrowDown className="w-3.5 h-3.5" /> {row.diff} บ.
                      </span>
                    )}
                    {isSame && (
                      <span className="text-xs font-medium text-slate-500 flex items-center justify-end gap-0.5">
                        <Minus className="w-3.5 h-3.5" /> เท่าเดิม
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. กราฟราคา 7 วัน */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <h3 className="text-sm font-black text-[#1A2B33] mb-1">
          กราฟแนวโน้มราคา 7 วัน (ไซส์ 40 ตัว/กก.)
        </h3>
        <p className="text-[11px] text-[#1A2B33]/60 mb-3">สะท้อนทิศทางราคาตลาดมหาชัย</p>

        <div className="grid grid-cols-7 gap-1 pt-3 pb-1 items-end h-36 bg-[#FFFDF9] p-2 rounded-xl border border-[#F2C9A0]/40">
          {SEVEN_DAYS_PRICE_HISTORY.map((day, idx) => {
            const height = ((day.price40 - 180) / 15) * 100;
            const isToday = idx === SEVEN_DAYS_PRICE_HISTORY.length - 1;

            return (
              <div key={day.date} className="flex flex-col items-center h-full justify-end">
                <div
                  style={{ height: `${Math.max(20, height)}%` }}
                  className={`w-full max-w-[20px] rounded-t-md transition-all ${
                    isToday ? 'bg-[#FF7A1A]' : 'bg-[#FF7A1A]/60'
                  }`}
                />
                <span className={`text-[9px] font-bold mt-1.5 truncate ${isToday ? 'text-[#FF7A1A]' : 'text-[#1A2B33]/60'}`}>
                  {day.date}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#1A2B33] tabular-nums">
                  ฿{day.price40}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ช่องแจ้งเตือนราคา: ใส่ราคา เช่น 180 บาท กดตั้งแจ้งเตือน */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[#FF7A1A]" />
          <h4 className="text-sm font-black text-[#1A2B33]">ช่องแจ้งเตือนราคา</h4>
        </div>
        <form onSubmit={handleSetAlert} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(e.target.value)}
              placeholder="180"
              required
              className="flex-1 h-12 px-3 text-base font-black text-[#FF7A1A] bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
            />
            <button
              type="submit"
              className="h-12 px-4 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs shrink-0"
            >
              ตั้งแจ้งเตือน
            </button>
          </div>
          {alertConfigured && (
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ตั้งเตือนเมื่อราคาแตะ ฿{alertTargetPrice} แล้ว
            </p>
          )}
        </form>
      </div>

      {/* 6. เครื่องคิดเงิน: ใส่จำนวนกิโล + เลือกขนาด */}
      <div className="shrimp-card p-4 bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[24px]">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-black text-[#1A2B33]">เครื่องคิดเงินสดขายกุ้ง</h4>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#1A2B33] mb-1">
                จำนวนกิโลกรัม:
              </label>
              <input
                type="number"
                value={calcKg}
                onChange={(e) => setCalcKg(Math.max(1, Number(e.target.value)))}
                step={50}
                className="w-full h-11 px-2.5 text-sm font-bold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#1A2B33] mb-1">
                ขนาดกุ้ง:
              </label>
              <select
                value={calcSize}
                onChange={(e) => setCalcSize(Number(e.target.value))}
                className="w-full h-11 px-2 text-xs font-bold bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl"
              >
                {prices.map((p) => (
                  <option key={p.sizeCount} value={p.sizeCount}>
                    {p.sizeCount} ตัว (฿{p.priceToday})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-emerald-50 to-[#FFF9F2] border-2 border-emerald-300 rounded-2xl text-center">
            <span className="text-[11px] font-semibold text-emerald-900 block">
              ยอดเงินสดที่ได้รับ (฿{currentPriceForSize}/กก.)
            </span>
            <span className="text-3xl font-black text-emerald-700 tabular-nums block mt-0.5">
              ฿ {calculatedTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 7. แหล่งข้อมูล */}
      <div className="p-3 bg-[#FFF9F2] rounded-xl border border-[#F2C9A0]/60 text-[11px] text-[#1A2B33]/80 leading-relaxed">
        <strong>แหล่งข้อมูล:</strong> ตลาดทะเลไทย, สมาคมกุ้งไทย, โรงงานรับซื้อ อัปเดต 08:00 และ 16:00
      </div>

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
