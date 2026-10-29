# Writeup : Operation Wire Transfer (phish-01-ceo-fraud)

## 1. Contexte & Vulnérabilité (Arnaque au Président / BEC)
L'arnaque au président (Business Email Compromise - BEC) repose sur l'ingénierie sociale et l'usurpation d'identité pour contraindre un collaborateur à effectuer un virement financier urgent en contournant les procédures internes.
Bien que le champ visible `From:` affiche `Marc Renoir <m.renoir@aegis-defense.com>`, les mécanismes d'authentification de messagerie permettent de démasquer la fraude :
* **SPF (Sender Policy Framework)** : vérifie si l'adresse IP émettrice est autorisée dans les enregistrements DNS du domaine expéditeur.
* **DKIM (DomainKeys Identified Mail)** : signature cryptographique du corps et des en-têtes.
* **DMARC** : politique d'alignement et d'action (rejet, quarantaine).

## 2. Exploitation Pas à Pas

### Étape 1 : Inspection des en-têtes RFC822
Dans `urgent_transfer_request.eml` :
```text
Received: from mail-relay-unauth.external-isp.net (198.51.100.77)
    by mail.aegis-defense.local with SMTP id 9241a;
Authentication-Results: mail.aegis-defense.local;
    spf=fail (sender IP 198.51.100.77 not authorized for aegis-defense.com);
    dkim=none (message not signed)
X-Originating-IP: [198.51.100.77]
```
* IP d'origine attaquante : `198.51.100.77`
* Résultat SPF : `fail`
* DKIM : `none`

### Étape 2 : Analyse de l'URL malveillante
L'URL présente dans le message est :
`https://secure-auth.aegis-defense.com.phish-gateway.net/verify?token=Q1lCRVJMQUJ7UEhJU0hJTkdfRU1BSUxfSEVBREVSX0FOQUxZU0lTX0ZSQVVEX1BSRVZFTlRFRH0=`

Décodage du paramètre Base64 `token` :
```bash
echo "Q1lCRVJMQUJ7UEhJU0hJTkdfRU1BSUxfSEVBREVSX0FOQUxZU0lTX0ZSQVVEX1BSRVZFTlRFRH0=" | base64 -d
```
**Résultat :**
`CYBERLAB{PHISHING_EMAIL_HEADER_ANALYSIS_FRAUD_PREVENTED}`

## 3. Remédiation
* Mettre en œuvre une politique **DMARC stricte** (`p=reject`) avec SPF et DKIM obligatoires.
* Configurer une passerelle de messagerie (Secure Email Gateway) qui bloque les courriels dont le SPF échoue pour le domaine de l'entreprise.
* Sensibiliser les équipes financières à la procédure de double validation hors-bande (appel vocal d'authentification sur numéro connu) avant tout virement exceptionnel.
