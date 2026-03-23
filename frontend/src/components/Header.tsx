/**
 * Header Component
 * 
 * Top header with filter, search, notifications, language switcher, and user profile
 * 
 * SOLID Principles:
 * - Single Responsibility: Only renders header UI
 * - Open/Closed: Easy to add new header actions
 */

import { Button, Badge, Dropdown, Avatar } from 'antd';
import {  
  BellOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { GlobalSearch } from './GlobalSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
  onFilterClick?: () => void;
  onSearch?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation('common');

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile'
    },
    {
      key: 'settings',
      label: t('nav.settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: t('auth.logout'),
      onClick: logout
    }
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side: Filter + Search */}
      <div className="flex items-center gap-4">
        <GlobalSearch onSearch={onSearch} />
      </div>

      {/* Right side: Notifications + Language + User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Badge count={5} size="small">
          <Button 
            type="text" 
            icon={<BellOutlined style={{ fontSize: 20 }} />}
            size="large"
          />
        </Badge>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* User Profile */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.fullName || 'User'}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {user?.role || 'Role'}
              </div>
            </div>
            <Avatar 
              size={40} 
              icon={<UserOutlined />}
            //   src={user?.avatar}
              style={{ backgroundColor: '#1890ff' }}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
