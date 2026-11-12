import React, { useState } from 'react';
import { TaskItem } from '../types';
import { INITIAL_TASKS } from '../data/initialData';
import { ShrimpSticker } from './ShrimpSticker';
import { ChromaSticker } from './ChromaSticker';
import { STICKER_MAP } from '../assets/stickers';
import {
  CheckCircle2,
  CopyCheck,
  Layers,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { playAudioBeep } from '../utils/audio';

interface TodayTasksViewProps {
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

export const TodayTasksView: React.FC<TodayTasksViewProps> = ({
  onBackToHome,
  onShowToast,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const toggleTask = (taskId: string) => {
    playAudioBeep(640, 'sine', 0.15);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleUseYesterday = () => {
    playAudioBeep(720, 'triangle', 0.2);
    setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
    onShowToast('ใช้เหมือนเมื่อวานเรียบร้อย บันทึกครบทุกงานแล้ว');
  };

  const handleApplyAllFarm = () => {
    playAudioBeep(680, 'sine', 0.2);
    setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
    onShowToast('ใช้ทั้งฟาร์มเรียบร้อย บันทึกครบทุกบ่อแล้ว');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-4 pb-28 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="shrimp-card p-5 bg-gradient-to-r from-[#FFFDF9] via-[#FFF6ED] to-[#FFEEDF] border-2 border-[#F2C9A0] rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#F2C9A0] flex items-center justify-center p-1 shrink-0 shadow-xs">
            <ChromaSticker src={STICKER_MAP.tasks.src} size={48} alt="งานวันนี้" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#FF7A1A] bg-white px-2.5 py-0.5 rounded-full border border-[#F2C9A0]">
              งานประจำวัน
            </span>
            <h1 className="text-2xl font-black text-[#1A2B33] mt-0.5">
              งานวันนี้ (Checklist)
            </h1>
          </div>
        </div>
        <p className="text-xs text-[#1A2B33]/70 font-semibold">
          วัดน้ำเช้า เช็คยอ ให้อาหาร ติ๊กได้จริง เสร็จแล้ว {completedCount}/{tasks.length} ข้อ
        </p>
      </div>

      {/* 2 Buttons: ใช้เหมือนเมื่อวาน / ใช้ทั้งฟาร์ม */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleUseYesterday}
          className="h-13 px-3 bg-[#FFF4EA] hover:bg-[#FFE9D6] border-2 border-[#FF7A1A] text-[#FF7A1A] font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <CopyCheck className="w-4 h-4" />
          <span>ใช้เหมือนเมื่อวาน</span>
        </button>
        <button
          onClick={handleApplyAllFarm}
          className="h-13 px-3 bg-[#FF7A1A] hover:bg-[#E65800] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-[#FF7A1A]/20 active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>ใช้ทั้งฟาร์ม</span>
        </button>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const isDone = task.completed;
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`shrimp-card p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-[#FFFEFB] border-[#F2C9A0] hover:bg-[#FFFDF9]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-[#F2C9A0] bg-white text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isDone ? 'line-through text-[#1A2B33]/50' : 'text-[#1A2B33]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF7A1A] bg-[#FFF4EA] px-1.5 py-0.2 rounded-md">
                      {task.pond}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1A2B33]/70">{task.subtitle}</p>
                </div>
              </div>

              <div className="text-[10px] font-bold text-[#1A2B33]/60 shrink-0">
                {task.time} น.
              </div>
            </div>
          );
        })}
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
