/**
 * ProcessEfficiencyCard Component
 * Displays process efficiency metrics with progress bars
 */

import { useTranslation } from "react-i18next";
import { ProcessEfficiencyMetrics } from "@/lib/types/admin.types";

interface ProcessEfficiencyCardProps {
  data: ProcessEfficiencyMetrics;
}

export const ProcessEfficiencyCard = ({ data }: ProcessEfficiencyCardProps) => {
  const { t } = useTranslation("admin");

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm h-full">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {t("dashboard.process_efficiency")}
      </h3>

      {/* Metrics */}
      <div className="space-y-6">
        {/* Rejected Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("dashboard.rejected_rate")}
            </span>
            <span className="text-lg font-bold text-red-500">
              {data.rejectedRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${data.rejectedRate}%` }}
            ></div>
          </div>
        </div>

        {/* Overdue Ongoing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("dashboard.overdue_ongoing")}
            </span>
            <span className="text-lg font-bold text-red-500">
              {data.overdueOngoing} {t("dashboard.tasks")}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${(data.overdueOngoing / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Customer Cancellation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("dashboard.customer_cancellation")}
            </span>
            <span className="text-lg font-bold text-red-500">
              {data.customerCancellation}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${data.customerCancellation}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
