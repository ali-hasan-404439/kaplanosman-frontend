"use client";

import { logoutHandler } from "@/utils/handleLogout";
import { LogOut, MoveUpRight, UserRound } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface Profile01Props {
  name: string;
  role: string;
  avatar: string;
  subscription?: string;
}

export default function Profile01({
  name,
  role,
  avatar,
}: Profile01Props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  const menuItems: MenuItem[] = [
    // {
    //   label: "My Profile",
    //   href: "#",
    //   icon: <UserRound className="w-4 h-4 text-zinc-500" />,
    // },
  ];

  return (
    <div className="w-full max-w-sm mx-auto z-[1000]">
      <div className="overflow-hidden ">
        <div>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <Image
                src={avatar || ""}
                alt={name || ""}
                width={64}
                height={64}
                className="rounded-full ring-4 ring-white object-cover border border-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">{name}</h2>
              <p className="text-sm text-zinc-500">{role}</p>
            </div>
          </div>

          <div className="border-t border-zinc-200 my-4" />

          {/* Menu */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 transition"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm text-zinc-700 group-hover:text-black font-medium">
                    {item.label}
                  </span>
                </div>
                {item.external && (
                  <MoveUpRight className="w-4 h-4 text-zinc-400" />
                )}
              </Link>
            ))}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="group w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 transition"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
              <span className="text-sm text-zinc-700 group-hover:text-red-600 font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
