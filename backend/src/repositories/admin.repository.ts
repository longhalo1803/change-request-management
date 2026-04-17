import { AppDataSource } from "@/config/database";
import { ChangeRequest } from "@/entities/change-request.entity";
import { User } from "@/entities/user.entity";
import { Quotation } from "@/entities/quotation.entity";
import { Project } from "@/entities/project.entity";

/**
 * Admin Repository
 *
 * Data access layer for admin dashboard statistics
 */

export class AdminRepository {
  /**
   * Get change request statistics
   */
  async getCrStats(): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);

    const [total, statusBreakdown] = await Promise.all([
      crRepo.count(),
      crRepo
        .createQueryBuilder("cr")
        .leftJoin("cr.status", "status")
        .groupBy("cr.statusId")
        .addGroupBy("status.name")
        .addGroupBy("status.color")
        .select("status.name", "statusName")
        .addSelect("status.color", "color")
        .addSelect("COUNT(cr.id)", "count")
        .getRawMany(),
    ]);

    return {
      total,
      byStatus: statusBreakdown,
    };
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<any> {
    const userRepo = AppDataSource.getRepository(User);

    const [totalUsers, activeUsers, byRole] = await Promise.all([
      userRepo.count(),
      userRepo.count({ where: { isActive: true } }),
      userRepo
        .createQueryBuilder("u")
        .groupBy("u.role")
        .select("u.role", "role")
        .addSelect("COUNT(u.id)", "count")
        .getRawMany(),
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole,
    };
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<any> {
    const projectRepo = AppDataSource.getRepository(Project);
    const crRepo = AppDataSource.getRepository(ChangeRequest);

    const [totalProjects, activeProjects] = await Promise.all([
      projectRepo.count(),
      projectRepo.count({ where: { isActive: true } }),
    ]);

    return {
      total: totalProjects,
      active: activeProjects,
      inactive: totalProjects - activeProjects,
    };
  }

  /**
   * Get quotation statistics
   */
  async getQuotationStats(): Promise<any> {
    const quotationRepo = AppDataSource.getRepository(Quotation);

    const [total, byStatus] = await Promise.all([
      quotationRepo.count(),
      quotationRepo
        .createQueryBuilder("q")
        .groupBy("q.status")
        .select("q.status", "status")
        .addSelect("COUNT(q.id)", "count")
        .addSelect("SUM(q.amount)", "totalAmount")
        .getRawMany(),
    ]);

    return {
      total,
      byStatus,
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);

    return crRepo.find({
      relations: ["space", "creator", "status"],
      order: { createdAt: "DESC" },
      take: limit,
      select: [
        "id",
        "crKey",
        "title",
        "createdAt",
        "space",
        "creator",
        "status",
      ],
    });
  }

  /**
   * Get top assignees
   */
  async getTopAssignees(limit: number = 10): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);

    return crRepo
      .createQueryBuilder("cr")
      .leftJoin("cr.assignee", "assignee")
      .where("cr.assignedTo IS NOT NULL")
      .groupBy("cr.assignedTo")
      .addGroupBy("assignee.id")
      .addGroupBy("assignee.fullName")
      .select("assignee.id", "id")
      .addSelect("assignee.fullName", "fullName")
      .addSelect("COUNT(cr.id)", "crCount")
      .orderBy("crCount", "DESC")
      .limit(limit)
      .getRawMany();
  }

  /**
   * Get top 5 customers by CR count
   */
  async getTopCustomers(limit: number = 5): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);
    return crRepo
      .createQueryBuilder("cr")
      .leftJoin("cr.creator", "creator")
      .where("creator.role = 'customer'")
      .select("creator.fullName", "name")
      .addSelect("COUNT(cr.id)", "crCount")
      .groupBy("creator.id")
      .addGroupBy("creator.fullName")
      .orderBy("crCount", "DESC")
      .limit(limit)
      .getRawMany()
      .then((res) =>
        res.map((r) => ({
          name: r.name || "Unknown",
          crCount: parseInt(r.crCount, 10),
        }))
      );
  }

  /**
   * Get volume trends (last 3 months)
   */
  async getVolumeTrends(): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Group by month and priority
    const rawData = await crRepo
      .createQueryBuilder("cr")
      .leftJoin("cr.priority", "priority")
      .where("cr.createdAt >= :date", { date: threeMonthsAgo })
      .select("DATE_FORMAT(cr.createdAt, '%Y-%m')", "month")
      .addSelect("LOWER(priority.name)", "priorityLevel")
      .addSelect("COUNT(cr.id)", "count")
      .groupBy("month")
      .addGroupBy("priorityLevel")
      .orderBy("month", "ASC")
      .getRawMany();

    // Format data into an array of { month: string, critical: number, high: number, medium: number, low: number, total: number }
    const trendsMap: Record<string, any> = {};

    rawData.forEach((row) => {
      const month = row.month; // e.g., '2023-10'
      const level = row.priorityLevel || "medium";
      const count = parseInt(row.count, 10);

      if (!trendsMap[month]) {
        // Convert '2023-10' to 'Oct'
        const dateObj = new Date(month + "-01");
        const monthName = dateObj.toLocaleString("en-US", { month: "short" });
        trendsMap[month] = {
          month: monthName,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          total: 0,
        };
      }

      if (["critical", "high", "medium", "low"].includes(level)) {
        trendsMap[month][level] = count;
      }
      trendsMap[month].total += count;
    });

    return Object.values(trendsMap);
  }

  /**
   * Get overdue CRs
   */
  async getOverdueCRs(): Promise<any> {
    const crRepo = AppDataSource.getRepository(ChangeRequest);
    const now = new Date();

    return crRepo
      .createQueryBuilder("cr")
      .leftJoinAndSelect("cr.assignee", "assignee")
      .leftJoinAndSelect("cr.space", "space")
      .leftJoinAndSelect("cr.status", "status")
      .where("cr.dueDate < :now", { now })
      .orderBy("cr.dueDate", "ASC")
      .getMany();
  }
}
