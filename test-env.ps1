# Test environment script
Write-Host "=== Environment Test ===" -ForegroundColor Cyan

# Basic info
Write-Host "Current directory: $(Get-Location)"
Write-Host "Running as user: $env:USERNAME"
Write-Host "Computer name: $env:COMPUTERNAME"
Write-Host "PowerShell version: $($PSVersionTable.PSVersion)"

# Test file system
$testFile = "$PSScriptRoot\test-file.txt"
try {
    "Test content" | Out-File -FilePath $testFile -Force
    Write-Host "File write test: SUCCESS" -ForegroundColor Green
    Remove-Item -Path $testFile -Force
} catch {
    Write-Host "File write test: FAILED - $_" -ForegroundColor Red
}

# Test Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js test: FAILED - $_" -ForegroundColor Red
}

# Test npm
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm test: FAILED - $_" -ForegroundColor Red
}

# List top-level directories
Write-Host "`nDirectory listing:" -ForegroundColor Cyan
Get-ChildItem -Directory | Select-Object Name, LastWriteTime | Format-Table -AutoSize

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Read-Host "Press Enter to continue..."
