# Force detailed error output
$ErrorActionPreference = 'Stop'
$VerbosePreference = 'Continue'

# Log file for detailed output
$logFile = Join-Path $PSScriptRoot 'build-debug.log'

# Function to write to both console and log file
function Write-DebugLog {
    param([string]$Message, [string]$Level = 'INFO')
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Write to console with color coding
    switch ($Level) {
        'ERROR' { Write-Host $logMessage -ForegroundColor Red }
        'WARN'  { Write-Host $logMessage -ForegroundColor Yellow }
        'INFO'  { Write-Host $logMessage -ForegroundColor Cyan }
        default { Write-Host $logMessage }
    }
    
    # Write to log file
    Add-Content -Path $logFile -Value $logMessage -Force
}

try {
    # Clear previous log
    if (Test-Path $logFile) { Remove-Item $logFile -Force }
    
    Write-DebugLog "=== Starting Build Process ==="
    
    # Get root directory
    $rootDir = Split-Path -Parent $PSScriptRoot
    Write-DebugLog "Root directory: $rootDir"
    
    # Check for package.json
    $packageJsonPath = Join-Path $rootDir 'package.json'
    if (-not (Test-Path $packageJsonPath)) {
        throw "package.json not found at $packageJsonPath"
    }
    
    # Install root dependencies
    Write-DebugLog "Installing root dependencies..."
    & npm install *>&1 | ForEach-Object { 
        Write-DebugLog "[NPM] $_" 
    }
    
    # Find all package.json files in packages and apps
    $packageDirs = @()
    
    $packagesDir = Join-Path $rootDir 'packages'
    if (Test-Path $packagesDir) {
        $packageDirs += Get-ChildItem -Path $packagesDir -Directory | 
            Where-Object { Test-Path (Join-Path $_.FullName 'package.json') } | 
            Select-Object -ExpandProperty FullName
    }
    
    $appsDir = Join-Path $rootDir 'apps'
    if (Test-Path $appsDir) {
        $packageDirs += Get-ChildItem -Path $appsDir -Directory | 
            Where-Object { Test-Path (Join-Path $_.FullName 'package.json') } | 
            Select-Object -ExpandProperty FullName
    }
    
    Write-DebugLog "Found $($packageDirs.Count) packages/apps to process"
    
    # Process each package
    foreach ($dir in $packageDirs) {
        $pkgName = Split-Path $dir -Leaf
        Write-DebugLog "`nProcessing $pkgName at $dir"
        
        try {
            Push-Location $dir
            
            # Read package.json
            $pkgJson = Get-Content -Raw -Path 'package.json' | ConvertFrom-Json
            Write-DebugLog "  Package: $($pkgJson.name)@$($pkgJson.version)"
            
            # Install dependencies
            Write-DebugLog "  Installing dependencies..."
            & npm install *>&1 | ForEach-Object { 
                Write-DebugLog "  [NPM] $_" 
            }
            
            # Build if build script exists
            if ($pkgJson.scripts.build) {
                Write-DebugLog "  Running build..."
                & npm run build *>&1 | ForEach-Object { 
                    Write-DebugLog "  [BUILD] $_" 
                }
            } else {
                Write-DebugLog "  No build script found, skipping build" -Level 'WARN'
            }
            
            Write-DebugLog "  $pkgName processed successfully" -Level 'INFO'
        } catch {
            Write-DebugLog "  Error processing $pkgName : $_" -Level 'ERROR'
            Write-DebugLog $_.ScriptStackTrace -Level 'ERROR'
            throw
        } finally {
            Pop-Location
        }
    }
    
    Write-DebugLog "`n=== Build completed successfully! ===" -Level 'INFO'
    Write-Host "`nBuild completed successfully! See $logFile for details." -ForegroundColor Green
    exit 0
    
} catch {
    Write-DebugLog "`n=== BUILD FAILED ===" -Level 'ERROR'
    Write-DebugLog "Error: $_" -Level 'ERROR'
    Write-DebugLog $_.ScriptStackTrace -Level 'ERROR'
    
    Write-Host "`nBUILD FAILED! See $logFile for details." -ForegroundColor Red
    exit 1
}
