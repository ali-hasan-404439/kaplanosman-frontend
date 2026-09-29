"use client";

import { Card, Form, Input, Button, Typography, Alert } from "antd";
import {
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  useGetUserQuery,
  useUpdatePasswordChangeMutation,
} from "@/redux/features/settings/settingsApi";
import CompanyDetails from "./Company";
import Personal from "./Personal";
import { toast } from "sonner";

const { Title } = Typography;

export default function SettingPageComponent() {
  const [securityForm] = Form.useForm();

  const [updatePasswordChange, { isLoading }] =
    useUpdatePasswordChangeMutation();
  const handleChangePassword = async () => {
    const values = await securityForm.validateFields();
    try {
      const response = await updatePasswordChange(values).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Password updated success.");
        securityForm.resetFields();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Fail to updated password change. Please try again!"
      );
    }
  };

  const { data, isLoading: dataGetLoading } = useGetUserQuery(undefined);
  const company = data?.data?.company_admin?.company;
  const person = data?.data?.company_admin;

  return (
    <div className="p-5 border border-gray-100 rounded-lg space-y-5">
      {company?.companyName ||
      company?.companyEmail ||
      company?.companyPhone ||
      company?.businessAddress ||
      dataGetLoading ? null : (
        <Alert
          message="Important Notice"
          description="Please complete the following steps to ensure your account is set up correctly."
          type="error"
        />
      )}

      <CompanyDetails company={company} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Personal Info */}
        <Personal person={person} />

        {/* Security */}
        <Card className="shadow-sm">
          <div className="flex justify-between mb-4">
            <Title level={4}>🔒 Security</Title>
          </div>

          <Form form={securityForm} layout="vertical">
            <Form.Item name="oldPassword" label="Old Password" required>
              <Input.Password
                className="h-12"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
              required
            >
              <Input.Password
                className="h-12"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Button
              icon={<SaveOutlined />}
              onClick={handleChangePassword}
              className="w-full"
              loading={isLoading}
            >
              Change Password
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
