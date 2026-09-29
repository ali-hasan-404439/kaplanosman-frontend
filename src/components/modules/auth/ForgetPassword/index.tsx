"use client";

import MyButton from "@/components/ui/MyButton/MyButton";
import {
  useForgotPasswordMutation,
  useOtpMutation,
} from "@/redux/features/auth/authApi";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import type React from "react";

import { useState } from "react";
import { toast } from "sonner";

export default function ForgetPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const [verificationCode, setVerificationCode] = useState("");

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const [userOtpVerify, { isLoading: resetLoading }] = useOtpMutation();
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verifyData = {
      email: email,
      code: verificationCode,
      purpose: "PASSWORD_RESET",
    };
    try {
      const response = await userOtpVerify(verifyData).unwrap();
      if (response?.success) {
        router.push(
          `/auth/reset-password?email=${response?.data?.email}&token=${response?.data?.resetPasswordToken}`
        );
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Failed to otp verify. Please try again"
      );
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email }).unwrap();

      if (response?.success) {
        toast.success(
          response?.message ||
            "A password reset code has been sent to your email address."
        );
        setIsSubmitted(true);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          error?.error ||
          "Unable to send reset code. Please check the email and try again."
      );
    }
  };

  const handleSignIn = () => {
    window.location.href = "/auth/register?tab=signin";
  };

  const handleContactUs = () => {
    window.location.href = "/contact";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-primary mb-4">
              Insert the code
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              We have sent you an email with your verification code, please
              don&apos;t share your code with anyone.
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerificationSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Code
              </label>
              <input
                type="text"
                id="verification-code"
                name="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-lg"
                placeholder=""
                required
              />
            </div>

            <MyButton
              label="PROCEED"
              variant="filled"
              type="submit"
              fullWidth
              isArrow
              isDisabled={resetLoading}
              className="!bg-primary hover:!bg-primary !py-4 !text-base !font-semibold !mt-3"
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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Forget Password?
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Enter the email address or mobile phone number associated with your
            RandM account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>

          {/* Send Code Button */}
          <MyButton
            label={isLoading ? "SENDING..." : "SEND CODE"}
            variant="filled"
            type="submit"
            fullWidth
            isArrow={!isLoading}
            isDisabled={isLoading}
            className="!bg-primary hover:!bg-gray-800 !py-3 !text-base !font-semibold"
          />
        </form>

        {/* Auth Links */}
        <div className="mt-8 space-y-2 text-center">
          <div className="text-sm text-gray-600">
            Already have account?{" "}
            <Link href={`/auth/register?tab=signin`}>
              <button className="font-medium text-primary hover:text-gray-700 transition-colors duration-200">
                Sign In
              </button>
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            Don&apos;t have account?{" "}
            <Link href={`/auth/register?tab=signup`}>
              <button className="font-medium text-primary hover:text-gray-700 transition-colors duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Contact Help */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            You may{" "}
            <button
              onClick={handleContactUs}
              className="text-primary hover:text-gray-700 underline transition-colors duration-200"
            >
              contact us
            </button>{" "}
            for help restoring access to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
