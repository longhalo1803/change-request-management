#!/bin/bash

echo "========================================"
echo "  CR Management Backend - Docker Setup"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "[1/4] Checking environment file..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.docker..."
    cp .env.docker .env
    echo ""
    echo "[WARNING] Please edit .env file and change:"
    echo "  - DB_PASSWORD"
    echo "  - JWT_ACCESS_SECRET"
    echo "  - JWT_REFRESH_SECRET"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

echo ""
echo "[2/4] Building Docker images..."
docker-compose build

echo ""
echo "[3/4] Starting services..."
docker-compose up -d

echo ""
echo "[4/4] Waiting for services to be ready..."
sleep 10

echo ""
echo "========================================"
echo "  Services Started Successfully!"
echo "========================================"
echo ""
echo "Backend API: http://localhost:3000"
echo "Health Check: http://localhost:3000/health"
echo "MySQL: localhost:3306"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
echo ""
read -p "Press Enter to view logs..."
docker-compose logs -f
