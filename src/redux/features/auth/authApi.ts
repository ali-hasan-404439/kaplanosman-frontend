import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo: { email: string; password: string }) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    loginWithGoogle: builder.mutation({
      query: (userInfo) => {
        console.log({ userInfo });
        return {
          url: "google-login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo: { email: string }) => {
        return {
          url: "/auth/forget-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo: { email: string; token: string; password: string }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/me",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateCompany: builder.mutation({
      query: (userInfo) => {
        return {
          url: "company/update",
          method: "put",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: (userInfo) => {
        return {
          url: "auth/update-profile",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "auth/change-password",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: (userInfo: {
        name: string;
        email: string;
        password: string;
        phone: string;
      }) => {
        return {
          url: "/client/signup",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    otp: builder.mutation({
      query: (userInfo: { email: string; code: string; purpose: string }) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    otpResendCode: builder.mutation({
      query: (userInfo: { email: string; purpose: string }) => {
        return {
          url: "/auth/resend-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useOtpMutation,
  useOtpResendCodeMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateCompanyMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
