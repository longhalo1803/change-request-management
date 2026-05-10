import { useState } from "react";
import { Empty, Spin } from "antd";
import { CrKanbanBoard, CrFilter, CrDetailModal } from "@/components";
import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import { useChangeRequests } from "@/hooks";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("admin");
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ChangeRequestStatus | undefined
  >();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();

  // Get all CRs
  const { data: crResponse, isLoading } = useChangeRequests({
    search: searchText,
    statusId: statusFilter,
    priorityId: priorityFilter,
  });
  const crData = crResponse?.items || [];

  const handleCrClick = (cr: ChangeRequest) => {
    setSelectedCr(cr);
    setDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setDetailModalOpen(false);
    setSelectedCr(null);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };

  return (
    <div className="bg-gray-50 min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("cr_list.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("cr_list.subtitle")}</p>
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
            <CrFilter
              searchText={searchText}
              status={statusFilter}
              priority={priorityFilter}
              onSearchChange={setSearchText}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onClearFilters={handleClearFilters}
              actorType="admin"
            />
          </div>

          {/* Kanban Board */}
          <div className="bg-white rounded-lg shadow p-6">
            {crData.length > 0 ? (
              <CrKanbanBoard
                data={crData}
                onCardClick={handleCrClick}
                actorType="admin"
              />
            ) : (
              <Empty description={t("cr_list.no_crs")} />
            )}
          </div>

          {/* Stats Footer */}
          {crData.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p>
                {t(
                  crData.length === 1
                    ? "cr_list.showing"
                    : "cr_list.showing_plural",
                  { count: crData.length }
                )}
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
        onStatusChange={handleDetailClose}
        actorType="admin"
      />
    </div>
  );
};

export default AdminCrListPage;
