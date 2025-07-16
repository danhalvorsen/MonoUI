# Build script for mr-style-cli
Write-Host "Building mr-style-cli..." -ForegroundColor Cyan

# Create dist directory if it doesn't exist
if (-not (Test-Path -Path "dist")) {
    New-Item -ItemType Directory -Path "dist"
}

# Build TypeScript files
npm run build

# Copy bin file
Copy-Item -Path "src/cli.js" -Destination "dist/cli.js" -Force

# Ensure the output file has execute permissions
if ($PSVersionTable.PSVersion.Major -ge 6) {
    Set-ItemProperty -Path "dist/cli.js" -Name IsReadOnly -Value $false
} else {
    (Get-Item "dist/cli.js").IsReadOnly = $false
}

Write-Host "Build completed successfully" -ForegroundColor Green
