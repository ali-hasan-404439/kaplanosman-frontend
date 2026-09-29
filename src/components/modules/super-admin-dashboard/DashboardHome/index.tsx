"use client";

import Loading from "@/components/shared/Loading/Loading";
import {
  useGetAllCompanyQuery,
  useUpdateCompanyStatusMutation,
} from "@/redux/features/super_admin/superAdmin.api";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Empty, Pagination } from "antd";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  companyName: string;
  companyEmail: string;
  logo: string;
  companyPhone: string;
  generatedCompanyId: string;
  company_admin: {
    id: string;
    name: string;
    user: {
      id: string;
      status: "ACTIVE" | "INACTIVE"; // Adjust based on possible status values
    };
  };
};

export default function SuperAdminDashboardHome() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const [objectQuery, setObjectQuery] = useState<
    {
      name: string;
      value: string | number;
    }[]
  >([
    { name: "page", value: page },
    { name: "limit", value: pageSize },
  ]);
  useEffect(() => {
    setObjectQuery([
      { name: "page", value: page },
      { name: "limit", value: pageSize },
    ]);
  }, [page, pageSize]);

  useEffect(() => {
    const newQueries: { name: string; value: string | number }[] = [
      { name: "page", value: page },
      { name: "limit", value: pageSize },
    ];

    if (searchQuery) {
      newQueries.push({ name: "searchTerm", value: searchQuery });
    }
    if (filterValue.trim()) {
      newQueries.push({ name: "status", value: filterValue });
    }

    setObjectQuery(newQueries);
  }, [page, pageSize, searchQuery, filterValue]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCompanyQuery(objectQuery);

  const companies: Company[] = response?.data || [];
  console.log(companies);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Backend search logic would go here
  };

  const handleFilterChange = (filter: string) => {
    setFilterValue(filter);
    setShowFilterDropdown(false);
    // Backend filter logic would go here
  };

  const [updateStatus] = useUpdateCompanyStatusMutation();

  const handleActionClick = async (action: string, companyId: string) => {
    const payload = {
      id: companyId,
      data: {
        status: action,
      },
    };
    await handleAsyncWithToast(async () => {
      return updateStatus(payload);
    }, "Updating Company Status");
    setActiveActionMenu(null);
  };

  const handleRowClick = (companyId: string) => {
    router.push(`/dashboard/company-details/${companyId}`);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-fit">
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search Companies"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Header with Title and Filter */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Company ({response?.meta?.total})
          </h1>

          {/* Filter Dropdown */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-gray-700">Filter</span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleFilterChange("")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("ACTIVE")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleFilterChange("INACTIVE")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Inactive
                  </button>
                </div>
              </div>
            )}
            {/* reset button */}
            <button
              onClick={() => {
                if (searchQuery || filterValue) {
                  setSearchQuery("");
                  setFilterValue("");
                } else {
                  refetch();
                }
              }}
              className="p-1.5 rounded-lg transition-all duration-300 hover:bg-gray-200"
            >
              <RefreshCcw className="text-secondary hover:rotate-12 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Table */}
        {!isFetching && companies?.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Logo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Company Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                  {companies?.map((company: Company) => (
                    <tr
                      key={company?.id}
                      className="hover:bg-gray-50 cursor-default relative"
                    >
                      {/* Logo */}
                      <td className="px-6 py-4">
                        {company?.logo ? (
                          <img
                            src={company?.logo}
                            alt={company?.companyName}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">
                              {company?.companyName?.charAt(0) || "N/A"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Company Name */}
                      <td
                        onClick={() => handleRowClick(company?.id)}
                        className="px-6 py-4 text-sm font-medium text-primary underline cursor-pointer"
                      >
                        {company?.companyName || "N/A"}
                      </td>

                      {/* ID */}
                      <td className="px-6 py-4 text-sm text-primary">
                        {company?.generatedCompanyId || "N/A"}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-primary">
                        {company?.companyEmail || "N/A"}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm text-primary">
                        {company?.companyPhone || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            company?.company_admin?.user?.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {company?.company_admin?.user?.status.charAt(0) +
                            company?.company_admin?.user?.status
                              .slice(1)
                              .toLowerCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(
                                activeActionMenu === company.id
                                  ? null
                                  : company.id
                              );
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>

                          {activeActionMenu === company?.id && (
                            <div
                              className="origin-top-right absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                              style={{
                                position: "fixed",
                                top: "auto",
                                bottom: "auto",
                                left: "auto",
                                right: "20px",
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick("INACTIVE", company?.id);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Inactive
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick("ACTIVE", company?.id);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Active
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
        {isFetching ? (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          ""
        )}
        {!isFetching && companies.length === 0 && (
          <Empty description="No companies found" />
        )}
        {/* Pagination */}
        <div className="p-4 w-full flex justify-center items-center mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            // total={20}
            total={response?.meta?.total}
            onChange={handlePaginationChange}
            className="custom-pagination"
            // showSizeChanger
            // pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showFilterDropdown || activeActionMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowFilterDropdown(false);
            setActiveActionMenu(null);
          }}
        />
      )}
    </div>
  );
}
