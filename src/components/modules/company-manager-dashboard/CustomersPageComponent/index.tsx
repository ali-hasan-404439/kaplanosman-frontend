"use client";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { Form, Modal, Pagination, Input, Select, Button } from "antd";
const { Option } = Select;
import { MoreVertical, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ViewOrders from "./ViewOrders";
import {
  useCreateCustomerMutation,
  useCustomerChangeStatusMutation,
  useDeleteCustomerMutation,
  useGetAllCustomerQuery,
  useUpdateCustomerMutation,
} from "@/redux/features/customer/customerApi";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface Customer {
  id?: string;
  companyId?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  totalOrders?: number;
  customerType: string;
  status?: string;
  customerNotes: string;
}

interface Orders {
  id: number;
  customer_id: number;
  customer: string;
  brand_model: string;
  technician: string;
  order_date: string;
  time: string;
  status: string;
}

function CustomersPageComponent() {
  const headers = [
    "Customer Type",
    "Name",
    "Address",
    "Phone",
    "Email",
    "Total Orders",
    "Status",
    "",
  ];

  const user = useAppSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [filterValueType, setFilterValueType] = useState<string>("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // edit customer action state
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedCustomerEdit, setSelectedCustomerEdit] =
    useState<Customer | null>(null);

  // delete customer action state
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string>("");

  // customer status change action state
  const [changeStatus, setChangeStatus] = useState<boolean>(false);
  const [changeToStatus, setChangeToStatus] = useState<Customer | null>(null);

  // pagination customer action state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });
  const [showCustomerOrders, setShowCustomerOrders] = useState<boolean>(false);
  const [customerOrders, setCustomerOrders] = useState<string>("");

  const handleChange = (value: string) => {
    setFilterValue(value);
  };
  const handleChangeType = (value: string) => {
    setFilterValueType(value);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // handle action behaver function
  const handleAction = (action: string, id: string) => {
    const customer = customerData.find((customer) => customer.id === id);
    if (action === "Edit") {
      if (customer) {
        setSelectedCustomerEdit(customer);
        form.setFieldsValue({
          customerFirmName: customer.customerName,
          customerType: customer.customerType,
          phone: customer.customerPhone,
          email: customer.customerEmail,
          address: customer.customerAddress,
          notes: customer.customerNotes,
        });
        setShowEditModal(true);
      }
    } else if (action === "View") {
      if (customer) {
        setCustomerOrders(customer?.id ?? "");
        setShowCustomerOrders(true);
      }
    } else if (action === "change status") {
      if (customer) {
        setChangeToStatus(customer);
        setChangeStatus(true);
      }
    } else if (action === "Delete") {
      if (customer) {
        setCustomerToDelete(customer?.id || "");
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };

  // handle pagination change function
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // handle create new customer function

  const [createCustomer, { isLoading: createLoading }] =
    useCreateCustomerMutation();
  const handleCreateSubmit = async () => {
    try {
      const { customerFirmName, address, email, notes, phone, customerType } =
        await form.validateFields();

      const newCustomer: Customer = {
        companyId: user?.companyId,
        customerName: customerFirmName,
        customerType: customerType,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        customerNotes: notes,
      };

      const response = await createCustomer(newCustomer).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Customer created successfully!");
        setShowCreateModal(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create customer. Please check the form or try again.";
      toast.error(message);
    }
  };

  // handle edit customer function
  const [updateCustomer, { isLoading: updatedLoading }] =
    useUpdateCustomerMutation();
  const handleEditSubmit = async () => {
    try {
      const { customerFirmName, address, email, notes, phone, customerType } =
        await form.validateFields();
      if (!selectedCustomerEdit) return;

      const newCustomer: Customer = {
        customerName: customerFirmName,
        customerType: customerType,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        customerNotes: notes,
      };
      const response = await updateCustomer({
        id: selectedCustomerEdit?.id,
        formData: newCustomer,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Customer created successfully!");
        setShowEditModal(false);
        form.resetFields();
        setSelectedCustomerEdit(null);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create customer. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [deleteCustomer, { isLoading: deleteLoading }] =
    useDeleteCustomerMutation();
  const handleCustomerDelete = async (id: string) => {
    try {
      const response = await deleteCustomer(id).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Fail to customer delete. Please try again"
        );
        setCustomerToDelete("");
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create customer. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [changeStatusCustomer, { isLoading: changeStatusLoading }] =
    useCustomerChangeStatusMutation();

  const handleCustomerChangeStatus = async (customer: Customer) => {
    try {
      const updatedStatus = {
        id: customer?.id,
        formData: {
          status: customer?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      };
      const response = await changeStatusCustomer(updatedStatus).unwrap();

      if (response?.success) {
        toast.success(
          response?.message ||
            `Customer status changed to ${
              customer?.status === "ACTIVE" ? "Inactive" : "Active"
            }.`
        );
        // Reset modal state
        setChangeToStatus(null);
        setChangeStatus(false);
      } else {
        toast.error("Failed to change customer status. Please try again.");
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to change status. Please try again.";
      toast.error(message);
    }
  };

  const { data, error, isLoading } = useGetAllCustomerQuery([
    {
      name: "page",
      value: page,
    },
    {
      name: "limit",
      value: pageSize,
    },
    {
      name: "status",
      value: filterValue,
    },
    {
      name: "searchTerm",
      value: searchQuery,
    },
    {
      name: "customerType",
      value: filterValueType,
    },
  ]);

  useEffect(() => {
    if (data?.success) {
      const customers = data?.data;
      const pagination = data?.meta;
      setCustomerData(customers);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
  }, [data, error]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-5">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or number"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent  w-full sm:w-72"
          />
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customers</span>
        </button>
      </div>
      <div className="flex items-center flex-wrap justify-between gap-5 py-5 sm:pt-10 sm:pb-7">
        <h1 className="text-2xl font-bold text-primary">All Customer List</h1>
        <div className="flex flex-wrap gap-5 items-center">
          <Select
            value={filterValue}
            className="h-[42px] w-full sm:w-[120px]"
            onChange={handleChange}
            options={[
              { value: "", label: "Select Status" },
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
          />
          <Select
            value={filterValueType}
            className="h-[42px] w-full sm:w-[120px]"
            onChange={handleChangeType}
            options={[
              { value: "", label: "Select Type" },
              { value: "PRIVATE", label: "Privet" },
              { value: "FIRM", label: "Firm" },
            ]}
          />
        </div>
      </div>

      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : customerData?.map((customer, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {customer?.customerType}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {customer?.customerName}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {customer?.customerAddress}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {customer?.customerPhone}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {customer?.customerEmail}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {typeof customer?.totalOrders === "number" &&
                  customer.totalOrders > 0
                    ? customer.totalOrders
                    : ""}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      customer?.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-[#FFECD4] text-black"
                    }`}
                  >
                    {customer?.status}
                  </span>
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(customer?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === customer?.id && (
                    <div
                      className={`absolute right-14 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === customerData.length - 1 ? "bottom-5" : "top-0"
                      }`}
                    >
                      <div>
                        <button
                          onClick={() =>
                            handleAction("Edit", customer?.id ?? "")
                          }
                          className="w-full text-center px-3 py-2 text-sm text-black hover:bg-gray-50 border-b rounded-t-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction("change status", customer?.id ?? "")
                          }
                          className="w-full text-center px-3 py-2 text-sm text-black hover:bg-gray-50 border-b rounded-t-lg"
                        >
                          Change Status
                        </button>
                        <button
                          onClick={() =>
                            handleAction("View", customer?.id ?? "")
                          }
                          className="w-full text-center px-3 py-2 text-sm text-[#1570ef] hover:bg-gray-50 border-b "
                        >
                          View Orders
                        </button>
                        <button
                          onClick={() =>
                            handleAction("Delete", customer?.id ?? "")
                          }
                          className="w-full text-center px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
      </TableComponent>

      {/* Pagination */}
      <div className="p-4 w-full flex justify-center items-center mt-6">
        <Pagination
          current={page}
          pageSize={total?.limit}
          total={total?.total}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>
      {/* Create New Customers Modal */}
      <Modal
        title="Create New Customers"
        open={showCreateModal}
        onCancel={() => {
          {
            setShowCreateModal(false);
            form.resetFields();
          }
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
            label="Customer / Firm Name"
            name="customerFirmName"
            rules={[
              { required: true, message: "Please enter a customer!" },
              { min: 3, message: "customer must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter customer / firm name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Customer Type (privet or firm)"
            name="customerType"
            rules={[
              { required: true, message: "Please select a customer type!" },
            ]}
          >
            <Select placeholder="Select customer type" className="h-12">
              {["PRIVATE", "FIRM"].map((tech) => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter a phone!" }]}
          >
            <Input placeholder="Enter your phone" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter a email!" }]}
          >
            <Input placeholder="Enter your email" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter a address!" }]}
          >
            <Input placeholder="Enter your address" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: true, message: "Please enter a notes!" }]}
          >
            <Input placeholder="Enter your notes" className="h-12" />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary cursor-default ${
                createLoading && "opacity-75 cursor-not-allowed"
              }`}
              size="large"
              disabled={createLoading}
              loading={createLoading}
            >
              Done
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit New Customers Modal */}
      <Modal
        title="Edit Customers"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          form.resetFields();
          setSelectedCustomerEdit(null);
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Customer / Firm Name"
            name="customerFirmName"
            rules={[
              { required: true, message: "Please enter a customer!" },
              { min: 3, message: "Customer must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter customer / firm name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Customer Type (privet or firm)"
            name="customerType"
            rules={[
              { required: true, message: "Please select a customer type!" },
            ]}
          >
            <Select placeholder="Select customer type" className="h-12">
              {["PRIVATE", "FIRM"].map((tech) => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter a phone!" }]}
          >
            <Input placeholder="Enter your phone" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter an email!" }]}
          >
            <Input placeholder="Enter your email" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter an address!" }]}
          >
            <Input placeholder="Enter your address" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: true, message: "Please enter notes!" }]}
          >
            <Input placeholder="Enter your notes" className="h-12" />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-primary hover:bg-gray-800 border-primary"
              size="large"
              disabled={updatedLoading}
              loading={updatedLoading}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => handleCustomerDelete(customerToDelete)}
        onCancel={() => {
          setCustomerToDelete("");
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
          Are you sure you want to delete this customer? This action cannot be
          undone.
        </p>
      </Modal>

      {/* change customer status  */}
      <Modal
        title="Confirm Status Change"
        open={changeStatus}
        onOk={() =>
          changeToStatus && handleCustomerChangeStatus(changeToStatus)
        }
        onCancel={() => {
          setChangeToStatus(null);
          setChangeStatus(false);
        }}
        okText={`Yes, ${
          changeToStatus?.status === "ACTIVE" ? "Deactivate" : "Activate"
        }`}
        cancelText="Cancel"
        okButtonProps={{
          danger: changeToStatus?.status === "ACTIVE",
          loading: changeStatusLoading,
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
        centered
      >
        <p>
          Are you sure you want to{" "}
          {changeToStatus?.status === "ACTIVE" ? "deactivate" : "activate"} this
          customer? This action can be reverted later.
        </p>
      </Modal>

      {/* View customer order list components  */}
      <ViewOrders
        showCustomerOrders={showCustomerOrders}
        setShowCustomerOrders={setShowCustomerOrders}
        customerOrders={customerOrders}
        setCustomerOrders={setCustomerOrders}
      />
    </section>
  );
}

export default CustomersPageComponent;
