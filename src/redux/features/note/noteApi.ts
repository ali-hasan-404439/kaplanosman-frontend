import { baseApi } from "../../api/baseApi";

const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotes: builder.query({
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
          url: `/note/get-all-notes${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["notes"],
    }),
    getTechniciansDropdown: builder.query({
      query: ({id, page=10, limit=10000}:{id: string, page: number, limit: number}) => {
        return {
          url: `/user/get-all-technicians-dropdown/${id}?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),

    createNotes: builder.mutation({
      query: (data) => {
        return {
          url: "/note/create-note",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["notes"],
    }),

    updateNotes: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/note/update-note/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["notes"],
    }),

    deleteNotes: builder.mutation({
      query: (id) => {
        return {
          url: `/note/delete-note/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["notes"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useCreateNotesMutation,
  useDeleteNotesMutation,
  useUpdateNotesMutation,
  useGetTechniciansDropdownQuery
} = noteApi;
