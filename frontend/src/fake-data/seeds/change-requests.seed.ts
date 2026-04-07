/**
 * Fixed Change Request Seed Data
 * Consistent data that doesn't change across reloads
 *
 * Distribution:
 * - Draft: 3 CRs (private to customers)
 * - Submitted: 5 CRs
 * - In Discussion: 5 CRs
 * - Approved: 4 CRs
 * - Rejected: 2 CRs
 * - Ongoing: 4 CRs
 * - Closed: 2 CRs
 * Total: 25 CRs
 */

import { ChangeRequest, CrStatus } from "@/lib/types";
import { CUSTOMER_USERS } from "./users.seed";

type Priority = "low" | "medium" | "high" | "critical";

/**
 * Create a CR object with all required fields
 */
const createCR = (
  id: string,
  title: string,
  status: CrStatus,
  priority: Priority,
  customerIndex: number,
  daysAgo: number,
  description?: string
): ChangeRequest => {
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);

  const customer = CUSTOMER_USERS[customerIndex];

  return {
    id,
    title,
    description:
      description ||
      `Description for ${title}. This is a detailed description of what needs to be done.`,
    status,
    priority,
    crKey: id,
    spaceId: "default-space",
    createdBy: {
      id: customer.id,
      fullName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
    },
    createdAt: createdDate.toISOString(),
    updatedAt: createdDate.toISOString(),
    attachments: [],
    comments: [],
  };
};

/**
 * All Change Requests
 */
export const FIXED_CHANGE_REQUESTS: ChangeRequest[] = [
  // Draft CRs (3 total) - Only visible to the customer who created them
  createCR(
    "CR-001",
    "Update login page UI design",
    CrStatus.DRAFT,
    "medium",
    0,
    25,
    "Need to modernize the login page with the new design system. Update colors, spacing, and add new animations."
  ),
  createCR(
    "CR-002",
    "Implement forgot password feature",
    CrStatus.DRAFT,
    "high",
    0,
    20,
    "Add functionality for users to reset their password via email verification."
  ),
  createCR(
    "CR-003",
    "Add two-factor authentication",
    CrStatus.DRAFT,
    "critical",
    1,
    15,
    "Enhance security by implementing optional 2FA for user accounts."
  ),

  // Submitted CRs (5 total)
  createCR(
    "CR-004",
    "Fix dashboard loading performance",
    CrStatus.SUBMITTED,
    "high",
    2,
    14,
    "Dashboard is taking too long to load. Optimize queries and add caching."
  ),
  createCR(
    "CR-005",
    "Add export to CSV functionality",
    CrStatus.SUBMITTED,
    "medium",
    3,
    12,
    "Users need ability to export reports as CSV files for analysis."
  ),
  createCR(
    "CR-006",
    "Implement notification system",
    CrStatus.SUBMITTED,
    "high",
    4,
    10,
    "Add real-time notifications for important events using WebSockets."
  ),
  createCR(
    "CR-007",
    "Improve search functionality",
    CrStatus.SUBMITTED,
    "medium",
    5,
    8,
    "Search is not finding all relevant results. Implement full-text search with filters."
  ),
  createCR(
    "CR-008",
    "Mobile responsive design update",
    CrStatus.SUBMITTED,
    "medium",
    6,
    6,
    "Ensure all pages are properly responsive for mobile devices."
  ),

  // In Discussion CRs (5 total)
  createCR(
    "CR-009",
    "Database migration to PostgreSQL",
    CrStatus.IN_DISCUSSION,
    "critical",
    0,
    18,
    "Migrate from MySQL to PostgreSQL for better performance and features."
  ),
  createCR(
    "CR-010",
    "Implement API rate limiting",
    CrStatus.IN_DISCUSSION,
    "high",
    1,
    16,
    "Add rate limiting to prevent abuse and ensure fair usage of API endpoints."
  ),
  createCR(
    "CR-011",
    "Add multi-language support",
    CrStatus.IN_DISCUSSION,
    "medium",
    2,
    13,
    "Support Vietnamese, English, and Japanese languages with proper localization."
  ),
  createCR(
    "CR-012",
    "Create user activity dashboard",
    CrStatus.IN_DISCUSSION,
    "medium",
    3,
    11,
    "Add dashboard to track and analyze user activity and engagement metrics."
  ),
  createCR(
    "CR-013",
    "Implement automated backup system",
    CrStatus.IN_DISCUSSION,
    "high",
    4,
    9,
    "Set up automated daily backups with redundancy for data protection."
  ),

  // Approved CRs (4 total)
  createCR(
    "CR-014",
    "Add dark mode support",
    CrStatus.APPROVED,
    "medium",
    5,
    7,
    "Implement dark mode with user preference persistence in local storage."
  ),
  createCR(
    "CR-015",
    "Optimize image loading",
    CrStatus.APPROVED,
    "medium",
    6,
    5,
    "Implement lazy loading and image compression for faster page loads."
  ),
  createCR(
    "CR-016",
    "Add user role-based access control",
    CrStatus.APPROVED,
    "high",
    0,
    4,
    "Implement granular permission system based on user roles and departments."
  ),
  createCR(
    "CR-017",
    "Create admin analytics panel",
    CrStatus.APPROVED,
    "medium",
    1,
    3,
    "Build comprehensive analytics dashboard for administrators with charts and metrics."
  ),

  // Rejected CRs (2 total)
  createCR(
    "CR-018",
    "Remove legacy API endpoints",
    CrStatus.REJECTED,
    "low",
    2,
    21,
    "Clean up deprecated API endpoints that are no longer in use."
  ),
  createCR(
    "CR-019",
    "Change primary color scheme",
    CrStatus.REJECTED,
    "low",
    3,
    17,
    "Requested change to primary brand color from blue to green."
  ),

  // Ongoing CRs (4 total)
  createCR(
    "CR-020",
    "Build new admin dashboard",
    CrStatus.ONGOING,
    "high",
    4,
    2,
    "Develop comprehensive admin panel with user management and system monitoring."
  ),
  createCR(
    "CR-021",
    "Implement payment gateway integration",
    CrStatus.ONGOING,
    "critical",
    5,
    1,
    "Integrate Stripe for processing customer payments securely."
  ),
  createCR(
    "CR-022",
    "Refactor authentication system",
    CrStatus.ONGOING,
    "high",
    6,
    1,
    "Update authentication to use OAuth2 with JWT tokens for better security."
  ),
  createCR(
    "CR-023",
    "Add email verification system",
    CrStatus.ONGOING,
    "medium",
    0,
    0,
    "Implement email verification on user registration for account validation."
  ),

  // Closed CRs (2 total)
  createCR(
    "CR-024",
    "Fix email notification bug",
    CrStatus.CLOSED,
    "medium",
    1,
    30,
    "Users were not receiving password reset emails. Issue has been fixed and tested."
  ),
  createCR(
    "CR-025",
    "Update user documentation",
    CrStatus.CLOSED,
    "low",
    2,
    28,
    "Updated all user-facing documentation to reflect new UI changes."
  ),
];
