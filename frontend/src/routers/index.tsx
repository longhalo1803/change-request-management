import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import { CustomerLayout } from "@/layouts";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PMLayout } from "@/layouts/PMLayout";
import { UserRole } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));

const CustomerDashboardPage = lazy(
  () => import("@/pages/customer/CustomerDashboardPage")
);
const CrListPage = lazy(() => import("@/pages/customer/CrListPage"));
const ProfilePage = lazy(() => import("@/pages/customer/ProfilePage"));

const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage")
);
const AdminCrListPage = lazy(() => import("@/pages/admin/AdminCrListPage"));
const AdminPermissionsPage = lazy(
  () => import("@/pages/admin/PermissionsPage")
);

const PMDashboardPage = lazy(() => import("@/pages/pm/PMDashboardPage"));
const PMCrListPage = lazy(() => import("@/pages/pm/PMCrListPage"));

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

const AppRouter = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      // Check for token in sessionStorage directly instead of reading state
      // This prevents the infinite render loop caused by reading state during render
      const token = sessionStorage.getItem("cr_auth_token");

      if (!token) {
        if (isMounted) setIsCheckingSession(false);
        return;
      }

      try {
        // Attempt to fetch current user to validate token
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setIsCheckingSession(false);
        }
      } catch (_error) {
        // Token is invalid, expired, or backend was reset
        console.warn("Session validation failed, logging out...");
        if (isMounted) {
          logout();
          setIsCheckingSession(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [logout, setUser]); // Only run once on mount, no longer depends on accessToken or isAuthenticated

  if (isCheckingSession) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={<RoleBasedRoute allowedRoles={[UserRole.CUSTOMER]} />}
          >
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
              <Route
                path="/admin/change-requests"
                element={<AdminCrListPage />}
              />
              <Route
                path="/admin/permissions"
                element={<AdminPermissionsPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* PM Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.PM]} />}>
            <Route element={<PMLayout />}>
              <Route path="/pm/dashboard" element={<PMDashboardPage />} />
              <Route path="/pm/crlist" element={<PMCrListPage />} />
              <Route path="/pm/update-profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
