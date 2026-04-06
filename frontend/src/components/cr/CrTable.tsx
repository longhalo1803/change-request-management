import { Table, Button, Tag, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ChangeRequest, CrStatus } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

type ActorType = "customer" | "pm" | "admin";

interface CrTableProps {
  data: ChangeRequest[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (cr: ChangeRequest) => void;
  actorType?: ActorType;
}

const getStatusConfig = (status: CrStatus) => {
  const configMap: Record<CrStatus, { color: string; text: string }> = {
    [CrStatus.DRAFT]: { color: "default", text: "Draft" },
    [CrStatus.SUBMITTED]: { color: "blue", text: "Submitted" },
    [CrStatus.IN_DISCUSSION]: { color: "orange", text: "In Discussion" },
    [CrStatus.APPROVED]: { color: "green", text: "Approved" },
    [CrStatus.ONGOING]: { color: "processing", text: "Ongoing" },
    [CrStatus.REJECTED]: { color: "red", text: "Rejected" },
    [CrStatus.CLOSED]: { color: "default", text: "Closed" },
  };
  return configMap[status] || { color: "default", text: status };
};

const getPriorityConfig = (priority: string) => {
  const configMap: Record<
    string,
    { color: string; text: string; icon: string }
  > = {
    low: { color: "blue", text: "Low", icon: "↓" },
    medium: { color: "orange", text: "Medium", icon: "●" },
    high: { color: "red", text: "High", icon: "↑" },
    critical: { color: "purple", text: "Critical", icon: "⚠" },
  };
  return configMap[priority] || { color: "default", text: priority, icon: "" };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${month} ${day}, ${year} ${time}`;
};

/**
 * Shared Change Request Table Component
 * Used by Customer, PM, and Admin actors with role-specific column rendering
 */
export const CrTable: React.FC<CrTableProps> = ({
  data,
  loading,
  pagination,
  onPaginationChange,
  onDelete,
  onRowClick,
  actorType = "customer",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("cr-list");

  const columns = [
    {
      title: t("table.id"),
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (id: string) => (
        <span className="text-blue-600 font-medium">{id}</span>
      ),
    },
    {
      title: t("table.title"),
      key: "title",
      render: (_: any, record: ChangeRequest) => (
        <div>
          <div className="font-medium text-gray-900">{record.title}</div>
          <div className="text-sm text-gray-500">{record.description}</div>
        </div>
      ),
    },
    {
      title: t("table.priority"),
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: string) => {
        const config = getPriorityConfig(priority);
        return (
          <Tag color={config.color}>
            <span className="mr-1">{config.icon}</span>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: CrStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} className="px-3 py-1">
            {config.text}
          </Tag>
        );
      },
    },
    ...(actorType === "pm" || actorType === "admin"
      ? [
          {
            title: "Created By",
            key: "createdBy",
            width: 150,
            render: (_: any, record: ChangeRequest) => (
              <span className="text-gray-600">
                {record.createdBy?.fullName || "Unknown"}
              </span>
            ),
          },
        ]
      : []),
    {
      title: t("table.updated_at"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => (
        <span className="text-gray-600">{formatDate(date)}</span>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      width: 200,
      render: (_: any, record: ChangeRequest) => {
        // Customer: Show actions for Draft and In Discussion statuses
        if (actorType === "customer") {
          if (record.status === CrStatus.DRAFT) {
            return (
              <div className="flex gap-2">
                <Button
                  danger
                  size="small"
                  onClick={() => onDelete?.(record.id)}
                >
                  Delete
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => navigate(`/change-requests/${record.id}`)}
                >
                  Submit
                </Button>
              </div>
            );
          } else if (record.status === CrStatus.IN_DISCUSSION) {
            return (
              <div className="flex gap-2">
                <Button danger size="small">
                  Reject
                </Button>
                <Button
                  type="primary"
                  size="small"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                >
                  Approve
                </Button>
              </div>
            );
          } else if (record.status === CrStatus.SUBMITTED) {
            return (
              <span className="text-gray-400 text-sm">
                No actions available
              </span>
            );
          } else if (record.status === CrStatus.APPROVED) {
            return (
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/change-requests/${record.id}`)}
              />
            );
          }
        }

        // PM: Show view action for non-draft CRs
        if (actorType === "pm") {
          return (
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/change-requests/${record.id}`)}
            />
          );
        }

        // Admin: Show view action for all CRs
        if (actorType === "admin") {
          return (
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/change-requests/${record.id}`)}
            />
          );
        }

        return null;
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Table
        columns={columns as any}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey="id"
        size="middle"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: "pointer" },
        })}
      />

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {(pagination.current - 1) * pagination.pageSize + 1} -{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPaginationChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};
