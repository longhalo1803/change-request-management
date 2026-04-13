/**
 * CRVolumeChart Component
 * Displays stacked bar chart of CR volume trends by priority
 */

import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { MonthlyVolumeTrend } from "@/lib/types/admin.types";

interface CRVolumeChartProps {
  data: MonthlyVolumeTrend[];
  onAnnualProjection?: () => void;
  growthPercentage?: number;
}

const COLORS = {
  critical: "#FF4D4F", // Red
  high: "#FFA940", // Orange
  medium: "#FADB14", // Yellow
  low: "#52C41A", // Green
};

const CustomTooltip = (props: any) => {
  const { active, payload, t } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">{data.month}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {t(`dashboard.${entry.name.toLowerCase()}`, entry.name)}:{" "}
            {entry.value}
          </p>
        ))}
        <p className="text-sm font-semibold text-gray-800 mt-1 border-t border-gray-200 pt-1">
          {t("dashboard.total")}: {data.total}
        </p>
      </div>
    );
  }
  return null;
};

export const CRVolumeChart = ({
  data,
  onAnnualProjection,
  growthPercentage = 14,
}: CRVolumeChartProps) => {
  const { t } = useTranslation("admin");

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {t("dashboard.cr_volume_trends")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onAnnualProjection}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {t("dashboard.annual_projection")}
          </button>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {t("dashboard.annual_growth", { percentage: growthPercentage })}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip
              content={<CustomTooltip t={t} />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="square"
              formatter={(value) =>
                t(`dashboard.${value.toLowerCase()}`, value)
              }
            />
            <Bar
              dataKey="critical"
              stackId="priority"
              fill={COLORS.critical}
              name="CRITICAL"
              radius={[4, 4, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell key={`critical-${index}`} fill={COLORS.critical} />
              ))}
            </Bar>
            <Bar
              dataKey="high"
              stackId="priority"
              fill={COLORS.high}
              name="HIGH"
            >
              {data.map((_, index) => (
                <Cell key={`high-${index}`} fill={COLORS.high} />
              ))}
            </Bar>
            <Bar
              dataKey="medium"
              stackId="priority"
              fill={COLORS.medium}
              name="MEDIUM"
            >
              {data.map((_, index) => (
                <Cell key={`medium-${index}`} fill={COLORS.medium} />
              ))}
            </Bar>
            <Bar dataKey="low" stackId="priority" fill={COLORS.low} name="LOW">
              {data.map((_, index) => (
                <Cell key={`low-${index}`} fill={COLORS.low} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Labels on top of bars */}
      <div className="mt-6 flex justify-between px-4 text-xs text-gray-500">
        {data.map((item) => (
          <div
            key={item.month}
            className="text-center text-xs font-semibold text-gray-600"
          >
            {item.total}
          </div>
        ))}
      </div>
    </div>
  );
};
