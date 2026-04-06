/**
 * PM-Specific View Data
 * A PM can see all CRs EXCEPT those in Draft status
 * Draft CRs are private to customers who created them
 */

import { FIXED_CHANGE_REQUESTS } from "./change-requests.seed";
import { CrStatus } from "@/lib/types";

/**
 * All CRs that PMs can see
 * Excludes Draft status which are private to customers
 */
export const PM_VIEW_CRS = FIXED_CHANGE_REQUESTS.filter(
  (cr) => cr.status !== CrStatus.DRAFT
);

/**
 * Helper function to get PMs view
 */
export const getPMViewCRs = () => {
  return PM_VIEW_CRS;
};
