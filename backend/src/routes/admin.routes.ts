import { Router } from "express";
import { AdminController } from "@/controllers/admin.controller";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { noCache } from "@/middlewares/no-cache.middleware";
import { UserRole } from "@/entities/user.entity";

/**
 * Admin Routes
 *
 * Endpoints for admin dashboard and management
 */

const router = Router();
const controller = new AdminController();

// All admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireRole([UserRole.ADMIN]));

// Apply no-cache to dashboard routes
router.use("/dashboard", noCache);

// Dashboard endpoints
router.get("/dashboard/overview", (req, res) =>
  controller.getDashboardOverview(req, res)
);
router.get("/dashboard/recent-activity", (req, res) =>
  controller.getRecentActivity(req, res)
);

router.get("/dashboard/overdue-crs", (req, res) =>
  controller.getOverdueCRs(req, res)
);
router.get("/dashboard/top-customers", (req, res) =>
  controller.getTopCustomers(req, res)
);
router.get("/dashboard/volume-trends", (req, res) =>
  controller.getVolumeTrends(req, res)
);
router.get("/dashboard/stats", (req, res) =>
  controller.getComprehensiveStats(req, res)
);

export default router;
