import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";

export const dashboardService = {
  async getStats(filters?: any): Promise<any> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      "/dashboard/stats",
      { params: filters }
    );
    return response.data.data;
  },

  async getStatusOverview(filters?: any): Promise<any> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      "/dashboard/status-overview",
      { params: filters }
    );
    return response.data.data;
  },

  async getRecentActivities(filters?: any): Promise<any> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      "/dashboard/recent-activities",
      { params: filters }
    );
    return response.data.data;
  },
};
