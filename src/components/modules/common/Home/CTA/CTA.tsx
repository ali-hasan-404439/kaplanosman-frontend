'use client';

import MyContainer from '@/components/shared/MyContainer/MyContainer';
import MyButton from '@/components/ui/MyButton/MyButton';

export default function CTA() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  return (
    <section className="bg-white py-20">
      <MyContainer>
        <div className="bg-primary rounded-3xl px-8 py-16 sm:px-16 text-center flex items-center justify-center flex-col">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Experience These Features?
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start your free trial today and discover how Prodexter can transform
            <br />
            your business.
          </p>

          {/* CTA Button */}
          <MyButton
            onClick={() => scrollToSection('pricing')}
            label="See Our Pricing"
            variant="outline"
          />
        </div>
      </MyContainer>
    </section>
  );
}
