"use client";

import MyButton from "@/components/ui/MyButton/MyButton";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import MyContainer from "../MyContainer/MyContainer";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { logoutHandler } from "@/utils/handleLogout";
import { useDispatch } from "react-redux";
import { Link } from "next-view-transitions";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // Close mobile menu after clicking
    setIsMenuOpen(false);
  };

  const handleLogOut = async () => {
    logoutHandler(dispatch, router);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <MyContainer>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={"/"} className="text-xl font-semibold text-primary">
              Prodexter
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks?.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    onClick={() => scrollToSection(link.label)}
                    href={
                      pathname === "/" && link.label === "Home"
                        ? "#home"
                        : link.label === "Contact"
                        ? "/contact"
                        : `/${link.href}`
                    }
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          {user ? (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                {(user?.role === "SUPER_ADMIN" ||
                  user?.role === "COMPANY_ADMIN" ||
                  user?.role === "MANAGER") && (
                  <MyButton
                    onClick={() => {
                      const path =
                        user.role === "SUPER_ADMIN"
                          ? "/dashboard"
                          : user.role === "COMPANY_ADMIN"
                          ? "/company"
                          : user.role === "MANAGER"
                          ? "/manager"
                          : "/";
                      router.push(path);
                    }}
                    label="Dashboard"
                    variant="outline"
                    fullWidth
                  />
                )}

                <MyButton
                  onClick={handleLogOut}
                  label="Log Out"
                  variant="filled"
                  fullWidth
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <MyButton
                  onClick={() => router.push("/auth/register?tab=signin")}
                  label="Sign In"
                  variant="outline"
                />
                <MyButton
                  onClick={() => router.push("/auth/register?tab=signup")}
                  label="Sign Up"
                  variant="filled"
                />
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                    isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                  }`}
                ></span>
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </MyContainer>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                onClick={() => scrollToSection(link.label)}
                href={
                  pathname === "/" && link.label === "Home"
                    ? "#home"
                    : link.label === "Contact"
                    ? "/contact"
                    : `/${link.href}`
                }
                className={`block px-3 py-2 text-base font-medium text-primary hover:text-primary transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Auth Buttons */}
          {user ? (
            <div className="pt-4 pb-2 border-t border-gray-100 space-y-2">
              <MyButton
                onClick={() => {
                  const path =
                    user.role === "SUPER_ADMIN"
                      ? "/dashboard"
                      : user.role === "COMPANY_ADMIN"
                      ? "/company"
                      : user.role === "MANAGER"
                      ? "/manager"
                      : "/";
                  router.push(path);
                }}
                label="Dashboard"
                variant="outline"
                fullWidth
              />
              <MyButton
                onClick={handleLogOut}
                label="Log Out"
                variant="filled"
                fullWidth
              />
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-gray-100 space-y-2">
              <MyButton
                onClick={() => router.push("/auth/register?tab=signin")}
                label="Sign In"
                variant="outline"
                fullWidth
              />
              <MyButton
                onClick={() => router.push("/auth/register?tab=signup")}
                label="Sign Up"
                variant="filled"
                fullWidth
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
