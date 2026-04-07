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
export const getCreatorInfo = (cr: ChangeRequest): UserInfo | null => {
  // If creator object exists with fullName, return it
  if (
    cr.creator &&
    typeof cr.creator === "object" &&
    "fullName" in cr.creator
  ) {
    return cr.creator as UserInfo;
  }

  // If createdBy is a string and creator doesn't exist, return null (no user info available)
  return null;
};

/**
 * Get assignee info from ChangeRequest
 * Handles both string IDs and UserInfo objects
 */
export const getAssigneeInfo = (cr: ChangeRequest): UserInfo | null => {
  // If assignee object exists with fullName, return it
  if (
    cr.assignee &&
    typeof cr.assignee === "object" &&
    "fullName" in cr.assignee
  ) {
    return cr.assignee as UserInfo;
  }

  return null;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (
  user: UserInfo | null | undefined
): string => {
  if (!user) return "Unknown";
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
