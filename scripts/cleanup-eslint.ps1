# Clean-ESLint.ps1
# Script to clean and reinstall ESLint dependencies across the monorepo

# Function to clean and reinstall dependencies in a directory
function Clean-Install-ESLint($directory) {
    Write-Host "Processing directory: $directory" -ForegroundColor Green
    
    # Navigate to directory
    Push-Location $directory
    
    # Clean up
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json"
    }
    
    # Install dependencies
    npm install --save-dev eslint@latest @eslint-community/eslint-utils @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-lit eslint-plugin-lit-a11y
    
    # Return to previous location
    Pop-Location
}

# Process root
Clean-Install-ESLint "$(Get-Location)"

# Process packages
$packages = Get-ChildItem -Path packages -Directory
foreach ($package in $packages) {
    Clean-Install-ESLint $package.FullName
}

# Process apps
$apps = Get-ChildItem -Path apps -Directory
foreach ($app in $apps) {
    Clean-Install-ESLint $app.FullName
}

Write-Host "All ESLint dependencies cleaned and reinstalled!" -ForegroundColor Green
