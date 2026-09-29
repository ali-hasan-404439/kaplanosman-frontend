"use client";

import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { Button, Form, Input, Modal, Pagination, Select } from "antd";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TakenServices from "./TakenServices";
import {
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useGetAllVehicleQuery,
} from "@/redux/features/vehicle/vehicleApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import moment from "moment";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";

interface Order {
  id: string;
  createdAt: string;
}

interface Vehicles {
  id?: string;
  vehicleName: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: number;
  order?: Order[];
  vehicleStatus?: string;
  companyId?: string;
  vehicleChassisNumber?: string;
  mileage?: string;
}

function VehiclesPageComponent() {
  const headers: string[] = [
    "Name",
    "Brand",
    "Model",
    "Plate",
    "Service",
    "Last Services",
    "Status",
    "",
  ];

  const user = useAppSelector(selectCurrentUser);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // delete services action state
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [vehiclesToDelete, setVehiclesToDelete] = useState<string>("");

  const brandOptions = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Audi",
    "Nissan",
    "Hyundai",
    "Kia",
    "Chevrolet",
    "Mazda",
  ];

  const [vehiclesData, setVehiclesDate] = useState<Vehicles[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });

  const [showVehiclesOrders, setShowVehiclesOrders] = useState<boolean>(false);
  const [vehiclesOrders, setVehiclesOrders] = useState<string>("");
  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, id: string) => {
    const vehicle = vehiclesData?.find((vehicles) => vehicles?.id === id);
    if (action === "Taken Services") {
      if (vehicle) {
        setVehiclesOrders(vehicle?.id ?? "");
        setShowVehiclesOrders(true);
      }
    }
    if (action === "Delete") {
      if (vehicle) {
        setVehiclesToDelete(vehicle?.id ?? "");
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };

  const handlePaginationChange = (page: number) => {
    setPage(page);
  };

  const handleChange = (value: string) => {
    setFilterValue(value);
  };

  const [createVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields();

      const newVehicle: Vehicles = {
        companyId: user?.companyId,
        vehicleName: values?.name,
        vehicleBrand: values?.brand,
        vehicleModel: values.model,
        vehiclePlate: values.license_plate,
        vehicleChassisNumber: values.chassis_number,
        mileage: values.mileage,
      };
      const response = await createVehicle(newVehicle)?.unwrap();
      if (response?.success) {
        toast.success(response?.message || "New vehicle created successfully!");
        setShowCreateModal(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create vehicle. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [deleteVehicle, { isLoading: deleteLoading }] =
    useDeleteVehicleMutation();

  const handleVehiclesDelete = async (id: string) => {
    try {
      const response = await deleteVehicle(id).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Fail to vehicle delete. Please try again"
        );
        setVehiclesToDelete("");
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create vehicle. Please check the form or try again.";
      toast.error(message);
    }
  };
  const { data, error, isLoading } = useGetAllVehicleQuery([
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
      name: "vehicleStatus",
      value: filterValue,
    },
  ]);
  // const { data: supplier } = useGetAllDropdownQuery(undefined);

  useEffect(() => {
    if (data?.success) {
      const vehicle = data?.data;
      const pagination = data?.meta;
      setVehiclesDate(vehicle);
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
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, brand or model"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-5 items-center justify-between py-5 sm:pt-10 sm:pb-7">
        <h1 className="text-2xl font-bold text-primary">
          All Vehicles List ({total?.total})
        </h1>
        <Select
          className="h-[42px] w-full sm:w-[130px]"
          value={filterValue}
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
          : vehiclesData.map((vehicle, index) => (
              <tr
                key={vehicle?.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {vehicle?.vehicleName}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {vehicle?.vehicleBrand}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {vehicle?.vehicleModel}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {vehicle?.vehiclePlate}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {Array.isArray(vehicle?.order) &&
                    vehicle.order.length > 0 &&
                    vehicle.order.length}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {Array.isArray(vehicle?.order) &&
                    vehicle.order.length > 0 &&
                    moment(vehicle.order[0]?.createdAt).format("L")}
                </td>

                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      vehicle?.vehicleStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {vehicle?.vehicleStatus}
                  </span>
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(vehicle?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openDropdown === vehicle?.id && (
                    <div
                      className={`absolute right-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === vehiclesData.length - 1
                          ? "bottom-10"
                          : "top-8"
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleAction("Taken Services", vehicle?.id ?? "")
                        }
                        className="w-full text-center px-3 py-2 text-sm text-[#1570ef] hover:bg-gray-50 border-b"
                      >
                        Taken Services
                      </button>
                      <button
                        onClick={() =>
                          handleAction("Delete", vehicle?.id ?? "  ")
                        }
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
        title="Create New Vehicle"
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name!" }]}
          >
            <Input placeholder="Enter your name" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please enter a brand!" }]}
          >
            <Input placeholder="Enter your brand" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: "Please enter a model!" }]}
          >
            <Input placeholder="Enter your model" className="h-12" />
          </Form.Item>

          <Form.Item
            label="License Plate"
            name="license_plate"
            rules={[
              { required: true, message: "Please enter a license plate!" },
            ]}
          >
            <Input placeholder="Enter your license plate" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Mileage"
            name="mileage"
            rules={[
              {
                required: true,
                message: "Please enter a mileage!",
              },
            ]}
          >
            <Input placeholder="Enter your mileage" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Chassis Number"
            name="chassis_number"
            rules={[
              { required: true, message: "Please enter a chassis number!" },
            ]}
          >
            <Input placeholder="Enter your chassis number" className="h-12" />
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
              Done
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => vehiclesToDelete && handleVehiclesDelete(vehiclesToDelete)}
        onCancel={() => {
          setVehiclesToDelete("");
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
          Are you sure you want to delete this vehicles? This action cannot be
          undone.
        </p>
      </Modal>
      <TakenServices
        showVehiclesOrders={showVehiclesOrders}
        setShowVehiclesOrders={setShowVehiclesOrders}
        vehiclesOrders={vehiclesOrders}
        setVehiclesOrders={setVehiclesOrders}
      />
    </section>
  );
}

export default VehiclesPageComponent;
