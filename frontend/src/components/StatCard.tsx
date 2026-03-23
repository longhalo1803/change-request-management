/**
 * StatCard Component
 * 
 * Displays a statistic with icon, number, and subtitle
 * 
 * SOLID Principles:
 * - Single Responsibility: Only renders stat card
 * - Open/Closed: Can extend with trends, sparklines
 */

import { Card } from 'antd';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  subtitle?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  subtitle,
  iconColor = '#1890ff',
  iconBgColor = '#e6f7ff'
}) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: iconBgColor,
            color: iconColor
          }}
        >
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          <div className="text-base font-medium text-gray-700 mb-1">
            {label}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-500">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
