import React from 'react';
import Banner from './Banner/Banner';
import TrustedCompanies from './TrustedCompanies/TrustedCompanies';
import Features from './Features/Features';
import Pricing from './Pricing/Pricing';
import CTA from './CTA/CTA';

const HomeComponent = () => {
  return (
    <div>
      <Banner />
      <TrustedCompanies />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
};

export default HomeComponent;
