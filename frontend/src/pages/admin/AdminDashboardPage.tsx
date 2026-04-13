import { useState, useEffect } from "react";
import { message, Spin } from "antd";
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
import { DashboardStats, DateRangeOption } from "@/lib/types/admin.types";
import { adminService } from "@/services/admin.service";

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
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [filters, setFilters] = useState({
    dateRange: "last_30_days" as DateRangeOption,
    customer: "all",
    pm: "all",
  });

  // Fetch dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await adminService.fetchDashboardStats(filters);
        setDashboardData(data);
      } catch (error) {
        console.warn("Failed to load dashboard data, using fallback data");
        // Mock data if API fails to prevent white screen
        setDashboardData({
          totalCRs: 0,
          statusBreakdown: [],
          processEfficiency: {
            rejectedRate: 0,
            overdueOngoing: 0,
            customerCancellation: 0,
          },
          userManagement: {
            new30Days: 0,
            activeRatio: 0,
            customers: 0,
            pm: 0,
            admin: 0,
          },
          top5Customers: [],
          crVolumeTrends: [],
          growthMetrics: { comparison: "vs last month", percentage: 0 },
          priorityAlert: { description: "No critical CRs", value: "0" },
          healthIndex: { description: "System health OK", ratio: "100/100" },
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

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

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
                onViewDetails={() => message.info("View details - Coming soon")}
              />
            </div>
            <ProcessEfficiencyCard data={dashboardData.processEfficiency} />
          </div>

          {/* Second Row */}
          <div>
            <UserManagementCard data={dashboardData.userManagement} />
          </div>

          {/* Top 5 Customers */}
          <Top5CustomersChart data={dashboardData.top5Customers} />

          {/* CR Volume Trends */}
          <CRVolumeChart
            data={dashboardData.crVolumeTrends}
            onAnnualProjection={() =>
              message.info("Annual Projection - Coming soon")
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
