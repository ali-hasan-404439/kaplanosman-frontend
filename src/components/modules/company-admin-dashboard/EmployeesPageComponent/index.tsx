"use client";

import TableComponent from "@/components/ui/TableComponent/TableComponent";
import {
  useCreateEmployeesMutation,
  useGetAllEmployeesQuery,
  useUpdateEmployeesMutation,
} from "@/redux/features/employees/employeesApi";
import { Pagination, Select, Avatar, Modal, Form, Input, Button } from "antd";
import { Plus, Search, MoreVertical } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";

type UserProfile = {
  id: string;
  name: string;
  phone: string;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt: string;
  color: string;
  specialty: string;
};

type User = {
  id: string;
  email: string;
  role: "TECHNICIAN" | string;
  status: "ACTIVE" | "INACTIVE" | string;
  provider: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
  manager: UserProfile | null;
  technician: UserProfile | null;
};

function EmployeesPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [changeStatus, setChangeStatus] = useState<User | null>(null);
  const [showChangeStatus, setShowChangeStatus] = useState<boolean>(false);

  const [selectedRole, setSelectedRole] = useState<string>("");

  const headers: string[] = [
    "User",
    "Role",
    "Status",
    "Date Joined",
    "Phone",
    "Action",
  ];

  const [userData, setUserData] = useState<User[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  const handlePaginationChange = (page: number) => setPage(page);

  const handleAction = (action: string, id: string) => {
    const user = userData.find((u) => u.id === id);
    if (!user) return;

    if (action === "Inactive") {
      setShowChangeStatus(true);
      setChangeStatus(user);
    }
    setOpenDropdown("");
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? "" : id));
  };

  const [createEmployees, { isLoading: loadingEmployees }] =
    useCreateEmployeesMutation();

  const handleCreateSubmit = async (values: any) => {
    const { name, email_address, phone, role, specialty, password } = values;
    try {
      const newUser = {
        companyId: user?.companyId,
        name: name,
        email: email_address,
        phone: phone,
        password: password,
        specialty: specialty,
        color: role === "TECHNICIAN" ? selectedColor : "",
        role: role,
      };
      const response = await createEmployees(newUser).unwrap();
      if (response?.success) {
        toast.success(response?.message || "New user employees successfully!");
        setShowCreateModal(false);
        form.resetFields();
        setSelectedRole("")
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Fail to create employees");
    }
  };

  const [updateEmployees] = useUpdateEmployeesMutation();
  const handleUserChangeStatus = async (employees: User) => {
    try {
      const response = await updateEmployees({
        id: employees?.id,
        formData: { status: "INACTIVE" },
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "User status change successful!");
        setShowChangeStatus(false);
        setChangeStatus(null);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Fail to change status. Please try again"
      );
    }
  };

  const { data, isLoading } = useGetAllEmployeesQuery({
    id: user?.companyId,
    data: [
      { name: "page", value: page },
      { name: "limit", value: pageSize },
      { name: "searchTerm", value: searchQuery },
      { name: "role", value: filterValue },
      { name: "status", value: status },
    ],
  });

  useEffect(() => {
    if (data?.success && data.data && data.meta) {
      const { data: employees, meta: pagination } = data;

      setUserData(employees);

      setTotal({
        total: pagination.total ?? 0,
        totalPages: pagination.totalPages ?? 0,
        limit: pagination.limit ?? 0,
      });
    }
  }, [data]);

  return (
    <section>
      <h1 className="text-xl font-bold mb-1">User Management</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage company users, roles, and permissions
      </p>

      <div className="flex flex-wrap items-start justify-between gap-5 py-7">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent  w-full sm:w-64"
            />
          </div>

          <Select
            value={filterValue}
            onChange={(value: string) => setFilterValue(value)}
            className="h-[42px] w-full sm:w-[150px]"
            options={[
              { value: "", label: "Select Role" },
              { value: "MANAGER", label: "Manager" },
              { value: "TECHNICIAN", label: "Technician" },
            ]}
          />

          <Select
            value={status}
            onChange={(value: string) => setStatus(value)}
            className="h-[42px] w-full sm:w-[150px]"
            options={[
              { value: "", label: "Select Status" },
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
          />
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
          }}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : userData?.map((user) => (
              <tr
                key={user?.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6 flex items-center gap-3">
                  <Avatar src={user?.profile?.profilePhoto} size={32} />
                  <div>
                    <div className="font-medium">{user?.profile?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white font-medium ${
                      user?.role === "TECHNICIAN"
                        ? "bg-blue-600"
                        : user?.role === "MANAGER"
                        ? "bg-yellow-600"
                        : user?.role === "ADMIN"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {user?.role}
                  </span>
                </td>
                <td className="py-3 px-6 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user?.status}
                  </span>
                </td>
                <td className="py-3 px-6">
                  {user?.createdAt && moment(user?.createdAt).format("l")}
                </td>
                <td className="py-3 px-6">{user?.profile?.phone}</td>
                <td className="py-3 px-6 relative w-[60px]">
                  <button
                    onClick={() => handleDropdownToggle(user?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdown === user?.id && (
                    <div
                      className={`absolute right-[70px] top-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-40`}
                    >
                      <button
                        onClick={() => handleAction("Inactive", user?.id)}
                        className="w-full px-4 py-2 text-sm hover:bg-gray-50 border-b"
                      >
                        Inactive
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
          total={total?.totalPages}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>

      <Modal
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          form.resetFields();
          setSelectedRole('')
        }}
        footer={null}
        width={600}
        centered
      >
        <div>
          <h1 className="text-xl font-bold mb-1">Add New User</h1>
          <p>Send an invitation to a new user to join your company.</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          className="mt-4"
        >
          <div className="flex items-center gap-4">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter name!" }]}
              className="w-full"
            >
              <Input placeholder="Enter name" className="h-12 w-full" />
            </Form.Item>

            {selectedRole === "TECHNICIAN" && (
              <div className="pt-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="h-12 w-12 appearance-none rounded-md shadow-sm cursor-pointer"
                  style={{ padding: 0, background: "none" }}
                />
              </div>
            )}
          </div>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number!" }]}
          >
            <Input placeholder="Enter phone number" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email_address"
            rules={[{ required: true, message: "Please enter email address!" }]}
          >
            <Input placeholder="Enter email address" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter password" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              placeholder="Select role"
              className="h-12"
              onChange={(value) => setSelectedRole(value)}
            >
              {[
                { value: "MANAGER", label: "Manager" },
                { value: "TECHNICIAN", label: "Technician" },
              ].map((cat) => (
                <Select.Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRole === "TECHNICIAN" && (
            <Form.Item
              label="Specialty"
              name="specialty"
              rules={[{ required: true, message: "Please enter specialty!" }]}
            >
              <Input placeholder="Enter specialty" className="h-12" />
            </Form.Item>
          )}

          <Form.Item className="mb-0 mt-10">
            <div className="flex gap-4">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="w-full h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={`w-full h-12 bg-primary hover:bg-gray-800 border-primary ${
                  loadingEmployees ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                size="large"
                disabled={loadingEmployees}
                loading={isLoading}
              >
                Add Now
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Status Change"
        open={showChangeStatus}
        onOk={() => changeStatus && handleUserChangeStatus(changeStatus)}
        onCancel={() => {
          setShowChangeStatus(false);
          setChangeStatus(null);
        }}
        okText={`Yes, Inactive`}
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
        centered
      >
        <p>
          Are you sure you want to mark this user as completed ? You can revert
          this action later if needed.
        </p>
      </Modal>
    </section>
  );
}

export default EmployeesPageComponent;
