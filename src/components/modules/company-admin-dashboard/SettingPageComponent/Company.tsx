import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useUpdateSettingsCompanyMutation } from "@/redux/features/settings/settingsApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CompanyProps {
  companyName: string;
  industry: string;
  website: string;
  employeeCount: string;
  description: string;
  businessAddress: string;
  email: string;
  businessPhone: string;
  taxId: string;
  logo: string;
  employeesCount: string;
  companyDescription: string;
  companyEmail: string;
  companyPhone: string;
  taxOrTin: string;
}

const CompanyDetails = ({ company }: { company: CompanyProps }) => {
  const user = useAppSelector(selectCurrentUser);
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [companyForm] = Form.useForm();

  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (company) {
      const companyValues = {
        companyName: company?.companyName || "",
        industry: company?.industry || "",
        website: company?.website || "",
        employeeCount: company?.employeesCount || "",
        description: company?.companyDescription || "",
        businessAddress: company?.businessAddress || "",
        email: company?.companyEmail || "",
        businessPhone: company?.companyPhone || "",
        taxId: company?.taxOrTin || "",
      };
      companyForm.setFieldsValue(companyValues);

      if (company.logo) {
        setLogoFile({
          uid: "-1",
          name: "logo.png",
          status: "done",
          url: company.logo,
        });
      } else {
        setLogoFile(null);
      }
    }
  }, [company, companyForm]);

  const handleCancelEdit = () => {
    setIsCompanyEditing(false);
    const companyValues = {
      companyName: company?.companyName || "",
      industry: company?.industry || "",
      website: company?.website || "",
      employeeCount: company?.employeesCount || "",
      description: company?.companyDescription || "",
      businessAddress: company?.businessAddress || "",
      email: company?.companyEmail || "",
      businessPhone: company?.companyPhone || "",
      taxId: company?.taxOrTin || "",
    };
    companyForm.setFieldsValue(companyValues);

    if (company.logo) {
      setLogoFile({
        uid: "-1",
        name: "logo.png",
        status: "done",
        url: company.logo,
      });
    } else {
      setLogoFile(null);
    }
  };
  const [updateSettingsCompany, { isLoading }] =
    useUpdateSettingsCompanyMutation();
  const handleCompanyEdit = async () => {
    try {
      setIsUpdatingCompany(true);
      const formData = new FormData();
      const {
        companyName,
        industry,
        website,
        employeeCount,
        description,
        businessAddress,
        email,
        businessPhone,
        taxId,
      } = companyForm.getFieldsValue();
      const data = {
        companyId: user?.companyId,
        companyName: companyName,
        companyEmail: email,
        industry: industry,
        website: website,
        employeesCount: employeeCount,
        companyDescription: description,
        businessAddress: businessAddress,
        companyPhone: businessPhone,
        taxOrTin: taxId,
      };
      formData.append("data", JSON.stringify(data));

      if (logoFile?.originFileObj) {
        formData.append("logo", logoFile.originFileObj);
      }
      const response = await updateSettingsCompany(formData).unwrap();

      if (response?.success) {
        toast.success(
          response?.message || "Company information updated successfully!"
        );
        setIsCompanyEditing(false);
      }
      companyForm.resetFields();
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Fail to updated company information"
      );
    } finally {
      setIsUpdatingCompany(false);
    }
  };
  return (
    <Card className="shadow-sm">
      <Form form={companyForm} layout="vertical">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Title level={4}>Company Information</Title>
            <Text type="secondary">
              Update your company details and business information
            </Text>
          </div>
          <Space>
            {isCompanyEditing && (
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button
              type={isCompanyEditing ? "primary" : "default"}
              icon={isCompanyEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (isCompanyEditing) {
                  handleCompanyEdit();
                } else {
                  setIsCompanyEditing(true);
                }
              }}
              loading={isUpdatingCompany || isLoading}
            >
              {isCompanyEditing ? "Save" : "Edit"}
            </Button>
          </Space>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[
                { required: true, message: "Please enter your company name" },
              ]}
            >
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className={cn("h-12")}
                placeholder="Enter Your company name"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="industry" label="Industry">
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter Your industry"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="website"
              label="Website"
              rules={[{ required: true, message: "Please enter your website" }]}
            >
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter Your website"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="employeeCount" label="Employee Count">
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter your employee count"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Company Description">
              <TextArea
                rows={4}
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                style={{ resize: "none" }}
                placeholder="Enter your company description"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="businessAddress" label="Business Address">
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter your business address"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please Enter your Company email" },
              ]}
            >
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter your company email"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="businessPhone" label="Business Phone">
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter your business phone"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="taxId" label="Tax ID">
              <Input
                readOnly={!isCompanyEditing}
                disabled={!isCompanyEditing}
                className="h-12"
                placeholder="Enter your Tax id"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Company Logo">
          <Upload
            listType="picture-card"
            fileList={logoFile ? [logoFile] : []}
            onRemove={() => setLogoFile(null)}
            beforeUpload={(file) => {
              const previewUrl = URL.createObjectURL(file);
              setLogoFile({
                uid: file.uid,
                name: file.name,
                status: "done",
                url: previewUrl,
                originFileObj: file,
              });
              return false;
            }}
            showUploadList={{ showRemoveIcon: isCompanyEditing }}
            disabled={!isCompanyEditing}
          >
            {!logoFile && isCompanyEditing && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CompanyDetails;
