import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type {
  DashboardStats,
  CustomerData,
  MonthlyVolumeTrend,
} from "@/lib/types/admin.types";

export const adminService = {
  async getComprehensiveStats(filters: {
    dateRange: string;
    customer: string;
    pm: string;
  }): Promise<Omit<DashboardStats, "top5Customers" | "crVolumeTrends">> {
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

  async getTopCustomers(filters: {
    dateRange: string;
    customer: string;
    pm: string;
  }): Promise<CustomerData[]> {
    const response = await axiosInstance.get<ApiResponse<CustomerData[]>>(
      "/admin/dashboard/top-customers",
      { params: filters }
    );
    return response.data.data;
  },

  async getVolumeTrends(filters: {
    dateRange: string;
    customer: string;
    pm: string;
  }): Promise<MonthlyVolumeTrend[]> {
    const response = await axiosInstance.get<ApiResponse<MonthlyVolumeTrend[]>>(
      "/admin/dashboard/volume-trends",
      { params: filters }
    );
    return response.data.data;
  },

  async exportDashboardAsPDF(): Promise<Blob> {
    const response = await axiosInstance.get("/admin/dashboard/export", {
      responseType: "blob",
    });
    return response.data;
  },
};
