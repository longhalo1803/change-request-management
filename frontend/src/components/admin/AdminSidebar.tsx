import { Layout, Menu, Avatar } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/shared/Logo";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Sider } = Layout;

/**
 * Admin Sidebar Component
 *
 * White sidebar navigation for admin dashboard
 * Shows:
 * - Logo component
 * - Admin avatar + name/role
 * - Navigation menu (Dashboard, CR List, Permissions)
 * - Logout at bottom
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages admin navigation
 * - Open/Closed: Easy to add new admin menu items
 * - Dependency Inversion: Uses Logo component
 */
export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuth();

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
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "cr-list",
      icon: <FileTextOutlined />,
      label: "CR List",
      onClick: () => navigate("/admin/change-requests"),
    },
    {
      key: "permissions",
      icon: <LockOutlined />,
      label: "Permissions",
      onClick: () => navigate("/admin/permissions"),
    },
  ];

  return (
    <Sider
      width={240}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Logo size="small" showSubtitle={false} />
      </div>

      {/* Admin Info Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {user?.fullName || "Admin User"}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider truncate">
              {user?.role === "admin" ? "Administrator" : user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          border: "none",
          background: "#ffffff",
        }}
      />

      {/* Logout Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
        >
          🚪 Logout
        </button>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
