/**
 * Change Request Helper Functions
 * Provides utilities to work with CR data that may have different structures
 */

import { ChangeRequest, UserInfo } from "@/lib/types";

/**
 * Get priority name from ChangeRequest
 * Handles both priorityId (string) and priority (object) formats
 */
export const getCrPriority = (cr: ChangeRequest): string => {
  // If priority object exists, return its name
  if (cr.priority && typeof cr.priority === "object" && "name" in cr.priority) {
    return cr.priority.name.toLowerCase();
  }

  // If priorityId is a string, try to infer from it
  if (cr.priorityId && typeof cr.priorityId === "string") {
    return cr.priorityId.toLowerCase();
  }

  return "medium";
};

/**
 * Get status name from ChangeRequest
 * Handles both statusId (string) and status (object) formats
 */
export const getCrStatus = (cr: ChangeRequest): string => {
  // If status object exists, return its name
  if (cr.status && typeof cr.status === "object" && "name" in cr.status) {
    return cr.status.name;
  }

  // If statusId is a string, return it
  if (cr.statusId && typeof cr.statusId === "string") {
    return cr.statusId;
  }

  return "UNKNOWN";
};

/**
 * Get user info from ChangeRequest field
 * Handles both string IDs and UserInfo objects
 */
export const getCreatorInfo = (cr: any): UserInfo | null => {
  // Check if createdBy is a populated object
  if (cr.createdBy && typeof cr.createdBy === "object") {
    return cr.createdBy as UserInfo;
  }
  // Check if creator object exists
  if (cr.creator && typeof cr.creator === "object") {
    return cr.creator as UserInfo;
  }
  return null;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (
  user: any
): string => {
  if (!user) return "Unknown";
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  return user.fullName || user.email || "Unknown";
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (name: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get avatar color based on name
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#52c41a",
    "#eb2f96",
  ];
  if (!name) return colors[0];
  const hash = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  return colors[hash % colors.length];
};
