import React from "react";
import { Badge, Button, Dropdown, MenuProps, Empty, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNotificationClick = async (
    id: string,
    relatedId: string | null
  ) => {
    await markAsRead(id);
    if (relatedId) {
      navigate(`/cr/${relatedId}`);
    }
  };

  const menuItems: MenuProps["items"] =
    notifications.length > 0
      ? notifications.map((n) => ({
          key: n.id,
          label: (
            <div
              className={`py-2 px-1 max-w-xs ${!n.isRead ? "font-semibold" : ""}`}
              onClick={() => handleNotificationClick(n.id, n.relatedId)}
            >
              <Typography.Text strong={!n.isRead} className="block mb-1">
                {n.title}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                className="block text-xs whitespace-normal break-words line-clamp-2"
              >
                {n.message}
              </Typography.Text>
            </div>
          ),
        }))
      : [
          {
            key: "empty",
            label: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("notifications.empty", "No notifications")}
              />
            ),
            disabled: true,
          },
        ];

  const menuProps = {
    items: menuItems,
    className: "max-h-96 overflow-y-auto shadow-lg",
  };

  return (
    <Dropdown menu={menuProps} placement="bottomRight" trigger={["click"]}>
      <Badge
        count={unreadCount}
        size="small"
        dot={false}
        showZero={false}
        className="cursor-pointer"
      >
        <Button
          type="text"
          icon={
            <div className="relative">
              <BellOutlined style={{ fontSize: 20 }} />
            </div>
          }
          size="large"
          className="flex items-center justify-center"
        />
      </Badge>
    </Dropdown>
  );
};
