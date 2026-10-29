# Solution & Writeup Officiel // Mirror Mirror

## 1. Vue d'Ensemble du Challenge
- **Identifiant** : `web-07-reflected-xss`
- **Catégorie** : Web
- **Difficulté** : BEGINNER (100 Points)
- **Objectif Principal** : Comprendre et exploiter le vecteur `reflected-xss` pour extraire le drapeau de contrôle.

---

## 2. Analyse Préliminaire & Reconnaissance
Avant toute interaction, une énumération méthodique de la cible est nécessaire. 
Nous identifions les services exposés et les points d'entrée applicatifs ou systèmes :
```bash
# Vérification de l'état de la cible
curl -I http://127.0.0.1:3333/targets/training/web-07-reflected-xss/
```

---

## 3. Vecteur de Vulnérabilité & Exploitation Pas-à-Pas
La vulnérabilité réside dans la gestion imprudente des entrées ou des droits d'exécution.
L'analyse du comportement montre que le système ne valide pas strictement les paramètres :

1. **Identification du composant vulnérable** : Observation de la réponse applicative.
2. **Construction du payload** : Élaboration de la chaîne spécifique adaptée à l'environnement.
3. **Exécution du payload** : Soumission du vecteur et capture du résultat.

```bash
# Commande d'exploitation type
curl -s http://127.0.0.1:3333/targets/training/web-07-reflected-xss/
```

---

## 4. Extraction du Drapeau & Validation
Une fois le contrôle obtenu ou le flux déchiffré, le drapeau apparaît sous sa forme certifiée :
```text
CYBERLAB{REFLECTED_XSS_QUERY_PARAM_INJECT_SUCCESS}
```

---

## 5. Mesures de Remédiation & Durcissement (Blue Team)
- Implémenter le principe de moindre privilège (PoLP).
- Valider et assainir toutes les entrées utilisateurs selon une liste blanche stricte.
- Désactiver les méthodes d'accès non sécurisées et maintenir les dépendances à jour.
