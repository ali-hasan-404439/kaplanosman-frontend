import { baseApi } from "../../api/baseApi";

const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalenderAllNotes: builder.query({
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
      providesTags: ["calendar"],
    }),
    getCalenderAllMeeting: builder.query({
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
          url: `/meeting/get-meetings${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["calendar"],
    }),
    getCalenderAllJobs: builder.query({
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
          url: `/order/get-all-jobs-for-calender${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["calendar"],
    }),
    getCalenderAllTechnicians: builder.query({
      query: ({
        companyId,
        page,
        limit,
      }: {
        companyId: string;
        page: number;
        limit: number;
      }) => {
        return {
          url: `/user/get-all-technicians-dropdown/${companyId}?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["calendar"],
    }),

    updatedCalenderMeetingStatus: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/meeting/update-meetings/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["calendar"],
    }),
    updatedCalenderNotesStatus: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/note/update-note/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["calendar"],
    }),
    deleteCalenderNotes: builder.mutation({
      query: (id) => {
        return {
          url: `/note/delete-note/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["calendar"],
    }),
    createNotesCalender: builder.mutation({
      query: (data) => {
        return {
          url: "/note/create-note",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["calendar"],
    }),
    createMeetingCalender: builder.mutation({
      query: (data) => {
        return {
          url: "/meeting/create-meeting",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["calendar"],
    }),
    getTechniciansDropdownCalender: builder.query({
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
      providesTags: ["calendar"],
    }),
  }),
});

export const {
  useGetCalenderAllNotesQuery,
  useGetCalenderAllMeetingQuery,
  useGetCalenderAllJobsQuery,
  useGetCalenderAllTechniciansQuery,
  useUpdatedCalenderMeetingStatusMutation,
  useUpdatedCalenderNotesStatusMutation,
  useDeleteCalenderNotesMutation,
  useCreateNotesCalenderMutation,
  useGetTechniciansDropdownCalenderQuery,
  useCreateMeetingCalenderMutation,
} = calendarApi;
