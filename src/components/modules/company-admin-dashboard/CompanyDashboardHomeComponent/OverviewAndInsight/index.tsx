"use client";

import { kpiData } from "@/lib/fakedata/kpiData";
import { Modal, Select } from "antd";
import { Calendar } from "lucide-react";
import moment from "moment";
import { useState } from "react";
interface CardsOverview {
  totalOrder: number;
  totalRevenue: number;
  totalTechnician: number;
  totalCustomer: number;
  totalPendingOrder: number;
}
type KpiData = {
  day: string;
  total: number;
  GARAGE: number;
  CAR_RENTALS: number;
  FLEETS: number;
  NETWORK: number;
  ONLINE: number;
  BROKER: number;
  PASSER_BY: number;
  WHATSAPP: number;
  DIRECT: number;
};

interface OverviewAndInsightProps {
  setMonthAndYear: (value: string) => void;
  overview: CardsOverview;
  orderKpi: KpiData[];
}

export default function OverviewAndInsight({
  setMonthAndYear,
  overview,
  orderKpi,
}: OverviewAndInsightProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleRowClick = (row: any) => {
    setOpenModal(true);
    setSelectedRow(row);
  };
  const handleChangeType = (value: string) => {
    setMonthAndYear(moment(value).format("MM/YYYY"));
  };
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Overview</h1>
        <div className="flex items-center space-x-4">
          <Select
            defaultValue={(() => {
              const now = new Date();
              return `${now.getFullYear()}-${String(
                now.getMonth() + 1
              ).padStart(2, "0")}`;
            })()}
            style={{ minWidth: 180 }}
            className="h-[42px]"
            onChange={handleChangeType}
            options={(() => {
              const options = [];
              const start = new Date(2025, 0); // January 2025
              const now = new Date();
              const current = new Date(start);
              while (
                current.getFullYear() < now.getFullYear() ||
                (current.getFullYear() === now.getFullYear() &&
                  current.getMonth() <= now.getMonth())
              ) {
                const value = `${current.getFullYear()}-${String(
                  current.getMonth() + 1
                ).padStart(2, "0")}`;
                const label = `${current.toLocaleString("default", {
                  month: "long",
                })} ${current.getFullYear()}`;
                options.push({ value, label });
                current.setMonth(current.getMonth() + 1);
              }
              return options;
            })()}
            aria-label="Select year and month"
            size="middle"
            suffixIcon={<Calendar className="w-4 h-4 text-gray-700" />}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Order Card */}
        <div className="bg-gray-100 hover:bg-primary p-6 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg group">
          <div className="text-2xl font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">
            {overview?.totalOrder}
          </div>
          <div className="text-secondary group-hover:text-gray-300 text-sm transition-colors duration-300">
            Total Order
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gray-100 hover:bg-primary p-6 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg group">
          <div className="text-2xl font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">
            ${overview?.totalRevenue}
          </div>
          <div className="text-secondary group-hover:text-gray-300 text-sm transition-colors duration-300">
            Total Revenue
          </div>
        </div>

        {/* Total Technician Card */}
        <div className="bg-gray-100 hover:bg-primary p-6 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg group">
          <div className="text-2xl font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">
            {overview?.totalTechnician}
          </div>
          <div className="text-secondary group-hover:text-gray-300 text-sm transition-colors duration-300">
            Total Technician
          </div>
        </div>

        {/* Total Customer Card */}
        <div className="bg-gray-100 hover:bg-primary p-6 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg group">
          <div className="text-2xl font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">
            {overview?.totalCustomer}
          </div>
          <div className="text-secondary group-hover:text-gray-300 text-sm transition-colors duration-300">
            Total Customer
          </div>
        </div>

        {/* Pending Orders Card with Notification */}
        <div className="animate-pulse bg-gray-100 hover:bg-primary p-6 rounded-lg relative cursor-pointer transition-all duration-300 hover:shadow-lg group">
          {/* Red notification dot */}
          <div className="absolute -top-1 -left-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="12" fill="#FFD8D8" />
              <circle cx="12" cy="12" r="6" fill="#FF4747" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">
            {overview?.totalPendingOrder}
          </div>
          <div className="text-secondary group-hover:text-gray-300 text-sm transition-colors duration-300">
            Pending Orders
          </div>
        </div>
      </div>

      {/* kpi insight table */}
      <div className="bg-white mt-8">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">KPI Insight</h2>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto">
          <div className="min-w-full h-[550px]">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-100 border border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[140px] border border-gray-200">
                    Days
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Garage
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[100px] border border-gray-200">
                    Car Rentals
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Fleets
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Network
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Online
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Broker
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[90px] border border-gray-200">
                    Passer-by
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[90px] border border-gray-200">
                    WhatsApp
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[80px] border border-gray-200">
                    Direct
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {orderKpi?.map((row, index) => (
                  <tr
                    key={index}
                    // onClick={() => handleRowClick(row)}
                    className={`border-b border-gray-100 cursor-pointer ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-4 px-4 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-medium">
                          {row?.day}
                        </span>
                        <span className="text-gray-600">({row?.total})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.GARAGE}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.BROKER}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.FLEETS}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.NETWORK}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.ONLINE}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.BROKER}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.PASSER_BY}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.WHATSAPP}
                    </td>
                    <td className="py-4 px-4 border border-gray-200 text-center text-gray-900">
                      {row?.DIRECT}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        title="Modal responsive width"
        centered
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      ></Modal>
    </div>
  );
}
