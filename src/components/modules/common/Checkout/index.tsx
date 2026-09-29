"use client";

import MyContainer from "@/components/shared/MyContainer/MyContainer";
import { usePurchasePlanMutation } from "@/redux/features/super_admin/superAdmin.api";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { PricingPlan } from "../Home/Pricing/Pricing";
import PaymentForm from "./PaymentForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";

export default function CheckoutComponent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const router = useRouter();
  const plan: PricingPlan = JSON.parse(
    sessionStorage?.getItem("planToPurchase") || "{}"
  );
  const dispatch = useAppDispatch();

  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    console.error(
      "Stripe publishable key is missing. Check your environment variables."
    );
  }

  const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

  const [purchasePlan] = usePurchasePlanMutation();

  const handleNextStep = async (paymentMethodId: string) => {
    const payload = {
      planId,
      paymentMethodId,
    };
    const res = await handleAsyncWithToast(async () => {
      return purchasePlan(payload);
    }, "Purchasing plan...");

    if (res?.data?.success) {
      Swal.fire({
        title: "Plan purchased successfully! Please login again to continue.",
        text: "You will be redirected to the login page.",
        icon: "info",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("planToPurchase");
          dispatch(logout());
          router.push(`/auth/register?tab=signin`);
        }
      });
    }
  };

  return (
    <div className="min-h-fit py-4 md:py-8">
      <MyContainer>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Payment Details
          </h1>
          <p className="text-gray-600">
            Complete your subscription to Prodexter For 1 month
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Method Section */}
          <div className="space-y-6 border border-gray-200 rounded-lg p-6 h-fit lg:col-span-2">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Payment Method
              </h2>
              <p className="text-gray-600 mb-4">
                Select your preferred payment method
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-white">
                  <input
                    type="radio"
                    id="card"
                    name="payment-method"
                    defaultChecked
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor="card"
                    className="flex-1 cursor-pointer text-primary"
                  >
                    Credit / Debit Card
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Mastercard Logo */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="25"
                      viewBox="0 0 32 25"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1066_6327)">
                        <path
                          d="M5.81764 24.8758V23.2211C5.81764 22.5867 5.43339 22.1731 4.77477 22.1731C4.44552 22.1731 4.08877 22.2834 3.84177 22.642C3.64977 22.3386 3.37539 22.1731 2.96377 22.1731C2.68927 22.1731 2.41502 22.2558 2.19539 22.5592V22.2283H1.61914V24.8758H2.19539V23.4141C2.19539 22.9454 2.44239 22.7246 2.82664 22.7246C3.21064 22.7246 3.40289 22.9729 3.40289 23.4141V24.8758H3.97914V23.4141C3.97914 22.9454 4.25339 22.7246 4.61014 22.7246C4.99439 22.7246 5.18639 22.9729 5.18639 23.4141V24.8758H5.81764ZM14.3515 22.2283H13.4186V21.4285H12.8424V22.2283H12.321V22.7522H12.8423V23.9657C12.8423 24.5725 13.0893 24.9309 13.7479 24.9309C13.9949 24.9309 14.2691 24.8483 14.4614 24.738L14.2966 24.2415C14.132 24.3518 13.94 24.3794 13.8028 24.3794C13.5284 24.3794 13.4186 24.214 13.4186 23.9381V22.7522H14.3515V22.2283ZM19.236 22.173C18.9068 22.173 18.6873 22.3386 18.55 22.5592V22.2283H17.9738V24.8758H18.55V23.3866C18.55 22.9454 18.742 22.6971 19.0988 22.6971C19.2085 22.6971 19.3458 22.7248 19.4555 22.7523L19.6201 22.2008C19.5104 22.1731 19.3458 22.1731 19.236 22.1731M11.8545 22.449C11.58 22.2559 11.1959 22.1733 10.7843 22.1733C10.1258 22.1733 9.68677 22.5042 9.68677 23.0282C9.68677 23.4695 10.016 23.7176 10.5923 23.8004L10.8666 23.828C11.1685 23.8831 11.3331 23.9658 11.3331 24.1038C11.3331 24.2968 11.1136 24.4347 10.7294 24.4347C10.3451 24.4347 10.0434 24.2968 9.85126 24.1589L9.57689 24.6001C9.87877 24.8207 10.2904 24.931 10.7019 24.931C11.4703 24.931 11.9094 24.5726 11.9094 24.0761C11.9094 23.6073 11.5526 23.3591 11.0038 23.2764L10.7294 23.2488C10.4824 23.2211 10.2904 23.1661 10.2904 23.0006C10.2904 22.8076 10.4824 22.6973 10.7843 22.6973C11.1136 22.6973 11.4429 22.8351 11.6075 22.9179L11.8545 22.449ZM27.1664 22.1733C26.837 22.1733 26.6175 22.3387 26.4803 22.5593V22.2284H25.904V24.8759H26.4803V23.3867C26.4803 22.9455 26.6724 22.6973 27.029 22.6973C27.1389 22.6973 27.2761 22.7249 27.3859 22.7524L27.5505 22.2009C27.4408 22.1733 27.2761 22.1733 27.1664 22.1733ZM19.8123 23.5522C19.8123 24.3519 20.361 24.931 21.2118 24.931C21.5959 24.931 21.8703 24.8484 22.1446 24.6278L21.8703 24.1589C21.6508 24.3244 21.4313 24.4071 21.1843 24.4071C20.7178 24.4071 20.3885 24.0762 20.3885 23.5522C20.3885 23.0558 20.7178 22.7248 21.1843 22.6973C21.4313 22.6973 21.6508 22.7799 21.8703 22.9455L22.1446 22.4767C21.8703 22.2559 21.5959 22.1733 21.2118 22.1733C20.361 22.1733 19.8123 22.7524 19.8123 23.5522ZM25.1358 23.5522V22.2284H24.5595V22.5593C24.3674 22.3112 24.093 22.1733 23.7363 22.1733C22.9954 22.1733 22.4191 22.7524 22.4191 23.5522C22.4191 24.3519 22.9954 24.931 23.7363 24.931C24.1204 24.931 24.3949 24.7932 24.5595 24.545V24.8759H25.1358V23.5522ZM23.0228 23.5522C23.0228 23.0833 23.3246 22.6973 23.8185 22.6973C24.285 22.6973 24.6144 23.0558 24.6144 23.5522C24.6144 24.021 24.285 24.4071 23.8185 24.4071C23.3246 24.3794 23.0228 24.021 23.0228 23.5522ZM16.1353 22.1733C15.3669 22.1733 14.818 22.7248 14.818 23.5522C14.818 24.3795 15.3668 24.931 16.1626 24.931C16.5468 24.931 16.931 24.8207 17.2329 24.5726L16.9584 24.1589C16.7389 24.3244 16.4645 24.4347 16.1901 24.4347C15.8334 24.4347 15.4766 24.2692 15.3943 23.8003H17.3426V23.5798C17.3701 22.7248 16.8763 22.1733 16.1353 22.1733ZM16.1351 22.6696C16.4918 22.6696 16.7389 22.8903 16.7936 23.304H15.4216C15.4765 22.9455 15.7235 22.6696 16.1351 22.6696ZM30.4316 23.5522V21.1804H29.8554V22.5593C29.6633 22.3112 29.3889 22.1733 29.0321 22.1733C28.2913 22.1733 27.715 22.7524 27.715 23.5522C27.715 24.3519 28.2913 24.931 29.0321 24.931C29.4164 24.931 29.6908 24.7932 29.8554 24.545V24.8759H30.4316V23.5522ZM28.3188 23.5522C28.3188 23.0833 28.6205 22.6973 29.1145 22.6973C29.581 22.6973 29.9103 23.0558 29.9103 23.5522C29.9103 24.021 29.581 24.4071 29.1145 24.4071C28.6205 24.3794 28.3188 24.021 28.3188 23.5522ZM9.05539 23.5522V22.2284H8.47914V22.5593C8.28702 22.3112 8.01264 22.1733 7.65589 22.1733C6.91502 22.1733 6.33877 22.7524 6.33877 23.5522C6.33877 24.3519 6.91502 24.931 7.65589 24.931C8.04014 24.931 8.31452 24.7932 8.47914 24.545V24.8759H9.05539V23.5522ZM6.91502 23.5522C6.91502 23.0833 7.21689 22.6973 7.71077 22.6973C8.17727 22.6973 8.50664 23.0558 8.50664 23.5522C8.50664 24.021 8.17727 24.4071 7.71077 24.4071C7.21689 24.3794 6.91502 24.021 6.91502 23.5522Z"
                          fill="black"
                        />
                        <path
                          d="M11.6621 2.12354H20.3059V17.733H11.6621V2.12354Z"
                          fill="#FF5F00"
                        />
                        <path
                          d="M12.2111 9.92827C12.2111 6.75678 13.6929 3.94372 15.9704 2.12349C14.2966 0.799749 12.1838 0 9.87875 0C4.41787 0 0 4.44008 0 9.92827C0 15.4165 4.41787 19.8565 9.87862 19.8565C12.1836 19.8565 14.2965 19.0568 15.9704 17.7329C13.6929 15.9403 12.2111 13.0997 12.2111 9.92827Z"
                          fill="#EB001B"
                        />
                        <path
                          d="M31.9684 9.92827C31.9684 15.4163 27.5505 19.8565 22.0898 19.8565C19.7848 19.8565 17.6719 19.0568 15.998 17.7329C18.303 15.9128 19.7574 13.0997 19.7574 9.92827C19.7574 6.75678 18.2755 3.94372 15.998 2.12349C17.6718 0.799749 19.7848 0 22.0898 0C27.5505 0 31.9684 4.46771 31.9684 9.92827Z"
                          fill="#F79E1B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1066_6327">
                          <rect width="32" height="25" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    {/* Visa Logo */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="13"
                      viewBox="0 0 40 13"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1066_6332)">
                        <path
                          d="M20.687 4.13932C20.6642 5.94303 22.2906 6.94952 23.5158 7.54799C24.7745 8.16196 25.1973 8.55572 25.1923 9.10485C25.183 9.94515 24.1883 10.316 23.2575 10.3305C21.6336 10.3557 20.6894 9.89096 19.9388 9.53949L19.3538 12.2834C20.1069 12.6313 21.5014 12.9347 22.9475 12.948C26.342 12.948 28.5628 11.2683 28.5748 8.66411C28.5881 5.35897 24.0142 5.17603 24.0455 3.69873C24.0563 3.25078 24.4827 2.77276 25.417 2.65122C25.8795 2.58982 27.1562 2.54283 28.6037 3.211L29.1719 0.556179C28.3934 0.272058 27.393 -1.90735e-06 26.1473 -1.90735e-06C22.9523 -1.90735e-06 20.7052 1.70253 20.687 4.13932ZM34.6309 0.228673C34.0111 0.228673 33.4888 0.591106 33.2556 1.14729L28.4067 12.753H31.7987L32.4738 10.883H36.6188L37.0103 12.753H40L37.3911 0.228673H34.6309ZM35.1055 3.61196L36.0844 8.31499H33.4034L35.1055 3.61196ZM16.5744 0.228829L13.9006 12.7528H17.133L19.8055 0.228516L16.5744 0.228829ZM11.7927 0.228829L8.42828 8.75323L7.06734 1.50502C6.90766 0.695889 6.27703 0.228673 5.57672 0.228673H0.0770312L0 0.59236C1.12906 0.83795 2.41188 1.23406 3.18906 1.65789C3.66469 1.91679 3.80031 2.14312 3.95656 2.75835L6.53422 12.753H9.95L15.1869 0.228673L11.7927 0.228829Z"
                          fill="url(#paint0_linear_1066_6332)"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_1066_6332"
                          x1="1838.96"
                          y1="38.9217"
                          x2="1876.53"
                          y2="-1290.85"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#222357" />
                          <stop offset="1" stopColor="#254AA5" />
                        </linearGradient>
                        <clipPath id="clip0_1066_6332">
                          <rect width="40" height="13" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm handleNextStep={handleNextStep} />
            </Elements>
          </div>

          {/* Order Summary Section */}
          <div className="col-span-1">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-primary">
                      {plan?.planName}
                    </span>
                    <span className="text-gray-600">
                      {plan?.interval?.charAt(0).toUpperCase() +
                        plan?.interval?.slice(1)?.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subscription</span>
                    <span className="text-primary">${plan?.price}</span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">${plan?.price}</span>
                  </div>

                  {plan?.interval === "month" ? (
                    <p className="text-sm text-gray-600">Billed monthly</p>
                  ) : (
                    <p className="text-sm text-gray-600">Billed annually</p>
                  )}
                </div>

                {/* Plan Features */}
                <div>
                  <h3 className="font-semibold text-primary mb-4">
                    Plan includes:
                  </h3>
                  <div className="space-y-3">
                    {plan?.benefits?.map((feature, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MyContainer>
    </div>
  );
}
