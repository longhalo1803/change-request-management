/**
 * Customer-Specific View Data
 * A customer can only see:
 * - CRs they created themselves (all statuses)
 * - NOT CRs from other customers
 */

import { FIXED_CHANGE_REQUESTS } from "./change-requests.seed";

/**
 * For demonstration, show customer-1's CRs
 * In real app, this would be filtered based on logged-in user
 */
export const CUSTOMER_1_CRS = FIXED_CHANGE_REQUESTS.filter(
  (cr) => cr.createdBy?.id === "customer-1"
);

/**
 * Export helper function to get CRs for a specific customer
 */
export const getCustomerCRs = (customerId: string) => {
  return FIXED_CHANGE_REQUESTS.filter((cr) => cr.createdBy?.id === customerId);
};

// Also export all for reference
export const CUSTOMER_VIEW_ALL_CRS = FIXED_CHANGE_REQUESTS;
