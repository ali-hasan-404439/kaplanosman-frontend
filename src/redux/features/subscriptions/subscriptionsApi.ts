import { baseApi } from "../../api/baseApi";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlan: builder.query({
      query: () => {
        return {
          url: `/subscription/get-my-current-plan`,
          method: "GET",
        };
      },
      providesTags: ["subscriptions"],
    }),
    getSubscriptionCard: builder.query({
      query: () => {
        return {
          url: `/subscription/get-cards-details`,
          method: "GET",
        };
      },
      providesTags: ["subscriptions"],
    }),

    updateSubscription: builder.mutation({
      query: (data) => {
        return {
          url: `/subscription/update-card`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
    updateRemoved: builder.mutation({
      query: (data) => {
        return {
          url: `/subscription/removed-card`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
    updateCancel: builder.mutation({
      query: (data) => {
        return {
          url: `/subscription/cancel-user-subscription`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
  }),
});

export const {
  useGetSubscriptionPlanQuery,
  useGetSubscriptionCardQuery,
  useUpdateSubscriptionMutation,
  useUpdateRemovedMutation,
  useUpdateCancelMutation
} = subscriptionsApi;
