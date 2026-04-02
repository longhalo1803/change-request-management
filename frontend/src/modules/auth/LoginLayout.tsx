import { ReactNode } from "react";
import { Row, Col, Typography, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

const { Title, Text, Paragraph } = Typography;

interface LoginLayoutProps {
  children: ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  const { t } = useTranslation("auth");

  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col
        xs={0}
        md={12}
        style={{
          background: "linear-gradient(135deg, #0052CC 0%, #003D99 100%)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <div>
          <Space align="center" size="middle">
            <div
              style={{
                width: 40,
                height: 40,
                background: "white",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 24, color: "#0052CC" }}>✦</span>
            </div>
            <Title level={3} style={{ color: "white", margin: 0 }}>
              Solashi Connect
            </Title>
          </Space>
        </div>

        <div style={{ maxWidth: 480 }}>
          <Title
            level={1}
            style={{ color: "white", fontSize: 48, marginBottom: 24 }}
          >
            {t("tagline")}
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
            {t("description")}
          </Paragraph>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "16px 20px",
            backdropFilter: "blur(10px)",
            maxWidth: 280,
          }}
        >
          <Space>
            <CheckCircleOutlined style={{ fontSize: 20, color: "#52c41a" }} />
            <div>
              <Text
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 12,
                  display: "block",
                }}
              >
                {t("system_status")}
              </Text>
              <Text strong style={{ color: "white", fontSize: 14 }}>
                {t("operational")}
              </Text>
            </div>
          </Space>
        </div>
      </Col>

      <Col
        xs={24}
        md={12}
        style={{
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 32,
            }}
          >
            <LanguageSwitcher />
          </div>

          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {t("welcome_back")}
            </Title>
            <Text type="secondary">{t("sign_in_message")}</Text>
          </div>

          {children}

          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <a href="/privacy" style={{ color: "#8c8c8c", fontSize: 14 }}>
              {t("privacy_policy")}
            </a>
            <a href="/terms" style={{ color: "#8c8c8c", fontSize: 14 }}>
              {t("terms")}
            </a>
            <a href="/security" style={{ color: "#8c8c8c", fontSize: 14 }}>
              {t("security")}
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default LoginLayout;
