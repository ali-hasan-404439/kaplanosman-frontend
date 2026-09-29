import { baseApi } from "../../api/baseApi";

const employeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: ({
        id,
        data,
      }: {
        id: string;
        data?: { name: string; value: any }[];
      }) => {
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
          url: `company/get-all-users-by-company-id/${id}${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["employees"],
    }),

    createEmployees: builder.mutation({
      query: (data) => {
        return {
          url: `/user/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),
    updateEmployees: builder.mutation({
      query: (data) => {
        return {
          url: `/user/status-update/${data?.id}`,
          method: "put",
          body: data?.formData,
        };
      },
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useCreateEmployeesMutation,
  useUpdateEmployeesMutation,
} = employeesApi;
