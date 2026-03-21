@echo off
echo ========================================
echo   CR Management System - Installation
echo ========================================
echo.

echo [1/2] Installing Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    exit /b %errorlevel%
)
echo Backend installation successful!
cd ..
echo.

echo [2/2] Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    exit /b %errorlevel%
)
echo Frontend installation successful!
cd ..
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Setup environment variables:
echo      cd backend ^&^& copy .env.example .env
echo      cd frontend ^&^& copy .env.example .env
echo.
echo   2. Run database migrations:
echo      cd backend ^&^& npm run migration:run
echo.
echo   3. Seed default users:
echo      cd backend ^&^& npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts
echo.
echo   4. Start development servers:
echo      Terminal 1: cd backend ^&^& npm run dev
echo      Terminal 2: cd frontend ^&^& npm run dev
echo.
pause
