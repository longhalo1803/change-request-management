/**
 * Dev Tools Routes
 *
 * Development-only endpoints for debugging and testing.
 * Only available in NODE_ENV === "development"
 */

import { Router } from "express";
import {
  getDevEmails,
  getDevEmail,
  clearDevEmails,
  getDevStats,
} from "@/controllers/dev.controller";

const router = Router();

/**
 * Middleware to ensure dev mode only
 */
const devModeOnly = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Dev tools are only available in development mode",
      statusCode: 403,
    });
  }
  next();
};

router.use(devModeOnly);

// Email endpoints
router.get("/mock-emails", getDevEmails);
router.get("/mock-emails/:id", getDevEmail);
router.post("/mock-emails/clear", clearDevEmails);

// Stats endpoint
router.get("/stats", getDevStats);

export default router;
