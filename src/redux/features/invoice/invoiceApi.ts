import { baseApi } from "../../api/baseApi";

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoice: builder.query({
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
          url: `/invoice/get-all-invoice${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["invoice"],
    }),
    singleGetInvoice: builder.query({
      query: ({id}: {id: string}) => {
        return {
          url: `/invoice/get-invoice-by-Id/${id}`,
          method: "GET",
        };
      },
      providesTags: ["invoice"],
    }),
    createInvoice: builder.mutation({
      query: (data) => {
        return {
          url: "/invoice/create-invoice",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["invoice"],
    }),
    updateInvoice: builder.mutation({
      query: ({id, formData}) => {
        console.log("Form data:", formData);
        return {
          url: `/invoice/update-invoice/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["invoice"],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => {
        return {
          url: `/invoice/delete-invoice/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["invoice"],
    }),
  }),
});

export const {
  useGetAllInvoiceQuery,
  useSingleGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
