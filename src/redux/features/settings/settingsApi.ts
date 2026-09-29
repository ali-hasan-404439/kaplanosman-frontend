import { baseApi } from "../../api/baseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSettingsCompany: builder.mutation({
      query: (userInfo) => {
        return {
          url: "company/update",
          method: "put",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateSettingsProfile: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/update-profile",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updatePasswordChange: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/change-password",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateSettingsCompanyMutation,
  useUpdateSettingsProfileMutation,
  useUpdatePasswordChangeMutation
} = settingsApi;
