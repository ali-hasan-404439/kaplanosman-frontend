"use client";
import React, { useEffect, useState } from "react";
import { Modal, Pagination, Select } from "antd";
import { MoreVertical, Plus, Search } from "lucide-react";
import { Link } from "next-view-transitions";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetAllOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/order/orderApi";
import moment from "moment";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
export interface Order {
  id: string;
  generatedOrderId: string;
  orderStatus: string;
  source: string;
  price: number;
  startTime: string;
  vehicle: {
    id: string;
    vehicleBrand: string;
    vehicleModel: string;
  };
  technician: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    customerName: string;
  };
}

function OrderPageComponent() {
  const user = useAppSelector(selectCurrentUser);
  const { Option } = Select;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState<
    "PENDING" | "COMPLETED" | "CANCELED" | "WARRANTY_CLAIM" | ""
  >("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmType, setConfirmType] = useState<
    "PENDING" | "COMPLETED" | "CANCELED" | null
  >(null);
  const router = useRouter();

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, id: string) => {
    const targetOrder = ordersData.find((order) => order.id === id);
    if (!targetOrder) return;
    if (action === "Edit") {
      if (user?.role === "COMPANY_ADMIN") {
        router.push(`/company/orders/new_order?id=${id}`);
      } else {
        router.push(`/manager/orders/new_order?id=${id}`);
      }
    }
    if (action === "View order") {
      if (user?.role === "COMPANY_ADMIN") {
        router.push(`/company/orders/${id}`);
      } else {
        router.push(`/manager/orders/${id}`);
      }
    }

    const normalized = action?.toUpperCase();

    if (["PENDING", "COMPLETED", "CANCELED"].includes(normalized)) {
      setSelectedOrder(targetOrder);
      setConfirmType(normalized as "PENDING" | "COMPLETED" | "CANCELED");
    }

    // Handle other actions like view/edit here if needed
    setOpenDropdown(null);
  };

  const handlePaginationChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const headers: string[] = [
    "Order ID",
    "Customer",
    "Brand & Model",
    "Technician",
    "Order Date",
    "Time",
    "Status",
    "Action",
  ];

  const [ordersData, setOrderData] = useState<Order[]>([]);

  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const handleStatusChange = async () => {
    if (!selectedOrder || !confirmType) return;
    try {
      const response = await updateOrderStatus({
        id: selectedOrder?.id,
        formData: { status: confirmType },
      })?.unwrap();
      if (response?.success) {
        toast.success(response?.message || `Order marked as ${confirmType}`);
        setSelectedOrder(null);
        setConfirmType(null);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create vehicle. Please check the form or try again.";
      toast.error(message);
    }
  };

  const { data, error, isLoading } = useGetAllOrderQuery([
    {
      name: "page",
      value: page,
    },
    {
      name: "limit",
      value: pageSize,
    },
    {
      name: "orderStatus",
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
      setOrderData(services);
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
            placeholder="Order id or customer name"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72"
          />
        </div>

        {/* Add Button */}
        <Link
          href={
            user?.role === "COMPANY_ADMIN"
              ? "/company/orders/new_order"
              : "/manager/orders/new_order"
          }
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </Link>
      </div>

      {/* Header with Filter */}
      <div className="flex items-center justify-between space-x-4 pt-10 pb-7">
        <h1 className="text-2xl font-bold text-primary">All Orders</h1>
        <Select
          value={filterValue}
          onChange={(value) =>
            setFilterValue(
              value as
                | "PENDING"
                | "COMPLETED"
                | "CANCELED"
                | "WARRANTY_CLAIM"
                | ""
            )
          }
          style={{ width: 140 }}
          className="h-[42px]"
        >
          <Option value="">Select Status</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELED">Canceled</Option>
          <Option value="WARRANTY_CLAIM">Warranty Claim</Option>
        </Select>
      </div>

      {/* Table Component */}
      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : ordersData.map((order, index) => (
              <tr
                key={order.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6">{order.generatedOrderId}</td>
                <td className="py-4 px-6">{order.customer?.customerName}</td>
                <td className="py-4 px-6">{order.vehicle?.vehicleBrand}</td>
                <td className="py-4 px-6">{order.technician?.name}</td>
                <td className="py-4 px-6">
                  {order.startTime && moment(order.startTime).format("L")}
                </td>
                <td className="py-4 px-6">
                  {order.startTime && moment(order?.startTime).format("h:mm A")}
                </td>
                <td className="py-4 px-6">{order.orderStatus}</td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(order.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openDropdown === order.id && (
                    <div
                      className={`absolute right-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === ordersData.length - 1 ||
                        index === ordersData.length - 2
                          ? "bottom-10"
                          : "top-1"
                      }`}
                    >
                      <button
                        onClick={() => handleAction("PENDING", order.id)}
                        className="w-full text-center px-3 py-2 text-sm hover:bg-gray-50 border-b rounded-t-lg"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleAction("COMPLETED", order.id)}
                        className="w-full text-center px-3 py-2 text-sm hover:bg-gray-50 border-b rounded-t-lg"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleAction("View order", order.id)}
                        className="w-full text-center px-3 py-2 text-sm border-b hover:bg-gray-50"
                      >
                        View order
                      </button>
                      <button
                        onClick={() => handleAction("Edit", order.id)}
                        className="w-full text-center px-3 py-2 text-sm text-blue-600 border-b hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("CANCELED", order.id)}
                        className="w-full text-center px-3 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-b-lg"
                      >
                        Canceled
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
        title={`Confirm ${confirmType?.toLowerCase()}`}
        open={!!selectedOrder}
        onOk={handleStatusChange}
        onCancel={() => {
          setSelectedOrder(null);
          setConfirmType(null);
        }}
        okText={`Yes, Mark as ${confirmType?.toLowerCase()}`}
        okButtonProps={{
          danger: true,
          style: { height: "36px" },
        }}
        cancelButtonProps={{
          style: { height: "36px" },
        }}
        cancelText="Cancel"
        centered
      >
        <p>
          Are you sure you want to mark order as{" "}
          <strong>{confirmType?.toLowerCase()}</strong>?
        </p>
      </Modal>
    </section>
  );
}

export default OrderPageComponent;
