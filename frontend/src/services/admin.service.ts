import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type { DashboardStats } from "@/lib/types/admin.types";

export const adminService = {
  async fetchDashboardStats(filters: {
    dateRange: string;
    customer: string;
    pm: string;
  }): Promise<DashboardStats> {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard/stats",
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
