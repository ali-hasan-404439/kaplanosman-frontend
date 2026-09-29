import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { useGetVehicleOrderQuery } from "@/redux/features/vehicle/vehicleApi";
import { Modal, Pagination } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Service {
  serviceName: string;
  serviceCategory: string;
  serviceDescription: string;
  estimatedTime: string;
  servicePrice: number;
  serviceStatus: "ACTIVE" | "INACTIVE"; // optionally enum/string literal
}

interface ServiceData {
  id: string;
  createdAt: string;
  updatedAt: string;
  service: Service;
}

interface ViewOrdersProps {
  showVehiclesOrders: boolean;
  setShowVehiclesOrders: (value: boolean) => void;
  vehiclesOrders: string;
  setVehiclesOrders: React.Dispatch<React.SetStateAction<string>>;
}
function TakenServices({
  showVehiclesOrders,
  setShowVehiclesOrders,
  vehiclesOrders,
  setVehiclesOrders,
}: ViewOrdersProps) {
  const headers = [
    "Service Name",
    "Category",
    "Description",
    "Estimated Time",
    "Price",
    "Status",
  ];

  const [vehiclesTaken, setVehiclesTaken] = useState<ServiceData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const { data, error, isLoading } = useGetVehicleOrderQuery(
    { id: vehiclesOrders, page, limit: pageSize },
    {
      skip: !vehiclesOrders,
    }
  );

  useEffect(() => {
    if (data?.success) {
      const vehicle = data?.data;
      const pagination = data?.meta;
      setVehiclesTaken(vehicle);
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
      title="Taken Services"
      open={showVehiclesOrders}
      onCancel={() => {
        setShowVehiclesOrders(false);
        setVehiclesOrders("");
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
        ) : vehiclesTaken?.length > 0 ? (
          vehiclesTaken.map((order, index) => (
            <tr
              key={order?.id}
              className={`border-b border-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 text-gray-700">
                {order?.service?.serviceName}
              </td>

              <td className="py-4 px-6 text-gray-700">
                {(() => {
                  const raw = order?.service?.serviceCategory;

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
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.service?.serviceDescription}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {order?.service?.estimatedTime}
              </td>
              <td className="py-3 px-4 text-gray-700">
                ${order?.service?.servicePrice}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order?.service?.serviceStatus === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order?.service?.serviceStatus}
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
      {vehiclesTaken?.length > 0 && (
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

export default TakenServices;
