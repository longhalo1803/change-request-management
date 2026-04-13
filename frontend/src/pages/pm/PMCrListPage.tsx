import { useState } from "react";
import { Tabs, Empty, Spin } from "antd";
import { CrKanbanBoard, CrTable, CrFilter, CrDetailModal } from "@/components";
import { ChangeRequest } from "@/lib/types";
import { useChangeRequests } from "@/hooks";

/**
 * PM CR List Page
 *
 * Shows all Change Requests that are NOT in Draft status
 * PMs can view and work on CRs but cannot create new ones
 *
 * Features:
 * - View all submitted CRs (Submitted, In Discussion, Approved, Rejected, Ongoing, Closed)
 * - Filter and search CRs
 * - Switch between Table and Kanban views
 * - View CR details
 */
export const PMCrListPage = () => {
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Get all CRs (excluding Draft)
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
          <CrTable data={crData} onRowClick={handleCrClick} actorType="pm" />
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
            actorType="pm"
          />
        ) : (
          <Empty description="No Change Requests found" />
        ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Change Requests</h1>
        <p className="text-gray-600 mt-2">
          Manage and resolve customer Change Requests
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
            <CrFilter actorType="pm" />
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
        actorType="pm"
      />
    </div>
  );
};

export default PMCrListPage;
