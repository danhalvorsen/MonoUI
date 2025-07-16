Write-Host "Running ESLint on all packages and apps..." -ForegroundColor Green

# Get all packages and apps
$directories = @()
$directories += Get-ChildItem packages -Directory
$directories += Get-ChildItem apps -Directory

foreach ($dir in $directories) {
    Write-Host "`nLinting $dir.Name..." -ForegroundColor Yellow
    Push-Location $dir.FullName
    try {
        npm run lint
    } catch {
        Write-Host "Error linting $dir.Name: $_" -ForegroundColor Red
    }
    Pop-Location
}

Write-Host "`nLinting completed." -ForegroundColor Green
