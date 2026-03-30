# CR Management System Architecture

> Tai lieu tong hop kien truc muc tieu cho du an Change Request Management cua SOLASHI.
> Tai lieu nay duoc viet dua tren codebase hien tai va scope can mo rong trong giai doan tiep theo, dac biet la admin flow.

---

## 1. Tong Quan Du An

### 1.1. Muc Tieu San Pham

He thong nay giai quyet bai toan quan ly Change Request giua:
- Customer
- Admin
- BrSE / PM
- Developer / QA

He thong phai ho tro:
- Xac thuc va phan quyen theo role
- Quan ly danh sach CR
- Chi tiet CR va lich su xu ly
- Dashboard theo actor
- Quan ly user va permissions cho admin
- Da ngon ngu: English, Japanese, Vietnamese

### 1.2. Pham Vi Hien Tai

Codebase hien co:
- Frontend React + TypeScript + Vite
- Backend Express + TypeScript + TypeORM
- Auth flow co san
- i18n da co cho frontend va backend
- Customer pages dang o giai doan scaffold
- Admin flow moi o muc design va chua duoc code day du

### 1.3. Muc Tieu Kien Truc

Kien truc can dat duoc:
- De mo rong khi them actor va module moi
- Tach ro UI shell theo role
- Tach ro client state va server state
- De thay mock data bang API that
- De viet test cho auth, permission, list/detail va forms
- Giu code don gian, tranh over-engineering o giai doan hien tai

---

## 2. Tech Stack Chuan

### 2.1. Frontend

- React 18
- TypeScript
- Vite
- React Router v6
- TanStack Query v5
- Zustand
- Ant Design
- Tailwind CSS
- Axios
- React Hook Form + Zod
- react-i18next

### 2.2. Backend

- Node.js + TypeScript
- Express.js
- TypeORM
- MySQL
- JWT access token + refresh token
- Zod validation
- i18next

### 2.3. Nguyen Tac Su Dung Stack

- Ant Design la UI framework chinh, khong them them MUI hoac 1 UI system lon nua
- Tailwind chi dung de bo tro spacing, layout, utility classes
- Zustand chi dung cho global client state nho
- TanStack Query la noi duy nhat luu server state o frontend
- Zod la schema validation chuan cho input va API contracts o ca frontend va backend

---

## 3. Kien Truc Tong The

### 3.1. Kien Truc He Thong

He thong duoc chia thanh 2 khoi lon:

1. Frontend SPA
2. Backend REST API

Frontend:
- Hien thi giao dien theo role
- Quan ly route, layout, form, list, table, dashboard
- Goi API thong qua service layer
- Luu auth session o client

Backend:
- Xac thuc, phan quyen
- Xu ly business rules
- Truy cap database thong qua repository
- Tra response thong nhat va co i18n message

### 3.2. Luong Du Lieu Tong Quan

```text
User Action
  -> Page
  -> Module
  -> Hook
  -> Service
  -> Axios Client
  -> Backend Route
  -> Controller
  -> Service
  -> Repository
  -> Database
```

### 3.3. Nguyen Tac Phan Tang

Frontend:
- `pages`: route entry, cuc mong
- `modules`: feature-level UI va orchestration
- `components`: shared UI co the tai su dung
- `hooks`: business logic phia client
- `services`: API calls
- `store`: auth, language, session-level state
- `lib`: types, constants, axios, query client, utils

Backend:
- `routes`: dinh nghia endpoint
- `middlewares`: auth, language, error handling
- `controllers`: xu ly request/response
- `services`: business logic
- `repositories`: truy van du lieu
- `entities`: database mapping
- `validators`: Zod schema

---

## 4. Actor-Based Architecture

### 4.1. Actor Trong He Thong

- `admin`
- `customer`
- `PM`

### 4.2. Nguyen Tac Quan Trong

Khong dung chung mot shell UI cho tat ca actor.

Ly do:
- Menu khac nhau
- Dashboard khac nhau
- Action khac nhau
- Permission khac nhau
- UX cua admin va customer khac nhau ro ret

### 4.3. UI Shell Muc Tieu

Can co it nhat:

- `CustomerLayout`
- `AdminLayout`

Co the mo rong sau:
- `BrseLayout`

### 4.4. Route Prefix Theo Actor

Muc tieu route:

```text
/login
/dashboard                      -> customer dashboard
/change-requests
/change-requests/:id

/admin/dashboard
/admin/change-requests
/admin/change-requests/:id
/admin/permissions
```

Neu sau nay BrSE can shell rieng:

```text
/brse/dashboard
/brse/change-requests
/brse/quotation
```

### 4.5. Redirect Theo Role

Sau login:
- admin -> `/admin/dashboard`
- customer -> `/dashboard`
- brse -> route phu hop voi BrSE shell
- developer / qa -> route duoc dinh nghia sau

Khong redirect cung mot diem den cho moi role.

---

## 5. Frontend Architecture

### 5.1. Cau Truc Thu Muc Muc Tieu

```text
frontend/src/
  pages/
    auth/
    customer/
    admin/
  modules/
    auth/
    customer-dashboard/
    admin-dashboard/
    cr-list/
    cr-detail/
    permissions/
  components/
    shared/
    admin/
    customer/
  hooks/
    auth/
    admin/
    customer/
  services/
  layouts/
  routers/
  store/
  lib/
    axios.ts
    query-client.ts
    constants/
    types/
    utils/
  providers/
  locales/
```

### 5.2. Rule To Chuc Code

`pages`
- Chi dung de map route -> module/layout
- Khong chua query logic lon

`modules`
- Chua UI va orchestration theo use case
- Vi du: `admin-dashboard`, `permissions`, `cr-list`

`components/shared`
- Button, table wrapper, badge, modal shell, empty state, loading state

`components/admin`
- Thanh phan co mau sac, navigation va interaction dac thu admin

`hooks`
- Goi query/mutation
- Mapping data cho UI
- Xu ly filter state, URL state, modal state neu can

`services`
- Goi API thuan
- Khong hien thi message UI o service

`lib/types`
- Khong nhom tat ca vao 1 file duy nhat
- Tach theo domain

### 5.3. Khong Nen Dung

- HOC cho data fetching o page detail
- Store server data vao Zustand
- 1 layout dung chung cho moi role
- 1 file type qua lon chua tat ca domain interfaces
- Component vua fetch data vua render table lon va vua quan ly filter

---

## 6. Frontend Routing Strategy

### 6.1. Nguyen Tac

- Public routes tach rieng
- Protected routes theo auth
- Role-based routes theo `allowedRoles`
- Layout duoc dat o route tree, khong if/else trong tung page

### 6.2. Route Tree Muc Tieu

```text
/
  /login

  Customer Protected
    MainLayout / CustomerLayout
      /dashboard
      /change-requests
      /change-requests/create
      /change-requests/:id

  Admin Protected
    AdminLayout
      /admin/dashboard
      /admin/change-requests
      /admin/change-requests/:id
      /admin/permissions
```

### 6.3. Unauthorized Handling

Can co:
- `/unauthorized`
- fallback route ro rang

### 6.4. Route Guard Levels

Can co 2 lop:

1. Authentication guard
2. Role / permission guard

Role guard:
- Dung cho shell va page cap lon

Permission guard:
- Dung cho action button, tab, modal, table action

---

## 7. Frontend State Management

### 7.1. Phan Loai State

`Zustand`
- user
- accessToken
- refreshToken
- isAuthenticated
- language preference
- co the them UI preferences nho

`TanStack Query`
- dashboard data
- list data
- detail data
- comments
- permissions
- users
- sprints

`useState`
- modal open/close
- local tab
- temporary UI states

`React Hook Form`
- form state

### 7.2. Nguyen Tac

- Khong luu table list tu API vao store global
- Khong duplicate state giua Query va Zustand
- URL la source of truth cho filter list quan trong

### 7.3. URL State

Ap dung cho:
- admin CR list
- customer CR list
- permissions list

Query params nen gom:
- `page`
- `pageSize`
- `search`
- `status`
- `customerId`
- `pmId`
- `dateFrom`
- `dateTo`

---

## 8. Frontend Data Layer

### 8.1. Axios Client

Can co 1 `axiosInstance` duy nhat:
- attach access token
- handle 401
- refresh token
- logout neu refresh fail

### 8.2. Service Layer

Service layer la noi duy nhat goi API.

Vi du:
- `auth.service.ts`
- `cr.service.ts`
- `admin-dashboard.service.ts`
- `admin-user.service.ts`

### 8.3. Hook Layer

Hook layer wrap service:
- `useAdminDashboardQuery`
- `useAdminCrListQuery`
- `useAdminCrDetailQuery`
- `useAdminUsersQuery`
- `useCreateAdminUserMutation`

### 8.4. Query Key Convention

Nen thong nhat:

```text
['auth', 'me']
['cr', 'list', filters]
['cr', 'detail', id]
['admin', 'dashboard', filters]
['admin', 'users', filters]
['admin', 'permissions', filters]
```

Khong dung key ngau nhien hoac string don le.

### 8.5. Mock Data Strategy

Trong giai doan frontend di truoc backend:
- service co the tra mock data
- shape cua mock phai giong API that
- khong viet UI phu thuoc truc tiep vao file json raw

Nen co 2 muc:
- mock payload
- mapper sang UI model neu can

---

## 9. Frontend Domain Modules

### 9.1. Auth Module

Trach nhiem:
- login
- logout
- token refresh
- fetch current user
- role-based redirect

Can bo sung:
- role-aware redirect
- restore user session khi reload
- mock `getCurrentUser()` dung theo user dang login

### 9.2. Customer Dashboard Module

Trach nhiem:
- KPI cards
- status overview
- recent activity

Status:
- dang scaffold
- can thay mock data bang query layer sau

### 9.3. Admin Dashboard Module

Trach nhiem:
- global filters
- status overview
- process efficiency
- user management summary
- top customers
- CR volume trends
- export PDF

Thanh phan de xuat:
- `DashboardFilters`
- `StatusOverviewCard`
- `ProcessEfficiencyCard`
- `UserManagementCard`
- `TopCustomersCard`
- `PriorityTrendChart`

### 9.4. CR List Module

Trach nhiem:
- filter
- search
- pagination
- sorting
- row click -> detail

Can tai su dung cho:
- customer list
- admin list

Nhung presentation va column co the khac nhau theo actor.

### 9.5. CR Detail Module

Trach nhiem:
- thong tin tong quan
- mo ta
- attributes
- activity log
- comments
- attachments
- status transitions

Khuyen nghi:
- page route la source chinh
- modal/detail drawer chi la enhancement sau

### 9.6. Permissions Module

Trach nhiem:
- danh sach user
- search user
- tab account / role groups
- add account modal
- activate / deactivate
- assign role

Can tach thanh:
- `AccountsTable`
- `RoleGroupsTable`
- `CreateAccountModal`
- `PermissionsTabs`

---

## 10. UI/UX Architecture

### 10.1. Design System Huong Toi

Khong can build design system qua lon o giai doan hien tai.
Can 1 bo reusable components vua du:

- `PageSection`
- `FilterBar`
- `StatCard`
- `StatusBadge`
- `DataTable`
- `EmptyState`
- `ErrorState`
- `LoadingBlock`
- `ConfirmDialog`

### 10.2. Admin Shell

Can co:
- sidebar rieng
- top header rieng
- global search
- notification
- language switcher
- user dropdown

### 10.3. Responsive Priority

Uu tien:
1. Desktop
2. Laptop
3. Tablet
4. Mobile chi can ho tro muc co ban cho admin

Ly do:
- dashboard admin va bang du lieu rat rong

### 10.4. Charts

Nen dung thu vien chart duy nhat, uu tien `recharts`.

Khong nen:
- ve chart bang div custom
- dung nhieu chart libs

---

## 11. Form Handling Strategy

### 11.1. Chuan Form

Moi form nghiep vu dung:
- React Hook Form
- Zod resolver

### 11.2. Vi Tri Schema

Schema dat gan module:

```text
modules/permissions/schemas/createAccount.schema.ts
modules/cr-detail/schemas/comment.schema.ts
```

Hoac dat trong:

```text
lib/validators/
```

Neu can tai su dung cao.

### 11.3. Nguyen Tac

- Validate o frontend de UX tot
- Validate lai o backend de an toan
- Message loi phai map duoc cho i18n neu can

### 11.4. Form Quan Trong Trong Scope

- Login form
- Create account form
- Update user status / role
- Create CR form
- Add comment form

---

## 12. Backend Architecture

### 12.1. Layered Architecture

Backend se giu 5 tang:

1. Route
2. Middleware
3. Controller
4. Service
5. Repository

### 12.2. Nguyen Tac Moi Tang

`routes`
- khai bao endpoint
- gan auth middleware
- gan role middleware neu can

`middlewares`
- auth
- authorize
- language
- error handling

`controllers`
- parse request
- goi validator
- goi service
- tra response

`services`
- business rules
- permission logic cap domain
- orchestrate repositories

`repositories`
- truy van database
- khong chua business rules

### 12.3. Tinh Trang Hien Tai

Hien backend moi co auth route dang hoat dong.
Nhung route con lai trong README la muc tieu, chua duoc register day du.

Can bo sung lan luot:
- `/change-requests`
- `/users`
- `/permissions`
- `/sprints`
- `/dashboard/admin`

---

## 13. Authentication and Authorization

### 13.1. Authentication Flow

Login flow:

```text
Login Form
  -> POST /auth/login
  -> receive accessToken + refreshToken + user
  -> save session
  -> redirect theo role
```

Reload flow:

```text
App bootstrap
  -> doc token
  -> fetch /auth/me neu can
  -> restore user
  -> render dung layout theo role
```

### 13.2. Token Strategy

- access token: ngan han
- refresh token: dai hon
- frontend tu dong refresh token khi 401
- neu refresh fail -> logout

### 13.3. Role Strategy

Cap 1: role lon
- admin
- customer
- brse
- developer
- qa

Cap 2: permission action
- `user:create`
- `user:update`
- `permission:view`
- `cr:read_all`
- `cr:export`

### 13.4. Khuyen Nghi

Hien tai frontend dang check theo role.
Ve trung han, nen bo sung permission-level checks de support:
- admin toan quyen
- PM chi xem nhom cua minh
- mot so actor duoc view nhung khong duoc mutate

### 13.5. Permission Check 2 Lop

Frontend:
- an/hien button, tab, menu

Backend:
- la noi quyet dinh cuoi cung

Khong duoc tin frontend permission check de bao ve du lieu.

---

## 14. API Design

### 14.1. Nguyen Tac

- RESTful
- noun-based endpoints
- status code ro rang
- pagination thong nhat
- response envelope thong nhat

### 14.2. Response Shape

Thanh cong:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Loi:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### 14.3. Pagination Shape

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 248,
    "totalPages": 25
  }
}
```

### 14.4. Endpoint Muc Tieu

Auth:
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

CR:
- `GET /change-requests`
- `GET /change-requests/:id`
- `POST /change-requests`
- `PATCH /change-requests/:id`
- `PATCH /change-requests/:id/status`

Admin dashboard:
- `GET /admin/dashboard`
- `GET /admin/dashboard/export`

Users / permissions:
- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `PATCH /users/:id/status`
- `GET /roles`
- `PATCH /users/:id/role`

Sprints:
- `GET /sprints`

### 14.5. Filter Contract

Admin CR list va users list nen support:
- `page`
- `pageSize`
- `search`
- `status`
- `customerId`
- `pmId`
- `role`
- `isActive`
- `dateFrom`
- `dateTo`

---

## 15. Database and Domain Modeling

### 15.1. Core Entities

Da co:
- `User`
- `RefreshToken`

Can co trong cac phase tiep theo:
- `ChangeRequest`
- `ChangeRequestComment`
- `ChangeRequestAttachment`
- `ChangeRequestStatusHistory`
- `Sprint`
- `Role`
- `Permission`
- `UserRoleMapping` neu can mo rong hon enum role

### 15.2. Role Modeling

Gan han:
- co the giu enum role trong `users`

Trung han:
- neu can permission matrix linh hoat, nen tach:
  - `roles`
  - `permissions`
  - `role_permissions`
  - `user_roles`

### 15.3. Status Modeling

CR status can duoc quan ly bang:
- enum o frontend
- enum / constant o backend
- state transition rules o service layer

Khong nen de frontend tu y doi status ma khong qua service rules.

---

## 16. i18n Architecture

### 16.1. Frontend

Da co:
- `en`
- `ja`
- `vi`

Can tiep tuc theo namespace:
- `common`
- `auth`
- `dashboard`
- `admin`
- `cr`
- `permissions`

### 16.2. Backend

Backend tra message da duoc dich thong qua key.

### 16.3. Nguyen Tac

- text UI khong hardcode
- validation message quan trong nen co key
- menu label, status label, button label deu lay tu i18n

---

## 17. Testing Strategy

### 17.1. Frontend Can Co

Uu tien:
- auth redirect tests
- protected route tests
- filter serialization tests
- modal form validation tests
- table rendering tests

### 17.2. Backend Can Co

Uu tien:
- auth service tests
- auth middleware tests
- role authorization tests
- user creation validation tests
- CR transition business rule tests

### 17.3. Muc Tieu

Khong can theo testing architecture qua nang ngay lap tuc.
Nhung bat buoc phai co test cho:
- auth
- role guard
- admin account creation
- permission-sensitive actions

---

## 18. Security Requirements

### 18.1. Bat Buoc

- khong hardcode secrets
- validation o moi input quan trong
- password hashing
- token verification
- backend authorize check
- khong trust role tu client ma khong verify token

### 18.2. Admin-Specific

- chi admin moi duoc truy cap permissions module
- export PDF phai qua auth check
- create account phai validate role duoc gan
- status activate/deactivate phai audit duoc sau nay

### 18.3. Lau Dai

Nen bo sung:
- audit log
- rate limit cho login
- CSRF strategy neu doi auth model
- file upload validation khi bat dau lam attachment

---

## 19. Performance and Scalability

### 19.1. Frontend

- lazy load routes
- query caching
- debounced search
- pagination cho table lon
- khong render chart khi data chua san sang

### 19.2. Backend

- pagination o list endpoint
- filter co index hop ly
- select dung cot can thiet
- tach summary query cho dashboard neu can

### 19.3. Admin Dashboard

Khong nen goi nhieu endpoint nho neu co the gom summary.
Dashboard admin nen co 1 endpoint tong hop chinh de tranh waterfall requests.

---

## 20. Development Roadmap

### Phase 1: Nen Tang Admin

- Them `AdminLayout`
- Them admin routes
- Sua redirect login theo role
- Sua restore current user dung role
- Scaffold admin pages

### Phase 2: Admin Dashboard

- Filter bar
- KPI cards
- charts
- top customers
- export action

### Phase 3: Admin CR List and Detail

- filter + table + pagination
- detail page
- comments/activity log

### Phase 4: Permissions

- accounts tab
- add account modal
- activate/deactivate
- role assignment

### Phase 5: Backend Expansion

- CR routes
- users routes
- admin dashboard routes
- permissions routes

### Phase 6: Hardening

- tests
- better error states
- audit log
- performance tuning

---

## 21. File-Level Recommendations for Current Repo

### 21.1. Frontend Files Nen Tao Them

```text
frontend/src/layouts/AdminLayout.tsx
frontend/src/pages/admin/AdminDashboardPage.tsx
frontend/src/pages/admin/AdminCrListPage.tsx
frontend/src/pages/admin/AdminCrDetailPage.tsx
frontend/src/pages/admin/AdminPermissionsPage.tsx

frontend/src/components/admin/AdminSidebar.tsx
frontend/src/components/admin/AdminHeader.tsx

frontend/src/modules/admin-dashboard/*
frontend/src/modules/admin-permissions/*

frontend/src/hooks/admin/*
frontend/src/services/admin-dashboard.service.ts
frontend/src/services/admin-user.service.ts
frontend/src/lib/types/admin-dashboard.types.ts
frontend/src/lib/types/admin-user.types.ts
```

### 21.2. Frontend Files Can Chinh

- `frontend/src/routers/index.tsx`
- `frontend/src/hooks/useLogin.ts`
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/services/auth.service.mock.ts`
- `frontend/src/components/Sidebar.tsx`

### 21.3. Backend Files Nen Tao Them

```text
backend/src/routes/change-request.routes.ts
backend/src/routes/user.routes.ts
backend/src/routes/admin.routes.ts

backend/src/controllers/change-request.controller.ts
backend/src/controllers/user.controller.ts
backend/src/controllers/admin-dashboard.controller.ts

backend/src/services/change-request.service.ts
backend/src/services/user.service.ts
backend/src/services/admin-dashboard.service.ts

backend/src/repositories/change-request.repository.ts
backend/src/repositories/user.repository.ts
```

---

## 22. Architecture Rules Bat Buoc

1. Khong tao them UI framework lon ngoai Ant Design cho phase hien tai.
2. Khong dua server state vao Zustand.
3. Khong de role-based navigation hardcode trong 1 sidebar duy nhat cho moi actor.
4. Moi list lon phai co filter + pagination + loading + empty + error state.
5. Moi form quan trong phai co Zod schema.
6. Redirect sau login phai theo role.
7. Permission check phai co o backend, frontend chi la bo tro UX.
8. Route list cua admin phai tach namespace `/admin`.
9. Types phai tach theo domain, khong don tat ca vao 1 file lon.
10. Page component phai mong; logic nam o hooks va modules.

---

## 23. Ket Luan

Huong kien truc phu hop cho du an nay la:
- feature-based organization vua du
- actor-based shell va route tree
- Zustand cho auth/session
- TanStack Query cho data fetching
- service layer ro rang
- backend layered architecture
- RBAC + permission checks theo 2 lop

Du an hien dang co nen tang tot cho auth va i18n, nhung can bo sung ro net phan admin architecture de tranh viec customer flow va admin flow bi tron lan khi code tiep.

Tai lieu nay la kien truc muc tieu de ca team dua vao khi mo rong codebase trong cac phase tiep theo.

---

_Last updated: 2026-03-30_
