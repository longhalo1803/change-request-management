import { useState } from "react";
import { message, Spin, Alert } from "antd";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { StatusOverview } from "@/modules/dashboard/StatusOverview";
import {
  FilterBar,
  ProcessEfficiencyCard,
  UserManagementCard,
  Top5CustomersChart,
  CRVolumeChart,
  MetricsFooter,
} from "@/components/admin";
import { DashboardFilters, DateRangeOption } from "@/lib/types/admin.types";
import { adminService } from "@/services/admin.service";
import {
  useComprehensiveStats,
  useTopCustomers,
  useVolumeTrends,
} from "@/hooks/useAdmin";

/**
 * Admin Dashboard Page
 *
 * Displays comprehensive dashboard with:
 * - Status overview (donut chart)
 * - Process efficiency metrics
 * - User management statistics
 * - CR volume trends by priority
 * - Top 5 customers
 * - Growth metrics and alerts
 *
 * SOLID Principles:
 * - Single Responsibility: Orchestrates dashboard components and data fetching
 * - Open/Closed: Easy to extend with new metrics
 * - Dependency Inversion: Uses service abstraction for data fetching
 */
const AdminDashboardPage = () => {
  const { t } = useTranslation("admin");
  const { t: tCommon } = useTranslation("common");
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "last_30_days",
    customer: "all",
    pm: "all",
  });

  const {
    data: dashboardData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useComprehensiveStats(filters);

  const {
    data: topCustomers,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
  } = useTopCustomers(filters);

  const {
    data: volumeTrends,
    isLoading: isTrendsLoading,
    isError: isTrendsError,
  } = useVolumeTrends(filters);

  const loading = isStatsLoading || isCustomersLoading || isTrendsLoading;
  const isError = isStatsError || isCustomersError || isTrendsError;

  // Handle filter changes
  const handleDateRangeChange = (range: DateRangeOption) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const handleCustomerChange = (customer: string) => {
    setFilters((prev) => ({ ...prev, customer }));
  };

  const handlePMChange = (pm: string) => {
    setFilters((prev) => ({ ...prev, pm }));
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await adminService.exportDashboardAsPDF();
      message.success("Dashboard exported as PDF successfully!");
    } catch (error) {
      message.error("Failed to export dashboard");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load dashboard data. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-full">
        {/* Page Header */}
        <PageHeader
          title={t("dashboard.title") || "Admin Dashboard"}
          subtitle={
            t("dashboard.subtitle") || "Comprehensive analytics and metrics"
          }
        />

        {/* Main Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Filter Bar */}
          <FilterBar
            dateRange={filters.dateRange}
            onDateRangeChange={handleDateRangeChange}
            selectedCustomer={filters.customer}
            onCustomerChange={handleCustomerChange}
            selectedPM={filters.pm}
            onPMChange={handlePMChange}
            onExportPDF={handleExportPDF}
            isExporting={exporting}
          />

          {/* Top Row: Three Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <StatusOverview
                data={dashboardData.statusBreakdown
                  .filter((item) => item.status !== "draft") // Hide DRAFT for admin
                  .map((item) => ({
                    status: item.status,
                    count: item.count,
                    color: item.color,
                    label:
                      item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).replace(/_/g, " "),
                  }))}
                totalCrs={dashboardData.totalCRs}
                onViewDetails={() =>
                  message.info(
                    `View details - ${tCommon("messages.coming_soon")}`
                  )
                }
              />
            </div>
            <ProcessEfficiencyCard data={dashboardData.processEfficiency} />
          </div>

          {/* Second Row */}
          <div>
            <UserManagementCard data={dashboardData.userManagement} />
          </div>

          {/* Top 5 Customers */}
          <Top5CustomersChart data={topCustomers || []} />

          {/* CR Volume Trends */}
          <CRVolumeChart
            data={volumeTrends || []}
            onAnnualProjection={() =>
              message.info(
                `Annual Projection - ${tCommon("messages.coming_soon")}`
              )
            }
            growthPercentage={dashboardData.growthMetrics.percentage}
          />

          {/* Metrics Footer */}
          <MetricsFooter
            growthMetrics={dashboardData.growthMetrics}
            priorityAlert={dashboardData.priorityAlert}
            healthIndex={dashboardData.healthIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
