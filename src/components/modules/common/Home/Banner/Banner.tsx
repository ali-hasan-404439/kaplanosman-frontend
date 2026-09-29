import React from "react";
import MyButton from "@/components/ui/MyButton/MyButton";
import bannerImage from "@/assets/images/bannerImage.png";
import bannerImage2 from "@/assets/images/bannerImage-2.png";
import Image from "next/image";
import { Link } from "next-view-transitions";

const Banner = () => {
  return (
    <section id="home" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="text-center mb-16">
          <p className="text-sm text-secondary border border-gray-200 w-fit mx-auto px-3 py-1 rounded-full mb-4 font-medium">
            Introducing Prodexter
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Transform Your Business
            <br />
            with <span className="text-secondary">Intelligent Solutions</span>
          </h1>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline operations, boost productivity, and drive growth with
            <br />
            our cutting-edge platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#pricing">
              <MyButton label="Get Started" variant="filled" isArrow />
            </Link>

            <Link href="/contact">
              <MyButton label="Contact Us" variant="outline" />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Dashboard Container */}
          <Image
            src={bannerImage}
            alt="Dashboard Mockup"
            className="w-full h-auto border-4 border-primary rounded-[10px]"
            height={600}
            width={1000}
          />
          <div className="hidden lg:block">
            <Image
              src={bannerImage2}
              alt="Dashboard Mockup"
              className="w-[300px] h-auto absolute -bottom-3 right-0 xl:translate-x-1/2"
              height={600}
              width={1000}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
