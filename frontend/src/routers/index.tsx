import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { CustomerLayout } from '@/layouts';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'));
const CrListPage = lazy(() => import('@/pages/customer/CrListPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));

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

        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path="/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/change-requests" element={<CrListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
