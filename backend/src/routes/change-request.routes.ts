import { Router } from "express";
import { ChangeRequestController } from "@/controllers/change-request.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import { uploadFiles } from "@/middlewares/upload.middleware";

/**
 * Change Request Routes
 *
 * Endpoints for managing change requests with role-based access control
 *
 * Visibility Rules:
 * - Admin: Can see all CRs
 * - PM: Can see all CRs except DRAFT status
 * - Customer: Can see their own DRAFT CRs + all non-DRAFT CRs
 *
 * Permission Rules:
 * - Create: CUSTOMER ONLY
 * - Update: CUSTOMER ONLY (DRAFT status only)
 * - Delete: CUSTOMER ONLY (DRAFT status only)
 * - Submit: CUSTOMER ONLY (DRAFT → SUBMITTED)
 * - Status Transition: PM and CUSTOMER (with allowed transitions)
 * - Comment: CUSTOMER and PM (not on DRAFT CRs)
 */

const router = Router();
const controller = new ChangeRequestController();

// Apply auth middleware to all routes
router.use(requireAuth);

// ===== List & Search =====

/**
 * GET /api/change-requests/lookups
 * Get master data for CRs
 */
router.get("/lookups", (req, res, next) => controller.getLookups(req, res, next));

/**
 * GET /api/change-requests
 * Get all CRs with search/filter/pagination
 * Query: search, status, priority, spaceId, assignedTo, page, limit, sortBy, sortOrder
 */
router.get("/", (req, res) => controller.getChangeRequests(req, res));

/**
 * GET /api/change-requests/by-space/:spaceId
 * Get CRs for specific space
 */
router.get("/by-space/:spaceId", (req, res) =>
  controller.getCRsBySpace(req, res)
);

// ===== Single CR Operations =====

/**
 * GET /api/change-requests/:id
 * Get single CR by ID
 */
router.get("/:id", (req, res) => controller.getChangeRequest(req, res));

/**
 * POST /api/change-requests
 * Create new CR (CUSTOMER ONLY)
 * Status: Always DRAFT
 * Note: Create CR first, then upload attachments separately
 */
router.post("/", (req, res) => controller.createChangeRequest(req, res));

/**
 * POST /api/change-requests/:id/attachments
 * Upload attachments to existing CR (CUSTOMER ONLY, DRAFT status only)
 */
router.post(
  "/:id/attachments",
  (req, res, next) => {
    uploadFiles.array("attachments", 5)(req, res, (err: any) => {
      if (err) {
        // Handle multer errors with a proper 400 JSON response
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "File too large. Maximum size is 10MB."
            : err.code === "LIMIT_FILE_COUNT"
              ? "Too many files. Maximum is 5 files."
              : err.message || "File upload failed";
        return res.status(400).json({
          success: false,
          message,
          data: null,
        });
      }
      next();
    });
  },
  (req, res) => controller.uploadAttachments(req, res)
);

/**
 * PUT /api/change-requests/:id
 * Update CR (CUSTOMER ONLY, DRAFT status only)
 */
router.put("/:id", (req, res) => controller.updateChangeRequest(req, res));

/**
 * DELETE /api/change-requests/:id
 * Delete CR (CUSTOMER ONLY, DRAFT status only)
 */
router.delete("/:id", (req, res) => controller.deleteChangeRequest(req, res));

// ===== CR Actions =====

/**
 * POST /api/change-requests/:id/submit
 * Submit CR from DRAFT to SUBMITTED (CUSTOMER ONLY)
 */
router.post("/:id/submit", (req, res) =>
  controller.submitChangeRequest(req, res)
);

/**
 * POST /api/change-requests/:id/status-transition
 * Transition CR status with role-based validation
 * PM: SUBMITTED→IN_DISCUSSION, IN_DISCUSSION→SUBMITTED (reject), APPROVED→IN_PROGRESS, IN_PROGRESS→COMPLETED
 * CUSTOMER: IN_DISCUSSION→APPROVED (approve), IN_DISCUSSION→SUBMITTED (reject)
 */
router.post("/:id/status-transition", (req, res) =>
  controller.transitionStatus(req, res)
);

// ===== Comments =====

/**
 * GET /api/change-requests/:id/comments
 * Get comments for CR
 */
router.get("/:id/comments", (req, res) => controller.getComments(req, res));

/**
 * POST /api/change-requests/:id/comments
 * Add comment with optional file attachments
 * Body: { content: string, files?: File[] }
 * CUSTOMER and PM can comment (not on DRAFT CRs)
 */
router.post("/:id/comments", uploadFiles.array("files", 5), (req, res) =>
  controller.addComment(req, res)
);

/**
 * DELETE /api/change-requests/:id/comments/:commentId
 * Delete comment (owner only)
 */
router.delete("/:id/comments/:commentId", (req, res) =>
  controller.deleteComment(req, res)
);

// ===== Attachments =====

/**
 * GET /api/change-requests/:id/attachments
 * Get attachments for CR
 */
router.get("/:id/attachments", (req, res) =>
  controller.getAttachments(req, res)
);

/**
 * DELETE /api/change-requests/:id/attachments/:attachmentId
 * Delete attachment
 */
router.delete("/:id/attachments/:attachmentId", (req, res) =>
  controller.deleteAttachment(req, res)
);

// ===== Status History =====

/**
 * GET /api/change-requests/:id/status-history
 * Get status history for CR (audit trail)
 */
router.get("/:id/status-history", (req, res) =>
  controller.getStatusHistory(req, res)
);

export default router;
