import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Avatar, message, DatePicker } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/lib/types";
import dayjs from "dayjs";
import { userService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || user.fullName?.split(" ")[0],
        lastName: user.lastName || user.fullName?.split(" ").slice(1).join(" "),
        email: user.email,
        phoneNumber: user.phone || "",
      });
    }
  }, [user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const updatedUser = await userService.updateMyProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
      });
      setUser(updatedUser);
      message.success(t("messages.success") || "Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Validation failed:", error);
      message.error(
        error.response?.data?.message ||
          t("messages.error") ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);
      await userService.changePassword(user!.id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed successfully");
      setIsChangingPassword(false);
      passwordForm.resetFields();
      // Clear auth store and redirect to login
      useAuthStore.getState().logout();
      navigate("/login");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhoto = () => {
    message.info(t("profile_photo.upload_button"));
  };

  const handleDeleteProfile = () => {
    message.warning(t("danger_zone.delete_confirmation"));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("page_title")}
        </h1>
        <p className="text-gray-600">{t("page_subtitle")}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Profile Photo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              {/* Avatar with Camera Icon */}
              <div className="relative mb-4">
                <Avatar
                  size={160}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                  className="border-4 border-blue-100"
                />
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.fullName || "Alex Nguyen"}
              </h2>
              <p className="text-gray-500 mb-6">
                {user?.role === UserRole.CUSTOMER
                  ? "Customer"
                  : "Project Manager"}{" "}
                • Hanoi Project
              </p>

              {/* Action Buttons */}
              <Button
                type="default"
                block
                className="mb-3"
                onClick={handleEditPhoto}
              >
                {t("profile_photo.edit_button")}
              </Button>
              <Button danger block onClick={handleDeleteProfile}>
                {t("danger_zone.delete_profile_button")}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Card - Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserOutlined className="text-blue-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t("personal_info.title")}
              </h3>
            </div>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                firstName:
                  user?.firstName || user?.fullName?.split(" ")[0] || "Alex",
                lastName:
                  user?.lastName ||
                  user?.fullName?.split(" ").slice(1).join(" ") ||
                  "Nguyen",
                email: user?.email || "alex.n@solashi.com",
                gender: "Male",
                dateOfBirth: dayjs("1997-04-01"),
                phoneNumber: user?.phone || "+84 901 234 567",
                officeAddress:
                  "123 Tech Park, Cau Giay District, Hanoi, Vietnam",
              }}
            >
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={t("personal_info.first_name")}
                  name="firstName"
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input
                    placeholder="Enter your first name"
                    disabled={!isEditing}
                  />
                </Form.Item>

                <Form.Item
                  label={t("personal_info.last_name")}
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input
                    placeholder="Enter your last name"
                    disabled={!isEditing}
                  />
                </Form.Item>
              </div>

              {/* Row 2: Email */}
              <Form.Item
                label={t("personal_info.email")}
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  disabled
                  suffix={<LockOutlined className="text-gray-400" />}
                />
              </Form.Item>

              {/* Row 3: Gender & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label={t("personal_info.gender")} name="gender">
                  <Select
                    disabled={!isEditing}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label={t("personal_info.date_of_birth")}
                  name="dateOfBirth"
                >
                  <DatePicker
                    className="w-full"
                    format="DD/MM/YYYY"
                    disabled={!isEditing}
                  />
                </Form.Item>
              </div>

              {/* Row 4: Phone Number */}
              <Form.Item label={t("personal_info.phone")} name="phoneNumber">
                <Input
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                />
              </Form.Item>

              {/* Row 5: Office Address */}
              <Form.Item
                label={t("personal_info.department")}
                name="officeAddress"
              >
                <Input.TextArea
                  placeholder="Enter your office address"
                  rows={3}
                  disabled={!isEditing}
                />
              </Form.Item>

              {/* Footer Note */}
              <div className="text-sm text-gray-500 mb-4">
                Last updated on Oct 24, 2026.
                <br />
                Changes to your primary email address require administrator
                approval.
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleCancel} disabled={loading}>
                      {t("buttons.cancel") || "Cancel"}
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      loading={loading}
                    >
                      {t("buttons.save") || "Save"}
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={() => setIsEditing(true)}>
                    {t("personal_info.edit_button") || "Edit Profile"}
                  </Button>
                )}
              </div>
            </Form>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center gap-2 mb-6">
                <LockOutlined className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h3>
              </div>

              {isChangingPassword ? (
                <Form form={passwordForm} layout="vertical">
                  <Form.Item
                    label="Current Password"
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input current password",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      { required: true, message: "Please input new password" },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm new password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm new password" />
                  </Form.Item>
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => {
                        setIsChangingPassword(false);
                        passwordForm.resetFields();
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleChangePassword}
                      loading={loading}
                    >
                      Update Password
                    </Button>
                  </div>
                </Form>
              ) : (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
