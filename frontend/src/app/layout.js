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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <html lang="en">
        <body></body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <ProtectedRoute>
          {!isAuthPage && <OverlaySidebar />}
          <main className="min-h-screen">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
