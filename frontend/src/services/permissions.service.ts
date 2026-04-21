import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type {
  PermissionGroup,
  AdminUser,
  UserFormData,
  UserStatus,
} from "@/lib/types";

export const permissionsService = {
  async fetchPermissionGroups(): Promise<PermissionGroup[]> {
    const response = await axiosInstance.get<ApiResponse<PermissionGroup[]>>(
      "/permissions/groups"
    );
    return response.data.data;
  },

  async createPermissionGroup(
    data: Partial<PermissionGroup>
  ): Promise<PermissionGroup> {
    const response = await axiosInstance.post<ApiResponse<PermissionGroup>>(
      "/permissions/groups",
      data
    );
    return response.data.data;
  },

  async updatePermissionGroup(
    id: string,
    data: Partial<PermissionGroup>
  ): Promise<PermissionGroup> {
    const response = await axiosInstance.put<ApiResponse<PermissionGroup>>(
      `/permissions/groups/${id}`,
      data
    );
    return response.data.data;
  },

  async fetchUsers(): Promise<AdminUser[]> {
    const response =
      await axiosInstance.get<ApiResponse<AdminUser[]>>("/users");
    return response.data.data;
  },

  async createUser(data: UserFormData): Promise<AdminUser> {
    const response = await axiosInstance.post<ApiResponse<AdminUser>>(
      "/users",
      data
    );
    return response.data.data;
  },

  async updateUser(id: string, data: UserFormData): Promise<AdminUser> {
    const response = await axiosInstance.put<ApiResponse<AdminUser>>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },




  async updateUserStatus(id: string, status: UserStatus): Promise<AdminUser> {
    const response = await axiosInstance.patch<ApiResponse<AdminUser>>(
      `/users/${id}/status`,
      { status }
    );
    return response.data.data;
  },
};
