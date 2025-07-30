# Install vite and vitest as devDependencies in all packages
Get-ChildItem -Path .\packages -Directory | ForEach-Object {
    $pkg = Join-Path $_.FullName "package.json"
    if (Test-Path $pkg) {
        Write-Host "Installing vite and vitest in $($_.Name)..." -ForegroundColor Cyan
        Push-Location $_.FullName
        npm install --save-dev vite vitest
        Pop-Location
    }
}