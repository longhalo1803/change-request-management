import { Row, Col, Card, Statistic, Table, Space, Tag } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { PageHeader } from '@/components/PageHeader';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Admin Dashboard Page
 * 
 * Displays system statistics and metrics
 * Shows overview of users, change requests, and projects
 * 
 * SOLID Principles:
 * - Single Responsibility: Only displays admin dashboard
 * - Dependency Inversion: Uses translation hook for i18n
 */
const AdminDashboardPage = () => {
  const { t } = useTranslation('admin');

  // Mock statistics data
  const stats = {
    totalUsers: 42,
    totalCrs: 157,
    activeProjects: 8,
    systemHealth: 98.5
  };

  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      action: 'User Created',
      description: 'New user john.doe@company.com added',
      timestamp: '2026-03-31 10:30 AM',
      user: 'Admin'
    },
    {
      id: 2,
      action: 'CR Approved',
      description: 'Change Request CR-001 approved',
      timestamp: '2026-03-31 09:15 AM',
      user: 'Admin'
    },
    {
      id: 3,
      action: 'Project Created',
      description: 'New project "Mobile App v2.0" created',
      timestamp: '2026-03-30 03:45 PM',
      user: 'Admin'
    },
    {
      id: 4,
      action: 'User Deleted',
      description: 'User jane.smith@company.com removed',
      timestamp: '2026-03-30 02:20 PM',
      user: 'Admin'
    }
  ];

  // Mock CR status data
  const crStatusData = [
    {
      id: 1,
      status: 'Approved',
      count: 45,
      percentage: 28.7,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: 'success'
    },
    {
      id: 2,
      status: 'Pending',
      count: 78,
      percentage: 49.7,
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      color: 'warning'
    },
    {
      id: 3,
      status: 'Rejected',
      count: 34,
      percentage: 21.7,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      color: 'error'
    }
  ];

  const activityColumns = [
    {
      title: t('dashboard.recent_activity'),
      dataIndex: 'action',
      key: 'action',
      width: '20%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 100
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180
    }
  ];

  return (
    <div>
      <PageHeader 
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      <div style={{ padding: '24px' }}>
        {/* Statistics Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title={t('dashboard.statistics.total_users')}
                value={stats.totalUsers}
                prefix={<UserOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: '#0052CC' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title={t('dashboard.statistics.total_crs')}
                value={stats.totalCrs}
                prefix={<FileTextOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title={t('dashboard.statistics.active_projects')}
                value={stats.activeProjects}
                prefix={<ProjectOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title={t('dashboard.statistics.system_health')}
                value={stats.systemHealth}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* CR Status and Recent Activity */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={t('dashboard.quick_stats')}
              style={{ minHeight: '400px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {crStatusData.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      {item.icon}
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{item.status}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#8c8c8c' }}>
                          {item.count} requests
                        </p>
                      </div>
                    </Space>
                    <Tag color={item.color}>{item.percentage}%</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={t('dashboard.recent_activity')}
              style={{ minHeight: '400px' }}
            >
              <Table
                dataSource={recentActivities}
                columns={activityColumns}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
