/**
 * PermissionsTable Component
 * Displays users table with Avatar+Name, Email, Role, Created Date, Status, Actions
 */

import {
  Table,
  Badge,
  Avatar,
  Dropdown,
  Button,
  Space,
  Spin,
  Empty,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { AdminUser, UserRole, UserStatus } from "@/lib/types";
import type { ColumnsType } from "antd/es/table";

interface PermissionsTableProps {
  data: AdminUser[];
  loading: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: UserStatus) => void;
}

const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "#1890FF"; // Blue
    case UserRole.PM:
      return "#52C41A"; // Green
    case UserRole.CUSTOMER:
      return "#FFA940"; // Orange
    default:
      return "#999";
  }
};

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrator";
    case UserRole.PM:
      return "Project Manager";
    case UserRole.CUSTOMER:
      return "Customer";
    default:
      return role;
  }
};

const getStatusBadgeColor = (status: UserStatus): "success" | "warning" => {
  return status === UserStatus.ACTIVE ? "success" : "warning";
};

const getStatusLabel = (status: UserStatus): string => {
  return status === UserStatus.ACTIVE ? "Active" : "Inactive";
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const PermissionsTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: PermissionsTableProps) => {
  const columns: ColumnsType<AdminUser> = [
    {
      title: "Name",
      key: "name",
      width: "20%",
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            style={{ backgroundColor: getRoleBadgeColor(record.role) }}
          >
            {record.avatar}
          </Avatar>
          <div>
            <div className="font-medium">
              {record.firstName} {record.lastName}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "15%",
      render: (role: UserRole) => (
        <Badge color={getRoleBadgeColor(role)} text={getRoleLabel(role)} />
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: "15%",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: UserStatus) => (
        <Badge
          status={getStatusBadgeColor(status)}
          text={getStatusLabel(status)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      align: "center" as const,
      render: (_, record) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit",
            onClick: () => onEdit(record),
          },
          ...(record.status === UserStatus.ACTIVE
            ? [
                {
                  key: "deactivate",
                  label: "Deactivate",
                  onClick: () => onStatusChange(record.id, UserStatus.INACTIVE),
                  danger: true,
                },
              ]
            : [
                {
                  key: "activate",
                  label: "Activate",
                  onClick: () => onStatusChange(record.id, UserStatus.ACTIVE),
                },
              ]),
          {
            key: "delete",
            label: "Delete",
            danger: true,
            onClick: () => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${record.firstName} ${record.lastName}?`
                )
              ) {
                onDelete(record.id);
              }
            },
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<EllipsisOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Empty description="No users found" />;
  }

  return (
    <Table
      columns={columns}
      dataSource={Array.isArray(data) ? data : []}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showTotal: (total) => `Total ${total} users`,
      }}
      className="bg-white"
      style={{ borderRadius: "8px" }}
    />
  );
};
