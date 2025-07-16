@echo off
echo === Starting Simple Build ===
echo Current directory: %CD%
echo Running as: %USERNAME%

:: Check Node.js
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

:: Check npm
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo === Build environment looks good ===
pause
