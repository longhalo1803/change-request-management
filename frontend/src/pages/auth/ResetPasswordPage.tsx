import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { LoginLayout } from "@/modules/auth/LoginLayout";
import { authService } from "@/services/auth.service";
import { PasswordStrengthIndicator } from "@/components/shared/PasswordStrengthIndicator";

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const passwordValue = Form.useWatch("newPassword", form);

  useEffect(() => {
    if (!token || !email) {
      message.error("Invalid reset link. Please request a new one.");
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
      message.success("Password has been successfully reset!");
      navigate("/login");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to reset password. Token may be invalid or expired.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout
      title="Reset Password"
      subtitle="Choose a new password for your account"
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
          label="New Password"
          rules={[
            { required: true, message: "Please input your new password!" },
            { min: 8, message: "Password must be at least 8 characters long." },
            { pattern: /[A-Z]/, message: "Must contain at least 1 uppercase letter." },
            { pattern: /[a-z]/, message: "Must contain at least 1 lowercase letter." },
            { pattern: /[0-9]/, message: "Must contain at least 1 number." },
            { pattern: /[^A-Za-z0-9]/, message: "Must contain at least 1 special character." }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="New Password"
          />
        </Form.Item>

        <PasswordStrengthIndicator password={passwordValue} />

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Confirm Password"
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
            Reset Password
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </div>
      </Form>
    </LoginLayout>
  );
};

export default ResetPasswordPage;
