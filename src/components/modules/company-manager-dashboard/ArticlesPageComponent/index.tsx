"use client";

import CustomerRowSkeleton from "@/components/ui/CustomerRowSkeleton/CustomerRowSkeleton";
import TableComponent from "@/components/ui/TableComponent/TableComponent";
import {
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useGetAllArticleQuery,
  useGetAllDropdownQuery,
  useUpdateArticleMutation,
} from "@/redux/features/article/articleApi";
import { Button, Form, Input, Modal, Pagination, Select } from "antd";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface Article {
  id?: string;
  companyId?: string;
  articleName: string;
  inventoryAmount: number;
  grossAmount: number;
  installationTime?: string;
  pricePerUnit: number;
  supplier?: any;
  supplierId?: string;
  note: string;
  modelNumber: string;
}
interface Supplier {
  id: string;
  supplierCompanyName: string;
}

function ArticlesPageComponent() {
  const headers: string[] = [
    "Article Name",
    "Model Number",
    "Inventory amount",
    "Gross amount",
    "Installation time",
    "Price per Unit",
    "Supplier",
    "Notes",
    "",
  ];
  const user = useAppSelector(selectCurrentUser);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [articleData, setArticleData] = useState<Article[]>([]);
  const [supplierData, setSupplierData] = useState<Supplier[]>([]);
  const [total, setTotal] = useState<{
    total: number;
    totalPages: number;
    limit: number;
  }>({
    total: 0,
    totalPages: 0,
    limit: 0,
  });
  // edit article action state
  const [selectArticleEdit, setSelectArticleEdit] = useState<Article | null>(
    null
  );
  const [showArticleEdit, setShowArticleEdit] = useState<boolean>(false);
  // delete article action state
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<string>("");

  const handlePaginationChange = (page: number) => {
    setPage(page);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleAction = (action: string, id: string) => {
    const article = articleData.find((s) => s.id === id);
    if (action === "Edit") {
      if (article) {
        setSelectArticleEdit(article);
        form.setFieldsValue({
          article_name: article?.articleName,
          model_number: article?.modelNumber,
          inventory_amount: article?.inventoryAmount,
          gross_amount: article?.grossAmount,
          price_per_unit: article?.pricePerUnit,
          supplier: article?.supplier?.id,
          note: article?.note,
          installationTime: article?.installationTime,
        });
        setShowArticleEdit(true);
      }
    } else if (action === "Delete") {
      if (article) {
        setArticleToDelete(article?.id || "");
        setDeleteModalVisible(true);
      }
    }
    setOpenDropdown(null);
  };
  const [createArticle,{isLoading: createLoading}] = useCreateArticleMutation();
  const handleCreateSubmit = async () => {
    try {
      const {
        article_name,
        gross_amount,
        inventory_amount,
        model_number,
        note,
        price_per_unit,
        supplier,
        installationTime,
      } = await form.validateFields();
      const newArticle: Article = {
        companyId: user?.companyId,
        supplierId: supplier,
        articleName: article_name,
        modelNumber: model_number,
        inventoryAmount: Number(inventory_amount),
        grossAmount: Number(gross_amount),
        installationTime: installationTime,
        pricePerUnit: Number(price_per_unit),
        note: note,
      };
      const response = await createArticle(newArticle).unwrap();
      if (response?.success) {
        toast.success(response?.message || "New article created successfully!");
        setShowCreateModal(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create article. Please check the form or try again.";
      toast.error(message);
    }
  };
  const [updateArticle, { isLoading: updatedLoading }] =
    useUpdateArticleMutation();
  const handleEditSubmit = async () => {
    try {
      const {
        article_name,
        gross_amount,
        inventory_amount,
        model_number,
        note,
        price_per_unit,
        supplier,
        installationTime,
      } = await form.validateFields();
      const newArticle: Article = {
        companyId: user?.companyId,
        supplierId: supplier,
        articleName: article_name,
        modelNumber: model_number,
        inventoryAmount: Number(inventory_amount),
        grossAmount: Number(gross_amount),
        installationTime: installationTime,
        pricePerUnit: Number(price_per_unit),
        note: note,
      };
      const response = await updateArticle({
        id: selectArticleEdit?.id,
        formData: newArticle,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Article updated successfully!");
        setShowArticleEdit(false);
        setSelectArticleEdit(null);
        form.resetFields();
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create article. Please check the form or try again.";
      toast.error(message);
    }
  };

  const [deleteArticle, { isLoading: deleteLoading }] =
    useDeleteArticleMutation();
  const handleArticleDelete = async (id: string) => {
    try {
      const response = await deleteArticle(id).unwrap();
      if (response?.success) {
        toast.success(
          response?.message || "Fail to article delete. Please try again"
        );
        setArticleToDelete("");
        setDeleteModalVisible(false);
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to create article. Please check the form or try again.";
      toast.error(message);
    }
  };
  const { data, error, isLoading } = useGetAllArticleQuery([
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
  const { data: supplier } = useGetAllDropdownQuery({
    page: 1,
    limit: 1000
  });

  useEffect(() => {
    if (data?.success) {
      const customers = data?.data;
      const pagination = data?.meta;
      setArticleData(customers);
      setTotal({
        total: pagination?.total,
        totalPages: pagination?.totalPages,
        limit: pagination?.limit,
      });
    }
    if (supplier) {
      setSupplierData(supplier?.data);
    }
  }, [data, error, supplier]);

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
            placeholder="Search name or model number"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      <div className="flex items-center justify-between py-5 sm:pt-10 sm:pb-7">
        <h1 className="text-2xl font-bold text-primary">
          All Article List ({total?.total})
        </h1>
      </div>

      <TableComponent headers={headers}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <CustomerRowSkeleton key={idx} headers={headers?.length} />
            ))
          : articleData.map((article, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 text-gray-700">
                  {article?.articleName}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {article?.modelNumber}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {article?.inventoryAmount}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  ${article?.grossAmount}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {article?.installationTime}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  ${article?.pricePerUnit}
                </td>
                <td className="py-4 px-6 text-gray-700">
                  {article?.supplier?.contactPerson}
                </td>
                <td className="py-4 px-6 text-gray-700">{article?.note}</td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => handleDropdownToggle(article?.id ?? "")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openDropdown === article.id && (
                    <div
                      className={`absolute right-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32 ${
                        index === articleData.length - 1
                          ? "bottom-10"
                          : "top-10"
                      }`}
                    >
                      <button
                        onClick={() => handleAction("Edit", article.id ?? "")}
                        className="w-full text-center px-3 py-2 text-sm text-black hover:bg-gray-50 border-b rounded-t-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("Delete", article.id ?? "")}
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
        title="Create New Article"
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
            label="Article Name"
            name="article_name"
            rules={[
              { required: true, message: "Please enter a article name!" },
              { min: 3, message: "customer must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter your article name" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Model Number"
            name="model_number"
            rules={[
              { required: true, message: "Please enter a model number!" },
            ]}
          >
            <Input placeholder="Enter your model number" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Inventory Amount"
            name="inventory_amount"
            rules={[
              { required: true, message: "Please enter a inventory amount!" },
            ]}
          >
            <Input placeholder="Enter your inventory amount" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Gross Amount"
            name="gross_amount"
            rules={[
              {
                required: true,
                message: "Please enter a estimated gross amount!",
              },
            ]}
          >
            <Input placeholder="Enter your gross amount" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Price Per Unit"
            name="price_per_unit"
            rules={[
              { required: true, message: "Please enter a price per unit!" },
            ]}
          >
            <Input placeholder="Enter your price per unit" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Installation Time"
            name="installationTime"
            rules={[
              {
                required: true,
                message: "Please enter a estimated installation time!",
              },
            ]}
          >
            <Input
              placeholder="Enter your installation time"
              className="h-12"
            />
          </Form.Item>
          <Form.Item
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: "Please select a supplier!" }]}
          >
            <Select placeholder="Enter your supplier" className="h-12">
              {supplierData?.map((item) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.supplierCompanyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Note"
            name="note"
            rules={[{ required: true, message: "Please select a note!" }]}
          >
            <Input placeholder="Enter your note" className="h-12" />
          </Form.Item>
          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-primary hover:bg-gray-800 border-primary"
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
        title="Edit Article"
        open={showArticleEdit}
        onCancel={() => {
          form.resetFields();
          setShowArticleEdit(false);
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
            label="Article Name"
            name="article_name"
            rules={[
              { required: true, message: "Please enter a article name!" },
              { min: 3, message: "customer must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter your article name" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Model Number"
            name="model_number"
            rules={[
              { required: true, message: "Please enter a model number!" },
            ]}
          >
            <Input placeholder="Enter your model number" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Inventory Amount"
            name="inventory_amount"
            rules={[
              { required: true, message: "Please enter a inventory amount!" },
            ]}
          >
            <Input placeholder="Enter your inventory amount" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Gross Amount"
            name="gross_amount"
            rules={[
              {
                required: true,
                message: "Please enter a estimated gross amount!",
              },
            ]}
          >
            <Input placeholder="Enter your gross amount" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Price Per Unit"
            name="price_per_unit"
            rules={[
              { required: true, message: "Please enter a price per unit!" },
            ]}
          >
            <Input placeholder="Enter your price per unit" className="h-12" />
          </Form.Item>
          <Form.Item
            label="Installation Time"
            name="installationTime"
            rules={[
              {
                required: true,
                message: "Please enter a estimated installation time!",
              },
            ]}
          >
            <Input
              placeholder="Enter your installation time"
              className="h-12"
            />
          </Form.Item>

          <Form.Item
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: "Please select a supplier!" }]}
          >
            <Select placeholder="Enter your supplier" className="h-12">
              {supplierData?.map((item) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.supplierCompanyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Note"
            name="note"
            rules={[{ required: true, message: "Please select a note!" }]}
          >
            <Input placeholder="Enter your note" className="h-12" />
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
        onOk={() => articleToDelete && handleArticleDelete(articleToDelete)}
        onCancel={() => {
          setArticleToDelete("");
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
          Are you sure you want to delete this article? This action cannot be
          undone.
        </p>
      </Modal>
    </section>
  );
}

export default ArticlesPageComponent;
