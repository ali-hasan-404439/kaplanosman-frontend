import Footer from '@/components/shared/Footer/Footer';
import Navbar from '@/components/shared/NavBar/NavBar';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <Navbar />
      <div className="h-full min-h-[calc(100vh-0px)]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
