"use client";
import {
  useCreateOrderWarrantyClaimMutation,
  useGetSingleOrderQuery,
} from "@/redux/features/order/orderApi";
import { Form, Modal, Button, Input } from "antd";
import { Printer, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
export interface OrderDetails {
  id: string;
  isPaid: boolean;
  generatedOrderId: string;
  orderStatus: string;
  price: number;
  date: string;
  source: string;
  startTime: string;
  endTime: string;
  damageImages: string[];
  createdAt: string;

  customer: {
    customerName: string;
    customerType: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes: string;
    status: string;
  };

  vehicle: {
    vehicleName: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehiclePlate: string;
    vehicleChassisNumber: string;
    mileage: string;
    serviceTime: string | null;
    lastService: string | null;
    vehicleStatus: string;
  };

  service: {
    serviceName: string;
    serviceCategory: string; // JSON string (you can parse it if needed)
    serviceDescription: string;
    estimatedTime: string;
    orderQuantity: number | null;
    servicePrice: number;
    serviceStatus: string;
  };

  technician: {
    name: string;
    profilePhoto: string | null;
    phone: string | null;
    isDeleted: boolean;
    color: string;
    specialty: string | null;
    generatedTechnicianId: string | null;
    status: string;
  };

  article: {
    articleName: string;
    modelNumber: string;
    inventoryAmount: number;
    grossAmount: number;
    installationTime: string;
    pricePerUnit: number;
    note: string;
    createdAt: string;
  };
}

function OrderViewDetailsPageComponent({ order_id }: { order_id: string }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  // const { user } = useAppSelector((
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [claimWarrantyStatus, setClaimWarrantyStatus] =
    useState<boolean>(false);

  const [createOrderWarrantyClaim, { isLoading: createLoading }] =
    useCreateOrderWarrantyClaimMutation();
  const handleCreateSubmit = async () => {
    try {
      const { description } = await form.validateFields();
      const response = await createOrderWarrantyClaim({
        id: order_id,
        note: description,
      }).unwrap();
      if (response.success) {
        toast.success(
          response?.message || "Claim Warrant created successfully!"
        );
        setClaimWarrantyStatus(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const { data, error, isLoading } = useGetSingleOrderQuery(
    { id: order_id },
    { skip: !order_id }
  );

  useEffect(() => {
    if (data?.success) {
      setOrderDetails(data?.data);
    }
  }, [data, error]);
  return (
    <section>
      <div className="flex items-center justify-between space-x-4 py-5">
        <h1 className="text-2xl font-bold text-primary">
          Order Details - {orderDetails?.customer?.customerName} $
          {orderDetails?.price}
        </h1>
        <div className="flex text-center gap-4">
          <button
            onClick={() => setClaimWarrantyStatus(true)}
            className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Claim Warranty</span>
          </button>
          {/* <button className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Print Now</span>
          </button> */}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 grid grid-cols-2 border-r border-b">
            <h2>Order ID</h2>
            <p className="font-semibold">{orderDetails?.generatedOrderId}</p>
          </div>
          <div className="p-6 grid grid-cols-2">
            <h2>Order Status</h2>
            <p className="font-semibold text-green-600">
              {orderDetails?.orderStatus}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b divide-y">
          {/* Customer Info */}
          <div className="p-6 border-r">
            <h3 className="font-semibold text-gray-800 mb-2">
              Customer and Location
            </h3>
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-4">
              <p>Customer / Firm Name: </p>{" "}
              <p> {orderDetails?.customer?.customerName}</p>
              <p>Customer Type: </p>{" "}
              <p> {orderDetails?.customer?.customerType}</p>
              <p>Phone: </p> <p> {orderDetails?.customer?.customerPhone}</p>
              <p>Email: </p> <p> {orderDetails?.customer?.customerEmail}</p>
              <p>Address: </p> <p> {orderDetails?.customer?.customerAddress}</p>
              <p>Notes: </p> <p> {orderDetails?.customer?.customerNotes}</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Vehicle Details
            </h3>
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-4">
              <p>Brand: </p> <p> {orderDetails?.vehicle?.vehicleBrand}</p>
              <p>Model: </p> <p> {orderDetails?.vehicle?.vehicleModel}</p>
              <p>License Plate: </p>{" "}
              <p> {orderDetails?.vehicle?.vehiclePlate}</p>
              <p>Status: </p> <p> {orderDetails?.vehicle?.vehicleStatus}</p>
              <p>Chassis Number: </p>{" "}
              <p> {orderDetails?.vehicle?.vehicleChassisNumber}</p>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-6  border-r">
            <h3 className="font-semibold text-gray-800 mb-2">Service</h3>
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-4">
              <p>Service Type: </p>{" "}
              <p> {orderDetails?.service?.serviceCategory}</p>
              <p>Statue: </p> <p> {orderDetails?.service?.serviceStatus}</p>
              <p>Material Cost: </p>{" "}
              <p> $ {orderDetails?.service?.servicePrice}</p>
              <p>Description: </p>{" "}
              <p> {orderDetails?.service?.serviceDescription}</p>
            </div>
          </div>

          {/* Technician Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Technician Info
            </h3>
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-4">
              <p>Technician Name: </p> <p> {orderDetails?.technician?.name}</p>
              <p>Phone: </p> <p> {orderDetails?.technician?.phone}</p>
              <p>Specialty: </p> <p> {orderDetails?.technician?.specialty}</p>
              <p>Status: </p> <p> {orderDetails?.technician?.status}</p>
            </div>
          </div>
        </div>

        {/* Damage Images */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-800 text-lg mb-4">
            Damage Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {orderDetails?.damageImages?.map((img, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="aspect-square bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={img}
                    alt={`Damage ${index + 1}`}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-fill"
                  />
                </div>
                <p className="text-sm text-gray-500">12.03.25</p>
              </div>
            ))}
            <div className="aspect-square bg-gray-200 rounded overflow-hidden"></div>
          </div>
        </div>
      </div>

      <Modal
        title="Claim Warranty"
        open={claimWarrantyStatus}
        onCancel={() => {
          setClaimWarrantyStatus(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter some description!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter description here..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-10">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                createLoading ? "cursor-not-allowed" : " cursor-pointer"
              }`}
              size="large"
              disabled={createLoading}
            >
              Done
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default OrderViewDetailsPageComponent;
