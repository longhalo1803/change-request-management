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
import { useState, useMemo } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslation } from "react-i18next";
import {
  useCreateChangeRequest,
  useChangeRequestLookups,
  useUploadAttachments,
  useProjects,
  useSpaces,
} from "@/hooks";
import type { CreateChangeRequestInput } from "@/services";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type ActorType = "customer" | "pm" | "admin";

interface CreateCrModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  actorType?: ActorType;
}

const { Dragger } = Upload;

/**
 * Shared Create CR Modal Component
 * Note: PM actors cannot create CRs, so this will return null for PM actorType
 */
export const CreateCrModal: React.FC<CreateCrModalProps> = ({
  open,
  onCancel,
  onSuccess,
  actorType = "customer",
}) => {
  const { t } = useTranslation("cr-list");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [summaryLength, setSummaryLength] = useState(0);
  const [description, setDescription] = useState("");

  const { mutateAsync: createCr, isPending: isCreating } = useCreateChangeRequest();
  const { mutateAsync: uploadAttachments, isPending: isUploading } = useUploadAttachments();
  
  const { data: lookups, isLoading: isLoadingLookups } = useChangeRequestLookups();
  
  // We need to fetch projects to select a project, then spaces for that project
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const selectedProjectId = Form.useWatch("projectId", form);
  const { data: spaces, isLoading: isLoadingSpaces } = useSpaces(selectedProjectId || "");

  const isLoading = isCreating || isUploading;

  // Configure ReactQuill modules with toolbar options
  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"], // Bold, Italic, Underline
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        ["link", "image"], // Link and Image
        ["code-block"], // Code block
        ["clean"], // Remove formatting
      ],
    }),
    []
  );

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
  ];

  // PM actors cannot create CRs
  if (actorType === "pm") {
    return null;
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const jsonPayload: CreateChangeRequestInput = {
        spaceId: values.spaceId,
        worktypeId: values.issueType,
        title: values.summary,
      };

      if (description) {
        jsonPayload.description = description;
      }
      if (values.priority) {
        jsonPayload.priorityId = values.priority;
      }
      if (values.startDate) {
        jsonPayload.startDate = values.startDate.format("YYYY-MM-DD");
      }
      if (values.dueDate) {
        jsonPayload.dueDate = values.dueDate.format("YYYY-MM-DD");
      }

      // Step 1: Create CR
      const cr = await createCr(jsonPayload);

      // Step 2: Upload Attachments if any
      if (fileList.length > 0) {
        const formData = new FormData();
        fileList.forEach((f) =>
          formData.append("attachments", f.originFileObj as File)
        );
        await uploadAttachments({ crId: cr.id, formData });
      }

      message.success(t("create_modal.success_message"));
      form.resetFields();
      setFileList([]);
      setSummaryLength(0);
      setDescription("");
      onSuccess?.();
      onCancel();
    } catch (error: any) {
      if (error.errorFields) {
        // Validation failed naturally
        return;
      }
      console.error("Submission failed:", error);
      message.error(error?.response?.data?.message || error.message || "Failed to create Change Request");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setSummaryLength(0);
    setDescription("");
    onCancel();
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
      const uploadFile: UploadFile = {
        uid: `${Date.now()}-${file.name}`,
        name: file.name,
        status: "done",
        originFileObj: file as any,
      };
      setFileList([...fileList, uploadFile]);
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
        </div>
      }
      open={open}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      width={800}
      footer={[
        <div key="footer" className="flex items-center justify-between">
          <div className="text-sm text-gray-500"> </div>
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
      >
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Form.Item
            label="Project"
            name="projectId"
            rules={[
              { required: true, message: "Please select project" },
            ]}
          >
            <Select
              placeholder="Select project"
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={projects?.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              loading={isLoadingProjects}
              onChange={() => form.setFieldValue("spaceId", undefined)}
            />
          </Form.Item>

          <Form.Item
            label={t("create_modal.project_label")}
            name="spaceId"
            rules={[
              { required: true, message: t("create_modal.project_error") },
            ]}
          >
            <Select
              placeholder="Select space"
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={spaces?.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
              loading={isLoadingSpaces}
              disabled={!selectedProjectId}
            />
          </Form.Item>

const ISSUE_TYPE_LABELS: Record<string, string> = {
  BUG: "Bug",
  CHANGE_REQUEST: "Change Request",
  DOCUMENTATION: "Documentation",
  FEATURE: "Feature",
  IMPROVEMENT: "Improvement",
  TESTING: "Testing",
};

          <Form.Item
            label={t("create_modal.issue_type_label")}
            name="issueType"
            rules={[
              { required: true, message: t("create_modal.issue_type_error") },
            ]}
          >
            <Select
              placeholder="Select issue type"
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={lookups?.worktypes?.map((w) => ({
                label: ISSUE_TYPE_LABELS[w.name] || w.name,
                value: w.id,
              }))}
              loading={isLoadingLookups}
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

        {/* Description with Rich Text Editor */}
        <Form.Item
          label={t("create_modal.description_label")}
          name="description"
        >
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={quillModules}
            formats={quillFormats}
            placeholder={t("create_modal.description_placeholder")}
            style={{ height: "200px", marginBottom: "50px" }}
          />
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
              placeholder="Select priority"
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={lookups?.priorities?.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              loading={isLoadingLookups}
            />
          </Form.Item>

          <Form.Item
            label={t("create_modal.start_date_label")}
            name="startDate"
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="yyyy-mm-dd"
              suffixIcon={<span className="text-gray-400">📅</span>}
            />
          </Form.Item>

          <Form.Item label={t("create_modal.due_date_label")} name="dueDate">
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="yyyy-mm-dd"
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
