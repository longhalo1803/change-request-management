import { useState } from "react";
import { Tabs, Empty, Spin } from "antd";
import { CrKanbanBoard, CrTable, CrFilter, CrDetailModal } from "@/components";
import { ChangeRequest } from "@/lib/types";
import { useChangeRequests } from "@/hooks";

/**
 * Admin CR List Page
 *
 * Shows all Change Requests
 * Admins can view and monitor all CRs
 *
 * Features:
 * - View all submitted CRs
 * - Filter and search CRs
 * - Switch between Table and Kanban views
 * - View CR details
 */
export const AdminCrListPage = () => {
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Get all CRs
  const { data: crResponse, isLoading } = useChangeRequests({});
  const crData = crResponse?.items || [];

  const handleCrClick = (cr: ChangeRequest) => {
    setSelectedCr(cr);
    setDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setDetailModalOpen(false);
    setSelectedCr(null);
  };

  const tabItems = [
    {
      key: "table",
      label: "📋 Table View",
      children:
        crData.length > 0 ? (
          <CrTable data={crData} onRowClick={handleCrClick} actorType="admin" />
        ) : (
          <Empty description="No Change Requests found" />
        ),
    },
    {
      key: "kanban",
      label: "📊 Kanban Board",
      children:
        crData.length > 0 ? (
          <CrKanbanBoard
            data={crData}
            onCardClick={handleCrClick}
            actorType="admin"
          />
        ) : (
          <Empty description="No Change Requests found" />
        ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          All Change Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor all Change Requests across the system
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="mb-6">
            <CrFilter actorType="admin" />
          </div>

          {/* Tabs: Kanban and Table */}
          <div className="bg-white rounded-lg shadow">
            <Tabs
              activeKey={viewMode}
              onChange={(key) => setViewMode(key as "table" | "kanban")}
              items={tabItems}
              className="px-6"
            />
          </div>

          {/* Stats Footer */}
          {crData.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p>
                Showing {crData.length} Change Request
                {crData.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <CrDetailModal
        open={detailModalOpen}
        cr={selectedCr}
        onCancel={handleDetailClose}
        actorType="admin"
      />
    </div>
  );
};

export default AdminCrListPage;
