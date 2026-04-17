import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { logger } from "../utils/logger";

export class NotificationController {
  /**
   * Get all notifications for the current user
   */
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const notifications =
        await notificationService.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      logger.error(
        `[NotificationController.getMyNotifications] Error: ${error}`
      );
      res.status(500).json({ message: "error.internal_server_error" });
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const notification = await notificationService.markAsRead(id, userId);
      if (!notification) {
        return res.status(404).json({ message: "error.not_found" });
      }

      res.json(notification);
    } catch (error) {
      logger.error(`[NotificationController.markAsRead] Error: ${error}`);
      res.status(500).json({ message: "error.internal_server_error" });
    }
  }
}

export const notificationController = new NotificationController();
