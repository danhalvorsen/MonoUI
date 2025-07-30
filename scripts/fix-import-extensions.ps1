# File: fix-import-extensions.ps1
$root = "packages"

# Regex for import/export statements without .js extension
$pattern = '(?<=\b(from\s+["'']))(\.\/[^"'']+?)(?<!\.js)(?=["''])'

# Only process files inside ./packages/*/src
Get-ChildItem -Path "$root" -Recurse -Include *.ts |
    Where-Object { $_.FullName -match '\\packages\\[^\\]+\\src\\' } | 
    ForEach-Object {
        $file = $_.FullName
        $content = Get-Content $file -Raw
        $newContent = $content -replace $pattern, '$1.js'

        if ($content -ne $newContent) {
            # Backup before modifying
            Copy-Item -Path $file -Destination "$file.bak" -Force
            Set-Content -Path $file -Value $newContent -Encoding UTF8
            Write-Host "Fixed imports in $file"
        }
    }
