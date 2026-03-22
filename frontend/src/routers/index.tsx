import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '@/lib/types/cr.types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const CrListPage = lazy(() => import('@/pages/Admin/CrListPage'));
const CrDetailPage = lazy(() => import('@/pages/Admin/CrDetailPage'));
const CrCreatePage = lazy(() => import('@/pages/Admin/CrCreatePage'));

// Loading component
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
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/roles" element={<CrDetailPage />} />
            <Route path="/users" element={<CrListPage />} />
            <Route path="/change-requests" element={<CrListPage />} />
            <Route path="/change-requests/new" element={<CrCreatePage />} />
            <Route path="/change-requests/:id" element={<CrDetailPage />} />
          </Route>
        </Route>

        {/* Admin only routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          {/* Add admin routes here */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
