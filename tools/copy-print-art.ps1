# Copy Dropbox / SoR art into docs/manuscript/print-art/ (Windows).
# Defaults match Michael's tree from B72 / art README notes.
#
#   powershell -ExecutionPolicy Bypass -File tools/copy-print-art.ps1
#   powershell -File tools/copy-print-art.ps1 -ArtRoot "D:\art" -ExtractCore -CorePdf "C:\...\Core Sourcebook.pdf"

param(
  [string]$ArtRoot = $(if ($env:GHOSTWIRE_ART_ROOT) { $env:GHOSTWIRE_ART_ROOT } else { "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art" }),
  [string]$CorePdf = $(if ($env:GHOSTWIRE_CORE_PDF) { $env:GHOSTWIRE_CORE_PDF } else { "" }),
  [switch]$ExtractCore
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$nodeArgs = @("tools/copy-print-art.mjs", "--art-root", $ArtRoot)
if ($ExtractCore) {
  if (-not $CorePdf) {
    Write-Error " -ExtractCore requires -CorePdf or GHOSTWIRE_CORE_PDF"
  }
  $nodeArgs += @("--extract-core", "--core-pdf", $CorePdf)
}

Write-Host "Repo: $RepoRoot"
Write-Host "Art : $ArtRoot"
node @nodeArgs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Next:"
Write-Host "  node tools/assemble-manuscript.mjs"
Write-Host "  node tools/inject-print-art.mjs"
Write-Host "  node tools/build-pdf.mjs"
Write-Host "Then open docs\manuscript\build\Ghostwire-Rulebook-DRAFT.pdf"
Write-Host "and docs\manuscript\build\ART-GAP-REPORT.md"
