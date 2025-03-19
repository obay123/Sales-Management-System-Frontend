"use client";

import "./globals.css";
import OverlaySidebar from "./components/OverlaySidebar";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noLayoutPages = ["/login", "/register"];
  const isAuthPage = noLayoutPages.includes(pathname);

  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        <Toaster position="top-center" richColors />
        <ProtectedRoute>
          {!isAuthPage && <OverlaySidebar />}
          <main className="min-h-screen p-6 md:p-10 lg:p-12">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
