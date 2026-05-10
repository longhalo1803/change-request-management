import { useState, useEffect } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { LoginLayout } from "@/modules/auth/LoginLayout";
import { authService } from "@/services/auth.service";
import { DevToolsPanel } from "@/components/dev/DevToolsPanel";
import { useTranslation } from "@/hooks/useTranslation";

const COOLDOWN_SECONDS = 60;
const STORAGE_KEY = 'forgot_password_cooldown';

const ForgotPasswordPage = () => {
  const { t } = useTranslation("auth");
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
       message.success(t("forgot_password_success_message"));
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
      title={t("forgot_password_title")}
      subtitle={t("forgot_password_subtitle")}
    >
       {isSuccess ? (
         <div className="text-center">
           <p className="mb-6 text-gray-600">
             {t("forgot_password_success_message")}
           </p>
           <Space direction="vertical" style={{ width: '100%' }} size="middle">
             <Button 
               type="primary" 
               block 
               onClick={handleResend}
               disabled={cooldown > 0}
               loading={loading}
             >
               {cooldown > 0 ? t("forgot_password_cooldown", { count: cooldown }) : t("forgot_password_resend_button")}
             </Button>
             <Link to="/login" style={{ display: 'block', width: '100%' }}>
               <Button block>
                 {t("forgot_password_return_to_login")}
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
               { required: true, message: t("validation.email_required") },
               { type: "email", message: t("validation.email_invalid") },
             ]}
           >
             <Input
               prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
               placeholder={t("forgot_password_email_placeholder")}
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
               {t("forgot_password_send_reset_link")}
             </Button>
           </Form.Item>

           <div className="text-center mt-4">
             <Link to="/login" className="text-blue-600 hover:text-blue-800">
               {t("forgot_password_back_to_login")}
             </Link>
           </div>
        </Form>
      )}
      
      {!isSuccess && submittedEmail && <DevToolsPanel email={submittedEmail} />}
    </LoginLayout>
  );
};

export default ForgotPasswordPage;
