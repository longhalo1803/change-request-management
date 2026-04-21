import { Router } from "express";
import authRoutes from "./auth.routes";
import changeRequestRoutes from "./change-request.routes";
import projectRoutes from "./project.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import notificationRoutes from "./notification.route";
import dashboardRoutes from "./dashboard.routes";
import permissionsRoutes from "./permissions.routes";

const router = Router();

// Register routes
router.use("/auth", authRoutes);
router.use("/change-requests", changeRequestRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/permissions", permissionsRoutes);

export default router;
