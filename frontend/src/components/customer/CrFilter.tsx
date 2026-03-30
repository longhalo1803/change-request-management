import { Card, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined, PlusOutlined } from '@ant-design/icons';
import { CrStatus } from '@/lib/types';

interface CrFilterProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (status: CrStatus | undefined) => void;
  onPriorityChange?: (priority: string | undefined) => void;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
}

export const CrFilter: React.FC<CrFilterProps> = ({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCreateClick,
  onClearFilters
}) => {
  return (
    <Card className="mb-6">
      <div className="flex gap-4 items-end justify-between">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Search by title or ID"
            prefix={<SearchOutlined />}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{ width: 200 }}
          />

          <Select
            placeholder="Select Status"
            onChange={onStatusChange}
            allowClear
            style={{ width: 150 }}
            options={Object.values(CrStatus).map(status => ({
              label: status.toUpperCase(),
              value: status
            }))}
          />

          <Select
            placeholder="Select Priority"
            onChange={onPriorityChange}
            allowClear
            style={{ width: 150 }}
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Critical', value: 'critical' }
            ]}
          />
        </div>

        <Space>
          <Button
            icon={<ClearOutlined />}
            onClick={onClearFilters}
          >
            Clear
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
          >
            Create CR
          </Button>
        </Space>
      </div>
    </Card>
  );
};
