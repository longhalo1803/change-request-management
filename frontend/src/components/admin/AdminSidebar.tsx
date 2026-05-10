import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import type { MenuProps } from "antd";
import { useTranslation } from "@/hooks/useTranslation";

const { Sider } = Layout;

/**
 * Admin Sidebar Component
 *
 * White sidebar navigation for admin dashboard
 * Shows:
 * - Logo component
 * - Navigation menu (Dashboard, CR List, Permissions)
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages admin navigation
 * - Open/Closed: Easy to add new admin menu items
 * - Dependency Inversion: Uses Logo component
 */
export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const getSelectedKey = () => {
    if (location.pathname.includes("dashboard")) return "dashboard";
    if (location.pathname.includes("change-requests")) return "cr-list";
    if (location.pathname.includes("permissions")) return "permissions";
    return "dashboard";
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: t("nav.dashboard"),
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "cr-list",
      icon: <FileTextOutlined />,
      label: t("nav.change_requests"),
      onClick: () => navigate("/admin/change-requests"),
    },
    {
      key: "permissions",
      icon: <LockOutlined />,
      label: t("nav.permissions"),
      onClick: () => navigate("/admin/permissions"),
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

      {/* Main Menu */}
      <div style={{ height: "calc(100vh - 65px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            border: "none",
            background: "#fafafa",
            paddingTop: 16,
          }}
        />
      </div>
    </Sider>
  );
};

export default AdminSidebar;
