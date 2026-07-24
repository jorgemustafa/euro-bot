$ErrorActionPreference = "Stop"

$targets = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq "chrome.exe" -and
    ($_.CommandLine -like "*euro-bot*" -or $_.CommandLine -like "*wwebjs*")
  }

if (-not $targets) {
  Write-Host "Nenhum Chrome do WhatsApp bot encontrado."
  exit 0
}

$targets | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Write-Host "Chrome do WhatsApp bot encerrado."
