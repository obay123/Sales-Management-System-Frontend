"use client";

import React, { useState } from "react";
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
import { Loader2, UserPlus } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter>
          <div className="text-center w-full text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    
    </div>
  );
}