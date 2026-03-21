import { useMemo } from 'react';
import { UserRole, CrStatus } from '@/lib/types/cr.types';
import { CR_STATUS_CONFIG } from '@/lib/constants/cr-status';

export const useVisibility = (userRole?: UserRole) => {
  return useMemo(() => {
    if (!userRole) {
      return {
        canSeeQuotation: false,
        canSeeInternalComment: false,
        canSeeBrseComment: false,
        canTriggerAction: () => false,
        canManageUsers: false
      };
    }

    const canSeeQuotation = userRole === UserRole.BRSE || userRole === UserRole.ADMIN;
    
    const canSeeInternalComment = 
      userRole === UserRole.BRSE || 
      userRole === UserRole.DEVELOPER || 
      userRole === UserRole.QA || 
      userRole === UserRole.ADMIN;
    
    const canSeeBrseComment = userRole === UserRole.BRSE || userRole === UserRole.ADMIN;
    
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
      canSeeBrseComment,
      canTriggerAction,
      canManageUsers
    };
  }, [userRole]);
};
