import axiosInstance from "@/lib/axios";
import { Notification } from "@/lib/types";

export const notificationService = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },
};
