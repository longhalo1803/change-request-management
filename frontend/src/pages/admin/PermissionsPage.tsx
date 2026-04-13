import { PageHeader } from "@/components/shared/PageHeader";
import { PermissionsPage as PermissionsComponent } from "@/components/permissions";
import { useTranslation } from "react-i18next";

/**
 * Admin Permissions Page
 * Wrapper for permissions management component
 */
const AdminPermissionsPage = () => {
  const { t } = useTranslation("admin");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-full">
        {/* Page Header */}
        <PageHeader
          title={t("permissions.title")}
          subtitle={t("permissions.subtitle")}
        />

        {/* Main Content */}
        <div className="px-6 py-6">
          <PermissionsComponent />
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionsPage;
