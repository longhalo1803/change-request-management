export enum UserRole {
  ADMIN = "admin",
  PM = "pm",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
