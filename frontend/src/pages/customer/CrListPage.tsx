import { useState } from "react";
import { Empty, Spin } from "antd";
import {
  CrKanbanBoard,
  CreateCrModal,
  CrDetailModal,
  CrFilter,
} from "@/components";
import { ChangeRequest } from "@/lib/types";
import { useChangeRequests } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { getCrPriority } from "@/lib/helpers/cr.helpers";

/**
 * Customer CR List Page
 *
 * Shows all Change Requests created by the logged-in customer
 * Customers can:
 * - View their own CRs in all statuses
 * - Create new CRs (Draft)
 * - Submit CRs
 * - View CR details
 */
const CrListPage = () => {
  const { t } = useTranslation("cr-list");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);

  // Get all CRs for the current user (customer)
  const { data: crResponse, isLoading } = useChangeRequests({});

  // Filter CRs based on search and filters
  const crData = crResponse?.items || [];
  const filteredCRs = crData.filter((cr: ChangeRequest) => {
    const matchesSearch =
      !searchText ||
      cr.crKey?.toLowerCase().includes(searchText.toLowerCase()) ||
      cr.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      cr.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesPriorities =
      !priorityFilter ||
      getCrPriority(cr).toLowerCase() === priorityFilter.toLowerCase();

    const matchesStatus =
      !statusFilter ||
      cr.statusId === statusFilter ||
      cr.status?.name === statusFilter;

    return matchesSearch && matchesPriorities && matchesStatus;
  });

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    // In real app, this would refresh the data
    setIsCreateModalOpen(false);
  };

  const handleCrClick = (cr: ChangeRequest) => {
    setSelectedCr(cr);
    setIsDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedCr(null);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("cr_list.customer_title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("cr_list.customer_subtitle")}</p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Filter and Search */}
          <div className="mb-6">
            <CrFilter
              searchText={searchText}
              status={statusFilter as any}
              priority={priorityFilter}
              onSearchChange={setSearchText}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onClearFilters={handleClearFilters}
              onCreateClick={handleCreateClick}
              actorType="customer"
            />
          </div>

          {/* Kanban Board */}
          <div className="bg-white rounded-lg shadow p-6">
            {filteredCRs.length > 0 ? (
              <CrKanbanBoard
                data={filteredCRs}
                onCardClick={handleCrClick}
                actorType="customer"
              />
            ) : (
              <Empty description={t("cr_list.no_crs")} />
            )}
          </div>

          {/* Stats Footer */}
          {crData.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p>
                {t("cr_list.total")}: {crData.length} | {t("cr_list.showing")}:{" "}
                {filteredCRs.length}{" "}
                {filteredCRs.length !== 1
                  ? t("cr_list.change_requests")
                  : t("cr_list.change_request")}
              </p>
            </div>
          )}
        </>
      )}

      {/* Create CR Modal */}
      <CreateCrModal
        open={isCreateModalOpen}
        onCancel={handleCreateClose}
        onSuccess={handleCreateSuccess}
        actorType="customer"
      />

      {/* Detail Modal */}
      <CrDetailModal
        open={isDetailModalOpen}
        cr={selectedCr}
        onCancel={handleDetailClose}
        actorType="customer"
      />
    </div>
  );
};

export default CrListPage;
