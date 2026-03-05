#!/bin/bash
#=============================================================================
#  Global Neochain — Local Setup (Run Once)
#  Usage:  chmod +x setup-local.sh && ./setup-local.sh
#=============================================================================
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'

echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║     GLOBAL NEOCHAIN — Local Development Setup            ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── CHECK PREREQUISITES ───
echo -e "${BOLD}Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js not found. Install from https://nodejs.org (v18+)${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm not found.${NC}"; exit 1; }
command -v mysql >/dev/null 2>&1 || { echo -e "${RED}❌ MySQL client not found. Install MySQL Server first.${NC}"; exit 1; }

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}❌ Node.js v18+ required (you have $(node -v))${NC}"
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js $(node -v)"
echo -e "  ${GREEN}✓${NC} npm $(npm -v)"
echo -e "  ${GREEN}✓${NC} MySQL client found"

# ─── MYSQL SETUP ───
echo ""
echo -e "${BOLD}MySQL Configuration:${NC}"
read -p "  MySQL username [root]: " DB_USER
DB_USER=${DB_USER:-root}
read -sp "  MySQL password (press Enter if none): " DB_PASS
echo ""

echo -e "\n${CYAN}Creating database...${NC}"
if [ -z "$DB_PASS" ]; then
  mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS neochain_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
else
  mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS neochain_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to connect to MySQL. Check your credentials.${NC}"
  echo -e "   Make sure MySQL is running: ${BOLD}sudo systemctl start mysql${NC}"
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Database 'neochain_dev' ready"

# ─── GENERATE SECRETS ───
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "dev-jwt-secret-change-in-production-$(date +%s)")
SESSION_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "dev-session-secret-$(date +%s)")

# ─── BACKEND .env ───
echo -e "\n${CYAN}Configuring backend...${NC}"
cat > backend/.env <<ENV
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=neochain_dev
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
SESSION_SECRET=${SESSION_SECRET}
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ENV
echo -e "  ${GREEN}✓${NC} backend/.env created"

# ─── INSTALL BACKEND ───
echo -e "\n${CYAN}Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "  ${GREEN}✓${NC} Backend packages installed"

# ─── SEED DATABASE ───
echo -e "\n${CYAN}Seeding database with sample data...${NC}"
node src/seeds/seed.js
cd ..

# ─── FRONTEND .env ───
echo -e "\n${CYAN}Configuring frontend...${NC}"
cat > frontend/.env <<ENV
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Global Neochain
ENV

# ─── INSTALL FRONTEND ───
echo -e "${CYAN}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# ─── DONE ───
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗"
echo -e "║              ✅  SETUP COMPLETE!                          ║"
echo -e "╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}To start the application:${NC}"
echo ""
echo -e "    ${CYAN}Terminal 1 (Backend):${NC}"
echo -e "    cd backend && npm run dev"
echo ""
echo -e "    ${CYAN}Terminal 2 (Frontend):${NC}"
echo -e "    cd frontend && npm run dev"
echo ""
echo -e "  ${BOLD}Then open:${NC} ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "  ${BOLD}Login:${NC}"
echo -e "    Email:    ${GREEN}admin@globalneochain.com${NC}"
echo -e "    Password: ${GREEN}admin123${NC}"
echo ""
echo -e "  ${BOLD}API Health:${NC} http://localhost:3001/api/health"
echo ""
echo -e "  ${YELLOW}⚠️  Change the admin password after first login!${NC}"
echo ""
