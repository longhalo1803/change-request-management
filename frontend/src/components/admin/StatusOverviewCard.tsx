/**
 * StatusOverviewCard Component
 * Displays a donut chart showing the status breakdown of change requests
 */

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { StatusBreakdownItem } from '@/lib/types/admin.types';

interface StatusOverviewCardProps {
  data: StatusBreakdownItem[];
  total: number;
  onViewBreakdown?: () => void;
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius } = props;
  if (cx === undefined || cy === undefined || midAngle === undefined) return null;
  
  const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.5;
  const x = cx + radius * Math.cos((-midAngle) * RADIAN);
  const y = cy + radius * Math.sin((-midAngle) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
      {`${props.payload?.percentage || 0}%`}
    </text>
  );
};

export const StatusOverviewCard = ({ data, total, onViewBreakdown }: StatusOverviewCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Status overview</h3>
        </div>
        <div className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
          Active Sprint: Y
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col items-center justify-center py-6">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="count"
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `${value} CRs`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="text-center -mt-24">
          <div className="text-4xl font-bold text-gray-800">{total}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">Total CRs</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-baseline gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-medium text-gray-600 uppercase">{item.status}</span>
            </div>
            <span className="text-sm font-bold text-gray-800 ml-auto">{item.count}</span>
          </div>
        ))}
      </div>

      {/* View Full Breakdown Link */}
      <button
        onClick={onViewBreakdown}
        className="w-full mt-6 py-3 text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors border-t border-gray-100"
      >
        View Full Breakdown →
      </button>
    </div>
  );
};
