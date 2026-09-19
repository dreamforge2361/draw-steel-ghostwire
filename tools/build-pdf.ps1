# One-shot assemble → inject → Chrome/Edge HTML→PDF (Windows).
# Run from anywhere; locates the repo from this script's folder.
#
#   powershell -ExecutionPolicy Bypass -File tools/build-pdf.ps1
#   powershell -File tools/build-pdf.ps1 -Sample

param(
  [switch]$Sample,
  [switch]$HtmlOnly,
  [switch]$SkipAssemble,
  [switch]$SkipInject,
  [switch]$SkipLinkify
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$nodeArgs = @("tools/build-pdf.mjs")
if ($Sample) { $nodeArgs += "--sample" }
if ($HtmlOnly) { $nodeArgs += "--html-only" }
if ($SkipAssemble) { $nodeArgs += "--skip-assemble" }
if ($SkipInject) { $nodeArgs += "--skip-inject" }
if ($SkipLinkify) { $nodeArgs += "--skip-linkify" }

node @nodeArgs
exit $LASTEXITCODE
