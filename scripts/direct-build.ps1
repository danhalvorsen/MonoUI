# Direct build script with minimal dependencies
Write-Host "=== Starting Direct Build ===" -ForegroundColor Cyan

# Set working directory to the repository root
$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Green
if (Test-Path "package.json") {
    if ((Get-Content -Raw -Path "package.json" | ConvertFrom-Json).scripts.clean) {
        npm run clean
    }
}

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Green
npm install

# Build packages
Write-Host "Building packages..." -ForegroundColor Yellow
$packages = Get-ChildItem -Path "$rootDir/packages" -Directory
foreach ($pkg in $packages) {
    Write-Host "Building $($pkg.Name)..." -ForegroundColor Cyan
    
    if (Test-Path "$($pkg.FullName)/package.json") {
        Set-Location $pkg.FullName
        npm install
        if ((Get-Content -Raw -Path "package.json" | ConvertFrom-Json).scripts.build) {
            npm run build
        }
        Set-Location $rootDir
    }
}

# Build apps
Write-Host "Building apps..." -ForegroundColor Yellow
$apps = Get-ChildItem -Path "$rootDir/apps" -Directory
foreach ($app in $apps) {
    Write-Host "Building $($app.Name)..." -ForegroundColor Cyan
    
    if (Test-Path "$($app.FullName)/package.json") {
        Set-Location $app.FullName
        npm install
        if ((Get-Content -Raw -Path "package.json" | ConvertFrom-Json).scripts.build) {
            npm run build
        }
        Set-Location $rootDir
    }
}

Write-Host "=== Build Completed Successfully ===" -ForegroundColor Green
