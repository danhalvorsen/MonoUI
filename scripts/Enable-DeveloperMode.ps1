# Enable Developer Mode in Windows via registry
# Requires running PowerShell as Administrator

Write-Host "Enabling Windows Developer Mode..." -ForegroundColor Cyan

# Registry key for Developer Mode
$regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"

# Ensure the key exists
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}

# Set Developer Mode flags
Set-ItemProperty -Path $regPath -Name "AllowDevelopmentWithoutDevLicense" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "AllowAllTrustedApps" -Value 1 -Type DWord

Write-Host "Developer Mode has been enabled. You may need to restart for changes to take full effect." -ForegroundColor Green
