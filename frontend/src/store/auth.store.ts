import { create } from "zustand";
import { User } from "@/lib/types/user.types";

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

const STORAGE_KEY = "cr_auth_token";
const USER_STORAGE_KEY = "cr_auth_user";

const loadInitialState = (): Pick<AuthState, "accessToken" | "user"> => {
  try {
    // Clean up old localStorage data to prevent conflicts
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    const token = sessionStorage.getItem(STORAGE_KEY);
    const userJson = sessionStorage.getItem(USER_STORAGE_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    return { accessToken: token, user };
  } catch (_error) {
    return { accessToken: null, user: null };
  }
};

export const useAuthStore = create<AuthStore>((set) => {
  const initialState = loadInitialState();

  return {
    user: initialState.user,
    accessToken: initialState.accessToken,
    refreshToken: null,
    isAuthenticated: !!(initialState.accessToken && initialState.user),

    setTokens: (accessToken: string, refreshToken: string) => {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      set({
        accessToken,
        refreshToken,
      });
    },

    setUser: (user: User) => {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
      });
    },

    updateAccessToken: (accessToken: string) => {
      sessionStorage.setItem(STORAGE_KEY, accessToken);
      set({ accessToken });
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
    },
  };
});

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
export const selectUserRole = (state: AuthStore) => state.user?.role;
