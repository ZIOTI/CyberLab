const fs = require('fs');
const path = require('path');

// 1. Generate recon_relay_alpha.jpg for osint-01
const osintPath = path.join(__dirname, '..', '..', 'challenges', 'osint', 'osint-01-exif-trace', 'files', 'recon_relay_alpha.jpg');
const header = Buffer.from([0xFF, 0xD8, 0xFF, 0xE1]);
const exifText = 'Exif\0\0II*\0\x08\0\0\0' +
  'Camera Model Name: DJI-Mavic3-Enterprise\n' +
  'Date/Time Original: 2026:10:24 14:22:08\n' +
  'GPS Latitude: 48 deg 51 24.12 N\n' +
  'GPS Longitude: 2 deg 21 7.02 E\n' +
  'UserComment: MISSION_STATUS=SUCCESS; OPERATOR_BEACON=CYBERLAB{EXIF_GPS_AERIAL_RECON_GEOLOCATED}\n';

const exifBuf = Buffer.from(exifText, 'utf8');
const len = exifBuf.length + 2;
const lenBuf = Buffer.from([Math.floor(len / 256), len % 256]);
const eof = Buffer.from([0xFF, 0xD9]);
fs.writeFileSync(osintPath, Buffer.concat([header, lenBuf, exifBuf, eof]));
console.log('✔ recon_relay_alpha.jpg generated');

// 2. Generate diplomatic_intercept.txt for crypto-01
// Cleartext: "ORDRE_DIPLOMATIQUE_PRIORITE_UN_FLAG_EST_CYBERLAB{ROT13_VIGENERE_AEGIS_TRANSMISSION_CRACKED}"
// Step 1: Vigenere with key "AEGIS"
function vigenereEncrypt(plain, key) {
  let res = '';
  let ki = 0;
  for (let i = 0; i < plain.length; i++) {
    const c = plain[i];
    if (c >= 'A' && c <= 'Z') {
      const pCode = c.charCodeAt(0) - 65;
      const kCode = key[ki % key.length].charCodeAt(0) - 65;
      res += String.fromCharCode(((pCode + kCode) % 26) + 65);
      ki++;
    } else {
      res += c;
    }
  }
  return res;
}

// Step 2: ROT13
function rot13(str) {
  return str.replace(/[a-zA-Z]/g, function(c) {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

const cryptoMsg = 'ORDRE_DIPLOMATIQUE_TRANSMISSION_FLAG_EST_CYBERLAB{ROT13_VIGENERE_AEGIS_TRANSMISSION_CRACKED}';
const vig = vigenereEncrypt(cryptoMsg, 'AEGIS');
const encryptedCrypto = rot13(vig);

const cryptoPath = path.join(__dirname, '..', '..', 'challenges', 'crypto', 'crypto-01-rot-vault', 'files', 'diplomatic_intercept.txt');
fs.writeFileSync(cryptoPath, `--- EN-TÊTE D'INTERCEPTION TÉLÉGRAPHIQUE MILITAIRE #AEGIS-TEL-99 ---\nCANAL: DIPLOMATIC_CRYPTO_RELAY\nALGORITHME: ROT13_THEN_VIGENERE\nCLE_INDICE: Le nom du consortium de défense\n\nMESSAGE INTERCEPTÉ :\n${encryptedCrypto}\n`);
console.log('✔ diplomatic_intercept.txt generated');

// 3. Generate corrupted_evidence.bin for forensics-01
// A real valid PNG image whose first 8 magic bytes are corrupted to 0x00
const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
// Minimal valid 1x1 PNG data
const rawPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const corruptedPng = Buffer.from(rawPng);
// Corrupt first 8 bytes with 0x00
for (let i = 0; i < 8; i++) {
  corruptedPng[i] = 0x00;
}
// Append secret comment chunk
const secretPayload = Buffer.from('\nFLAG=CYBERLAB{MAGIC_BYTES_PNG_HEADER_RESTORED_SUCCESSFULLY}\nNOTE=Preuve restaurée avec succès.\n');
const forensicsPath = path.join(__dirname, '..', '..', 'challenges', 'forensics', 'forensics-01-magic-bytes', 'files', 'corrupted_evidence.bin');
fs.writeFileSync(forensicsPath, Buffer.concat([corruptedPng, secretPayload]));
console.log('✔ corrupted_evidence.bin generated');

// 4. Generate urgent_transfer_request.eml for phish-01
const emlPath = path.join(__dirname, '..', '..', 'challenges', 'social-eng', 'phish-01-ceo-fraud', 'files', 'urgent_transfer_request.eml');
const emlContent = `From: "Marc Renoir (Président)" <m.renoir@aegis-defense.com>
To: "Sophie Laurent (Directrice Financière)" <s.laurent@aegis-defense.local>
Subject: URGENT & CONFIDENTIEL : Virement d'Acquisition Stratégique #992
Date: Thu, 24 Oct 2026 09:14:22 +0200
Message-ID: <a8f219c2-901b-419a@relay-out.phish-nexus.net>
Received: from mail-relay-unauth.external-isp.net (198.51.100.77)
    by mail.aegis-defense.local with SMTP id 9241a;
    Thu, 24 Oct 2026 09:14:23 +0200
Authentication-Results: mail.aegis-defense.local;
    spf=fail (sender IP 198.51.100.77 not authorized for aegis-defense.com);
    dkim=none (message not signed)
X-Originating-IP: [198.51.100.77]
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Bonjour Sophie,

Je suis actuellement en vol pour Tokyo dans le cadre de la clôture d'une opération d'acquisition prioritaire et hautement confidentielle.
Il est impératif que le virement de provision de 450 000 EUR soit validé sur notre compte de compensation avant 11h00 ce matin pour ne pas bloquer les signatures notariales.

Veuillez confirmer l'ordre d'approbation immédiatement via le lien d'autorisation sécurisé :
https://secure-auth.aegis-defense.com.phish-gateway.net/verify?token=Q1lCRVJMQUJ7UEhJU0hJTkdfRU1BSUxfSEVBREVSX0FOQUxZU0lTX0ZSQVVEX1BSRVZFTlRFRH0=

(Pour des raisons de secret des affaires, ne contactez personne par téléphone à ce sujet).

Bien cordialement,
Col. Marc Renoir
Président & Directeur Général
Aegis Defense Systems
`;
fs.writeFileSync(emlPath, emlContent);
console.log('✔ urgent_transfer_request.eml generated');
