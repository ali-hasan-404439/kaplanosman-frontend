import { baseApi } from "../../api/baseApi";

const companyManagerDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewHome: builder.query({
      query: (data) => {
        return {
          url: `/company/get-dashboard-cards?date=${data}`,
          method: "GET",
        };
      },
      providesTags: ["home"],
    }),
    getOderKpiMonth: builder.query({
      query: ({ date, page, limit }: { date: string; page: number, limit: number }) => {
        return {
          url: `/company/get-order-kpi-per-month?${
            date ? `date=${date}&page=${page}&limit=${limit}` : `page=${page}&limit=${limit}`
          } `,
          method: "GET",
        };
      },
      providesTags: ["home"],
    }),
    getTopCustomer: builder.query({
      query: (data) => {
        return {
          url: `/company/get-top-10-customer?date=${data}`,
          method: "GET",
        };
      },
      providesTags: ["home"],
    }),
    getTopTechnician: builder.query({
      query: ({ date }: { date: string }) => {
        return {
          url: `/company/get-top-5-technician?date=${date}`,
          method: "GET",
        };
      },
      providesTags: ["home"],
    }),
  }),
});

export const {
  useGetOverviewHomeQuery,
  useGetOderKpiMonthQuery,
  useGetTopCustomerQuery,
  useLazyGetTopTechnicianQuery,
} = companyManagerDashboardApi;
