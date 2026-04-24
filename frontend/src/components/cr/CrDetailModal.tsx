import {
  Modal,
  Button,
  Tag,
  Avatar,
  Input,
  Tabs,
  Upload,
  Spin,
  Empty,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import {
  ShareAltOutlined,
  CloseOutlined,
  UserOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileZipOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RocketOutlined,
  MessageOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { ChangeRequest } from "@/lib/types";
import { getCrStatus, getCrPriority } from "@/lib/helpers/cr.helpers";
import { getStatusConfig, getPriorityConfig } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useComments,
  useAddComment,
  useDeleteComment,
  useAttachments,
  useStatusHistory,
  useAuth,
  useSubmitChangeRequest,
  useDeleteChangeRequest,
  useTransitionStatus,
  useChangeRequestLookups,
} from "@/hooks";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CrDetailModal.css";

type ActorType = "customer" | "pm" | "admin";

interface CrDetailModalProps {
  open: boolean;
  cr: ChangeRequest | null;
  onCancel: () => void;
  /** Called after any status change or deletion so parent can refresh */
  onStatusChange?: () => void;
  actorType?: ActorType;
}

const { TextArea } = Input;

// ===== Utility helpers =====

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("pdf"))
    return <FilePdfOutlined style={{ color: "#e74c3c" }} />;
  if (mimeType.includes("image"))
    return <FileImageOutlined style={{ color: "#3498db" }} />;
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return <FileExcelOutlined style={{ color: "#27ae60" }} />;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return <FileWordOutlined style={{ color: "#2980b9" }} />;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  )
    return <FileZipOutlined style={{ color: "#f39c12" }} />;
  return <FileOutlined style={{ color: "#95a5a6" }} />;
};

const getAvatarColor = (name?: string) => {
  const colors = [
    "#1890ff",
    "#52c41a",
    "#fa8c16",
    "#722ed1",
    "#eb2f96",
    "#13c2c2",
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

// ===== Main Component =====

export const CrDetailModal: React.FC<CrDetailModalProps> = ({
  open,
  cr,
  onCancel,
  onStatusChange,
  actorType = "customer",
}) => {
  const { t } = useTranslation("cr-list");
  const { user } = useAuth();

  // Comment state
  const [commentText, setCommentText] = useState("");
  const [commentFiles, setCommentFiles] = useState<UploadFile[]>([]);

  // Hooks — always called regardless of `cr` (Rules of Hooks)
  const crId = cr?.id || "";
  const { data: comments, isLoading: isLoadingComments } = useComments(crId);
  const { mutateAsync: addComment, isPending: isAddingComment } =
    useAddComment(crId);
  const { mutateAsync: deleteComment } = useDeleteComment(crId);
  const { data: attachments, isLoading: isLoadingAttachments } =
    useAttachments(crId);
  const { data: statusHistory, isLoading: isLoadingHistory } =
    useStatusHistory(crId);

  // Action hooks
  const { mutateAsync: submitCr, isPending: isSubmitting } =
    useSubmitChangeRequest(crId);
  const { mutateAsync: deleteCr, isPending: isDeleting } =
    useDeleteChangeRequest();
  const { mutateAsync: transitionStatus, isPending: isTransitioning } =
    useTransitionStatus(crId);
  const { data: lookups } = useChangeRequestLookups();

  // Early return AFTER hooks
  if (!cr) return null;

  const status = getCrStatus(cr);
  const priority = getCrPriority(cr);
  const statusConfig = getStatusConfig(status);
  const priorityConfig = getPriorityConfig(priority);

  // Use status NAME for comparison, not UUID
  const currentStatus = cr.status?.name || status;

  // Helper: find status UUID by name from lookups
  const getStatusId = (statusName: string): string | undefined => {
    return lookups?.statuses?.find((s) => s.name === statusName)?.id;
  };

  const isActionLoading = isSubmitting || isDeleting || isTransitioning;

  // ===== Action Handlers =====

  const handleSubmit = async () => {
    try {
      await submitCr();
      message.success("CR submitted successfully");
      onStatusChange?.();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to submit CR"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCr(crId);
      message.success("CR deleted successfully");
      onCancel();
      onStatusChange?.();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to delete CR"
      );
    }
  };

  const handleTransition = async (
    toStatusName: string,
    successMsg: string
  ) => {
    const toStatusId = getStatusId(toStatusName);
    if (!toStatusId) {
      message.error(`Status "${toStatusName}" not found`);
      return;
    }
    try {
      await transitionStatus({ toStatusId });
      message.success(successMsg);
      onStatusChange?.();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to update status"
      );
    }
  };

  // ===== Comment Handlers =====

  const handleSendComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      const files = commentFiles
        .map((f) => f.originFileObj as File)
        .filter(Boolean);
      await addComment({
        input: { content: trimmed },
        files: files.length > 0 ? files : undefined,
      });
      setCommentText("");
      setCommentFiles([]);
      message.success("Comment added");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to add comment"
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      message.success("Comment deleted");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to delete comment"
      );
    }
  };

  const commentUploadProps = {
    fileList: commentFiles,
    beforeUpload: (file: File) => {
      const uploadFile: UploadFile = {
        uid: `${Date.now()}-${file.name}`,
        name: file.name,
        status: "done" as const,
        originFileObj: file as any,
      };
      setCommentFiles((prev) => [...prev, uploadFile]);
      return false;
    },
    onRemove: (file: UploadFile) => {
      setCommentFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    multiple: true,
  };

  // ===== Action Buttons (rendered in header) =====

  const renderActionButtons = () => {
    const buttons: React.ReactNode[] = [];

    // DRAFT → Customer: Delete + Submit
    if (currentStatus === "DRAFT" && actorType === "customer") {
      buttons.push(
        <Popconfirm
          key="delete"
          title="Delete this CR?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={isDeleting}
            disabled={isActionLoading}
          >
            Delete
          </Button>
        </Popconfirm>,
        <Button
          key="submit"
          type="primary"
          size="small"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isActionLoading}
        >
          Submit
        </Button>
      );
    }

    // SUBMITTED → PM: Go to Discussion
    if (currentStatus === "SUBMITTED" && actorType === "pm") {
      buttons.push(
        <Button
          key="discuss"
          type="primary"
          size="small"
          icon={<MessageOutlined />}
          onClick={() =>
            handleTransition("IN_DISCUSSION", "Moved to Discussion")
          }
          loading={isTransitioning}
          disabled={isActionLoading}
        >
          Go to Discussion
        </Button>
      );
    }

    // IN_DISCUSSION → Customer: Reject + Approve
    if (currentStatus === "IN_DISCUSSION" && actorType === "customer") {
      buttons.push(
        <Button
          key="reject"
          danger
          size="small"
          icon={<CloseCircleOutlined />}
          onClick={() => handleTransition("REJECTED", "CR rejected")}
          loading={isTransitioning}
          disabled={isActionLoading}
        >
          Reject
        </Button>,
        <Button
          key="approve"
          type="primary"
          size="small"
          icon={<CheckCircleOutlined />}
          onClick={() => handleTransition("APPROVED", "CR approved")}
          loading={isTransitioning}
          disabled={isActionLoading}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Approve
        </Button>
      );
    }

    // IN_DISCUSSION → PM: Reject
    if (currentStatus === "IN_DISCUSSION" && actorType === "pm") {
      buttons.push(
        <Button
          key="reject"
          danger
          size="small"
          icon={<CloseCircleOutlined />}
          onClick={() => handleTransition("REJECTED", "CR rejected")}
          loading={isTransitioning}
          disabled={isActionLoading}
        >
          Reject
        </Button>
      );
    }

    // APPROVED → PM: Deployment
    if (currentStatus === "APPROVED" && actorType === "pm") {
      buttons.push(
        <Button
          key="deploy"
          type="primary"
          size="small"
          icon={<RocketOutlined />}
          onClick={() =>
            handleTransition("ON_GOING", "Deployment started")
          }
          loading={isTransitioning}
          disabled={isActionLoading}
        >
          Deployment
        </Button>
      );
    }

    // ON_GOING → PM: Complete
    if (currentStatus === "ON_GOING" && actorType === "pm") {
      buttons.push(
        <Button
          key="complete"
          type="primary"
          size="small"
          icon={<FlagOutlined />}
          onClick={() => handleTransition("CLOSED", "CR completed")}
          loading={isTransitioning}
          disabled={isActionLoading}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Complete
        </Button>
      );
    }

    if (buttons.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        {buttons}
      </div>
    );
  };

  // ===== Tab Content Builders =====

  const renderCommentsTab = () => (
    <div className="space-y-4" style={{ maxHeight: 400, overflowY: "auto" }}>
      {isLoadingComments ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : !comments || comments.length === 0 ? (
        <Empty
          description="No comments yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        comments.map((c) => {
          const name =
            c.commenter?.fullName || c.commenterName || "Unknown";
          const isOwn = c.commentedBy === user?.id;
          return (
            <div key={c.id} className="flex gap-3 group">
              <Avatar
                size={32}
                style={{
                  backgroundColor: getAvatarColor(name),
                  flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{name}</span>
                  {c.commenter?.role && (
                    <Tag
                      color={
                        c.commenter.role === "pm" ? "blue" : "green"
                      }
                      style={{ fontSize: 10 }}
                    >
                      {c.commenter.role.toUpperCase()}
                    </Tag>
                  )}
                  <span className="text-gray-400 text-xs">
                    {formatDateTime(c.createdAt)}
                  </span>
                  {isOwn && (
                    <Popconfirm
                      title="Delete this comment?"
                      onConfirm={() => handleDeleteComment(c.id)}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Popconfirm>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
                  {c.content}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Comment Input */}
      <div className="flex gap-3 mt-4 pt-4 border-t">
        <Avatar
          size={32}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
        />
        <div className="flex-1">
          <TextArea
            placeholder="Add a comment..."
            rows={3}
            className="mb-2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onPressEnter={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <Upload {...commentUploadProps} showUploadList={true}>
              <Button
                icon={<PaperClipOutlined />}
                size="small"
                type="text"
              >
                Attach file
              </Button>
            </Upload>
            <Tooltip title="Ctrl+Enter to send">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendComment}
                loading={isAddingComment}
                disabled={!commentText.trim()}
              >
                Send
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttachmentsTab = () => (
    <div style={{ maxHeight: 400, overflowY: "auto" }}>
      {isLoadingAttachments ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : !attachments || attachments.length === 0 ? (
        <Empty
          description="No attachments"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="space-y-2">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div className="text-xl">{getFileIcon(a.mimeType)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {a.fileName}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(a.fileSize)} •{" "}
                  {formatDateTime(a.createdAt)}
                </div>
              </div>
              <Tooltip title="Download">
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  href={a.fileUrl}
                  target="_blank"
                />
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div style={{ maxHeight: 400, overflowY: "auto" }}>
      {isLoadingHistory ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : !statusHistory || statusHistory.length === 0 ? (
        <Empty
          description="No history"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="space-y-3">
          {statusHistory.map((h: any, idx: number) => {
            const changerName = h.changedByUser?.fullName || "System";
            const statusName = h.status?.name || "Unknown";
            return (
              <div key={h.id || idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white"
                    style={{ marginTop: 4 }}
                  />
                  {idx < statusHistory.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm">
                    <span className="font-medium">{changerName}</span>
                    {" changed status to "}
                    <Tag color="blue" style={{ fontSize: 11 }}>
                      {statusName}
                    </Tag>
                  </div>
                  {h.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {h.notes}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDateTime(h.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const tabItems = [
    {
      key: "comments",
      label: `Comments${comments?.length ? ` (${comments.length})` : ""}`,
      children: renderCommentsTab(),
    },
    {
      key: "attachments",
      label: `Attachments${attachments?.length ? ` (${attachments.length})` : ""}`,
      children: renderAttachmentsTab(),
    },
    {
      key: "history",
      label: "History",
      children: renderHistoryTab(),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8">
          <div>
            <div className="text-sm text-gray-500">{cr.crKey}</div>
            <div className="text-lg font-semibold">
              {t("modal.details_title")}
            </div>
          </div>
          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2">
            {renderActionButtons()}
            <Tooltip title="Copy CR Key">
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(cr.crKey);
                  message.success("CR key copied!");
                }}
              />
            </Tooltip>
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
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
            {cr.description ? (
              <ReactQuill
                value={cr.description}
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
              />
            ) : (
              <div className="text-gray-500 italic">
                No description provided
              </div>
            )}
          </div>

          {/* Activity / Comments Section */}
          <div>
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
                {priorityConfig.label}
              </Tag>
            </div>

            {/* Worktype */}
            {cr.worktype && (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Issue Type
                </div>
                <div className="text-sm font-medium">
                  {cr.worktype.name}
                </div>
              </div>
            )}

            {/* Start Date */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Start Date</div>
              <div className="text-sm">{formatDate(cr.startDate)}</div>
            </div>

            {/* Due Date */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Due Date</div>
              <div className="text-sm">{formatDate(cr.dueDate)}</div>
            </div>

            {/* Created */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Created</div>
              <div className="text-sm">{formatDate(cr.createdAt)}</div>
            </div>

            {/* Reporter */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Reporter</div>
              <div className="flex items-center gap-2">
                <Avatar
                  size={24}
                  style={{
                    backgroundColor: getAvatarColor(
                      cr.creator?.fullName
                    ),
                  }}
                >
                  {getInitials(cr.creator?.fullName)}
                </Avatar>
                <span className="text-sm font-medium">
                  {cr.creator?.fullName || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
