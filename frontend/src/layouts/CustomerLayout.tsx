import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { Header } from "@/components/customer/Header";

const { Content } = Layout;

export const CustomerLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomerSidebar />

      <Layout style={{ marginLeft: 240 }}>
        <Header />

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
