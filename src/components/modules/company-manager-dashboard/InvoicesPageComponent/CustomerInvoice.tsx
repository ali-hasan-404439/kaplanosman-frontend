"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  Divider,
  Upload,
  InputNumber,
  Space,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { useCreateInvoiceMutation } from "@/redux/features/invoice/invoiceApi";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
}

interface CreateInvoiceFormProp {
  createCustomerInvoice: boolean;
  setCreateCustomerInvoice: (prv: boolean) => void;
}

export default function CreateInvoiceForm({
  createCustomerInvoice,
  setCreateCustomerInvoice,
}: CreateInvoiceFormProp) {
  const [form] = Form.useForm();

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      itemName: "",
      quantity: 0,
      unitPrice: 0,
      tax: 0,
      discount: 0,
    },
  ]);

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { itemName: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice * item.discount) / 100,
    0
  );
  const afterDiscount = subtotal - totalDiscount;
  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discount = (itemSubtotal * item.discount) / 100;
    return sum + ((itemSubtotal - discount) * item.tax) / 100;
  }, 0);
  const grandTotal = afterDiscount + totalTax;

  const [createInvoice, { isLoading: createLoading }] =
    useCreateInvoiceMutation();

  const handelCreateInvoice = async () => {
    const formData = new FormData();
    try {
      const values = await form.validateFields();

      if (items.length === 0) {
        toast.error("Please add at least one invoice item.");
        return;
      }
      if (values?.attachment?.fileList?.length === 0) {
        toast.error("Please upload an attachment.");
        return;
      }

      const invoiceData = {
        generatedOrderId: values.order_id,
        customerName: values.customerName,
        customerEmail: values.email,
        customerAddress: values.address,
        customerPhone: values.phone,
        dueDate: moment(values.dueDate.$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        items,
      };

      formData.append("data", JSON.stringify(invoiceData));
      formData.append(
        "invoiceFile",
        values?.attachment?.fileList[0]?.originFileObj
      );
      const response = await createInvoice(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Invoice created successfully!");
        form.resetFields();
        setItems([
          {
            itemName: "",
            quantity: 0,
            unitPrice: 0,
            tax: 0,
            discount: 0,
          },
        ]);
        setCreateCustomerInvoice(false);
      }
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error("Failed to create invoice. Please try again.");
      }
    }
  };

  return (
    <Modal
      open={createCustomerInvoice}
      title="Create New Invoice"
      onCancel={() => setCreateCustomerInvoice(false)}
      footer={null}
      width={900}
    >
      <Form layout="vertical" form={form} className="mt-5 space-y-5">
        {/* Customer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Title level={5}>Customer Information</Title>
            <Form.Item
              name="order_id"
              label="Order ID"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter order id" className="h-12" />
            </Form.Item>
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter customer name" className="h-12" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input type="email" placeholder="Enter email" className="h-12" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Enter phone" className="h-12" />
            </Form.Item>
          </div>

          <div>
            <Title level={5}>Invoice Details</Title>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker className="w-full h-12" />
            </Form.Item>
            <Form.Item name="address" label="Customer Address">
              <TextArea rows={3} />
            </Form.Item>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Title level={5}>Invoice Items</Title>
            <Button
              onClick={addItem}
              icon={<PlusOutlined />}
              style={{ marginTop: 12 }}
            >
              Add Item
            </Button>
          </div>
          <div className="p-5 border rounded">
            {items.map((item, index) => (
              <Space
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "nowrap",
                }}
              >
                <div>
                  <Text>Name</Text>
                  <Input
                    placeholder="Name"
                    value={item.itemName}
                    onChange={(e) =>
                      updateItem(index, "itemName", e.target.value)
                    }
                    style={{ width: 200 }}
                  />
                </div>

                <div>
                  <Text>Qty</Text>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    parser={(value) => {
                      if (value && /[^\d]/g.test(value)) {
                        message.error("Only numbers are allowed!");
                      }
                      const numeric = value?.replace(/[^\d]/g, "") || "";
                      return numeric ? Number(numeric) : 0;
                    }}
                    onChange={(val) => updateItem(index, "quantity", val || 1)}
                  />
                </div>

                <div>
                  <Text>Unit Price</Text>
                  <InputNumber
                    min={0}
                    value={item.unitPrice}
                    parser={(value) => {
                      if (value && /[^\d]/g.test(value)) {
                        message.error("Only numbers are allowed!");
                      }
                      const numeric = value?.replace(/[^\d]/g, "") || "";
                      return numeric ? Number(numeric) : 0;
                    }}
                    onChange={(val) => updateItem(index, "unitPrice", val || 0)}
                  />
                </div>

                <div>
                  <Text>Tax</Text>
                  <InputNumber
                    min={0}
                    max={100}
                    value={item.tax}
                    parser={(value) => {
                      if (value && /[^\d]/g.test(value)) {
                        message.error("Only numbers are allowed!");
                      }
                      const numeric = value?.replace(/[^\d]/g, "") || "";
                      return numeric ? Number(numeric) : 0;
                    }}
                    onChange={(val) => updateItem(index, "tax", val || 0)}
                  />
                </div>

                <div>
                  <Text>Discount</Text>
                  <InputNumber
                    min={0}
                    max={100}
                    value={item.discount}
                    parser={(value) => {
                      if (value && /[^\d]/g.test(value)) {
                        message.error("Only numbers are allowed!");
                      }
                      const numeric = value?.replace(/[^\d]/g, "") || "";
                      return numeric ? Number(numeric) : 0;
                    }}
                    onChange={(val) => updateItem(index, "discount", val || 0)}
                  />
                </div>

                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => removeItem(index)}
                  danger
                  type="text"
                />
              </Space>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start gap-6">
          <Form.Item name="attachment" label="Upload File">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.jpg,.png"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <div className="space-y-2 p-4 border rounded-md w-full md:w-[300px]">
            <div className="flex justify-between">
              <Text>Subtotal:</Text>
              <Text strong>${subtotal.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Discount:</Text>
              <Text strong>${totalDiscount.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Tax:</Text>
              <Text strong>${totalTax.toFixed(2)}</Text>
            </div>
            <Divider />
            <div className="flex justify-between text-base">
              <Text strong>Total:</Text>
              <Text strong>${grandTotal.toFixed(2)}</Text>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <Button
            onClick={() => setCreateCustomerInvoice(false)}
            className="h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={handelCreateInvoice}
            type="primary"
            className={`h-12 ${
              createLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={createLoading}
            icon={<PlusOutlined />}
            loading={createLoading}
          >
            Create Invoice
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
