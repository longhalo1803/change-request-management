import { Card, Input, Select, Button, Space } from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { ChangeRequestStatus } from "@/lib/types";
import { useTranslation } from "react-i18next";

type ActorType = "customer" | "pm" | "admin";

interface CrFilterProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (status: ChangeRequestStatus | undefined) => void;
  onPriorityChange?: (priority: string | undefined) => void;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
  actorType?: ActorType;
}

/**
 * Shared CR Filter Component
 * Used by Customer, PM, and Admin actors with role-specific button visibility
 */
export const CrFilter: React.FC<CrFilterProps> = ({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCreateClick,
  onClearFilters,
  actorType = "customer",
}) => {
  const { t } = useTranslation("cr-list");

  // PM actors cannot create CRs, so hide the create button
  const showCreateButton = actorType === "customer" || actorType === "admin";

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
            options={Object.values(ChangeRequestStatus).map((status) => ({
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
          {showCreateButton && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateClick}
            >
              {t("filters.create_cr_button")}
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
};
