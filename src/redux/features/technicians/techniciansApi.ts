import { baseApi } from "../../api/baseApi";

const techniciansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTechnicians: builder.query({
      query: (data?: { name: string; value: any }[]) => {
        let queryString = "";
        let id = "";

        const params = new URLSearchParams();

        if (data && data.length > 0) {
          data.forEach((item) => {
            const value =
              typeof item.value === "string"
                ? item.value.trim()
                : String(item.value || "").trim();

            if (item.name === "id" && value !== "") {
              id = value;
            } else if (value !== "") {
              params.append(item.name, value);
            }
          });

          if (Array.from(params).length > 0) {
            queryString = `?${params.toString()}`;
          }
        }

        return {
          url: `/user/get-all-technicians/${id}${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["technicians"],
    }),
    getSingleUser: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `/technician/get-technician-profile/${id}`,
        method: "GET",
      }),
      providesTags: ["technicians"],
    }),
    createTechnicians: builder.mutation({
      query: (data) => {
        return {
          url: "/user/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["technicians"],
    }),

    updateTechnicians: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/user/status-update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["technicians"],
    }),

    // deleteTechnicians: builder.mutation({
    //   query: (id) => {
    //     return {
    //       url: `/supplier/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: ["technicians"],
    // }),
  }),
});

export const {
  useGetAllTechniciansQuery,
  useCreateTechniciansMutation,
  useUpdateTechniciansMutation,
  useGetSingleUserQuery
} = techniciansApi;
