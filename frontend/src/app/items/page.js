"use client";

import { useEffect, useState } from "react";
import useItemsApi from "@/api/ItemsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";



export default function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { getItems } = useItemsApi();
        const data = await getItems();
        setItems(data.items.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };
    fetchItems();
  }, []);

  const handleDeleteItem = (items) => {
    toast.error(`Deleting user: ${items.name}`, {
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={`items/${row.original.code}`}
          onDelete={handleDeleteItem}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={items} filterColumn="name" />
    </div>
  );
}
