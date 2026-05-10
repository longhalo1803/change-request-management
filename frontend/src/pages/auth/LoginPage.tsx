// FIXED LoginPage.tsx - Wait for complete auth state
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectUser } from '@/store/auth.store';
import { LoginLayout } from '@/modules/auth/LoginLayout';
import { LoginForm } from '@/modules/auth/LoginForm';
import { UserRole } from '@/lib/types';
import { Spin } from 'antd';

/**
 * Login Page
 *
 * Public page for user authentication
 * Redirects to appropriate dashboard if already authenticated
 *
 * FIX: Wait for BOTH isAuthenticated AND user to exist before redirecting
 * This prevents redirect loops where user data is null on destination page
 */

const LoginPage = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if BOTH conditions are met:
    // 1. User is authenticated
    // 2. User data is loaded (not null)
    if (isAuthenticated && user) {
      // Determine redirect path based on role
      const redirectPath =
        user.role === UserRole.ADMIN
          ? '/admin/dashboard'
          : user.role === UserRole.PM
            ? '/pm/dashboard'
            : '/dashboard';

      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]); // Include user in deps

  // If authenticated but still loading user data, show spinner
  if (isAuthenticated && !user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  // Don't render the login form if we're authenticated
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
