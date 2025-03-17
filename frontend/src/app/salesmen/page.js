'use client'

import { useEffect, useState } from "react";
import useSalesmenApi from "@/api/salesmenApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";

import "../globals.css";

export default function Salesmen() {
  const [Salesmen, setSalesmen] = useState([]);

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const { getSalesmen } = useSalesmenApi();
        const data = await getSalesmen();
        setSalesmen(data.salesmen.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchSalesmen();
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
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
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
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
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
      accessorKey: "is_inactive",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
      cell: ({ row }) => {
        const status = row.getValue("is_inactive")
        return (
          <div className="flex items-center">
            <div className={`mr-2 h-2 w-2 rounded-full ${status === 0 ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        )
      },
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
      <DataTable columns={columns} data={Salesmen} filterColumn="name" />
    </div>
  );
}
