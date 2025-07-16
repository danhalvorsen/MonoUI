Write-Host "=== PowerShell Test Script ===" -ForegroundColor Cyan
Write-Host "Current directory: $(Get-Location)"
Write-Host "Running as user: $env:USERNAME"
Write-Host "PowerShell version: $($PSVersionTable.PSVersion)"

# Test file system access
try {
    $testFile = "$PSScriptRoot\test-file.txt"
    "Test content" | Out-File -FilePath $testFile -Force
    Write-Host "Successfully wrote to test file: $testFile" -ForegroundColor Green
    Remove-Item -Path $testFile -Force
    Write-Host "Successfully removed test file" -ForegroundColor Green
} catch {
    Write-Host "File system test failed: $_" -ForegroundColor Red
}

# Test npm
Write-Host "`n=== Testing npm ===" -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm test failed: $_" -ForegroundColor Red
}

# Test node
Write-Host "`n=== Testing Node.js ===" -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js test failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Script Completed ===" -ForegroundColor Cyan
