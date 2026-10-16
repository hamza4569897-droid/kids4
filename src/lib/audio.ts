/**
 * Web Audio API synthesizer for child-friendly, delightful sound effects.
 * Requires no external audio assets or network downloads.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy initialize on first interaction
    const saved = localStorage.getItem('little_stars_sound');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('little_stars_sound', String(this.soundEnabled));
    if (this.soundEnabled) {
      this.playChime();
    }
    return this.soundEnabled;
  }

  /** Gentle joyful chime for success / correct answer */
  public playChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Arpeggio notes: E5 -> B5 -> E6
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  /** Alias for playChime */
  public playSuccess() {
    this.playChime();
  }

  /** Friendly bubble pop for clicking buttons, selecting options */
  public playPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Celebratory fanfare for completing an activity */
  public playCheer() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.1);

      gain.gain.setValueAtTime(0.25, startTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.1);
      osc.stop(startTime + index * 0.1 + 0.45);
    });
  }

  /** Alias for playCheer */
  public playFanfare() {
    this.playCheer();
  }

  /** Gentle soft bounce when an incorrect choice is picked (encouraging, never harsh) */
  public playTryAgain() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /** Arabic text-to-speech speaker using browser SpeechSynthesis */
  public speakArabic(text: string) {
    if (!this.soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // slightly slower for young preschoolers
      utterance.pitch = 1.2; // warm, cheerful friendly tone
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis gracefully omitted if browser restricts it
    }
  }

  /** English text-to-speech speaker using browser SpeechSynthesis */
  public speakEnglish(text: string) {
    if (!this.soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for young preschoolers
      utterance.pitch = 1.15; // clear, friendly tone
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis gracefully omitted if browser restricts it
    }
  }
}

export const sounds = new SoundEffectsManager();
