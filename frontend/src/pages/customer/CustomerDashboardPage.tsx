import { useState } from "react";
import { Row, Col } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusOverview } from "@/modules/dashboard/StatusOverview";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { CreateCrModal } from "@/components/customer";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useDashboardStats,
  useDashboardStatusOverview,
  useDashboardRecentActivities,
} from "@/hooks/useDashboard";
import { Spin, Alert } from "antd";

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
  } = useDashboardStats();

  const {
    data: statusDataOverview,
    isLoading: isStatusLoading,
    error: statusError,
  } = useDashboardStatusOverview();

  const {
    data: recentActivitiesData,
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useDashboardRecentActivities();

  const isLoading = isStatsLoading || isStatusLoading || isActivitiesLoading;
  const error = statsError || statusError || activitiesError;

  const stats = statsData || {
    completed: 0,
    updated: 0,
    created: 0,
    dueSoon: 0,
  };

  const statusData = (statusDataOverview || []).map((item: any) => ({
    ...item,
    label: t(`status_overview.statuses.${item.status.toLowerCase()}` as any, {
      defaultValue: item.status,
    }),
  }));

  const recentActivities = (recentActivitiesData || []).map((group: any) => ({
    ...group,
    label: t(`recent_activity.${group.date}` as any),
  }));

  const handleCreateCr = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    console.log("CR created successfully from dashboard");
    // Optionally refresh dashboard data here
  };

  const handleViewBreakdown = () => {
    navigate("/change-requests");
  };

  return (
    <div>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        actionLabel={t("create_cr")}
        onAction={handleCreateCr}
      />

      {error ? (
        <Alert
          message="Error loading dashboard data"
          type="error"
          showIcon
          className="mb-6"
        />
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<CheckCircleOutlined />}
                value={stats.completed}
                label={t("stats.completed")}
                subtitle={t("stats.completed_subtitle")}
                iconColor="#52c41a"
                iconBgColor="#f6ffed"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<EditOutlined />}
                value={stats.updated}
                label={t("stats.updated")}
                subtitle={t("stats.updated_subtitle")}
                iconColor="#1890ff"
                iconBgColor="#e6f7ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<PlusCircleOutlined />}
                value={stats.created}
                label={t("stats.created")}
                subtitle={t("stats.created_subtitle")}
                iconColor="#722ed1"
                iconBgColor="#f9f0ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<ClockCircleOutlined />}
                value={stats.dueSoon}
                label={t("stats.due_soon")}
                subtitle={t("stats.due_soon_subtitle")}
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
                totalCrs={
                  stats.created +
                  stats.updated +
                  stats.completed +
                  stats.dueSoon
                }
                onViewDetails={handleViewBreakdown}
              />
            </Col>
            <Col xs={24} lg={12}>
              <RecentActivity
                activities={recentActivities}
                onMarkAllRead={() => console.log("Mark all read")}
                onLoadMore={() => console.log("Load more")}
              />
            </Col>
          </Row>
        </>
      )}

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
