import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { noCache } from "../middlewares/no-cache.middleware";

const router = Router();

router.use(authenticate);
router.use(noCache);

router.get("/stats", dashboardController.getStats.bind(dashboardController));
router.get(
  "/status-overview",
  dashboardController.getStatusOverview.bind(dashboardController)
);
router.get(
  "/recent-activities",
  dashboardController.getRecentActivities.bind(dashboardController)
);

export default router;
