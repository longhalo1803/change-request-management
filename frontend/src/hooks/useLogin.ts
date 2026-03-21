import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService, LoginCredentials } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from './useTranslation';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib/types/api.types';

/**
 * Login Hook
 * 
 * Handles login mutation with TanStack Query
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles login logic
 * - Dependency Inversion: Depends on authService abstraction
 */

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    
    onSuccess: (data) => {
      // Store tokens and user
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user);

      // Show success message
      message.success(t('login_success'));

      // Redirect to dashboard
      navigate('/dashboard');
    },
    
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || t('login_failed');
      message.error(errorMessage);
    }
  });
};
