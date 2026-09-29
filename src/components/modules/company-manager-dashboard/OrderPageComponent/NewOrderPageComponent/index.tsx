"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  TimePicker,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { toast } from "sonner";
import {
  useCreateOrderMutation,
  useGetAllServiceDropdownQuery,
  useGetArticleDropdownQuery,
  useGetCustomerDropdownQuery,
  useGetSingleOrderQuery,
  useGetTechniciansQuery,
  useGetVehicleDropdownQuery,
  useUpdateOrderMutation,
} from "@/redux/features/order/orderApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import moment from "moment";

interface OptionType {
  label: string;
  value: string;
}

interface Customer {
  customerName: string;
  id: string;
}
interface Technician {
  name: string;
  id: string;
}
interface Article {
  articleName: string;
  id: string;
}
interface Vehicle {
  vehiclePlate: string;
  id: string;
}
interface Services {
  serviceName: string;
  id: string;
}
const sourceOptions: OptionType[] = [
  { label: "Garage", value: "GARAGE" },
  { label: "Car rentals", value: "CAR_RENTALS" },
  { label: "Fleets", value: "FLEETS" },
  { label: "Network", value: "NETWORK" },
  { label: "On line", value: "ONLINE" },
  { label: "Broker", value: "BROKER" },
  { label: "Passer by", value: "PASSER_BY" },
  { label: "Whatsapp", value: "WHATSAPP" },
  { label: "Direct", value: "DIRECT" },
];

function NewOrderPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const [customerDropdown, setCustomerDropdown] = useState<Customer[]>([]);
  const [vehicleDropdown, setVehicleDropdown] = useState<Vehicle[]>([]);
  const [articleDropdown, setArticleDropdown] = useState<Article[]>([]);
  const [serviceDropdown, setServiceDropdown] = useState<Services[]>([]);
  const [technicianDropdown, setTechnicianDropdown] = useState<Technician[]>(
    []
  );
  const [form] = Form.useForm();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const router = useRouter();

  const [createOrder, { isLoading: createLoading }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: updateLoading }] = useUpdateOrderMutation();
  const handleCreateSubmit = async (values: any) => {
    const formData = new FormData();
    const {
      article,
      customer,
      service,
      price,
      source,
      start_time,
      technician,
      end_time,
      date,
      vehicle,
      orderStatus,
      damage_images,
    } = values;

    const data: any = {
      isPaid,
      price: Number(price),
      date: moment(date.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      orderStatus,
      source,
      startTime: start_time,
      endTime: end_time,
      articleId: article,
      vehicleId: vehicle,
      technicianId: technician,
      customerId: customer,
      serviceId: service,
    };
    const newData = {
      isPaid,
      price: Number(price),
      date: moment(date.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      orderStatus,
      source,
      startTime: start_time,
      endTime: end_time,
      articleId: article,
      vehicleId: vehicle,
      technicianId: technician,
      customerId: customer,
      serviceId: service,
      damageImages: oldImages,
    };
    formData.append("data", JSON.stringify(orderId ? newData : data));

    const newImageFiles: UploadFile[] = damage_images?.fileList || [];

    if (orderId && newImageFiles?.length > 0) {
      newImageFiles?.forEach((file: any) => {
        if (file.originFileObj) {
          if (file?.size) {
            formData.append("damageImages", file.originFileObj);
          }
        }
      });
    }

    if (!orderId) {
      const invalidFiles = newImageFiles.filter((file) => {
        return !file.type?.startsWith("image/");
      });
      if (invalidFiles.length > 0) {
        message.error("Please upload only image files");
        return;
      }
      newImageFiles?.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append("damageImages", file.originFileObj);
        }
      });
    }

    try {
      const response = orderId
        ? await updateOrder({ id: orderId, formData }).unwrap()
        : await createOrder(formData).unwrap();

      if (response.success) {
        toast.success(
          orderId
            ? "Order updated successfully!"
            : "Order created successfully!"
        );
        form.resetFields();
        setFileList([]);
        const redirectUrl =
          user?.role === "COMPANY_ADMIN"
            ? "/company/orders"
            : "/manager/orders";
        router.push(redirectUrl);
      }
    } catch (error: any) {
      const message = error?.data?.message || "Failed to process the order.";
      toast.error(message);
    }
  };

  const handleImageChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const handleImageRemove = (file: UploadFile) => {
    const updatedList = fileList.filter((item) => item.uid !== file.uid);
    const invalidFiles = updatedList.filter((item) => {
      return !item.type?.startsWith("image/");
    });
    const invalidUrls = invalidFiles.map(
      (file) => file.url || file.thumbUrl || ""
    );
    // এখন state update করবো
    setFileList(updatedList);
    setOldImages(invalidUrls)
  };
  const uploadProps: UploadProps = {
    beforeUpload: () => false,
    multiple: true,
    listType: "picture-card",
    fileList: fileList,
    onChange: handleImageChange,
    onRemove: handleImageRemove,
  };
  const { data: customer, error } = useGetCustomerDropdownQuery({
    page: 1,
    limit: 2000,
  });

  const { data: technician } = useGetTechniciansQuery({
    id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  const { data: article } = useGetArticleDropdownQuery({
    // id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  const { data: vehicle } = useGetVehicleDropdownQuery({
    // id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  const { data: services } = useGetAllServiceDropdownQuery({
    // id: user?.companyId,
    page: 1,
    limit: 2000,
  });
  useEffect(() => {
    if (customer?.success) {
      setCustomerDropdown(customer?.data);
    }
    if (technician?.success) {
      setTechnicianDropdown(technician?.data?.data);
    }
    if (article?.success) {
      setArticleDropdown(article?.data);
    }
    if (vehicle?.success) {
      setVehicleDropdown(vehicle?.data);
      // setArticleDropdown(article?.data);
    }
    if (services?.success) {
      setServiceDropdown(services?.data);
      // setArticleDropdown(article?.data);
    }
  }, [customer, error, technician, article, vehicle, services]);

  const { data } = useGetSingleOrderQuery(
    { id: orderId || "" },
    { skip: !orderId }
  );

  useEffect(() => {
    if (data?.success) {
      const orderData = data?.data;

      const imageFiles =
        orderData?.damageImages?.map((url: string, index: number) => ({
          uid: `existing-${index}`,
          name: url.split("/").pop() || `image-${index}`,
          status: "done",
          url,
        })) || [];
      setOldImages(orderData?.damageImages);
      form.setFieldsValue({
        customer: orderData?.customer?.id,
        vehicle: orderData?.vehicle?.id,
        article: orderData?.article?.id,
        service: orderData?.service?.id,
        orderStatus: orderData?.orderStatus,
        technician: orderData?.technician?.id,
        price: orderData?.price,
        date: orderData?.date ? dayjs(orderData.date) : null,
        source: orderData?.source,
        start_time: dayjs(orderData.startTime, "HH:mm"),
        end_time: dayjs(orderData.endTime, "HH:mm"),
        damage_images: imageFiles, // optional, mainly for form display
      });

      setFileList(imageFiles); // ✅ preview\
      setIsPaid(orderData?.isPaid || false);
    }
  }, [data, form]);

  return (
    <section className="w-full max-w-2xl mx-auto bg-gray-50 shadow p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {" "}
          {orderId ? "Updated Order" : "New Order"}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm">Bill Paid</span>
          <Switch checked={isPaid} onChange={setIsPaid} />
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
        <Form.Item
          name="customer"
          rules={[{ required: true, message: "Please select a customer!" }]}
        >
          <Select
            showSearch
            placeholder="Select customer"
            className="h-12"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {customerDropdown.map(({ id, customerName }) => (
              <Select.Option key={id} value={id}>
                {customerName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="vehicle"
          rules={[{ required: true, message: "Please select a vehicle!" }]}
        >
          <Select
            showSearch
            placeholder="Select vehicle"
            className="h-12"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {vehicleDropdown.map(({ id, vehiclePlate }) => (
              <Select.Option key={id} value={id}>
                {vehiclePlate}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="article"
          rules={[{ required: true, message: "Please select a article!" }]}
        >
          <Select
            showSearch
            placeholder="Select article"
            className="h-12"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {articleDropdown.map(({ id, articleName }) => (
              <Select.Option key={id} value={id}>
                {articleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="service"
          rules={[{ required: true, message: "Please select a service!" }]}
        >
          <Select
            showSearch
            placeholder="Select service"
            className="h-12"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {serviceDropdown.map(({ id, serviceName }) => (
              <Select.Option key={id} value={id}>
                {serviceName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="orderStatus"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select
            showSearch
            placeholder="Select status"
            className="h-12"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="COMPLETED">Completed</Select.Option>
            <Select.Option value="CANCELED">Canceled</Select.Option>
            <Select.Option value="WARRANTY_CLAIM">Warranty Claim</Select.Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
          <Form.Item
            name="technician"
            label="Assign Technician"
            rules={[{ required: true, message: "Please assign a technician!" }]}
          >
            <Select placeholder="Select technician" className="h-12">
              {technicianDropdown.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Enter the price!" }]}
          >
            <Input type="number" placeholder="Enter price" className="h-12" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Select a date!" }]}
          >
            <DatePicker className="w-full h-12" />
          </Form.Item>

          <Form.Item
            name="source"
            label="Source"
            rules={[{ required: true, message: "Please select source!" }]}
          >
            <Select
              placeholder="Select source"
              options={sourceOptions}
              className="h-12"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
          <Form.Item
            name="start_time"
            label="Start Time"
            rules={[{ required: true, message: "Enter start time" }]}
          >
            <TimePicker className="w-full h-12" format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="end_time"
            label="End Time"
            rules={[{ required: true, message: "Enter end time" }]}
          >
            <TimePicker className="w-full h-12" format="HH:mm" />
          </Form.Item>
        </div>

        {/* Image Upload Field */}
        <Form.Item name="damage_images" label="Upload Damage Images">
          <Upload {...uploadProps}>
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item className="mt-6 mb-0">
          <Button
            type="primary"
            htmlType="submit"
            className={`w-full h-12 bg-primary hover:bg-gray-800 ${
              createLoading || updateLoading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            size="large"
            disabled={createLoading || updateLoading}
            loading={createLoading || updateLoading}
          >
            {orderId ? "Update Order" : "Create Order"}
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default NewOrderPageComponent;
