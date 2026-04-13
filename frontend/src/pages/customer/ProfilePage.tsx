import { useState } from "react";
import { Form, Input, Select, Button, Avatar, message, DatePicker } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/lib/types";
import dayjs from "dayjs";

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const [form] = Form.useForm();
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Combine firstName and lastName
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      console.log("Profile updated:", { ...values, fullName });
      message.success(t("messages.success"));
      setIsEditing(false);
    } catch (error) {
      console.error("Validation failed:", error);
      message.error(t("messages.error"));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
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
                firstName: user?.fullName?.split(" ")[0] || "Alex",
                lastName:
                  user?.fullName?.split(" ").slice(1).join(" ") || "Nguyen",
                email: user?.email || "alex.n@solashi.com",
                gender: "Male",
                dateOfBirth: dayjs("1997-04-01"),
                phoneNumber: "+84 901 234 567",
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
                    <Button onClick={handleCancel}>
                      {t("buttons.cancel")}
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                      {t("buttons.save")}
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={() => setIsEditing(true)}>
                    {t("personal_info.edit_button")}
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
