import { useState } from 'react';
import { Input, Button, Avatar, Space, Modal } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { CrTable, CreateCrModal, CrDetailModal } from '@/components/customer';
import { ChangeRequest, CrStatus } from '@/lib/types';

const CrListPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 24 });

  // Mock data matching the design
  const mockCRs: ChangeRequest[] = [
    {
      id: 'ECR-2626-001',
      title: 'CMS Dashboard Export Feature Enhancement',
      description: 'Project: iOS Dashboard v3.0',
      status: CrStatus.DRAFT,
      priority: 'medium',
      customerId: 'cust1',
      createdAt: '2026-03-15T10:30:00Z',
      updatedAt: '2026-03-15T10:30:00Z'
    },
    {
      id: 'ECR-2626-002',
      title: 'Biometric Login Integration (iOS App)',
      description: 'Project: iOS App v.Mobile',
      status: CrStatus.SUBMITTED,
      priority: 'high',
      customerId: 'cust1',
      createdAt: '2026-03-16T04:15:00Z',
      updatedAt: '2026-03-16T04:15:00Z'
    },
    {
      id: 'ECR-2626-003',
      title: 'Localized Japanese UI Support',
      description: 'Project: iOS App v.Web',
      status: CrStatus.UNDER_ANALYSIS,
      priority: 'low',
      customerId: 'cust1',
      createdAt: '2026-03-16T09:00:00Z',
      updatedAt: '2026-03-16T09:00:00Z'
    },
    {
      id: 'ECR-2626-004',
      title: 'Payment Gateway Webhook Redundancy',
      description: 'Project: iOS Gateway',
      status: CrStatus.APPROVED,
      priority: 'high',
      customerId: 'cust1',
      createdAt: '2026-03-17T02:45:00Z',
      updatedAt: '2026-03-17T02:45:00Z'
    }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // Refresh the CR list or add the new CR to the list
    console.log('CR created successfully');
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
    console.log('Reject CR:', selectedCr?.id);
    // Implement reject logic
  };

  const handleApprove = () => {
    console.log('Approve CR:', selectedCr?.id);
    // Implement approve logic
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const filteredCRs = mockCRs.filter((cr) => {
    const matchesSearch = 
      cr.title.toLowerCase().includes(searchText.toLowerCase()) || 
      cr.id.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Change Request Management
            </h1>
            <p className="text-sm text-gray-500">
              Review and manage your CR back requests
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <Input
              placeholder="Search CR ID or Title..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={handleSearchChange}
              style={{ width: 280 }}
              size="large"
            />

            {/* Team Avatars */}
            <Avatar.Group max={{ count: 3 }} size="large">
              <Avatar style={{ backgroundColor: '#f56a00' }}>U1</Avatar>
              <Avatar style={{ backgroundColor: '#7265e6' }}>U2</Avatar>
              <Avatar style={{ backgroundColor: '#ffbf00' }}>U3</Avatar>
              <Avatar style={{ backgroundColor: '#00a2ae' }}>U4</Avatar>
            </Avatar.Group>

            {/* Action Buttons */}
            <Space>
              <Button 
                icon={<FilterOutlined />}
                size="large"
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filters
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                onClick={handleCreateClick}
              >
                Create New CR
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <CrTable
        data={filteredCRs}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
      />

      {/* Filter Modal */}
      <Modal
        title="Filters"
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        footer={null}
      >
        <p>Filter options will be implemented here</p>
      </Modal>

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
      />
    </div>
  );
};

export default CrListPage;
