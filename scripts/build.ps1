# Simple build script for monorepo
# This script handles building all packages and apps in the correct order

# Set error handling
$ErrorActionPreference = 'Stop'

# Set paths
$rootDir = Split-Path -Parent $PSScriptRoot
$logFile = Join-Path $rootDir 'build.log'

# Clear previous log
if (Test-Path $logFile) { Remove-Item $logFile -Force }

# Logging function
function Write-BuildLog {
    param([string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

try {
    Write-BuildLog "=== Starting Build Process ==="
    Set-Location $rootDir
    
    # Install root dependencies
    Write-BuildLog "Installing root dependencies..."
    npm install
    
    # Build packages first
    Write-BuildLog "Building packages..."
    $packages = Get-ChildItem -Path "$rootDir\packages" -Directory
    
    foreach ($pkg in $packages) {
        $pkgName = $pkg.Name
        Write-BuildLog "Building package: $pkgName"
        
        try {
            Set-Location $pkg.FullName
            
            # Install dependencies
            Write-BuildLog "  Installing dependencies..."
            npm install
            
            # Run build if script exists
            if (Test-Path "package.json") {
                $pkgJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
                if ($pkgJson.scripts.build) {
                    Write-BuildLog "  Running build..."
                    npm run build
                }
            }
            
            Set-Location $rootDir
        } catch {
            Write-BuildLog "  ERROR: Failed to build $pkgName"
            throw
        }
    }
    
    # Build apps
    Write-BuildLog "Building apps..."
    $apps = Get-ChildItem -Path "$rootDir\apps" -Directory
    
    foreach ($app in $apps) {
        $appName = $app.Name
        Write-BuildLog "Building app: $appName"
        
        try {
            Set-Location $app.FullName
            
            # Install dependencies
            Write-BuildLog "  Installing dependencies..."
            npm install
            
            # Run build if script exists
            if (Test-Path "package.json") {
                $appJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
                if ($appJson.scripts.build) {
                    Write-BuildLog "  Running build..."
                    npm run build
                }
            }
            
            Set-Location $rootDir
        } catch {
            Write-BuildLog "  ERROR: Failed to build $appName"
            throw
        }
    }
    
    Write-BuildLog "=== Build completed successfully ==="
    Write-Host "Build completed successfully! See $logFile for details." -ForegroundColor Green
    
} catch {
    Write-BuildLog "=== BUILD FAILED ==="
    Write-BuildLog "ERROR: $_"
    Write-Host "BUILD FAILED! See $logFile for details." -ForegroundColor Red
    exit 1
}
