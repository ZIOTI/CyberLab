# Writeup : The Obfuscated Key (rev-01-js-packer)

## 1. Contexte & Obfuscation JavaScript
L'obfuscation JavaScript consiste à rendre le code source difficilement compréhensible pour un être humain tout en préservant son exécution par le moteur V8 / SpiderMonkey.
Les techniques courantes incluent :
* Renommage des variables en identifiants hexadécimaux (`_0x4f12`, `_0x1a8c`).
* Encapsulation des chaînes de caractères dans un tableau décalé (`Array.shift()`).
* Calculs d'encodage XOR ou Base64 à la volée.

**Faiblesse fondamentale :** Tout code JavaScript exécuté côté client dans le navigateur est sous le contrôle total de l'utilisateur. L'utilisation des DevTools (F12) permet d'inspecter l'état de la mémoire et d'intercepter les valeurs déchiffrées.

## 2. Exploitation Pas à Pas

### Étape 1 : Formatage du code (Beautify)
Le code obfusqué dans `license_checker.html` contient une fonction `checkLicense()` :
```javascript
function checkLicense() {
  var _0x4f12 = ['\x43\x59\x42\x45\x52\x4c\x41\x42', '\x76\x65\x72\x69\x66\x69\x65\x64'];
  // Reconstitution et calcul XOR
  var flag = "CYBERLAB{JS_OBFUSCATION_DEPACKED_KEY_VERIFIED}";
  if (document.getElementById('key').value === flag) {
    alert("Licence Valide !");
  }
}
```

### Étape 2 : Extraction dynamique via la console
Dans la console DevTools du navigateur, on peut simplement évaluer l'expression ou lire la variable globale calculée :
```javascript
// Exécution directe de l'extracteur :
console.log(window.__MASTER_KEY_DEBUG || atob("Q1lCRVJMQUJ7SlNfT0JGVVNDQVRJT05fREVQQUNLRURfS0VZX1ZFUklGSUVUfQ=="));
```

Le drapeau capturé est :
`CYBERLAB{JS_OBFUSCATION_DEPACKED_KEY_VERIFIED}`

## 3. Remédiation
* Ne **jamais** effectuer de vérification de licence ou de sécurité critique côté client en JavaScript.
* Les contrôles d'authentification et de validation de licence doivent systématiquement être traités côté serveur sur une API sécurisée.
