"use client";

import { useEffect, useState } from "react";
import useCustomersApi from "@/api/CustomersApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const { getCustomers, deleteCustomer, bulkDeleteCustomers } =
    useCustomersApi();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      if (data?.customers?.data) {
        setCustomers(data.customers.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  
  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customers) => customers.id !== id)
      );
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting Customer:", error);
      toast.error("Failed to delete Customer.");
    }
  };

  const handleBulkDeleteCustomers = async (ids) => {
    try {
      await bulkDeleteCustomers(ids);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customers) => !ids.includes(customers.id))
      );
      toast.success(`${ids.length} Customer deleted successfully!`);
    } catch (error) {
      console.error("Error deleting Customer:", error);
      toast.error("Failed to delete selected Customer.");
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User ID" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "salesmen_code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salesmen Code" />
      ),
      enableSorting: true,
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "tel1",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tel 1" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "tel2",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tel 2" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "subscription_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subscription Date" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "rate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "photo_url", 
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Photo" />
      ),
      cell: ({ row }) => (
        row.original.photo_url ? (
          <img
            src={row.original.photo_url}
            alt="Customer"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          "No Image"
        )
      ),
      enableSorting: false,
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={`customers/${row.original.id}`}
          onDelete={() => handleDeleteCustomer(row.original.id)}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={customers}
        filterColumn="id"
        onDeleteSelected={handleBulkDeleteCustomers}
        addUrl="/customers/addCustomer"
        addName="Add Customer"
      />
    </div>
  );
}
