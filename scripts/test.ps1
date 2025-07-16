Write-Output "=== Test Script ==="
Write-Output "Current directory: $(Get-Location)"
Write-Output "Files in current directory:"
Get-ChildItem | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize

# Test writing to a file
$testFile = Join-Path $PSScriptRoot 'test_output.txt'
"Test content written at $(Get-Date)" | Out-File -FilePath $testFile -Force
Write-Output "Test file written to: $testFile"

# Simple npm command test
try {
    Write-Output "Testing npm --version..."
    $npmVersion = npm --version
    Write-Output "npm version: $npmVersion"
} catch {
    Write-Output "Error running npm: $_"
}

Write-Output "=== Test Complete ==="
