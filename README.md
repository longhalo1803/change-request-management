# 🚀 CR Management System

Enterprise Change Request Management System for SOLASHI Vietnam - Japanese Client collaboration.

## 📋 Overview

A full-stack web application for managing Change Requests (CR) between Japanese clients and SOLASHI Vietnam development team. Built with modern technologies and enterprise-grade architecture.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login with access & refresh tokens
- 🌍 **Multi-language Support** - English, Japanese (日本語), Vietnamese (Tiếng Việt)
- 👥 **Role-Based Access Control** - Admin, BrSE, Developer, QA, Customer roles
- 📊 **CR State Machine** - 10-state workflow management
- 💬 **Comment System** - Public, Internal, BrSE-only visibility levels
- 📎 **File Attachments** - Secure file upload with validation
- 💰 **Quotation Management** - BrSE-only quotation features
- 🔄 **Real-time Updates** - TanStack Query for optimistic updates

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod
- **File Upload**: Multer
- **i18n**: i18next
- **Logging**: Winston + Morgan

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Server State**: TanStack Query (React Query v5)
- **Client State**: Zustand
- **HTTP Client**: Axios
- **UI Library**: Ant Design
- **Form**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **i18n**: react-i18next

## 📁 Project Structure

```
change-request-management/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── entities/       # TypeORM entities
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Zod schemas
│   │   ├── locales/        # i18n translations (en/ja/vi)
│   │   └── migrations/     # Database migrations
│   └── package.json
│
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── providers/      # React providers
│   │   ├── layouts/        # Layout components
│   │   ├── routers/        # Route configuration
│   │   ├── pages/          # Page components
│   │   ├── modules/        # Feature modules
│   │   ├── components/     # Shared components
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Core utilities
│   │   └── locales/        # i18n translations (en/ja/vi)
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js v20.x or higher
- MySQL 8.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cr-management-system.git
   cd cr-management-system
   ```

2. **Install dependencies**
   ```bash
   # Automatic installation (Windows)
   .\install-all.bat
   
   # Or manual installation
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Setup environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your MySQL credentials
   
   # Frontend
   cd frontend
   cp .env.example .env
   ```

4. **Create database**
   ```sql
   CREATE DATABASE cr_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Run migrations**
   ```bash
   cd backend
   npm run migration:run
   ```

6. **Seed default users**
   ```bash
   cd backend
   npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts
   ```

7. **Start development servers**
   ```bash
   # Automatic (Windows)
   .\start-dev.bat
   
   # Or manual
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Default Accounts

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | admin@solashi.com    | Admin@123    |
| BrSE     | brse@solashi.com     | Brse@123     |
| Customer | customer@example.com | Customer@123 |

## 📚 Documentation

All documentation is consolidated in this README file for easy reference.

## 🏗️ Architecture

### Backend - Layered Architecture (5 layers)

```
Request → Router → Middleware → Controller → Service → Repository → Database
```

- **Router**: Define API endpoints
- **Middleware**: Authentication, validation, language detection
- **Controller**: Handle HTTP requests/responses
- **Service**: Business logic
- **Repository**: Database operations

### Frontend - Component-Based Architecture

```
Page → Module → Component → Hook → Service → API
```

- **Pages**: Thin components that compose modules
- **Modules**: Domain-specific feature components
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for business logic
- **Services**: API call functions
- **Store**: State management (Zustand + TanStack Query)

## 🔒 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Token revocation support
- ✅ Secure file upload validation
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ SQL injection prevention (TypeORM)
- ✅ XSS protection

## 🌍 Internationalization (i18n)

The application supports 3 languages:

- **English (en)** - Default
- **Japanese (ja)** - 日本語
- **Vietnamese (vi)** - Tiếng Việt

Language detection:
1. User selection (stored in localStorage)
2. Browser language
3. Falls back to English

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**SOLASHI Vietnam**
- Senior Full-Stack Architect
- Development Team

## 📞 Support

For support, email support@solashi.com or create an issue in this repository.

## 🙏 Acknowledgments

- React Team for React 18
- Vercel for Vite
- TanStack for React Query
- Ant Design Team
- TypeORM Team
- All open-source contributors

---

**Built with ❤️ by SOLASHI Vietnam for Japanese Clients**
