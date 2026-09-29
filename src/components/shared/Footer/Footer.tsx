'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MyContainer from '../MyContainer/MyContainer';

const Footer = () => {
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

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
    <footer className="bg-white border-t border-gray-200 py-12">
      <MyContainer>
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary mb-3">
              Prodexter
            </h3>
            <p className="text-secondary max-w-sm leading-relaxed">
              Innovative solutions for modern businesses.
              <br />
              Empowering your digital transformation journey.
            </p>
          </div>

          {/* Resources Section */}
          <div className="flex-1 lg:text-center">
            <h4 className="text-lg font-medium text-primary mb-4">Resources</h4>
            <div className="flex gap-5 items-center justify-center">
              {navLinks?.map((link) => (
                <div key={link.href}>
                  <Link
                    key={link.href}
                    onClick={() => scrollToSection(link.label)}
                    href={
                      pathname === '/' && link.label === 'Home'
                        ? '#home'
                        : link.label === 'Contact'
                        ? '/contact'
                        : `/${link.href}`
                    }
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex-1 lg:text-right">
            <div className="flex gap-4 lg:justify-end">
              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M15.0007 2.17358H12.5007C11.3956 2.17358 10.3358 2.61257 9.55437 3.39397C8.77297 4.17537 8.33398 5.23518 8.33398 6.34025V8.84025H5.83398V12.1736H8.33398V18.8403H11.6673V12.1736H14.1673L15.0007 8.84025H11.6673V6.34025C11.6673 6.11924 11.7551 5.90728 11.9114 5.751C12.0677 5.59471 12.2796 5.50692 12.5007 5.50692H15.0007V2.17358Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M18.3327 3.84027C18.3327 3.84027 17.7493 5.59027 16.666 6.6736C17.9993 15.0069 8.83268 21.0903 1.66602 16.3403C3.49935 16.4236 5.33268 15.8403 6.66602 14.6736C2.49935 13.4236 0.416016 8.50694 2.49935 4.6736C4.33268 6.84027 7.16602 8.09027 9.99935 8.00694C9.24935 4.50694 13.3327 2.50694 15.8327 4.84027C16.7493 4.84027 18.3327 3.84027 18.3327 3.84027Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M14.166 2.17358H5.83268C3.5315 2.17358 1.66602 4.03906 1.66602 6.34025V14.6736C1.66602 16.9748 3.5315 18.8403 5.83268 18.8403H14.166C16.4672 18.8403 18.3327 16.9748 18.3327 14.6736V6.34025C18.3327 4.03906 16.4672 2.17358 14.166 2.17358Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.3337 9.98184C13.4366 10.6754 13.3181 11.3837 12.9952 12.006C12.6723 12.6284 12.1614 13.133 11.5351 13.4482C10.9088 13.7635 10.1991 13.8732 9.5069 13.7618C8.81468 13.6504 8.17521 13.3236 7.67944 12.8278C7.18367 12.332 6.85685 11.6926 6.74546 11.0004C6.63408 10.3081 6.74379 9.59842 7.05901 8.97215C7.37423 8.34589 7.8789 7.83496 8.50123 7.51204C9.12356 7.18913 9.83187 7.07067 10.5254 7.17351C11.2328 7.27841 11.8878 7.60806 12.3935 8.11377C12.8992 8.61947 13.2288 9.27441 13.3337 9.98184Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.584 5.92358H14.5923"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M13.334 7.17358C14.6601 7.17358 15.9318 7.70037 16.8695 8.63805C17.8072 9.57573 18.334 10.8475 18.334 12.1736V18.0069H15.0007V12.1736C15.0007 11.7316 14.8251 11.3076 14.5125 10.9951C14.1999 10.6825 13.776 10.5069 13.334 10.5069C12.892 10.5069 12.468 10.6825 12.1555 10.9951C11.8429 11.3076 11.6673 11.7316 11.6673 12.1736V18.0069H8.33398V12.1736C8.33398 10.8475 8.86077 9.57573 9.79845 8.63805C10.7361 7.70037 12.0079 7.17358 13.334 7.17358Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.99935 8.00684H1.66602V18.0068H4.99935V8.00684Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33268 5.50692C4.25316 5.50692 4.99935 4.76073 4.99935 3.84025C4.99935 2.91978 4.25316 2.17358 3.33268 2.17358C2.41221 2.17358 1.66602 2.91978 1.66602 3.84025C1.66602 4.76073 2.41221 5.50692 3.33268 5.50692Z"
                    stroke="#64748B"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Prodexter. All rights reserved.
          </p>
        </div>
      </MyContainer>
    </footer>
  );
};

export default Footer;
