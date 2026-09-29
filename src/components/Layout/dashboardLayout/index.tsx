import React from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`flex h-screen`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-24">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
