import { Card, Input, Select, Button, Space } from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { CrStatus } from "@/lib/types";
import { useTranslation } from "react-i18next";

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
  onClearFilters,
}) => {
  const { t } = useTranslation("cr-list");
  return (
    <Card className="mb-6">
      <div className="flex gap-4 items-end justify-between">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder={t("filters.search_placeholder")}
            prefix={<SearchOutlined />}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{ width: 200 }}
          />

          <Select
            placeholder={t("filters.status_placeholder")}
            onChange={onStatusChange}
            allowClear
            style={{ width: 150 }}
            options={Object.values(CrStatus).map((status) => ({
              label: status.toUpperCase(),
              value: status,
            }))}
          />

          <Select
            placeholder={t("filters.priority_placeholder")}
            onChange={onPriorityChange}
            allowClear
            style={{ width: 150 }}
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ]}
          />
        </div>

        <Space>
          <Button icon={<ClearOutlined />} onClick={onClearFilters}>
            {t("filters.clear_button")}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
          >
            {t("filters.create_cr_button")}
          </Button>
        </Space>
      </div>
    </Card>
  );
};
