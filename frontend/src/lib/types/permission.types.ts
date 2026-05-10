import { UserRole as BaseUserRole } from "./user.types";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: BaseUserRole;
  status: UserStatus;
  createdDate: Date;
  avatar?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  roleType: BaseUserRole;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  action: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: BaseUserRole;
  password?: string;
}

export interface SearchFilters {
  searchTerm?: string;
  status?: UserStatus;
  role?: BaseUserRole;
}
