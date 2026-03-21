import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectUserRole } from '@/store/auth.store';
import { UserRole } from '@/lib/types/cr.types';

/**
 * Protected Route Component
 * 
 * Protects routes that require authentication
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles route protection
 * - Open/Closed: Easy to extend with additional checks
 */

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userRole = useAuthStore(selectUserRole);

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
