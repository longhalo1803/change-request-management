/**
 * Sidebar Component
 * 
 * Main navigation sidebar with menu items
 * 
 * SOLID Principles:
 * - Single Responsibility: Only renders sidebar navigation
 * - Open/Closed: Easy to add new menu items
 * - Dependency Inversion: Depends on navigation config abstraction
 */

import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  DollarOutlined,
  SettingOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useTranslation } from '@/hooks/useTranslation';

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('dashboard');

  // Menu configuration
  const mainMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('sidebar.dashboard'),
      path: '/dashboard'
    },
    {
      key: 'cr-management',
      icon: <FileTextOutlined />,
      label: t('sidebar.cr_management'),
      path: '/change-requests'
    },
    {
      key: 'quotation',
      icon: <DollarOutlined />,
      label: t('sidebar.quotation'),
      path: '/quotations'
    }
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('sidebar.settings'),
      path: '/settings'
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: t('sidebar.help'),
      path: '/help'
    }
  ];

  // Get current selected key from path
  const selectedKey = mainMenuItems.find(item => 
    location.pathname.startsWith(item.path)
  )?.key || bottomMenuItems.find(item => 
    location.pathname.startsWith(item.path)
  )?.key || 'dashboard';

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Sider
      width={240}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto'
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Logo size="medium" showSubtitle />
      </div>

      {/* Main Menu */}
      <div className="flex flex-col justify-between" style={{ height: 'calc(100vh - 100px)' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: 'none', paddingTop: 16 }}
          items={mainMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.path)
          }))}
        />

        {/* Bottom Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: 'none', borderTop: '1px solid #f0f0f0' }}
          items={bottomMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.path)
          }))}
        />
      </div>
    </Sider>
  );
};
