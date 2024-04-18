'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Item } from "./page"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "itemId",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "description",
        header: ({column}) => {
            return <div>Description</div>
        },
        cell: ({row}) => {
            return <div className="max-w-80 truncate">{row.getValue("description")}</div>
        }
    },
    {
        accessorKey: "categoryId",
        header: "Category"
    },
    {
        accessorKey: "originalPrice",
        header: "Price"
    },
    {
        accessorKey: "purchaseDate",
        header: "Purchase Date"
    },
    {
        accessorKey: "warrantyInfo",
        header: "Warranty"
    },
    {
        accessorKey: "containerId",
        header: "Container"
    },
    {
        accessorKey: "locationId",
        header: "Location"
    }
]