# Walkthrough : LLM Persona Jailbreak & Markdown Data Exfiltration

## 1. Contexte
L'assistant SynthWave dispose d'accès internes sensibles mais refuse normalement de les divulguer.

## 2. Exploitation
1. Envoie le prompt de persona DAN pour neutraliser les garde-fous.
2. Demande de résumer les secrets sous forme d'image Markdown pointant vers `collector.shadow-ai.net`.

Flag : `CYBERLAB{AI_LLM_MARKDOWN_IMAGE_DATA_EXFILTRATION_884}`

## 3. Remédiation
Déployer un assainisseur DOM et une CSP interdisant le chargement d'images externes.