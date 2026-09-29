import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import { useGetSupplierArticleQuery } from "@/redux/features/supplier/supplierApi";
import { Modal, Pagination } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Supplier {
  id: string;
  supplierCompanyName: string;
}

interface Article {
  id: string;
  articleName: string;
  modelNumber: string;
  inventoryAmount: number;
  grossAmount: number;
  installationTime: string;
  pricePerUnit: number;
  supplier: Supplier;
  note: string;
}

interface ViewArticleProps {
  showSupplierArticleView: boolean;
  setShowSupplierArticleView: (value: boolean) => void;
  selectSupplierArticleView: string;
  setSelectSupplierArticleView: (articles: string) => void;
}

function SupplierArticle({
  showSupplierArticleView,
  setShowSupplierArticleView,
  selectSupplierArticleView,
  setSelectSupplierArticleView,
}: ViewArticleProps) {
  const headers: string[] = [
    "Article Name",
    "Model Number",
    "Inventory Amount",
    "Gross Amount",
    "Installation Time",
    "Price per Unit",
    "Supplier",
    "Notes",
  ];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [article, setArticle] = useState<Article[]>([]);

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
  const { data, error, isLoading } = useGetSupplierArticleQuery(
    { id: selectSupplierArticleView, page, limit: pageSize },
    {
      skip: !selectSupplierArticleView,
    }
  );

  useEffect(() => {
    if (data?.success) {
      const article = data?.data;
      const pagination = data?.meta;
      setArticle(article);
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
      title="Supplier Articles"
      open={showSupplierArticleView}
      onCancel={() => {
        setShowSupplierArticleView(false);
        setSelectSupplierArticleView("");
        setArticle([])
      }}
      footer={null}
      width={1300}
      centered
    >
      <TableComponent headers={headers}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <CustomerRowSkeleton key={idx} headers={headers?.length} />
          ))
        ) : article?.length > 0 ? (
          article?.map((article, index) => (
            <tr
              key={article?.id}
              className={`border-b border-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 text-gray-700">
                {article?.articleName}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.modelNumber}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.inventoryAmount}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.grossAmount}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.installationTime}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.pricePerUnit}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {article?.supplier?.supplierCompanyName}
              </td>
              <td className="py-3 px-4 text-gray-700">{article?.note}</td>
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
      {article?.length > 0 && (
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

export default SupplierArticle;
