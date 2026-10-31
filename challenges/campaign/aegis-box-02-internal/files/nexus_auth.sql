-- ============================================================================
-- AEGIS DEFENSE SYSTEMS // CORE NEXUS IAM DATABASE EXPORT
-- CLASSIFICATION : CONFIDENTIEL DÉFENSE // EXCLUSIF SÉCURITÉ
-- ============================================================================

CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL,
  password_hash VARCHAR(128) NOT NULL,
  api_signing_key VARCHAR(128)
);

INSERT INTO accounts VALUES
  (1, 'elena.vance', 'e.vance@aegis-defense.net', 'CISO', '$6$rounds=5000$AegisSalt2026$k8L9qXm3...', 'SIG_KEY_VANCE_SEC_DIRECTOR'),
  (2, 'marcus.cole', 'm.cole@aegis-defense.net', 'Lead Sysadmin', '$6$rounds=5000$AegisSalt2026$P2w9Za7m...', 'SIG_KEY_COLE_INFRA_ADMIN'),
  (3, 'viktor.k', 'v.kavinsky@chimera-apt.onion', 'Compromised Consultant', '$6$rounds=5000$Chimera2026$V!kt0r_Ch1m3ra_P4ss#2026', 'SIG_KEY_CHIMERA_IMPLANT');

-- ============================================================================
-- COFFRE CENTRAL // RÉFÉRENCE DE DÉRIVATION DU SHADOW VAULT
-- NOTE RSSI : Clé de dérivation d'enveloppe cryptographique pour l'Acte III :
-- VAULT_CIPHER_KEY_AEGIS_99
-- ============================================================================
