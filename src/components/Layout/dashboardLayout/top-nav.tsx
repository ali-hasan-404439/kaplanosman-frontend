"use client";
import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import Image from "next/image";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function TopNav() {
  const user = useAppSelector(selectCurrentUser);
  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white border-b border-gray-200 h-full">
      <div className="font-medium text-sm hidden lg:flex flex-col gap-1 truncate max-w-[300px]">
        <h3 className="text-primary font-bold text-xl">
          Welcome Back, {user?.company_admin?.name}!
        </h3>
        <p className="text-secondary font-normal text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        {/* <NotificationDetails /> */}

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2">
              <Image
                src={
                  user?.company_admin?.profilePhoto ||
                  user?.super_admin?.profilePhoto ||
                  user?.manager?.profilePhoto
                }
                alt="User avatar"
                width={28}
                height={28}
                className="rounded-full ring-2 ring-gray-200 sm:w-9 sm:h-9 cursor-pointer"
              />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </nav>
  );
}
