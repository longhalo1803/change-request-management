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
import { useChangeRequests } from "@/hooks";

export const PMDashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  // Fetch CR data to get real stats
  const { data: crResponse, isLoading } = useChangeRequests({});
  const crData = crResponse?.items || [];

  // Calculate stats from real data if available
  const activeCount = crData.filter((cr) => {
    const statusName = cr.status?.name?.toUpperCase() || "";
    return (
      statusName === "IN_DISCUSSION" ||
      statusName === "APPROVED" ||
      statusName === "ON_GOING"
    );
  }).length;

  const completedCount = crData.filter(
    (cr) => (cr.status?.name?.toUpperCase() || "") === "CLOSED"
  ).length;

  const dueSoonCount = crData.filter(
    (cr) => (cr.status?.name?.toUpperCase() || "") === "ON_GOING" // In a real app we'd check dates
  ).length;

  const stats = {
    total: crData.length || 0,
    active: activeCount || 0,
    completed: completedCount || 0,
    dueSoon: dueSoonCount || 0,
  };

  const statusCounts = crData.reduce(
    (acc, cr) => {
      const status = cr.status?.name?.toLowerCase() || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusData = [
    {
      status: "in_discussion",
      count: statusCounts["in_discussion"] || 0,
      color: "#1890ff",
      label: t("status_overview.statuses.in_discussion") || "In Discussion",
    },
    {
      status: "approved",
      count: statusCounts["approved"] || 0,
      color: "#52c41a",
      label: t("status_overview.statuses.approved") || "Approved",
    },
    {
      status: "rejected",
      count: statusCounts["rejected"] || 0,
      color: "#ff4d4f",
      label: t("status_overview.statuses.rejected") || "Rejected",
    },
    {
      status: "ongoing",
      count: statusCounts["ongoing"] || 0,
      color: "#13c2c2",
      label: t("status_overview.statuses.ongoing") || "Ongoing",
    },
    {
      status: "closed",
      count: statusCounts["closed"] || 0,
      color: "#722ed1",
      label: t("status_overview.statuses.closed") || "Closed",
    },
  ];

  // Mock recent activities (In a real app, this would come from an API)
  const recentActivities = [
    {
      date: "today",
      label: t("recent_activity.today") || "Today",
      activities: [
        {
          id: "1",
          type: "status_change" as const,
          user: { name: "System", avatar: "" },
          crId: "CR-005",
          crTitle: "Payment Integration",
          status: "In Discussion",
          timestamp: new Date().toISOString(),
          timeAgo: "28m ago",
        },
      ],
    },
  ];

  const handleViewBreakdown = () => {
    navigate("/pm/crlist");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PM Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Project overview and recent activities
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<FileTextOutlined />}
            value={isLoading ? "-" : stats.total}
            label={"Total CRs"}
            subtitle={"All received CRs"}
            iconColor="#722ed1"
            iconBgColor="#f9f0ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<EditOutlined />}
            value={isLoading ? "-" : stats.active}
            label={"Active CRs"}
            subtitle={"Currently processing"}
            iconColor="#1890ff"
            iconBgColor="#e6f7ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CheckCircleOutlined />}
            value={isLoading ? "-" : stats.completed}
            label={"Completed"}
            subtitle={"Closed CRs"}
            iconColor="#52c41a"
            iconBgColor="#f6ffed"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<ClockCircleOutlined />}
            value={isLoading ? "-" : stats.dueSoon}
            label={"Ongoing"}
            subtitle={"Currently in implementation"}
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
    </div>
  );
};

export default PMDashboardPage;
