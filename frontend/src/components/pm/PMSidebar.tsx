import { Layout, Menu, Avatar } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

/**
 * PM Sidebar Component
 * 
 * White sidebar navigation for PM dashboard
 * Shows:
 * - Logo component
 * - PM avatar + name/role
 * - Navigation menu (Dashboard, Projects, Team)
 * - Logout at bottom
 */
export const PMSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const getSelectedKey = () => {
    if (location.pathname.includes('dashboard')) return 'dashboard';
    if (location.pathname.includes('projects')) return 'projects';
    if (location.pathname.includes('team')) return 'team';
    return 'dashboard';
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/pm/dashboard')
    },
    {
      key: 'projects',
      icon: <FileTextOutlined />,
      label: 'Projects',
      onClick: () => navigate('/pm/projects')
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: 'Team',
      onClick: () => navigate('/pm/team')
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
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Logo size="small" showSubtitle={false} />
      </div>

      {/* PM Info Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar 
            size={48} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {user?.fullName || 'PM User'}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider truncate">
              {user?.role === 'pm' ? 'Project Manager' : user?.role}
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
          border: 'none',
          background: '#ffffff'
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

export default PMSidebar;
