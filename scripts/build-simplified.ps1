Write-Host "Building all packages..."

# Build packages
$packagesDir = Join-Path $PSScriptRoot "..\packages"
if (Test-Path $packagesDir) {
    Get-ChildItem $packagesDir | ForEach-Object {
        if (Test-Path (Join-Path $_.FullName "package.json")) {
            Write-Host "`nBuilding $($_.Name)..."
            Push-Location $_.FullName
            try {
                npm install
                # Skip building mr-style since it's a token-based design system
                if ($_.Name -ne "mr-style") {
                    npm run build
                } else {
                    Write-Host "Skipping build for mr-style (token-based design system)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "Error building $($_.Name): $_" -ForegroundColor Red
            }
            Pop-Location
        }
    }
}

# Build apps
$appsDir = Join-Path $PSScriptRoot "..\apps"
if (Test-Path $appsDir) {
    Get-ChildItem $appsDir | ForEach-Object {
        if (Test-Path (Join-Path $_.FullName "package.json")) {
            Write-Host "`nBuilding $($_.Name)..."
            Push-Location $_.FullName
            try {
                npm install
                npm run build
            } catch {
                Write-Host "Error building $($_.Name): $_" -ForegroundColor Red
            }
            Pop-Location
        }
    }
}

Write-Host "`nAll builds completed." -ForegroundColor Green
