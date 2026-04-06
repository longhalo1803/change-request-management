import { Router } from "express";
import { ChangeRequestController } from "@/controllers/change-request.controller";
import { requireAuth } from "@/middlewares/auth.middleware";

/**
 * Change Request Routes
 *
 * Endpoints for managing change requests
 */

const router = Router();
const controller = new ChangeRequestController();

// Apply auth middleware to all routes
router.use(requireAuth);

// Get CR by ID
router.get("/:id", (req, res) => controller.getCrById(req, res));

// Get CR by crKey
router.get("/key/:crKey", (req, res) => controller.getCrByCrKey(req, res));

// Get CRs for space
router.get("/space/:spaceId", (req, res) =>
  controller.getCrsBySpaceId(req, res)
);

// Get CRs assigned to me
router.get("/assigned/to-me", (req, res) =>
  controller.getCrsAssignedToMe(req, res)
);

// Get CRs created by me
router.get("/created/by-me", (req, res) =>
  controller.getCrsCreatedByMe(req, res)
);

// Create CR in space
router.post("/space/:spaceId", (req, res) => controller.createCr(req, res));

// Update CR
router.put("/:id", (req, res) => controller.updateCr(req, res));

// Delete CR
router.delete("/:id", (req, res) => controller.deleteCr(req, res));

// Comments
router.post("/:id/comments", (req, res) => controller.addComment(req, res));
router.get("/:id/comments", (req, res) => controller.getComments(req, res));
router.delete("/:id/comments/:commentId", (req, res) =>
  controller.deleteComment(req, res)
);

// Attachments
router.get("/:id/attachments", (req, res) =>
  controller.getAttachments(req, res)
);
router.delete("/:id/attachments/:attachmentId", (req, res) =>
  controller.deleteAttachment(req, res)
);

// Status History & Changes
router.get("/:id/status-history", (req, res) =>
  controller.getStatusHistory(req, res)
);
router.post("/:id/status-change", (req, res) =>
  controller.recordStatusChange(req, res)
);

export default router;
