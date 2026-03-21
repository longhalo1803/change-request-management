#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CR Management System - Installation  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 successful${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Install Backend
echo -e "${BLUE}[1/2] Installing Backend dependencies...${NC}"
cd backend
npm install
check_status "Backend installation"
cd ..
echo ""

# Install Frontend
echo -e "${BLUE}[2/2] Installing Frontend dependencies...${NC}"
cd frontend
npm install
check_status "Frontend installation"
cd ..
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Installation Complete! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Setup environment variables:"
echo "     cd backend && cp .env.example .env"
echo "     cd frontend && cp .env.example .env"
echo ""
echo "  2. Run database migrations:"
echo "     cd backend && npm run migration:run"
echo ""
echo "  3. Seed default users:"
echo "     cd backend && npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts"
echo ""
echo "  4. Start development servers:"
echo "     Terminal 1: cd backend && npm run dev"
echo "     Terminal 2: cd frontend && npm run dev"
echo ""
