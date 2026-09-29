"use client";

import MyContainer from "@/components/shared/MyContainer/MyContainer";
import PricingCardSkeleton from "@/components/shared/PricingCardSkeleton";
import MyButton from "@/components/ui/MyButton/MyButton";
import { cn } from "@/lib/utils";
import { useGetAllPlansForPublicQuery } from "@/redux/features/super_admin/superAdmin.api";
import { useRouter } from "next/navigation";

export type PricingPlan = {
  id: string;
  stripePriceId: string;
  planName: string;
  description: string;
  price: number;
  interval: "year" | "month" | "week" | "day"; // Assuming these are possible intervals
  benefits: string[];
  productId: string;
  status: "ACTIVE" | "INACTIVE" | string; // Assuming other possible statuses
  createdAt: string; // or Date if you convert it
  updatedAt: string; // or Date if you convert it
};

const Pricing = () => {
  const router = useRouter();

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllPlansForPublicQuery(undefined);
  const plans: PricingPlan[] = response?.data || [];

  if (isLoading || isFetching) {
    return (
      <MyContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <PricingCardSkeleton key={index} />
          ))}
      </MyContainer>
    );
  }

  return (
    <section id="pricing" className="bg-white py-20">
      <MyContainer>
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-secondary border border-gray-200 w-fit mx-auto px-3 py-1 rounded-full mb-4 font-medium">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
            Simple, Transparent <span className="text-secondary">Pricing</span>
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works best for your business. All plans include
            core features with
            <br />
            different limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-4xl mx-auto">
          {plans?.length > 0 &&
            plans?.map((plan) => (
              <div
                key={plan?.id}
                className={cn(
                  "relative flex-1 flex flex-col bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300",
                  {
                    "border-2 border-purple-500": plan?.interval === "year",
                  }
                )}
              >
                {/* Most Popular Badge */}
                {plan?.interval === "year" ? (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {/* Plan Header */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {plan?.planName}
                  </h3>
                  <p className="text-sm text-secondary mb-6">
                    {plan?.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline mt-auto mb-8">
                  <span className="text-4xl font-bold text-primary">
                    ${plan?.price}
                  </span>
                  <span className="text-secondary ml-1">
                    /
                    {plan?.interval?.charAt(0).toUpperCase() +
                      plan?.interval?.slice(1)?.toLowerCase()}
                  </span>
                </div>

                {/* Features List */}
                <div className="mb-8 space-y-4">
                  {plan?.benefits?.map((feature, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                        >
                          <path
                            d="M18.3327 9.74014V10.5068C18.3317 12.3038 17.7498 14.0524 16.6738 15.4917C15.5978 16.9309 14.0854 17.9839 12.3621 18.4934C10.6389 19.0029 8.79707 18.9417 7.11141 18.319C5.42575 17.6962 3.98656 16.5452 3.00848 15.0377C2.0304 13.5302 1.56584 11.7469 1.68408 9.95373C1.80232 8.16061 2.49702 6.45374 3.66458 5.0877C4.83214 3.72165 6.41 2.76962 8.16284 2.37359C9.91568 1.97756 11.7496 2.15875 13.391 2.89014"
                            stroke="#22C55E"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.5 9.67354L10 12.1735L18.3333 3.84021"
                            stroke="#22C55E"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}

                <MyButton
                  onClick={() => {
                    router?.push(`/checkout?planId=${plan?.id}`);
                    sessionStorage?.setItem(
                      "planToPurchase",
                      JSON.stringify(plan)
                    );
                  }}
                  label="Get Started"
                  variant="filled"
                  fullWidth
                />
              </div>
            ))}
        </div>
      </MyContainer>
    </section>
  );
};

export default Pricing;
