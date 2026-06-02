$ErrorActionPreference = "Stop"
$base = "http://localhost:8765"
$clientId = "Ov23liOu1avolRsyCXgE"
$redirectUri = "$base/github-callback.html"
$fail = 0

function Ok($msg) { Write-Host "[OK] $msg" -ForegroundColor Green }
function Bad($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red; $script:fail++ }

Write-Host "`n=== Miniverse GitHub Auth Verify ===`n"

try {
  $r = Invoke-WebRequest -Uri "$base/index.html" -UseBasicParsing -TimeoutSec 10
  if ($r.StatusCode -eq 200) { Ok "index.html reachable ($($r.StatusCode))" } else { Bad "index.html status $($r.StatusCode)" }
} catch { Bad "index.html: $($_.Exception.Message)" }

foreach ($path in @("auth/github-config.js", "auth/github-auth.js", "auth/secrets.js", "github-callback.html")) {
  try {
    $r = Invoke-WebRequest -Uri "$base/$path" -UseBasicParsing -TimeoutSec 10
    if ($r.StatusCode -eq 200) { Ok "$path reachable" } else { Bad "$path status $($r.StatusCode)" }
  } catch { Bad "${path}: $($_.Exception.Message)" }
}

try {
  $secrets = (Invoke-WebRequest -Uri "$base/auth/secrets.js" -UseBasicParsing).Content
  if ($secrets -match 'clientSecret:\s*"[^"]{8,}"') { Ok "Client Secret present in auth/secrets.js" }
  else { Bad "Client Secret missing or empty in auth/secrets.js" }
} catch { Bad "secrets.js: $($_.Exception.Message)" }

try {
  $cfg = (Invoke-WebRequest -Uri "$base/auth/github-config.js" -UseBasicParsing).Content
  if ($cfg -match [regex]::Escape($clientId)) { Ok "Client ID matches github-config.js" }
  else { Bad "Client ID mismatch in github-config.js" }
} catch { Bad "github-config.js: $($_.Exception.Message)" }

$authUrl = "https://github.com/login/oauth/authorize?client_id=$clientId&redirect_uri=$([uri]::EscapeDataString($redirectUri))&scope=read:user&state=test-verify"
try {
  $auth = Invoke-WebRequest -Uri $authUrl -MaximumRedirection 0 -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
} catch {
  if ($_.Exception.Response.StatusCode.value__ -in 302, 301) {
    $loc = $_.Exception.Response.Headers["Location"]
    if ($loc -match "github\.com") { Ok "GitHub authorize endpoint accepts our client_id + callback" }
    else { Bad "Unexpected authorize redirect: $loc" }
  } else { Bad "Authorize request: $($_.Exception.Message)" }
}

try {
  $secretMatch = (Invoke-WebRequest -Uri "$base/auth/secrets.js" -UseBasicParsing).Content -match 'clientSecret:\s*"([^"]+)"'
  $secret = $Matches[1]
  $body = @{
    client_id = $clientId
    client_secret = $secret
    code = "invalid-test-code-00000000"
    redirect_uri = $redirectUri
  } | ConvertTo-Json
  $token = Invoke-RestMethod -Uri "https://github.com/login/oauth/access_token" -Method Post -Body $body -ContentType "application/json" -Headers @{ Accept = "application/json" }
  if ($token.error) { Ok "Token API reachable (expected error for fake code: $($token.error))" }
  else { Bad "Token API returned success for invalid code (unexpected)" }
} catch { Bad "Token API: $($_.Exception.Message)" }

Write-Host ""
if ($fail -eq 0) {
  Write-Host "Automated checks passed. Complete login in browser:" -ForegroundColor Cyan
  Write-Host "  $base/index.html"
  Write-Host "  (Use your GitHub account; QQ email is not used by this OAuth flow.)"
  exit 0
} else {
  Write-Host "$fail check(s) failed." -ForegroundColor Red
  exit 1
}
