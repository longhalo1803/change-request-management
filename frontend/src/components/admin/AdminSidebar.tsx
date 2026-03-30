import { Layout, Menu, Space, Avatar, Dropdown, Button } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from '@/hooks/useTranslation';
import { useLogout } from '@/hooks/useLogout';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

/**
 * Admin Sidebar Component
 * 
 * Navigation menu for admin dashboard
 * Shows admin-specific menu items
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages admin navigation
 * - Open/Closed: Easy to add new admin menu items
 */
export const AdminSidebar = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  const getSelectedKey = () => {
    if (location.pathname.includes('dashboard')) return 'dashboard';
    if (location.pathname.includes('users')) return 'users';
    if (location.pathname.includes('change-requests')) return 'change-requests';
    return 'dashboard';
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('menu.dashboard'),
      onClick: () => navigate('/admin/dashboard')
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: t('menu.users'),
      onClick: () => navigate('/admin/users')
    },
    {
      key: 'change-requests',
      icon: <FileTextOutlined />,
      label: t('menu.change_requests'),
      onClick: () => navigate('/admin/change-requests')
    }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('menu.profile'),
      onClick: () => navigate('/admin/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('menu.settings'),
      onClick: () => navigate('/admin/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('menu.logout'),
      onClick: () => logout(),
      danger: true
    }
  ];

  return (
    <Sider
      width={240}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#001529'
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Space align="center" direction="vertical" size="small">
          <div
            style={{
              width: 40,
              height: 40,
              background: 'white',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: 20, color: '#0052CC' }}>✦</span>
          </div>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>
            SOLASHI
          </span>
        </Space>
      </div>

      {/* Main Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{ border: 'none' }}
      />

      {/* User Profile Section */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px' }}>
        <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
          <Button
            type="text"
            style={{
              width: '100%',
              color: 'white',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            loading={isPending}
          >
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName}
            </span>
          </Button>
        </Dropdown>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
