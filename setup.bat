@echo off
echo =========================================
echo       BharatCare AI - Setup Script
echo =========================================
echo.

echo [1/2] Checking for Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install it from https://nodejs.org/
    pause
    exit /b
)
echo Node.js is installed.

echo.
echo [2/2] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo =========================================
echo Setup Completed Successfully!
echo =========================================
echo.
echo [IMPORTANT] Before running, open backend/.env and ensure you have:
echo 1. Your GEMINI_API_KEY
echo 2. A running MongoDB instance (or update MONGO_URI)
echo.
pause
