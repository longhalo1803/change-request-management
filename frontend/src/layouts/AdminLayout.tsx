import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Header } from '@/components/Header';

const { Content } = Layout;

/**
 * Admin Layout Component
 * 
 * Main layout for admin dashboard
 * Similar to CustomerLayout but for admin users
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages admin layout structure
 * - Open/Closed: Easy to extend with new sections
 */
export const AdminLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar />

      <Layout style={{ marginLeft: 240 }}>
        <Header />

        <Content 
          style={{ 
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
