"use client";
import { useState, useMemo, useEffect } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { Button, Form, Input, Modal, Pagination, Select } from "antd";
import { toast } from "sonner";
import SupplierArticle from "./SupplierArticle";
import {
  useCreateSupplierMutation,
  useGetAllSupplierQuery,
  useUpdateSupplierMutation,
} from "@/redux/features/supplier/supplierApi";
import moment from "moment";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface Supplier {
  id?: string;
  supplierCompanyName: string;
  contactPerson: string;
  supplierEmail: string;
  supplierPhone: string;
  createdAt?: string;
  quantity?: number;
  pricePerUnit?: number;
  companyId?: string;
}

export interface Article {
  id: number;
  supplier_id: number;
  article_name: string;
  model_number: string;
  inventory_amount: number;
  gross_amount: number;
  installation_time: string;
  price_per_unit: number;
  supplier: string;
  notes: string;
}

function SuppliersPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // View article edit status
  const [selectSupplierArticleView, setSelectSupplierArticleView] =
    useState<string>("");
  const [showSupplierArticleView, setShowSupplierArticleView] =
    useState<boolean>(false);
  // services edit status
  const [selectSupplierEdit, setSelectSupplierEdit] = useState<Supplier | null>(
    null
  );
  const [showSupplierEdit, setShowSupplierEdit] = useState<boolean>(false);

  // delete services action state
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [servicesToDelete, setServicesToDelete] = useState<Supplier | null>(
    null
  );

  const headers: string[] = [
    "Company Name",
    "Contact Person",
    "Email",
    "Phone",
    "Registered at",
    "",
  ];

  const [suppliersData, setSuppliersData] = useState<Supplier[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  const handlePaginationChange = (newPage: number) => setPage(newPage);

  const handleDropdownToggle = (id: string) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  const handleAction = (action: string, id: string) => {
    const suppliers = suppliersData.find((s) => s.id === id);
    if (action === "View Articles") {
      if (suppliers) {
        setShowSupplierArticleView(true);
        setSelectSupplierArticleView(suppliers?.id ?? "");
      }
    }
    if (action === "Edit") {
      if (suppliers) {
        setSelectSupplierEdit(suppliers);
        form.setFieldsValue({
          companyName: suppliers?.supplierCompanyName,
          contactPerson: suppliers?.contactPerson,
          email: suppliers?.supplierEmail,
          phone: suppliers?.supplierPhone,
          quantity: suppliers?.quantity,
          price_per_unit: suppliers?.pricePerUnit,
        });
        setShowSupplierEdit(true);
      }
    }
    if (action === "Delete") {
      const toDelete = suppliersData.find((supplier) => supplier.id === id);
      if (toDelete) {
        setServicesToDelete(toDelete);
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };
  const [createSupplier, { isLoading: createLoading }] =
    useCreateSupplierMutation();
  const handleCreateSubmit = async () => {
    try {
      const {
        companyName,
        contactPerson,
        email,
        phone,
        quantity,
        price_per_unit,
      } = await form.validateFields();

      const newSupplier: Supplier = {
        companyId: user?.companyId || "",
        supplierCompanyName: companyName,
        contactPerson: contactPerson,
        supplierEmail: email,
        supplierPhone: phone,
        quantity: Number(quantity),
        pricePerUnit: Number(price_per_unit),
      };
      const response = await createSupplier(newSupplier)?.unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "New supplier created successfully!"
        );
        setShowCreateModal(false);
        form.resetFields();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Fail to create supplier. Please try again"
      );
    }
  };

  const [updateSupplier, { isLoading: updatedLoading }] =
    useUpdateSupplierMutation();

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectSupplierEdit) return;

      const payload = {
        id: selectSupplierEdit?.id,
        formData: {
          supplierCompanyName: values.companyName,
          contactPerson: values.contactPerson,
          supplierEmail: values.email,
          supplierPhone: values.phone,
          quantity: Number(values.quantity),
          pricePerUnit: Number(values.price_per_unit),
        },
      };

      const response = await updateSupplier(payload).unwrap();

      if (response?.success) {
        toast.success(response.message || "Supplier updated successfully!");
        setSelectSupplierEdit(null);
        setShowSupplierEdit(false);
        form.resetFields();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update supplier. Please try again."
      );
    }
  };

  const { data, error, isLoading } = useGetAllSupplierQuery([
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
  ]);
  useEffect(() => {
    if (data?.success) {
      const suppliers = data?.data;
      const pagination = data?.meta;
      setSuppliersData(suppliers);
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search person or company..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      <div className="flex items-center justify-between pt-10 pb-7">
        <h1 className="text-2xl font-bold text-primary">All Supplier List</h1>
      </div>

      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : suppliersData.map((supplier, index) => (
              <tr
                key={supplier?.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {supplier?.supplierCompanyName}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {supplier?.contactPerson}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {supplier?.supplierEmail}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {supplier?.supplierPhone}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {supplier?.createdAt &&
                    moment(supplier?.createdAt).format("L")}
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(supplier?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdown === supplier.id && (
                    <div
                      className={`absolute right-16 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === suppliersData?.length - 1
                          ? "bottom-10"
                          : "top-1"
                      }`}
                    >
                      <button
                        onClick={() => handleAction("Edit", supplier.id ?? "")}
                        className="w-full text-center px-3 py-2 text-sm hover:bg-gray-50 border-b rounded-t-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleAction("View Articles", supplier.id ?? "")
                        }
                        className="w-full text-center px-3 py-2 text-sm text-blue-600 border-b hover:bg-gray-50"
                      >
                        View Articles
                      </button>
                      <button
                        onClick={() =>
                          handleAction("Delete", supplier.id ?? "")
                        }
                        className="w-full text-center px-3 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-b-lg"
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

      {/* add supplier modal  */}
      <Modal
        title="Create New Supplier"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
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
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please enter a company name!" },
              {
                min: 3,
                message: "Company name must be at least 3 characters!",
              },
            ]}
          >
            <Input placeholder="Enter company name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Contact Person"
            name="contactPerson"
            rules={[
              { required: true, message: "Please enter a contact person!" },
            ]}
          >
            <Input placeholder="Enter contact person" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter a phone number!" },
            ]}
          >
            <Input placeholder="Enter phone" className="h-12" />
          </Form.Item>
          {/* 
          <Form.Item
            label="Articles"
            name="articles"
            rules={[{ required: true, message: "Please select articles!" }]}
          >
            <Select placeholder="Select article" className="h-12">
              {categoryOptions.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input
              type="number"
              placeholder="Enter quantity"
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            label="Price Per Unit"
            name="price_per_unit"
            rules={[
              { required: true, message: "Please enter price per unit!" },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter price per unit"
              className="h-12"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                createLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              size="large"
              disabled={createLoading}
              loading={createLoading}
            >
              Add Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* edit supplier modal  */}
      <Modal
        title="Edit Supplier"
        open={showSupplierEdit}
        onCancel={() => {
          setShowSupplierEdit(false);
          setSelectSupplierEdit(null);
          form.resetFields();
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
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please enter a company name!" },
              {
                min: 3,
                message: "Company name must be at least 3 characters!",
              },
            ]}
          >
            <Input placeholder="Enter company name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Contact Person"
            name="contactPerson"
            rules={[
              { required: true, message: "Please enter a contact person!" },
            ]}
          >
            <Input placeholder="Enter contact person" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter a phone number!" },
            ]}
          >
            <Input placeholder="Enter phone" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input
              type="number"
              placeholder="Enter quantity"
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            label="Price Per Unit"
            name="price_per_unit"
            rules={[
              { required: true, message: "Please enter price per unit!" },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter price per unit"
              className="h-12"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                updatedLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              size="large"
              disabled={updatedLoading}
              loading={updatedLoading}
            >
              Add Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => {
          if (servicesToDelete) {
            setSuppliersData((prev) =>
              prev.filter((c) => c.id !== servicesToDelete.id)
            );
            toast.success("Supplier deleted successfully!");
            setServicesToDelete(null);
            setDeleteModalVisible(false);
          }
        }}
        onCancel={() => {
          setServicesToDelete(null);
          setDeleteModalVisible(false);
        }}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>
          Are you sure you want to delete this supplier? This action cannot be
          undone.
        </p>
      </Modal>

  <SupplierArticle
        showSupplierArticleView={showSupplierArticleView}
        setShowSupplierArticleView={setShowSupplierArticleView}
        setSelectSupplierArticleView={setSelectSupplierArticleView}
        selectSupplierArticleView={selectSupplierArticleView}
      />
    </section>
  );
}
export default SuppliersPageComponent;
