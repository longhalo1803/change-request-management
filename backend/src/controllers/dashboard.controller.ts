import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";
import { logger } from "../utils/logger";

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const stats = await dashboardService.getStats(userId, role);
      res.json({ data: stats });
    } catch (error) {
      logger.error(`[DashboardController.getStats] Error: ${error}`);
      res.status(500).json({ message: "error.internal_server_error" });
    }
  }

  async getStatusOverview(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const overview = await dashboardService.getStatusOverview(userId, role);
      res.json({ data: overview });
    } catch (error) {
      logger.error(`[DashboardController.getStatusOverview] Error: ${error}`);
      res.status(500).json({ message: "error.internal_server_error" });
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const activities = await dashboardService.getRecentActivities(
        userId,
        role
      );
      res.json({ data: activities });
    } catch (error) {
      logger.error(`[DashboardController.getRecentActivities] Error: ${error}`);
      res.status(500).json({ message: "error.internal_server_error" });
    }
  }
}

export const dashboardController = new DashboardController();
