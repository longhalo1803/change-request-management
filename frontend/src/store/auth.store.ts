import { create } from 'zustand';
import { User } from '@/lib/types/cr.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const STORAGE_KEY = 'cr_auth_token';

// Load initial state from localStorage
const loadInitialState = (): Pick<AuthState, 'accessToken'> => {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    return { accessToken: token };
  } catch {
    return { accessToken: null };
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  accessToken: loadInitialState().accessToken,
  refreshToken: null,
  isAuthenticated: !!loadInitialState().accessToken,

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEY, accessToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  updateAccessToken: (accessToken: string) => {
    localStorage.setItem(STORAGE_KEY, accessToken);
    set({ accessToken });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  }
}));

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.user?.role;
