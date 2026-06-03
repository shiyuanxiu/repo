@echo off
setlocal EnableExtensions
cd /d "%~dp0workers"
title Deploy Miniverse OAuth Worker (production login)

echo.
echo  Miniverse OAuth token exchange (production)
echo  Route: miniverse.gg/auth/exchange-token
echo.

where wrangler >nul 2>&1
if errorlevel 1 (
  echo Install: npm install -g wrangler
  echo Login:   wrangler login
  pause
  exit /b 1
)

echo [1] Set production Client Secret (OAuth App Ov23liEp1iutKOH6gnjd):
echo     wrangler secret put GITHUB_CLIENT_SECRET -c wrangler.oauth.toml
echo.
set /p DO_SECRET=Run secret put now? [y/N]:
if /i "%DO_SECRET%"=="y" (
  wrangler secret put GITHUB_CLIENT_SECRET -c wrangler.oauth.toml
)

echo.
echo [2] Deploying...
wrangler deploy -c wrangler.oauth.toml
if errorlevel 1 (
  echo Deploy failed — run wrangler login and check Cloudflare route.
  pause
  exit /b 1
)

echo.
echo Done. In Cloudflare dashboard add route:
echo   miniverse.gg/auth/exchange-token  -^>  miniverse-oauth
echo.
echo GitHub OAuth App callback:
echo   https://miniverse.gg/github-callback.html
echo.
pause
endlocal
