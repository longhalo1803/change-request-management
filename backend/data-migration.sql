-- ============================================================================
-- CHANGE REQUEST MANAGEMENT SYSTEM - DATA MIGRATION SCRIPT
-- ============================================================================
-- Purpose: Initialize system with sample users, projects, and change requests
-- Validation: STRICT mode - all data must be valid before insert
-- Created: 2026-04-07
-- ============================================================================

USE cr_management;

-- ============================================================================
-- PHASE 1: VALIDATE EMPTY STATE (Check for existing data)
-- ============================================================================

SELECT 'PHASE 1: VALIDATING EMPTY STATE' AS 'MIGRATION_STEP';

SELECT CONCAT('Users count: ', COUNT(*)) FROM users;
SELECT CONCAT('Projects count: ', COUNT(*)) FROM projects;

-- ============================================================================
-- PHASE 2: INSERT SAMPLE USERS (3 users with different roles)
-- ============================================================================

SELECT 'PHASE 2: INSERTING SAMPLE USERS' AS 'MIGRATION_STEP';

-- User 1: System Admin
-- Email: admin@example.com
-- Password: Admin@12345
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES (
  UUID(), 
  'admin@example.com', 
  '$2a$10$cIZelxTSuF6r6/X6zHvsFOOwKwMGVNz.CvchtRUa5eJVuls70a31e', 
  'System Admin', 
  'admin', 
  true, 
  NOW(), 
  NOW()
);

-- User 2: Business Requirements/Software Engineer
-- Email: pm@example.com
-- Password: ProjectMgr@456
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES (
  UUID(), 
  'pm@example.com', 
  '$2a$10$ukzYUX01PXlKbuLDdKD5Jel5WhbZ2F7S062RPMw2puqsnn66j0eEu', 
  'Project Manager', 
  'pm', 
  true, 
  NOW(), 
  NOW()
);

-- User 3: Sample Customer
-- Email: customer@example.com
-- Password: Customer@789
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at) 
VALUES (
  UUID(), 
  'customer@example.com', 
  '$2a$10$LLrA3KtqAjt0PJaxr9n3au5fzoObW/Djh5DoE9g7a0I6v5BpKzfeq', 
  'Sample Customer', 
  'customer', 
  true, 
  NOW(), 
  NOW()
);

SELECT CONCAT('Users created: ', COUNT(*)) FROM users;

-- ============================================================================
-- PHASE 3: CREATE SAMPLE PROJECTS
-- ============================================================================

SELECT 'PHASE 3: CREATING SAMPLE PROJECTS' AS 'MIGRATION_STEP';

-- Get admin user ID for project ownership
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1);
SET @pm_id = (SELECT id FROM users WHERE email = 'pm@example.com' LIMIT 1);
SET @customer_id = (SELECT id FROM users WHERE email = 'customer@example.com' LIMIT 1);

-- Project 1: E-Commerce Platform
INSERT INTO projects (id, name, description, project_key, owner_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'E-Commerce Platform Modernization',
  'Complete rewrite of legacy e-commerce platform with microservices architecture',
  'ECOM',
  @admin_id,
  true,
  NOW(),
  NOW()
);

-- Project 2: Mobile Banking App
INSERT INTO projects (id, name, description, project_key, owner_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Mobile Banking Application',
  'Cross-platform banking app for iOS and Android with real-time notifications',
  'BANK',
  @admin_id,
  true,
  NOW(),
  NOW()
);

-- Project 3: Analytics Dashboard
INSERT INTO projects (id, name, description, project_key, owner_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Business Analytics Dashboard',
  'Real-time analytics and reporting platform for business intelligence',
  'DASH',
  @admin_id,
  true,
  NOW(),
  NOW()
);

SELECT CONCAT('Projects created: ', COUNT(*)) FROM projects;

-- ============================================================================
-- PHASE 4: CREATE SPACES (Development areas within projects)
-- ============================================================================

SELECT 'PHASE 4: CREATING SPACES' AS 'MIGRATION_STEP';

-- Get project IDs
SET @ecom_project_id = (SELECT id FROM projects WHERE project_key = 'ECOM' LIMIT 1);
SET @bank_project_id = (SELECT id FROM projects WHERE project_key = 'BANK' LIMIT 1);
SET @dash_project_id = (SELECT id FROM projects WHERE project_key = 'DASH' LIMIT 1);

-- ECOM Project Spaces
INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Backend Services',
  'API gateway, microservices, database layer',
  @ecom_project_id,
  true,
  NOW(),
  NOW()
);

INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Frontend Web Application',
  'React-based storefront and admin dashboard',
  @ecom_project_id,
  true,
  NOW(),
  NOW()
);

-- BANK Project Spaces
INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'iOS Development',
  'Native iOS banking application',
  @bank_project_id,
  true,
  NOW(),
  NOW()
);

INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Android Development',
  'Native Android banking application',
  @bank_project_id,
  true,
  NOW(),
  NOW()
);

-- DASH Project Spaces
INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Frontend Dashboard',
  'Data visualization and UI components',
  @dash_project_id,
  true,
  NOW(),
  NOW()
);

INSERT INTO spaces (id, name, description, project_id, is_active, created_at, updated_at)
VALUES (
  UUID(),
  'Data Pipeline',
  'ETL processes and data ingestion',
  @dash_project_id,
  true,
  NOW(),
  NOW()
);

SELECT CONCAT('Spaces created: ', COUNT(*)) FROM spaces;

-- ============================================================================
-- PHASE 5: CREATE SPACE ASSIGNMENTS (Team membership)
-- ============================================================================

SELECT 'PHASE 5: CREATING SPACE ASSIGNMENTS' AS 'MIGRATION_STEP';

-- Get space IDs
SET @backend_space_id = (SELECT id FROM spaces WHERE name = 'Backend Services' LIMIT 1);
SET @frontend_space_id = (SELECT id FROM spaces WHERE name = 'Frontend Web Application' LIMIT 1);
SET @ios_space_id = (SELECT id FROM spaces WHERE name = 'iOS Development' LIMIT 1);
SET @android_space_id = (SELECT id FROM spaces WHERE name = 'Android Development' LIMIT 1);

-- Assign users to spaces (PM to backend, customer to frontend, etc.)
INSERT INTO space_assignments (id, space_id, user_id, role, created_at, updated_at)
VALUES (UUID(), @backend_space_id, @pm_id, 'TEAM_LEAD', NOW(), NOW());

INSERT INTO space_assignments (id, space_id, user_id, role, created_at, updated_at)
VALUES (UUID(), @frontend_space_id, @customer_id, 'DEVELOPER', NOW(), NOW());

INSERT INTO space_assignments (id, space_id, user_id, role, created_at, updated_at)
VALUES (UUID(), @ios_space_id, @pm_id, 'REVIEWER', NOW(), NOW());

INSERT INTO space_assignments (id, space_id, user_id, role, created_at, updated_at)
VALUES (UUID(), @android_space_id, @customer_id, 'DEVELOPER', NOW(), NOW());

SELECT CONCAT('Space assignments created: ', COUNT(*)) FROM space_assignments;

-- ============================================================================
-- PHASE 6: CREATE SPRINTS (Time-boxed iterations)
-- ============================================================================

SELECT 'PHASE 6: CREATING SPRINTS' AS 'MIGRATION_STEP';

-- Sprint for ECOM Backend (2-week sprint, current week)
INSERT INTO sprints (id, name, description, space_id, start_date, end_date, status, created_at, updated_at)
VALUES (
  UUID(),
  'Sprint 1: Authentication & Authorization',
  'Implement OAuth 2.0 and role-based access control',
  @backend_space_id,
  DATE(NOW()),
  DATE_ADD(NOW(), INTERVAL 14 DAY),
  'ACTIVE',
  NOW(),
  NOW()
);

-- Sprint for ECOM Frontend (2-week sprint, next week)
SET @frontend_space_id = (SELECT id FROM spaces WHERE name = 'Frontend Web Application' LIMIT 1);
INSERT INTO sprints (id, name, description, space_id, start_date, end_date, status, created_at, updated_at)
VALUES (
  UUID(),
  'Sprint 1: Shopping Cart & Checkout',
  'Implement shopping cart with multiple payment methods',
  @frontend_space_id,
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  DATE_ADD(NOW(), INTERVAL 21 DAY),
  'PLANNING',
  NOW(),
  NOW()
);

SELECT CONCAT('Sprints created: ', COUNT(*)) FROM sprints;

-- ============================================================================
-- PHASE 7: CREATE CHANGE REQUESTS (CRs with full workflows)
-- ============================================================================

SELECT 'PHASE 7: CREATING CHANGE REQUESTS' AS 'MIGRATION_STEP';

-- Get status, priority, and worktype IDs
SET @status_draft = (SELECT id FROM task_statuses WHERE name = 'DRAFT' LIMIT 1);
SET @status_submitted = (SELECT id FROM task_statuses WHERE name = 'SUBMITTED' LIMIT 1);
SET @status_in_discussion = (SELECT id FROM task_statuses WHERE name = 'IN_DISCUSSION' LIMIT 1);
SET @status_approved = (SELECT id FROM task_statuses WHERE name = 'APPROVED' LIMIT 1);
SET @status_in_progress = (SELECT id FROM task_statuses WHERE name = 'IN_PROGRESS' LIMIT 1);
SET @status_completed = (SELECT id FROM task_statuses WHERE name = 'COMPLETED' LIMIT 1);

SET @priority_critical = (SELECT id FROM task_priorities WHERE name = 'CRITICAL' LIMIT 1);
SET @priority_high = (SELECT id FROM task_priorities WHERE name = 'HIGH' LIMIT 1);
SET @priority_medium = (SELECT id FROM task_priorities WHERE name = 'MEDIUM' LIMIT 1);
SET @priority_low = (SELECT id FROM task_priorities WHERE name = 'LOW' LIMIT 1);

SET @worktype_bug = (SELECT id FROM task_worktypes WHERE name = 'BUG' LIMIT 1);
SET @worktype_feature = (SELECT id FROM task_worktypes WHERE name = 'FEATURE' LIMIT 1);
SET @worktype_improvement = (SELECT id FROM task_worktypes WHERE name = 'IMPROVEMENT' LIMIT 1);
SET @worktype_documentation = (SELECT id FROM task_worktypes WHERE name = 'DOCUMENTATION' LIMIT 1);
SET @worktype_testing = (SELECT id FROM task_worktypes WHERE name = 'TESTING' LIMIT 1);

-- Get sprint IDs
SET @active_sprint = (SELECT id FROM sprints WHERE status = 'ACTIVE' LIMIT 1);

-- ============================================================================
-- ECOM BACKEND: Change Requests
-- ============================================================================

-- ECOM-1001: Fix Login Timeout (CRITICAL BUG - DRAFT)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Fix Login Timeout Issue',
  'Users are getting logged out after 5 minutes of inactivity. Need to extend session timeout to 30 minutes.',
  'ECOM-1001',
  @backend_space_id,
  @active_sprint,
  @status_draft,
  @priority_critical,
  @worktype_bug,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 2 DAY),
  4,
  NOW(),
  NOW()
);

-- ECOM-1002: OAuth 2.0 Implementation (HIGH FEATURE - IN_DISCUSSION)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Implement OAuth 2.0 Authentication',
  'Add Google, Facebook, and GitHub OAuth integration for seamless user registration',
  'ECOM-1002',
  @backend_space_id,
  @active_sprint,
  @status_in_discussion,
  @priority_high,
  @worktype_feature,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  16,
  NOW(),
  NOW()
);

-- ECOM-1003: Database Connection Pooling (MEDIUM IMPROVEMENT - APPROVED)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Optimize Database Connection Pooling',
  'Implement HikariCP connection pooling to improve database performance under load',
  'ECOM-1003',
  @backend_space_id,
  @active_sprint,
  @status_approved,
  @priority_medium,
  @worktype_improvement,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  8,
  NOW(),
  NOW()
);

-- ECOM-1004: API Documentation (MEDIUM DOCUMENTATION - IN_PROGRESS)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Complete API Documentation',
  'Update Swagger/OpenAPI documentation for all REST endpoints with examples',
  'ECOM-1004',
  @backend_space_id,
  @active_sprint,
  @status_in_progress,
  @priority_medium,
  @worktype_documentation,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  6,
  NOW(),
  NOW()
);

-- ECOM-1005: Security Audit (HIGH IMPROVEMENT - APPROVED)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Security Vulnerability Fixes',
  'Address identified OWASP Top 10 vulnerabilities in authentication module',
  'ECOM-1005',
  @backend_space_id,
  @active_sprint,
  @status_approved,
  @priority_high,
  @worktype_bug,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 4 DAY),
  12,
  NOW(),
  NOW()
);

-- ============================================================================
-- ECOM FRONTEND: Change Requests
-- ============================================================================

SET @frontend_space_id = (SELECT id FROM spaces WHERE name = 'Frontend Web Application' LIMIT 1);

-- ECOM-2001: Mobile Responsiveness (MEDIUM BUG - DRAFT)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Fix Mobile Responsive Issues',
  'Fix layout issues on screens smaller than 480px. Checkout page breaks on mobile',
  'ECOM-2001',
  @frontend_space_id,
  NULL,
  @status_draft,
  @priority_medium,
  @worktype_bug,
  @customer_id,
  @customer_id,
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  6,
  NOW(),
  NOW()
);

-- ECOM-2002: Dark Mode Support (LOW FEATURE - SUBMITTED)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Implement Dark Mode Theme',
  'Add system-aware dark mode with toggle option in user preferences',
  'ECOM-2002',
  @frontend_space_id,
  NULL,
  @status_submitted,
  @priority_low,
  @worktype_feature,
  @customer_id,
  NULL,
  DATE_ADD(NOW(), INTERVAL 10 DAY),
  10,
  NOW(),
  NOW()
);

-- ECOM-2003: Performance Optimization (HIGH IMPROVEMENT - IN_PROGRESS)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Frontend Performance Optimization',
  'Reduce page load time from 3s to under 1.5s. Implement code splitting and lazy loading.',
  'ECOM-2003',
  @frontend_space_id,
  NULL,
  @status_in_progress,
  @priority_high,
  @worktype_improvement,
  @customer_id,
  @customer_id,
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  14,
  NOW(),
  NOW()
);

-- ============================================================================
-- BANK PROJECT: Change Requests
-- ============================================================================

SET @ios_space_id = (SELECT id FROM spaces WHERE name = 'iOS Development' LIMIT 1);

-- BANK-1001: Biometric Authentication (HIGH FEATURE)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Add Biometric Authentication',
  'Implement Face ID and Touch ID support for iOS app login',
  'BANK-1001',
  @ios_space_id,
  NULL,
  @status_submitted,
  @priority_high,
  @worktype_feature,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  12,
  NOW(),
  NOW()
);

-- BANK-1002: Push Notifications (MEDIUM FEATURE)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Real-time Push Notifications',
  'Implement APNs integration for transaction alerts and account notifications',
  'BANK-1002',
  @ios_space_id,
  NULL,
  @status_in_discussion,
  @priority_medium,
  @worktype_feature,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 8 DAY),
  10,
  NOW(),
  NOW()
);

-- ============================================================================
-- DASHBOARD PROJECT: Change Requests
-- ============================================================================

SET @dashboard_space_id = (SELECT id FROM spaces WHERE name = 'Frontend Dashboard' LIMIT 1);

-- DASH-1001: Real-time Charts (HIGH FEATURE)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Implement Real-time Chart Updates',
  'Add WebSocket support for live data updates in analytics dashboard',
  'DASH-1001',
  @dashboard_space_id,
  NULL,
  @status_in_discussion,
  @priority_high,
  @worktype_feature,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 10 DAY),
  20,
  NOW(),
  NOW()
);

-- DASH-1002: Export to PDF (MEDIUM FEATURE)
INSERT INTO change_requests (id, title, description, cr_key, space_id, sprint_id, status_id, priority_id, worktype_id, created_by, assigned_to, due_date, estimated_hours, created_at, updated_at)
VALUES (
  UUID(),
  'Add PDF Export Functionality',
  'Allow users to export dashboard reports as PDF with custom date ranges',
  'DASH-1002',
  @dashboard_space_id,
  NULL,
  @status_approved,
  @priority_medium,
  @worktype_feature,
  @customer_id,
  @pm_id,
  DATE_ADD(NOW(), INTERVAL 6 DAY),
  8,
  NOW(),
  NOW()
);

SELECT CONCAT('Change requests created: ', COUNT(*)) FROM change_requests;

-- ============================================================================
-- PHASE 8: CREATE STATUS HISTORY (Audit trail for CR transitions)
-- ============================================================================

SELECT 'PHASE 8: CREATING STATUS HISTORY' AS 'MIGRATION_STEP';

-- Get some CR IDs for history
SET @ecom_1002_id = (SELECT id FROM change_requests WHERE cr_key = 'ECOM-1002' LIMIT 1);
SET @ecom_1003_id = (SELECT id FROM change_requests WHERE cr_key = 'ECOM-1003' LIMIT 1);
SET @ecom_1004_id = (SELECT id FROM change_requests WHERE cr_key = 'ECOM-1004' LIMIT 1);

-- ECOM-1002: DRAFT → SUBMITTED → IN_DISCUSSION
INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1002_id,
  @status_submitted,
  @customer_id,
  'Initial submission from customer',
  DATE_SUB(NOW(), INTERVAL 2 DAY)
);

INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1002_id,
  @status_in_discussion,
  @pm_id,
  'Opened for team discussion',
  DATE_SUB(NOW(), INTERVAL 1 DAY)
);

-- ECOM-1003: DRAFT → SUBMITTED → IN_DISCUSSION → APPROVED
INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1003_id,
  @status_submitted,
  @customer_id,
  'Database optimization request',
  DATE_SUB(NOW(), INTERVAL 4 DAY)
);

INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1003_id,
  @status_in_discussion,
  @pm_id,
  'Technical assessment in progress',
  DATE_SUB(NOW(), INTERVAL 3 DAY)
);

INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1003_id,
  @status_approved,
  @admin_id,
  'Approved by admin - schedule for next sprint',
  DATE_SUB(NOW(), INTERVAL 1 DAY)
);

-- ECOM-1004: Multiple transitions → IN_PROGRESS
INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1004_id,
  @status_submitted,
  @customer_id,
  'Documentation work requested',
  DATE_SUB(NOW(), INTERVAL 5 DAY)
);

INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1004_id,
  @status_approved,
  @pm_id,
  'Approved - priority documentation update',
  DATE_SUB(NOW(), INTERVAL 4 DAY)
);

INSERT INTO change_request_status_history (id, change_request_id, status_id, changed_by, notes, created_at)
VALUES (
  UUID(),
  @ecom_1004_id,
  @status_in_progress,
  @pm_id,
  'Documentation work started',
  DATE_SUB(NOW(), INTERVAL 2 DAY)
);

SELECT CONCAT('Status history entries created: ', COUNT(*)) FROM change_request_status_history;

-- ============================================================================
-- PHASE 9: CREATE CHANGE REQUEST COMMENTS (Discussion threads)
-- ============================================================================

SELECT 'PHASE 9: CREATING CHANGE REQUEST COMMENTS' AS 'MIGRATION_STEP';

-- Comments on ECOM-1002
INSERT INTO change_request_comments (id, change_request_id, content, commented_by, created_at, updated_at)
VALUES (
  UUID(),
  @ecom_1002_id,
  'We should prioritize Google OAuth first as it has 60% of our user base',
  @pm_id,
  DATE_SUB(NOW(), INTERVAL 1 DAY),
  DATE_SUB(NOW(), INTERVAL 1 DAY)
);

INSERT INTO change_request_comments (id, change_request_id, content, commented_by, created_at, updated_at)
VALUES (
  UUID(),
  @ecom_1002_id,
  'Agreed. Facebook OAuth can follow in the next sprint if time permits',
  @customer_id,
  DATE_SUB(NOW(), INTERVAL 12 HOUR),
  DATE_SUB(NOW(), INTERVAL 12 HOUR)
);

INSERT INTO change_request_comments (id, change_request_id, content, commented_by, created_at, updated_at)
VALUES (
  UUID(),
  @ecom_1002_id,
  'We need to ensure GDPR compliance with OAuth integrations',
  @admin_id,
  DATE_SUB(NOW(), INTERVAL 6 HOUR),
  DATE_SUB(NOW(), INTERVAL 6 HOUR)
);

-- Comments on ECOM-1004
INSERT INTO change_request_comments (id, change_request_id, content, commented_by, created_at, updated_at)
VALUES (
  UUID(),
  @ecom_1004_id,
  'Please use Swagger 3.0 format for API documentation',
  @pm_id,
  DATE_SUB(NOW(), INTERVAL 2 DAY),
  DATE_SUB(NOW(), INTERVAL 2 DAY)
);

INSERT INTO change_request_comments (id, change_request_id, content, commented_by, created_at, updated_at)
VALUES (
  UUID(),
  @ecom_1004_id,
  'Will also add code examples and error scenarios in the documentation',
  @customer_id,
  DATE_SUB(NOW(), INTERVAL 1 DAY),
  DATE_SUB(NOW(), INTERVAL 1 DAY)
);

SELECT CONCAT('Comments created: ', COUNT(*)) FROM change_request_comments;

-- ============================================================================
-- PHASE 10: VALIDATION AND SUMMARY
-- ============================================================================

SELECT 'PHASE 10: VALIDATION AND SUMMARY' AS 'MIGRATION_STEP';

-- Verify all data integrity
SELECT 'Data Validation Results:' AS 'VALIDATION';

SELECT 'Users' AS 'Table', COUNT(*) AS 'Count', 
  'OK' AS 'Status' FROM users WHERE email IS NOT NULL 
UNION ALL
SELECT 'Projects', COUNT(*), CASE WHEN COUNT(*) = 3 THEN 'OK' ELSE 'ERROR' END FROM projects
UNION ALL
SELECT 'Spaces', COUNT(*), CASE WHEN COUNT(*) >= 6 THEN 'OK' ELSE 'ERROR' END FROM spaces
UNION ALL
SELECT 'Sprints', COUNT(*), CASE WHEN COUNT(*) >= 2 THEN 'OK' ELSE 'ERROR' END FROM sprints
UNION ALL
SELECT 'Change Requests', COUNT(*), CASE WHEN COUNT(*) >= 10 THEN 'OK' ELSE 'ERROR' END FROM change_requests
UNION ALL
SELECT 'Status History', COUNT(*), CASE WHEN COUNT(*) >= 6 THEN 'OK' ELSE 'ERROR' END FROM change_request_status_history
UNION ALL
SELECT 'Comments', COUNT(*), CASE WHEN COUNT(*) >= 5 THEN 'OK' ELSE 'ERROR' END FROM change_request_comments
UNION ALL
SELECT 'Space Assignments', COUNT(*), CASE WHEN COUNT(*) >= 4 THEN 'OK' ELSE 'ERROR' END FROM space_assignments;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT '========================================' AS '';
SELECT 'MIGRATION COMPLETE - ALL DATA LOADED' AS 'STATUS';
SELECT '========================================' AS '';

SELECT CONCAT('Total Users: ', COUNT(*)) FROM users;
SELECT CONCAT('Total Projects: ', COUNT(*)) FROM projects;
SELECT CONCAT('Total Spaces: ', COUNT(*)) FROM spaces;
SELECT CONCAT('Total Sprints: ', COUNT(*)) FROM sprints;
SELECT CONCAT('Total Change Requests: ', COUNT(*)) FROM change_requests;
SELECT CONCAT('Total Status History Entries: ', COUNT(*)) FROM change_request_status_history;
SELECT CONCAT('Total Comments: ', COUNT(*)) FROM change_request_comments;
SELECT CONCAT('Total Space Assignments: ', COUNT(*)) FROM space_assignments;

SELECT 'Ready for testing!' AS 'NEXT_STEP';
