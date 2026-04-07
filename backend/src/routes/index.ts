import { Router } from "express";
import authRoutes from "./auth.routes";
import changeRequestRoutes from "./change-request.routes";
import projectRoutes from "./project.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// Register routes
router.use("/auth", authRoutes);
router.use("/change-requests", changeRequestRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

export default router;
