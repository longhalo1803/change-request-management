import { Button, Badge, Dropdown, Avatar } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * PM Header Component
 *
 * Top header for PM dashboard
 * Shows:
 * - Language switcher (left-aligned)
 * - Notification bell (center-right)
 * - User profile dropdown (right-aligned)
 */
export const PMHeader = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("auth.logout"),
    },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side - empty for future use */}
      <div />

      {/* Right side - Language Switcher + Notifications + User Menu */}
      <div className="flex items-center gap-4">
        <Badge count={5} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: 20 }} />}
            size="large"
          />
        </Badge>

        <LanguageSwitcher />

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.fullName || "PM"}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {user?.role || "role"}
              </div>
            </div>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default PMHeader;
