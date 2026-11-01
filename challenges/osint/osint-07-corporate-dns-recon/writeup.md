# Solution Détaillée // Global Shadow IT Recon

## 1. Requête Certificate Transparency
La consultation de `crt.sh/?q=%.titanium-bank.%` met en évidence le domaine oublié :
`dev-gateway-alpha.staging.titanium-bank.internal`.

## 2. Découverte de bucket S3
La résolution DNS CNAME pointe vers `titanium-leak-991.s3.amazonaws.com`.

## 3. Remédiation
- Supprimer les enregistrements DNS orphelins (protection contre le Subdomain Takeover).
- Bloquer l'accès public au niveau organisationnel via AWS S3 Block Public Access.