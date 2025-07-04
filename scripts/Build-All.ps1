<#
    Build-All.ps1
    -------------
    Find every package.json that defines a "build" script
    and run `npm run build`, **skipping any directory name
    listed in -Exclude (default = node_modules).**
#>

[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [string]  $Root    = (Get-Location).Path,

    [Parameter()]
    [string[]]$Exclude = @('node_modules'),   # add more: -Exclude dist,sandbox

    [Parameter()]
    [switch]  $Quiet
)

#─── Console helpers ──────────────────────────────────────────────
function Write-Info   ($m) { if (-not $Quiet) { Write-Host $m -Foreground Cyan  } }
function Write-Success($m) { if (-not $Quiet) { Write-Host $m -Foreground Green } }
function Write-Err    ($m) { Write-Host $m -Foreground Red                     }

#─── Discover projects ────────────────────────────────────────────
function Get-NodeProjects([string]$Path, [string[]]$Skip) {
    $skipPatterns = $Skip | Where-Object { $_ } | ForEach-Object { "*\$_\*" }

    Get-ChildItem -Path $Path -Filter package.json -Recurse -File |
    Where-Object {
        # reject if its directory matches any skip pattern
        $dir = $_.DirectoryName + '\'
        -not ($skipPatterns | Where-Object { $dir -like $_ })
    } |
    ForEach-Object {
        try {
            $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
            if ($json.scripts.PSObject.Properties.Name -contains 'build') {
                $_.DirectoryName
            }
        } catch {
            Write-Err "⚠️  Invalid JSON: $($_.FullName)"
        }
    } | Sort-Object -Unique
}

#─── Build one project ────────────────────────────────────────────
function Invoke-ProjectBuild([string]$Path) {
    Write-Info "`n🔨  Building $Path"
    Push-Location $Path
    npm run build 2>&1 | ForEach-Object { Write-Verbose $_ }
    $code = $LASTEXITCODE
    Pop-Location
    [pscustomobject]@{ Path = $Path; Exit = $code }
}

#─── Orchestrate ──────────────────────────────────────────────────
$projects = Get-NodeProjects -Path $Root -Skip $Exclude
if (-not $projects) {
    Write-Info "No buildable projects found under '$Root'."
    exit 0
}

$results = foreach ($p in $projects) { Invoke-ProjectBuild $p }

#─── Summary ──────────────────────────────────────────────────────
$suc = $results | Where-Object Exit -eq 0
$fail = $results | Where-Object Exit -ne 0

Write-Host "`n──────────── SUMMARY ────────────"
Write-Success "✅  $($suc.Count) succeeded"
if ($fail) {
    Write-Err    "❌  $($fail.Count) failed:"
    $fail | ForEach-Object { Write-Err "   • $($_.Path) (exit $($_.Exit))" }
    exit 1
} else {
    Write-Success "All builds completed successfully."
}
