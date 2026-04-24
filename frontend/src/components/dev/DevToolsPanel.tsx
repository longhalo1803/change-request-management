import { useEffect, useState } from "react";
import { Card, Button, List, Typography, Badge, Space, message } from "antd";
import { CopyOutlined, LinkOutlined, DeleteOutlined, BugOutlined } from "@ant-design/icons";
import { devToolsService, DevEmail } from "@/services/dev-tools.service";
import dayjs from "dayjs";

const { Text } = Typography;

export const DevToolsPanel = ({ email }: { email?: string }) => {
  const [emails, setEmails] = useState<DevEmail[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    if (!email) return;
    try {
      const data = await devToolsService.getEmails(email);
      setEmails(data);
    } catch (error) {
      console.error("Failed to fetch mock emails:", error);
    }
  };

  useEffect(() => {
    if (!import.meta.env.DEV || !email) return;
    
    fetchEmails();
    const interval = setInterval(fetchEmails, 3000);
    return () => clearInterval(interval);
  }, [email]);

  if (!import.meta.env.DEV || !email) {
    return null;
  }

  const handleCopyLink = (token: string) => {
    const link = devToolsService.generateResetLink(email, token);
    devToolsService.copyToClipboard(link);
    message.success("Link copied to clipboard");
  };

  const handleOpenLink = (token: string) => {
    const link = devToolsService.generateResetLink(email, token);
    window.open(link, "_blank");
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      await devToolsService.clearEmails(email);
      setEmails([]);
      message.success("Mock inbox cleared");
    } catch (error) {
      message.error("Failed to clear inbox");
    } finally {
      setLoading(false);
    }
  };

  const Countdown = ({ expiresAt }: { expiresAt: string }) => {
    const [timeLeft, setTimeLeft] = useState(dayjs(expiresAt).diff(dayjs(), 'second'));

    useEffect(() => {
      const timer = setInterval(() => {
        const left = dayjs(expiresAt).diff(dayjs(), 'second');
        setTimeLeft(left);
      }, 1000);
      return () => clearInterval(timer);
    }, [expiresAt]);

    if (timeLeft <= 0) {
      return <Text type="danger">Expired</Text>;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return <Text type={timeLeft < 120 ? "warning" : "secondary"}>Expires in: {formatted}</Text>;
  };

  return (
    <Card 
      title={<><BugOutlined /> DEV ONLY: Mock Inbox</>} 
      style={{ marginTop: 24, border: '1px dashed #1890ff', background: '#f0f5ff' }}
      headStyle={{ background: '#e6f7ff' }}
      extra={<Button danger size="small" icon={<DeleteOutlined />} onClick={handleClear} loading={loading}>Clear</Button>}
    >
      <List
        dataSource={emails}
        locale={{ emptyText: 'No emails received yet' }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button key="copy" type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopyLink(item.token)}>Copy</Button>,
              <Button key="open" type="link" size="small" icon={<LinkOutlined />} onClick={() => handleOpenLink(item.token)}>Open</Button>
            ]}
          >
            <List.Item.Meta
              title={<Space><Text strong>{item.subject}</Text> <Badge status="success" text="New" /></Space>}
              description={
                <Space direction="vertical" size={2}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Sent: {dayjs(item.sentAt).format('HH:mm:ss')}</Text>
                  <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>Token: {devToolsService.formatEmailForDisplay(item).displayToken}</Text>
                  <Countdown expiresAt={item.expiresAt} />
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
