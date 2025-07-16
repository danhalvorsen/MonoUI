[CmdletBinding()]
param(
    [switch]$Apps,
    [switch]$Verbose
)

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = 'INFO',
        [string]$ForegroundColor = 'White'
    )
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$Level] $Message"
    
    if ($Verbose -or $Level -in @('ERROR', 'WARN')) {
        Write-Host $logMessage -ForegroundColor $ForegroundColor
    }
    
    # Optionally write to a log file
    # $logMessage | Out-File -FilePath "build.log" -Append -Encoding utf8
}

function Build-Workspaces {
    [CmdletBinding()]
    param(
        [switch]$Apps
    )
    
    Write-Log "Starting build process..." -ForegroundColor Cyan
    
    # Initialize build count
    $env:BUILD_COUNT = 0
    
    # Check if we're in the correct directory
    if (-not (Test-Path "package.json")) {
        throw "Must be run from the root of the repository"
    }

    # Clean up first
    Write-Log "Running cleanup..." -ForegroundColor Green
    try {
        npm run clean
        Write-Log "Cleanup completed successfully" -ForegroundColor Green
    } catch {
        Write-Log "Warning: Cleanup failed: $_" -Level 'WARN' -ForegroundColor Yellow
    }

    # Install dependencies for all workspaces
    Write-Log "Installing dependencies for all workspaces..." -ForegroundColor Green
    try {
        npm install
        Write-Log "Dependencies installed successfully" -ForegroundColor Green
    } catch {
        Write-Log "Error installing dependencies: $_" -Level 'ERROR' -ForegroundColor Red
        throw $_
    }

    # Validate package references
    Write-Log "Validating package references..." -ForegroundColor Green
    try {
        npm run validate-references
        Write-Log "Package references validated successfully" -ForegroundColor Green
    } catch {
        Write-Log "Error validating package references: $_" -Level 'ERROR' -ForegroundColor Red
        throw $_
    }

    # Build workspaces
    Write-Log "Building workspaces..." -ForegroundColor Green
    $startTime = Get-Date
    
    try {
        if ($Apps) {
            Write-Log "Building apps only..." -ForegroundColor Yellow
            $items = Get-ChildItem -Path apps -Directory -ErrorAction Stop
        } else {
            Write-Log "Building all packages and apps..." -ForegroundColor Yellow
            $items = Get-ChildItem -Path packages,apps -Directory -ErrorAction Stop
        }
        
        foreach ($item in $items) {
            $env:BUILD_COUNT = [int]$env:BUILD_COUNT + 1
            Write-Log "Building $($item.Name)..." -ForegroundColor Cyan
            
            $itemStartTime = Get-Date
            try {
                Push-Location $item.FullName -ErrorAction Stop
                
                if (Test-Path "package.json") {
                    $pkgJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
                    if ($pkgJson.scripts.build) {
                        npm run build
                        $buildTime = (Get-Date) - $itemStartTime
                        Write-Log "Successfully built $($item.Name) in $($buildTime.TotalSeconds.ToString('0.00'))s" -ForegroundColor Green
                    } else {
                        Write-Log "No build script found in $($item.Name), skipping" -ForegroundColor Yellow
                    }
                } else {
                    Write-Log "No package.json found in $($item.Name), skipping" -ForegroundColor Yellow
                }
            } catch {
                Write-Log "Error building $($item.Name): $_" -Level 'ERROR' -ForegroundColor Red
                throw "Build failed for $($item.Name)"
            } finally {
                Pop-Location -ErrorAction SilentlyContinue
            }
        }

        $totalTime = (Get-Date) - $startTime
        Write-Log "`nBuild completed successfully!" -ForegroundColor Green
        Write-Log "Build Summary:" -ForegroundColor Cyan
        Write-Log "- Built $env:BUILD_COUNT packages/apps" -ForegroundColor Green
        Write-Log "- Total build time: $($totalTime.TotalMinutes.ToString('0.00')) minutes" -ForegroundColor Green
        
        return 0
    } catch {
        $totalTime = (Get-Date) - $startTime
        Write-Log "`nBuild failed!" -Level 'ERROR' -ForegroundColor Red
        Write-Log "Build Summary:" -ForegroundColor Cyan
        Write-Log "- Built $env:BUILD_COUNT packages/apps before failure" -ForegroundColor Yellow
        Write-Log "- Total build time: $($totalTime.TotalMinutes.ToString('0.00')) minutes" -ForegroundColor Yellow
        Write-Log "- Error: $_" -Level 'ERROR' -ForegroundColor Red
        
        return 1
    }
}

# Main script execution
try {
    $exitCode = Build-Workspaces @PSBoundParameters
    exit $exitCode
} catch {
    Write-Host "FATAL ERROR: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
}
