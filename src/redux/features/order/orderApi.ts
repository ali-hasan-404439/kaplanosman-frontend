import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrder: builder.query({
      query: (data?: { name: string; value: any }[]) => {
        let queryString = "";

        if (data && data.length > 0) {
          const params = new URLSearchParams();
          data.forEach((item) => {
            const value =
              typeof item.value === "string"
                ? item.value.trim()
                : String(item.value || "").trim();
            if (value !== "") {
              params.append(item.name, value);
            }
          });
          queryString = `?${params.toString()}`;
        }

        return {
          url: `/order${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getCustomerDropdown: builder.query({
      query: ({ page, limit }: { page: number; limit: number }) => {
        return {
          url: `/customer/dropdown?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getArticleDropdown: builder.query({
      query: ({ page, limit }: { page: number; limit: number }) => {
        return {
          url: `/article/dropdown?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getAllServiceDropdown: builder.query({
      query: ({
        page = 10,
        limit = 10000,
      }: {
        page: number;
        limit: number;
      }) => {
        return {
          url: `/service/dropdown?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getVehicleDropdown: builder.query({
      query: ({
        page = 10,
        limit = 10000,
      }: {
        page: number;
        limit: number;
      }) => {
        return {
          url: `/vehicle/dropdown?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getTechnicians: builder.query({
      query: ({
        id,
        page = 10,
        limit = 10000,
      }: {
        id: string;
        page: number;
        limit: number;
      }) => {
        return {
          url: `/user/get-all-technicians-dropdown/${id}?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getSingleOrder: builder.query({
      query: ({ id }: { id: string }) => {
        return {
          url: `/order/${id}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    createOrder: builder.mutation({
      query: (data) => {
        return {
          url: "/order/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["order"],
    }),
    createOrderWarrantyClaim: builder.mutation({
      query: ({ id, note }: { id: string; note: string }) => {
        return {
          url: `/order/warranty-claim/${id}`,
          method: "POST",
          body: { note: note },
        };
      },
      invalidatesTags: ["order"],
    }),

    updateOrder: builder.mutation({
      query: ({id, formData}) => {
        console.log("Updating order with ID:", id);
        console.log("Form data:", formData);
        return {
          url: `/order/update/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["order"],
    }),
    updateOrderStatus: builder.mutation({
      query: (data) => {
        return {
          url: `/order/status-update/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => {
        return {
          url: `/order/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useGetAllOrderQuery,
  useGetCustomerDropdownQuery,
  useGetTechniciansQuery,
  useGetArticleDropdownQuery,
  useGetVehicleDropdownQuery,
  useGetAllServiceDropdownQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
  useGetSingleOrderQuery,
  useCreateOrderWarrantyClaimMutation,
} = orderApi;
