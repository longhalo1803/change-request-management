/**
 * MetricsFooter Component
 * Displays growth metrics, priority alerts, and health index
 */

import {
  GrowthMetrics,
  PriorityAlert,
  HealthIndexMetrics,
} from "@/lib/types/admin.types";

interface MetricsFooterProps {
  growthMetrics: GrowthMetrics;
  priorityAlert: PriorityAlert;
  healthIndex: HealthIndexMetrics;
}

export const MetricsFooter = ({
  growthMetrics,
  priorityAlert,
  healthIndex,
}: MetricsFooterProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Growth Metrics Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">📊</span>
          </div>
          <h4 className="font-semibold text-gray-800 text-sm uppercase">
            GROWTH METRICS
          </h4>
        </div>
        <p className="text-gray-600 text-sm mb-2">{growthMetrics.comparison}</p>
        <p className="text-3xl font-bold text-green-600">
          +{growthMetrics.percentage}%
        </p>
      </div>

      {/* Priority Alert Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <h4 className="font-semibold text-gray-800 text-sm uppercase">
            PRIORITY ALERT
          </h4>
        </div>
        <p className="text-gray-600 text-sm mb-2">
          {priorityAlert.description}
        </p>
        <p className="text-3xl font-bold text-red-600">{priorityAlert.value}</p>
      </div>

      {/* Health Index Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">💚</span>
          </div>
          <h4 className="font-semibold text-gray-800 text-sm uppercase">
            HEALTH INDEX
          </h4>
        </div>
        <p className="text-gray-600 text-sm mb-2">{healthIndex.description}</p>
        <p className="text-3xl font-bold text-gray-800">{healthIndex.ratio}</p>
      </div>
    </div>
  );
};
