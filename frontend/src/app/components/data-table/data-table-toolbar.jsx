"use client";

import { X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DataTableToolbar({ table, filterColumn, addUrl, addName }) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter by ${filterColumn}...`}
          value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] lg:w-[250px]" 
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <Button
        variant="default" 
        size="sm"
        onClick={() => router.push(`${addUrl}`)}
        className="h-8 px-3 flex items-center gap-2 cursor-pointer"
      >
        <Plus className="h-4 w-4" /> {addName}
      </Button>
    </div>
  );
}
