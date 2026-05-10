import { ChangeRequestStatus } from "@/lib/types";

export interface CrStatusConfig {
  label: string;
  color: string;
  icon: string;
}

export const CR_STATUS_CONFIG: Record<string, CrStatusConfig> = {
  [ChangeRequestStatus.DRAFT]: {
    label: "Draft",
    color: "#d9d9d9",
    icon: "FileTextOutlined",
  },
  [ChangeRequestStatus.SUBMITTED]: {
    label: "Submitted",
    color: "#1890ff",
    icon: "SendOutlined",
  },
  [ChangeRequestStatus.IN_DISCUSSION]: {
    label: "In Discussion",
    color: "#722ed1",
    icon: "SearchOutlined",
  },
  [ChangeRequestStatus.APPROVED]: {
    label: "Approved",
    color: "#52c41a",
    icon: "CheckCircleOutlined",
  },
  [ChangeRequestStatus.REJECTED]: {
    label: "Rejected",
    color: "#13c2c2",
    icon: "SyncOutlined",
  },
  [ChangeRequestStatus.ON_GOING]: {
    label: "On going",
    color: "#52c41a",
    icon: "CheckOutlined",
  },
  [ChangeRequestStatus.CLOSED]: {
    label: "Closed",
    color: "#8c8c8c",
    icon: "CheckOutlined",
  },
};

export const getCrStatusLabel = (status: string): string => {
  return CR_STATUS_CONFIG[status]?.label || status;
};

export const getCrStatusColor = (status: string): string => {
  return CR_STATUS_CONFIG[status]?.color || "#d9d9d9";
};
