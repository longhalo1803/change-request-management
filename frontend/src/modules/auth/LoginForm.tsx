import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useLogin';
import { useTranslation } from '@/hooks/useTranslation';
import type { LoginCredentials } from '@/services/auth.service';

export const LoginForm = () => {
  const { t } = useTranslation('auth');
  const [form] = Form.useForm();
  const loginMutation = useLogin();

  const handleSubmit = (values: LoginCredentials & { remember?: boolean }) => {
    const { email, password } = values;
    loginMutation.mutate({ email, password });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      size="large"
    >
      <Form.Item
        label={t('email')}
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' }
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
          placeholder={t('email_placeholder')}
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        label={t('password')}
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
        extra={
          <a href="/forgot-password" style={{ float: 'right', marginTop: 4 }}>
            {t('forgot_password')}
          </a>
        }
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
          placeholder={t('password_placeholder')}
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 24 }}>
        <Checkbox>{t('remember_me')}</Checkbox>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loginMutation.isPending}
          size="large"
        >
          {t('sign_in_button')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
