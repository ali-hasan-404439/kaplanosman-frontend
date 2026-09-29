'use client';

export default function TrustedCompanies() {
  // Company logos data - using placeholder logos similar to the image
  const companies = [
    { name: 'Logoipsum', logo: 'logoipsum-1' },
    { name: 'Logoipsum Services', logo: 'logoipsum-2' },
    { name: 'Logoipsum University', logo: 'logoipsum-3' },
    { name: 'Logoipsum Corp', logo: 'logoipsum-4' },
    { name: 'Logoipsum Inc', logo: 'logoipsum-5' },
    { name: 'Logoipsum Ltd', logo: 'logoipsum-6' },
    { name: 'Logoipsum Group', logo: 'logoipsum-7' },
    { name: 'Logoipsum Tech', logo: 'logoipsum-8' },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="bg-background-secondary py-16 overflow-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            Join thousands of companies that rely on Prodexter to power their
            business operations.
          </p>
        </div>

        {/* Sliding Logos */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="flex gap-8 animate-slide">
              {duplicatedCompanies?.map((company, index) => (
                <div
                  key={`${company.logo}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ minWidth: '160px' }}
                >
                  <LogoComponent name={company.name} variant={company.logo} />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-slide {
          animation: slide 30s linear infinite;
        }

        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// Logo Component to create different logo variations
function LogoComponent({ name, variant }: { name: string; variant: string }) {
  const getLogoContent = () => {
    switch (variant) {
      case 'logoipsum-1':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-secondary">Logoipsum</span>
          </div>
        );
      case 'logoipsum-2':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
              <div className="w-4 h-1 bg-white rounded"></div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">Logoipsum</div>
              <div className="text-xs text-gray-300">SERVICES</div>
            </div>
          </div>
        );
      case 'logoipsum-3':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">Logoipsum</div>
              <div className="text-xs text-gray-300">University</div>
            </div>
          </div>
        );
      case 'logoipsum-4':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-secondary">LOGOIPSUM</span>
          </div>
        );
      case 'logoipsum-5':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary flex items-center justify-center">
              <div className="w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-secondary">Logoipsum</span>
          </div>
        );
      case 'logoipsum-6':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-secondary">Logoipsum</span>
          </div>
        );
      case 'logoipsum-7':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-secondary">Logoipsum</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-secondary">Logoips</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center h-16 opacity-60 hover:opacity-80 transition-opacity duration-300 cursor-pointer">
      {getLogoContent()}
    </div>
  );
}
