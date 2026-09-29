import { baseApi } from "../../api/baseApi";

const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticle: builder.query({
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
          url: `/article${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["article"],
    }),
    getAllDropdown: builder.query({
      query: ({page, limit}: {page: number, limit: number}) => {
        return {
          url: `/supplier/dropdown?page=${page}&${limit}`,
          method: "GET",
        };
      },
      providesTags: ["article"],
    }),

    createArticle: builder.mutation({
      query: (data) => {
        return {
          url: "/article/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["article"],
    }),

    updateArticle: builder.mutation({
      query: (data) => {
        return {
          url: `/article/update/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["article"],
    }),
    deleteArticle: builder.mutation({
      query: (id) => {
        return {
          url: `/article/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["article"],
    }),
  }),
});

export const {
  useGetAllArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetAllDropdownQuery
} = articleApi;
