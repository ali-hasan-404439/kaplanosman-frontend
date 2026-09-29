import { baseApi } from "../../api/baseApi";

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllService: builder.query({
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
          url: `/service${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["service"],
    }),
    createService: builder.mutation({
      query: (data) => {
        return {
          url: "/service/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["service"],
    }),

    updateService: builder.mutation({
      query: (data) => {
        return {
          url: `/service/update/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["service"],
    }),
    deleteService: builder.mutation({
      query: (id) => {
        return {
          url: `/service/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useGetAllServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
