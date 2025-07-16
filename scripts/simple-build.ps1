Write-Host "Starting simple build script..." -ForegroundColor Cyan

# Function to log messages with timestamp
function Write-Log {
    param([string]$Message, [string]$Color = 'White')
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

try {
    # Set working directory to the script's directory
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    $rootDir = Split-Path -Parent $scriptPath
    Set-Location $rootDir
    
    Write-Log "Working directory: $rootDir" -Color Green
    
    # Check for package.json
    if (-not (Test-Path "package.json")) {
        throw "package.json not found in $rootDir"
    }
    
    # Install root dependencies
    Write-Log "Installing root dependencies..." -Color Cyan
    npm install
    
    # Find all package.json files in packages and apps
    $packageDirs = @(
        (Get-ChildItem -Path "packages" -Directory -Recurse -Depth 1 | Where-Object { Test-Path "$($_.FullName)\package.json" }),
        (Get-ChildItem -Path "apps" -Directory -Recurse -Depth 1 | Where-Object { Test-Path "$($_.FullName)\package.json" })
    ) | Select-Object -ExpandProperty FullName -Unique
    
    Write-Log "Found $($packageDirs.Count) packages/apps to process" -Color Green
    
    # Process each package
    foreach ($dir in $packageDirs) {
        $pkgName = Split-Path $dir -Leaf
        Write-Log "Processing $pkgName..." -Color Cyan
        
        try {
            Push-Location $dir
            
            # Install dependencies
            Write-Log "  Installing dependencies..." -Color Yellow
            npm install
            
            # Build if build script exists
            $pkgJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
            if ($pkgJson.scripts.build) {
                Write-Log "  Building..." -Color Yellow
                npm run build
            } else {
                Write-Log "  No build script found, skipping build" -Color Yellow
            }
            
            Write-Log "  $pkgName processed successfully" -Color Green
        } catch {
            Write-Log "  Error processing $pkgName : $_" -Color Red
            throw
        } finally {
            Pop-Location
        }
    }
    
    Write-Log "Build completed successfully!" -Color Green
    exit 0
} catch {
    Write-Log "Build failed: $_" -Color Red
    Write-Log $_.ScriptStackTrace -Color DarkGray
    exit 1
}
