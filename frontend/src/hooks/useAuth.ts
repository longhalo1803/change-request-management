import { useAuthStore, selectUser, selectIsAuthenticated, selectUserRole } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useTranslation } from './useTranslation';

export const useAuth = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userRole = useAuthStore(selectUserRole);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      logout();
      message.success(t('logout_success'));
      navigate('/login');
    } catch (error) {
      logout();
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    userRole,
    logout: handleLogout
  };
};
