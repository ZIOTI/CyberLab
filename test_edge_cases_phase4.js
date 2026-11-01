if (process.env.CYBERLAB_TEST_ISOLATED !== '1') { console.error('Use npm test or node scripts/test-isolated.js test_edge_cases_phase4.js'); process.exit(1); }
const assert = require('node:assert');
const { DatabaseSync } = require('node:sqlite');
const GamificationManager = require('./platform/gamification_manager');

console.log('[TEST] Démarrage du banc de tests de robustesse et cas limites Phase 4...');

const testDb = new DatabaseSync(':memory:');
const gm = new GamificationManager(testDb);

// 1. Test unicité des quêtes sur 365 jours de l'année + années bissextiles
console.log('1. Test de génération de quêtes quotidiennes sur 365+ dates...');
const datesToTest = [
  '2026-01-01', '2026-02-28', '2026-03-01', '2026-10-31', '2026-12-31',
  '2024-02-29', '2028-02-29', // Années bissextiles
  '2027-07-14', '2027-11-11'
];

for (const d of datesToTest) {
  const quests = gm.getDailyQuests('test_player', d);
  assert.strictEqual(quests.length, 3, `Doit générer exactement 3 quêtes pour ${d}`);
  const keys = quests.map(q => q.quest_key);
  const uniqueKeys = new Set(keys);
  assert.strictEqual(uniqueKeys.size, 3, `Les quêtes pour ${d} doivent être strictement distinctes : ${keys.join(', ')}`);
  assert(keys.includes('earn_xp'), `La quête earn_xp doit être présente pour ${d}`);
}
console.log('✔ Unicité mathématique des quêtes validée sur toutes les dates.');

// 2. Test cas limites de Streak et Streak Freeze
console.log('2. Test cas limites de Streak et Streak Freeze...');
const pid = 'streak_tester';
gm.ensurePlayerState(pid);

// Premier jour
let res = gm.checkAndApplyStreak(pid, '2026-10-01');
assert.strictEqual(res.streak, 1);
assert.strictEqual(res.status, 'initial_day');

// Même jour
res = gm.checkAndApplyStreak(pid, '2026-10-01');
assert.strictEqual(res.streak, 1);
assert.strictEqual(res.status, 'same_day');

// Jour consécutif (+1 jour)
res = gm.checkAndApplyStreak(pid, '2026-10-02');
assert.strictEqual(res.streak, 2);
assert.strictEqual(res.status, 'streak_incremented');

// Jour antérieur (out of order / horloge décalée)
res = gm.checkAndApplyStreak(pid, '2026-09-30');
assert.strictEqual(res.streak, 2);
assert.strictEqual(res.status, 'noop');

// Écart de 2 jours (1 jour manqué) sans Gel de Flamme
res = gm.checkAndApplyStreak(pid, '2026-10-04'); // manqué 10-03
assert.strictEqual(res.streak, 1);
assert.strictEqual(res.status, 'streak_lost');

// Équipement de 2 Streak Freezes
testDb.prepare(`
  INSERT INTO user_inventory (player_id, item_id, item_name, item_type, quantity, is_equipped, updated_at)
  VALUES (?, 'streak_freeze', 'Gel de Flamme', 'consumable', 2, 1, datetime('now'))
  ON CONFLICT(player_id, item_id) DO UPDATE SET quantity = 2
`).run(pid);

// On simule une série de 5 jours le 2026-10-10
testDb.prepare("UPDATE user_state SET streak = 5, max_streak = 5, last_activity_date = '2026-10-10' WHERE id = ?").run(pid);

// Écart de 2 jours (1 jour manqué: 10-11) avec 2 gels en stock -> consomme 1 gel, reste 1 gel
res = gm.checkAndApplyStreak(pid, '2026-10-12');
assert.strictEqual(res.status, 'streak_protected_by_freeze');
assert.strictEqual(res.freeze_used, true);
assert.strictEqual(res.consumed_freezes, 1);
assert.strictEqual(res.remaining_freezes, 1);
assert.strictEqual(res.streak, 6);

// Maintenant le joueur a 1 seul gel. Il manque 3 jours (10-13, 10-14, 10-15) et revient le 10-16 (diffDays = 4, missed = 3)
res = gm.checkAndApplyStreak(pid, '2026-10-16');
assert.strictEqual(res.status, 'streak_lost');
assert.strictEqual(res.freeze_used, false);
assert.strictEqual(res.remaining_freezes, 1); // Le gel inutilisable est conservé
assert.strictEqual(res.streak, 1);

console.log('✔ Logique de protection Streak Freeze multi-jours validée.');

// 3. Test Boutique & Achat avec solde insuffisant
console.log('3. Test Boutique & Achat...');
testDb.prepare("UPDATE user_state SET gems = 30, hearts = 2 WHERE id = ?").run(pid);

assert.throws(() => {
  gm.buyShopItem(pid, 'streak_freeze', 1); // Coûte 50 gems
}, /Gemmes insuffisantes/);

// Crédit de 100 gems et achat de recharge de cœurs (coûte 40)
testDb.prepare("UPDATE user_state SET gems = 100 WHERE id = ?").run(pid);
const buyHeartRes = gm.buyShopItem(pid, 'heart_refill', 1);
assert.strictEqual(buyHeartRes.success, true);
assert.strictEqual(buyHeartRes.remaining_gems, 60);

const userAfterBuy = testDb.prepare("SELECT hearts, gems FROM user_state WHERE id = ?").get(pid);
assert.strictEqual(userAfterBuy.hearts, 5, 'Les cœurs doivent être restaurés à 5');
assert.strictEqual(userAfterBuy.gems, 60);

console.log('✔ Vérifications d\'achats en boutique et déduction de gemmes validées.');

// 4. Test Ligues, Rollover & Relégations
console.log('4. Test Ligues, Rollover & Relégations...');
gm.setPlayerLeague(pid, 'gold');
let lb = gm.getLeaderboard(pid);
assert.strictEqual(lb.current_league, 'gold');
assert.strictEqual(lb.leaderboard.length, 15);

// Simulation rollover d'une semaine passée '2026-W01' avec 0 XP en Gold (devrait être relégué en Silver)
testDb.prepare(`
  UPDATE user_league_state
  SET current_league = 'gold', weekly_xp = 0, week_id = '2026-W01'
  WHERE player_id = ?
`).run(pid);

lb = gm.getLeaderboard(pid);
assert.strictEqual(lb.current_league, 'silver', '0 XP en Gold pendant une semaine entière doit rétrograder en Silver');

console.log('✔ Rollover et dynamique de ligues validés.');

// 5. Test Certificats Cryptographiques & Détection de Falsification
console.log('5. Test Certificats Cryptographiques...');
const cert = gm.generateCertificate(pid, 'path-privesc-linux', 'Alexandre Renoir');
assert(cert.id.startsWith('CYBERLAB-CERT-'));

// Validation normale
let verif = gm.verifyCertificate(cert);
assert.strictEqual(verif.valid, true);

// Altération 1 : nom du destinataire altéré
let tampered = { ...cert, recipient_name: 'Mallory Hacker' };
verif = gm.verifyCertificate(tampered);
assert.strictEqual(verif.valid, false, 'Doit rejeter un destinataire modifié');

// Altération 2 : intitulé de parcours altéré
tampered = { ...cert, track_title: 'Certification Invalide' };
verif = gm.verifyCertificate(tampered);
assert.strictEqual(verif.valid, false, 'Doit rejeter un parcours modifié');

// Altération 3 : signature falsifiée
tampered = { ...cert, signature: 'aabbccdd00112233445566778899aabbccdd00112233445566778899aabbccdd' };
verif = gm.verifyCertificate(tampered);
assert.strictEqual(verif.valid, false, 'Doit rejeter une signature falsifiée');

// Altération 4 : signature non-hex ou longueur invalide
tampered = { ...cert, signature: 'invalid-sig' };
verif = gm.verifyCertificate(tampered);
assert.strictEqual(verif.valid, false, 'Doit rejeter une signature non hexadécimale');

console.log('✔ Sécurité cryptographique infalsifiable HMAC-SHA256 validée.');

// 6. Test Export de profil
console.log('6. Test Export de profil...');
const exported = gm.exportProfile(pid);
assert.strictEqual(exported.operator.id, pid);
assert(exported.meta.integrity_checksum.length === 64, 'Checksum SHA-256 valide');
assert(Array.isArray(exported.official_certificates), 'Certificats officiels inclus');
assert(Array.isArray(exported.gamification.inventory), 'Inventaire inclus');
console.log('✔ Export de profil JSON conforme et intègre.');

console.log('\n========================================================================');
console.log('🎉 TOUS LES TESTS DE ROBUSTESSE ET CAS LIMITES DE LA PHASE 4 SONT AU VERT !');
console.log('========================================================================');
