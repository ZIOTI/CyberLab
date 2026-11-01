# Solution Détaillée // LSASS Memory Dump vs Sysmon

## 1. Télémétrie Sysmon
L'accès à LSASS génère un événement `Event ID 10` avec `TargetImage = C:\Windows\System32\lsass.exe`.

## 2. Détection
La règle Sigma corrèle le droit d'accès `0x1FFFFF` ou `0x1010` et alerte le SOC :
`CTF{PURPLE_LSASS_DUMP_DETECTION_CONFIRMED}`.

## 3. Durcissement & Protection
- Activer Credential Guard et LSA Protection :
```powershell
Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa' -Name 'RunAsPPL' -Value 1 -Type DWord
```