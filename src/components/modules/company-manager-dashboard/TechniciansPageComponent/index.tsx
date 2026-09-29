"use client";
import React, { useEffect, useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";
import { Button, Form, Input, Modal, Pagination, Select, Upload } from "antd";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import {
  useCreateTechniciansMutation,
  useGetAllTechniciansQuery,
} from "@/redux/features/technicians/techniciansApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import { toast } from "sonner";
import { Link } from "next-view-transitions";

const { Dragger } = Upload;

interface TechnicianOrder {
  id: string;
}

interface User {
  email: string;
}

interface Technician {
  id?: string;
  generatedTechnicianId?: string | null;
  name: string;
  specialty: string | null;
  phone: string | null;
  user?: User;
  color: string;
  order?: TechnicianOrder[];
  status?: string;
  companyId?: string;
  email?: string;
  password?: string;
  role?: string;
}

function TechniciansPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [techniciansData, setTechniciansData] = useState<Technician[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  // Pagination & dropdown state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headers: string[] = [
    "ID",
    "Name",
    "Specialty",
    "Phone",
    "Email",
    "Jobs done",
    "Status",
    "Actions",
  ];

  const handleChange = (value: string) => setFilterValue(value);

  const handlePaginationChange = (pageNum: number) => {
    setPage(pageNum);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const [createTechnicians, { isLoading: createLoading }] =
    useCreateTechniciansMutation();
  const handleCreateSubmit = async () => {
    if (selectedColor?.trim())
      return toast.error("Technician color must be selected!");
    try {
      const { name, specialty, phone, email, password } =
        await form.validateFields();

      const newTechnician: Technician = {
        companyId: user?.companyId || "",
        name: name,
        email: email,
        password: password,
        specialty: specialty,
        phone: phone,
        role: "TECHNICIAN",
        color: selectedColor,
      };
      const response = await createTechnicians(newTechnician).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "New Technicians created successfully!"
        );
        setShowCreateModal(false);
        form.resetFields();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Fail to create Technicians. Please try again"
      );
    }
  };

  const { data, error, isLoading } = useGetAllTechniciansQuery([
    {
      name: "id",
      value: user?.companyId,
    },
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
      name: "status",
      value: filterValue,
    },
  ]);
  useEffect(() => {
    if (data?.success) {
      const technician = data?.data?.data;
      const pagination = data?.data?.meta;
      setTechniciansData(technician);
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or number"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-color w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technician</span>
        </button>
      </div>

      {/* Header with Filter */}
      <div className="flex flex-wrap items-center justify-between gap-5 py-5">
        <h1 className="text-2xl font-bold text-primary">
          All Technicians ({techniciansData.length})
        </h1>
        <Select
          className="h-[42px] w-full sm:w-[140px]"
          value={filterValue}
          onChange={handleChange}
          options={[
            { value: "", label: "Select Status" },
            { value: "AVAILABLE", label: "Available" },
            { value: "SICK_LEAVE", label: "Sick Leave" },
            { value: "VACATION", label: "Vacation" },
            { value: "CASUAL_LEAVE", label: "Casual leave" },
          ]}
        />
      </div>

      {/* Table */}
      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : techniciansData.map((tech, index) => (
              <tr
                key={tech?.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {tech?.generatedTechnicianId}
                </td>
                <td className="py-4 px-6 text-gray-700">{tech?.name}</td>
                <td className="py-4 px-6 text-gray-700">{tech?.specialty}</td>
                <td className="py-4 px-6 text-gray-700">{tech?.phone}</td>
                <td className="py-4 px-6 text-gray-700">{tech?.user?.email}</td>
                <td className="py-4 px-6 text-gray-700">
                  {tech?.order?.length}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      tech?.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : tech?.status === "UNAVAILABLE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {tech?.status}
                  </span>
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(tech?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openDropdown === tech?.id && (
                    <div
                      className={`absolute right-20 w-36 bg-white border border-gray-200 rounded-md shadow-md z-50 ${
                        index === techniciansData.length - 1
                          ? "bottom-12"
                          : "top-10"
                      }`}
                    >
                      <Link
                        href={
                          user?.role === "COMPANY_ADMIN"
                            ? `/company/technicians/${tech?.id}`
                            : `/manager/technicians/${tech?.id}`
                        }
                        className="block text-center text-sm text-[#1570ef] font-medium py-2 rounded-md hover:bg-gray-50 "
                      >
                        View Profile
                      </Link>
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
      {/* Modal for Add Technician */}
      <Modal
        title="Add New Technician"
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
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter technician name!" },
            ]}
          >
            <div className="flex items-center gap-4">
              <Input placeholder="Enter technician name" className="h-12" />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-12 w-12 appearance-none rounded-md shadow-sm cursor-pointer"
                style={{ padding: 0, background: "none" }}
              />
            </div>
          </Form.Item>

          <Form.Item
            label="Specialty"
            name="specialty"
            rules={[{ required: true, message: "Please select a specialty!" }]}
          >
            <Input placeholder="Enter specialty" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number!" }]}
          >
            <Input placeholder="Enter phone number" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
          >
            <Input placeholder="Enter password" className="h-12" />
          </Form.Item>

          <Form.Item className="mb-0 mt-10">
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
              Add Technician
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default TechniciansPageComponent;
