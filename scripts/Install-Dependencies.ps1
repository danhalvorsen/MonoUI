# Install-Dependencies.ps1
# Script to install dependencies across all packages in the monorepo

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Green
npm install

# Get all package directories
$packages = Get-ChildItem -Path packages -Directory

# Install dependencies for each package
foreach ($package in $packages) {
    $packageName = $package.Name
    Write-Host "Installing dependencies for package: $packageName..." -ForegroundColor Green
    
    # Navigate to package directory and install dependencies
    Push-Location $package.FullName
    npm install
    Pop-Location
}

# Install dependencies for apps
$apps = Get-ChildItem -Path apps -Directory

foreach ($app in $apps) {
    $appName = $app.Name
    Write-Host "Installing dependencies for app: $appName..." -ForegroundColor Green
    
    Push-Location $app.FullName
    npm install
    Pop-Location
}

Write-Host "All dependencies installed successfully!" -ForegroundColor Green
