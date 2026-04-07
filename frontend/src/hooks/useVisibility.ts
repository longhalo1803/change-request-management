import { useMemo } from "react";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PM = "PM",
  ADMIN = "ADMIN",
}

export const useVisibility = (userRole?: UserRole) => {
  return useMemo(() => {
    if (!userRole) {
      return {
        canSeeQuotation: false,
        canSeeInternalComment: false,
        canSeePmComment: false,
        canTriggerAction: () => false,
        canManageUsers: false,
      };
    }

    const canSeeQuotation =
      userRole === UserRole.PM || userRole === UserRole.ADMIN;

    const canSeeInternalComment =
      userRole === UserRole.PM || userRole === UserRole.ADMIN;

    const canSeePmComment =
      userRole === UserRole.PM || userRole === UserRole.ADMIN;

    const canManageUsers = userRole === UserRole.ADMIN;

    const canTriggerAction = (
      _action: string,
      _currentStatus: string
    ): boolean => {
      // Implement action checking logic as needed
      return false;
    };

    return {
      canSeeQuotation,
      canSeeInternalComment,
      canSeePmComment,
      canTriggerAction,
      canManageUsers,
    };
  }, [userRole]);
};
