import { Router } from "express";
import { PermissionsController } from "@/controllers/permissions.controller";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/entities/user.entity";

/**
 * Permissions Routes
 *
 * Endpoints for permission group management
 */

const router = Router();
const controller = new PermissionsController();

// All permissions routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole([UserRole.ADMIN]));

// Permission groups
router.get("/groups", (req, res) => controller.getPermissionGroups(req, res));

export default router;
