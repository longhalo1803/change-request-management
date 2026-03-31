import { useState } from 'react';
import { Row, Col } from 'antd';
import { 
  CheckCircleOutlined, 
  EditOutlined, 
  PlusCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusOverview } from '@/modules/dashboard/StatusOverview';
import { RecentActivity } from '@/modules/dashboard/RecentActivity';
import { CreateCrModal } from '@/components/customer';
import { useTranslation } from '@/hooks/useTranslation';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const stats = {
    completed: 12,
    updated: 3,
    created: 1,
    dueSoon: 1
  };

  const statusData = [
    { status: 'draft', count: 2, color: '#d9d9d9', label: t('status_overview.statuses.draft') },
    { status: 'in_discussion', count: 5, color: '#1890ff', label: t('status_overview.statuses.in_discussion') },
    { status: 'approved', count: 4, color: '#52c41a', label: t('status_overview.statuses.approved') },
    { status: 'rejected', count: 2, color: '#ff4d4f', label: t('status_overview.statuses.rejected') },
    { status: 'ongoing', count: 5, color: '#13c2c2', label: t('status_overview.statuses.ongoing') },
    { status: 'closed', count: 2, color: '#722ed1', label: t('status_overview.statuses.closed') }
  ];

  const recentActivities = [
    {
      date: 'today',
      label: t('recent_activity.today'),
      activities: [
        {
          id: '1',
          type: 'created' as const,
          user: { name: 'Đỗ Thanh Long', avatar: '' },
          crId: 'CR-005',
          crTitle: 'Payment Integration',
          timestamp: '2024-03-23T10:30:00',
          timeAgo: '28m ago'
        }
      ]
    },
    {
      date: 'yesterday',
      label: t('recent_activity.yesterday'),
      activities: [
        {
          id: '2',
          type: 'commented' as const,
          user: { name: 'Đỗ Thanh Long', avatar: '' },
          crId: 'CR-002',
          crTitle: 'UI Redesign',
          timestamp: '2024-03-22T15:20:00',
          timeAgo: '1d ago'
        },
        {
          id: '3',
          type: 'status_change' as const,
          user: { name: 'Đỗ Thanh Long', avatar: '' },
          crId: 'CR-002',
          crTitle: 'UI Redesign',
          status: 'Approved',
          timestamp: '2024-03-22T14:10:00',
          timeAgo: '1d ago'
        }
      ]
    }
  ];

  const handleCreateCr = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    console.log('CR created successfully from dashboard');
    // Optionally refresh dashboard data here
  };

  const handleViewBreakdown = () => {
    navigate('/change-requests');
  };

  return (
    <div>
      <PageHeader
        title={t('page_title')}
        subtitle={t('page_subtitle')}
        actionLabel={t('create_cr')}
        onAction={handleCreateCr}
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CheckCircleOutlined />}
            value={stats.completed}
            label={t('stats.completed')}
            subtitle={t('stats.completed_subtitle')}
            iconColor="#52c41a"
            iconBgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<EditOutlined />}
            value={stats.updated}
            label={t('stats.updated')}
            subtitle={t('stats.updated_subtitle')}
            iconColor="#1890ff"
            iconBgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<PlusCircleOutlined />}
            value={stats.created}
            label={t('stats.created')}
            subtitle={t('stats.created_subtitle')}
            iconColor="#722ed1"
            iconBgColor="#f9f0ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<ClockCircleOutlined />}
            value={stats.dueSoon}
            label={t('stats.due_soon')}
            subtitle={t('stats.due_soon_subtitle')}
            iconColor="#fa8c16"
            iconBgColor="#fff7e6"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <StatusOverview
            data={statusData}
            activeSprint="Y"
            totalCrs={20}
            onViewDetails={handleViewBreakdown}
          />
        </Col>
        <Col xs={24} lg={12}>
          <RecentActivity
            activities={recentActivities}
            onMarkAllRead={() => console.log('Mark all read')}
            onLoadMore={() => console.log('Load more')}
          />
        </Col>
      </Row>

      {/* Create CR Modal */}
      <CreateCrModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default CustomerDashboardPage;
