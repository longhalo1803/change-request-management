/**
 * Top5CustomersChart Component
 * Displays horizontal bar chart of top 5 customers by CR count
 */

import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CustomerData } from "@/lib/types/admin.types";

interface Top5CustomersChartProps {
  data: CustomerData[];
}

const CustomTooltip = (props: any) => {
  const { active, payload, t } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">
          {payload[0].payload.name}
        </p>
        <p
          style={{ color: payload[0].color }}
          className="text-sm font-semibold"
        >
          {payload[0].value} {t("dashboard.crs")}
        </p>
      </div>
    );
  }
  return null;
};

export const Top5CustomersChart = ({ data }: Top5CustomersChartProps) => {
  const { t } = useTranslation("admin");

  // Get max value for scaling
  const maxValue = Math.max(...data.map((d) => d.crCount));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {t("dashboard.top_5_customers")}
      </h3>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              domain={[0, maxValue + 5]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#666" }}
              width={140}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip
              content={<CustomTooltip t={t} />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Bar
              dataKey="crCount"
              fill="#1890FF"
              radius={[0, 4, 4, 0]}
              name={t("dashboard.crs")}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#1890FF" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with values on the right */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-1 text-sm"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600 font-medium">{item.name}</span>
            </div>
            <span className="text-gray-800 font-bold">
              {item.crCount} {t("dashboard.crs")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
