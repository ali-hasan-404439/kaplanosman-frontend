import { baseApi } from "../../api/baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
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
          url: `/customer${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["customer"],
    }),

    getCustomerOrder: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/order/customer/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["customer"],
    }),

    createCustomer: builder.mutation({
      query: (data) => {
        return {
          url: "/customer/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["customer"],
    }),

    updateCustomer: builder.mutation({
      query: (data) => {
        return {
          url: `/customer/update/${data?.id}`,
          method: "put",
          body: data?.formData,
        };
      },
      invalidatesTags: ["customer"],
    }),
    customerChangeStatus: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/customer/status-update/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => {
        return {
          url: `/customer/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["customer"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetCustomerOrderQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCustomerChangeStatusMutation,
} = customerApi;
