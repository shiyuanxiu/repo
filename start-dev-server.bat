@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Miniverse Dev Server (8765)

set "PORT=8765"
set "URL=http://localhost:%PORT%/index.html"
set "PYCMD="

where py >nul 2>&1 && set "PYCMD=py -3"
if not defined PYCMD where python >nul 2>&1 && set "PYCMD=python"

if not defined PYCMD (
  echo [ERROR] Python not found. Install from https://www.python.org/downloads/
  pause
  exit /b 1
)

echo.
echo  Miniverse local server
echo  URL:  %URL%
echo  Stop: Ctrl+C in this window
echo.

echo  Clearing port %PORT% ...
:kill_port_loop
set "FOUND="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
  set "FOUND=1"
  echo  Stopping PID %%P
  taskkill /F /PID %%P >nul 2>&1
)
if defined FOUND (
  timeout /t 2 /nobreak >nul
  goto kill_port_loop
)
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
  echo [ERROR] Port %PORT% still held by PID %%P. Close it manually, then retry.
  pause
  exit /b 1
)

start "" "%URL%"
%PYCMD% "%~dp0scripts\dev-server.py"
pause
endlocal
