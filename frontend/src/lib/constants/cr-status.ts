import { CrStatus, UserRole } from '@/lib/types';

export interface CrStatusConfig {
  label: string;
  color: string;
  icon: string;
  allowedActions: {
    [key in UserRole]?: string[];
  };
}

export const CR_STATUS_CONFIG: Record<CrStatus, CrStatusConfig> = {
  [CrStatus.DRAFT]: {
    label: 'Nháp',
    color: '#d9d9d9',
    icon: 'FileTextOutlined',
    allowedActions: {
      [UserRole.CUSTOMER]: ['submit']
    }
  },
  [CrStatus.SUBMITTED]: {
    label: 'Đã gửi',
    color: '#1890ff',
    icon: 'SendOutlined',
    allowedActions: {
      [UserRole.PM]: ['accept', 'reject']
    }
  },
  [CrStatus.UNDER_ANALYSIS]: {
    label: 'Đang phân tích',
    color: '#722ed1',
    icon: 'SearchOutlined',
    allowedActions: {
      [UserRole.PM]: ['request-info', 'submit-quotation']
    }
  },
  [CrStatus.PENDING_INFO]: {
    label: 'Chờ thông tin',
    color: '#fa8c16',
    icon: 'QuestionCircleOutlined',
    allowedActions: {
      [UserRole.CUSTOMER]: ['submit']
    }
  },
  [CrStatus.PENDING_APPROVAL]: {
    label: 'Chờ phê duyệt',
    color: '#faad14',
    icon: 'ClockCircleOutlined',
    allowedActions: {
      [UserRole.CUSTOMER]: ['approve', 'reject']
    }
  },
  [CrStatus.APPROVED]: {
    label: 'Đã phê duyệt',
    color: '#52c41a',
    icon: 'CheckCircleOutlined',
    allowedActions: {
      [UserRole.PM]: ['start']
    }
  },
  [CrStatus.ONGOING]: {
    label: 'Đang thực hiện',
    color: '#13c2c2',
    icon: 'SyncOutlined',
    allowedActions: {
      [UserRole.PM]: ['block', 'close'],
      [UserRole.DEVELOPER]: ['block']
    }
  },
  [CrStatus.BLOCKED]: {
    label: 'Bị chặn',
    color: '#f5222d',
    icon: 'StopOutlined',
    allowedActions: {
      [UserRole.PM]: ['unblock']
    }
  },
  [CrStatus.REJECTED]: {
    label: 'Từ chối',
    color: '#ff4d4f',
    icon: 'CloseCircleOutlined',
    allowedActions: {}
  },
  [CrStatus.CLOSED]: {
    label: 'Đã đóng',
    color: '#8c8c8c',
    icon: 'CheckOutlined',
    allowedActions: {}
  }
};

export const getCrStatusLabel = (status: CrStatus): string => {
  return CR_STATUS_CONFIG[status]?.label || status;
};

export const getCrStatusColor = (status: CrStatus): string => {
  return CR_STATUS_CONFIG[status]?.color || '#d9d9d9';
};
