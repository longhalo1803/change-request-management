import { create } from 'zustand';
import { User } from '@/lib/types/user.types';
import { useEffect } from 'react';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  /**
   * Atomically update tokens and authentication status.
   * MUST be called instead of separate setTokens/setUser calls.
   */
  updateAuthState: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => void;

  /**
   * Deprecated: Use updateAuthState instead for atomic updates
   * Kept for backwards compatibility during migration
   */
  setTokens: (accessToken: string, refreshToken: string) => void;

  /**
   * Deprecated: Use updateAuthState instead for atomic updates
   * Kept for backwards compatibility during migration
   */
  setUser: (user: User) => void;

  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const STORAGE_KEY = 'cr_auth_token';
const USER_STORAGE_KEY = 'cr_auth_user';

// Cache initial state to prevent re-initialization on every store access
let initialStateCache: Pick<AuthState, 'accessToken' | 'user'> | null = null;

const loadInitialState = (): Pick<AuthState, 'accessToken' | 'user'> => {
  // Return cached state if available (only load from storage once)
  if (initialStateCache !== null) {
    return initialStateCache;
  }

  try {
    const token = sessionStorage.getItem(STORAGE_KEY);
    const userJson = sessionStorage.getItem(USER_STORAGE_KEY);
    const user = userJson ? JSON.parse(userJson) : null;

    // Cache the result so future store accesses don't re-read storage
    initialStateCache = { accessToken: token, user };
    return initialStateCache;
  } catch (_error) {
    initialStateCache = { accessToken: null, user: null };
    return initialStateCache;
  }
};

// Helper to reset cache when needed (e.g., during logout from another tab)
const resetInitialStateCache = () => {
  initialStateCache = null;
};

export const useAuthStore = create<AuthStore>((set) => {
  const initialState = loadInitialState();

  return {
    user: initialState.user,
    accessToken: initialState.accessToken,
    refreshToken: null,
    isAuthenticated: !!(initialState.accessToken && initialState.user),

    /**
     * PREFERRED METHOD: Atomically update all auth state.
     * Ensures isAuthenticated is only true when both token AND user exist.
     */
    updateAuthState: (
      accessToken: string,
      refreshToken: string,
      user: User
    ) => {
      // Update storage first (before state update for consistency)
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      // Single atomic state update
      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
      });

      // Invalidate cache since we've updated storage
      resetInitialStateCache();
    },

    setTokens: (accessToken: string, refreshToken: string) => {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      set({
        accessToken,
        refreshToken,
        // NOTE: isAuthenticated NOT updated here - use updateAuthState instead
      });
      resetInitialStateCache();
    },

    setUser: (user: User) => {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
      });
      resetInitialStateCache();
    },

    updateAccessToken: (accessToken: string) => {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      set({ accessToken });
      resetInitialStateCache();
    },

    logout: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      resetInitialStateCache();
    },
  };
});

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.user?.role;

/**
 * Hook for listening to auth changes from other tabs.
 * Syncs logout/login events across browser tabs.
 */
export const useAuthSyncListener = () => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If token was cleared in another tab, logout here too
      if ((e.key === STORAGE_KEY || e.key === USER_STORAGE_KEY) && !e.newValue) {
        useAuthStore.getState().logout();
        // Force page reload to ensure clean state
        window.location.href = '/login';
      }
      // If token changed, invalidate cache so next read gets fresh data
      if (e.key === STORAGE_KEY || e.key === USER_STORAGE_KEY) {
        resetInitialStateCache();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};
