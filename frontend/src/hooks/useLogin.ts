import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService, LoginCredentials } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "./useTranslation";
import { AxiosError } from "axios";
import type { ApiErrorResponse, User, UserRole } from "@/lib/types";

export const useLogin = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  const getRedirectPath = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "pm":
        return "/pm/dashboard";
      case "customer":
      default:
        return "/dashboard";
    }
  };

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),

    onSuccess: (data: {
      tokens: { accessToken: string; refreshToken: string };
      user: User;
    }) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user);
      message.success(t("login_success"));
      const redirectPath = getRedirectPath(data.user.role);
      navigate(redirectPath, { replace: true });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || t("login_failed");
      message.error(errorMessage);
    },
  });
};
