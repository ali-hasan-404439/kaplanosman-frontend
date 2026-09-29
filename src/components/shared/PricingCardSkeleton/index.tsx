import { Link } from "next-view-transitions";
import MyButton from "@/components/ui/MyButton/MyButton";

const PricingCardSkeleton = () => {
  return (
    <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Plan Header - Static Placeholder */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-primary mb-2">PLAN NAME</h3>
        <p className="text-sm text-secondary mb-6">PLAN DESCRIPTION</p>

        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-primary">$XX</span>
          <span className="text-secondary ml-1">/INTERVAL</span>
        </div>
      </div>

      {/* Features List - Static Placeholder */}
      <div className="mb-8 space-y-4">
        {/* Repeat this block for each feature */}
        <div className="flex items-center gap-3">
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
          <span className="text-gray-700">FEATURE ITEM</span>
        </div>
        {/* End of feature block */}
      </div>

      {/* CTA Button - Static */}
      <Link href={`/checkout`}>
        <MyButton label="Get Started" variant="filled" fullWidth />
      </Link>
    </div>
  );
};

export default PricingCardSkeleton;
