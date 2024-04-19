'use client'

import { ColumnDef, Row, RowData } from "@tanstack/react-table"
import { Item } from "./page"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

const includedInArr = <TData extends RowData>(
    row: Row<TData>,
    columnId: string,
    filterValue: string[], //resolveFilterValue will transform this to a string
) => {
    if (!filterValue || filterValue.length < 1) return true
    return filterValue.includes(row.getValue<number | string>(columnId).toString().toLowerCase().trim())
}

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
        header: ({ column }) => {
            return <div>Description</div>
        },
        cell: ({ row }) => {
            return <div className="max-w-80 truncate">{row.getValue("description")}</div>
        }
    },
    {
        accessorKey: "categoryId",
        header: "Category",
        filterFn: includedInArr
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
        header: "Container",
        filterFn: includedInArr
    },
    {
        accessorKey: "locationId",
        header: "Location",
        filterFn: includedInArr
    }
]