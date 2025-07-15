# Fix-ESLint-Config.ps1
# Script to verify and fix ESLint configuration across the monorepo

function Create-ESLintConfig($directory) {
    $configPath = Join-Path $directory ".eslintrc.json"
    
    if (-not (Test-Path $configPath)) {
        Write-Host "Creating ESLint config in: $directory" -ForegroundColor Yellow
        $config = @"
{
    ""root"": true,
    ""env"": {
        ""browser"": true,
        ""es2021"": true
    },
    ""extends"": [
        ""plugin:@typescript-eslint/recommended"",
        ""plugin:lit/recommended""
    ],
    ""parser"": ""@typescript-eslint/parser"",
    ""parserOptions"": {
        ""ecmaVersion"": 2021,
        ""sourceType"": ""module""
    },
    ""plugins"": [
        ""@typescript-eslint"",
        ""lit""
    ],
    ""rules"": {
        ""lit/no-bad-template-literals"": ""error"",
        ""lit/no-template-shadow"": ""warn"",
        ""lit/no-unused-expressions"": ""error""
    }
}
"@
        Set-Content -Path $configPath -Value $config
    }
}

# Process root
Create-ESLintConfig "$(Get-Location)"

# Process packages
$packages = Get-ChildItem -Path packages -Directory
foreach ($package in $packages) {
    Create-ESLintConfig $package.FullName
}

# Process apps
$apps = Get-ChildItem -Path apps -Directory
foreach ($app in $apps) {
    Create-ESLintConfig $app.FullName
}

Write-Host "All ESLint configurations verified and fixed!" -ForegroundColor Green
