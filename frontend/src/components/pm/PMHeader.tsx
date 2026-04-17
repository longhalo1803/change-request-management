import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { NotificationBell } from "@/components/shared/NotificationBell";
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
  const { t: tCommon } = useTranslation("common");
  const { t: tPm } = useTranslation("pm");
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/pm/update-profile");
    } else if (key === "logout") {
      logout();
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: tPm("header.profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: tCommon("auth.logout"),
    },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side - empty for future use */}
      <div />

      {/* Right side - Language Switcher + Notifications + User Menu */}
      <div className="flex items-center gap-4">
        <NotificationBell />

        <LanguageSwitcher />

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.fullName || tPm("sidebar.pm_user")}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {user?.role}
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
