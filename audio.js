/**
 * CERMAT ARCADE - 8-Bit Web Audio Sound Engine
 * Synthesizes retro sounds using Web Audio API oscillators (Square, Sawtooth, Triangle)
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('cermat_arcade_muted') === 'true';
    this.volume = 0.3;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('cermat_arcade_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Helper to play tone
  playTone(freq, type = 'square', duration = 0.1, delay = 0, gainVal = 0.2) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // UI Click sound
  playClick() {
    if (this.muted) return;
    this.init();
    this.playTone(800, 'square', 0.04, 0, 0.15);
  }

  // Correct Answer / Coin sound (classic 8-bit bling)
  playCorrect() {
    if (this.muted) return;
    this.init();
    // B5 followed quickly by E6
    this.playTone(987.77, 'square', 0.08, 0, 0.25);
    this.playTone(1318.51, 'square', 0.25, 0.08, 0.3);
  }

  // Coin Pickup (Avatar Shop / XP Earned)
  playCoin() {
    if (this.muted) return;
    this.init();
    this.playTone(987.77, 'square', 0.06, 0, 0.2);
    this.playTone(1318.51, 'square', 0.18, 0.06, 0.25);
  }

  // Wrong Answer / Buzzer
  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const startTime = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, startTime);
    osc.frequency.linearRampToValueAtTime(90, startTime + 0.28);

    gain.gain.setValueAtTime(0.3 * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.28);
  }

  // Level Up / Boss Defeated Fanfare
  playLevelUp() {
    if (this.muted) return;
    this.init();
    const notes = [
      { f: 523.25, d: 0.1, delay: 0 },       // C5
      { f: 659.25, d: 0.1, delay: 0.1 },     // E5
      { f: 783.99, d: 0.1, delay: 0.2 },     // G5
      { f: 1046.50, d: 0.35, delay: 0.3 }    // C6
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'square', n.d, n.delay, 0.35);
    });
  }

  // Game Over Sound
  playGameOver() {
    if (this.muted) return;
    this.init();
    const notes = [
      { f: 440, d: 0.15, delay: 0 },
      { f: 392, d: 0.15, delay: 0.15 },
      { f: 349.23, d: 0.15, delay: 0.3 },
      { f: 293.66, d: 0.45, delay: 0.45 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'sawtooth', n.d, n.delay, 0.3);
    });
  }

  // Item purchased in shop
  playPurchase() {
    if (this.muted) return;
    this.init();
    const notes = [
      { f: 440, d: 0.08, delay: 0 },
      { f: 554.37, d: 0.08, delay: 0.08 },
      { f: 659.25, d: 0.08, delay: 0.16 },
      { f: 880, d: 0.25, delay: 0.24 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.delay, 0.3);
    });
  }
}

// Global instance
window.retroAudio = new RetroAudioEngine();
