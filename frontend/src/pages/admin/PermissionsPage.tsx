import { PageHeader } from '@/components/shared/PageHeader';
import { PermissionsPage } from '@/components/permissions';

/**
 * Admin Permissions Page
 * Wrapper for permissions management component
 */
const AdminPermissionsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-full">
        {/* Page Header */}
        <PageHeader 
          title="Permissions Management"
          subtitle="Manage user accounts and permission groups"
        />

        {/* Main Content */}
        <div className="px-6 py-6">
          <PermissionsPage />
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionsPage;
