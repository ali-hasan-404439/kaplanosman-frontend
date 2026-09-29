/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Building,
  Building2,
  Calendar,
  CalendarSearch,
  ChevronDown,
  DollarSign,
  Folder,
  LayoutDashboard,
  LogOut,
  Logs,
  Menu,
  MessageSquare,
  Notebook,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react';

import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { logoutHandler } from '@/utils/handleLogout';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

// SUPER_ADMIN, MANAGER, COMPANY_ADMIN

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    categories: false,
    settings: false,
  });
  const pathname = usePathname();

  const role = useAppSelector(selectCurrentUser)?.role || 'COMPANY_ADMIN';
  /*   enum UserRole {
  CLIENT
  SUPER_ADMIN
  COMPANY_ADMIN
  MANAGER
  TECHNICIAN
} */
  const menuItems = [
    //super_admin
    {
      title: 'Company Management',
      href: '/dashboard',
      icon: Users,
      roles: ['SUPER_ADMIN'],
    },
    {
      title: 'Messages',
      href: '/dashboard/messages',
      icon: MessageSquare,
      roles: ['SUPER_ADMIN'],
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: ['SUPER_ADMIN'],
    },
    {
      title: 'Pricing Plans',
      href: '/dashboard/plan',
      icon: DollarSign,
      roles: ['SUPER_ADMIN'],
    },
    {
      title: 'Audit',
      href: '/dashboard/audit',
      icon: Building,
      roles: ['SUPER_ADMIN'],
    },
    //company_admin
    {
      title: 'Dashboard',
      href: '/company',
      icon: LayoutDashboard,
      roles: ['COMPANY_ADMIN'],
    },
    {
      title: 'Calendar',
      href: '/company/calendar',
      icon: Calendar,
      roles: ['COMPANY_ADMIN'],
    },
    {
      title: 'Notes',
      href: '/company/notes',
      icon: Notebook,
      roles: ['COMPANY_ADMIN'],
    },
    {
      title: 'Orders',
      href: '/company/orders',
      icon: Box,
      roles: ['COMPANY_ADMIN'],
    },
    {
      title: 'Categories',
      href: '#',
      icon: Logs,
      roles: ['COMPANY_ADMIN'],
      submenu: [
        {
          title: 'Customers',
          href: '/company/customers',
        },
        {
          title: 'Services',
          href: '/company/services',
        },
        {
          title: 'Articles',
          href: '/company/articles',
        },
        {
          title: 'Vehicles',
          href: '/company/vehicles',
        },
        {
          title: 'Technicians',
          href: '/company/technicians',
        },
        {
          title: 'Suppliers',
          href: '/company/suppliers',
        },
      ],
    },
    {
      title: 'Invoices',
      href: '/company/invoices',
      icon: ScrollText,
      roles: ['COMPANY_ADMIN'],
    },
    {
      title: 'Settings',
      href: '#',
      icon: Settings,
      roles: ['COMPANY_ADMIN'],
      submenu: [
        {
          title: 'Settings',
          href: '/company/settings',
        },
        {
          title: 'Employees',
          href: '/company/employees',
        },
        {
          title: 'Subscriptions',
          href: '/company/subscriptions',
        },
      ],
    },
    //company_manager
    {
      title: 'Dashboard',
      href: '/manager',
      icon: LayoutDashboard,
      roles: ['MANAGER'],
    },
    {
      title: 'Calendar',
      href: '/manager/calendar',
      icon: Calendar,
      roles: ['MANAGER'],
    },
    {
      title: 'Notes',
      href: '/manager/notes',
      icon: Notebook,
      roles: ['MANAGER'],
    },
    {
      title: 'Orders',
      href: '/manager/orders',
      icon: Box,
      roles: ['MANAGER'],
    },
    {
      title: 'Categories',
      href: '#',
      icon: Logs,
      roles: ['MANAGER'],
      submenu: [
        {
          title: 'Customers',
          href: '/manager/customers',
        },
        {
          title: 'Services',
          href: '/manager/services',
        },
        {
          title: 'Articles',
          href: '/manager/articles',
        },
        {
          title: 'Vehicles',
          href: '/manager/vehicles',
        },
        {
          title: 'Technicians',
          href: '/manager/technicians',
        },
        {
          title: 'Suppliers',
          href: '/manager/suppliers',
        },
      ],
    },
    {
      title: 'Invoices',
      href: '/manager/invoices',
      icon: ScrollText,
      roles: ['MANAGER'],
    },
  ].filter((item) => item.roles.includes(role));

  // Function to check if a menu item is active
  const isActive = (href: string) => pathname === href;

  // Function to toggle the submenu's visibility
  const toggleSubmenu = (submenuKey: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [submenuKey]: !prevState[submenuKey], // Toggle the specific submenu
    }));
  };

  function NavItem({
    href = '#',
    icon: Icon,
    children,
    onClick,
  }: {
    href?: string;
    icon?: React.ComponentType<any>;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }) {
    return (
      <Link
        href={href}
        className={`flex items-center px-3 py-2 text-sm md:text-base rounded-md transition-all duration-500 
        ${isActive(href) ? 'text-primary bg-white' : 'text-[#BABABA]'} 
        hover:text-primary hover:bg-white`}
        onClick={onClick}
      >
        {Icon && <Icon className="h-5 w-5 mr-3 flex-shrink-0" />}
        {children}
      </Link>
    );
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-secondary" />
      </button>
      <nav
        className={`fixed inset-y-0 left-0 z-[70] !w-72 bg-primary transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/"
            // target="_blank"
            rel="noopener noreferrer"
            className="h-16 flex items-center justify-center my-5"
          >
            <div className="flex items-center justify-center gap-3 text-center">
              <h3 className="md:text-[40px] text-center font-black text-lg font-primary hover:cursor-pointer text-white">
                ProDexter
              </h3>
            </div>
          </Link>

          <div className="scrollbar-custom flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      <NavItem
                        href={item.href}
                        icon={item.icon}
                        onClick={() => {
                          // Toggle submenu if item has submenu
                          if (item.submenu) {
                            toggleSubmenu(item.title.toLowerCase());
                          }
                        }}
                      >
                        {item.title}
                        {item.submenu && (
                          <ChevronDown
                            className={`ml-2 h-4 w-4 transition-transform duration-300 transform ${
                              openSubmenus[item.title.toLowerCase()]
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        )}
                      </NavItem>

                      {/* Submenu items */}
                      {item.submenu &&
                        openSubmenus[item.title.toLowerCase()] && (
                          <div className="ml-10 space-y-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <NavItem key={subIndex} href={subItem.href}>
                                {subItem.title}
                              </NavItem>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="space-y-1">
              <NavItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center"
                >
                  <LogOut size={35} className="h-5 w-5 mr-3" />
                  <span className="text-sm md:text-base text-secondary">
                    Logout
                  </span>
                </button>
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-primary bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
