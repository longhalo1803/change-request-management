# CR Management System

Enterprise Change Request Management System for SOLASHI Vietnam - Japanese Client Collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)

## About

A full-stack web application for managing Change Requests (CR) between Japanese clients and SOLASHI Vietnam development team. Built with modern technologies for enterprise-grade reliability and scalability.

## ✨ Features

- **JWT Authentication** - Secure login with refresh tokens (15min access / 7d refresh)
- **Role-Based Access Control** - 3 user roles: Admin, Project Manager (PM), Customer
- **Change Request Workflow** - 10-state lifecycle management (Created → Quoted → Approved → Development → Testing → Deployed → Closed, etc.)
- **Comment System** - Public, Internal, and PM-only comment visibility levels
- **File Attachments** - Secure file uploads with validation (5MB max: JPEG, PNG, PDF, DOCX)
- **Quotation Management** - Cost estimation and tracking
- **Multi-language Support** - English, Japanese (日本語), Vietnamese (Tiếng Việt)
- **Real-time Updates** - Automatic data synchronization with TanStack Query

## 🛠️ Tech Stack

**Backend**

- Node.js v20+ with TypeScript
- Express.js (Web framework)
- TypeORM (Database ORM)
- MySQL 8.0+ (Database)
- JWT, bcryptjs, Zod, Multer, i18next, Winston

**Frontend**

- React 18 + TypeScript
- Vite (Build tool with HMR)
- TanStack Query v5 (Server state management)
- Zustand (Client state management)
- Ant Design, React Hook Form, Tailwind CSS
- Axios, i18next, Recharts

**Infrastructure**

- Docker & Docker Compose
- Prettier (Code formatting)
- ESLint (Linting)

## 📁 Project Structure

```
change-request-management/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── entities/     # Database models
│   │   ├── routes/       # API endpoints
│   │   ├── middlewares/  # Auth, validation, etc.
│   │   ├── validators/   # Zod schemas
│   │   └── locales/      # Translations (en, ja, vi)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── modules/      # Feature modules
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── store/        # Zustand stores
│   │   └── locales/      # Translations (en, ja, vi)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml    # Multi-container setup
├── package.json          # Root scripts (Prettier)
├── .prettierrc            # Code formatting config
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **MySQL** 8.0 or higher
- **Git** v2.0 or higher
- **Docker & Docker Compose** (optional)

### Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/SOLASHI/change-request-management.git
   cd change-request-management
   ```

2. **Install Dependencies**

   ```bash
   # Windows
   .\install-all.bat

   # macOS/Linux
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment Variables**

   Backend (`backend/.env`):

   ```env
   NODE_ENV=development
   PORT=8080
   API_PREFIX=/api

   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=cr_user
   DB_PASSWORD=your_password
   DB_DATABASE=cr_management

   JWT_ACCESS_SECRET=your_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   CORS_ORIGIN=http://localhost:3000
   ```

   Frontend (`frontend/.env`):

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Setup Database**

   ```bash
   # Option A: Manual MySQL
   mysql -u root -p
   CREATE DATABASE cr_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   # Option B: Docker Compose
   docker-compose up -d mysql
   ```

5. **Run Migrations**

   ```bash
   cd backend
   npm run migration:run
   ```

6. **Seed Default Users**

   ```bash
   cd backend
   npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts
   ```

   Default Accounts:
   - Admin: `admin@solashi.com` / `Admin@123`
   - PM: `pm@solashi.com` / `PM@123`
   - Customer: `customer@example.com` / `Customer@123`

7. **Start Development Servers**

   Terminal 1 - Backend:

   ```bash
   cd backend
   npm run dev
   # Server: http://localhost:8080
   ```

   Terminal 2 - Frontend:

   ```bash
   cd frontend
   npm run dev
   # App: http://localhost:3000
   ```

   Or use Docker Compose for the database:

   ```bash
   docker-compose up -d mysql
   ```

## 📚 Available Scripts

**Root Commands**

```bash
npm run format           # Format all code with Prettier
npm run format:check    # Check formatting
npm run format:backend  # Format backend only
npm run format:frontend # Format frontend only
```

**Backend Commands** (from `backend/`)

```bash
npm run dev             # Development with hot-reload
npm run build           # Build TypeScript
npm start               # Run compiled server
npm run lint            # ESLint check
npm test                # Run tests
npm run migration:run   # Run database migrations
```

**Frontend Commands** (from `frontend/`)

```bash
npm run dev             # Development server (Vite)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # ESLint check
```

## Architecture

**Backend** - 5-Layer Architecture

```
Request → Router → Middleware → Controller → Service → Repository → Database
```

**Frontend** - Component-Based Architecture

```
Page → Module → Component → Hook → Service → API
```

## 🔒 Security Features

- JWT authentication with refresh token rotation
- Password hashing with bcryptjs
- Role-Based Access Control (RBAC)
- CORS configuration
- Helmet security headers
- SQL injection prevention (TypeORM)
- Input validation (Zod)
- File upload validation

## 🌍 Internationalization

Supports 3 languages:

- **English (en)** - Default
- **Japanese (日本語, ja)** - For Japanese clients
- **Vietnamese (Tiếng Việt, vi)** - For SOLASHI Vietnam team

Language detection: User preference → Browser language → English (default)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Format code: `npm run format`
4. Commit changes: `git commit -m "feat: add amazing feature"`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

**Commit Convention:**

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code formatting
refactor: Code refactoring
perf:     Performance improvement
test:     Test changes
chore:    Build/deps
```

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email:** support@solashi.com
- **Issues:** Create an issue on GitHub
- **Team:** Contact your project manager

---

**Built with ❤️ by SOLASHI Vietnam for Japanese Clients**

**Version:** 1.0.0 | **Last Updated:** April 13, 2026
