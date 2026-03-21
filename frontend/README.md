# CR Management Frontend

Frontend application cho hệ thống quản lý Change Request (CR).

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- TanStack Query (React Query v5)
- Zustand (State Management)
- Ant Design (UI Components)
- Tailwind CSS
- Axios
- React Hook Form + Zod
- **react-i18next** (Internationalization - en/ja/vi)

## Project Structure

```
src/
├── providers/       # QueryClient, AuthProvider, Theme providers
├── layouts/         # MainLayout, AuthLayout, BlankLayout
├── routers/         # Route configuration, ProtectedRoute, RoleRoute
├── pages/           # Page components (thin, compose modules)
├── modules/         # Domain-specific views (change-requests/, auth/, users/, dashboard/)
├── components/      # Shared UI components (ui/, status/, upload/)
├── store/           # Zustand stores (auth.store.ts, ui.store.ts)
├── services/        # API service layer (cr.service.ts, auth.service.ts)
├── hooks/           # Custom React hooks (useAuth, useCrDetail, useCrTransition)
├── lib/             # Core utilities
│   ├── axios.ts     # Axios instance with interceptors
│   ├── query-client.ts
│   ├── types/       # TypeScript interfaces
│   ├── constants/   # Constants and enums
│   └── utils/       # Utility functions
└── main.tsx         # Application entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Key Features

### Authentication
- JWT-based authentication with access token (15m) and refresh token (7d)
- Automatic token refresh on 401 errors
- Protected routes based on user roles

### Change Request Management
- Create, view, update, and manage change requests
- State machine with 10 statuses
- Role-based visibility and actions
- Comments with visibility levels (public, internal, brse_only)
- File attachments with upload progress
- Quotation management (BRSE only)

### Role-Based Access Control
- Admin: Full access + user management
- BRSE: All CRs + internal comments + quotation management
- Developer/QA: All CRs + internal comments
- Customer: Own CRs + public comments only

## Architecture Patterns

### State Management
- **Server State**: TanStack Query for API data caching and synchronization
- **Client State**: Zustand for auth, UI state
- **Form State**: React Hook Form for form management

### API Layer
- Centralized Axios instance with interceptors
- Automatic token refresh flow
- Type-safe API responses with generics
- Consistent error handling

### Code Organization
- **Pages**: Thin components that compose modules
- **Modules**: Domain-specific feature components
- **Components**: Reusable UI components
- **Services**: API call functions
- **Hooks**: Custom React hooks for business logic

## Development Guidelines

- Use TypeScript strict mode (no `any`)
- Use enums/constants instead of hardcoded strings
- React Query keys must be structured arrays: `['cr', id]`, `['cr', 'list', filters]`
- Properly type Axios errors with `AxiosError<ApiErrorResponse>`
- Zustand stores should use selector functions


## Internationalization (i18n)

The application supports 3 languages:
- **English (en)** - Default
- **Japanese (ja)** - 日本語
- **Vietnamese (vi)** - Tiếng Việt

### Language Detection

Language is detected from:
1. User selection (stored in localStorage)
2. Browser language
3. Falls back to English

### Usage in Components

```tsx
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('app.title')}</h1>;
};
```

### Language Switcher

Use the `<LanguageSwitcher />` component in your layout:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

### Adding New Translations

1. Add keys to `src/locales/en/common.json`
2. Translate to `src/locales/ja/common.json`
3. Translate to `src/locales/vi/common.json`
4. TypeScript will auto-complete the keys

### Ant Design Locale

Ant Design components are automatically localized based on the selected language.

## SOLID Principles

All components and utilities follow SOLID principles:
- **Single Responsibility**: Each component/hook has one clear purpose
- **Open/Closed**: Easy to extend without modifying existing code
- **Liskov Substitution**: Components can be replaced with their variants
- **Interface Segregation**: Minimal, focused interfaces
- **Dependency Inversion**: Depend on abstractions (stores, hooks)
