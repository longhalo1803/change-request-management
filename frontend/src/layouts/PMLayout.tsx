import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { PMSidebar } from "@/components/pm/PMSidebar";
import { PMHeader } from "@/components/pm/PMHeader";

const { Content } = Layout;

/**
 * PM Layout Component
 *
 * Main layout for PM dashboard
 * Similar to AdminLayout but for PM users
 *
 * Features:
 * - Fixed white sidebar (240px width)
 * - PM header with language switcher + notifications
 * - Content area with light gray background
 */
export const PMLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PMSidebar />

      <Layout style={{ marginLeft: 240 }}>
        <PMHeader />

        <Content
          style={{
            padding: "24px",
            background: "#ffffff",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PMLayout;
