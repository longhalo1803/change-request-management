# CR Management Backend

Backend API cho hệ thống quản lý Change Request (CR).

## Tech Stack

- Node.js + TypeScript
- Express.js
- TypeORM + MySQL
- JWT Authentication
- Multer (File Upload)
- **i18next** (Internationalization - en/ja/vi)

## Project Structure

```
src/
├── config/          # Configuration files (database, env, i18n)
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Database access layer
├── entities/        # TypeORM entities
├── middlewares/     # Express middlewares (auth, language, error)
├── routes/          # API routes
├── utils/           # Utility functions (translator, logger, etc.)
├── types/           # TypeScript type definitions
├── validators/      # Zod validation schemas
├── locales/         # Translation files (en/ja/vi)
│   ├── en/
│   ├── ja/
│   └── vi/
├── migrations/      # Database migrations
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Setup

### Option 1: Docker (Recommended for Production)

```bash
# Quick start
cd backend
./docker-start.bat  # Windows
# or
./docker-start.sh   # Linux/Mac

# Manual setup
cp .env.docker .env
# Edit .env and change passwords/secrets
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Create database:
```sql
CREATE DATABASE cr_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Run migrations:
```bash
npm run migration:run
```

5. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migration:generate -- src/migrations/MigrationName` - Generate migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm test` - Run tests

## Internationalization (i18n)

The API supports 3 languages:
- **English (en)** - Default
- **Japanese (ja)**
- **Vietnamese (vi)**

### Language Detection

The API detects language from:
1. Query parameter: `?lang=ja`
2. `Accept-Language` header
3. Falls back to English

### Usage in Controllers

```typescript
import { t } from '@/utils/translator';

export const someController = asyncHandler(async (req, res) => {
  const message = t(req.language, 'auth.login_success');
  sendSuccess(res, data, message);
});
```

### Adding New Translations

1. Add keys to `src/locales/en/common.json`
2. Translate to `src/locales/ja/common.json`
3. Translate to `src/locales/vi/common.json`

## API Documentation

Base URL: `http://localhost:3000/api`

### Language Support

All endpoints support language via:
- Header: `Accept-Language: ja`
- Query: `?lang=ja`

### Authentication
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token

### Change Requests
- `GET /change-requests` - List CRs (paginated)
- `GET /change-requests/:id` - CR detail
- `POST /change-requests` - Create CR
- `PATCH /change-requests/:id/:action` - State transition

### Comments & Attachments
- `GET /change-requests/:id/comments` - Get comments
- `POST /change-requests/:id/comments` - Add comment
- `POST /change-requests/:id/attachments` - Upload attachment

### Users & Sprints
- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `GET /sprints` - List sprints
- `POST /sprints` - Create sprint

## Architecture Principles

### Layered Architecture (5 layers)
1. **Router** → Define routes
2. **Middleware** → Validation, auth, language detection, error handling
3. **Controller** → Handle requests, call services
4. **Service** → Business logic
5. **Repository** → Database operations

### SOLID Principles
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Many specific interfaces over one general
- **Dependency Inversion**: Depend on abstractions, not concretions
