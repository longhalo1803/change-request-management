import { useState, useEffect } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { LoginLayout } from "@/modules/auth/LoginLayout";
import { authService } from "@/services/auth.service";
import { DevToolsPanel } from "@/components/dev/DevToolsPanel";

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = 'forgot_password_cooldown';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Check local storage for existing cooldown
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { email, expireAt } = JSON.parse(saved);
        if (expireAt > Date.now()) {
          setCooldown(Math.ceil((expireAt - Date.now()) / 1000));
          setSubmittedEmail(email);
          setIsSuccess(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const startCooldown = (email: string) => {
    setCooldown(COOLDOWN_SECONDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      email,
      expireAt: Date.now() + COOLDOWN_SECONDS * 1000
    }));
  };

  const handleRequestReset = async (email: string) => {
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setIsSuccess(true);
      setSubmittedEmail(email);
      startCooldown(email);
      message.success("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to send reset email";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: { email: string }) => {
    handleRequestReset(values.email);
  };

  const handleResend = () => {
    if (cooldown === 0 && submittedEmail) {
      handleRequestReset(submittedEmail);
    }
  };

  return (
    <LoginLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
    >
      {isSuccess ? (
        <div className="text-center">
          <p className="mb-6 text-gray-600">
            If an account exists for that email, we have sent a password reset
            link. The link will expire in 15 minutes. Please check your inbox and spam folder.
          </p>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              type="primary" 
              block 
              onClick={handleResend}
              disabled={cooldown > 0}
              loading={loading}
            >
              {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend email"}
            </Button>
            <Link to="/login" style={{ display: 'block', width: '100%' }}>
              <Button block>
                Return to Login
              </Button>
            </Link>
          </Space>
          
          <DevToolsPanel email={submittedEmail} />
        </div>
      ) : (
        <Form
          name="forgot_password"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email address"
              autoFocus
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
              Send Reset Link
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Back to login
            </Link>
          </div>
        </Form>
      )}
      
      {!isSuccess && submittedEmail && <DevToolsPanel email={submittedEmail} />}
    </LoginLayout>
  );
};

export default ForgotPasswordPage;
