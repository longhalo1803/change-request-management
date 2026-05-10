/**
 * FilterBar Component
 * Provides date range, customer, and PM filtering controls
 */

import { Select, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { DateRangeOption } from "@/lib/types/admin.types";
import {
  DATE_RANGE_OPTIONS,
  CUSTOMER_OPTIONS,
  PM_OPTIONS,
} from "@/lib/constants/adminFilterOptions";

interface FilterBarProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  selectedCustomer: string;
  onCustomerChange: (customer: string) => void;
  selectedPM: string;
  onPMChange: (pm: string) => void;
  onExportPDF: () => void;
  isExporting?: boolean;
}

export const FilterBar = ({
  dateRange,
  onDateRangeChange,
  selectedCustomer,
  onCustomerChange,
  selectedPM,
  onPMChange,
  onExportPDF,
  isExporting = false,
}: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Date Range */}
        <div className="flex items-center gap-2 min-w-max">
          <label className="text-sm font-medium text-gray-600">
            Date Range:
          </label>
          <Select
            value={dateRange}
            onChange={onDateRangeChange}
            style={{ width: 150 }}
            options={DATE_RANGE_OPTIONS}
            className="rounded-md"
          />
        </div>

        {/* Customer Filter */}
        <div className="flex items-center gap-2 min-w-max">
          <label className="text-sm font-medium text-gray-600">Customer:</label>
          <Select
            value={selectedCustomer}
            onChange={onCustomerChange}
            style={{ width: 160 }}
            options={CUSTOMER_OPTIONS}
            className="rounded-md"
          />
        </div>

        {/* PM Filter */}
        <div className="flex items-center gap-2 min-w-max">
          <label className="text-sm font-medium text-gray-600">PM:</label>
          <Select
            value={selectedPM}
            onChange={onPMChange}
            style={{ width: 150 }}
            options={PM_OPTIONS}
            className="rounded-md"
          />
        </div>

        {/* Export PDF Button */}
        <div className="ml-auto">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={onExportPDF}
            loading={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
