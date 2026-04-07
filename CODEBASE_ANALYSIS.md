# Change Request Management System - Comprehensive Codebase Analysis

## Executive Summary

This is a full-stack Change Request Management system built with:
- **Backend**: Express.js + TypeORM + MySQL
- **Frontend**: React + TypeScript + Vite
- **Architecture**: Monorepo with clear separation of backend and frontend

The system uses TypeORM migrations for database schema management and has comprehensive fake data generators for development and testing.

---

## Part 1: FAKE DATA STRUCTURE

### 1.1 Backend Fake Data Location
**Folder**: `/backend/src/utils/` and `/backend/src/scripts/`

**Files**:
- `seed-users.ts` - Creates default test users
- `seed-test-data.ts` - Generates test change requests and related data

### 1.2 Frontend Fake Data Location
**Folder**: `/frontend/src/fake-data/`

**Structure**:
```
fake-data/
├── constants/
│   ├── names.ts          # Fixed user names pool
│   ├── projects.ts       # Project and issue type definitions
│   └── statuses.ts       # CR status labels and color mappings
├── generators/
│   ├── common.ts         # Common generation utilities
│   ├── user.generator.ts # Generate fixed users consistently
│   └── change-request.generator.ts
├── seeds/
│   ├── admin.seed.ts     # Admin dashboard mock data
│   ├── change-requests.seed.ts # 25 fixed change requests
│   ├── customer.seed.ts  # Customer view CRs
│   ├── permissions.seed.ts # Permission and user groups
│   ├── pm.seed.ts        # PM view CRs
│   └── users.seed.ts     # Fixed user definitions
└── index.ts              # Central export file
```

### 1.3 Root-Level Fake Data
**Location**: `/fake-data/`

**Files** (JSON response templates):
```
fake-data/
├── admin-dashboard/
│   └── dashboard-overview.json    # Mock admin dashboard stats
├── auth/
│   ├── customer-login-request.json
│   ├── customer-login-success-response.json
│   ├── customer-me-response.json
│   └── customer-refresh-success-response.json
└── customer-homepage/
    └── dashboard-overview.json    # Mock customer dashboard
```

---

## Part 2: DATA SEEDING & INITIALIZATION

### 2.1 Backend Seeding Strategy

#### User Seeding (`seed-users.ts`)
Creates 3 default users:
1. **Admin User**
   - Email: `admin@example.com`
   - Password: `Admin@123` (hashed)
   - Role: ADMIN
   - Full Name: System Administrator

2. **PM User**
   - Email: `pm@example.com`
   - Password: `PM@123` (hashed)
   - Role: PM
   - Full Name: Project Manager

3. **Customer User**
   - Email: `customer@example.com`
   - Password: `Customer@123` (hashed)
   - Role: CUSTOMER
   - Full Name: Test Customer

**Invocation**: 
```bash
ts-node -r tsconfig-paths/register src/utils/seed-users.ts
```

#### Test Data Seeding (`seed-test-data.ts`)
Creates comprehensive test data:

**Project Structure**:
- 1 Test Project (key: TEST)
- 2 Spaces (Backend Dev, Frontend Dev)
- 1 Sprint (7 days ago to 14 days in future)
- 14 Change Requests with full workflows

**Change Requests Details**:
Each CR includes:
- Title and description
- CR Key (TEST-1001 through TEST-1014)
- Status progression: DRAFT → SUBMITTED → IN_DISCUSSION → APPROVED → IN_PROGRESS → COMPLETED → CLOSED
- Priority: CRITICAL, HIGH, MEDIUM, LOW
- Work Type: BUG, FEATURE, IMPROVEMENT, DOCUMENTATION, TESTING
- Due Date (2-14 days from creation)
- Estimated Hours (4-20 hours)
- Creator & Assignee (all assigned to PM user)
- Full Status History with timestamps

**Invocation**:
```bash
ts-node -r tsconfig-paths/register src/utils/seed-test-data.ts
```

**Prerequisites**: Must run `seed-users.ts` first

### 2.2 Frontend Seeding Strategy

#### Fixed Users Seed (`users.seed.ts`)
Generates consistent users across reloads:

**Admin Users** (2 total):
- `admin-1`: First Admin
- `admin-2`: Second Admin

**PM Users** (4 total):
- `pm-1` through `pm-4`
- `pm-4` is marked INACTIVE

**Customer Users** (7 total):
- `customer-1` through `customer-7`

Each user includes:
- ID, first/last name
- Email (role-based pattern)
- Phone (fixed pattern)
- Role (ADMIN, PM, CUSTOMER)
- Status (ACTIVE or INACTIVE)
- Created Date
- Avatar (initials)

#### Fixed Change Requests Seed (`change-requests.seed.ts`)
**25 Total Change Requests** with distribution:

| Status | Count | Notes |
|--------|-------|-------|
| DRAFT | 3 | Only visible to creator |
| SUBMITTED | 5 | Submitted by customers |
| IN_DISCUSSION | 5 | Under review |
| APPROVED | 4 | Approved for work |
| REJECTED | 2 | Not approved |
| ONGOING | 4 | In progress |
| CLOSED | 2 | Completed |

Each CR includes:
- ID, title, description
- Status and priority
- Space ID (default-space)
- Created by customer info
- Created/Updated timestamps
- Empty attachments and comments arrays

#### Admin Dashboard Seed (`admin.seed.ts`)
Calculated metrics from fixed CRs:
- Status breakdown with percentages
- Process efficiency metrics
- User management stats
- Top 5 customers
- CR volume trends (6 months)
- Rejection rate, overdue count, cancellation rate

#### Dashboard Response Mock Data (`/fake-data/`)
Predefined response templates:
- Admin Dashboard Overview (105 lines of metrics)
- Customer Dashboard Overview (100 lines of activity data)
- Auth responses (login, refresh, me)

---

## Part 3: DATABASE SCHEMA

### 3.1 Complete Schema with Relationships

```
Database: change_request_db
Character Set: utf8mb4
Timezone: +07:00
```

### 3.2 Table Definitions

#### 1. `users` Table
```
Column          | Type      | Constraints
----------------|-----------|--------------------------------------------
id              | varchar   | PK, UUID, length 36
email           | varchar   | UNIQUE, NOT NULL, length 255, INDEXED
password        | varchar   | NOT NULL, hashed, length 255
full_name       | varchar   | NOT NULL, length 255
role            | enum      | NOT NULL, values: [ADMIN, PM, CUSTOMER]
is_active       | boolean   | NOT NULL, DEFAULT: true
last_login_at   | timestamp | NULLABLE
created_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
updated_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
```

**Indexes**: email (unique), role
**Relationships**: Owner of projects, creator/assignee of CRs, commenter, uploader

---

#### 2. `projects` Table
```
Column          | Type      | Constraints
----------------|-----------|--------------------------------------------
id              | varchar   | PK, UUID, length 36
name            | varchar   | NOT NULL, length 255, INDEXED
description     | text      | NULLABLE
project_key     | varchar   | UNIQUE, NOT NULL, length 50, INDEXED
owner_id        | varchar   | FK → users.id, RESTRICT on DELETE
is_active       | boolean   | NOT NULL, DEFAULT: true, INDEXED
created_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
updated_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
```

**Relationships**: 
- 1 Project has many Spaces (1:N)
- 1 Project has many Quotations (1:N)

---

#### 3. `spaces` Table
```
Column          | Type      | Constraints
----------------|-----------|--------------------------------------------
id              | varchar   | PK, UUID, length 36
name            | varchar   | NOT NULL, length 255
description     | text      | NULLABLE
project_id      | varchar   | FK → projects.id, CASCADE on DELETE, INDEXED
is_active       | boolean   | NOT NULL, DEFAULT: true
created_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
updated_at      | timestamp | NOT NULL, DEFAULT: CURRENT_TIMESTAMP
```

**Relationships**:
- Many Spaces belong to 1 Project (N:1)
- 1 Space has many SpaceAssignments (1:N)
- 1 Space has many Sprints (1:N)
- 1 Space has many ChangeRequests (1:N)

---

#### 4. `sprints` Table
```
Column          | Type      | Constraints
----------------|-----------|--------------------------------------------
id              | varchar   | PK, UUID, length 36
name            | varchar   | NOT NULL, length 255
description     | text      | NULLABLE
space_id        | varchar   | FK → spaces.id, CASCADE on DELETE, INDEXED
start_date      | date      | NOT NULL
end_date        | date      | NOT NULL
status          | varchar   | NOT NULL, DEFAULT: 'PLANNING', INDEXED
created_at      | timest
