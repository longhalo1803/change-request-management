import { useState } from "react";
import { Card } from "antd";
import { useTranslation } from "@/hooks/useTranslation";

interface StatusData {
  status: string;
  count: number;
  color: string;
  label: string;
}

interface StatusOverviewProps {
  data: StatusData[];
  activeSprint?: string;
  totalCrs: number;
  onViewDetails?: () => void;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  data,
  totalCrs,
  onViewDetails,
}) => {
  const { t } = useTranslation("dashboard");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const segments = data.map((item, index) => {
    const percentage = (item.count / total) * 100;
    const previousPercentage = data
      .slice(0, index)
      .reduce((sum, prev) => sum + (prev.count / total) * 100, 0);

    return {
      ...item,
      percentage,
      offset: previousPercentage,
    };
  });

  return (
    <Card className="h-full">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {t("status_overview.title")}
        </h2>
        <p className="text-sm text-gray-600">
          Get a snapshot of the status of your work items.{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onViewDetails?.();
            }}
            className="text-blue-600 hover:underline"
          >
            View all work items
          </a>
        </p>
      </div>

      <div className="flex items-center gap-12 mt-8">
        <div className="relative w-64 h-64 flex-shrink-0">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {segments.map((segment, index) => {
              const radius = 70;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -(
                (segment.offset / 100) *
                circumference
              );
              const isHovered = hoveredIndex === index;
              const isOtherHovered =
                hoveredIndex !== null && hoveredIndex !== index;

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? 35 : 30}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  opacity={isOtherHovered ? 0.3 : 1}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                      : "none",
                  }}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-5xl font-bold text-gray-900">{totalCrs}</div>
            <div className="text-sm text-gray-500 mt-1">Total work item</div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const isOtherHovered =
              hoveredIndex !== null && hoveredIndex !== index;

            return (
              <div
                key={item.status}
                className="flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-lg"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  opacity: isOtherHovered ? 0.4 : 1,
                  transform: isHovered ? "translateX(8px)" : "translateX(0)",
                  backgroundColor: isHovered ? "#f9fafb" : "transparent",
                }}
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor: item.color,
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                  }}
                />

                <div className="flex items-center gap-2 flex-1">
                  <span
                    className={`text-base transition-all duration-300 ${
                      isHovered
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {item.label}:
                  </span>
                  <span
                    className={`text-base font-bold transition-all duration-300 ${
                      isHovered ? "text-gray-900 text-lg" : "text-gray-700"
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
