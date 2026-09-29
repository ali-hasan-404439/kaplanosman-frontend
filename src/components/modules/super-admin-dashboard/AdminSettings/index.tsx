"use client";
import { useState, useRef, useEffect } from "react";
import { Form, Input, Button, Modal, Avatar, Upload, message } from "antd";
import { Camera, Eye, EyeOff, Lock, Mail, Pencil, Shield } from "lucide-react";
import { toast } from "sonner";
import { RcFile } from "antd/es/upload";
import Loading from "@/components/shared/Loading/Loading";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { beforeUpload, getBase64 } from "@/utils/fileUtils";

type UserWithSuperAdmin = {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "USER" | "ADMIN";
  provider: "EMAIL" | "GOOGLE" | "FACEBOOK";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  isVerified: boolean;
  isOldCompany: boolean;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
  super_admin: {
    id: string;
    name: string;
    profilePhoto: string | null;
    phone: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  profilePhoto?: string;
};

type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

const SuperAdminSettings = () => {
  const [form] = Form.useForm<FormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: response, isLoading } = useGetMeQuery(undefined);
  const profileData: UserWithSuperAdmin = response?.data || {};
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  // Initialize form with profile data
  useEffect(() => {
    if (profileData?.super_admin) {
      form.setFieldsValue({
        name: profileData.super_admin.name,
        email: profileData.email,
        phone: profileData.super_admin.phone || "",
        profilePhoto: profileData.super_admin.profilePhoto || "",
      });
    }
  }, [profileData, form]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setIsEditing(false);
    setFileList([]);
  };

  const handleProfileUpdate = async (values: FormValues) => {
    const formData = new FormData();
    const { profilePhoto, ...rest } = values;

    if (fileList.length > 0) {
      formData.append("profilePhoto", fileList[0].originFileObj as RcFile);
    }

    formData.append(
      "data",
      JSON.stringify({
        ...rest,
        ...(fileList.length === 1
          ? {}
          : { profilePhoto: profileData.super_admin.profilePhoto ?? "" }),
      })
    );

    const res = await handleAsyncWithToast(
      () => updateProfile(formData),
      "Updating profile"
    );

    if (res?.data?.success) {
      setIsEditing(false);
      setFileList([]);
    }
  };

  const handlePasswordChange = async (values: PasswordFormValues) => {
    if (values.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    const res = await handleAsyncWithToast(
      () => changePassword(values),
      "Changing password"
    );

    if (res?.data?.success) {
      passwordForm.resetFields();
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      setPreviewImage(file.url || file.preview);
      form.setFieldValue("profilePhoto", file.url || file.preview);
    } else {
      setPreviewImage(profileData?.super_admin?.profilePhoto || "");
      form.setFieldValue(
        "profilePhoto",
        profileData?.super_admin?.profilePhoto || ""
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-fit flex flex-col gap-6">
      {/* Personal Information Section */}
      <div className="w-full border border-gray-200 rounded-lg">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Personal Information
              </h1>
              <p className="text-gray-600">Update your Personal Information</p>
            </div>

            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                icon={<Pencil size={16} />}
                className="flex items-center gap-2"
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleCancelEdit}>Cancel</Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Update
                </Button>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <Form<FormValues>
            form={form}
            layout="vertical"
            onFinish={handleProfileUpdate}
            disabled={!isEditing}
          >
            {/* Profile Image Section */}
            <div className="mb-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Upload
                    listType="picture-circle"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    onPreview={handlePreview}
                    fileList={fileList}
                    maxCount={1}
                    accept="image/*"
                    disabled={!isEditing}
                  >
                    {profileData?.super_admin?.profilePhoto &&
                    fileList.length <= 0 ? (
                      <Avatar
                        src={profileData?.super_admin?.profilePhoto}
                        alt="Profile"
                        size={80}
                        className="cursor-pointer"
                      />
                    ) : previewImage ? (
                      <Avatar
                        src={previewImage}
                        alt="Profile"
                        size={80}
                        className="cursor-pointer"
                      />
                    ) : (
                      <div className="ant-upload-text">
                        <Camera size={24} />
                      </div>
                    )}
                  </Upload>
                </div>

                <div>
                  <h3 className="font-medium text-primary mb-1">
                    Profile Photo
                  </h3>
                  <p className="text-sm text-gray-600">
                    JPG, PNG, 2MB max. Recommended: 200×200px
                  </p>
                  {isEditing && (
                    <Upload
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      fileList={fileList}
                      maxCount={1}
                      accept="image/*"
                    >
                      <Button type="link" className="p-0">
                        Choose new image
                      </Button>
                    </Upload>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="Enter your Phone Number" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input readOnly disabled prefix={<Mail size={16} />} placeholder="Your Email" />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="w-full md:w-1/2 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-primary">Security</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Manage your account security settings
        </p>

        <Form<PasswordFormValues>
          form={passwordForm}
          onFinish={handlePasswordChange}
          layout="vertical"
        >
          <div className="space-y-4">
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your current password"
                iconRender={(visible) =>
                  visible ? <Eye size={16} /> : <EyeOff size={16} />
                }
                visibilityToggle={{
                  onVisibleChange: setShowOldPassword,
                }}
                prefix={<Lock size={16} />}
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter your new password"
                iconRender={(visible) =>
                  visible ? <Eye size={16} /> : <EyeOff size={16} />
                }
                visibilityToggle={{
                  onVisibleChange: setShowNewPassword,
                }}
                prefix={<Lock size={16} />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Lock size={16} />}
                className="w-full"
                disabled={
                  !passwordForm.isFieldsTouched(true) ||
                  !!passwordForm
                    .getFieldsError()
                    .filter(({ errors }) => errors.length).length
                }
              >
                Change Password
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Profile Image Preview Modal */}
      <Modal
        open={previewOpen}
        title="Profile Photo Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={600}
      >
        <div className="flex justify-center mt-4">
          <img
            alt="Profile Preview"
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            src={previewImage}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminSettings;
