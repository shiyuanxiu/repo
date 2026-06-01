@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title iPhone 17 Preview Server

echo.
echo  ========================================
echo   iPhone 17 Preview - Local Server
echo  ========================================
echo.

set "PORT=5173"
set "URL=http://localhost:%PORT%/iphone17-simulator.html"
set "PYCMD="

REM Refresh user PATH (Explorer double-click may miss it)
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USERPATH=%%B"
if defined USERPATH set "PATH=%USERPATH%;%PATH%"

REM Find Python launcher or python.exe
where py >nul 2>&1 && set "PYCMD=py -3"
if not defined PYCMD where python >nul 2>&1 && set "PYCMD=python"
if not defined PYCMD where python3 >nul 2>&1 && set "PYCMD=python3"

if defined PYCMD goto :start_python

echo  [INFO] Python not found. Using PowerShell server...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview-iphone17.ps1"
if errorlevel 1 goto :fail
goto :done

:start_python
echo  [OK] Found: %PYCMD%
echo  URL:  %URL%
echo  Stop: Press Ctrl+C in this window
echo.

REM Free port if a previous preview server is still running
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
  taskkill /F /PID %%P >nul 2>&1
)

start "" "%URL%"
%PYCMD% -m http.server %PORT%
if errorlevel 1 (
  echo.
  echo  [ERROR] Port %PORT% may be in use. Close other servers and retry.
)
goto :done

:fail
echo.
echo  [ERROR] Could not start server.
echo.
echo  Fix options:
echo    1. Install Python 3 and check "Add to PATH"
echo       https://www.python.org/downloads/
echo    2. Or right-click preview-iphone17.ps1 - Run with PowerShell
echo.

:done
echo.
pause
endlocal
