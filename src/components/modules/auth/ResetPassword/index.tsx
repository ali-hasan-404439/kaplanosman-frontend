"use client";
import MyButton from "@/components/ui/MyButton/MyButton";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ResetPasswordComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailValidation = searchParams.get("email");
  const token = searchParams.get("token");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.password !== passwordData.confirmPassword) {
      return toast.error("Passwords don't match!");
    }

    if (passwordData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long!");
    }
    const resetPasswordData = {
      email: emailValidation || "",
      token: token || "",
      password: passwordData?.password,
    };
    try {
      const response = await resetPassword(resetPasswordData).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        router.push("/auth/register");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Failed to reset password. Please try again"
      );
    }
    // Handle password reset submission
  };

  const handleContactUs = () => {
    // Handle contact us action
    console.log("Contact us clicked");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-4">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            To create a strong password use special characters and don&apos;t
            share it with anyone.
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={passwordData.password}
                onChange={handleInputChange}
                placeholder="8+ characters"
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-base"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showConfirmPassword ? (
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

          <MyButton
            label="RESET PASSWORD"
            variant="filled"
            type="submit"
            fullWidth
            isArrow
            className="!bg-primary hover:!bg-primary !py-4 !text-base !font-semibold !mt-8"
            isDisabled={isLoading}
          />
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            You may{" "}
            <button
              type="button"
              onClick={handleContactUs}
              className="text-primary underline hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              contact us
            </button>{" "}
            for help restoring access to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
