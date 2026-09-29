"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Switch,
  Button,
  Space,
  Tag,
  List,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  useGetSubscriptionCardQuery,
  useGetSubscriptionPlanQuery,
  useUpdateCancelMutation,
  useUpdateRemovedMutation,
  useUpdateSubscriptionMutation,
} from "@/redux/features/subscriptions/subscriptionsApi";
import moment from "moment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;
interface CardDetails {
  id: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  last4: string;
}

export default function SubscriptionsPageComponent() {
  const [autoRenew, setAutoRenew] = useState(true);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter()

  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);

  // API calls
  const { data: planData } = useGetSubscriptionPlanQuery(undefined);
  const { data: card } = useGetSubscriptionCardQuery(undefined);

  // dynamic data
  const plan = planData?.data?.UserSubscription || null;
  const benefits = plan?.plan?.benefits || [];
  const currentPrice = plan?.plan?.price ?? 0;
  const interval = plan?.plan?.interval ?? "month";
  const nextBillingDate = plan?.currentPeriodEnd
    ? moment(plan.currentPeriodEnd).format("MMMM DD, YYYY")
    : "-";
  const cardDetails = card?.data;

  const [updateCancel] = useUpdateCancelMutation()
  const handleAutoRenewChange = async (checked: boolean) => {
    try{
      const response = await updateCancel(undefined).unwrap()
      if(response?.success){
        toast?.success(response?.message || `Auto-renew ${checked ? "enabled" : "disabled"}`)
      }
    }catch(error: any){
      toast.error(error?.data?.message || "Fail to auto renew, Please try to again")
    }
  };

  const handleBillingCycleChange = () => {
    router.push('/#pricing')
  };

  const [updateSubscription] = useUpdateSubscriptionMutation();
  const handleUpdatePayment = async () => {
    try {
      const response = await updateSubscription({
        previousPaymentMethodId: selectedCard?.id,
      }).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Payment method updated successfully."
        );
        setIsUpdateModalVisible(false);
        setSelectedCard(null);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to update payment method. Please try again."
      );
    }
  };

  const [updateRemoved] = useUpdateRemovedMutation();
  const handleRemovePayment = async () => {
    try {
      const response = await updateRemoved({
        previousPaymentMethodId: selectedCard?.id,
      }).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Payment method removed successfully."
        );
        setIsRemoveModalVisible(false);
        setSelectedCard(null);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to remove payment method. Please try again."
      );
    }
  };

  // console.log(cardDetails)
  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-bold mb-1">Subscription</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan and Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card className="shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <Title level={4}>Current Plan</Title>
              <Tag
                color={plan?.status === "active" ? "green" : "red"}
                className="px-3 py-1"
              >
                {plan?.status === "active" ? "Active" : "Inactive"}
              </Tag>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-2">
                <Title level={3} className="mb-0">
                  {plan?.plan?.planName ?? "N/A"}
                </Title>
                <Text type="secondary">({interval})</Text>
              </div>
              <div className="flex items-baseline space-x-1 mb-4">
                <Title level={2} className="mb-0">
                  ${currentPrice.toFixed(2)}
                </Title>
                <Text type="secondary">per {interval}</Text>
              </div>
            </div>

            <div className="mb-4">
              <Text type="secondary">Next billing date:</Text>
              <br />
              <Text strong>{nextBillingDate}</Text>
            </div>

            <div className="flex items-center justify-between">
              <Text>Auto-renew</Text>
              <Switch checked={plan?.status === "active"? true: false} onChange={handleAutoRenewChange} />
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">
              Payment Method
            </Title>
            {cardDetails?.map((item: CardDetails) => (
              <div key={item.id}>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-3">
                    <CreditCardOutlined className="text-xl text-gray-600" />
                    <div>
                      <Text strong>
                        {item.brand?.toUpperCase()} ........ {item.last4}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        Expires {item.exp_month}/{item.exp_year}
                      </Text>
                    </div>
                  </div>
                </div>
                <Space>
                  {/* <Button
                    onClick={() => {
                      setSelectedCard(item);
                      setIsUpdateModalVisible(true);
                    }}
                    className="h-10"
                  >
                    Update
                  </Button> */}
                  <Button
                    danger
                    onClick={() => {
                      setSelectedCard(item);
                      setIsRemoveModalVisible(true);
                    }}
                    className="h-10"
                  >
                    Remove
                  </Button>
                </Space>
              </div>
            ))}
          </Card>
        </div>

        {/* Plan Features */}
        <div>
          <Card className="shadow-sm">
            <Title level={4} className="mb-4">
              Plan Features
            </Title>
            <List
              dataSource={benefits}
              renderItem={(feature, index) => (
                <List.Item key={index} className="px-0 py-2 border-none">
                  <div className="flex items-center space-x-3">
                    <CheckCircleOutlined className="text-green-500 text-lg" />
                    <Text>{String(feature)}</Text>
                  </div>
                </List.Item>
              )}
            />
            <Button
              type="primary"
              size="large"
              className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border-gray-800"
              onClick={handleBillingCycleChange}
            >
              Change to bill Annually
            </Button>
          </Card>
        </div>
      </div>

      {/* Update Payment Method Modal */}
      <Modal
        title="Update Payment Method"
        open={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePayment}
          className="mt-4"
        >
          <Form.Item
            label="Card Type"
            name="cardType"
            rules={[{ required: true, message: "Please select card type" }]}
          >
            <Select placeholder="Select card type" className="h-12">
              <Option value="Visa">Visa</Option>
              <Option value="Mastercard">Mastercard</Option>
              <Option value="American Express">American Express</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: "Please enter card number" }]}
          >
            <Input
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="h-12"
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Expiry Date"
              name="expiry"
              rules={[{ required: true, message: "Please enter expiry date" }]}
            >
              <Input placeholder="MM/YYYY" className="h-12" />
            </Form.Item>
            <Form.Item
              label="CVV"
              name="cvv"
              rules={[{ required: true, message: "Please enter CVV" }]}
            >
              <Input placeholder="123" maxLength={4} className="h-12" />
            </Form.Item>
          </div>
          <Form.Item className="mb-0 mt-10">
            <div className="flex gap-4">
              <Button
                onClick={() => setIsUpdateModalVisible(false)}
                className="w-full h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-primary hover:bg-gray-800 border-primary"
                size="large"
              >
                Update Now
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {/* Remove Payment Method Confirmation Modal */}
      <Modal
        title="Remove Payment Method"
        open={isRemoveModalVisible}
        onOk={handleRemovePayment}
        onCancel={() => setIsRemoveModalVisible(false)}
        okText="Remove"
        cancelText="Cancel"
        okButtonProps={{
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
      >
        <p>Are you sure you want to remove this payment method?</p>
        <p className="text-gray-600">
          <strong>
            {selectedCard?.brand?.toUpperCase()} ........ {selectedCard?.last4}
          </strong>
        </p>
        <p className="text-red-600 text-sm">
          Warning: Removing your payment method may affect your subscription
          renewal.
        </p>
      </Modal>
    </div>
  );
}
