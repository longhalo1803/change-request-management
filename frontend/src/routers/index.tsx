import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { CustomerLayout } from '@/layouts';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PMLayout } from '@/layouts/PMLayout';
import { UserRole } from '@/lib/types';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'));
const CrListPage = lazy(() => import('@/pages/customer/CrListPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminPermissionsPage = lazy(() => import('@/pages/admin/PermissionsPage'));

const PMDashboardPage = lazy(() => import('@/pages/pm/PMDashboardPage'));

const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.CUSTOMER]} />}>
            <Route element={<CustomerLayout />}>
              <Route path="/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/change-requests" element={<CrListPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/permissions" element={<AdminPermissionsPage />} />
            </Route>
          </Route>
        </Route>

        {/* PM Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.PM]} />}>
            <Route element={<PMLayout />}>
              <Route path="/pm/dashboard" element={<PMDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
