"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useInvoicesApi from "@/api/InvoicesApi";
import useItemsApi from "@/api/ItemsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { format, parse } from "date-fns";
import useCustomersApi from "@/api/CustomersApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
// Define form validation schema using Zod
const invoiceItemSchema = z.object({
  item_code: z.string().min(1, { message: "Item code is required" }),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be positive" }),
  unit_price: z.coerce
    .number()
    .nonnegative({ message: "Price cannot be negative" }),
});

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer is required" }),
  date: z.date(),
  items: z.array(invoiceItemSchema).min(1, {
    message: "At least one item is required",
  }),
});

const EditInvoicePage = () => {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.InvoiceID;
  const { updateInvoice, showInvoice } = useInvoicesApi();
  const { getItemsCode } = useItemsApi();
  const { getCustomersName } = useCustomersApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      date: new Date(),
      items: [{ item_code: "", quantity: 1, unit_price: 0 }],
    },
  });

  // Setup field array for dynamic invoice items
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });
  // Fetch invoice data
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoiceId) return;

      setIsLoading(true);
      try {
        const data = await showInvoice(invoiceId);
        console.log("Invoice data received:", data);
        // setIsLoading(false)
        if (data && data.invoice) {
          const invoice = data.invoice;

          // Format the date
          let invoiceDate;
          try {
            invoiceDate = parse(invoice.date, "yyyy-MM-dd", new Date());
          } catch (error) {
            console.error("Error parsing date:", error);
            invoiceDate = new Date();
          }

          // Set form values
          form.setValue("customer_id", invoice.customer_id.toString());
          form.setValue("date", invoiceDate);

          // Format items
          const formattedItems = invoice.items.map((item) => ({
            item_code: item.code,
            quantity: item.pivot.quantity,
            unit_price: Number.parseFloat(item.pivot.unit_price),
          }));

          // Replace items in the form
          replace(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error("Failed to load invoice", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, []);

  useEffect(() => {
    const fetchCustomerNames = async () => {
      setIsLoadingCustomers(true);
      try {
        const data = await getCustomersName();
        console.log("Customer data received:", data);
        if (data && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          console.error("Invalid customers data format:", data);
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers", {
          description: error.message,
        });
        setCustomers([]);
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomerNames();
  }, []);

  useEffect(() => {
    const fetchItemsCode = async () => {
      setIsLoadingItems(true);
      try {
        const data = await getItemsCode();
        console.log("Items data received:", data);
        if (data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          console.error("Invalid items data format:", data);
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load items", {
          description: error.message,
        });
        setItems([]);
      } finally {
        setIsLoadingItems(false);
      }
    };
    fetchItemsCode();
  }, []);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Format the data as required by your API
      const invoiceData = {
        customer_id: values.customer_id,
        date: format(values.date, "yyyy-MM-dd"),
        items: values.items.map((item) => ({
          item_code: item.item_code,
          quantity: Number.parseInt(item.quantity),
          unit_price: Number.parseFloat(item.unit_price),
        })),
      };

      await updateInvoice(invoiceId, invoiceData);

      toast.success("Invoice updated successfully", {
        description: `Invoice has been updated successfully.`,
      });

      // Navigate back to invoices list or detail page
      router.push("/invoices");
    } catch (error) {
      toast.error("Error updating invoice", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate invoice total
  const calculateTotal = () => {
    return form
      .watch("items")
      .reduce(
        (sum, item) =>
          sum + (Number(item.quantity) * Number(item.unit_price) || 0),
        0
      );
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading invoice data...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card className="gray-800 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Invoice</CardTitle>
          <CardDescription>Update invoice details and items.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Customer</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoadingCustomers}
                            >
                              {isLoadingCustomers ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : field.value ? (
                                customers.find(
                                  (customer) =>
                                    customer.id.toString() === field.value
                                )?.name || "Select customer"
                              ) : (
                                "Select customer"
                              )}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search customers..." />
                            <CommandList>
                              <CommandEmpty>No customer found.</CommandEmpty>
                              <CommandGroup>
                                {Array.isArray(customers) &&
                                  customers.map((customer) => (
                                    <CommandItem
                                      key={customer.id}
                                      value={customer.name}
                                      onSelect={(currentValue) => {
                                        const selectedCustomer = customers.find(
                                          (c) =>
                                            c.name.toLowerCase() ===
                                            currentValue.toLowerCase()
                                        );
                                        if (selectedCustomer) {
                                          form.setValue(
                                            "customer_id",
                                            selectedCustomer.id.toString(),
                                            {
                                              shouldValidate: true,
                                              shouldDirty: true,
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      {customer.name}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Picker */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Invoice Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-base">Invoice Items</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ item_code: "", quantity: 1, unit_price: 0 })
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Item Code</TableHead>
                        <TableHead className="w-[20%]">Quantity</TableHead>
                        <TableHead className="w-[25%]">Unit Price</TableHead>
                        <TableHead className="w-[15%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.item_code`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              "w-full justify-between",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                            disabled={isLoadingItems}
                                          >
                                            {isLoadingItems ? (
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : field.value ? (
                                              items.find(
                                                (item) =>
                                                  item.code === field.value
                                              )?.name || "Select item"
                                            ) : (
                                              "Select item"
                                            )}
                                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                          <CommandInput placeholder="Search items..." />
                                          <CommandList>
                                            <CommandEmpty>
                                              No item found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {Array.isArray(items) &&
                                                items.map((item) => (
                                                  <CommandItem
                                                    key={item.code}
                                                    value={item.name}
                                                    onSelect={(
                                                      currentValue
                                                    ) => {
                                                      const selectedItem =
                                                        items.find(
                                                          (i) =>
                                                            i.name.toLowerCase() ===
                                                            currentValue.toLowerCase()
                                                        );
                                                      if (selectedItem) {
                                                        form.setValue(
                                                          `items.${index}.item_code`,
                                                          selectedItem.code,
                                                          {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                          }
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    {item.name}
                                                  </CommandItem>
                                                ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      min="1"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.unit_price`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={fields.length <= 1}
                              onClick={() => remove(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {form.formState.errors.items?.root && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.items.root.message}
                  </p>
                )}
              </div>

              {/* Invoice Total */}
              <div className="flex justify-end space-x-2 text-right m-2">
                <div className="font-semibold">Invoice Total:</div>
                <div>${calculateTotal().toFixed(2)}</div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/invoices")}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Invoice"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EditInvoicePage;
