import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/entities/user.entity";

/**
 * User Routes
 *
 * Endpoints for user management
 */

const router = Router();
const controller = new UserController();

// Apply auth middleware to all routes
router.use(requireAuth);

// Public user endpoints (authenticated users)
router.get("/:id", (req, res) => controller.getUserById(req, res));
router.post("/:id/change-password", (req, res) =>
  controller.changePassword(req, res)
);

// Admin-only endpoints
router.get("/", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.getAllUsers(req, res)
);
router.get("/by-role/:role", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.getUsersByRole(req, res)
);
router.post("/", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.createUser(req, res)
);
router.put("/:id", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.updateUser(req, res)
);
router.patch("/:id/status", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.updateUserStatus(req, res)
);
router.post("/:id/activate", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.activateUser(req, res)
);
router.post("/:id/deactivate", requireRole([UserRole.ADMIN]), (req, res) =>
  controller.deactivateUser(req, res)
);

export default router;
