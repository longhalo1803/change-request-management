import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Empty, Spin } from "antd";
import { CrKanbanBoard, CrFilter, CrDetailModal } from "@/components";
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
  const { t } = useTranslation("pm");
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
            <CrFilter actorType="pm" />
          </div>

          {/* Kanban Board */}
          <div className="bg-white rounded-lg shadow p-6">
            {crData.length > 0 ? (
              <CrKanbanBoard
                data={crData}
                onCardClick={handleCrClick}
                actorType="pm"
              />
            ) : (
              <Empty description={t("cr_list.no_data")} />
            )}
          </div>

          {/* Stats Footer */}
          {crData.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p>
                {t(
                  crData.length === 1
                    ? "cr_list.showing_count_one"
                    : "cr_list.showing_count_other",
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
        actorType="pm"
      />
    </div>
  );
};

export default PMCrListPage;
