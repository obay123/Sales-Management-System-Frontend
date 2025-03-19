"use client";

import { useEffect, useState } from "react";
import useItemsApi from "@/api/ItemsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../components/data-table/data-table";
import { DataTableColumnHeader } from "../components/data-table/data-table-column-header";
import { DataTableRowActions } from "../components/data-table/data-table-row-actions";
import { toast } from "sonner";

export default function Items() {
  const { getItems, deleteItem, bulkDeleteItems } = useItemsApi();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      if (data?.items?.data) {
        setItems(data.items.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.code !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete item.");
    }
  };

  const handleBulkDeleteItems = async (ids) => {
    try {
      await bulkDeleteItems(ids);
      setItems((prevItems) =>
        prevItems.filter((item) => !ids.includes(item.code))
      );
      toast.success(`${ids.length} items deleted successfully!`);
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete selected items.");
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
          onDelete={() => handleDeleteItem(row.original.code)}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={items}
        filterColumn="code"
        onDeleteSelected={handleBulkDeleteItems}
        addUrl="/items/addItem"
        addName="Add Item"
      />
    </div>
  );
}
