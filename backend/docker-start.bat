@echo off
echo ========================================
echo   CR Management Backend - Docker Setup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Checking environment file...
if not exist .env (
    echo Creating .env from .env.docker...
    copy .env.docker .env
    echo.
    echo [WARNING] Please edit .env file and change:
    echo   - DB_PASSWORD
    echo   - JWT_ACCESS_SECRET
    echo   - JWT_REFRESH_SECRET
    echo.
    echo Press any key to open .env file...
    pause >nul
    notepad .env
)

echo.
echo [2/4] Building Docker images...
docker-compose build

echo.
echo [3/4] Starting services...
docker-compose up -d

echo.
echo [4/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo Health Check: http://localhost:3000/health
echo MySQL: localhost:3306
echo.
echo View logs: docker-compose logs -f
echo Stop services: docker-compose down
echo.
echo Press any key to view logs...
pause >nul
docker-compose logs -f
