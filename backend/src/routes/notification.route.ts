import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Get my notifications
router.get("/", notificationController.getMyNotifications);

// Mark as read
router.put("/:id/read", notificationController.markAsRead);

export default router;
