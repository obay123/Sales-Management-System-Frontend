"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import userApi from "@/api/UserApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

// Define form validation schema
const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = userApi();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      const response = await login(values.email, values.password);
      localStorage.setItem("token", response.token);
      
      // Show success toast
      toast.success("Login successful", {
        duration: 3000,
      });
      
      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1000);
      
    } catch (error) {
      // Show error toast
      toast.error("Login failed", {
        description: error.message || "Please check your credentials and try again",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your password" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}