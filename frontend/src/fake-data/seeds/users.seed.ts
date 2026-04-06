/**
 * Fixed User Seed Data
 * Consistent data that doesn't change across reloads
 */

import { generateFixedUsers } from "../generators/user.generator";

export const FIXED_USERS_SEED = generateFixedUsers();

// Easily accessible user references
export const ADMIN_USERS = FIXED_USERS_SEED.filter((u) =>
  u.id.startsWith("admin-")
);
export const PM_USERS = FIXED_USERS_SEED.filter((u) => u.id.startsWith("pm-"));
export const CUSTOMER_USERS = FIXED_USERS_SEED.filter((u) =>
  u.id.startsWith("customer-")
);

// Convenient object map for easy lookup
export const USERS_BY_ID = FIXED_USERS_SEED.reduce(
  (acc, user) => {
    acc[user.id] = user;
    return acc;
  },
  {} as Record<string, (typeof FIXED_USERS_SEED)[0]>
);
