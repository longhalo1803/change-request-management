import React from 'react';
import { Progress, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  // Requirements
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 number', met: /[0-9]/.test(password) },
    { label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const score = requirements.filter(req => req.met).length;

  let percent = 0;
  let color = '#ff4d4f'; // red
  let statusText = 'Weak';

  if (score === 0) {
    percent = 0;
  } else if (score <= 2) {
    percent = 25;
    color = '#ff4d4f';
    statusText = 'Weak';
  } else if (score === 3) {
    percent = 50;
    color = '#faad14'; // orange
    statusText = 'Fair';
  } else if (score === 4) {
    percent = 75;
    color = '#1677ff'; // blue
    statusText = 'Good';
  } else if (score === 5) {
    percent = 100;
    color = '#52c41a'; // green
    statusText = 'Strong';
  }

  return (
    <div style={{ marginTop: 8, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Password Strength</Text>
        <Text style={{ fontSize: 12, color, fontWeight: 'bold' }}>{statusText}</Text>
      </div>
      
      <Progress 
        percent={percent} 
        showInfo={false} 
        strokeColor={color}
        size="small"
        style={{ marginBottom: 12 }}
      />
      
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        {requirements.map((req, idx) => (
          <Space key={idx} size={8}>
            {req.met ? (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
            )}
            <Text 
              type={req.met ? "success" : "secondary"} 
              style={{ fontSize: 12, transition: 'color 0.3s' }}
            >
              {req.label}
            </Text>
          </Space>
        ))}
      </Space>
    </div>
  );
};
