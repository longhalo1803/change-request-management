import { useState } from "react";
import { Tabs, Empty } from "antd";
import {
  CrKanbanBoard,
  CreateCrModal,
  CrDetailModal,
  CrFilter,
  CrTable,
} from "@/components";
import { ChangeRequest } from "@/lib/types";
import { getCustomerCRs } from "@/fake-data";
import type { FilterOptions } from "@/components/cr/CrFilterBar";

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
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");

  // Get CRs for the current customer (using customer-1 as default)
  const crData = getCustomerCRs("customer-1");

  // Filter CRs based on search and filters
  const filteredCRs = crData.filter((cr) => {
    const matchesSearch =
      !searchText ||
      cr.title.toLowerCase().includes(searchText.toLowerCase()) ||
      cr.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesPriorities =
      !activeFilters.priorities ||
      activeFilters.priorities.length === 0 ||
      activeFilters.priorities.includes(cr.priority);

    return matchesSearch && matchesPriorities;
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
    setActiveFilters({});
    setSearchText("");
  };

  const tabItems = [
    {
      key: "kanban",
      label: "📊 Kanban Board",
      children:
        filteredCRs.length > 0 ? (
          <CrKanbanBoard
            data={filteredCRs}
            onCardClick={handleCrClick}
            actorType="customer"
          />
        ) : (
          <Empty description="No Change Requests found" />
        ),
    },
    {
      key: "table",
      label: "📋 Table View",
      children:
        filteredCRs.length > 0 ? (
          <CrTable
            data={filteredCRs}
            onRowClick={handleCrClick}
            actorType="customer"
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
        <h1 className="text-3xl font-bold text-gray-900">My Change Requests</h1>
        <p className="text-gray-600 mt-2">
          View and manage your change requests
        </p>
      </div>

      {/* Filter and Search */}
      <div className="mb-6">
        <CrFilter
          onSearchChange={setSearchText}
          onClearFilters={handleClearFilters}
          onCreateClick={handleCreateClick}
          actorType="customer"
        />
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

      {/* Stats Footer */}
      {crData.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>
            Total: {crData.length} | Showing: {filteredCRs.length} Change
            Request
            {filteredCRs.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default CrListPage;
