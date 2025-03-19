"use client"
import React, { useState } from "react";
import useSalesmenApi from "@/api/salesmenApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Define form validation schema using Zod
const formSchema = z.object({
  code: z.string().min(1, { message: "Salesman code is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),
  is_inactive: z.boolean().default(false),
});

const AddSalesmanPage = () => {
  const { addSalesmen } = useSalesmenApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      phone: "",
      address: "",
      is_inactive: false,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      await addSalesmen(values);
      
      // Show success toast with Sonner
      toast.success("Salesman added successfully!", {
        description: `${values.name} has been added to your team.`,
        duration: 5000,
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      // Show error toast with Sonner
      toast.error("Error adding salesman", {
        description: error.message || "Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Salesman</CardTitle>
          <CardDescription>
            Add a new salesman to your team with their contact details.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salesman Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter salesman code" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for this salesman.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Contact number for the salesman.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter address (optional)" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_inactive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Inactive Status</FormLabel>
                      <FormDescription>
                        Mark as inactive if this salesman is not currently active.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Salesman"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSalesmanPage;