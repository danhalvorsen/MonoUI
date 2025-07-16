# Detailed debug build script
Write-Host "=== Starting Debug Build ===" -ForegroundColor Cyan

# Set working directory to the repository root
$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

# Function to run a command with error handling
function Invoke-BuildStep {
    param(
        [string]$Name,
        [scriptblock]$ScriptBlock
    )
    
    Write-Host "`n=== $Name ===" -ForegroundColor Green
    Write-Host "Running: $($ScriptBlock.ToString())" -ForegroundColor DarkGray
    
    try {
        $output = & $ScriptBlock 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-Host $output -ForegroundColor White
        return $true
    } catch {
        Write-Host "ERROR in $Name`: $_" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        return $false
    }
}

# Clean up
$cleanSuccess = Invoke-BuildStep -Name "Clean" -ScriptBlock {
    npm run clean
}

if (-not $cleanSuccess) {
    Write-Host "Clean step failed, but continuing..." -ForegroundColor Yellow
}

# Install root dependencies
$installSuccess = Invoke-BuildStep -Name "Install Root Dependencies" -ScriptBlock {
    npm install
}

if (-not $installSuccess) {
    throw "Failed to install root dependencies"
}

# Build packages
$packages = Get-ChildItem -Path "$rootDir/packages" -Directory
foreach ($pkg in $packages) {
    $pkgName = $pkg.Name
    $pkgPath = $pkg.FullName
    
    Write-Host "`n=== Building Package: $pkgName ===" -ForegroundColor Cyan
    
    if (-not (Test-Path "$pkgPath/package.json")) {
        Write-Host "  No package.json found, skipping" -ForegroundColor Yellow
        continue
    }
    
    # Install package dependencies
    $installPkgSuccess = Invoke-BuildStep -Name "Install $pkgName Dependencies" -ScriptBlock {
        Set-Location $using:pkgPath
        npm install
    }
    
    if (-not $installPkgSuccess) {
        Write-Host "  Failed to install dependencies for $pkgName, skipping build" -ForegroundColor Red
        continue
    }
    
    # Build package if build script exists
    $pkgJson = Get-Content -Raw -Path "$pkgPath/package.json" | ConvertFrom-Json
    if ($pkgJson.scripts.build) {
        $buildSuccess = Invoke-BuildStep -Name "Build $pkgName" -ScriptBlock {
            Set-Location $using:pkgPath
            npm run build
        }
        
        if (-not $buildSuccess) {
            Write-Host "  Build failed for $pkgName, but continuing with other packages..." -ForegroundColor Red
        }
    } else {
        Write-Host "  No build script found in $pkgName, skipping build" -ForegroundColor Yellow
    }
}

# Build apps
$apps = Get-ChildItem -Path "$rootDir/apps" -Directory
foreach ($app in $apps) {
    $appName = $app.Name
    $appPath = $app.FullName
    
    Write-Host "`n=== Building App: $appName ===" -ForegroundColor Cyan
    
    if (-not (Test-Path "$appPath/package.json")) {
        Write-Host "  No package.json found, skipping" -ForegroundColor Yellow
        continue
    }
    
    # Install app dependencies
    $installAppSuccess = Invoke-BuildStep -Name "Install $appName Dependencies" -ScriptBlock {
        Set-Location $using:appPath
        npm install
    }
    
    if (-not $installAppSuccess) {
        Write-Host "  Failed to install dependencies for $appName, skipping build" -ForegroundColor Red
        continue
    }
    
    # Build app if build script exists
    $appJson = Get-Content -Raw -Path "$appPath/package.json" | ConvertFrom-Json
    if ($appJson.scripts.build) {
        $buildSuccess = Invoke-BuildStep -Name "Build $appName" -ScriptBlock {
            Set-Location $using:appPath
            npm run build
        }
        
        if (-not $buildSuccess) {
            Write-Host "  Build failed for $appName, but continuing with other apps..." -ForegroundColor Red
        }
    } else {
        Write-Host "  No build script found in $appName, skipping build" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Build Process Completed ===" -ForegroundColor Green
