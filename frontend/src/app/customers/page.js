'use client'

import { useEffect, useState } from "react";
import useCustomersApi from "@/api/CustomersApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";


export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { getCustomers } = useCustomersApi();
        const data = await getCustomers();
        setCustomers(data.customers.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleEditUser = (user) => {
    toast.info(`Editing user: ${user.name}`, {
      description: "You can modify the user details.",
    });
  };
  // Handle delete user
  const handleDeleteUser = (user) => {
    toast.error(`Deleting user: ${user.name}`, {
      description: "This action cannot be undone.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo delete"),
      },
    });
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
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
      accessorKey: "photo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Photo" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "tag",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tag" />
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          viewPath="/example/users"
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={customers} filterColumn="name" />
    </div>
  );
}


