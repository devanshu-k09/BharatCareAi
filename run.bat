@echo off
echo =========================================
echo       Starting BharatCare AI...
echo =========================================
echo.

:: Check if dependencies are installed
IF NOT EXIST "backend\node_modules\" (
    echo [ERROR] Backend dependencies are missing!
    echo Please run setup.bat first.
    pause
    exit /b
)

echo [1/2] Starting Node.js Backend Server...
cd backend
start cmd /k "title BharatCare API && "C:\Program Files\nodejs\node.exe" server.js"
cd ..

echo.
echo Waiting for server to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Opening Frontend in browser...
start "" "frontend\login.html"

echo.
echo =========================================
echo   BharatCare AI is now running!
echo   API: http://localhost:5000
echo   Close the backend window to stop.
echo =========================================
pause
