param([switch]$ApproveInstall,[switch]$WriteCodexConfig)
$ErrorActionPreference = 'Stop'
if (-not $ApproveInstall) { throw 'Installation needs user approval. Read docs/MCP_SETUP.md; then pass -ApproveInstall.' }
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$version = Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'tools/mcp/version.json') | ConvertFrom-Json
$nodeExe = (Get-Command node -ErrorAction Stop).Source
$npmExe = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (-not $npmExe) { $npmExe = (Get-Command npm -ErrorAction Stop).Source }
Get-Command git -ErrorAction Stop | Out-Null
$major = [int]((& $nodeExe --version).TrimStart('v').Split('.')[0])
if ($major -lt 22) { throw 'Node.js 22+ required; tested with Node 24.' }
$serverDir = Join-Path $repoRoot '.local/tools/construct3-mcp'
$projectDir = Join-Path $repoRoot 'game'
$patchFile = Join-Path $repoRoot 'tools/mcp/collision-poly.patch'
if ((Get-FileHash -Algorithm SHA256 -LiteralPath $patchFile).Hash.ToLowerInvariant() -ne $version.patchSha256) { throw 'MCP patch checksum mismatch.' }
if (-not (Test-Path -LiteralPath (Join-Path $projectDir 'project.c3proj'))) { throw 'Missing game/project.c3proj' }
function Invoke-Checked([string]$Executable, [string[]]$Arguments) {
  & $Executable @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Command failed ($LASTEXITCODE): $Executable $($Arguments -join ' ')" }
}
if (-not (Test-Path -LiteralPath $serverDir)) {
  New-Item -ItemType Directory -Force -Path (Split-Path $serverDir) | Out-Null
  Invoke-Checked 'git' @('clone', $version.repository, $serverDir)
  Invoke-Checked 'git' @('-C', $serverDir, 'checkout', '--detach', $version.commit)
}
if (-not (Test-Path -LiteralPath (Join-Path $serverDir '.git'))) { throw 'Existing install folder is not a Git checkout; preserve and inspect it manually.' }
$head = (& git -C $serverDir rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $head -ne $version.commit) { throw 'Existing MCP has a different commit. No checkout/reset performed.' }
$origin = (& git -C $serverDir remote get-url origin).Trim()
if ($origin -ne $version.repository) { throw 'Unexpected MCP origin; inspect manually.' }
& git -C $serverDir apply --reverse --check $patchFile 2>$null
if ($LASTEXITCODE -ne 0) {
  Invoke-Checked 'git' @('-C', $serverDir, 'apply', '--check', $patchFile)
  Invoke-Checked 'git' @('-C', $serverDir, 'apply', $patchFile)
}
Push-Location $serverDir
try {
  if (-not (Test-Path -LiteralPath 'node_modules')) { Invoke-Checked $npmExe @('ci','--ignore-scripts') }
  Invoke-Checked $npmExe @('run','build')
  Invoke-Checked $npmExe @('test','--','test/tools/collision-poly.test.ts','test/construct3/templates.test.ts','test/construct3/integrity.test.ts')
} finally { Pop-Location }
$record = @{ commit=$version.commit; patchSha256=$version.patchSha256; server=$serverDir; project=$projectDir; node=$nodeExe; installedAt=(Get-Date).ToString('o') }
$record | ConvertTo-Json | Set-Content -Encoding utf8 -LiteralPath (Join-Path $repoRoot '.local/mcp-install.json')
if ($WriteCodexConfig) {
  $configDir = Join-Path $repoRoot '.codex'
  $configFile = Join-Path $configDir 'config.toml'
  # JSON strings are also valid TOML basic strings for these file-system paths.
  $cmd = ConvertTo-Json -Compress $nodeExe.Replace('\','/')
  $script = ConvertTo-Json -Compress (Join-Path $serverDir 'dist/index.js').Replace('\','/')
  $project = ConvertTo-Json -Compress $projectDir.Replace('\','/')
  $content = "[mcp_servers.construct3]`ncommand = $cmd`nargs = [$script, $project]`n"
  if (Test-Path -LiteralPath $configFile) {
    if ((Get-Content -Raw -LiteralPath $configFile).Trim() -ne $content.Trim()) { throw 'Existing .codex/config.toml differs. MCP installed; config preserved. Merge manually after backup.' }
  } else {
    New-Item -ItemType Directory -Force -Path $configDir | Out-Null
    [IO.File]::WriteAllText($configFile, $content, [Text.UTF8Encoding]::new($false))
  }
}
Write-Output 'Pinned/patched MCP built and regression-tested. Global settings unchanged. Restart/reload your client if needed, then verify native tools and run npm run mcp:check.'
