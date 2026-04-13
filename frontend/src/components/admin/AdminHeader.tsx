import { Button, Badge, Dropdown, Avatar } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Admin Header Component
 *
 * Top header for admin dashboard
 * Shows:
 * - Language switcher (left-aligned)
 * - Notification bell (right-aligned)
 * - User profile dropdown (right-aligned)
 */
export const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/admin/profile");
    } else if (key === "logout") {
      logout();
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: t("nav.profile"),
    },
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

      {/* Right side - Language Switcher + Notifications + Profile */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <Badge count={5} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: 20 }} />}
            size="large"
          />
        </Badge>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.fullName || "Admin"}
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminHeader;
