import { baseApi } from "../../api/baseApi";

const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicle: builder.query({
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
          url: `/vehicle${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["vehicle"],
    }),
   getVehicleOrder: builder.query({
      query: ({ id, page, limit }: {id: string, page: number, limit: number}) => ({
        url: `/order/vehicle/${id}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    createVehicle: builder.mutation({
      query: (data) => {
        return {
          url: "/vehicle/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["vehicle"],
    }),

    updateVehicle: builder.mutation({
      query: (data) => {
        return {
          url: `/vehicle/update/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["vehicle"],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => {
        return {
          url: `/vehicle/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export const {
  useGetAllVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehicleOrderQuery
} = vehicleApi;
