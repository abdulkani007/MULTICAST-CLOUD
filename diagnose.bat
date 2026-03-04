@echo off
echo ========================================
echo IPCCTV System Diagnostics
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo ✅ Node.js installed
echo.

echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    pause
    exit /b 1
)
npm --version
echo ✅ npm installed
echo.

echo [3/5] Checking FFmpeg...
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found!
    echo Please install from https://ffmpeg.org/download.html
    echo Add to system PATH and restart terminal
    echo.
    pause
    exit /b 1
)
ffmpeg -version | findstr "ffmpeg version"
echo ✅ FFmpeg installed
echo.

echo [4/5] Testing FFmpeg functionality...
cd backend
node test-ffmpeg.js
if %errorlevel% neq 0 (
    echo ❌ FFmpeg test failed!
    pause
    exit /b 1
)
cd ..
echo.

echo [5/5] Checking dependencies...
if not exist "backend\node_modules" (
    echo ⚠️ Backend dependencies not installed
    echo Run: cd backend ^&^& npm install
) else (
    echo ✅ Backend dependencies installed
)

if not exist "frontend\node_modules" (
    echo ⚠️ Frontend dependencies not installed
    echo Run: cd frontend ^&^& npm install
) else (
    echo ✅ Frontend dependencies installed
)
echo.

echo ========================================
echo Diagnostics Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Terminal 1: cd backend ^&^& node server.js
echo 2. Terminal 2: cd frontend ^&^& npm start
echo 3. Open http://localhost:3000
echo 4. Click "Start Stream"
echo.
pause
