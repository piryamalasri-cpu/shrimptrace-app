import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { ShrimpSticker } from './ShrimpSticker';
import { playAudioBeep } from '../utils/audio';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'สวัสดีครับลุงสมชาย! ผมคือหมอกุ้ง AI ประจำฟาร์ม มีข้อสงสัยเรื่องบ่อกุ้ง โรคกุ้ง หรือราคากลาง ถามผมได้เลยครับ',
      timestamp: '08:00',
    },
    {
      id: '2',
      sender: 'bot',
      text: '⚠️ แจ้งเตือนเช้านี้: บ่อ B2 พบค่าแอมโมเนียเริ่มสูง แนะนำให้เปิดใบพัดตีน้ำเพิ่ม และลดอาหารลง 30% ครับ',
      timestamp: '08:01',
    },
  ]);

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    playAudioBeep(600, 'sine', 0.1);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate smart Thai automated reply
    setTimeout(() => {
      playAudioBeep(720, 'triangle', 0.2);
      let replyText = 'เข้าใจแล้วครับ แนะนำให้ติดตามค่าออกซิเจนอย่างใกล้ชิดและเปิดเครื่องตีน้ำเต็มพิกัดครับ';

      const query = textToSend.toLowerCase();
      if (query.includes('ราคา') || query.includes('ขาย')) {
        replyText = 'ราคากุ้งขาวแวนนาไมวันนี้ ไซส์ 40 ตัว/กก. อยู่ที่ 190 บาท (ขึ้น 5 บาท) ไซส์ 50 ตัว/กก. อยู่ที่ 165 บาทครับ กำลังเป็นราคาที่ดีในการจับขายครับ';
      } else if (query.includes('ขี้ขาว') || query.includes('ehp')) {
        replyText = 'โรคขี้ขาว (EHP) แก้ไขด่วนโดย: 1. ลดอาหาร 30-50% ทันที 2. คลุกอาหารด้วยกระเทียมสกัด 3. ดูดเลนก้นบ่อ และเติมจุลินทรีย์บาซิลลัสครับ';
      } else if (query.includes('น้ำ') || query.includes('ph') || query.includes('แอมโมเนีย')) {
        replyText = 'ค่าน้ำที่ดี: pH ควรอยู่ที่ 7.8-8.2 ออกซิเจน (DO) มากกว่า 5.0 mg/L หากน้ำเริ่มขุ่นหรือมีฟอง ให้เติมปูนโดโลไมท์ปรับสภาพน้ำครับ';
      } else if (query.includes('หมอ') || query.includes('โทร')) {
        replyText = 'เบอร์หมอกุ้งประจำเขต: น.สพ. ดร.ธีระชัย โทร 081-234-5678 สามารถโทรปรึกษาได้ 24 ชั่วโมงครับ';
      } else if (query.includes('อาหาร') || query.includes('ยอ')) {
        replyText = 'การเช็คยอ: หลังให้อาหาร 2 ชั่วโมง ให้ยกยอดู หากอาหารหมดเกลี้ยงมื้อถัดไปเพิ่มได้ 5% หากเหลือเกิน 20% ให้ลดอาหารมื้อถัดไปครับ';
      } else if (query.includes('b2')) {
        replyText = 'บ่อ B2 ตอนนี้อยู่ในสถานะน้ำอันตราย แนะนำเปิดใบพัดตีน้ำทันที และหยุดให้อาหาร 1 มื้อเพื่อสังเกตอาการกุ้งครับ';
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button on bottom-right */}
      {!isOpen && (
        <button
          onClick={() => {
            playAudioBeep(640, 'sine', 0.15);
            setIsOpen(true);
          }}
          className="fixed bottom-28 sm:bottom-24 right-4 z-40 h-14 px-4 bg-[#FF7A1A] hover:bg-[#E65800] text-white rounded-full shadow-2xl shadow-[#FF7A1A]/40 flex items-center gap-2.5 font-bold text-sm border-2 border-white transition-all hover:scale-105 active:scale-95 animate-bounce"
          title="ปรึกษาหมอกุ้ง AI"
        >
          <ShrimpSticker size="xs" />
          <span>แชทถามเรื่องกุ้ง</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-3 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[480px] bg-[#FFFEFB] border-2 border-[#F2C9A0] rounded-[28px] shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Chat Header */}
          <div className="bg-[#FFF4EA] border-b border-[#F2C9A0] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShrimpSticker size="sm" withBadge />
              <div>
                <h4 className="text-sm font-bold text-[#1A2B33] flex items-center gap-1.5">
                  หมอกุ้ง AI • ตอบอัตโนมัติ
                </h4>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  ● ออนไลน์ พร้อมช่วยเหลือเรื่องฟาร์ม
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 rounded-xl bg-white border border-[#F2C9A0] hover:bg-[#FFE9D6] text-[#1A2B33] flex items-center justify-center font-bold shadow-xs active:scale-95 transition-all"
              aria-label="ปิดแชท"
            >
              <X className="w-6 h-6 text-[#1A2B33]" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FFFDF9]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#FFF4EA] border border-[#F2C9A0] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🦐
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#FF7A1A] text-white rounded-tr-xs font-medium'
                      : 'bg-white border border-[#F2C9A0] text-[#1A2B33] rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 ${
                      m.sender === 'user' ? 'text-white/70' : 'text-[#1A2B33]/40'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-[#FFF4EA] border-t border-[#F2C9A0]/50 flex gap-1.5 overflow-x-auto">
            {['วิธีแก้ขี้ขาว', 'ราคากุ้งวันนี้', 'บ่อ B2 ทำยังไง'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="text-[11px] font-bold text-[#FF7A1A] bg-white px-2.5 py-1 rounded-full border border-[#F2C9A0] hover:bg-[#FFE9D6] whitespace-nowrap shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#F2C9A0] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม เช่น บ่อ B2 น้ำไม่ดี..."
              className="flex-1 h-11 px-3 text-xs sm:text-sm bg-[#FFFDF9] border border-[#F2C9A0] rounded-xl focus:outline-none focus:border-[#FF7A1A]"
            />
            <button
              type="submit"
              className="w-11 h-11 rounded-xl bg-[#FF7A1A] hover:bg-[#E65800] text-white flex items-center justify-center shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
