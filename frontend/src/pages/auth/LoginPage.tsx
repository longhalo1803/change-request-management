import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Handle redirect using useEffect rather than returning Navigate
  // to avoid rendering conflicts and React 'update depth exceeded' warnings
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Don't render the login form if we're authenticated (about to redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default LoginPage;
