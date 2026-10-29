# Writeup : Caesar's Legacy (crypto-01-rot-vault)

## 1. Contexte & Principes Cryptographiques
Le chiffrement par décalage de César décale l'alphabet d'une constante fixe (ROT13 décale de 13 positions).
Le chiffrement de Vigenère est une substitution polyalphabétique où chaque lettre du texte en clair est décalée selon la valeur de la lettre correspondante dans une clé répétée :
$$C_i = (P_i + K_{i \pmod{|K|}}) \pmod{26}$$

Pour inverser le chiffrement en couche :
$$\text{Message Clair} = \text{VigenereDecode}(\text{ROT13}(\text{Ciphertext}), \text{"AEGIS"})$$

## 2. Exploitation Pas à Pas

### Étape 1 : Inversion ROT13
Le message chiffré dans `diplomatic_intercept.txt` est passé dans une fonction ROT13.
Les 5 premières lettres deviennent `OXJRK`.

### Étape 2 : Déchiffrement Vigenère
En appliquant la clé `AEGIS` sur `OXJRK` :
* 'O' (14) - 'A' (0) = 'O' (14)
* 'X' (23) - 'E' (4) = 'R' (17)
* 'J' (9) - 'G' (6) = 'D' (3)
* 'R' (17) - 'I' (8) = 'R' (17)
* 'K' (10) - 'S' (18) = -8 = +18 = 'E' (4)
Le mot obtenu est `ORDRE`.

### Étape 3 : Texte intégral & Flag
Le message complet révèle :
`ORDRE_DIPLOMATIQUE_TRANSMISSION_FLAG_EST_CYBERLAB{ROT13_VIGENERE_AEGIS_TRANSMISSION_CRACKED}`

Le flag officiel est :
`CYBERLAB{ROT13_VIGENERE_AEGIS_TRANSMISSION_CRACKED}`
