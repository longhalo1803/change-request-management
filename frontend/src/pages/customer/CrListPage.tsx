import { useState } from "react";
import { Button, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import {
  CrKanbanBoard,
  CreateCrModal,
  CrDetailModal,
  CrFilterBar,
} from "@/components/customer";
import { ChangeRequest, CrStatus } from "@/lib/types";
import type { FilterOptions } from "@/components/customer/CrFilterBar";

const CrListPage = () => {
  const [searchText, setSearchText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  // Mock data matching the design
  const mockCRs: ChangeRequest[] = [
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.DRAFT,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user1",
        fullName: "John Doe",
        email: "john@example.com",
      },
      createdAt: "2026-03-15T10:30:00Z",
      updatedAt: "2026-03-15T10:30:00Z",
    },
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.DRAFT,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user2",
        fullName: "Jane Smith",
        email: "jane@example.com",
      },
      createdAt: "2026-03-15T11:00:00Z",
      updatedAt: "2026-03-15T11:00:00Z",
    },
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.DRAFT,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user3",
        fullName: "Mike Johnson",
        email: "mike@example.com",
      },
      createdAt: "2026-03-15T12:00:00Z",
      updatedAt: "2026-03-15T12:00:00Z",
    },
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.DRAFT,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user4",
        fullName: "Sarah Wilson",
        email: "sarah@example.com",
      },
      createdAt: "2026-03-15T13:00:00Z",
      updatedAt: "2026-03-15T13:00:00Z",
    },
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.DRAFT,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user5",
        fullName: "Tom Brown",
        email: "tom@example.com",
      },
      createdAt: "2026-03-15T14:00:00Z",
      updatedAt: "2026-03-15T14:00:00Z",
    },
    {
      id: "CR-2401",
      title: "Add PDF export feature to monthly billing reports",
      description: "Project: iOS Dashboard v3.0",
      status: CrStatus.SUBMITTED,
      priority: "high",
      customerId: "cust1",
      createdBy: {
        id: "user6",
        fullName: "Lisa Anderson",
        email: "lisa@example.com",
      },
      createdAt: "2026-03-16T04:15:00Z",
      updatedAt: "2026-03-16T04:15:00Z",
    },
    {
      id: "CR-2346",
      title: "Redesign checkout flow to include 1-click buy option",
      description: "Project: iOS App v.Mobile",
      status: CrStatus.IN_DISCUSSION,
      priority: "high",
      customerId: "cust1",
      createdBy: {
        id: "user7",
        fullName: "Robert Lee",
        email: "robert@example.com",
      },
      createdAt: "2026-03-16T09:00:00Z",
      updatedAt: "2026-03-16T09:00:00Z",
    },
    {
      id: "CR-2346",
      title: "Redesign checkout flow to include 1-click buy option",
      description: "Project: iOS App v.Mobile",
      status: CrStatus.IN_DISCUSSION,
      priority: "low",
      customerId: "cust1",
      createdBy: {
        id: "user8",
        fullName: "Emily White",
        email: "emily@example.com",
      },
      createdAt: "2026-03-16T10:00:00Z",
      updatedAt: "2026-03-16T10:00:00Z",
    },
    {
      id: "CR-2346",
      title: "Redesign checkout flow to include 1-click buy option",
      description: "Project: iOS App v.Mobile",
      status: CrStatus.IN_DISCUSSION,
      priority: "medium",
      customerId: "cust1",
      createdBy: {
        id: "user9",
        fullName: "David Martinez",
        email: "david@example.com",
      },
      createdAt: "2026-03-16T11:00:00Z",
      updatedAt: "2026-03-16T11:00:00Z",
    },
    {
      id: "CR-2279",
      title: "Implement Dark Mode for internal admin tool",
      description: "Project: iOS Gateway",
      status: CrStatus.APPROVED,
      priority: "high",
      customerId: "cust1",
      createdBy: {
        id: "user10",
        fullName: "Jennifer Davis",
        email: "jennifer@example.com",
      },
      createdAt: "2026-03-17T02:45:00Z",
      updatedAt: "2026-03-17T02:45:00Z",
    },
    {
      id: "CR-2290",
      title: "Fix typo on the login welcome screen",
      description: "Project: iOS Gateway",
      status: CrStatus.REJECTED,
      priority: "low",
      customerId: "cust1",
      createdBy: {
        id: "user11",
        fullName: "Chris Taylor",
        email: "chris@example.com",
      },
      createdAt: "2026-03-17T03:00:00Z",
      updatedAt: "2026-03-17T03:00:00Z",
    },
    {
      id: "CR-2300",
      title: "Migrate database to AWS Aurora Cluster",
      description: "Project: Database Migration",
      status: CrStatus.ONGOING,
      priority: "critical",
      customerId: "cust1",
      createdBy: {
        id: "user12",
        fullName: "Amanda Garcia",
        email: "amanda@example.com",
      },
      createdAt: "2026-03-17T04:00:00Z",
      updatedAt: "2026-03-17T04:00:00Z",
    },
    {
      id: "CR-2301",
      title: "Update company logo on footer",
      description: "Project: Website Redesign",
      status: CrStatus.CLOSED,
      priority: "low",
      customerId: "cust1",
      createdBy: {
        id: "user13",
        fullName: "Kevin Rodriguez",
        email: "kevin@example.com",
      },
      createdAt: "2026-03-17T05:00:00Z",
      updatedAt: "2026-03-17T05:00:00Z",
    },
  ];

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // Refresh the CR list or add the new CR to the list
    console.log("CR created successfully");
  };

  const handleRowClick = (cr: ChangeRequest) => {
    setSelectedCr(cr);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedCr(null);
  };

  const handleReject = () => {
    console.log("Reject CR:", selectedCr?.id);
    // Implement reject logic
  };

  const handleApprove = () => {
    console.log("Approve CR:", selectedCr?.id);
    // Implement approve logic
  };

  const handleDelete = () => {
    console.log("Delete CR:", selectedCr?.id);
    // Implement delete logic - remove from mockCRs
    if (selectedCr) {
      // In a real app, this would be an API call
      console.log("Deleted CR:", selectedCr.id);
      handleDetailModalClose();
    }
  };

  const handleSubmit = () => {
    console.log("Submit CR:", selectedCr?.id);
    // Implement submit logic - change status from DRAFT to SUBMITTED
    if (selectedCr) {
      // In a real app, this would be an API call
      selectedCr.status = CrStatus.SUBMITTED;
      console.log(
        "Submitted CR:",
        selectedCr.id,
        "New status:",
        CrStatus.SUBMITTED,
      );
      handleDetailModalClose();
    }
  };

  const filteredCRs = mockCRs.filter((cr) => {
    // Search filter
    const matchesSearch =
      cr.title.toLowerCase().includes(searchText.toLowerCase()) ||
      cr.id.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return false;

    // Actor filter - show tasks created by selected actors
    if (activeFilters.actors && activeFilters.actors.length > 0) {
      if (!cr.createdBy || !activeFilters.actors.includes(cr.createdBy.id)) {
        return false;
      }
    }

    // Priority filter
    if (activeFilters.priorities && activeFilters.priorities.length > 0) {
      if (!activeFilters.priorities.includes(cr.priority)) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedCRs = [...filteredCRs].sort((a, b) => {
    if (activeFilters.sortBy === "latest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (activeFilters.sortBy === "oldest") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (activeFilters.sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Change Request Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleCreateClick}
              >
                Create New CR
              </Button>
              <Button icon={<DownloadOutlined />} size="large">
                Export Excel
              </Button>
            </Space>
          </div>
        </div>

        {/* Filter Bar */}
        <CrFilterBar
          data={mockCRs}
          searchText={searchText}
          onSearchChange={setSearchText}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearAll={() => {
            setSearchText("");
            setActiveFilters({});
          }}
        />
      </div>

      {/* Kanban Board Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <CrKanbanBoard data={sortedCRs} onCardClick={handleRowClick} />
      </div>

      {/* Create CR Modal */}
      <CreateCrModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* CR Detail Modal */}
      <CrDetailModal
        open={isDetailModalOpen}
        cr={selectedCr}
        onCancel={handleDetailModalClose}
        onReject={handleReject}
        onApprove={handleApprove}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CrListPage;
