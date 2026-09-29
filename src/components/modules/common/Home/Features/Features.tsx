'use client';

import MyContainer from '@/components/shared/MyContainer/MyContainer';

export default function Features() {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'Advanced Analytics',
      description:
        'Instantly view key metrics, active jobs, and business performance with a real-time dashboard summary.',
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Eveready Summary',
      description:
        'Quickly access essential metrics, ongoing tasks, and overall business performance through a live dashboard overview.',
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'Order Management',
      description:
        'Efficiently manage customer orders, from creation to completion, with status tracking and easy updates.',
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      title: 'Technician management',
      description:
        'Assign jobs, monitor schedules, and track technician performance to improve efficiency and service quality.',
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: 'Supplier Management',
      description:
        'Maintain supplier details, track inventory, and manage supply orders to ensure smooth business operations.',
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: 'Invoice Creation',
      description:
        'Quickly generate, customize, and send professional invoices to clients with built-in billing tools.',
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <MyContainer>
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-secondary border border-gray-200 w-fit mx-auto px-3 py-1 rounded-full mb-4 font-medium">
            Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="text-secondary">Succeed</span>
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform offers all the tools and features you
            need to take your
            <br />
            business to the next level.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
