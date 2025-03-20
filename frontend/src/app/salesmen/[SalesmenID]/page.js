"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSalesmenApi from "@/api/salesmenApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useParams } from "next/navigation"

// Define form validation schema using Zod
const formSchema = z.object({
  code: z.string().min(1, { message: "Salesman code is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),
  is_inactive: z.boolean().default(false),
})

const EditSalesmanPage = () => {
  const router = useRouter()
  const params = useParams()
  const salesmanCode = params?.SalesmenID
  const { updateSalesmen, showSalesmen } = useSalesmenApi()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
  })

  // Fetch salesman data
  useEffect(() => {
    const fetchSalesmanData = async () => {
      if (!salesmanCode) return

      setIsLoading(true)
      try {
        const data = await showSalesmen(salesmanCode)
        console.log("Salesman data received:", data)

        if (data && data.salesmen) {
          const salesman = data.salesmen

          // Set form values
          form.setValue("code", salesman.code)
          form.setValue("name", salesman.name)
          form.setValue("phone", salesman.phone)
          form.setValue("address", salesman.address || "")
          form.setValue("is_inactive", Boolean(salesman.is_inactive))
        }
      } catch (error) {
        console.error("Error fetching salesman:", error)
        toast.error("Failed to load salesman", {
          description: error.message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSalesmanData()
  }, [])

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      await updateSalesmen(salesmanCode, values)

      // Show success toast with Sonner
      toast.success("Salesman updated successfully!", {
        description: `${values.name}'s information has been updated.`,
        duration: 5000,
      })

      // Navigate back to salesmen list
      router.push("/salesmen")
    } catch (error) {
      // Show error toast with Sonner
      toast.error("Error updating salesman", {
        description: error.message || "Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading salesman data...</span>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4 ">
      <Card className="dark:border-gray-800 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Salesman</CardTitle>
          <CardDescription>Update salesman information and details.</CardDescription>
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
                      <Input
                        placeholder="Enter salesman code"
                        {...field}
                        disabled // Code should be read-only in edit mode
                      />
                    </FormControl>
                    <FormDescription>A unique identifier for this salesman.</FormDescription>
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
                    <FormDescription>Contact number for the salesman.</FormDescription>
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
                      <Textarea placeholder="Enter address (optional)" className="resize-none" {...field} />
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
                      <FormDescription>Mark as inactive if this salesman is not currently active.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.push("/salesmen")} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Salesman"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditSalesmanPage

