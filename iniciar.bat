@echo off
title Nexo Hogar IA
cd /d "%~dp0"

cls
echo ========================================
echo      NEXO HOGAR IA - PLATAFORMA
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js no esta instalado.
  echo Instalalo desde https://nodejs.org
  pause
  exit /b 1
)

echo [1/2] Instalando dependencias...
cd frontend
call npm install --silent 2>nul

echo [2/2] Iniciando servidor...
echo.
echo ========================================
echo  PLATAFORMA DISPONIBLE EN:
echo ========================================
echo.
echo  Landing:        http://localhost:5173
echo  Admin:          http://localhost:5173/admin
echo  Software:       http://localhost:5173/software
echo.
echo  NOTA: No requiere backend. El panel admin
echo  se abre directamente en MODO DEMO.
echo.
echo  Para cerrar: Ctrl+C  o  cierra la ventana
echo ========================================
echo.

call npm run dev
pause
