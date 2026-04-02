/**
 * UserManagementCard Component
 * Displays user management statistics
 */

import { UserManagementStats } from "@/lib/types/admin.types";

interface UserManagementCardProps {
  data: UserManagementStats;
}

export const UserManagementCard = ({ data }: UserManagementCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm h-full">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        USER MANAGEMENT
      </h3>

      {/* Main Stats */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-1">
            {data.new30Days}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            New (30 days)
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-green-500 mb-1">
            {data.activeRatio}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Active Ratio
          </div>
        </div>
      </div>

      {/* User Type Breakdown */}
      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">
              {data.customers}
            </span>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            CUSTOMER
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">{data.pm}</span>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            PM
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">
              {data.admin}
            </span>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            ADMIN
          </span>
        </div>
      </div>
    </div>
  );
};
