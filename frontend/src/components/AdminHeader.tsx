import { Button, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Admin Header Component
 * 
 * Top header for admin dashboard
 * Shows:
 * - Language switcher (left-aligned)
 * - Notification bell (right-aligned)
 * 
 * Note: Admin info is displayed in the sidebar, so no profile dropdown needed
 */
export const AdminHeader = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side - empty for future use */}
      <div />

      {/* Right side - Language Switcher + Notifications */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <Badge count={5} size="small">
          <Button 
            type="text" 
            icon={<BellOutlined style={{ fontSize: 20 }} />}
            size="large"
          />
        </Badge>
      </div>
    </div>
  );
};

export default AdminHeader;
