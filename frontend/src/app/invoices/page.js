'use client'
import { useEffect, useState } from "react";
import useInvoicesApi from "@/api/InvoicesApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";




export default function Invoices() {
  const [invoices, setInvioces] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { getInvoices } = useInvoicesApi();
        const data = await getInvoices();
        setInvioces(data.invoices.data);
        
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
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
      accessorKey: "customer_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer ID" />
      ),
      enableSorting: true,
    },
    
    {
      accessorKey: "total_quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Quantity" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Price" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
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
      <DataTable columns={columns} data={invoices} filterColumn="id" />
    </div>
  );
}

