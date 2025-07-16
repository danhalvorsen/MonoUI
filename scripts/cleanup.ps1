function Remove-ProjectDependencies {
    [CmdletBinding()]
    param()
    
    Write-Host "Starting cleanup process..." -ForegroundColor Cyan
    
    try {
        # Check if we're in the correct directory
        if (-not (Test-Path "package.json")) {
            throw "Error: Must be run from the root of the repository"
        }

        # Remove all node_modules directories
        Write-Host "Removing node_modules directories..." -ForegroundColor Yellow
        $nodeModules = Get-ChildItem -Recurse -Directory | Where-Object { $_.Name -eq 'node_modules' }
        foreach ($dir in $nodeModules) {
            try {
                Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction Stop
                Write-Host "Successfully removed: $($dir.FullName)" -ForegroundColor Green
            } catch {
                Write-Host "Warning: Failed to remove $($dir.FullName): $_" -ForegroundColor Yellow
            }
        }

        # Remove all package-lock.json files
        Write-Host "Removing package-lock.json files..." -ForegroundColor Yellow
        $lockFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Name -eq 'package-lock.json' }
        foreach ($file in $lockFiles) {
            try {
                Remove-Item -Path $file.FullName -Force -ErrorAction Stop
                Write-Host "Successfully removed: $($file.FullName)" -ForegroundColor Green
            } catch {
                Write-Host "Warning: Failed to remove $($file.FullName): $_" -ForegroundColor Yellow
            }
        }

        Write-Host "Cleanup completed successfully." -ForegroundColor Green
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host "- Removed $($nodeModules.Count) node_modules directories" -ForegroundColor Green
        Write-Host "- Removed $($lockFiles.Count) package-lock.json files" -ForegroundColor Green
        
    } catch {
        Write-Host "Cleanup failed: $_" -ForegroundColor Red
        Write-Host "Summary:" -ForegroundColor Cyan
        Write-Host "- Removed $($nodeModules.Count) node_modules directories" -ForegroundColor Yellow
        Write-Host "- Removed $($lockFiles.Count) package-lock.json files" -ForegroundColor Yellow
        exit 1
    }
}

# Execute cleanup
Remove-ProjectDependencies
