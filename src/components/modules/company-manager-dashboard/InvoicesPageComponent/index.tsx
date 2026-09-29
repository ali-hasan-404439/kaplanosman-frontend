"use client";

import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { Col, Modal, Pagination, Row, Select, Divider, Tag } from "antd";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateInvoiceForm from "./CustomerInvoice";
import CustomerInvoiceEdit from "./CustomerInvoiceEdit";
import { toast } from "sonner";
import {
  useDeleteInvoiceMutation,
  useGetAllInvoiceQuery,
  useSingleGetInvoiceQuery,
} from "@/redux/features/invoice/invoiceApi";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import { Typography } from "antd";
import moment from "moment";
const { Title, Text } = Typography;

interface InvoiceData {
  id: string;
  order: {
    id: string;
    generatedOrderId: string;
    service: {
      serviceName: string;
    };
  };
  fileUrl: string;
  customerName: string;
  status: string;
  generatedInvoiceId: string;
  totalAmount: number;
  dueDate: string;
}

interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
}

interface Service {
  serviceName: string;
}

interface Order {
  id: string;
  generatedOrderId: string;
  service: Service;
}

interface Invoice {
  id: string;
  generatedInvoiceId: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  dueDate: string; // ISO date string
  status: string; // you could also do: "PAID" | "UNPAID" if fixed values
  fileUrl: string;
  orderId: string;
  companyId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  order: Order;
}

function InvoicesPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [createCustomerInvoice, setCreateCustomerInvoice] =
    useState<boolean>(false);

  const [createCustomerInvoiceEdit, setCreateCustomerInvoiceEdit] =
    useState<boolean>(false);
  const [createCustomerInvoiceEditData, setCreateCustomerInvoiceEditData] =
    useState<InvoiceData>();

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceData | null>(
    null
  );

  const [invoicePrint, setInvoicePrint] = useState<boolean>(false);
  const [invoiceView, setInvoiceView] = useState<string>("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [singleInvoiceData, getSingleInvoiceData] = useState<Invoice | null>(
    null
  );
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, id: string) => {
    const invoice = invoiceData?.find((invoice) => invoice?.id === id);
    if (action === "Edit") {
      setCreateCustomerInvoiceEditData(invoice);
      setCreateCustomerInvoiceEdit(true);
    } else if (action === "Print Invoice") {
      setInvoicePrint(true);
      setInvoiceView(invoice?.id || "");
    } else if (action === "View Related Order") {
      if (user?.role === "COMPANY_ADMIN") {
        router.push(`/company/orders/${invoice?.order?.id}`);
      } else {
        router.push(`/manager/orders/${invoice?.order?.id}`);
      }
    } else if (action === "Delete") {
      if (invoice) {
        setInvoiceToDelete(invoice);
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };

  const handlePaginationChange = (current: number) => {
    setPage(current);
  };

  const [deleteInvoice, { isLoading: deleteLoading }] =
    useDeleteInvoiceMutation();
  const handleDeleteInvoice = async (id: string) => {
    try {
      const response = await deleteInvoice(id).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Invoice deleted successfully!");
        setInvoiceToDelete(null);
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to delete invoice. Please try again."
      );
    }
  };

  const headers = [
    "Order ID",
    "Attach",
    "Customer Name",
    "Service",
    "Invoice ID",
    "Amount",
    "Date",
    "Status",
    "Actions",
  ];
  const { data, error, isLoading } = useGetAllInvoiceQuery([
    {
      name: "page",
      value: page,
    },
    {
      name: "limit",
      value: pageSize,
    },
    {
      name: "searchTerm",
      value: searchQuery,
    },
    {
      name: "orderBy",
      value: filterValue,
    },
  ]);
  const { data: invoiceSingleData } = useSingleGetInvoiceQuery(
    { id: invoiceView as string },
    { skip: !invoiceView }
  );
  useEffect(() => {
    if (data?.success) {
      const invoice = data?.data?.data;
      const pagination = data?.data?.meta;
      setInvoiceData(invoice);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
    if (invoiceSingleData?.success) {
      const invoice = invoiceSingleData?.data;
      getSingleInvoiceData(invoice);
    }
  }, [data, error, invoiceSingleData]);
  return (
    <section>
      {/* Search and Button */}
      <div className="flex flex-wrap items-center justify-between gap-5">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice id"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72"
          />
        </div>

        <button
          onClick={() => setCreateCustomerInvoice(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Header with Filter */}
      <div className="flex items-center flex-wrap gap-5 justify-between py-5 sm:pt-10 sm:pb-7">
        <h1 className="text-2xl font-bold text-primary">All Invoice List</h1>
        <Select
          value={filterValue}
          onChange={(value) => setFilterValue(value as string)}
          className="h-[42px] w-full sm:w-[160px]"
          placeholder="Filter by type"
        >
          <Select.Option value="">Select status</Select.Option>
          <Select.Option value="asc">Ascending</Select.Option>
          <Select.Option value="desc">Descending</Select.Option>
        </Select>
      </div>

      {/* Table */}
      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : invoiceData?.map((order, index) => (
              <tr
                key={order?.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-6">{order?.order?.generatedOrderId}</td>
                <td className="py-3 px-6 text-blue-600 underline cursor-pointer">
                  <Link
                    href={order?.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <span>View Invoice</span>
                  </Link>
                </td>
                <td className="py-3 px-6">{order?.customerName}</td>
                <td className="py-3 px-6">
                  {order?.order?.service?.serviceName}
                </td>
                <td className="py-3 px-6">{order?.generatedInvoiceId}</td>
                <td className="py-3 px-6">৳{order?.totalAmount}</td>
                <td className="py-3 px-6">{order?.dueDate}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order?.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : order?.status === "UNPAID"
                        ? "bg-red-100 text-red-700"
                        : order?.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order?.status}
                  </span>
                </td>
                <td className="py-3 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(order?.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdown === order?.id && (
                    <div
                      className={`absolute top-1 right-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48 `}
                    >
                      <button
                        onClick={() => handleAction("Edit", order?.id)}
                        className="w-full px-4 py-2 text-sm hover:bg-gray-50 border-b"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("Print Invoice", order?.id)}
                        className="w-full px-4 py-2 text-sm hover:bg-gray-50 border-b"
                      >
                        Print Invoice
                      </button>
                      <a
                        href={order?.fileUrl}
                        download
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-50 border-b text-center"
                      >
                        Download Invoice
                      </a>

                      <button
                        onClick={() =>
                          handleAction("View Related Order", order?.id)
                        }
                        className="w-full px-4 py-2 text-sm text-blue-500 hover:bg-gray-50 border-b"
                      >
                        View Related Order
                      </button>
                      <button
                        onClick={() => handleAction("Delete", order?.id)}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
      </TableComponent>

      <div className="p-4 w-full flex justify-center items-center mt-6">
        <Pagination
          current={page}
          pageSize={total?.limit}
          total={total?.total}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete?.id)}
        onCancel={() => {
          setInvoiceToDelete(null);
          setDeleteModalVisible(false);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: deleteLoading,
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
        centered
      >
        <p>
          Are you sure you want to delete this invoice? This action cannot be
          undone.
        </p>
      </Modal>

      <Modal
        open={invoicePrint}
        onCancel={() => {
          setInvoicePrint(false);
          setInvoiceView("");
        }}
        width={900}
        centered
        footer={null}
        className="print"
      >
        <div style={{ padding: "20px 0" }}>
          {/* Header */}
          <Row justify="space-between" align="top" style={{ marginBottom: 12 }}>
            <Col>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    background: "#7CB342",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  elite
                </div>
                <Text style={{ fontSize: 16, color: "#666" }}>AUTOGLAS</Text>
              </div>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Title level={2} style={{ margin: 0 }}>
                INVOICE
              </Title>
              <Text>Invoice #: {singleInvoiceData?.generatedInvoiceId}</Text>
              <br />
              <Text>
                Date: {moment(singleInvoiceData?.createdAt).format("L")}
              </Text>
            </Col>
          </Row>

          {/* From and Bill To */}
          <Row gutter={48} style={{ marginBottom: 22 }}>
            <Col span={12}>
              <Title level={5} style={{ marginBottom: 8 }}>
                From:
              </Title>
              <Text>Elite Autoglas</Text>
              <br />
              <Text>123 Auto Service Street</Text>
              <br />
              <Text>Business District, City 12345</Text>
              <br />
              <Text>Phone: (555) 123-4567</Text>
              <br />
              <Text>Email: info@eliteautoglas.com</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ marginBottom: 8 }}>
                Bill To:
              </Title>
              <Text>{singleInvoiceData?.customerName}</Text>
              <br />
              <Text>{singleInvoiceData?.customerAddress}</Text>
              <br />
              <Text>Phone: {singleInvoiceData?.customerPhone}</Text>
              <br />
              <Text>Email: {singleInvoiceData?.customerEmail}</Text>
            </Col>
          </Row>

          {/* Invoice Details */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 border rounded-lg shadow-sm">
            <Col span={8}>
              <Text strong className="whitespace-nowrap">
                Invoice Number
              </Text>
              <br />
              <Text>{singleInvoiceData?.generatedInvoiceId}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Issue Date</Text>
              <br />
              <Text>{moment(singleInvoiceData?.createdAt).format("L")}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Due Date</Text>
              <br />
              <Text>{moment(singleInvoiceData?.dueDate).format("L")}</Text>
            </Col>
          </div>

          <TableComponent
            headers={[
              "Item Name",
              "Quantity",
              "Unit Price",
              "Tax",
              "Discount",
              "Total",
            ]}
          >
            {singleInvoiceData?.items?.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-6">{item?.itemName}</td>
                <td className="py-3 px-6">{item?.quantity}</td>
                <td className="py-3 px-6">${item?.unitPrice.toFixed(2)}</td>
                <td className="py-3 px-6">${item?.tax.toFixed(2)}</td>
                <td className="py-3 px-6">${item?.discount.toFixed(2)}</td>
                <td className="py-3 px-6">
                  $
                  {(
                    item?.quantity * item?.unitPrice +
                    item?.tax -
                    item?.discount
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </TableComponent>
          {/* Summary */}
          <div className="my-8 flex items-center justify-between">
            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <Tag
                color={
                  singleInvoiceData?.status?.toLowerCase() === "paid"
                    ? "green"
                    : "orange"
                }
                style={{ fontSize: "12px", padding: "4px 12px" }}
              >
                Status: {singleInvoiceData?.status}
              </Tag>
            </div>
            <Col span={10}>
              <div
                style={{ textAlign: "right" }}
                className="border p-4 rounded-lg shadow-sm"
              >
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>
                    <Text>Subtotal:</Text>
                  </Col>
                  <Col>
                    <Text>${singleInvoiceData?.subtotal?.toFixed(2)}</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>
                    <Text>Tax:</Text>
                  </Col>
                  <Col>
                    <Text>${singleInvoiceData?.totalTax?.toFixed(2)}</Text>
                  </Col>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Col>
                    <Text>Discount:</Text>
                  </Col>
                  <Col>
                    <Text>${singleInvoiceData?.totalDiscount?.toFixed(2)}</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "8px 0" }} />
                <Row justify="space-between">
                  <Col>
                    <Text strong>Total:</Text>
                  </Col>
                  <Col>
                    <Text strong>
                      ${singleInvoiceData?.totalAmount?.toFixed(2)}
                    </Text>
                  </Col>
                </Row>
              </div>
            </Col>
          </div>
          {/* Payment Info and Terms */}

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              paddingTop: 20,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Text>Thank you for choosing Elite Autoglas!</Text>
            <br />
            <Text>
              For questions about this invoice, contact (555) 123-4567 or
              info@eliteautoglas.com
            </Text>
          </div>
        </div>
      </Modal>

      <CreateInvoiceForm
        createCustomerInvoice={createCustomerInvoice}
        setCreateCustomerInvoice={setCreateCustomerInvoice}
      />
      <CustomerInvoiceEdit
        createCustomerInvoiceEdit={createCustomerInvoiceEdit}
        setCreateCustomerInvoiceEdit={setCreateCustomerInvoiceEdit}
        createCustomerInvoiceEditData={createCustomerInvoiceEditData}
        setCreateCustomerInvoiceEditData={setCreateCustomerInvoiceEditData}
      />
    </section>
  );
}

export default InvoicesPageComponent;
