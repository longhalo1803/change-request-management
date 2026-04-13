import { Layout, Menu, Avatar } from "antd";
import { DashboardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Logo } from "@/components/shared/Logo";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserRole } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

const { Sider } = Layout;

/**
 * PM Sidebar Component
 *
 * White sidebar navigation for PM dashboard
 * Shows:
 * - Logo component
 * - PM avatar + name/role
 * - Navigation menu (Dashboard, Projects, Team)
 * - Logout at bottom
 */
export const PMSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { t: tPm } = useTranslation("pm");

  const getSelectedKey = () => {
    if (location.pathname.includes("dashboard")) return "dashboard";
    if (location.pathname.includes("crlist")) return "cr-list";
    if (location.pathname.includes("update-profile")) return "profile";
    return "dashboard";
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: tPm("sidebar.dashboard"),
      onClick: () => navigate("/pm/dashboard"),
    },
    {
      key: "cr-list",
      icon: <FileTextOutlined />,
      label: tPm("sidebar.cr_list"),
      onClick: () => navigate("/pm/crlist"),
    },
  ];

  return (
    <Sider
      width={240}
      style={{
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#fafafa",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Logo size="small" showSubtitle={false} />
      </div>

      {/* PM Info Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {user?.fullName || tPm("sidebar.pm_user")}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider truncate">
              {user?.role === UserRole.PM
                ? tPm("sidebar.project_manager")
                : user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div style={{ height: "calc(100vh - 165px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            border: "none",
            background: "#fafafa",
          }}
        />
      </div>
    </Sider>
  );
};

export default PMSidebar;
