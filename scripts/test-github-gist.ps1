# Quick GitHub / Gist connectivity test for Miniverse dev server
$ErrorActionPreference = "Continue"
$gistPublic = "52ae8578e3aa6e4ae3ddf41ea805c0e3"
$base = "http://localhost:8765"

Write-Host "`n=== Miniverse GitHub Gist Test ===`n" -ForegroundColor Cyan

Write-Host "[1] Python -> api.github.com"
try {
  $zen = py -3 -c "import urllib.request; r=urllib.request.urlopen('https://api.github.com/zen', timeout=25); print(r.status)"
  Write-Host "  OK status $zen" -ForegroundColor Green
} catch {
  Write-Host "  FAIL: $_" -ForegroundColor Red
  Write-Host "  Fix: update hosts or auth/proxy.env, then restart start-dev-server.bat" -ForegroundColor Yellow
}

Write-Host "`n[2] Dev server running on $base"
try {
  $h = Invoke-WebRequest -Uri "$base/index.html" -UseBasicParsing -TimeoutSec 8
  Write-Host "  OK $($h.StatusCode)" -ForegroundColor Green
} catch {
  Write-Host "  FAIL: start start-dev-server.bat first" -ForegroundColor Red
  exit 1
}

Write-Host "`n[3] Public gist read (no login) via proxy"
try {
  $g = Invoke-RestMethod -Uri "$base/auth/github-api/gists/$gistPublic" -TimeoutSec 30
  $files = $g.files.PSObject.Properties.Name -join ", "
  Write-Host "  OK gist id=$($g.id)" -ForegroundColor Green
  Write-Host "  Files: $files"
} catch {
  Write-Host "  FAIL: $_" -ForegroundColor Red
}

Write-Host "`n[4] Private gist PATCH (needs your token)"
Write-Host "  In browser (logged in), F12 Console run:"
Write-Host '    MiniverseSocial.syncNow().then(() => console.log("done", MiniverseSocial.getCache().user))' -ForegroundColor White
Write-Host "  Then check https://gist.github.com/ for private gist 'Miniverse personal likes & favorites'"
Write-Host "`n[5] Verify private gist id"
Write-Host '    MiniverseSocial.showGistIds()' -ForegroundColor White
Write-Host ""
