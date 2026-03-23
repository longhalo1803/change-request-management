import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { UserRole } from '@/lib/types/cr.types';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'));
const CrListPage = lazy(() => import('@/pages/customer/CrListPage'));
const CrDetailPage = lazy(() => import('@/pages/customer/CrDetailPage'));
const CrCreatePage = lazy(() => import('@/pages/customer/CrCreatePage'));
const CrQuotationPage = lazy(() => import('@/pages/customer/CrQuotationPage'));

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

        {/* Protected routes with MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/change-requests" element={<CrListPage />} />
            <Route path="/quote" element={<CrQuotationPage />} />
            <Route path="/change-requests/create" element={<CrCreatePage />} />
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
