import { Table, Button, Tag, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import {
  getCrPriority,
  getCrStatus,
  getCreatorInfo,
  getUserDisplayName,
} from "@/lib/helpers/cr.helpers";
import { getStatusConfig, getPriorityConfig } from "@/lib/constants";
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
      dataIndex: "crKey",
      key: "crKey",
      width: 140,
      render: (crKey: string) => (
        <span className="text-blue-600 font-medium">{crKey}</span>
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
      key: "priority",
      width: 100,
      render: (_: any, record: ChangeRequest) => {
        const priorityName = getCrPriority(record);
        const config = getPriorityConfig(priorityName);
        return (
          <Tag color={config.color}>
            {config.icon} {config.label}
          </Tag>
        );
      },
    },
    {
      title: t("table.status"),
      key: "status",
      width: 120,
      render: (_: any, record: ChangeRequest) => {
        const status = getCrStatus(record);
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    ...(actorType === "pm" || actorType === "admin"
      ? [
          {
            title: "Created By",
            key: "createdBy",
            width: 150,
            render: (_: any, record: ChangeRequest) => {
              const creatorInfo = getCreatorInfo(record);
              const creatorName = getUserDisplayName(creatorInfo);
              return <span className="text-gray-600">{creatorName}</span>;
            },
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
        const statusId = record.statusId;

        // Customer: Show actions for Draft and In Discussion statuses
        if (actorType === "customer") {
          if (statusId === ChangeRequestStatus.DRAFT) {
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
          } else if (statusId === ChangeRequestStatus.IN_DISCUSSION) {
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
          } else if (statusId === ChangeRequestStatus.SUBMITTED) {
            return (
              <span className="text-gray-400 text-sm">
                No actions available
              </span>
            );
          } else if (statusId === ChangeRequestStatus.APPROVED) {
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
