import { CrStatus, UserRole } from "@/lib/types";

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
    label: "Nháp",
    color: "#d9d9d9",
    icon: "FileTextOutlined",
    allowedActions: {
      [UserRole.CUSTOMER]: ["submit"],
    },
  },
  [CrStatus.SUBMITTED]: {
    label: "Đã gửi",
    color: "#1890ff",
    icon: "SendOutlined",
    allowedActions: {
      [UserRole.PM]: ["accept", "reject"],
    },
  },
  [CrStatus.IN_DISCUSSION]: {
    label: "Đang thảo luận",
    color: "#722ed1",
    icon: "SearchOutlined",
    allowedActions: {
      [UserRole.PM]: ["request-info", "submit-quotation"],
    },
  },
  [CrStatus.APPROVED]: {
    label: "Đã phê duyệt",
    color: "#52c41a",
    icon: "CheckCircleOutlined",
    allowedActions: {
      [UserRole.PM]: ["start"],
    },
  },
  [CrStatus.ONGOING]: {
    label: "Đang thực hiện",
    color: "#13c2c2",
    icon: "SyncOutlined",
    allowedActions: {
      [UserRole.PM]: ["block", "close"],
    },
  },
  [CrStatus.REJECTED]: {
    label: "Từ chối",
    color: "#ff4d4f",
    icon: "CloseCircleOutlined",
    allowedActions: {},
  },
  [CrStatus.CLOSED]: {
    label: "Đã đóng",
    color: "#8c8c8c",
    icon: "CheckOutlined",
    allowedActions: {},
  },
};

export const getCrStatusLabel = (status: CrStatus): string => {
  return CR_STATUS_CONFIG[status]?.label || status;
};

export const getCrStatusColor = (status: CrStatus): string => {
  return CR_STATUS_CONFIG[status]?.color || "#d9d9d9";
};
