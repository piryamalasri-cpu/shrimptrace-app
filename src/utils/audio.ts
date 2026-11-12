/**
 * Audio & Speech Synthesis Helper for ShrimpTrace
 */

export const playAudioBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.2) => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context may require user interaction or be restricted
  }
};

export const speakThaiText = (text: string, onEnd?: () => void) => {
  // Beep sound prompt
  playAudioBeep(520, 'triangle', 0.15);

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      // Find Thai voice if available
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((v) => v.lang.startsWith('th') || v.lang.includes('Thai'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // Fallback
    }
  }

  // Fallback: simple tone
  setTimeout(() => {
    playAudioBeep(660, 'sine', 0.25);
    if (onEnd) onEnd();
  }, 1200);
};
