import { Navigate } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "@/store/auth.store";
import { LoginLayout } from "@/modules/auth/LoginLayout";
import { LoginForm } from "@/modules/auth/LoginForm";

/**
 * Login Page
 *
 * Public page for user authentication
 * Redirects to dashboard if already authenticated
 *
 * SOLID Principles:
 * - Single Responsibility: Only composes login layout and form
 * - Dependency Inversion: Depends on auth store abstraction
 */

const LoginPage = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default LoginPage;
