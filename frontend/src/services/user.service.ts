import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type { User } from "@/lib/types";

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  async updateMyProfile(data: UpdateProfileData): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      "/users/me",
      data
    );
    return response.data.data;
  },

  async changePassword(
    userId: string,
    data: ChangePasswordData
  ): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>(
      `/users/${userId}/change-password`,
      data
    );
  },
};
