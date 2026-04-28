import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LoginLayout } from "@/modules/auth/LoginLayout";
import { authService } from "@/services/auth.service";
import { PasswordStrengthIndicator } from "@/components/shared/PasswordStrengthIndicator";
import { useTranslation } from "@/hooks/useTranslation";

const ResetPasswordPage = () => {
  const { t } = useTranslation("auth");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const passwordValue = Form.useWatch("newPassword", form);

  useEffect(() => {
    if (!token || !email) {
      message.error(t("reset_password_invalid_link"));
      navigate("/forgot-password");
    }
  }, [token, email, navigate]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await authService.resetPassword(
        email as string,
        token as string,
        values.newPassword
      );
      message.success(t("reset_password_success_message"));
      navigate("/login");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        t("reset_password_failed");
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      title={t("reset_password_title")}
      subtitle={t("reset_password_subtitle")}
    >
      <Form
        form={form}
        name="reset_password"
        layout="vertical"
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="newPassword"
          label={t("reset_password_new_password")}
          rules={[
            { required: true, message: t("reset_password_validation_required") },
            { min: 8, message: t("reset_password_validation_min_length") },
            { pattern: /[A-Z]/, message: t("reset_password_validation_uppercase") },
            { pattern: /[a-z]/, message: t("reset_password_validation_lowercase") },
            { pattern: /[0-9]/, message: t("reset_password_validation_number") },
            { pattern: /[^A-Za-z0-9]/, message: t("reset_password_validation_special") }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("reset_password_placeholder_new_password")}
          />
        </Form.Item>

        <PasswordStrengthIndicator password={passwordValue} />

        <Form.Item
          name="confirmPassword"
          label={t("reset_password_confirm_password")}
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: t("reset_password_validation_confirm_required") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("reset_password_validation_confirm_match"))
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("reset_password_placeholder_confirm_password")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="mt-4"
          >
            {t("reset_password_button")}
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            {t("reset_password_back_to_login")}
          </Link>
        </div>
      </Form>
    </LoginLayout>
  );
};


export default ResetPasswordPage;
