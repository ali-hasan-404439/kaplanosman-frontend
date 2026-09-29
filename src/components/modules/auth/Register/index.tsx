"use client";
import MyButton from "@/components/ui/MyButton/MyButton";
import {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Link } from "next-view-transitions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Swal from "sweetalert2";

const RegisterComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get tab from query params, default to 'signin'
  const tabFromQuery = searchParams.get("tab") as "signin" | "signup" | null;
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    tabFromQuery || "signin"
  );

  const [showPassword, setShowPassword] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Update tab when query params change
  useEffect(() => {
    if (
      tabFromQuery &&
      (tabFromQuery === "signin" || tabFromQuery === "signup")
    ) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [getUserData, { isLoading: loginLoading }] = useLazyGetMeQuery();
  const [userLogin] = useLoginMutation();
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await userLogin(signInData).unwrap();

      if (response?.data?.isVerified) {
        toast.success(response?.message);
        dispatch(
          setUser({
            access_token: response?.data?.accessToken,
            refresh_token: response?.data?.refreshToken,
          })
        );
        if (response?.data?.accessToken) {
          const userData = await getUserData(undefined).unwrap();
          dispatch(
            setUser({
              access_token: response?.data?.accessToken,
              refresh_token: response?.data?.refreshToken,
              user: userData?.data,
            })
          );
          if (userData?.data?.role === "COMPANY_ADMIN") {
            if (
              userData?.data?.company_admin?.company?.companyName &&
              userData?.data?.company_admin?.company?.companyEmail &&
              userData?.data?.company_admin?.company?.companyPhone &&
              userData?.data?.company_admin?.company?.businessAddress
            ) {
              router.push("/company");
            } else {
              router.push("/company/settings");
            }
          } else if (userData?.data?.role === "MANAGER") {
            router.push("/manager");
          } else if (userData?.data?.role === "SUPER_ADMIN") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }
      } else {
        router?.push(`/auth/verify-email?email=${signInData?.email}`);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Failed to user login. Please try again"
      );
    }
  };

  // register handel function
  const [userRegister, { isLoading }] = useRegisterMutation();
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userRegister(signUpData).unwrap();
      if (response?.success) {
        const result = await Swal.fire({
          title: response?.message,
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
        });

        if (result.isConfirmed || result.isDismissed) {
          router?.push(`/auth/verify-email?email=${signUpData?.email}`);
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Failed to register. Please try again"
      );
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 pb-4 text-lg font-semibold transition-colors duration-200 ${
              activeTab === "signin"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 pb-4 text-lg font-semibold transition-colors duration-200 ${
              activeTab === "signup"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === "signin" && (
          <form onSubmit={handleSignInSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="signin-email"
                name="email"
                value={signInData.email}
                onChange={handleSignInChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="signin-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link href="/auth/forget-password">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
                  >
                    Forget Password
                  </button>
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="signin-password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <MyButton
              label="SIGN IN"
              variant="filled"
              type="submit"
              fullWidth
              isArrow
              className="!bg-primary hover:!bg-gray-800 !py-3 !text-base !font-semibold"
              isDisabled={loginLoading}              
            />

            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div> */}

            {/* Google Login */}
            {/* <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Login with Google
              </span>
            </button> */}
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="signup-name"
                name="name"
                value={signUpData.name}
                onChange={handleSignUpChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="signup-phone"
                name="phone"
                value={signUpData.phone}
                onChange={handleSignUpChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  placeholder="8+ characters"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <MyButton
              label="SIGN UP"
              variant="filled"
              type="submit"
              fullWidth
              isArrow
              className="!bg-primary hover:!bg-gray-800 !py-3 !text-base !font-semibold"
              isDisabled={isLoading}
            />

            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div> */}

            {/* Google Login */}
            {/* <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Login with Google
              </span>
            </button> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterComponent;
