"use client";

import { useState } from "react";
import { X, Plus, Filter } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DataTableToolbar({
  table,
  filterableColumns = [],
  addUrl,
  addName,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  // Get unique values for select filters
  const getUniqueValues = (columnId) => {
    const values = new Set();
    table.getPreFilteredRowModel().rows.forEach((row) => {
      const value = row.getValue(columnId);
      if (value !== undefined && value !== null) {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  // Get column header display text
  const getColumnHeaderText = (column) => {
    const header = column.columnDef.header;
    // If header is a string, return it
    if (typeof header === "string") {
      return header;
    }
    // If header is not available, use the column ID
    return column.id.charAt(0).toUpperCase() + column.id.slice(1);
  };

  // Get filter component based on column type
  const getFilterInput = (column) => {
    const columnId = column.id;
    const uniqueValues = getUniqueValues(columnId);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between cursor-pointer"
          >
            {column.getFilterValue()?.toString() || "All"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 cursor-pointer">
          <Command className="dark:bg-gray-900">
            <CommandInput placeholder={`Filter ${columnId}...`} />
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {/* 'All' Option */}
              <CommandItem
                value="all"
                onSelect={() => column.setFilterValue(undefined)}
                className={`
                  cursor-pointer
                  hover:bg-gray-100
                  dark:hover:bg-gray-800
                  ${
                    column.getFilterValue() === undefined
                      ? "dark:bg-gray-800 text-white font-medium"
                      : ""
                  }
                `}
              >
                All
              </CommandItem>

              {/* Unique Value Options */}
              {uniqueValues.map((value) => {
                const isSelected = column.getFilterValue() === value;
                return (
                  <CommandItem
                    key={value}
                    value={value.toString()}
                    onSelect={(val) => {
                      const actualValue = uniqueValues.find(
                        (v) => v.toString() === val
                      );
                      column.setFilterValue(actualValue);
                    }}
                    className={`
                      cursor-pointer
                      hover:bg-gray-100
                      dark:hover:bg-gray-800
                      ${
                        isSelected
                          ? "dark:bg-gray-800 text-white font-medium"
                          : ""
                      }
                    `}
                  >
                    {value}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 cursor-pointer">
            <Filter className="mr-2 h-4 w-4 " />
            Filter
            {isFiltered && (
              <Badge
                variant="outline"
                className="ml-1 rounded-sm p-1 gap-1 dark:bg-gray-700"
              >
                {table.getState().columnFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[230px] p-0 dark:bg-gray-800"
          align="start"
        >
          <div className="p-2 grid gap-4">
            <div className="font-medium">Filter by column</div>
            <Separator />
            <ScrollArea className="max-h-[400px]">
              <div className="grid gap-3 ">
                {filterableColumns.map((columnId) => {
                  const column = table.getColumn(columnId);
                  if (!column) return null;

                  return (
                    <div key={columnId} className="grid gap-1">
                      <div className="text-sm font-medium ">
                        {getColumnHeaderText(column)}
                      </div>
                      <div>{getFilterInput(column)}</div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filters */}
      <div className="flex flex-wrap gap-1">
        {table.getState().columnFilters.map((filter) => {
          const column = table.getColumn(filter.id);
          if (!column) return null;

          return (
            <Badge
              key={filter.id}
              variant="outline"
              className="flex items-center gap-1 dark:bg-gray-800"
            >
              <span>
                {getColumnHeaderText(column)}: {filter.value}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-4 w-4 p-0 cursor-pointer dark:bg-gray-700"
                onClick={() => column.setFilterValue(undefined)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          );
        })}

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 flex items-center gap-2 cursor-pointer"
            onClick={() => table.resetColumnFilters()}
          >
            Reset filters
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`${addUrl}`)}
          className="h-8 px-3 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {addName}
        </Button>
      </div>
    </div>
  );
}
