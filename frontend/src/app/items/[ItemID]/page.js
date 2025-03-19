"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useItemsApi from "@/api/ItemsApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useParams } from "next/navigation"

// Define form validation schema using Zod
const formSchema = z.object({
  code: z.string().min(1, { message: "Item code is required" }),
  name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().optional(),
})

const EditItemPage = () => {
  const router = useRouter()
  const params = useParams()
  const itemCode = params?.ItemID
  const { updateItem, showItem } = useItemsApi()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  })

  // Fetch item data
  useEffect(() => {
    const fetchItemData = async () => {
      if (!itemCode) return

      setIsLoading(true)
      try {
        const data = await showItem(itemCode)
        console.log("Item data received:", data)

        if (data && data.item) {
          const item = data.item

          // Set form values
          form.setValue("code", item.code)
          form.setValue("name", item.name)
          form.setValue("description", item.description || "")
        }
      } catch (error) {
        console.error("Error fetching item:", error)
        toast.error("Failed to load item", {
          description: error.message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchItemData()
  }, [])

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Format the data as required by your API
      const itemData = {
        code: values.code,
        name: values.name,
        description: values.description,
      }

      await updateItem(itemCode, itemData)

      toast.success("Item updated successfully", {
        description: `Item ${values.name} has been updated successfully.`,
      })

      // Navigate back to items list
      router.push("/items")
    } catch (error) {
      toast.error("Error updating item", {
        description: error.message || "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading item data...</span>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Item</CardTitle>
          <CardDescription>Update item details.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Item Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter item code"
                        {...field}
                        disabled // Usually item codes shouldn't be editable
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter item description" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/items")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Item"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default EditItemPage

