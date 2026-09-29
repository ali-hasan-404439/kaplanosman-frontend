import { baseApi } from "../../api/baseApi";

const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompany: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `company`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["company"],
    }),

    getSingleCompany: builder.query({
      query: (id) => {
        return {
          url: `company/${id}`,
          method: "GET",
        };
      },
      providesTags: ["company"],
    }),

    getUsersByCompanyId: builder.query({
      query: ({ id, data }) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `company/get-all-users-by-company-id/${id}`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["company"],
    }),

    updateCompanyStatus: builder.mutation({
      query: (payload) => {
        return {
          url: `company/status-update/${payload?.id}`,
          method: "PUT",
          body: payload?.data,
        };
      },
      invalidatesTags: ["company"],
    }),

    sendMessage: builder.mutation({
      query: (payload) => {
        return {
          url: `message/send`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["message"],
    }),

    getAllMessage: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `message`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["message"],
    }),

    updateMessageStatus: builder.mutation({
      query: (payload) => {
        return {
          url: `message/status-update/${payload?.id}`,
          method: "PUT",
          body: payload?.data,
        };
      },
      invalidatesTags: ["message"],
    }),

    sendReply: builder.mutation({
      query: (payload) => {
        return {
          url: `message/reply/${payload?.id}`,
          method: "PUT",
          body: payload?.data,
        };
      },
      invalidatesTags: ["message"],
    }),

    getAllPlans: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `subscription/get-all-subscription-plans`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["plan"],
    }),

    getAllPlansForPublic: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `subscription/get-all-subscription-plans-for-user`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["plan"],
    }),

    createPlan: builder.mutation({
      query: (payload) => {
        return {
          url: `subscription/create-subscription-plan`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["plan"],
    }),

    updatePlan: builder.mutation({
      query: (payload) => {
        return {
          url: `subscription/update-subscription-plan/${payload?.id}`,
          method: "PATCH",
          body: payload?.data,
        };
      },
      invalidatesTags: ["plan"],
    }),

    getAuditLogs: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `audit`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["audit"],
    }),

    getPaymentHistory: builder.query({
      query: (id) => {
        // const params = new URLSearchParams();
        // if (data) {
        //   data?.forEach((item: any) => {
        //     params.append(item.name, item.value as string);
        //   });
        // }
        return {
          url: `company/get-all-payment-history/${id}`,
          method: "GET",
          // params: params,
        };
      },
      providesTags: ["audit"],
    }),

    purchasePlan: builder.mutation({
      query: (payload) => {
        return {
          url: `subscription/create-user-subscription`,
          method: "POST",
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useGetAllCompanyQuery,
  useGetSingleCompanyQuery,
  useGetUsersByCompanyIdQuery,
  useUpdateCompanyStatusMutation,
  useSendMessageMutation,
  useGetAllMessageQuery,
  useUpdateMessageStatusMutation,
  useSendReplyMutation,
  useGetAllPlansQuery,
  useGetAllPlansForPublicQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useGetAuditLogsQuery,
  useGetPaymentHistoryQuery,
  usePurchasePlanMutation,
} = superAdminApi;
