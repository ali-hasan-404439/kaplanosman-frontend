"use client";
import Loading from "@/components/shared/Loading/Loading";
import {
  useGetPaymentHistoryQuery,
  useGetSingleCompanyQuery,
  useGetUsersByCompanyIdQuery,
} from "@/redux/features/super_admin/superAdmin.api";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserRole = "TECHNICIAN" | "MANAGER" | "COMPANY_ADMIN" | "SUPER_ADMIN"; // etc.
type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED"; // etc.

interface Manager {
  id: string;
  name: string;
}
interface Technician {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  company_admin: any | null;
  manager: Manager | null;
  technician: Technician | null;
}

interface Company {
  id: string;
  companyName: string;
  companyEmail: string;
  logo: string | null;
  companyPhone: string | null;
  generatedCompanyId: string | null;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | string;
  businessAddress?: string;
  companyDescription?: string;
  industry?: string;
  createdAt: string;
  company_admin: {
    id: string;
    name: string;
    userId: string;
  };
}

interface CompanyDetailsProps {
  id: string;
}

// Sample payment data
const paymentHistory: any = [
  {
    id: "1",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "2",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "3",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "4",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "5",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "6",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
  {
    id: "7",
    paymentId: "254524545",
    date: "1/15/2023",
    amount: "$100",
    method: "Credit Card",
  },
];

interface Payment {
  paymentId: string;
  amount: number;
  createdAt: string; // or Date if you parse the ISO string
}

export default function CompanyDetails({ id }: CompanyDetailsProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
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

  const {
    data: responseOfUsers,
    isLoading: isLoadingOfUsers,
    isFetching: isFetchingOfUsers,
  } = useGetUsersByCompanyIdQuery({
    id,
    data: objectQuery,
  });

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetSingleCompanyQuery(id);

  const {
    data: responseOfPaymentHistory,
    isLoading: isLoadingOfPaymentHistory,
    isFetching: isFetchingOfPaymentHistory,
  } = useGetPaymentHistoryQuery(id);

  const paymentHistoryData: Payment[] = responseOfPaymentHistory?.data || [];

  const company: Company = response?.data?.data || {};
  const users: User[] = responseOfUsers?.data || [];

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "TECHNICIAN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-800";
      case "COMPANY_ADMIN":
        return "bg-gray-100 text-gray-800";
      case "SUPER_ADMIN":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const UserAvatar = ({ initials }: { initials: string }) => (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium text-gray-700">{initials}</span>
    </div>
  );

  if (
    isLoading ||
    isFetching ||
    isLoadingOfUsers ||
    isLoadingOfPaymentHistory ||
    isFetchingOfPaymentHistory
  )
    return <Loading />;

  return (
    <div className="min-h-fit">
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Companies
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Company Details Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-primary mb-2">
                Company Details
              </h1>
              <p className="text-sm text-gray-600">
                Basic company information and status
              </p>
            </div>

            <div className="space-y-6">
              {/* Logo */}
              {company?.logo ? (
                <img
                  src={company?.logo}
                  alt="Company Logo"
                  className="h-12 w-12 object-contain rounded-lg"
                />
              ) : (
                <div className="w-fit h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <div className="text-white font-bold text-lg px-5">
                    {company?.companyName?.charAt(0) || "N/A"}
                  </div>
                </div>
              )}

              {/* Company Name */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  {company?.companyName || "N/A"}
                </h2>
                <p className="text-sm text-gray-600">
                  {company?.companyDescription || "N/A"}
                </p>
              </div>

              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {company.status || "N/A"}
                  </span>
                </div>

                {/* <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total Users
                  </span>
                  <span className="text-sm text-primary">55</span>
                </div> */}

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Created
                  </span>
                  <span className="text-sm text-primary">
                    {new Date(company?.createdAt).toDateString()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-primary">
                    {company.companyEmail || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm text-primary">
                    {company.companyPhone || "N/A"}
                  </span>
                </div>

                {/* company location */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-primary">
                    {company.businessAddress || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Payment History
            </h2>

            <div className="overflow-auto h-[400px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Payment ID
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">
                      Method
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                  {paymentHistoryData?.map((payment: Payment) => (
                    <tr key={payment?.paymentId} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-primary">
                        {payment.paymentId}
                      </td>
                      <td className="py-3 text-sm text-primary">
                        {new Date(payment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 text-sm text-primary">
                        ${payment.amount}
                      </td>
                      <td className="py-3 text-sm text-primary">
                        Stripe
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Users List Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Users List ({responseOfUsers?.meta?.total})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    Date Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar initials={user?.company_admin?.name[0]} />
                        <div>
                          <div className="text-sm font-medium text-primary">
                            {user?.manager?.name || user?.technician?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-primary">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 w-full flex justify-center items-center mt-6">
            <Pagination
              current={page}
              pageSize={pageSize}
              // total={20}
              total={responseOfUsers?.meta?.total}
              onChange={handlePaginationChange}
              className="custom-pagination"
              // showSizeChanger
              // pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
