import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useTranslation } from './useTranslation';

export const useLogout = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { logout, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    
    onSuccess: () => {
      logout();
      message.success(t('logout_success'));
      navigate('/login', { replace: true });
    },
    
    onError: () => {
      // Even if logout fails, clear local state and redirect
      logout();
      navigate('/login', { replace: true });
    }
  });
};
