"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Item } from "./page"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { ArrowDown, ChevronDown, DeleteIcon, Power } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    
    function getFilterFromData(columnName: string) : DropdownFilter[] {
        var filter: DropdownFilter[] = [];
        var uniqueEntries = (data as Item[]).map((item: any) => item[columnName]).filter((x, i, a) => a.indexOf(x) == i)
    
        for (let item of uniqueEntries) {
            filter.push({
                ID: item,
                checked: false
            })
        }

        return filter
    }

    const [locationFilter, setLocationFilter] = useState<DropdownFilter[]>(getFilterFromData('locationId'))
    const [containerFilter, setContainerFilter] = useState<DropdownFilter[]>(getFilterFromData('containerId'))
    const [categoryFilter, setCategoryFilter] = useState<DropdownFilter[]>(getFilterFromData('categoryId'))

    function locationCheckChanged(locationID: number, checked: boolean) {
        if(locationID < 0) setLocationFilter(getFilterFromData('locationId'))
        else setLocationFilter(locationFilter.map(item => (item.ID == locationID ? {ID: item.ID, checked: checked} : item)))        
    }

    function containerCheckChanged(containerID: number, checked: boolean) {
        if(containerID < 0) setContainerFilter(getFilterFromData('containerId'))
        else setContainerFilter(containerFilter.map(item => (item.ID == containerID ? {ID: item.ID, checked: checked} : item)))        
    }

    function categoryCheckChanged(categoryID: number, checked: boolean) {
        if(categoryID < 0) setCategoryFilter(getFilterFromData('categoryId'))
        else setCategoryFilter(categoryFilter.map(item => (item.ID == categoryID ? {ID: item.ID, checked: checked} : item)))        
    }

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of locationFilter) {
            if(item.checked)
                filterValues.push(item.ID.toString())
        }
        table.getColumn('locationId')?.setFilterValue(filterValues.length > 0 ? filterValues : []) 
    }, [locationFilter]);

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of containerFilter) {
            if(item.checked)
                filterValues.push(item.ID.toString())
        }
        table.getColumn('containerId')?.setFilterValue(filterValues.length > 0 ? filterValues : []) 
    }, [containerFilter]);

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of categoryFilter) {
            if(item.checked)
                filterValues.push(item.ID.toString())
        }
        table.getColumn('categoryId')?.setFilterValue(filterValues.length > 0 ? filterValues : []) 
    }, [categoryFilter]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    })

    return (
        <div className="h-full max-h-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Name"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className=""
                />

                <Input
                    placeholder="Description"
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("description")?.setFilterValue(event.target.value)
                    }
                    className="ml-4"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="ml-4">
                        <Button variant="outline" className="rounded-r-none">Locations
                            <ChevronDown width={16} height={16} className="ml-2"/>
                        </Button>
                        
                    </DropdownMenuTrigger>
                    <Button variant="outline" className="rounded-l-none"
                    onClick={() => locationCheckChanged(-1, false)}>
                            <Power width={16} height={16}/>
                    </Button>
                    <DropdownMenuContent className="">
                        {
                            locationFilter.map((location, index) => {
                                return <DropdownMenuCheckboxItem
                                checked={location.checked}
                                onCheckedChange={(e) => locationCheckChanged(location.ID, e)}
                                key={location.ID}
                            >
                                {location.ID}
                            </DropdownMenuCheckboxItem>
                            })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="ml-4">
                        <Button variant="outline" className="rounded-r-none">Containers
                            <ChevronDown width={16} height={16} className="ml-2"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <Button variant="outline" className="rounded-l-none"
                    onClick={() => containerCheckChanged(-1, false)}>
                            <Power width={16} height={16}/>
                    </Button>
                    <DropdownMenuContent className="">
                        {
                            containerFilter.map((container, index) => {
                                return <DropdownMenuCheckboxItem
                                checked={container.checked}
                                onCheckedChange={(e) => containerCheckChanged(container.ID, e)}
                                key={container.ID}
                            >
                                {container.ID}
                            </DropdownMenuCheckboxItem>
                            })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="ml-4">
                        <Button variant="outline" className="rounded-r-none">Categories
                            <ChevronDown width={16} height={16} className="ml-2"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <Button variant="outline" className="rounded-l-none" 
                    onClick={() => categoryCheckChanged(-1, false)}>
                            <Power width={16} height={16}/>
                    </Button>
                    <DropdownMenuContent className="">
                        {
                            categoryFilter.map((category, index) => {
                                return <DropdownMenuCheckboxItem
                                checked={category.checked}
                                onCheckedChange={(e) => categoryCheckChanged(category.ID, e)}
                                key={category.ID}
                            >
                                {category.ID}
                            </DropdownMenuCheckboxItem>
                            })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border border-muted-foreground/40">
                <Table>
                    <TableHeader className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}

                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="absolute -bottom-16 right-0 flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export type DropdownFilter = {
    ID: number,
    checked: Checked
}