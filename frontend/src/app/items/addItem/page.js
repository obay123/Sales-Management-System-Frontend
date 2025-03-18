"use client"
import React, { useState } from "react";
import useItemsApi from "@/api/ItemsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Define form validation schema using Zod
const formSchema = z.object({
  code: z.string().min(1, { message: "Item code is required" }),
  name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().optional(),
});

const AddItemPage = () => {
  const { addItem } = useItemsApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      await addItem(values);
      
      // Show success toast with Sonner
      toast.success("Item added successfully!", {
        description: `Item "${values.name}" has been created.`,
        duration: 5000,
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      // Show error toast with Sonner
      toast.error("Error adding item", {
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
          <CardTitle className="text-2xl">Add New Item</CardTitle>
          <CardDescription>
            Create a new item with a unique code, name, and optional description.
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
                    <FormLabel>Item Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item code" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for this item.
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
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The display name of this item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter item description (optional)" 
                        className="resize-none min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide additional details about this item.
                    </FormDescription>
                    <FormMessage />
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
                  "Add Item"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Sonner Toaster component */}
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default AddItemPage;