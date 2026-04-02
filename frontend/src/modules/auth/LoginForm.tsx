import { Form, Input, Button, Checkbox } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "@/hooks/useLogin";
import { useValidationSchemas } from "@/hooks/useValidationMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import type { LoginFormData } from "@/lib/validators";
import { useTranslation } from "@/hooks/useTranslation";

export const LoginForm = () => {
  const { t } = useTranslation("auth");
  const { getLoginSchema } = useValidationSchemas();
  const loginMutation = useLogin();

  const loginSchema = getLoginSchema();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label={t("email")}
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("email_placeholder")}
              autoComplete="email"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t("password")}
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
        extra={
          <a href="/forgot-password" style={{ float: "right", marginTop: 4 }}>
            {t("forgot_password")}
          </a>
        }
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("password_placeholder")}
              autoComplete="current-password"
            />
          )}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 24 }}>
        <Checkbox>{t("remember_me")}</Checkbox>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loginMutation.isPending}
          size="large"
        >
          {t("sign_in_button")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
