# Simple build script for the monorepo
[CmdletBinding()]
param(
    [switch]$Apps,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = 'Stop'

# Logging function
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = 'INFO',
        [string]$ForegroundColor = 'White'
    )
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Always write to console for now
    Write-Host $logMessage -ForegroundColor $ForegroundColor
    
    # Write to log file
    $logMessage | Out-File -FilePath "$PSScriptRoot/../build.log" -Append -Encoding utf8
}

try {
    # Set working directory to the repository root
    $rootDir = Split-Path -Parent $PSScriptRoot
    Set-Location $rootDir
    
    Write-Log "=== Starting Build Process ===" -ForegroundColor Cyan
    
    # Clean up first
    Write-Log "Running cleanup..." -ForegroundColor Green
    try {
        npm run clean
        Write-Log "Cleanup completed successfully" -ForegroundColor Green
    } catch {
        Write-Log "Warning: Cleanup failed: $_" -Level 'WARN' -ForegroundColor Yellow
    }
    
    # Install root dependencies
    Write-Log "Installing root dependencies..." -ForegroundColor Green
    npm install
    
    # Validate package references
    Write-Log "Validating package references..." -ForegroundColor Green
    npm run validate-references
    
    # Determine which directories to build
    $directories = @()
    if ($Apps) {
        Write-Log "Building apps only..." -ForegroundColor Yellow
        $directories += Get-ChildItem -Path "$rootDir/apps" -Directory
    } else {
        Write-Log "Building all packages and apps..." -ForegroundColor Yellow
        $directories += Get-ChildItem -Path "$rootDir/packages" -Directory
        $directories += Get-ChildItem -Path "$rootDir/apps" -Directory
    }
    
    $buildCount = 0
    $startTime = Get-Date
    
    foreach ($dir in $directories) {
        $buildCount++
        Write-Log "Building $($dir.Name)..." -ForegroundColor Cyan
        
        try {
            Push-Location $dir.FullName
            
            # Install dependencies
            Write-Log "  Installing dependencies..." -ForegroundColor Yellow
            npm install
            
            # Build if package.json exists and has a build script
            if (Test-Path "package.json") {
                $pkgJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
                if ($pkgJson.scripts.build) {
                    Write-Log "  Running build..." -ForegroundColor Yellow
                    npm run build
                    Write-Log "  Build completed successfully" -ForegroundColor Green
                } else {
                    Write-Log "  No build script found, skipping" -ForegroundColor Yellow
                }
            } else {
                Write-Log "  No package.json found, skipping" -ForegroundColor Yellow
            }
            
            Pop-Location
        } catch {
            Write-Log "  Error building $($dir.Name): $_" -Level 'ERROR' -ForegroundColor Red
            throw "Build failed for $($dir.Name)"
        }
    }
    
    $totalTime = (Get-Date) - $startTime
    Write-Log "`n=== Build Summary ===" -ForegroundColor Cyan
    Write-Log "- Built $buildCount packages/apps" -ForegroundColor Green
    Write-Log "- Total build time: $($totalTime.TotalMinutes.ToString('0.00')) minutes" -ForegroundColor Green
    Write-Log "=== Build completed successfully ===`n" -ForegroundColor Green
    
    exit 0
} catch {
    Write-Log "`n=== BUILD FAILED ===" -Level 'ERROR' -ForegroundColor Red
    Write-Log "Error: $_" -Level 'ERROR' -ForegroundColor Red
    Write-Log $_.ScriptStackTrace -Level 'ERROR' -ForegroundColor DarkGray
    Write-Log "=== BUILD FAILED ===`n" -Level 'ERROR' -ForegroundColor Red
    
    exit 1
}
