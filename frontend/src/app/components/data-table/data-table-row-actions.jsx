"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DataTableRowActions({ row, onEdit, onDelete }) {
  const router = useRouter();
  const data = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-gray-900">
        {onEdit && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => router.push(`${onEdit}`)}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4 text-gray-600" />
              Edit
            </button>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            {onEdit && <DropdownMenuSeparator />}
            <div className="w-full flex items-center px-3 py-2 text-sm text-red-600 cursor-pointer rounded-md hover:bg-gray-800">
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="w-full flex items-center text-sm text-red-600 cursor-pointer">
                      <Trash className="mr-4 h-4 w-4 " />
                      Delete
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => onDelete(data)}
                      >
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
