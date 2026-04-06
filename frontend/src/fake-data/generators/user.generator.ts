/**
 * User Data Generator
 */

import { AdminUser, UserRole, UserStatus } from "@/lib/types";
import { FIXED_USER_NAMES } from "../constants/names";
import { generateFixedPhoneNumber } from "./common";

/**
 * Generate fixed users (consistent across reloads)
 */
export const generateFixedUsers = () => {
  const users: AdminUser[] = [];

  // Generate admin users
  FIXED_USER_NAMES.admins.forEach((name, index) => {
    users.push({
      id: `admin-${index + 1}`,
      firstName: name.first,
      lastName: name.last,
      email: `admin${index + 1}@solashi.com`,
      phone: generateFixedPhoneNumber("091", index + 1),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      createdDate: new Date(2025, 9, 15 + index * 5), // October 15, 20, ...
      avatar: `${name.first.charAt(0)}${name.last.charAt(0)}`.toUpperCase(),
    });
  });

  // Generate PM users
  FIXED_USER_NAMES.pms.forEach((name, index) => {
    users.push({
      id: `pm-${index + 1}`,
      firstName: name.first,
      lastName: name.last,
      email: `pm${index + 1}@solashi.com`,
      phone: generateFixedPhoneNumber("091", 100 + index + 1),
      role: UserRole.PM,
      status: index === 3 ? UserStatus.INACTIVE : UserStatus.ACTIVE, // pm-4 is inactive
      createdDate: new Date(2025, 10, 1 + index * 5), // November 1, 6, 11, 16, ...
      avatar: `${name.first.charAt(0)}${name.last.charAt(0)}`.toUpperCase(),
    });
  });

  // Generate customer users
  FIXED_USER_NAMES.customers.forEach((name, index) => {
    users.push({
      id: `customer-${index + 1}`,
      firstName: name.first,
      lastName: name.last,
      email: `customer${index + 1}@client.com`,
      phone: generateFixedPhoneNumber("091", 200 + index + 1),
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      createdDate: new Date(2025, 8, 1 + index * 5), // September 1, 6, 11, ...
      avatar: `${name.first.charAt(0)}${name.last.charAt(0)}`.toUpperCase(),
    });
  });

  return users;
};
