@echo off
setlocal EnableExtensions
cd /d "%~dp0.."
title Miniverse OAuth Exchange (production proxy, no Cloudflare)

echo.
echo  OAuth token exchange for miniverse.gg
echo  Does NOT need Cloudflare — run on VPS / cloud server
echo.
echo  Port 8780 — nginx should proxy:
echo    miniverse.gg/auth/exchange-token  -^>  http://127.0.0.1:8780/auth/exchange-token
echo.

where py >nul 2>&1
if errorlevel 1 (
  echo Python not found. Install Python 3 from python.org
  pause
  exit /b 1
)

py -3 scripts\oauth-exchange-server.py --port 8780
pause
endlocal
