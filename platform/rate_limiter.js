// ============================================================================
// CYBERRANGE PRO - LIMITEUR DE REQUÊTES EN MÉMOIRE (RATE LIMITER)
// Zéro dépendance externe - Algorithme Sliding Window avec auto-pruning
// ============================================================================

class MemoryRateLimiter {
  constructor(options = {}) {
    this.defaultWindowMs = options.windowMs || 10000; // 10 secondes par défaut
    this.defaultMax = options.max || 30;              // 30 requêtes par fenêtre par défaut
    this.hits = new Map();                            // key -> Array<number> (timestamps ms)

    // Nettoyage régulier pour éviter toute fuite mémoire
    this.cleanupTimer = setInterval(() => this.cleanup(), 30000);
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  /**
   * Vérifie et enregistre une requête pour une clé donnée.
   * @param {string} key Identifiant de la cible (ex: "IP:/api/endpoint")
   * @param {number} [max] Nombre maximum de requêtes autorisées
   * @param {number} [windowMs] Durée de la fenêtre glissante en ms
   * @returns {{ limited: boolean, remaining: number, retryAfter: number }}
   */
  check(key, max = null, windowMs = null) {
    const now = Date.now();
    const effectiveWindow = windowMs || this.defaultWindowMs;
    const effectiveMax = max || this.defaultMax;

    // Protection contre l'épuisement mémoire (DoS sur les clés)
    if (this.hits.size > 5000) {
      this.cleanup();
      if (this.hits.size > 5000) {
        const iter = this.hits.keys();
        for (let i = 0; i < 500; i++) {
          const next = iter.next();
          if (next.done) break;
          this.hits.delete(next.value);
        }
      }
    }

    let timestamps = this.hits.get(key) || [];
    timestamps = timestamps.filter(t => (now - t) < effectiveWindow);

    if (timestamps.length >= effectiveMax) {
      this.hits.set(key, timestamps);
      const oldest = timestamps[0];
      const retryAfter = Math.max(1, Math.ceil((effectiveWindow - (now - oldest)) / 1000));
      return {
        limited: true,
        remaining: 0,
        retryAfter
      };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);

    return {
      limited: false,
      remaining: effectiveMax - timestamps.length,
      retryAfter: 0
    };
  }

  cleanup() {
    const now = Date.now();
    const maxRetention = Math.max(this.defaultWindowMs * 2, 30000);
    for (const [key, timestamps] of this.hits.entries()) {
      const active = timestamps.filter(t => (now - t) < maxRetention);
      if (active.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, active);
      }
    }
  }

  reset(key) {
    if (key) {
      this.hits.delete(key);
    } else {
      this.hits.clear();
    }
  }
}

const defaultLimiter = new MemoryRateLimiter();

module.exports = {
  MemoryRateLimiter,
  defaultLimiter
};
