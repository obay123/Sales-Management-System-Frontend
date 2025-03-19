"use client";

import React, { useState, useEffect } from "react";
import userApi from "@/api/UserApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  X,
  Menu,
  Home,
  User,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Package,
  Users,
  UserPlus,
  FileSpreadsheet,
  ShoppingCart,
} from "lucide-react";

const OverlaySidebar = () => {
  const { logout } = userApi();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        menuButton &&
        !menuButton.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const navLinks = [
    {
      label: "Home",
      icon: <Home size={20} />,
      href: "/",
      hasDropdown: false,
    },
    {
      label: "Salesmen",
      icon: <Users size={20} />,
      hasDropdown: true,
      items: [
        { label: "Salesmen List", href: "/salesmen" },
        { label: "Add Salemen", href: "/salesmen/addSalesmen" },
      ],
    },
    {
      label: "Customers",
      icon: <UserPlus size={20} />,
      hasDropdown: true,
      items: [
        { label: "Customers List", href: "/customers" },
        { label: "Add Customer", href: "/customers/addCustomer" },
      ],
    },
    {
      label: "Items",
      icon: <Package size={20} />,
      hasDropdown: true,
      items: [
        { label: "Items List", href: "/items" },
        { label: "Add Items", href: "/items/addItem" },
      ],
    },
    {
      label: "Invoices",
      icon: <FileSpreadsheet size={20} />,
      hasDropdown: true,
      items: [
        { label: "Invoices List", href: "/invoices" },
        { label: "Add Invoices", href: "/invoices/addInvoice" },
      ],
    },
  ];

  return (
    <>
      <button
        id="menu-button"
        onClick={toggleSidebar}
        className="cursor-pointer fixed top-4 left-4 z-30 p-2.5 rounded-full bg-gray-800 text-white shadow-lg hover:shadow-black/30 dark:hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 group"
        aria-label="Toggle sidebar"
      >
        <Menu
          size={20}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-gray-500 to-black rounded-lg flex items-center justify-center">
                <ShoppingCart size={16} color="white" className="text-white" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">
                Sales Management
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="cursor-pointer p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <nav className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link, index) => {
                const isActive = !link.hasDropdown
                  ? pathname === link.href
                  : link.items?.some((item) => item.href === pathname);
                const isDropdownOpen = openDropdown === index;

                return (
                  <li key={index} className="rounded-lg overflow-hidden">
                    {link.hasDropdown ? (
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`cursor-pointer flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-black-50 text-blue-700 dark:bg-black-900/30 dark:text-black-300 font-medium"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`${
                              isActive
                                ? "text-black dark:text-black"
                                : "text-gray-500 dark:text-gray-400"
                            } mr-3`}
                          >
                            {link.icon}
                          </span>
                          <span>{link.label}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          } ${
                            isActive
                              ? "text-black dark:text-black-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-blue-50 text-black-700 dark:bg-blue-900/30 dark:text-black-300 font-medium"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`${
                              isActive
                                ? "text-black-600 dark:text-black-400"
                                : "text-gray-500 dark:text-gray-400"
                            } mr-3`}
                          >
                            {link.icon}
                          </span>
                          <span>{link.label}</span>
                        </div>
                        {isActive && (
                          <ChevronRight
                            size={16}
                            className="text-black-600 dark:text-black-400"
                          />
                        )}
                      </Link>
                    )}

                    {link.hasDropdown && (
                      <div
                        className={`transition-all duration-200 overflow-hidden ${
                          isDropdownOpen
                            ? "max-h-64 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="pl-10 pr-3 py-1 space-y-1">
                          {link.items?.map((item, subIndex) => {
                            const isSubActive = pathname === item.href;
                            return (
                              <li key={subIndex}>
                                <Link
                                  href={item.href}
                                  className={`block p-2 rounded-md text-sm transition-all duration-200
                                    ${
                                      isSubActive
                                        ? "bg-blue-50 text-black-700 dark:bg-black-900/20 dark:text-black-900 font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                  <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mr-2"></span>
                                    {item.label}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div className="flex items-center">
                  {isDarkMode ? (
                    <Sun size={20} className="mr-3 text-amber-400" />
                  ) : (
                    <Moon size={20} className="mr-3 text-gray-500" />
                  )}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <div
                  className={`cursor-pointer w-10 h-5 rounded-full ${
                    isDarkMode ? "bg-blue-600" : "bg-gray-300"
                  } relative transition-colors duration-200`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform duration-200 ${
                      isDarkMode ? "translate-x-5 left-0.5" : "left-0.5"
                    }`}
                  ></div>
                </div>
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                  <User
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sales Manager
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors duration-200"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlaySidebar;
