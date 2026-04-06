import { AdminRepository } from "@/repositories/admin.repository";

/**
 * Admin Dashboard Service
 *
 * Business logic for admin dashboard
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles dashboard statistics
 * - Dependency Inversion: Depends on repository abstraction
 */

export class AdminDashboardService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  /**
   * Get dashboard overview
   */
  async getDashboardOverview(): Promise<{
    changeRequests: any;
    users: any;
    projects: any;
    quotations: any;
  }> {
    const [crStats, userStats, projectStats, quotationStats] =
      await Promise.all([
        this.adminRepo.getCrStats(),
        this.adminRepo.getUserStats(),
        this.adminRepo.getProjectStats(),
        this.adminRepo.getQuotationStats(),
      ]);

    return {
      changeRequests: crStats,
      users: userStats,
      projects: projectStats,
      quotations: quotationStats,
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20): Promise<any> {
    return this.adminRepo.getRecentActivity(limit);
  }

  /**
   * Get top assignees
   */
  async getTopAssignees(limit: number = 10): Promise<any> {
    return this.adminRepo.getTopAssignees(limit);
  }

  /**
   * Get overdue CRs
   */
  async getOverdueCRs(): Promise<any> {
    return this.adminRepo.getOverdueCRs();
  }

  /**
   * Get comprehensive admin stats
   */
  async getComprehensiveStats(): Promise<any> {
    const [overview, recentActivity, topAssignees, overdueCRs] =
      await Promise.all([
        this.getDashboardOverview(),
        this.getRecentActivity(10),
        this.getTopAssignees(5),
        this.getOverdueCRs(),
      ]);

    return {
      overview,
      recentActivity,
      topAssignees,
      overdueCRs,
      timestamp: new Date().toISOString(),
    };
  }
}
