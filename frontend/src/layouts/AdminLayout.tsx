import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

const { Content } = Layout;

/**
 * Admin Layout Component
 *
 * Main layout for admin dashboard
 * Similar to CustomerLayout but for admin users
 *
 * Features:
 * - Fixed white sidebar (240px width)
 * - Admin header with language switcher + notifications
 * - Content area with light gray background
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages admin layout structure
 * - Open/Closed: Easy to extend with new sections
 */
export const AdminLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar />

      <Layout style={{ marginLeft: 240 }}>
        <AdminHeader />

        <Content
          style={{
            padding: "24px",
            background: "#f5f5f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
