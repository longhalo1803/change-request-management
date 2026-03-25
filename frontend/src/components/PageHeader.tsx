/**
 * PageHeader Component
 * 
 * Page title with subtitle and action button
 * 
 * SOLID Principles:
 * - Single Responsibility: Only renders page header
 * - Open/Closed: Can extend with breadcrumbs, tabs
 */

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  extra
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {extra}
        {actionLabel && onAction && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAction}
            size="large"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
