import { useMemo } from 'react';
import { UserRole, CrStatus } from '@/lib/types';
import { CR_STATUS_CONFIG } from '@/lib/constants/cr-status';

export const useVisibility = (userRole?: UserRole) => {
  return useMemo(() => {
    if (!userRole) {
      return {
        canSeeQuotation: false,
        canSeeInternalComment: false,
        canSeePmComment: false,
        canTriggerAction: () => false,
        canManageUsers: false
      };
    }

    const canSeeQuotation = userRole === UserRole.PM || userRole === UserRole.ADMIN;
    
    const canSeeInternalComment = 
      userRole === UserRole.PM || 
      userRole === UserRole.DEVELOPER || 
      userRole === UserRole.QA || 
      userRole === UserRole.ADMIN;
    
    const canSeePmComment = userRole === UserRole.PM || userRole === UserRole.ADMIN;
    
    const canManageUsers = userRole === UserRole.ADMIN;

    const canTriggerAction = (action: string, currentStatus: CrStatus): boolean => {
      const statusConfig = CR_STATUS_CONFIG[currentStatus];
      if (!statusConfig) return false;

      const allowedActions = statusConfig.allowedActions[userRole] || [];
      return allowedActions.includes(action);
    };

    return {
      canSeeQuotation,
      canSeeInternalComment,
      canSeePmComment,
      canTriggerAction,
      canManageUsers
    };
  }, [userRole]);
};

