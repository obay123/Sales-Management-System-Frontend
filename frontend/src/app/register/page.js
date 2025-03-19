"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUserApi from "@/api/UserApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, UserPlus, Moon, Sun } from "lucide-react";

// Define form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useUserApi();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference for theme on component mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      const shouldUseDarkMode = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
      setIsDarkMode(shouldUseDarkMode);
      
      if (shouldUseDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      await register(values.name, values.email, values.password);
      
      // Show success toast
      toast.success("Account created successfully", {
        description: "You can now log in with your credentials",
        duration: 5000,
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      // Show error toast
      toast.error("Failed to create account", {
        description: error.message || "Please try again",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Button 
        onClick={toggleDarkMode}
        variant="ghost" 
        size="icon" 
        className="cursor-pointer absolute top-4 right-4 rounded-full h-10 w-10 hover:bg-gray-200 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-gray-700" />
        )}
      </Button>
      
      <Card className="w-full max-w-md border shadow-lg dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
              <UserPlus className="h-8 w-8 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your password" 
                        type="password"
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="cursor-pointer w-full bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-center w-full text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}