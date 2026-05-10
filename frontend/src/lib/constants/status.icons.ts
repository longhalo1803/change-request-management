import {
  FileTextOutlined,
  SendOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { ChangeRequestStatus } from "@/lib/types";

/**
 * Status icons mapping
 * Uses Ant Design icon components
 */
export const STATUS_ICONS: Record<string, React.FC<any>> = {
  [ChangeRequestStatus.DRAFT]: FileTextOutlined,
  [ChangeRequestStatus.SUBMITTED]: SendOutlined,
  [ChangeRequestStatus.IN_DISCUSSION]: SearchOutlined,
  [ChangeRequestStatus.APPROVED]: CheckCircleOutlined,
  [ChangeRequestStatus.REJECTED]: CheckOutlined,
  [ChangeRequestStatus.ON_GOING]: SyncOutlined,
  [ChangeRequestStatus.CLOSED]: CheckOutlined,
};
