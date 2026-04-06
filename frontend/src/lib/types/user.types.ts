export enum UserRole {
  ADMIN = "ADMIN",
  PM = "PM",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
