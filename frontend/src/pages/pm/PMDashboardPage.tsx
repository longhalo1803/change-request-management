import { Row, Col } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/shared/StatCard";
import { StatusOverview } from "@/modules/dashboard/StatusOverview";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useDashboardStats,
  useDashboardStatusOverview,
  useDashboardRecentActivities,
} from "@/hooks/useDashboard";
import { Spin, Alert } from "antd";

export const PMDashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");
  const { t: tPm } = useTranslation("pm");

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
     total: 0,
     active: 0,
     completed: 0,
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

  const handleViewBreakdown = () => {
    navigate("/pm/crlist");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{tPm("title")}</h1>
        <p className="text-gray-600 mt-2">{tPm("subtitle")}</p>
      </div>

       {error ? (
         <Alert
           message={t("errors.loading_failed")}
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
                icon={<FileTextOutlined />}
                value={stats.total}
                label={tPm("stats.total_crs")}
                subtitle={tPm("stats.subtitle_total")}
                iconColor="#722ed1"
                iconBgColor="#f9f0ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<EditOutlined />}
                value={stats.active}
                label={tPm("stats.active_crs")}
                subtitle={tPm("stats.subtitle_active")}
                iconColor="#1890ff"
                iconBgColor="#e6f7ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<CheckCircleOutlined />}
                value={stats.completed}
                label={tPm("stats.completed")}
                subtitle={tPm("stats.subtitle_completed")}
                iconColor="#52c41a"
                iconBgColor="#f6ffed"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={<ClockCircleOutlined />}
                value={stats.dueSoon}
                label={tPm("stats.ongoing")}
                subtitle={tPm("stats.subtitle_ongoing")}
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
                totalCrs={stats.total}
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
    </div>
  );
};

export default PMDashboardPage;
