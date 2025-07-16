@echo off
echo === Starting Build ===

:: Check Node.js and npm
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    exit /b 1
)

npm --version
if %errorlevel% neq 0 (
    echo npm is not installed or not in PATH
    exit /b 1
)

:: Clean
call npm run clean
if %errorlevel% neq 0 (
    echo Clean failed
    exit /b 1
)

:: Install root dependencies
call npm install
if %errorlevel% neq 0 (
    echo Failed to install root dependencies
    exit /b 1
)

echo === Building Packages ===
for /d %%i in (packages\*) do (
    echo Building %%i
    cd "%%i"
    call npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies for %%i
        exit /b 1
    )
    
    if exist package.json (
        for /f "tokens=*" %%j in ('type package.json ^| find "\"build\":"') do (
            call npm run build
            if %errorlevel% neq 0 (
                echo Build failed for %%i
                exit /b 1
            )
        )
    )
    cd ..\..
)

echo === Building Apps ===
for /d %%i in (apps\*) do (
    echo Building %%i
    cd "%%i"
    call npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies for %%i
        exit /b 1
    )
    
    if exist package.json (
        for /f "tokens=*" %%j in ('type package.json ^| find "\"build\":"') do (
            call npm run build
            if %errorlevel% neq 0 (
                echo Build failed for %%i
                exit /b 1
            )
        )
    )
    cd ..\..
)

echo === Build Completed Successfully ===
pause
