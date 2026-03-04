@echo off
echo ========================================
echo IPCCTV - Quick Start (No FFmpeg)
echo ========================================
echo.

echo [1/2] Installing Canvas dependency...
cd backend
call npm install canvas
if %errorlevel% neq 0 (
    echo.
    echo ❌ Canvas installation failed!
    echo.
    echo Try this:
    echo npm install --global windows-build-tools
    echo npm install canvas
    echo.
    pause
    exit /b 1
)
echo ✅ Canvas installed
cd ..
echo.

echo [2/2] System ready!
echo.
echo ========================================
echo Ready to Run!
echo ========================================
echo.
echo Terminal 1: cd backend ^&^& node server.js
echo Terminal 2: cd frontend ^&^& npm start
echo.
echo Then click "Start Stream" in browser
echo.
echo Note: Using mock stream (no FFmpeg required)
echo.
pause
