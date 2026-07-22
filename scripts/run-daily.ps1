param(
  [string]$RepoRoot = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-Location $RepoRoot

$logDir = Join-Path $RepoRoot "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("daily-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")
Start-Transcript -Path $logFile | Out-Null

try {

function Read-DotEnv {
  $envFile = Join-Path $RepoRoot ".env"
  if (!(Test-Path $envFile)) { return @{} }

  $values = @{}
  foreach ($line in Get-Content $envFile) {
    if ($line -notmatch "^\s*([^#=\s]+)\s*=\s*(.*)\s*$") { continue }
    $values[$Matches[1]] = $Matches[2].Trim('"').Trim("'")
  }
  return $values
}

function Invoke-Logged {
  param([string]$Name, [scriptblock]$Command)

  Write-Host "==> $Name"
  & $Command
}

function Invoke-Npm {
  param([string]$Script)

  npm run $Script
  if ($LASTEXITCODE -ne 0) {
    throw "npm run $Script failed with exit code $LASTEXITCODE"
  }
}

function Test-Appium {
  param([string]$HostName, [string]$Port)

  try {
    Invoke-WebRequest "http://${HostName}:${Port}/status" -UseBasicParsing -TimeoutSec 3 | Out-Null
    return $true
  } catch {
    return $false
  }
}

$config = Read-DotEnv
$appiumHost = if ($config.ContainsKey("APPIUM_HOST") -and $config["APPIUM_HOST"]) { $config["APPIUM_HOST"] } else { "127.0.0.1" }
$appiumPort = if ($config.ContainsKey("APPIUM_PORT") -and $config["APPIUM_PORT"]) { $config["APPIUM_PORT"] } else { "4723" }
$androidUdid = if ($config.ContainsKey("ANDROID_UDID") -and $config["ANDROID_UDID"]) { $config["ANDROID_UDID"] } else { "" }

if (!(Test-Appium $appiumHost $appiumPort)) {
  Invoke-Logged "start appium" {
    Start-Process -FilePath "npx.cmd" -ArgumentList "appium" -WorkingDirectory $RepoRoot -WindowStyle Hidden | Out-Null
    Start-Sleep -Seconds 5
  }
}

if (!(Test-Appium $appiumHost $appiumPort)) {
  throw "Appium not available at http://${appiumHost}:${appiumPort}/status"
}

if ($androidUdid -match "^\d+\.\d+\.\d+\.\d+:\d+$") {
  Invoke-Logged "adb connect $androidUdid" {
    adb connect $androidUdid | Write-Host
  }
}

Invoke-Logged "adb devices" {
  $devices = adb devices
  $devices | Write-Host

  if ($androidUdid -and (($devices -join "`n") -notmatch [regex]::Escape($androidUdid) + "\s+device")) {
    throw "Android device not connected: $androidUdid"
  }
}

Invoke-Logged "book" { Invoke-Npm "book" }
Invoke-Logged "bookings sync" { Invoke-Npm "bookings:sync" }
Invoke-Logged "reminders check" { Invoke-Npm "reminders:check" }
} finally {
  Stop-Transcript | Out-Null
  Write-Host "Log: $logFile"
}
