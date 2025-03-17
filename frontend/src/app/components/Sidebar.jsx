"use client";

import React from "react";
import { Sidebar } from "primereact/sidebar";
import Link from "next/link";

const SidebarComponent = ({ visible, onHide, menuItems }) => {
  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      dismissable
      className="custom-sidebar"
    >
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900 shadow-lg">
        
        <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">Menu</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <ul className="list-none space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="flex items-center p-2 rounded-md text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <i className={`${item.icon} mr-2`}></i> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
