@echo off
chcp 65001 >nul
title Mi Plan B (en local)
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Falta Node.js. Se abre la pagina de descarga: instala la version LTS y vuelve a abrir este archivo.
  start "" https://nodejs.org/es/download
  pause
  exit /b
)
rem Si quedaba otra version de la app abierta (puerto 3000), la cerramos para no ver la vieja
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
if not exist node_modules (
  echo.
  echo Preparando la app. Solo la primera vez, tarda unos minutos...
  call npm install
)
echo.
echo Abriendo Mi Plan B en http://localhost:3000
echo Para pararla, cierra esta ventana.
start "" cmd /c "timeout /t 10 >nul & start http://localhost:3000"
call npm run dev
pause
