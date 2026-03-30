import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '@/store/auth.store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
