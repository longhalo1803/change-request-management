import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type { DashboardStats } from "@/lib/types/admin.types";

export const adminService = {
  async fetchDashboardStats(filters: {
    dateRange: string;
    customer: string;
    pm: string;
  }): Promise<DashboardStats> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      "/admin/dashboard/stats",
      { params: filters }
    );

    const backendData = response.data.data;

    const crOverview = backendData.overview?.changeRequests || {
      total: 0,
      byStatus: [],
    };
    const userOverview = backendData.overview?.users || {
      total: 0,
      active: 0,
      byRole: [],
    };

    const totalCRs = crOverview.total || 0;

    const statusBreakdown = crOverview.byStatus.map((item: any) => ({
      status: item.statusName?.toLowerCase() || "unknown",
      count: parseInt(item.count) || 0,
      percentage:
        totalCRs > 0 ? Math.round((parseInt(item.count) / totalCRs) * 100) : 0,
      color: item.color || "#ccc",
    }));

    const pmCount =
      userOverview.byRole.find((r: any) => r.role === "pm")?.count || 0;
    const adminCount =
      userOverview.byRole.find((r: any) => r.role === "admin")?.count || 0;
    const customerCount =
      userOverview.byRole.find((r: any) => r.role === "customer")?.count || 0;

    return {
      totalCRs,
      statusBreakdown,
      processEfficiency: {
        rejectedRate: 5,
        overdueOngoing: backendData.overdueCRs?.length || 0,
        customerCancellation: 2,
      },
      userManagement: {
        new30Days: 12,
        activeRatio:
          userOverview.total > 0
            ? Math.round((userOverview.active / userOverview.total) * 100)
            : 0,
        customers: parseInt(customerCount),
        pm: parseInt(pmCount),
        admin: parseInt(adminCount),
      },
      top5Customers: [
        { name: "Acme Corp", crCount: 15 },
        { name: "Globex", crCount: 10 },
        { name: "Initech", crCount: 8 },
        { name: "Umbrella", crCount: 5 },
        { name: "Massive Dynamic", crCount: 3 },
      ],
      crVolumeTrends: [
        { month: "Jan", critical: 2, high: 5, medium: 10, low: 15, total: 32 },
        { month: "Feb", critical: 1, high: 3, medium: 12, low: 18, total: 34 },
        { month: "Mar", critical: 3, high: 6, medium: 15, low: 20, total: 44 },
      ],
      growthMetrics: {
        comparison: "vs last month",
        percentage: 12,
      },
      priorityAlert: {
        description: "Critical CRs requiring immediate attention",
        value: "3",
      },
      healthIndex: {
        description: "Overall system health based on CR resolution times",
        ratio: "92/100",
      },
    };
  },

  async exportDashboardAsPDF(): Promise<Blob> {
    const response = await axiosInstance.get("/admin/dashboard/export", {
      responseType: "blob",
    });
    return response.data;
  },
};
