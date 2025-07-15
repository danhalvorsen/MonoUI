<#
    Build-All.ps1 – readable version
    ─────────────────────────────────
    ▸ Recursively finds every package.json that contains a "build" script
    ▸ Builds core/shared libs first (anything under /packages/)
    ▸ Generates build-report.md   (always)
    ▸ With -OpenBrowser, also writes build-report.html and opens it in your default browser
    ▸ Writes per‑project build logs (default folder ./build-logs or -LogDir)

    COMPATIBILITY
    • Works on Windows PowerShell 5.1 and PowerShell 7+

    USAGE EXAMPLES
      ./Build-All.ps1                                   # build current tree
      ./Build-All.ps1 C:\src -Verbose                  # stream raw npm output
      ./Build-All.ps1 -Exclude dist -OpenBrowser        # skip dist, open HTML report
      ./Build-All.ps1 -LogDir out/logs                  # custom log folder
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)] [string]  $Root    = (Get-Location).Path,
    [string[]]              $Exclude = @('node_modules'),
    [string]                $Report  = 'build-report.md',
    [string]                $LogDir  = 'build-logs',   # per‑project logs folder
    [switch]                $OpenBrowser,
    [switch]                $Quiet
)

# ─── console helpers ───────────────────────────────────────────
function Write-Info   ([string]$Msg){ if (-not $Quiet) { Write-Host $Msg -ForegroundColor Cyan  } }
function Write-Success([string]$Msg){ if (-not $Quiet) { Write-Host $Msg -ForegroundColor Green } }
function Write-Error2 ([string]$Msg){ Write-Host $Msg -ForegroundColor Red }

# ─── absolute log root ─────────────────────────────────────────
$ScriptHome = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$LogRoot    = if ([IO.Path]::IsPathRooted($LogDir)) { $LogDir } else { Join-Path $ScriptHome $LogDir }
if (-not (Test-Path $LogRoot)) { New-Item -ItemType Directory -Path $LogRoot -Force | Out-Null }

# ─── 1 · Discover projects ─────────────────────────────────────
function Get-Projects {
    param([string]$Path,[string[]]$SkipPatterns)

    $skipMasks = $SkipPatterns | ForEach-Object { "*\$($_)\*" }

    Get-ChildItem -Path $Path -Filter package.json -Recurse -File |
    Where-Object {
        $dir = $_.DirectoryName + '\\'
        -not ($skipMasks | Where-Object { $dir -like $_ })
    } | ForEach-Object {
        try {
            $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
            if ($json.scripts.PSObject.Properties.Name -contains 'build') {
                $deps = @()
                if ($json.PSObject.Properties['dependencies'])     { $deps += $json.dependencies.PSObject.Properties.Name }
                if ($json.PSObject.Properties['devDependencies'])  { $deps += $json.devDependencies.PSObject.Properties.Name }

                [pscustomobject]@{
                    Path  = $_.DirectoryName
                    Name  = $json.name
                    Deps  = $deps
                    InPkg = ($_.DirectoryName -match '[\\/]packages[\\/]')
                }
            }
        } catch {
            Write-Error2 "⚠️  Invalid JSON: $($_.FullName)"
        }
    }
}

# ─── 2 · Topological sort + packages first ─────────────────────
function Sort-ByDependency {
    param([object[]]$Projects)

    $map=@{}; $Projects | ForEach-Object { $map[$_.Name] = $_ }
    $graph=@{}; $inDeg=@{}
    foreach($p in $Projects){ $graph[$p.Name]=@(); $inDeg[$p.Name]=0 }
    foreach($p in $Projects){ foreach($d in $p.Deps){ if($map.ContainsKey($d)){ $graph[$d]+=$p.Name; $inDeg[$p.Name]++ } } }

    # Kahn’s algorithm
    $queue=[System.Collections.Generic.Queue[string]]::new()
    foreach($n in $inDeg.Keys){ if($inDeg[$n] -eq 0){ $queue.Enqueue($n) } }
    $order=@()
    while($queue.Count){
        $n=$queue.Dequeue(); $order+=$map[$n]
        foreach($m in $graph[$n]){ if(--$inDeg[$m] -eq 0){ $queue.Enqueue($m) } }
    }
    if($order.Count -ne $Projects.Count){ Write-Error2 "⚠️  Cyclic dependency detected"; $inDeg.Keys|Where-Object{$inDeg[$_] -gt 0}|ForEach-Object{ $order+=$map[$_] } }

    # packages/ first, stable order
    $order | Sort-Object -Property @{ Expression = { $_.InPkg }; Descending = $true }
}

# ─── 3 · Build project ─────────────────────────────────────────
function Invoke-ProjectBuild {
    param([pscustomobject]$Project)

    Write-Info "`n🔨  Building $($Project.Path)"
    Push-Location $Project.Path

    $logFile = Join-Path $LogRoot "$($Project.Name)-build.log"
    $output  = & npm run build 2>&1 | Tee-Object -FilePath $logFile
    $exit    = $LASTEXITCODE
    Pop-Location

    # extract first 5 error lines
    $snippet = $output | Where-Object { $_ -match 'error TS\d+|^error' } | Select-Object -First 5

    [pscustomobject]@{
        Name    = $Project.Name
        Path    = $Project.Path
        Exit    = $exit
        LogFile = $logFile
        Snippet = $snippet
    }
}

# ─── 4 · Write Markdown & HTML report ──────────────────────────
function Write-Report {
    param([object[]]$BuildOrder,[hashtable]$Graph,[bool]$OpenHtml)

    $timestamp = (Get-Date).ToString('u')
    $lines = @("# Build Report","_Generated $timestamp_","","## Build order")
    $i=1; foreach($p in $BuildOrder){ $lines += "$i. **$($p.Name)**"; $i++ }

    $lines += "","## Internal dependency graph",""
    foreach($p in $BuildOrder){
        $deps = $Graph[$p.Name]
        $depText = ($deps) ? ($deps -join ', ') : '—'
        $lines += "- **$($p.Name)** ← $depText"
    }

    $md = $lines -join "`n"
    Set-Content -Path $Report -Value $md -Encoding UTF8
    Write-Success "📄  Markdown report saved: $Report"

    if(-not $OpenHtml){ return }

    # HTML wrapper using marked.js and GitHub CSS
    $mdJson = ($md | ConvertTo-Json -Compress)
    $html = @"
<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <title>Build Report</title>
  <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/github-markdown-css@5.2.0/github-markdown-light.min.css'>
  <style>body{margin:2rem}</style>
</head>
<body>
  <article id='content' class='markdown-body'></article>
  <script src='https://cdn.jsdelivr.net/npm/marked/marked.min.js'></script>
  <script>document.getElementById('content').innerHTML = marked.parse($mdJson);</script>
</body>
</html>
"@
    $htmlPath = [IO.Path]::ChangeExtension($Report,'html')
    Set-Content -Path $htmlPath -Value $html -Encoding UTF8
    Write-Success "🌐  HTML report written: $htmlPath"
    Start-Process $htmlPath
}

# ─── Main orchestration ────────────────────────────────────────
$projects = Get-Projects -Path $Root -SkipPatterns $Exclude
if(-not $projects){ Write-Info "No buildable projects found."; exit 0 }

$buildOrder = Sort-ByDependency $projects
$graph = @{}; foreach($p in $projects){ $graph[$p.Name] = @($p.Deps | Where-Object { $projects.Name -contains $_ }) }
Write-Report -BuildOrder $buildOrder -Graph $graph -OpenHtml:$OpenBrowser

$results = foreach($proj in $buildOrder){ Invoke-ProjectBuild $proj }
$succeeded = $results | Where-Object Exit -eq 0
$failed    = $results | Where-Object Exit -ne 0

Write-Host "`n──────────── SUMMARY ────────────"
Write-Success "✅  $($succeeded.Count) succeeded"
if($failed){
    Write-Error2 "❌  $($failed.Count) failed:"
    foreach($f in $failed){
        Write-Error2 "   • $($f.Path) (exit $($f.Exit))"
        $f.Snippet | ForEach-Object { Write-Error2 "      $_" }
        Write-Error2 "      log: $($f.LogFile)"
    }
    exit 1
} else {
    Write-Success "All builds completed successfully."
}
