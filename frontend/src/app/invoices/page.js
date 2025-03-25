"use client";
import { useEffect, useState } from "react";
import useInvoicesApi from "@/api/InvoicesApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";

export default function Invoices() {
  const filterEquals = (row, columnId, filterValue) => {
    return String(row.getValue(columnId)) === String(filterValue);
  };
  const [invoices, setInvoices] = useState([]);
  const { getInvoices, deleteInvoice, bulkDeleteInvoices } = useInvoicesApi();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      if (data?.invoices?.data) {
        setInvoices(data.invoices.data);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await deleteInvoice(id);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((Invoice) => Invoice.id !== id)
      );
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting Invoice:", error);
      toast.error("Failed to delete Invoice.");
    }
  };

  const handleBulkDeleteInvoices = async (ids) => {
    try {
      await bulkDeleteInvoices(ids);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((Invoice) => !ids.includes(Invoice.id))
      );
      toast.success(`${ids.length} Invoices deleted successfully!`);
    } catch (error) {
      console.error("Error deleting Invoices:", error);
      toast.error("Failed to delete selected Invoices.");
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
      filterFn: filterEquals,
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User ID" />
      ),
      enableSorting: true,
      filterFn: filterEquals,
    },
    {
      accessorKey: "customer_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer ID" />
      ),
      enableSorting: true,
      filterFn: filterEquals,
    },

    {
      accessorKey: "total_quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Quantity" />
      ),
      enableSorting: true,
      filterFn: filterEquals,
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Price" />
      ),
      enableSorting: true,
      filterFn: filterEquals,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      enableSorting: true,
      filterFn: filterEquals,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={`invoices/${row.original.id}`}
          onDelete={() => handleDeleteInvoice(row.original.id)}
        />
      ),
    },
  ];

  const filterableColumns = [
    "id",
    "user_id",
    "customer_id",
    "total_quantity",
    "total_price",
    "date",
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={invoices}
        filterableColumns={filterableColumns}
        onDeleteSelected={handleBulkDeleteInvoices}
        addUrl="/invoices/addInvoice"
        addName="Add Invoice"
        exportName="invoices"
      />
    </div>
  );
}
