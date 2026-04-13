import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, selectUserRole } from "@/store/auth.store";
import { UserRole } from "@/lib/types";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

/**
 * Role-Based Route Guard
 *
 * Ensures user has the required role to access the route
 * Redirects to appropriate dashboard if role mismatch
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages role-based access control
 * - Dependency Inversion: Depends on auth store abstraction
 */
export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const userRole = useAuthStore(selectUserRole);

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect based on actual role
    if (userRole === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === UserRole.PM) {
      return <Navigate to="/pm/dashboard" replace />;
    }
    // Default to login if user role is completely invalid
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
