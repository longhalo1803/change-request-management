import { Modal, Button, Tag, Avatar, Input, Tabs } from "antd";
import {
  ShareAltOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import { getCrStatus, getCrPriority } from "@/lib/helpers/cr.helpers";
import { getStatusConfig, getPriorityConfig } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";

type ActorType = "customer" | "pm" | "admin";

interface CrDetailModalProps {
  open: boolean;
  cr: ChangeRequest | null;
  onCancel: () => void;
  onReject?: () => void;
  onApprove?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  actorType?: ActorType;
}

const { TextArea } = Input;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const CrDetailModal: React.FC<CrDetailModalProps> = ({
  open,
  cr,
  onCancel,
  onReject,
  onApprove,
  onDelete,
  onSubmit,
  actorType = "customer",
}) => {
  const { t } = useTranslation("cr-list");
  if (!cr) return null;

  const status = getCrStatus(cr);
  const priority = getCrPriority(cr);
  const statusConfig = getStatusConfig(status);
  const priorityConfig = getPriorityConfig(priority);

  // Mock activity log data
  const activityLog = [
    {
      id: 1,
      user: "Dashboard",
      role: "Dashboard",
      avatar: "MC",
      comment:
        "I've reviewed the API documentation for Stripe. We need to confirm if the customer wants to support local payment methods in Japan like Konbini.",
      timestamp: "Aug 24, 2024 • Updated 2 hours ago",
    },
    {
      id: 2,
      user: "Dashboard",
      role: "Dashboard",
      avatar: "MC",
      comment:
        "Yes, Konbini is a requirement for the first phase. Please include it in the estimation.",
      timestamp: "",
    },
  ];

  const tabItems = [
    {
      key: "all",
      label: "All",
      children: (
        <div className="space-y-4">
          {activityLog.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar size={32} style={{ backgroundColor: "#1890ff" }}>
                {activity.avatar}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{activity.user}</span>
                  <span className="text-gray-500 text-sm">{activity.role}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                  {activity.comment}
                </div>
                {activity.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {activity.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Comment Input */}
          <div className="flex gap-3 mt-4">
            <Avatar size={32} icon={<UserOutlined />} />
            <div className="flex-1">
              <TextArea
                placeholder="Add a comment..."
                rows={3}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button type="primary">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "history",
      label: "History",
      children: <div>History content</div>,
    },
    {
      key: "comments",
      label: "Comments",
      children: <div>Comments content</div>,
    },
    {
      key: "attachments",
      label: "Attachments",
      children: <div>Attachments content</div>,
    },
  ];

  return (
    <Modal
      title={
        <div>
          <div className="text-sm text-gray-500">Project Alpha • {cr.id}</div>
          <div className="text-lg font-semibold">
            {t("modal.details_title")}
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      closeIcon={
        <div className="flex items-center gap-3 pr-2">
          <Button
            type="text"
            icon={<ShareAltOutlined />}
            className="text-gray-500 hover:text-gray-700"
            size="middle"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Share clicked");
            }}
          />
          <CloseOutlined className="text-gray-500 hover:text-gray-700" />
        </div>
      }
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-6">
          {/* Status Badge */}
          <Tag color={statusConfig.color} className="mb-4 px-3 py-1">
            {statusConfig.label}
          </Tag>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">{cr.title}</h2>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              DESCRIPTION
            </h3>
            <div className="text-gray-700 space-y-2">
              <p>
                To enhance the mobile shopping experience, we need to integrate
                a unified payment gateway that supports multiple providers
                including <strong>Stripe</strong>, <strong>PayPal</strong>, and{" "}
                <strong>Apple Pay</strong> directly within the checkout flow.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Universal UI:</strong> A cohesive payment selector
                  matching the SOLASHI brand.
                </li>
                <li>
                  <strong>Security:</strong> Full PCI-DSS compliance and 3D
                  Secure 2.0 implementation.
                </li>
                <li>
                  <strong>Callbacks:</strong> Real-time webhook processing for
                  immediate order confirmation.
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                This CR replaces the previous manual bank transfer method which
                had a high bounce rate during Q3.
              </p>
            </div>
          </div>

          {/* Activity Log Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              ACTIVITY LOG
            </h3>
            <Tabs items={tabItems} />
          </div>
        </div>

        {/* Right Sidebar - Attributes */}
        <div className="w-64 bg-gray-50 p-6 border-l">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            ATTRIBUTES
          </h3>

          <div className="space-y-4">
            {/* Priority */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Priority</div>
              <Tag color={priorityConfig.color} className="px-2 py-1">
                🔴 {priorityConfig.label}
              </Tag>
            </div>

            {/* Sprint */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Sprint</div>
              <div className="text-sm font-medium">Q4_SPRINT_02</div>
            </div>

            {/* Start Date */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Start Date</div>
              <div className="text-sm">{formatDate(cr.createdAt)}</div>
            </div>

            {/* Due Date */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Due Date</div>
              <div className="text-sm">{formatDate(cr.updatedAt)}</div>
            </div>

            {/* Parent Task */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Parent Task</div>
              <div className="text-sm">None</div>
            </div>

            {/* Reporter */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Reporter</div>
              <div className="flex items-center gap-2">
                <Avatar size={24} style={{ backgroundColor: "#87d068" }}>
                  SG
                </Avatar>
                <span className="text-sm font-medium">Sarah Connor</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {actorType !== "admin" && (
            <div className="mt-6 space-y-2">
              {cr.statusId === ChangeRequestStatus.DRAFT &&
                actorType === "customer" && (
                  <>
                    <Button danger block onClick={onDelete}>
                      Delete
                    </Button>
                    <Button type="primary" block onClick={onSubmit}>
                      Submit
                    </Button>
                  </>
                )}
              {cr.statusId === ChangeRequestStatus.IN_DISCUSSION &&
                (actorType === "pm" || actorType === "customer") && (
                  <>
                    <Button danger block onClick={onReject}>
                      {t("buttons.reject")}
                    </Button>
                    <Button type="primary" block onClick={onApprove}>
                      {t("buttons.approve")}
                    </Button>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
