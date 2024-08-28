'use client'

import { ColumnDef, Row, RowData } from "@tanstack/react-table"
import {Item, ItemRow} from "@/models/item"
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

export const columns: ColumnDef<ItemRow>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="m-0"
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
            return <div className="max-w-60 truncate">
                {
                    row.getValue("description")
                        ? row.getValue("description")
                        : <span className="text-muted-foreground">NULL</span>
                    }
            </div>
        }
    },
    {
        accessorKey: "category_name",
        header: "Category",
        filterFn: includedInArr
    },
    {
        accessorKey: "original_price",
        header: "Price",
        cell: ({ row }) => {
            return <div className="max-w-80 truncate">
                {
                    row.getValue("original_price")
                        ? row.getValue("original_price")
                        : <span className="text-muted-foreground">NULL</span>
                }
            </div>
        }
    },
    {
        accessorKey: "purchase_date",
        header: "Bough On",
        cell: ({ row }) => {
            return <div className="max-w-80 truncate">
                {
                    row.getValue("purchase_date")
                        ? row.getValue("purchase_date")
                        : <span className="text-muted-foreground">NULL</span>
                }
            </div>
        }
    },
    {
        accessorKey: "warranty_info",
        header: "Warranty",
        cell: ({ row }) => {
            return <div className="max-w-60 truncate">
                {
                    row.getValue("warranty_info")
                        ? row.getValue("warranty_info")
                        : <span className="text-muted-foreground">NULL</span>
                }
            </div>
        }
    },
    {
        accessorKey: "location_name",
        header: "Location",
        filterFn: includedInArr
    },
    {
        accessorKey: "container_name",
        header: "Container",
        filterFn: includedInArr
    }
]