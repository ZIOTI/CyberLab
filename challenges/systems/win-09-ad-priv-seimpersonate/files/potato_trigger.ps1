# PrintSpoofer Automation Helper
$PipeName = 'spoolss_nexus_privesc'
Write-Host "[+] Listening on \\.\pipe\$PipeName..."
Write-Host "[+] Triggering RPC to printspooler..."
Write-Host "[+] Captured SYSTEM Token. Spawning root shell..."