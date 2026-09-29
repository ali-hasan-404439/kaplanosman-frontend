"use client";

import Loading from "@/components/shared/Loading/Loading";
import {
  useCreatePlanMutation,
  useGetAllPlansQuery,
  useUpdatePlanMutation,
} from "@/redux/features/super_admin/superAdmin.api";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
} from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

interface PricingPlan {
  id: number;
  planName: string;
  price: number;
  discount?: number;
  billing: "Monthly" | "Yearly";
  features: string[];
  featuresDisplay: string;
  status: boolean;
  updated: string;
}

interface Plan {
  id: string;
  stripePriceId: string;
  planName: string;
  description: string;
  price: number;
  interval: string; // or more specific like "month" | "year" if you know all possible values
  benefits: string[];
  productId: string;
  status: "ACTIVE" | string; // or enum if you know all possible status values
  createdAt: string; // or Date if you'll parse it
  updatedAt: string; // or Date if you'll parse it
}

const PlanManagementComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const availableFeatures = [
    "Every Day Overview",
    "Order Management.",
    "Advance Analytics",
    "Meeting management.",
    "In-details Calendar View",
    "Supplier Management",
    "Service Management",
    "Invoice Print",
    "Mobile App Support",
  ];

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllPlansQuery(undefined);

  const plans: Plan[] = response?.data || [];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
    form.resetFields();
  };

  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, price: Number(values.price) };
      if (selectedPlan) {
        delete payload?.id;
      }
      const res = await handleAsyncWithToast(
        async () => {
          return selectedPlan
            ? updatePlan({
                data: payload,
                id: selectedPlan?.id,
              })
            : createPlan(payload);
        },
        selectedPlan ? "Updating Plan..." : "Creating Plan..."
      );
      if (res?.data?.success) {
        form.resetFields();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleAction = (action: string, id: string) => {
    console.log(`${action} clicked for plan ${id}`);
    if (action === "Edit") {
      console.log("Edit clicked for plan", id);
      const plan = plans?.find((plan) => plan?.id === id);
      if (plan) {
        setSelectedPlan(plan);
        form.setFieldsValue(plan);
        setIsModalOpen(true);
      }
    } else if (action === "Delete") {
      console.log("Delete clicked for plan", id);
    }
  };

  const handleStatusToggle = async (id: string, checked: boolean) => {
    await handleAsyncWithToast(async () => {
      return updatePlan({
        data: { status: checked ? "ACTIVE" : "INACTIVE" },
        id,
      });
    }, "Updating Plan Status...");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1592px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pricing Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your SaaS pricing plans and features
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="bg-gray-900 hover:bg-gray-800 border-gray-900 h-10 px-6"
          >
            Add New Plan
          </Button>
        </div>

        {/* Pricing Plans Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pricing Plans
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage your pricing tiers and features
            </p>
          </div>

          {plans?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Plan Name
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Billing
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Features
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Updated
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {plans?.map((plan: Plan, index: number) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {plan.planName}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-semibold">
                            ${plan.price}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {plan?.interval?.charAt(0).toUpperCase() +
                          plan?.interval?.slice(1)?.toLowerCase()}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {/* {plan?.benefits?.map((feature: string, index: number) => (
                        <div key={index}>
                          <p>{feature}</p>
                        </div>
                      ))} */}
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-700 text-[10px] font-bold border border-gray-700 rounded-full py-[3px] px-[5px]">
                            {plan?.benefits[0]}
                          </p>
                          <p className="text-gray-700 text-[10px] font-bold border border-gray-700 rounded-full py-[3px] px-[5px]">
                            + {plan?.benefits?.length - 1} more
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              plan.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-red-800"
                            }`}
                          >
                            {plan.status?.charAt(0).toUpperCase() +
                              plan.status?.slice(1)?.toLowerCase()}
                          </span>
                          <Switch
                            size="small"
                            checked={plan.status === "ACTIVE"}
                            onChange={(checked) =>
                              handleStatusToggle(plan?.id, checked)
                            }
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(plan?.createdAt)?.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-4 px-6 relative">
                        <button
                          onClick={() => handleAction("Edit", plan.id)}
                          className="p-2 text-gray-700 hover:text-blue-600"
                          title="Edit"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M14.85 2.85a2.121 2.121 0 0 1 3 3l-9.5 9.5-3.5.5.5-3.5 9.5-9.5Zm2.12 2.12-1.06-1.06a1.121 1.121 0 0 0-1.59 0l-1.06 1.06 2.65 2.65 1.06-1.06a1.121 1.121 0 0 0 0-1.59ZM3 17h14v1H3v-1Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        {/* <button
                          onClick={() => handleAction("Delete", plan.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M7 8v6m3-6v6m3-6v6M4 6h12m-1 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3-2h4a1 1 0 0 1 1 1v1H6V5a1 1 0 0 1 1-1Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty description="No Plans Found" />
          )}
        </div>

        {/* Add New Pricing Plan Modal */}
        <Modal
          title={selectedPlan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={600}
          centered
        >
          <p className="text-gray-600 mb-6">
            Configure the pricing plan details and features.
          </p>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Plan Name"
                name="planName"
                rules={[{ required: true, message: "Please enter plan name!" }]}
              >
                <Input placeholder="Enter plan name" />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter price!" }]}
              >
                <Input placeholder="Enter price" type="number" prefix="$" />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span>
                  Description{" "}
                  <span className="text-gray-500">(Make it short)</span>
                </span>
              }
              name="description"
              rules={[{ required: true, message: "Please enter description!" }]}
            >
              <TextArea rows={3} placeholder="Enter plan description" />
            </Form.Item>

            <Form.Item
              label="Billing Period"
              name="interval"
              rules={[
                { required: true, message: "Please select billing period!" },
              ]}
            >
              <Radio.Group>
                <Radio value="month">Monthly</Radio>
                <Radio value="year">Yearly</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Features"
              name="benefits"
              rules={[
                {
                  required: true,
                  type: "array",
                  message: "Please select at least one feature!",
                },
              ]}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures?.map((feature) => (
                    <div key={feature} className="mb-2">
                      <Checkbox value={feature}>{feature}</Checkbox>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              initialValue="ACTIVE"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-gray-900 hover:bg-gray-800 border-gray-900"
              >
                {selectedPlan ? "Save Changes" : "Create Plan"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PlanManagementComponent;
