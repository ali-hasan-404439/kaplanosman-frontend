"use client";

import { useEffect, useState } from "react";
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
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useSingleGetInvoiceQuery,
  useUpdateInvoiceMutation,
} from "@/redux/features/invoice/invoiceApi";
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

interface CustomerInvoiceEditProp {
  createCustomerInvoiceEdit: boolean;
  setCreateCustomerInvoiceEdit: (prv: boolean) => void;
  createCustomerInvoiceEditData: any;
  setCreateCustomerInvoiceEditData: (prv: any) => void;
}

export default function CustomerInvoiceEdit({
  createCustomerInvoiceEdit,
  setCreateCustomerInvoiceEdit,
  createCustomerInvoiceEditData,
}: CustomerInvoiceEditProp) {
  const [form] = Form.useForm();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);

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

  const [updatedInvoice, { isLoading: createLoading }] = useUpdateInvoiceMutation();

  const handelUpdatedInvoice = async () => {
    const formData = new FormData();
    try {
      const values = await form.validateFields();

      if (items.length === 0) {
        toast.error("Please add at least one invoice item.");
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

      // Check if new attachment uploaded
      if (values?.attachment?.fileList?.length > 0) {
        formData.append(
          "invoiceFile",
          values?.attachment?.fileList[0]?.originFileObj
        );
      } else if (existingFileUrl) {
        // Send old file url if needed by server
        formData.append("oldFileUrl", existingFileUrl);
      }

      const response = await updatedInvoice({id: createCustomerInvoiceEditData?.id, formData: formData}).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Invoice updated successfully!");
        form.resetFields();
        setItems([]);
        setExistingFileUrl(null);
        setCreateCustomerInvoiceEdit(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update invoice.");
    }
  };

  const { data, error } = useSingleGetInvoiceQuery(
    { id: createCustomerInvoiceEditData?.id as string },
    { skip: !createCustomerInvoiceEditData?.id }
  );

  useEffect(() => {
    if (data?.success) {
      const invoiceData = data?.data;
      form.setFieldsValue({
        order_id: invoiceData?.order?.generatedOrderId,
        customerName: invoiceData?.customerName,
        email: invoiceData?.customerEmail,
        phone: invoiceData?.customerPhone,
        address: invoiceData?.customerAddress,
        dueDate: invoiceData?.dueDate ? dayjs(invoiceData?.dueDate) : null,
        attachment: [],
      });
      setItems(invoiceData?.items || []);
      setExistingFileUrl(invoiceData?.fileUrl || null);
    }
    if (error) {
      toast.error("Failed to fetch invoice data.");
    }
  }, [data, error, form]);

  return (
    <Modal
      open={createCustomerInvoiceEdit}
      title="Update Invoice"
      onCancel={() => setCreateCustomerInvoiceEdit(false)}
      footer={null}
      width={900}
    >
      <Form layout="vertical" form={form} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Title level={5}>Customer Information</Title>
            <Form.Item name="order_id" label="Order ID" rules={[{ required: true }]}>
              <Input placeholder="Enter order id" className="h-12" />
            </Form.Item>
            <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
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

        {/* Invoice items */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Title level={5}>Invoice Items</Title>
            <Button onClick={addItem} icon={<PlusOutlined />}>Add Item</Button>
          </div>
          <div className="p-5 border rounded">
            {items.map((item, index) => (
              <Space key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div>
                  <Text>Name</Text>
                  <Input
                    placeholder="Name"
                    value={item.itemName}
                    onChange={(e) => updateItem(index, "itemName", e.target.value)}
                    style={{ width: 200 }}
                  />
                </div>
                {["quantity", "unitPrice", "tax", "discount"].map((field) => (
                  <div key={field}>
                    <Text>{field === "unitPrice" ? "Unit Price" : field[0]?.toUpperCase() + field?.slice(1)}</Text>
                    <InputNumber
                      min={field === "tax" || field === "discount" ? 0 : 1}
                      max={field === "tax" || field === "discount" ? 100 : undefined}
                      value={item[field as keyof InvoiceItem] as number}
                      parser={(value) => {
                        if (value && /[^\d]/g.test(value)) {
                          message.error("Only numbers are allowed!");
                        }
                        const numeric = value?.replace(/[^\d]/g, "") || "";
                        return numeric ? Number(numeric) : 0;
                      }}
                      onChange={(val) => updateItem(index, field as keyof InvoiceItem, val || 0)}
                    />
                  </div>
                ))}
                <Button icon={<DeleteOutlined />} onClick={() => removeItem(index)} danger type="text" />
              </Space>
            ))}
          </div>
        </div>

        {/* Totals and attachment */}
        <div className="flex justify-between items-start gap-6">
          <Form.Item name="attachment" label="Upload File">
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.doc,.jpg,.png">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {existingFileUrl && (
              <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500 underline">
                View existing attachment
              </a>
            )}
          </Form.Item>
          <div className="space-y-2 p-4 border rounded-md w-full md:w-[300px]">
            <div className="flex justify-between"><Text>Subtotal:</Text><Text strong>${subtotal.toFixed(2)}</Text></div>
            <div className="flex justify-between"><Text>Discount:</Text><Text strong>${totalDiscount.toFixed(2)}</Text></div>
            <div className="flex justify-between"><Text>Tax:</Text><Text strong>${totalTax.toFixed(2)}</Text></div>
            <Divider />
            <div className="flex justify-between text-base"><Text strong>Total:</Text><Text strong>${grandTotal.toFixed(2)}</Text></div>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <Button onClick={() => setCreateCustomerInvoiceEdit(false)} className="h-12">Cancel</Button>
          <Button onClick={handelUpdatedInvoice} type="primary" className="h-12" loading={createLoading} icon={<PlusOutlined />}>
            Update Invoice
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
