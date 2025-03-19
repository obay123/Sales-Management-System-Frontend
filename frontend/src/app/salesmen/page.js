"use client";

import { useEffect, useState } from "react";
import useSalesmenApi from "@/api/salesmenApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";

export default function Salesmen() {
  const { getSalesmen, deleteSalesmen, bulkDeleteSalesmen } = useSalesmenApi();
  const [salesmen, setSalesmen] = useState([]);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const data = await getSalesmen();

      if (data?.salesmen?.data) {
        setSalesmen(data.salesmen.data);
      } else {
        setSalesmen([]);
      }
    } catch (error) {
      console.error("Error fetching salesmen:", error);
    }
  };

  const handleDeleteSalemen = async (id) => {
    try {
      await deleteSalesmen(id);
      setSalesmen((prevSalesmen) =>
        prevSalesmen.filter((salesmen) => salesmen.code !== id)
      );
      toast.success("Salesmen deleted successfully!");
    } catch (error) {
      console.error("Error deleting Salesmen:", error);
      toast.error("Failed to delete Salesmen.");
    }
  };

  const handleBulkDeleteSalesmen = async (ids) => {
    try {
      console.log("Deleting salesmen with IDs:", ids);
      await bulkDeleteSalesmen(ids);
      setSalesmen((prevSalesmen) =>
        prevSalesmen.filter((salesmen) => !ids.includes(salesmen.code))
      );
      toast.success(`${ids.length} salesmen deleted successfully!`);
    } catch (error) {
      console.error("Error deleting salemen:", error);
      toast.error("Failed to delete selected salemen.");
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Active" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("is_inactive");
        return (
          <div className="flex items-center">
            <div
              className={`mr-2 h-2 w-2 rounded-full ${
                status === 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={`salesmen/${row.original.code}`}
          onDelete={() => handleDeleteSalemen(row.original.code)}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={salesmen}
        filterColumn="name"
        onDeleteSelected={handleBulkDeleteSalesmen}
        addUrl="/salesmen/addSalesmen"
        addName="Add Saleman"
      />
    </div>
  );
}
