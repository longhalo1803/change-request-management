/**
 * Central Export File for All Fake Data
 * This is the single point of import for all mock data across the application
 */

// Constants
export * from "./constants/names";
export * from "./constants/projects";
export * from "./constants/statuses";

// Generators
export * from "./generators/common";
export * from "./generators/user.generator";
export * from "./generators/change-request.generator";

// Seeds - Users
export {
  FIXED_USERS_SEED,
  ADMIN_USERS,
  PM_USERS,
  CUSTOMER_USERS,
  USERS_BY_ID,
} from "./seeds/users.seed";

// Seeds - Change Requests
export { FIXED_CHANGE_REQUESTS } from "./seeds/change-requests.seed";

// Seeds - Customer View
export {
  CUSTOMER_1_CRS,
  getCustomerCRs,
  CUSTOMER_VIEW_ALL_CRS,
} from "./seeds/customer.seed";

// Seeds - PM View
export { PM_VIEW_CRS, getPMViewCRs } from "./seeds/pm.seed";

// Seeds - Admin View
export {
  ADMIN_DASHBOARD_MOCK_DATA,
  ADMIN_VIEW_CRS,
  DATE_RANGE_OPTIONS,
  CUSTOMER_OPTIONS,
  PM_OPTIONS,
} from "./seeds/admin.seed";

// Seeds - Permissions (for backward compatibility with permissions.service.mock.ts)
export { MOCK_USERS, MOCK_PERMISSION_GROUPS } from "./seeds/permissions.seed";
