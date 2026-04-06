/**
 * Permissions and User Management Mock Data
 * Refactored to use fixed users from users.seed.ts
 */

import { PermissionGroup, UserRole } from "@/lib/types";
import { FIXED_USERS_SEED } from "./users.seed";

/**
 * Re-export fixed users for permissions management
 */
export const MOCK_USERS = FIXED_USERS_SEED;

/**
 * Permission groups based on user roles
 */
export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "admin-group",
    name: "Administrator",
    description: "Full access to all modules and features",
    roleType: UserRole.ADMIN,
  },
  {
    id: "pm-group",
    name: "Project Manager",
    description: "Can manage change requests, view reports, and manage team",
    roleType: UserRole.PM,
  },
  {
    id: "customer-group",
    name: "Customer",
    description: "Can view and submit change requests",
    roleType: UserRole.CUSTOMER,
  },
];
