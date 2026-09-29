"use client";
import { useState, useEffect } from "react";
import OverviewAndInsight from "./OverviewAndInsight";
import DashboardCharts from "./DahboardChart";
import {
  useGetOderKpiMonthQuery,
  useGetOverviewHomeQuery,
  useGetTopCustomerQuery,
  useLazyGetTopTechnicianQuery,
} from "@/redux/features/company-manager-dashboard/company-manager-dashboardApi";
import moment from "moment";

const CompanyDashboardHomeComponent = () => {
  const defaultMonthYear = moment().format("MM/YYYY");
  const [monthAndYear, setMonthAndYear] = useState(defaultMonthYear);

  // fetch data
  const { data: overview } = useGetOverviewHomeQuery(monthAndYear);
  const { data: customer } = useGetTopCustomerQuery(monthAndYear);

  const [fetchTechnicians, { data: technician }] =
    useLazyGetTopTechnicianQuery();
  const { data: orderKpi } = useGetOderKpiMonthQuery({ date: monthAndYear, page: 1, limit: 3000,  });

  // monthAndYear পরিবর্তন হলে technician data fetch করো
  useEffect(() => {
    if (monthAndYear) {
      fetchTechnicians({ date: monthAndYear });
    }
  }, [monthAndYear, fetchTechnicians]);

  
  return (
    <div>
      <OverviewAndInsight
        setMonthAndYear={setMonthAndYear}
        overview={overview?.data}
        orderKpi={orderKpi?.data?.data}
      />
      <DashboardCharts
        customer={customer?.data}
        technician={technician?.data?.topTechnicians}
      />
    </div>
  );
};

export default CompanyDashboardHomeComponent;
