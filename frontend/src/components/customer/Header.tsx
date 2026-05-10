import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

import { NotificationBell } from "@/components/shared/NotificationBell";

interface HeaderProps {
  onFilterClick?: () => void;
  onSearch?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      logout();
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: t("nav.profile"),
    },
    // {
    //   key: 'settings',
    //   label: t('nav.settings')
    // },
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
      {/* Empty left side or logo can go here */}
      <div className="flex items-center gap-4">
        {/* Removed GlobalSearch */}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <LanguageSwitcher />

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.fullName || "User"}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {user?.role || "Role"}
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
