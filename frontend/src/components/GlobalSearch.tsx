/**
 * GlobalSearch Component
 * 
 * Global search input with icon
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles search input UI
 * - Open/Closed: Can extend with autocomplete, filters
 */

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from '@/hooks/useTranslation';

interface GlobalSearchProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  onSearch,
  placeholder,
  className = '' 
}) => {
  const { t } = useTranslation('common');

  return (
    <Input
      prefix={<SearchOutlined className="text-gray-400" />}
      placeholder={placeholder || `${t('actions.search')}...`}
      onChange={(e) => onSearch?.(e.target.value)}
      className={`rounded-lg ${className}`}
      style={{ width: 300 }}
      size="large"
    />
  );
};
