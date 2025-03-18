"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const noAuthPages = ["/login", "/register"];
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("Token"); 

      if (!token && !noAuthPages.includes(pathname)) {


        toast.error("Login First", {
          description: "Redirecting to login...",
          duration: 2000,
        });

        setTimeout(() => {
          router.replace("/login"); 
        }, 2000);
      } else {
        setIsAuthChecked(true);
      }
    }
  }, [pathname, router]);

  if (!isAuthChecked) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
