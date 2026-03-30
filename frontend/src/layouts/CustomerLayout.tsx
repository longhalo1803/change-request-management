import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { CustomerSidebar } from '@/components/customer/CustomerSidebar';
import { Header } from '@/components/Header';

const { Content } = Layout;

export const CustomerLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CustomerSidebar />

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
