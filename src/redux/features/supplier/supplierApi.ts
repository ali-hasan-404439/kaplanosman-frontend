import { baseApi } from "../../api/baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSupplier: builder.query({
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
          url: `/supplier${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["supplier"],
    }),
    getSupplierArticle: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/article/supplier/${id}?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

    createSupplier: builder.mutation({
      query: (data) => {
        return {
          url: "/supplier/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["supplier"],
    }),

    updateSupplier: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/supplier/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["supplier"],
    }),

    deleteSupplier: builder.mutation({
      query: (id) => {
        return {
          url: `/supplier/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["supplier"],
    }),
  }),
});

export const {
  useGetAllSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSupplierArticleQuery,
} = supplierApi;
