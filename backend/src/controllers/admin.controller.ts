import { Request, Response } from "express";
import { AdminDashboardService } from "@/services/admin-dashboard.service";
import { AppError } from "@/utils/app-error";
import { logger } from "@/utils/logger";

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
   * Helper to send success response
   */
  private sendSuccess(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Helper to send error response
   */
  private sendError(
    res: Response,
    error: Error | AppError,
    statusCode: number = 500
  ): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        data: null,
        message: error.message,
        code: error.message,
      });
    } else {
      logger.error(error);
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error.message || "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  /**
   * Helper to validate limit
   */
  private validateLimit(value: string | undefined, defaultLimit: number = 20, maxLimit: number = 100): number {
    if (!value) return defaultLimit;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) return defaultLimit;
    if (parsed > maxLimit) return maxLimit;
    return parsed;
  }

  /**
   * GET /admin/dashboard/overview
   */
  async getDashboardOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getDashboardOverview();
      this.sendSuccess(res, data, "Dashboard overview retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /admin/dashboard/recent-activity
   */
  async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.validateLimit(req.query.limit as string, 20, 100);
      const data = await this.adminService.getRecentActivity(limit);
      this.sendSuccess(res, data, "Recent activity retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }



  /**
   * GET /admin/dashboard/overdue-crs
   */
  async getOverdueCRs(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getOverdueCRs();
      this.sendSuccess(res, data, "Overdue CRs retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /admin/dashboard/top-customers
   */
  async getTopCustomers(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.validateLimit(req.query.limit as string, 5, 20);
      const data = await this.adminService.getTopCustomers(limit);
      this.sendSuccess(res, data, "Top customers retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /admin/dashboard/volume-trends
   */
  async getVolumeTrends(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getVolumeTrends();
      this.sendSuccess(res, data, "Volume trends retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /admin/dashboard/stats
   */
  async getComprehensiveStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.adminService.getComprehensiveStats();
      this.sendSuccess(res, data, "Comprehensive stats retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
