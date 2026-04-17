import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  message,
} from "antd";
import { CloudUploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslation } from "react-i18next";
import { useCreateChangeRequest } from "@/hooks/changeRequest/useChangeRequest";

interface CreateCrModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const { TextArea } = Input;
const { Dragger } = Upload;

export const CreateCrModal: React.FC<CreateCrModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const { t } = useTranslation("cr-list");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [summaryLength, setSummaryLength] = useState(0);
  const { mutateAsync: createCr, isPending: isLoading } =
    useCreateChangeRequest();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("spaceId", values.project);
      formData.append("worktypeId", values.issueType);
      formData.append("title", values.summary);
      if (values.description)
        formData.append("description", values.description);
      if (values.priority) formData.append("priorityId", values.priority);
      if (values.startDate)
        formData.append("startDate", values.startDate.format("YYYY-MM-DD"));
      if (values.dueDate)
        formData.append("dueDate", values.dueDate.format("YYYY-MM-DD"));
      fileList.forEach((f) =>
        formData.append("attachments", f.originFileObj as File)
      );

      await createCr(formData);
      message.success(t("create_modal.success_message"));
      form.resetFields();
      setFileList([]);
      setSummaryLength(0);
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setSummaryLength(0);
    onCancel();
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
      setFileList([...fileList, file as any]);
      return false; // Prevent auto upload
    },
    onRemove: (file: UploadFile) => {
      setFileList(fileList.filter((f) => f.uid !== file.uid));
    },
    multiple: true,
  };

  return (
    <Modal
      title={
        <div>
          <div className="text-lg font-semibold">{t("create_modal.title")}</div>
          <div className="text-sm text-gray-500 font-normal">
            {t("create_modal.subtitle")}
          </div>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      width={800}
      footer={[
        <div key="footer" className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="text-orange-500">●</span>{" "}
            {t("create_modal.draft_info")}
          </div>
          <div className="flex gap-2">
            <Button key="cancel" onClick={handleCancel}>
              {t("buttons.cancel")}
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
            >
              {t("create_modal.title")} →
            </Button>
          </div>
        </div>,
      ]}
      closeIcon={<CloseOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          project: "Project Alpha - CMS",
          issueType: "Change Request",
          status: "Draft",
          priority: "Medium",
        }}
      >
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Form.Item
            label={t("create_modal.project_label")}
            name="project"
            rules={[
              { required: true, message: t("create_modal.project_error") },
            ]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: "Project Alpha - CMS", value: "Project Alpha - CMS" },
                {
                  label: "Project Beta - Mobile",
                  value: "Project Beta - Mobile",
                },
                { label: "Project Gamma - Web", value: "Project Gamma - Web" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("create_modal.issue_type_label")}
            name="issueType"
            rules={[
              { required: true, message: t("create_modal.issue_type_error") },
            ]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: "📋 Change Request", value: "Change Request" },
                { label: "🐛 Bug", value: "Bug" },
                { label: "✨ Feature", value: "Feature" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("create_modal.parent_task_label")}
            name="parentTask"
          >
            <Input
              placeholder={t("create_modal.parent_task_placeholder")}
              suffix={<span className="text-gray-400 cursor-pointer">🔍</span>}
            />
          </Form.Item>

          <Form.Item label={t("create_modal.status_label")} name="status">
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: "📄 Draft", value: "Draft" },
                { label: "📤 Submitted", value: "Submitted" },
                { label: "💬 In Discussion", value: "In Discussion" },
                { label: "✅ Approved", value: "Approved" },
              ]}
            />
          </Form.Item>
        </div>

        {/* Summary */}
        <Form.Item
          label={t("create_modal.summary_label")}
          name="summary"
          rules={[
            { required: true, message: t("create_modal.summary_error") },
            { max: 255, message: t("create_modal.summary_max_error") },
          ]}
        >
          <Input
            placeholder={t("create_modal.summary_placeholder")}
            maxLength={255}
            onChange={(e) => setSummaryLength(e.target.value.length)}
            suffix={
              <span className="text-gray-400 text-xs">{summaryLength}/255</span>
            }
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label={t("create_modal.description_label")}
          name="description"
        >
          <div className="border border-gray-300 rounded">
            {/* Toolbar */}
            <div className="flex gap-2 p-2 border-b border-gray-300 bg-gray-50">
              <Button size="small" type="text" className="font-bold">
                B
              </Button>
              <Button size="small" type="text" className="italic">
                I
              </Button>
              <Button size="small" type="text">
                ≡
              </Button>
              <Button size="small" type="text">
                ⊙
              </Button>
              <Button size="small" type="text">
                🔗
              </Button>
              <Button size="small" type="text">
                📷
              </Button>
              <Button size="small" type="text">
                &lt;/&gt;
              </Button>
            </div>
            {/* Text Area */}
            <TextArea
              placeholder={t("create_modal.description_placeholder")}
              bordered={false}
              rows={6}
              style={{ resize: "none" }}
            />
          </div>
        </Form.Item>

        {/* Priority and Dates */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Form.Item
            label={t("create_modal.priority_label")}
            name="priority"
            rules={[
              { required: true, message: t("create_modal.priority_error") },
            ]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: "🔵 Low", value: "Low" },
                { label: "🟠 Medium", value: "Medium" },
                { label: "🔴 High", value: "High" },
                { label: "🟣 Critical", value: "Critical" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t("create_modal.start_date_label")}
            name="startDate"
          >
            <DatePicker
              className="w-full"
              format="MM/DD/YYYY"
              placeholder="mm/dd/yyyy"
              suffixIcon={<span className="text-gray-400">📅</span>}
            />
          </Form.Item>

          <Form.Item label={t("create_modal.due_date_label")} name="dueDate">
            <DatePicker
              className="w-full"
              format="MM/DD/YYYY"
              placeholder="mm/dd/yyyy"
              suffixIcon={<span className="text-gray-400">📅</span>}
            />
          </Form.Item>
        </div>

        {/* Attachments */}
        <Form.Item
          label={t("create_modal.attachments_label")}
          name="attachments"
        >
          <Dragger {...uploadProps} className="bg-gray-50">
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
            </p>
            <p className="ant-upload-text">
              {t("create_modal.attachments_hint")}
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
