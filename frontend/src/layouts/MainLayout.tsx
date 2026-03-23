/**
 * MainLayout Component
 * 
 * Main application layout with sidebar and header
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages layout structure
 * - Open/Closed: Easy to customize layout variants
 */

import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

const { Content } = Layout;

interface MainLayoutProps {
  onCreateCr?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />

      {/* Main Content Area */}
      <Layout style={{ marginLeft: 240 }}>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Content 
          style={{ 
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <Outlet />
        </Content>


        {/* <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24 }}
          onClick={onCreateCr}
          tooltip="Create New CR"
        /> */}
      </Layout>
    </Layout>
  );
};
