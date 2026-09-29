"use client";
import React, { useState, useRef, useEffect } from "react";
import Profile01 from "./profile-01";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContentProps extends DropdownMenuProps {
  align?: string;
  sideOffset?: number;
  className?: string;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuTrigger = ({
  children,
  className,
}: DropdownMenuTriggerProps) => {
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer poppins ${className}`}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({
  children,
  align = "start",
  sideOffset = 0,
  className = "",
}: DropdownMenuContentProps) => {
  return (
    <div
      className={`absolute z-[10000] ${
        align === "end" ? "right-0" : "left-0"
      } ${className}`}
      style={{
        marginTop: sideOffset,
        top: "100%",
      }}
    >
      <div className="relative p-2 bg-white border border-zinc-200 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectCurrentUser);
  console.log(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[280px] sm:w-80"
        >
          <Profile01
            name={
              user?.company_admin?.company?.companyName ||
              user?.super_admin?.name ||
              user?.manager?.name ||
              "N/A"
            }
            role={user?.role?.split("_")?.join(" ")}
            avatar={
              user?.company_admin?.profilePhoto ||
              user?.super_admin?.profilePhoto ||
              user?.manager?.profilePhoto
            }
          />
        </DropdownMenuContent>
      )}
    </div>
  );
};
