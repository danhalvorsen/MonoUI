param (
    [string]$RootPath = "."
)

Write-Host "Removing all 'dist' folders under $RootPath..." -ForegroundColor Cyan

Get-ChildItem -Path $RootPath -Recurse -Force -Directory -Filter "dist" -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction Stop
        Write-Host "Deleted: $($_.FullName)" -ForegroundColor DarkGray
    } catch {
        Write-Warning "Could not delete: $($_.FullName)"
    }
}

Write-Host "All 'dist' folders removed." -ForegroundColor Green
