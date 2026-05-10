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
import { useTranslation } from "@/hooks/useTranslation";

interface PermissionsTableProps {
  data: AdminUser[];
  loading: boolean;
  onEdit: (user: AdminUser) => void;
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

const getStatusBadgeColor = (status: UserStatus): "success" | "warning" => {
  return status === UserStatus.ACTIVE ? "success" : "warning";
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
  onStatusChange,
}: PermissionsTableProps) => {
  const { t } = useTranslation("admin");
  
  const columns: ColumnsType<AdminUser> = [
    {
      title: t("permissions.columns.name"),
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
      title: t("permissions.columns.email"),
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: t("permissions.columns.role"),
      dataIndex: "role",
      key: "role",
      width: "15%",
      render: (role: UserRole) => (
        <Badge
          color={getRoleBadgeColor(role)}
          text={
            role === UserRole.ADMIN
              ? t("permissions.roles.admin")
              : role === UserRole.PM
              ? t("permissions.roles.pm")
              : t("permissions.roles.customer")
          }
        />
      ),
    },
    {
      title: t("permissions.columns.created_date"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: "15%",
      render: (date: Date) => formatDate(date),
    },
    {
      title: t("permissions.columns.status"),
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: UserStatus) => (
        <Badge
          status={getStatusBadgeColor(status)}
          text={
            status === UserStatus.ACTIVE
              ? t("permissions.status.active")
              : t("permissions.status.inactive")
          }
        />
      ),
    },
    {
      title: t("permissions.columns.actions"),
      key: "actions",
      width: "10%",
      align: "center" as const,
      render: (_, record) => {
        const menuItems = [
          {
            key: "edit",
            label: t("permissions.actions.edit"),
            onClick: () => onEdit(record),
          },
          ...(record.status === UserStatus.ACTIVE
            ? [
                {
                  key: "deactivate",
                  label: t("permissions.actions.deactivate"),
                  onClick: () => onStatusChange(record.id, UserStatus.INACTIVE),
                  danger: true,
                },
              ]
            : [
                {
                  key: "activate",
                  label: t("permissions.actions.activate"),
                  onClick: () => onStatusChange(record.id, UserStatus.ACTIVE),
                },
              ]),
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
    return <Empty description={t("permissions.no_users")} />;
  }

  return (
    <Table
      columns={columns}
      dataSource={Array.isArray(data) ? data : []}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showTotal: (total) => t("permissions.total_users", { total }),
      }}
      className="bg-white"
      style={{ borderRadius: "8px" }}
    />
  );
};
