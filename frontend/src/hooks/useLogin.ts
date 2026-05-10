// FIXED useLogin.ts - Use atomic updateAuthState
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService, LoginCredentials } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from './useTranslation';
import { AxiosError } from 'axios';
import type { ApiErrorResponse, User } from '@/lib/types';
import { UserRole } from '@/lib/types';

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { updateAuthState } = useAuthStore();

  const getRedirectPath = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.PM:
        return '/pm/dashboard';
      case UserRole.CUSTOMER:
      default:
        return '/dashboard';
    }
  };

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),

    onSuccess: (data: {
      tokens: { accessToken: string; refreshToken: string };
      user: User;
    }) => {
      // Use atomic update instead of separate setTokens + setUser
      // This ensures isAuthenticated becomes true only when both token AND user exist
      updateAuthState(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user
      );

      message.success(t('login_success'));
      const redirectPath = getRedirectPath(data.user.role);
      navigate(redirectPath, { replace: true });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || t('login_failed');
      message.error(errorMessage);
    },
  });
};
