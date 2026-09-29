"use client";

import Loading from "@/components/shared/Loading/Loading";
import { useGetAuditLogsQuery, useGetPaymentHistoryQuery } from "@/redux/features/super_admin/superAdmin.api";
import { DatePicker, Empty, Pagination } from "antd";
import dayjs from "dayjs";
import type React from "react";

import { SetStateAction, useEffect, useState } from "react";
interface TAuditLog {
  id: string;
  action: "SUBSCRIBED" | "UNSUBSCRIBED" | "BLOCKED" | "UNBLOCKED" | "NEW_ORDER";
  createdAt: string; // or Date if you parse the date string
  user: {
    id: string;
    company_admin: {
      name: string;
      company: {
        companyName: string;
      };
    };
  };
}

const actionTypeOptions = [
  { value: "", label: "All Actions" },
  { value: "SUBSCRIBED", label: "Subscribed" },
  { value: "UNSUBSCRIBED", label: "Unsubscribed" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "UNBLOCKED", label: "Unblocked" },
  { value: "NEW_ORDER", label: "New Order" },
];

export default function AdminAudit() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showActionTypeDropdown, setShowActionTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
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
    const newQueries: { name: string; value: any }[] = [
      { name: "page", value: 1 },
      { name: "limit", value: pageSize },
    ];
    if (searchQuery) {
      newQueries.push({ name: "searchTerm", value: searchQuery });
    }
    if (actionTypeFilter) {
      newQueries.push({ name: "action", value: actionTypeFilter });
    }
    if (sortOrder) {
      newQueries.push({ name: "sortOrder", value: sortOrder });
    }
    if (dateFilter) {
      newQueries.push({ name: "createdAt", value: dateFilter });
    }
    setObjectQuery(newQueries);
  }, [searchQuery, actionTypeFilter, sortOrder, dateFilter]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAuditLogsQuery(objectQuery);

  const auditLogsData: TAuditLog[] = response?.data || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Backend search logic would go here
  };

  const handleActionTypeFilterChange = (filter: string) => {
    setActionTypeFilter(filter);
    setShowActionTypeDropdown(false);
    // Backend filter logic would go here
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    setShowSortDropdown(false);
    // Backend sort logic would go here
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case "SUBSCRIBED":
        return "bg-green-100 text-green-800";
      case "UNSUBSCRIBED":
        return "bg-yellow-100 text-yellow-800";
      case "BLOCKED":
        return "bg-red-100 text-red-800";
      case "UNBLOCKED":
        return "bg-blue-100 text-blue-800";
      case "NEW_ORDER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-fit">
      <div className="w-full">
        {/* Filters Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative max-w-md">
            <input
              type="text"
              placeholder="Search User or company"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute cursor-default right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
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

          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center justify-between gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[180px]"
              type="button"
            >
              <span className="text-gray-700">
                {dateFilter === "" ? "Select Date" : dateFilter}
              </span>
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
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                <div>
                  <span className="block mb-2 text-sm text-gray-700">
                    Pick a date
                  </span>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    value={dateFilter !== "" ? dayjs(dateFilter) : null}
                    onChange={(date, dateString) => {
                      setDateFilter(
                        typeof dateString === "string" ? dateString : ""
                      );
                      setShowDateDropdown(false);
                      // Backend filter logic would go here
                    }}
                  />
                </div>
                <button
                  className="mt-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setDateFilter("");
                    setShowDateDropdown(false);
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Action Type Filter */}
          <div className="relative">
            <button
              onClick={() => setShowActionTypeDropdown(!showActionTypeDropdown)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[140px]"
            >
              <span className="text-gray-700">
                {actionTypeOptions?.find(
                  (option) => option.value === actionTypeFilter
                )?.label || "All Actions"}
              </span>
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

            {showActionTypeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {actionTypeOptions?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleActionTypeFilterChange(option.value)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header with Title and Sort */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Activity Logs ({response?.meta?.total})
          </h1>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
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
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              <span className="text-gray-700">{sortOrder || "Sort By"}</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleSortChange("asc")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => handleSortChange("desc")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descending
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {auditLogsData?.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      Description
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {auditLogsData?.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-primary whitespace-pre-line">
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          })}
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4 text-sm font-medium text-primary">
                        {log.user.company_admin.name}
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4 text-sm text-primary">
                        {log?.user?.company_admin?.company?.companyName ||
                          "N/A"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium w-fit ${getActionBadgeColor(
                              log?.action
                            )}`}
                          >
                            {log.action.charAt(0).toUpperCase() +
                              log.action.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-sm text-primary max-w-xs">
                        <div
                          className="truncate"
                          title={`${log.user.company_admin.name} has been ${log.action}`}
                        >
                          {`${log.user.company_admin.name} has been ${log.action}`}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Empty description="No audit logs found." />
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
      {(showDateDropdown || showActionTypeDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowDateDropdown(false);
            setShowActionTypeDropdown(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
}
