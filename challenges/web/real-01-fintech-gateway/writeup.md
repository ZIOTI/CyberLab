# Solution Détaillée // PayShield FinTech Real Attack Lab

## 1. Découverte de l'application multi-pages
Le site comporte 5 pages :
- `/targets/training/real-01-fintech/` (Accueil)
- `/targets/training/real-01-fintech/login` (Connexion)
- `/targets/training/real-01-fintech/dashboard` (Solde)
- `/targets/training/real-01-fintech/transfers` (Formulaire de virement)
- `/targets/training/real-01-fintech/audit-logs` (Audit)

## 2. Exploitation de la logique métier
L'API `POST /targets/training/real-01-fintech/api/transfer` ne vérifie pas `amount > 0`. L'envoi d'un montant négatif soustrait de la cible et crédite l'attaquant, déclenchant le flag :
`CTF{REAL_FINTECH_BALANCE_MANIPULATION_PWN}`.

## 3. Remédiation & Protection
- Validation stricte serveur : `if (amount <= 0 || !Number.isInteger(amount)) throw new Error('Montant invalide');`
- Mise en place d'un système de double validation (4-eyes principle) pour les montants élevés.