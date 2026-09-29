"use client";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetAllServiceQuery,
  useUpdateServiceMutation,
} from "@/redux/features/service/serviceApi";
import { Button, Form, Input, Modal, Pagination, Select } from "antd";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";

interface ServiceData {
  id?: string;
  companyId: string;
  serviceName: string;
  serviceCategory: string;
  serviceDescription: string;
  estimatedTime: string;
  servicePrice: number;
  orderQuantity?: number;
  serviceStatus: string;
  order?: any[];
}
function ServicesPageComponent() {
  const headers: string[] = [
    "Service Name",
    "Category",
    "Description",
    "Estimated Time",
    "Order",
    "Price",
    "Status",
    "",
  ];

  const user = useAppSelector(selectCurrentUser);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [servicesData, setServicesData] = useState<ServiceData[]>();
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // services edit status
  const [selectServicesEdit, setSelectServicesEdit] =
    useState<ServiceData | null>(null);
  const [showServicesEdit, setShowServicesEdit] = useState<boolean>(false);

  // delete services action state
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [servicesToDelete, setServicesToDelete] = useState<string>("");

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddCategory = () => {
    if (inputValue.trim() && !categoryOptions.includes(inputValue.trim())) {
      setCategoryOptions([...categoryOptions, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategoryOptions(categoryOptions.filter((c) => c !== cat));
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, id: string) => {
    const services = servicesData?.find((s) => s.id === id);
    if (action === "Edit") {
      if (services) {
        setSelectServicesEdit(services);
        setCategoryOptions(JSON.parse(services?.serviceCategory));
        form.setFieldsValue({
          servicesName: services.serviceName,
          category: services.serviceCategory,
          description: services.serviceDescription,
          estimatedInstallationTime: services.estimatedTime,
          prices: Number(services.servicePrice),
          status: services.serviceStatus,
        });
        setShowServicesEdit(true);
      }
    }

    if (action === "Delete") {
      if (services) {
        setServicesToDelete(services?.id ?? "");
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };

  const handleChange = (value: string) => {
    setFilterValue(value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // services create success
  const [createService, { isLoading: createLoading }] =
    useCreateServiceMutation();
  const handleCreateSubmit = async () => {
    try {
      const {
        servicesName,
        description,
        estimatedInstallationTime,
        status,
        prices,
      } = await form.validateFields();

      const newServices: ServiceData = {
        companyId: user?.companyId || "",
        serviceName: servicesName,
        serviceCategory: JSON.stringify(categoryOptions),
        serviceDescription: description,
        estimatedTime: estimatedInstallationTime,
        servicePrice: Number(prices),
        serviceStatus: status,
      };

      const response = await createService(newServices).unwrap(); // ✅ fixed unwrap()

      if (response?.success) {
        toast.success(response?.message || "Service created successfully!");
        setShowCreateModal(false);
        form.resetFields();
        setCategoryOptions([]);
      } else {
        toast.error("Something went wrong while creating the service.");
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create service. Please try again.";
      toast.error(message);
    }
  };

  const [updateService, { isLoading: updatedLoading }] =
    useUpdateServiceMutation();
  const handleEditSubmit = async () => {
    try {
      const {
        servicesName,
        description,
        estimatedInstallationTime,
        status,
        prices,
      } = await form.validateFields();
      if (!selectServicesEdit) return;
      const updatedData = {
        serviceName: servicesName,
        serviceCategory: JSON.stringify(categoryOptions),
        serviceDescription: description,
        estimatedTime: estimatedInstallationTime,
        orderQuantity: servicesName?.orderQuantity,
        servicePrice: Number(prices),
        serviceStatus: status,
      };
      const response = await updateService({
        id: selectServicesEdit?.id,
        formData: updatedData,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Service created successfully!");
        setShowServicesEdit(false);
        setSelectServicesEdit(null);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create service. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [deleteServices, { isLoading: deleteLoading }] =
    useDeleteServiceMutation();
  const handleServiceDelete = async (id: string) => {
    try {
      const response = await deleteServices(id).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Fail to service delete. Please try again"
        );
        setServicesToDelete("");
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create service. Please check the form or try again.";
      toast.error(message);
    }
  };

  const { data, error, isLoading } = useGetAllServiceQuery([
    {
      name: "page",
      value: page,
    },
    {
      name: "limit",
      value: pageSize,
    },
    {
      name: "serviceStatus",
      value: filterValue,
    },
    {
      name: "searchTerm",
      value: searchQuery,
    },
  ]);
  useEffect(() => {
    if (data?.success) {
      const services = data?.data;
      const pagination = data?.meta;
      setServicesData(services);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
  }, [data, error]);
  return (
    <section>
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-5">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services name"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Header with Filter */}
      <div className="flex items-center flex-wrap gap-5 justify-between py-5 sm:pt-10 sm:pb-7">
        <h1 className="text-2xl font-bold text-primary">
          All Services ( {total?.total} )
        </h1>
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
      </div>

      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : servicesData?.map((service, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {service?.serviceName}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  <div className="flex gap-1">
                    {(() => {
                      const raw = service?.serviceCategory;

                      try {
                        const parsed = JSON.parse(raw || "[]");
                        if (Array.isArray(parsed)) {
                          return parsed.map((item: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 bg-gray-100 rounded mr-2"
                            >
                              {item}
                            </span>
                          ));
                        }
                        return <span>{raw}</span>;
                      } catch (e) {
                        return <span>{raw}</span>;
                      }
                    })()}
                  </div>
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {service?.serviceDescription}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {service?.estimatedTime}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {(service?.order?.length ?? 0) > 0 &&
                    (service?.order?.length ?? 0)}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  ${service?.servicePrice}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      service?.serviceStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {service?.serviceStatus}
                  </span>
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(service?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openDropdown === service?.id && (
                    <div
                      className={`absolute right-16 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === servicesData.length - 1
                          ? "bottom-10"
                          : "top-1"
                      }`}
                    >
                      <button
                        onClick={() => handleAction("Edit", service.id ?? "")}
                        className="w-full text-center px-3 py-2 text-sm text-black hover:bg-gray-50 border-b rounded-t-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("View", service.id ?? "")}
                        className="w-full text-center px-3 py-2 text-sm text-[#1570ef] hover:bg-gray-50 border-b "
                      >
                        View Services
                      </button>
                      <button
                        onClick={() => handleAction("Delete", service.id ?? "")}
                        className="w-full text-center px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Delete
                      </button>
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

      <Modal
        title="Create New Services"
        open={showCreateModal}
        onCancel={() => {
          {
            setCategoryOptions([]);
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
            label="Services Name"
            name="servicesName"
            rules={[
              { required: true, message: "Please enter a services name!" },
              { min: 3, message: "customer must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter your services name" className="h-12" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Category
                <span className="block text-gray-400 text-xs font-normal">
                 ( Type a new category and press Enter to add )
                </span>
              </span>
            }
            name="category"
            rules={[
              {
                validator: (_, value) => {
                  if (categoryOptions.length === 0) {
                    return Promise.reject(
                      "Please select or enter at least one category!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="relative h-12 w-full border border-gray-200 rounded-md">
              <div className="w-full h-12 flex items-center gap-2 p-1">
                {categoryOptions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">No categories</div>
                ) : (
                  categoryOptions.map((cat) => (
                    <div
                      key={cat}
                      className="relative px-4 py-2 hover:bg-gray-100 border rounded w-fit"
                    >
                      <span className="font-semibold">{cat}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCategory(cat);
                        }}
                        className="absolute top-0 right-0 w-3 h-3 cursor-pointer bg-red-50 rounded-full p-0 text-red-500 hover:text-red-700 text-sm"
                      >
                        X
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropdown(!showDropdown);
                }}
                className="absolute flex items-center justify-center rounded-md top-0 right-0 text-xl font-bold w-12 h-12 bg-gray-50"
              >
                <Plus />
              </button>
            </div>
            {showDropdown && (
              <Input
                placeholder="Enter new category"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleAddCategory();
                  setShowDropdown(false);
                }}
                className="h-12 pr-10 mt-2"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input placeholder="Enter your description" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Estimated Installation Time"
            name="estimatedInstallationTime"
            rules={[
              {
                required: true,
                message: "Please enter a estimated installation time!",
              },
            ]}
          >
            <Input
              placeholder="Enter your estimated installation time"
              className="h-12"
            />
          </Form.Item>
          <Form.Item
            label="Prices"
            name="prices"
            rules={[{ required: true, message: "Please enter a prices!" }]}
          >
            <Input placeholder="Enter your prices" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status" className="h-12">
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>
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

      <Modal
        title="Edit Services"
        open={showServicesEdit}
        onCancel={() => {
          setShowServicesEdit(false);
          setCategoryOptions([]);
          form.resetFields();
          setSelectServicesEdit(null);
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
            label="Services Name"
            name="servicesName"
            rules={[
              { required: true, message: "Please enter a services name!" },
              {
                min: 3,
                message: "Service name must be at least 3 characters!",
              },
            ]}
          >
            <Input placeholder="Enter service name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                validator: (_, value) => {
                  if (categoryOptions.length === 0) {
                    return Promise.reject(
                      "Please select or enter at least one category!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div className="relative h-12 w-full border border-gray-200 rounded-md">
              <div className="w-full h-12 flex items-center gap-2 p-1">
                {categoryOptions.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">No categories</div>
                ) : (
                  categoryOptions.map((cat) => (
                    <div
                      key={cat}
                      className="relative px-4 py-2 hover:bg-gray-100 border rounded w-fit"
                    >
                      <span className="font-semibold">{cat}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCategory(cat);
                        }}
                        className="absolute top-0 right-0 w-3 h-3 cursor-pointer bg-red-50 rounded-full p-0 text-red-500 hover:text-red-700 text-sm"
                      >
                        X
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropdown(!showDropdown);
                }}
                className="absolute flex items-center justify-center rounded-md top-0 right-0 text-xl font-bold w-12 h-12 bg-gray-50"
              >
                <Plus />
              </button>
            </div>
            {showDropdown && (
              <Input
                placeholder="Enter new category"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleAddCategory();
                }}
                className="h-12 pr-10 mt-2"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input placeholder="Enter description" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Estimated Installation Time"
            name="estimatedInstallationTime"
            rules={[
              {
                required: true,
                message: "Please enter estimated installation time!",
              },
            ]}
          >
            <Input placeholder="e.g. 2 hours" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Prices"
            name="prices"
            rules={[{ required: true, message: "Please enter a price!" }]}
          >
            <Input placeholder="Enter price" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status" className="h-12">
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>
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
        onOk={() => servicesToDelete && handleServiceDelete(servicesToDelete)}
        onCancel={() => {
          setServicesToDelete("");
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
          Are you sure you want to delete this services? This action cannot be
          undone.
        </p>
      </Modal>
    </section>
  );
}

export default ServicesPageComponent;
