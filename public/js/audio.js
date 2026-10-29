// ============================================================================
// CyberRange PRO - Moteur Audio Web Audio API (Synthétiseur Hybride & Tactile)
// 100% Autonome, Zéro Dépendance MP3 Externe
// ============================================================================

class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('cyber_audio_muted') === 'true';
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

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('cyber_audio_muted', this.muted);
    if (!this.muted) {
      this.playTactileClick();
    }
    return this.muted;
  }

  // Clic tactile mécanique Duolingo (enfoncement de bouton)
  playTactileClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Validation exacte (Arpège ascendant cristallin Duolingo)
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (i * 0.08);
      const duration = 0.25;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Échec / Mauvaise réponse (Buzzer sourd avec déclin de pitch)
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.32);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Décrémentation brutale de vie (Heart Loss)
  playHeartLoss() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(110, now);
    osc2.frequency.setValueAtTime(116.54, now); // Dissonance seconde mineure

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Combo critique (x3, x5)
  playCombo() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22]; // E5, G#5, B5, E6, G#6
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (i * 0.05);
      const duration = 0.2;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Fanfare de Boss Fight gagné
  playBossVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99],       // Do Majeur
      [587.33, 739.99, 880.00],       // Ré Majeur
      [659.25, 830.61, 987.77],       // Mi Majeur
      [1046.50, 1318.51, 1567.98]     // Do Majeur Octave Haute
    ];

    const now = this.ctx.currentTime;
    chords.forEach((chord, step) => {
      const stepTime = now + (step * 0.18);
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, stepTime);

        gain.gain.setValueAtTime(0.18, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + (step === 3 ? 0.8 : 0.25));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(stepTime);
        osc.stop(stepTime + (step === 3 ? 0.8 : 0.25));
      });
    });
  }

  // Flamme de Streak
  playStreak() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// Instance globale singleton
window.cyberAudio = new CyberAudio();
