import { Router } from "express";
import * as authController from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";

/**
 * Auth Routes
 *
 * Defines authentication endpoints
 *
 * SOLID Principles:
 * - Single Responsibility: Only defines auth routes
 * - Open/Closed: Easy to add new auth endpoints
 */

const router = Router();

// Public routes
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
