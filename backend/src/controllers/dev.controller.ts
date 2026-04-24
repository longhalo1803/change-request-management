/**
 * Dev Tools Controller
 *
 * Handles HTTP requests for development tools.
 * All endpoints are development-only and protected by NODE_ENV checks.
 */

import { Request, Response } from "express";
import { DevToolsService } from "@/services/dev-tools.service";
import { asyncHandler } from "@/utils/async-handler";
import { sendSuccess } from "@/utils/response";
import { AppError } from "@/utils/app-error";

const devToolsService = DevToolsService.getInstance();

/**
 * GET /dev/emails?email=user@example.com
 * Get all mock emails for a specific email address
 */
export const getDevEmails = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      throw new AppError("dev.email_required", 400);
    }

    const emails = devToolsService.getMockEmails(email);

    sendSuccess(
      res,
      { emails, count: emails.length },
      "Dev emails retrieved",
      200
    );
  }
);

/**
 * GET /dev/emails/:id
 * Get a single mock email by ID
 */
export const getDevEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const email = devToolsService.getMockEmail(id);

    if (!email) {
      throw new AppError("dev.email_not_found", 404);
    }

    sendSuccess(res, email, "Dev email retrieved", 200);
  }
);

/**
 * POST /dev/emails/clear
 * Clear all mock emails or clear for specific email
 * Body: { email?: string }
 */
export const clearDevEmails = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (email && typeof email === "string") {
      devToolsService.clearUserEmails(email);
      sendSuccess(res, null, `Cleared emails for ${email}`, 200);
    } else {
      devToolsService.clearMockInbox();
      sendSuccess(res, null, "Cleared all dev emails", 200);
    }
  }
);

/**
 * GET /dev/stats
 * Get statistics about mock inbox
 */
export const getDevStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = {
      totalEmails: devToolsService.getEmailCount(),
      emailAddresses: devToolsService.getEmailAddresses(),
      timestamp: new Date(),
    };

    sendSuccess(res, stats, "Dev stats retrieved", 200);
  }
);
