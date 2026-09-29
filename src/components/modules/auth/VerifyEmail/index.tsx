"use client";

import MyButton from "@/components/ui/MyButton/MyButton";
import {
  useOtpMutation,
  useOtpResendCodeMutation,
} from "@/redux/features/auth/authApi";
import { Link } from "next-view-transitions";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const VerifyEmailComponent = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Timer for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const [userOtpVerify, { isLoading }] = useOtpMutation();
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verifyData = {
      email: email || "",
      code: verificationCode,
      purpose: "EMAIL_VERIFICATION",
    };
    try {
      const response = await userOtpVerify(verifyData).unwrap();
      if (response?.success) {
        router?.push(`/auth/register`);
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

  const [userOtpResend] = useOtpResendCodeMutation();
  const handleResendCode = async () => {
    if (canResend) {
      const resendCode = {
        email: email || "",
        purpose: "PASSWORD_RESET",
      };
      try {
        const response = await userOtpResend(resendCode).unwrap();
        if (response?.success) {
          toast.success(
            response?.message ||
              "A new verification code has been sent to your email."
          );
        }
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.error ||
            "Failed to otp verify. Please try again"
        );
      }
      setCanResend(false);
      setResendTimer(60);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-4">
            Verify your email address
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            We have sent you an email with your verification code, please
            don&apos;t share your code with anyone.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerifySubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend}
                className={`text-sm transition-colors duration-200 ${
                  canResend
                    ? "text-gray-600 hover:text-gray-800 underline cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend Code" : `Resend Code (${resendTimer}s)`}
              </button>
            </div>
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
            label="VERIFY ME"
            variant="filled"
            type="submit"
            fullWidth
            isArrow
            className="!bg-primary hover:!bg-primary !py-4 !text-base !font-semibold !mt-3"
            isDisabled={isLoading}
          />
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            You may{" "}
            <Link
              href="/contact"
              className="text-primary underline hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              contact us
            </Link>{" "}
            for help restoring access to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailComponent;
