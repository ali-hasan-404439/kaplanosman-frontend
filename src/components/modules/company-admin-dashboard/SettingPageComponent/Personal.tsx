import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useUpdateSettingsProfileMutation } from "@/redux/features/settings/settingsApi";
import { toast } from "sonner";

const { Title, Text } = Typography;

interface PersonProps {
  name: string;
  profilePhoto: string; // old profile photo url
  phone: string;
}

interface PersonalProps {
  person: PersonProps;
}

const Personal: React.FC<PersonalProps> = ({ person }) => {
  const [isPersonalEditing, setIsPersonalEditing] = useState(false);
  const [personalForm] = Form.useForm();

  const [photoFile, setPhotoFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (person) {
      personalForm.setFieldsValue({
        name: person?.name,
        phone: person?.phone,
      });

      if (person?.profilePhoto) {
        setPhotoFile({
          uid: "-1",
          name: person?.profilePhoto.split("/").pop() || "profile.png",
          status: "done",
          url: person?.profilePhoto,
        });
      } else {
        setPhotoFile(null);
      }
    }
  }, [person, personalForm]);

  // console.log(person);
  // Upload config
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files (JPG/PNG)");
        return Upload.LIST_IGNORE;
      }
      // preview url
      const previewUrl = URL.createObjectURL(file);

      setPhotoFile({
        uid: String(Date.now()),
        name: file.name,
        status: "done",
        url: previewUrl,
        originFileObj: file as import("antd/es/upload/interface").RcFile, // keep actual file for upload
      });

      return false; // prevent auto upload
    },
    onRemove: () => {
      setPhotoFile(null);
    },
    fileList: photoFile ? [photoFile] : [],
    listType: "picture-card" as const,
    disabled: !isPersonalEditing,
  };

  const handleCancelEdit = () => {
    setIsPersonalEditing(false);
    personalForm.setFieldsValue({
      name: person.name,
      phone: person.phone,
    });
    if (person.profilePhoto) {
      setPhotoFile({
        uid: "-1",
        name: person.profilePhoto.split("/").pop() || "profile.png",
        status: "done",
        url: person.profilePhoto,
      });
    } else {
      setPhotoFile(null);
    }
  };
  const [updateSettingsProfile, { isLoading }] =
    useUpdateSettingsProfileMutation();

  const handlePersonalEdit = async () => {
    const formData = new FormData();
    try {
      const { name, phone } = await personalForm.validateFields();

      if (photoFile?.originFileObj) {
        formData.append("data", JSON.stringify({ name, phone }));
        formData.append("profilePhoto", photoFile.originFileObj);
      } else {
        formData.append(
          "data",
          JSON.stringify({ name, phone, profilePhoto: person?.profilePhoto })
        );
      }

      const response = await updateSettingsProfile(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message || "User updated successful!");
        setIsPersonalEditing(false);
        personalForm.resetFields();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Fail to user updated. Please try again."
      );
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between mb-4">
        <Title level={4}>Personal Information</Title>
        <Space>
          {isPersonalEditing && (
            <Button onClick={handleCancelEdit}>Cancel</Button>
          )}
          <Button
            type={isPersonalEditing ? "primary" : "default"}
            icon={isPersonalEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => {
              if (isPersonalEditing) {
                handlePersonalEdit();
              } else {
                setIsPersonalEditing(true);
              }
            }}
            loading={isLoading}
          >
            {isPersonalEditing ? "Save" : "Edit"}
          </Button>
        </Space>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={photoFile?.url || undefined}
        />
        <Text type="secondary" className="text-sm">
          PNG, JPG max 2MB. Recommended 200x200px.
        </Text>
      </div>

      {isPersonalEditing && (
        <Upload {...uploadProps}>
          {!photoFile && (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      )}

      <Form form={personalForm} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input readOnly={!isPersonalEditing} className="h-12" 
                disabled={!isPersonalEditing}/>
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter your phone" }]}
        >
          <Input readOnly={!isPersonalEditing} className="h-12" 
                disabled={!isPersonalEditing}/>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Personal;
