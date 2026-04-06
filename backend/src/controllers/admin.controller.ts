import { Request, Response } from "express";
import { AdminDashboardService } from "@/services/admin-dashboard.service";

/**
 * Admin Controller
 *
 * Handles HTTP requests for admin dashboard
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles HTTP request/response
 * - Dependency Inversion: Depends on service abstraction
 */

export class AdminController {
  private adminService: AdminDashboardService;

  constructor() {
    this.adminService = new AdminDashboardService();
  }

  /**
   * GET /admin/dashboard/overview
   */
  async getDashboardOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getDashboardOverview();
      res.json({ status: "success", data });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /admin/dashboard/recent-activity
   */
  async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await this.adminService.getRecentActivity(limit);
      res.json({ status: "success", data });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /admin/dashboard/top-assignees
   */
  async getTopAssignees(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.adminService.getTopAssignees(limit);
      res.json({ status: "success", data });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /admin/dashboard/overdue-crs
   */
  async getOverdueCRs(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getOverdueCRs();
      res.json({ status: "success", data });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /admin/dashboard/stats
   */
  async getComprehensiveStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getComprehensiveStats();
      res.json({ status: "success", data });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}
