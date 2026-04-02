/**
 * AccountModal Component
 * Form for creating/editing users with validation
 */

import { Modal, Form, Input, Select, Button, Space } from "antd";
import {
  AdminUser,
  UserFormData,
  UserRole,
  PermissionGroup,
} from "@/lib/types";

interface AccountModalProps {
  visible: boolean;
  user?: AdminUser;
  permissionGroups: PermissionGroup[];
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrator";
    case UserRole.PM:
      return "Project Manager";
    case UserRole.CUSTOMER:
      return "Customer";
    default:
      return role;
  }
};

export const AccountModal = ({
  visible,
  user,
  permissionGroups,
  onSubmit,
  onCancel,
  loading,
}: AccountModalProps) => {
  const [form] = Form.useForm();
  const isEditMode = !!user;

  const roleOptions = permissionGroups.map((group) => ({
    label: getRoleLabel(group.roleType),
    value: group.roleType,
  }));

  const handleSubmit = async (values: any) => {
    const formData: UserFormData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      role: values.role,
      password: values.password,
    };

    await onSubmit(formData);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditMode ? "Edit User" : "Create New User"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={
          user
            ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
              }
            : {}
        }
      >
        {/* Last Name */}
        <Form.Item
          name="lastName"
          label="Last Name (Họ)"
          rules={[
            { required: true, message: "Please enter last name" },
            { min: 2, message: "Last name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        {/* First Name */}
        <Form.Item
          name="firstName"
          label="First Name (Tên)"
          rules={[
            { required: true, message: "Please enter first name" },
            { min: 2, message: "First name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter valid email" },
          ]}
        >
          <Input placeholder="Enter email" type="email" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Phone (Số điện thoại)"
          rules={[
            {
              pattern: /^[0-9\s\-+()]*$/,
              message: "Please enter valid phone number",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Role */}
        <Form.Item
          name="role"
          label="Role (Nhóm quyền)"
          rules={[{ required: true, message: "Please select role" }]}
        >
          <Select placeholder="Select role" options={roleOptions} />
        </Form.Item>

        {/* Password - only on create */}
        {!isEditMode && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password (min 8 characters)" />
          </Form.Item>
        )}

        {/* Form Actions */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
