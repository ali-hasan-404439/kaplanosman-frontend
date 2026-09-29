"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

// Colors for the pie chart
const COLORS = ["#8B5CF6", "#F87171", "#06B6D4", "#F59E0B", "#6366F1"];

interface Customer {
  customerName: string;
  totalOrders: number;
}

interface Technician {
  name: string;
  color: string;
  jobCount: null;
  percentage: string;
}
interface TechnicianChat {
  name: string;
  value: string;
  jobs: number;
  percentage: string;
  color: string
}

interface DashboardChartsPros {
  customer: Customer[];
  technician: Technician[]
}

export default function DashboardCharts({ customer, technician }: DashboardChartsPros) {
  const [customerData, setCustomerData] = useState<
    { name: string; value: number }[]
  >([]);
  const [technicianData, setTechnicianData] = useState<TechnicianChat[]>([])


  const totalJobs = technicianData?.reduce((sum, item) => sum + item.jobs, 0);


  useEffect(() => {
    if (customer) {
      const data = customer?.map((item) => ({
        name: item?.customerName,
        value: item?.totalOrders,
      }));
      setCustomerData(data);
    }
    if (technician) {
      const technicianData = technician?.map((item) => ({
        name: item?.name,
        value: item?.percentage,
        jobs: typeof item?.jobCount === "number" ? item.jobCount : 0,
        percentage: item?.percentage,
        color: item?.color
      }));
      setTechnicianData(technicianData);
    }
  }, [customer, technician]);
  return (
    <div className="bg-white mt-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top 10 Customer Bar Chart */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top 10 Customer
            </h3>
          </div>

          <div className="h-[400px] -ml-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                  domain={[0, 100]}
                />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">January 2025</span>
          </div>
        </div>

        {/* Top 5 Technician Pie Chart */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top 5 Technician
            </h3>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="text-sm font-medium">January 2025</span>
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="h-96 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={technicianData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="jobs"
                >
                  {technicianData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry?.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {totalJobs}
                </div>
                <div className="text-sm text-gray-600">Job Done</div>
              </div>
            </div>

            {/* Custom labels around the pie */}
            <div className="absolute top-8 right-8 text-right">
              <div className="text-xs text-gray-600">Mia</div>
              <div className="text-xs font-medium text-gray-900">54.7</div>
            </div>

            <div className="absolute top-20 right-4 text-right">
              <div className="text-xs text-gray-600">David</div>
              <div className="text-xs font-medium text-gray-900">57.25</div>
            </div>

            <div className="absolute bottom-20 right-4 text-right">
              <div className="text-xs text-gray-600">Daniel</div>
              <div className="text-xs font-medium text-gray-900">68.63</div>
            </div>

            <div className="absolute bottom-8 left-8 text-left">
              <div className="text-xs text-gray-600">William</div>
              <div className="text-xs font-medium text-gray-900">77.89</div>
            </div>

            <div className="absolute top-12 left-4 text-left">
              <div className="text-xs text-gray-600">Michael</div>
              <div className="text-xs font-medium text-gray-900">66.99</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {technicianData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <span className="text-xs text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
