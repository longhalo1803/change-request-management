import { Modal, Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { CloudUploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';

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
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [summaryLength, setSummaryLength] = useState(0);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      message.success('Change Request created successfully!');
      form.resetFields();
      setFileList([]);
      setSummaryLength(0);
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
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
      setFileList(fileList.filter(f => f.uid !== file.uid));
    },
    multiple: true
  };

  return (
    <Modal
      title={
        <div>
          <div className="text-lg font-semibold">Create Requirement</div>
          <div className="text-sm text-gray-500 font-normal">SOLASHI Connect • Project Alpha</div>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <div key="footer" className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="text-orange-500">●</span> Draft will be saved automatically
          </div>
          <div className="flex gap-2">
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleSubmit}>
              Create Requirement →
            </Button>
          </div>
        </div>
      ]}
      closeIcon={<CloseOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          project: 'Project Alpha - CMS',
          issueType: 'Change Request',
          status: 'Draft',
          priority: 'Medium'
        }}
      >
        {/* First Row: Project, Issue Type, Parent Task, Status */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Form.Item
            label="Project / Space"
            name="project"
            rules={[{ required: true, message: 'Please select project' }]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: 'Project Alpha - CMS', value: 'Project Alpha - CMS' },
                { label: 'Project Beta - Mobile', value: 'Project Beta - Mobile' },
                { label: 'Project Gamma - Web', value: 'Project Gamma - Web' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Issue Type"
            name="issueType"
            rules={[{ required: true, message: 'Please select issue type' }]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: '📋 Change Request', value: 'Change Request' },
                { label: '🐛 Bug', value: 'Bug' },
                { label: '✨ Feature', value: 'Feature' }
              ]}
            />
          </Form.Item>

          <Form.Item label="Parent Task" name="parentTask">
            <Input 
              placeholder="None" 
              suffix={<span className="text-gray-400 cursor-pointer">🔍</span>}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: '📄 Draft', value: 'Draft' },
                { label: '📤 Submitted', value: 'Submitted' },
                { label: '💬 In Discussion', value: 'In Discussion' },
                { label: '✅ Approved', value: 'Approved' }
              ]}
            />
          </Form.Item>
        </div>

        {/* Summary */}
        <Form.Item
          label="Summary"
          name="summary"
          rules={[
            { required: true, message: 'Please enter summary' },
            { max: 255, message: 'Summary must be less than 255 characters' }
          ]}
        >
          <Input
            placeholder="e.g., Unified login flow for enterprise users"
            maxLength={255}
            onChange={(e) => setSummaryLength(e.target.value.length)}
            suffix={<span className="text-gray-400 text-xs">{summaryLength}/255</span>}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <div className="border border-gray-300 rounded">
            {/* Toolbar */}
            <div className="flex gap-2 p-2 border-b border-gray-300 bg-gray-50">
              <Button size="small" type="text" className="font-bold">B</Button>
              <Button size="small" type="text" className="italic">I</Button>
              <Button size="small" type="text">≡</Button>
              <Button size="small" type="text">⊙</Button>
              <Button size="small" type="text">🔗</Button>
              <Button size="small" type="text">📷</Button>
              <Button size="small" type="text">&lt;/&gt;</Button>
            </div>
            {/* Text Area */}
            <TextArea
              placeholder="Describe the requirement in detail..."
              bordered={false}
              rows={6}
              style={{ resize: 'none' }}
            />
          </div>
        </Form.Item>

        {/* Priority and Dates */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Select
              suffixIcon={<span className="text-gray-400">▼</span>}
              options={[
                { label: '🔵 Low', value: 'Low' },
                { label: '🟠 Medium', value: 'Medium' },
                { label: '🔴 High', value: 'High' },
                { label: '🟣 Critical', value: 'Critical' }
              ]}
            />
          </Form.Item>

          <Form.Item label="Start Date" name="startDate">
            <DatePicker 
              className="w-full" 
              format="MM/DD/YYYY"
              placeholder="mm/dd/yyyy"
              suffixIcon={<span className="text-gray-400">📅</span>}
            />
          </Form.Item>

          <Form.Item label="Due Date" name="dueDate">
            <DatePicker 
              className="w-full" 
              format="MM/DD/YYYY"
              placeholder="mm/dd/yyyy"
              suffixIcon={<span className="text-gray-400">📅</span>}
            />
          </Form.Item>
        </div>

        {/* Attachments */}
        <Form.Item label="Attachments" name="attachments">
          <Dragger {...uploadProps} className="bg-gray-50">
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
            </p>
            <p className="ant-upload-text">
              Drop files here or <span className="text-blue-600">browse</span>
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
