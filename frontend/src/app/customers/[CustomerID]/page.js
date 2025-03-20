"use client"
import { useState, useEffect } from "react"
import useCustomersApi from "@/api/CustomersApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Loader2, X, CheckCircle2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"

// Define form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  tel1: z.string().min(1, { message: "Primary telephone is required" }),
  tel2: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  subscription_date: z.date(),
  rate: z.coerce.number().nonnegative({ message: "Rate cannot be negative" }),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length)
        : [],
    ),
  salesmen_code: z.string().min(1, { message: "Salesman code is required" }),
  photo: z.instanceof(File).optional(),
})

const EditCustomerPage = () => {
  const params = useParams()
  const router = useRouter()
  const customerId = params?.CustomerID
  const { updateCustomer, showCustomer } = useCustomersApi()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState(null)
  const [photoChanged, setPhotoChanged] = useState(false)
  const [photoRemoved, setPhotoRemoved] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tel1: "",
      tel2: "",
      address: "",
      gender: "",
      subscription_date: new Date(),
      rate: 0,
      tags: "",
      salesmen_code: "",
      photo: undefined,
    },
  })

  // Fetch customer data when component mounts
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true)
        const response = await showCustomer(customerId)
        const customer = response.customer

        // Format tags from array to comma-separated string
        const tagsString = customer.tags && Array.isArray(customer.tags) ? customer.tags.join(", ") : ""

        // Parse the subscription date
        const subscriptionDate = customer.subscription_date ? parseISO(customer.subscription_date) : new Date()

        // Set form values
        form.reset({
          name: customer.name || "",
          tel1: customer.tel1 || "",
          tel2: customer.tel2 || "",
          address: customer.address || "",
          gender: customer.gender || "",
          subscription_date: subscriptionDate,
          rate: customer.rate || 0,
          tags: tagsString,
          salesmen_code: customer.salesmen_code || "",
          // Don't set photo here as it's handled separately
        })

        // If there's a photo URL, set the preview
        if (customer.photo_url) {
          setOriginalPhotoUrl(customer.photo_url) // Set the full photo URL from the response
          setPhotoPreview(customer.photo_url) // Set the preview URL for the image
        }
      } catch (error) {
        toast.error("Error loading customer data", {
          description: error.message || "Please try again",
        })
        console.error("Error fetching customer:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (customerId) {
      fetchCustomerData()
    }
  }, [customerId])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.setValue("photo", file)
      setPhotoChanged(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    form.setValue("photo", undefined)
    setPhotoPreview(null)
    setPhotoChanged(true)
    setPhotoRemoved(true)
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Prepare the data
      const customerData = {
        ...values,
        subscription_date: format(values.subscription_date, "yyyy-MM-dd"),
        rate: Number.parseFloat(values.rate),
      }

      // Handle photo changes
      if (photoRemoved) {
        // If photo was removed, explicitly set photo to null or empty string
        // depending on what your API expects for removal
        customerData.photo = null // or "" if your API expects empty string
      } else if (!photoChanged) {
        // If photo wasn't changed, don't include it in the update
        delete customerData.photo
      }
      // If photo was changed but not removed, keep the File object

      // Log the data being sent (for debugging)
      console.log("Updating customer data:", customerData)

      // Call API
      await updateCustomer(customerId, customerData)

      toast.success("Customer updated successfully", {
        description: `Customer ${values.name} has been updated successfully.`,
      })

      // Navigate back to customers page after successful update
      router.push("/customers")
    } catch (error) {
      toast.error("Error updating customer", {
        description: error.message || "Please try again",
      })
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading customer data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Customer</CardTitle>
          <CardDescription>Update customer information.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Salesman Code */}
                <FormField
                  control={form.control}
                  name="salesmen_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salesman Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter salesman code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tel1 */}
                <FormField
                  control={form.control}
                  name="tel1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter primary phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tel2 */}
                <FormField
                  control={form.control}
                  name="tel2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter secondary phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subscription Date */}
                <FormField
                  control={form.control}
                  name="subscription_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Subscription Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rate */}
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" min="0" max="5" placeholder="Enter customer rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tags" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload */}
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Customer Photo</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2 items-center">
                          <div className="w-full max-w-[200px] mx-auto">
                            {photoPreview && (
                              <img
                                className="w-full object-cover h-[200px] rounded-md border"
                                src={photoPreview || "/placeholder.svg"}
                                alt="Customer Photo Preview"
                              />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => document.querySelector('input[type="file"]').click()}
                            >
                              Choose Photo
                            </Button>
                            {photoPreview && !photoRemoved && (
                              <Button variant="destructive" className="w-full" onClick={handleRemovePhoto}>
                                Remove Photo
                              </Button>
                            )}
                          </div>
                          <input
                            type="file"
                            {...fieldProps}
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => router.push("/customers")}>
                Cancel
              </Button>
              <Button variant="default" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Exit
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default EditCustomerPage

