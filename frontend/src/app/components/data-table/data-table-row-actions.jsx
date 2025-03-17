"use client"

import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTableRowActions({ row, viewPath, onEdit, onDelete }) {
  const router = useRouter()
  const data = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`${viewPath}`)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(data) }>
            <Edit className="mr-2 h-4 w-4" />
            Edit 
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(data)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

