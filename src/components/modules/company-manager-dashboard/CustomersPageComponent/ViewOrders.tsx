import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { useGetCustomerOrderQuery } from "@/redux/features/customer/customerApi";
import { Modal, Pagination } from "antd";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import moment from "moment";
import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";

interface Customer {
  id: string;
  customerName: string;
}
interface Technician {
  id: string;
  name: string;
}
interface Vehicle {
  id: string;
  vehicleModel: string;
  vehicleBrand: string;
}
interface Order {
  id: string;
  createdAt: string;
  generatedOrderId: string;
  customer: Customer;
  technician: Technician;
  vehicle: Vehicle;
  startTime: string;
  orderStatus: string;
}

interface ViewOrdersProps {
  showCustomerOrders: boolean;
  setShowCustomerOrders: (value: boolean) => void;
  customerOrders: string;
  setCustomerOrders: (orders: string) => void;
}

function ViewOrders({
  showCustomerOrders,
  setShowCustomerOrders,
  customerOrders,
  setCustomerOrders,
}: ViewOrdersProps) {
  const headers = [
    "Order ID",
    "Customer",
    "Brand & Model",
    "Technician",
    "Order Date",
    "Time",
    "Status",
  ];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // generatedOrderId,
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const { data, error, isLoading } = useGetCustomerOrderQuery(
    { id: customerOrders, page, limit: pageSize },
    {
      skip: !customerOrders,
    }
  );

  useEffect(() => {
    if (data?.success) {
      const customers = data?.data;
      const pagination = data?.meta;
      setOrderList(customers);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
    if (error) {
      const errMessage =
        (error as any)?.data?.message ||
        "Something went wrong while fetching orders.";
      toast.error(errMessage);
    }
  }, [data, error]);
  return (
    <Modal
      title="Customer Orders"
      open={showCustomerOrders}
      onCancel={() => {
        setShowCustomerOrders(false);
        setCustomerOrders("");
      }}
      footer={null}
      width={1000}
      centered
    >
      <TableComponent headers={headers}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <CustomerRowSkeleton key={idx} headers={headers?.length} />
          ))
        ) : orderList?.length > 0 ? (
          orderList.map((order, index) => (
            <tr
              key={index}
              className={`border-b border-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 text-gray-700">
                {order?.generatedOrderId}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.customer?.customerName}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.vehicle?.vehicleModel}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.technician?.name}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.startTime && moment(order?.startTime).format("L")}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.startTime && moment(order?.startTime).format("h:mm A")}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order?.orderStatus === "COMPLEAT"
                      ? "bg-green-100 text-green-800"
                      : order?.orderStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order?.orderStatus === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order?.orderStatus}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="text-center py-6 text-gray-500"
            >
              No data available
            </td>
          </tr>
        )}
      </TableComponent>
      {orderList?.length > 0 && (
        <div className="p-4 w-full flex justify-center items-center mt-6">
          <Pagination
            current={page}
            pageSize={total?.limit}
            total={total?.total}
            onChange={handlePaginationChange}
            className="custom-pagination"
          />
        </div>
      )}
    </Modal>
  );
}

export default ViewOrders;
