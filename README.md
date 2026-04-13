# CR Management System

Enterprise Change Request Management System for SOLASHI Vietnam - Japanese Client Collaboration

**Version:** 1.0.0 | **Platform:** Full-Stack (Node.js + React) | **Database:** MySQL 8.0+

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites & Installation](#prerequisites--installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Development](#development)
- [Architecture](#architecture)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Internationalization](#internationalization)
- [Code Quality](#code-quality)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [Support](#support)

---

## Overview

A full-stack enterprise web application for managing Change Requests (CR) between Japanese clients and SOLASHI Vietnam development team. Built with modern technologies, featuring:

- **JWT-based authentication** with refresh token rotation
- **Role-based access control** (Admin, BrSE, Developer, QA, Customer)
- **10-state workflow** for change request lifecycle management
- **Multi-language support** (English, Japanese, Vietnamese)
- **Real-time data management** with TanStack Query and Zustand
- **Secure file uploads** with validation
- **Docker-ready** development and production setup

---

## ✨ Features

### Core Functionality

- 🔐 **JWT Authentication** - Secure login with 15min access token & 7-day refresh tokens
- 🌍 **Multi-language Support** - English (en), Japanese (日本語), Vietnamese (Tiếng Việt)
- 👥 **Role-Based Access Control** - Admin, BrSE, Developer, QA, Customer roles with granular permissions
- 📊 **CR State Machine** - 10-state workflow management for change requests
- 💬 **Comment System** - Public, Internal, BrSE-only visibility levels
- 📎 **File Attachments** - Secure file upload with validation (5MB max, JPEG/PNG/PDF/DOCX)
- 💰 **Quotation Management** - BrSE-only quotation features for cost estimation
- 🔄 **Real-time Updates** - TanStack Query for optimistic updates and automatic cache management
- 📈 **Admin Dashboard** - Analytics and monitoring for administrators
- 📱 **Responsive Design** - Mobile-friendly UI with Ant Design components

---

## 🛠️ Tech Stack

### Backend (Node.js + Express.js)

**Core Framework:**

- **Runtime:** Node.js v20.x+ with TypeScript
- **Web Framework:** Express.js 4.18.2
- **Database ORM:** TypeORM 0.3.17
- **Database:** MySQL 8.0+
- **Environment:** dotenv 16.3.1

**Authentication & Security:**

- **JWT:** jsonwebtoken 9.0.2
- **Password Hashing:** bcryptjs 2.4.3
- **Security Headers:** helmet 7.0.0
- **CORS:** cors 2.8.5

**Validation & Parsing:**

- **Schema Validation:** Zod 3.22.4
- **File Upload:** Multer 2.0.2
- **Reflect Metadata:** reflect-metadata 0.1.13 (for TypeORM decorators)

**Internationalization:**

- **i18next:** 23.7.6
- **File Backend:** i18next-fs-backend 2.3.1
- **Middleware:** i18next-http-middleware 3.5.0

**Logging & Monitoring:**

- **Logger:** Winston 3.10.0
- **HTTP Logger:** Morgan 1.10.0

**Development Tools:**

- **TypeScript:** 5.1.6
- **Compiler:** ts-node 10.9.1, ts-node-dev 2.0.0
- **Path Resolver:** tsconfig-paths 4.2.0, tsc-alias 1.8.10
- **Linter:** ESLint 9.0.0 with TypeScript support
- **Code Formatter:** Prettier 3.0.1
- **Testing:** Jest 29.6.2, ts-jest 29.1.1, supertest 7.1.3

### Frontend (React 18 + Vite)

**Core Framework:**

- **UI Framework:** React 18.2.0 + TypeScript
- **Build Tool:** Vite 5.4.0 (Lightning-fast bundling with HMR)
- **Routing:** React Router v6.16.0
- **Package Manager:** npm/yarn

**State Management:**

- **Server State:** TanStack Query (React Query) v5.0.0 (automatic caching, synchronization)
- **Client State:** Zustand 4.4.1 (lightweight global state)

**UI & Components:**

- **Component Library:** Ant Design 5.10.0 (enterprise-grade UI)
- **Form Management:** React Hook Form 7.47.0
- **Charts & Visualization:** Recharts 3.8.1

**Data Handling:**

- **HTTP Client:** Axios 1.5.0
- **Validation:** Zod 3.22.4
- **Date Manipulation:** Dayjs 1.11.10

**Internationalization:**

- **i18next:** 23.7.6
- **React Integration:** react-i18next 13.5.0
- **Language Detection:** i18next-browser-languagedetector 7.2.0 (auto-detect browser language)

**Styling:**

- **CSS Framework:** Tailwind CSS 3.4.0
- **PostCSS:** 8.4.31
- **Auto Prefixer:** autoprefixer 10.4.16

**Development Tools:**

- **TypeScript:** 5.2.2
- **Linter:** ESLint 9.0.0 with React plugin
- **Code Formatter:** Prettier 3.0.3
- **Vite React Plugin:** @vitejs/plugin-react 4.3.0

### Infrastructure & DevOps

**Containerization:**

- **Docker:** For application containerization
- **Docker Compose:** 3.8+ for multi-container orchestration
- **Services:** MySQL 8.0, Backend API, Frontend Dev Server

**Code Quality:**

- **Formatting:** Prettier 3.0.3 (consistent code style)
- **Linting:** ESLint 9.0.0 (code quality checks)

---

## 📁 Project Structure

```
change-request-management/
├── 📦 Root Configuration
│   ├── package.json                # Root workspace config (Prettier)
│   ├── .prettierrc                 # Code formatting rules
│   ├── .gitignore                  # Git ignore patterns
│   ├── .dockerignore               # Docker build ignore
│   ├── .env                        # Environment variables (local, git-ignored)
│   ├── .env.example                # Template for environment setup
│   ├── docker-compose.yml          # Multi-container orchestration
│   └── README.md                   # This file
│
├── 🔙 BACKEND API (Node.js + Express)
│   ├── src/
│   │   ├── server.ts               # Express server entry point
│   │   ├── app.ts                  # Express app configuration
│   │   │
│   │   ├── config/                 # Configuration management
│   │   │   ├── database.ts         # TypeORM database configuration
│   │   │   ├── env.ts              # Environment variables handler
│   │   │   └── i18n.ts             # i18next configuration
│   │   │
│   │   ├── controllers/            # HTTP request handlers (6 controllers)
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── change-request.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── .gitkeep
│   │   │
│   │   ├── services/               # Business logic layer (7 services)
│   │   │   ├── admin-dashboard.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── change-request.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── token.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── .gitkeep
│   │   │
│   │   ├── repositories/           # Data access layer (5 repositories)
│   │   │   ├── admin.repository.ts
│   │   │   ├── change-request.repository.ts
│   │   │   ├── project.repository.ts
│   │   │   ├── refresh-token.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── .gitkeep
│   │   │
│   │   ├── entities/               # TypeORM database entities (7 entities)
│   │   │   ├── index.ts            # Entity exports
│   │   │   ├── user.entity.ts      # User model
│   │   │   ├── change-request.entity.ts  # CR model
│   │   │   ├── project.entity.ts   # Project model
│   │   │   ├── quotation.entity.ts # Quotation model
│   │   │   ├── refresh-token.entity.ts   # Token storage
│   │   │   ├── task-lookup.entity.ts     # Lookup table
│   │   │   └── .gitkeep
│   │   │
│   │   ├── middlewares/            # Express middleware
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   ├── error.middleware.ts # Global error handler
│   │   │   ├── language.middleware.ts  # Language detection
│   │   │   └── upload.middleware.ts    # File upload handler
│   │   │
│   │   ├── routes/                 # API route definitions
│   │   │   ├── index.ts            # Route aggregator
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── change-request.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   └── user.routes.ts
│   │   │
│   │   ├── validators/             # Zod schema validation
│   │   │   ├── auth.validator.ts
│   │   │   ├── change-request.validator.ts
│   │   │   ├── project.validator.ts
│   │   │   └── .gitkeep
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── app-error.ts        # Custom error class
│   │   │   ├── async-handler.ts    # Async error wrapper
│   │   │   ├── logger.ts           # Winston logger configuration
│   │   │   ├── password.ts         # Password utilities (hash, verify)
│   │   │   ├── response.ts         # API response formatter
│   │   │   └── translator.ts       # i18n translator helper
│   │   │
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── express.d.ts        # Express Request extensions
│   │   │   └── i18n.d.ts           # i18n type declarations
│   │   │
│   │   ├── locales/                # Internationalization translations
│   │   │   ├── en/                 # English translations (*.json)
│   │   │   ├── ja/                 # Japanese translations (*.json)
│   │   │   └── vi/                 # Vietnamese translations (*.json)
│   │   │
│   │   └── migrations/             # Database migrations (auto-generated)
│   │       └── .gitkeep
│   │
│   ├── 📄 Configuration Files
│   │   ├── package.json            # Backend dependencies & scripts
│   │   ├── package-lock.json       # Dependency lock file
│   │   ├── tsconfig.json           # TypeScript compiler options
│   │   ├── eslint.config.js        # ESLint configuration
│   │   ├── .env.example            # Environment template
│   │   ├── .env                    # Local environment (git-ignored)
│   │   ├── .env.local              # Local overrides (git-ignored)
│   │   ├── Dockerfile              # Docker image definition
│   │   ├── docker-compose.yml      # Backup compose config
│   │   ├── init-db.sql             # Database initialization script
│   │   ├── data-migration.sql      # Data migration script
│   │   └── README.md               # Backend documentation
│   │
│   └── 📊 Output Files (generated)
│       ├── dist/                   # Compiled JavaScript (npm run build)
│       ├── uploads/                # Uploaded files storage
│       ├── backend.log             # Application log file
│       └── node_modules/           # Dependencies (npm install)
│
├── 🎨 FRONTEND APP (React + Vite)
│   ├── src/
│   │   ├── main.tsx                # React DOM entry point
│   │   ├── App.tsx                 # Root React component
│   │   ├── App.css                 # Global styles
│   │   │
│   │   ├── providers/              # React context providers
│   │   │   └── I18nProvider.tsx    # i18n initialization
│   │   │
│   │   ├── routers/                # Route configuration
│   │   │   ├── index.ts            # Route definitions
│   │   │   └── customer/           # Customer routes
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── customer/           # Customer layout wrapper
│   │   │   └── .gitkeep
│   │   │
│   │   ├── pages/                  # Page-level components
│   │   │   ├── admin/              # Admin pages
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── auth/               # Auth pages
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── ForgotPassword.tsx
│   │   │   ├── customer/           # Customer pages
│   │   │   ├── pm/                 # Project manager pages
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── modules/                # Feature modules (domain-specific)
│   │   │   ├── admin-dashboard/    # Admin dashboard module
│   │   │   ├── admin-permissions/  # Permission management module
│   │   │   ├── auth/               # Authentication module (login, register)
│   │   │   ├── cr-list/            # Change request list module
│   │   │   ├── customer/           # Customer features module
│   │   │   ├── customer-dashboard/ # Customer dashboard module
│   │   │   └── dashboard/          # General dashboard module
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── cr/                 # CR-related components (CR card, detail, etc.)
│   │   │   ├── customer/           # Customer-specific components
│   │   │   ├── permissions/        # Permission components
│   │   │   ├── pm/                 # PM-specific components
│   │   │   ├── shared/             # Shared/common components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── ...
│   │   │   └── .gitkeep
│   │   │
│   │   ├── store/                  # State management (Zustand)
│   │   │   ├── customer/           # Customer store
│   │   │   └── .gitkeep
│   │   │
│   │   ├── services/               # API service layer
│   │   │   └── customer/           # Customer API services
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── changeRequest/      # CR-specific hooks
│   │   │   ├── comment/            # Comment hooks
│   │   │   ├── customer/           # Customer hooks
│   │   │   └── project/            # Project hooks
│   │   │
│   │   ├── lib/                    # Core utilities & helpers
│   │   │   ├── constants/          # App constants
│   │   │   │   └── api.ts          # API endpoint constants
│   │   │   ├── helpers/            # Helper functions
│   │   │   ├── types/              # TypeScript type definitions
│   │   │   │   ├── entities/       # Entity/model types
│   │   │   │   └── inputs/         # Request/input types
│   │   │   ├── validators/         # Zod validation schemas
│   │   │   ├── i18n/               # i18n utilities
│   │   │   └── customer/           # Customer-specific utilities
│   │   │
│   │   ├── locales/                # Internationalization translations
│   │   │   ├── en/                 # English translations (*.json)
│   │   │   ├── ja/                 # Japanese translations (*.json)
│   │   │   ├── vi/                 # Vietnamese translations (*.json)
│   │   │   └── customer/           # Customer-specific translations
│   │   │
│   │   └── config/                 # Configuration
│   │       └── (API endpoints, constants)
│   │
│   ├── 📄 Configuration Files
│   │   ├── package.json            # Frontend dependencies & scripts
│   │   ├── package-lock.json       # Dependency lock file
│   │   ├── tsconfig.json           # TypeScript compiler options
│   │   ├── tsconfig.node.json      # Node tools TypeScript config
│   │   ├── vite.config.ts          # Vite bundler configuration
│   │   ├── tailwind.config.js      # Tailwind CSS configuration
│   │   ├── postcss.config.js       # PostCSS configuration
│   │   ├── eslint.config.js        # ESLint configuration
│   │   ├── index.html              # HTML entry point
│   │   ├── .env.example            # Environment template
│   │   ├── .env                    # Local environment (git-ignored)
│   │   ├── .env.local              # Local overrides (git-ignored)
│   │   ├── Dockerfile              # Docker image definition
│   │   └── README.md               # Frontend documentation
│   │
│   └── 📊 Output Files (generated)
│       ├── dist/                   # Built production files (npm run build)
│       └── node_modules/           # Dependencies (npm install)
│
└── 📄 Documentation & Version Control
    ├── .git/                       # Git repository metadata
    ├── .github/                    # GitHub-specific files (workflows, templates)
    ├── .idea/                      # IntelliJ IDEA IDE settings
    ├── .vscode/                    # VS Code workspace settings
    └── node_modules/               # Root dependencies (Prettier)
```

---

## Prerequisites & Installation

### System Requirements

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher (or yarn v3.x)
- **MySQL:** 8.0 or higher
- **Git:** v2.0 or higher
- **Docker & Docker Compose:** (Optional, for containerized setup)

### Step 1: Clone the Repository

```bash
git clone https://github.com/SOLASHI/change-request-management.git
cd change-request-management
```

### Step 2: Install Dependencies

**Option A: Automatic Installation (Windows)**

```batch
.\install-all.bat
```

**Option B: Manual Installation**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Back to root for formatting
cd ..
npm install
```

### Step 3: Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
NODE_ENV=development
PORT=8080
API_PREFIX=/api

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=cr_user
DB_PASSWORD=your_secure_password
DB_DATABASE=cr_management
DB_POOL_SIZE=10

# JWT Authentication
JWT_ACCESS_SECRET=your_access_token_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_in_production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

#### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=false
VITE_APP_NAME=CR Management System
VITE_APP_VERSION=1.0.0
```

### Step 4: Database Setup

#### Option A: Manual MySQL Setup

```sql
-- Create database
CREATE DATABASE cr_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'cr_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cr_management.* TO 'cr_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Option B: Docker Compose Setup (Recommended)

```bash
# From root directory
docker-compose up -d mysql
```

### Step 5: Run Database Migrations

```bash
cd backend
npm run migration:run
```

### Step 6: Seed Default Users

```bash
cd backend
npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts
```

This creates default accounts:

| Role      | Email                | Password     |
| --------- | -------------------- | ------------ |
| Admin     | admin@solashi.com    | Admin@123    |
| BrSE      | brse@solashi.com     | Brse@123     |
| Developer | dev@solashi.com      | Dev@123      |
| QA        | qa@solashi.com       | QA@123       |
| Customer  | customer@example.com | Customer@123 |

---

## Configuration

### Environment Variables Documentation

#### Backend Variables

| Variable                 | Type   | Default               | Description                          |
| ------------------------ | ------ | --------------------- | ------------------------------------ |
| `NODE_ENV`               | string | development           | Environment (development/production) |
| `PORT`                   | number | 8080                  | Backend API port                     |
| `API_PREFIX`             | string | /api                  | API route prefix                     |
| `DB_HOST`                | string | localhost             | MySQL host                           |
| `DB_PORT`                | number | 3306                  | MySQL port                           |
| `DB_USERNAME`            | string | root                  | MySQL user                           |
| `DB_PASSWORD`            | string | -                     | MySQL password                       |
| `DB_DATABASE`            | string | cr_management         | Database name                        |
| `DB_POOL_SIZE`           | number | 10                    | Connection pool size                 |
| `JWT_ACCESS_SECRET`      | string | -                     | Access token signing key (MUST SET)  |
| `JWT_REFRESH_SECRET`     | string | -                     | Refresh token signing key (MUST SET) |
| `JWT_ACCESS_EXPIRES_IN`  | string | 15m                   | Access token lifetime                |
| `JWT_REFRESH_EXPIRES_IN` | string | 7d                    | Refresh token lifetime               |
| `UPLOAD_DIR`             | string | uploads               | File upload directory                |
| `MAX_FILE_SIZE`          | number | 5242880               | Max upload size (5MB)                |
| `ALLOWED_FILE_TYPES`     | string | -                     | Allowed MIME types                   |
| `CORS_ORIGIN`            | string | http://localhost:3000 | CORS allowed origin                  |
| `LOG_LEVEL`              | string | info                  | Log level (error/warn/info/debug)    |

#### Frontend Variables

| Variable            | Type    | Default                   | Description          |
| ------------------- | ------- | ------------------------- | -------------------- |
| `VITE_API_BASE_URL` | string  | http://localhost:8080/api | Backend API base URL |
| `VITE_USE_MOCK`     | boolean | false                     | Enable mock services |
| `VITE_APP_NAME`     | string  | CR Management System      | Application name     |
| `VITE_APP_VERSION`  | string  | 1.0.0                     | Application version  |

### Configuration Files Reference

#### .prettierrc (Code Formatting)

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### docker-compose.yml Services

- **MySQL:** mysql:8.0 (Port 3306, Volume: mysql_data)
- **Backend:** Node.js API (Port 8080, Hot-reload enabled)
- **Frontend:** Vite Dev Server (Port 3000, HMR enabled)

---

## Database Setup

### Database Schema

#### Entity Overview

| Entity            | Description             | Key Fields                                       |
| ----------------- | ----------------------- | ------------------------------------------------ |
| **User**          | System users with roles | id, email, password, role, status, createdAt     |
| **ChangeRequest** | CR workflow tracking    | id, title, status, priority, assignee, createdBy |
| **Project**       | Project containers      | id, name, description, manager, status           |
| **Quotation**     | Cost estimation         | id, crId, amount, currency, status               |
| **RefreshToken**  | Token management        | id, token, userId, expiresAt, isRevoked          |
| **TaskLookup**    | Task enumeration        | id, taskType, description, sortOrder             |

#### Role-Based Permissions

| Role      | Read CR | Create CR | Edit CR  | Delete CR | Manage Users | View Quotation |
| --------- | ------- | --------- | -------- | --------- | ------------ | -------------- |
| Admin     | ✅      | ✅        | ✅       | ✅        | ✅           | ✅             |
| BrSE      | ✅      | ✅        | ✅       | -         | -            | ✅             |
| Developer | ✅      | -         | -        | -         | -            | -              |
| QA        | ✅      | -         | -        | -         | -            | -              |
| Customer  | ✅      | ✅        | ✅ (own) | -         | -            | -              |

#### CR State Machine (10 States)

```
[Created] → [Quoted] → [Approved] → [In Development] → [Testing] → [Deployed] → [Closed]
    ↓         ↓         ↓            ↓                ↓
  [Rejected] [Cancelled] [Waiting Input] [Blocked]
```

---

## Development

### Available Scripts

#### Root Commands (All Projects)

```bash
# Format all code
npm run format

# Check formatting without changes
npm run format:check

# Format backend only
npm run format:backend

# Format frontend only
npm run format:frontend
```

#### Backend Commands

```bash
# Development with hot-reload
npm run dev

# Build TypeScript
npm run build

# Run compiled server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests
npm run test

# Tests in watch mode
npm run test:watch

# Database migrations
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
```

#### Frontend Commands

```bash
# Development server (Vite, http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Development Workflow

#### Terminal Setup (Without Docker)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:8080
# API available at http://localhost:8080/api
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
# Hot Module Replacement (HMR) enabled for instant updates
```

#### Docker Setup (Recommended)

```bash
# From root directory, start all services
docker-compose up

# Services:
# - MySQL: localhost:3306
# - Backend: localhost:8080
# - Frontend: localhost:3000
#
# View logs: docker-compose logs -f
# Stop: docker-compose down
```

### API Endpoints Overview

#### Authentication Routes (`/api/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT tokens)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout & revoke token

#### Change Request Routes (`/api/change-requests`)

- `GET /change-requests` - List all CRs (paginated)
- `GET /change-requests/:id` - Get CR detail
- `POST /change-requests` - Create CR
- `PUT /change-requests/:id` - Update CR
- `DELETE /change-requests/:id` - Delete CR
- `PATCH /change-requests/:id/status` - Update CR status

#### Project Routes (`/api/projects`)

- `GET /projects` - List all projects
- `GET /projects/:id` - Get project detail
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project

#### Admin Routes (`/api/admin`)

- `GET /admin/dashboard` - Admin statistics
- `GET /admin/users` - List all users
- `PUT /admin/users/:id/role` - Update user role
- `DELETE /admin/users/:id` - Delete user

#### User Routes (`/api/users`)

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update profile
- `POST /users/change-password` - Change password

### Debugging

**Enable Debug Logging:**

```bash
# Backend
LOG_LEVEL=debug npm run dev

# Frontend
# Use browser DevTools → Console tab
```

**Database Inspection:**

```bash
# Connect to MySQL
mysql -h localhost -u cr_user -p cr_management

# List tables
SHOW TABLES;

# View table structure
DESCRIBE user;
DESCRIBE change_request;
```

---

## Architecture

### Backend Architecture (5-Layer Pattern)

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       ↓
┌─────────────────┐
│     Router      │ ← Define API endpoints
└────────┬────────┘
         ↓
┌─────────────────────────┐
│     Middleware          │ ← Auth, validation, language detection
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│     Controller          │ ← Handle HTTP requests/responses
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│      Service            │ ← Business logic implementation
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│     Repository          │ ← Database operations
└────────┬────────────────┘
         ↓
┌─────────────┐
│  Database   │
└─────────────┘
```

**Layer Responsibilities:**

1. **Router** (`/routes/`) - Define API endpoints and route paths
2. **Middleware** (`/middlewares/`) - Authentication, request validation, language detection, error handling
3. **Controller** (`/controllers/`) - Handle HTTP request/response, input sanitization
4. **Service** (`/services/`) - Core business logic, validations, transaction management
5. **Repository** (`/repositories/`) - Database queries, TypeORM operations
6. **Entity** (`/entities/`) - Database table definitions (TypeORM decorators)

**Backend Controllers (6):**

- `AdminController` - Admin operations (dashboard, user management)
- `AuthController` - Authentication (login, register, refresh token)
- `ChangeRequestController` - CR CRUD and workflow operations
- `ProjectController` - Project management
- `UserController` - User profile and settings
- Error handler middleware

**Backend Services (7):**

- `AdminDashboardService` - Statistics and reporting
- `AuthService` - Authentication logic, JWT generation
- `ChangeRequestService` - CR business logic
- `ProjectService` - Project business logic
- `TokenService` - JWT token management
- `UserService` - User management
- Password utilities

### Frontend Architecture (Component-Based)

```
┌──────────┐
│   Page   │ ← Route destination components
└────┬─────┘
     ↓
┌──────────────────────┐
│     Module           │ ← Feature/domain containers
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│     Component        │ ← Reusable UI elements
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│       Hook           │ ← Custom React hooks (logic)
└────┬─────────────────┘
     ↓
┌──────────────────────┐
│      Service         │ ← API calls
└────┬─────────────────┘
     ↓
┌──────────────────┐
│    API (REST)    │ ← Backend API
└──────────────────┘
```

**Data Flow:**

```
Page → Module → Component → Custom Hook → Service → API Call
  ↓                                          ↑
  └────────── State (Zustand/TanStack Query)─┘
```

**Frontend Modules (7):**

- `admin-dashboard/` - Admin statistics and monitoring
- `admin-permissions/` - Role and permission management
- `auth/` - Login, register, password reset flows
- `cr-list/` - Change request list and filtering
- `customer/` - Customer-specific features
- `customer-dashboard/` - Customer overview
- `dashboard/` - General dashboard interface

**Frontend Component Categories (6):**

- `admin/` - Admin-specific UI components
- `cr/` - Change request components (cards, details, forms)
- `customer/` - Customer-specific UI
- `permissions/` - Permission management UI
- `pm/` - Project manager components
- `shared/` - Header, Sidebar, buttons, modals, etc.

**State Management:**

1. **TanStack Query (Server State)**
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - Example: `useQuery()`, `useMutation()` for API calls

2. **Zustand (Client State)**
   - User authentication state
   - UI state (modals, sidebars)
   - Lightweight alternative to Redux
   - Example: `useStore()` for global state

---

## Security Features

### Authentication & Authorization

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Refresh Token Rotation** - 15-minute access token + 7-day refresh token
- ✅ **Token Revocation** - Logout invalidates tokens
- ✅ **Password Hashing** - bcryptjs with 10 rounds salt
- ✅ **Role-Based Access Control (RBAC)** - 5 roles with granular permissions
- ✅ **Permission Middleware** - Per-route access control

### Transport Security

- ✅ **CORS Configuration** - Whitelist specific origins
- ✅ **Helmet Security Headers** - XSS, clickjacking, MIME sniffing protection
- ✅ **HTTPS Ready** - Production deployment supports TLS/SSL

### Data Security

- ✅ **SQL Injection Prevention** - TypeORM parameterized queries
- ✅ **XSS Protection** - React escaping + Content Security Policy
- ✅ **Input Validation** - Zod schema validation on all endpoints
- ✅ **File Upload Validation** - MIME type, size, extension checks

### Database Security

- ✅ **Connection Pooling** - Configurable pool size (default 10)
- ✅ **Prepared Statements** - TypeORM prevents SQL injection
- ✅ **Character Set** - utf8mb4 Unicode support
- ✅ **Environment Variables** - Credentials never hardcoded

---

## Internationalization

### Supported Languages

- **English (en)** - Default
- **Japanese (日本語, ja)** - For Japanese clients
- **Vietnamese (Tiếng Việt, vi)** - For SOLASHI Vietnam team

### i18n Architecture

**Backend (i18next + File System):**

```
backend/src/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── cr.json
│   └── errors.json
├── ja/
│   ├── common.json
│   ├── auth.json
│   ├── cr.json
│   └── errors.json
└── vi/
    ├── common.json
    ├── auth.json
    ├── cr.json
    └── errors.json
```

**Frontend (react-i18next + Auto Detection):**

```
frontend/src/locales/
├── en/
├── ja/
└── vi/
```

**Language Detection Priority (Frontend):**

1. User preference (localStorage)
2. Browser language
3. Default to English

### Usage Examples

**Backend (Express):**

```typescript
const message = req.t("auth.login_success");
const error = req.t("errors.user_not_found");
```

**Frontend (React):**

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return <h1>{t('common.welcome')}</h1>;
}
```

---

## Code Quality

### Code Formatting (Prettier)

**Run formatting:**

```bash
# Format all code
npm run format

# Check without changes
npm run format:check

# Format specific directory
npx prettier --write "backend/src/**/*.ts"
```

**Configuration** (`.prettierrc`):

- Semi-colons: Enabled
- Quotes: Double quotes
- Print width: 80 characters
- Tab width: 2 spaces
- Trailing commas: ES5 style
- Semicolons: Enabled

### Linting (ESLint)

**Backend:**

```bash
cd backend
npm run lint
```

**Frontend:**

```bash
cd frontend
npm run lint
```

### Type Checking (TypeScript)

```bash
# Backend
cd backend && npx tsc --noEmit

# Frontend
cd frontend && npx tsc --noEmit
```

### Testing

**Backend Unit Tests:**

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

**Frontend Tests (Jest + React Testing Library):**

```bash
cd frontend
npm test
```

---

## Docker Deployment

### Development with Docker

#### Quick Start

```bash
# From root directory
docker-compose up -d

# Access services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8080
# - MySQL: localhost:3306

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### docker-compose.yml Services

**MySQL 8.0:**

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root_password
  MYSQL_USER: cr_user
  MYSQL_PASSWORD: cr_password
  MYSQL_DATABASE: cr_management
volumes:
  - mysql_data:/var/lib/mysql
ports:
  - "3306:3306"
```

**Backend API:**

```yaml
build: ./backend
ports:
  - "8080:8080"
environment:
  NODE_ENV: development
  DB_HOST: mysql
  DB_USERNAME: cr_user
  DB_PASSWORD: cr_password
volumes:
  - ./backend:/app/backend
  - /app/backend/node_modules
```

**Frontend:**

```yaml
build: ./frontend
ports:
  - "3000:3000"
volumes:
  - ./frontend:/app/frontend
  - /app/frontend/node_modules
```

### Production Build

#### Backend Production Build

```bash
cd backend

# Build TypeScript
npm run build

# Output in dist/ directory
# Run with: npm start
```

**Production Checklist:**

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS origin
- [ ] Set up database backups
- [ ] Enable logging
- [ ] Configure file upload directory

#### Frontend Production Build

```bash
cd frontend

# Build React + Vite
npm run build

# Output in dist/ directory
# Preview: npm run preview

# Serve with static server
npx serve -s dist
```

**Production Checklist:**

- [ ] Set `VITE_API_BASE_URL` to production API
- [ ] Build optimization enabled
- [ ] Source maps disabled (optional)
- [ ] Configure CDN for static assets
- [ ] Set cache headers

### Docker Production Deployment

```dockerfile
# Backend Dockerfile (multistage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

---

## Contributing

### Git Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

2. **Make Changes & Commit**

   ```bash
   # Format code
   npm run format

   # Stage changes
   git add .

   # Commit with descriptive message
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue"
   ```

3. **Push & Create PR**

   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

4. **PR Review & Merge**
   - Request review from team members
   - Address feedback
   - Merge after approval

### Commit Message Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, missing semicolons, etc)
refactor: Code refactoring without feature change
perf:     Performance improvements
test:     Test additions/modifications
chore:    Build process, dependencies, etc
```

**Example:**

```
feat: add CR status update API endpoint
fix: resolve JWT token expiration issue
docs: update installation guide
```

### Code Review Checklist

- [ ] Code is TypeScript with proper types
- [ ] Tests pass (`npm test`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] No console.log in production code
- [ ] No secrets/credentials hardcoded
- [ ] Documentation updated

---

## Support

### Getting Help

**Documentation:**

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- This file: Root README.md

**Common Issues:**

**Port Already in Use:**

```bash
# Find process on port 3000
netstat -ano | findstr :3000 (Windows)
lsof -i :3000 (Mac/Linux)

# Kill process
taskkill /PID <PID> /F (Windows)
kill -9 <PID> (Mac/Linux)
```

**Database Connection Failed:**

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database is created
- Verify DB_HOST (localhost vs mysql for Docker)

**npm install Fails:**

- Delete `node_modules` and `package-lock.json`
- Clear npm cache: `npm cache clean --force`
- Try again: `npm install`

### Support Channels

- **Email:** support@solashi.com
- **Issues:** Create an issue on GitHub repository
- **Team:** Contact your project manager

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## Team & Acknowledgments

### Development Team

**SOLASHI Vietnam**

- Full-Stack Development Team
- Quality Assurance Team
- Project Management

### Technology Credits

- **React Team** - React 18 framework
- **Vercel** - Vite build tool
- **TanStack** - React Query for state management
- **Ant Design Team** - Enterprise UI components
- **TypeORM Team** - Database ORM
- **Express.js Community** - Web framework
- **All Open-Source Contributors** - Whose amazing work powers this project

---

## Changelog

### Version 1.0.0 (Initial Release)

**Features:**

- JWT Authentication with refresh tokens
- Multi-language support (EN, JA, VI)
- Role-based access control
- CR state machine workflow (10 states)
- Comment system with visibility levels
- File attachment support
- Quotation management
- Admin dashboard
- Real-time data updates with TanStack Query
- Responsive design with Ant Design

**Tech Stack:**

- Backend: Node.js 20, Express.js, TypeORM, MySQL
- Frontend: React 18, Vite, TanStack Query, Zustand
- Infrastructure: Docker, Docker Compose

---

**Built with ❤️ by SOLASHI Vietnam for Japanese Clients**

**Last Updated:** April 13, 2026 | **Version:** 1.0.0
