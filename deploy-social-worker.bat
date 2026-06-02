@echo off
setlocal EnableExtensions
cd /d "%~dp0workers"
title Deploy Miniverse social-community Worker

echo.
echo  Miniverse social-community (Cloudflare Worker)
echo  Requires: Node.js + npm install -g wrangler
echo.

where wrangler >nul 2>&1
if errorlevel 1 (
  echo [1] Install Wrangler:
  echo     npm install -g wrangler
  echo.
  echo [2] Login:
  echo     wrangler login
  echo.
  echo [3] Create KV namespace:
  echo     wrangler kv namespace create SOCIAL_KV
  echo     Copy the "id" into workers\wrangler.toml
  echo.
  echo [4] Deploy:
  echo     wrangler deploy
  echo.
  pause
  exit /b 1
)

echo Running: wrangler deploy
wrangler deploy
if errorlevel 1 (
  echo.
  echo Deploy failed. If HTTP 403:
  echo   - Run: wrangler login
  echo   - Verify email on Cloudflare dashboard
  echo   - Turn off proxy/VPN for dash.cloudflare.com
  echo   - Check wrangler.toml has valid KV namespace id
  pause
  exit /b 1
)

echo.
echo Done. Set in auth\github-config.js:
echo   communityApi: "https://YOUR-WORKER.workers.dev/community"
echo.
pause
endlocal
