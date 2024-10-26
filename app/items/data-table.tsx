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
import { Item } from "@/models/item"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
    ArrowDown,
    ChevronDown, ChevronsUpDown,
    DeleteIcon,
    LucideChevronLeft,
    LucideChevronRight,
    LucideFilter,
    Power
} from "lucide-react"
import {userStore} from "@/lib/userStore";
import {getAllContainers, getCategoriesForUser, getLocations} from "@/data/db-actions";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

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
    
    // function getFilterFromData(columnName: string) : DropdownFilter[] {
    //     var filter: DropdownFilter[] = [];
    //     var uniqueEntries = (data as Item[]).map((item: any) => item[columnName]).filter((x, i, a) => a.indexOf(x) == i)
    //
    //     for (let item of uniqueEntries) {
    //         filter.push({
    //             ID: item,
    //             checked: false
    //         })
    //     }
    //
    //     return filter
    // }

    const [locationFilter, setLocationFilter] = useState<DropdownFilter[]>([])
    const [containerFilter, setContainerFilter] = useState<DropdownFilter[]>([])
    const [categoryFilter, setCategoryFilter] = useState<DropdownFilter[]>([])

    const {user} = userStore()

    async function getLocationsForUser() {
        var response = await getLocations(user?.id ?? "")
        if(response.success && response.data) {
            setLocationFilter(response.data.map(location => ({ID: location.id, name: location.name, checked: false})))
        }
    }

    async function getContainersForUser() {
        var response = await getAllContainers(user?.id ?? "")
        if(response.success && response.data) {
            setContainerFilter(response.data.map(container => ({ID: container.id, name: container.name, checked: false})))
        }
    }

    async function getCategoriesForUserr() {
        var response = await getCategoriesForUser(user?.id ?? "")
        if(response.success && response.data) {
            setCategoryFilter(response.data.map(category => ({ID: category.id, name: category.name, checked: false})))
        }
    }


    function locationCheckChanged(locationName: string, checked: boolean) {
        if(!locationName) setLocationFilter(locationFilter.map(item => ({ID: item.ID, checked: false, name: item.name})))
        else setLocationFilter(locationFilter.map(item => (item.name == locationName ? {ID: item.ID, checked: checked, name: item.name} : item)))
    }

    function containerCheckChanged(containerName: string, checked: boolean) {
        if(!containerName) setContainerFilter(containerFilter.map(item => ({ID: item.ID, checked: false, name: item.name})))
        else setContainerFilter(containerFilter.map(item => (item.name == containerName ? {ID: item.ID, checked: checked, name: item.name} : item)))
    }

    function categoryCheckChanged(categoryName: string, checked: boolean) {
        if(!categoryName) setCategoryFilter(categoryFilter.map(item => ({ID: item.ID, checked: false, name: item.name})))
        else setCategoryFilter(categoryFilter.map(item => (item.name == categoryName ? {ID: item.ID, checked: checked, name: item.name} : item)))
    }

    useEffect(() => {
        getLocationsForUser()
        getContainersForUser()
        getCategoriesForUserr()
    }, [user])

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of locationFilter) {
            if(item.checked)
                filterValues.push(item.name)
        }
        table.getColumn('location_name')?.setFilterValue(filterValues.length > 0 ? filterValues : [])
    }, [locationFilter]);

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of containerFilter) {
            if(item.checked)
                filterValues.push(item.name)
        }
        table.getColumn('container_name')?.setFilterValue(filterValues.length > 0 ? filterValues : [])
    }, [containerFilter]);

    useEffect(() => {
        var filterValues: string[] = []
        for(let item of categoryFilter) {
            if(item.checked)
                filterValues.push(item.name)
        }
        table.getColumn('category_name')?.setFilterValue(filterValues.length > 0 ? filterValues : [])
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
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 9,
          },
        },
        state: {
            sorting,
            columnFilters
        }
    })

    return (
        <div className="h-full max-h-full">
            <Collapsible className="mb-2 w-full">
                <div className="w-full flex items-center justify-between">
                    <CollapsibleTrigger className="flex items-center justify-between">
                        <Button variant="secondary" className="mr-2">
                            Filters
                            <ChevronsUpDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </CollapsibleTrigger>
                    <div className="flex items-center justify-end space-x-2 py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <LucideChevronLeft className="mr-2h-4 w-4"/>
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                            <LucideChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <CollapsibleContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Name"
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="focus-visible:ring-transparent"
                        />

                        <Input
                            placeholder="Description"
                            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("description")?.setFilterValue(event.target.value)
                            }
                            className="ml-4 focus-visible:ring-transparent"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="ml-4 focus-visible:ring-transparent">
                                <Button variant="outline" className="rounded-r-none">Locations
                                    <ChevronDown width={16} height={16} className="ml-2"/>
                                </Button>

                            </DropdownMenuTrigger>
                            <Button variant="outline" className="rounded-l-none"
                                    onClick={() => locationCheckChanged("", false)}>
                                <Power width={16} height={16}/>
                            </Button>
                            <DropdownMenuContent className="">
                                {
                                    locationFilter.map((location, index) => {
                                        return <DropdownMenuCheckboxItem
                                            checked={location.checked}
                                            onCheckedChange={(e) => locationCheckChanged(location.name, e)}
                                            key={location.ID}
                                        >
                                            {location.name}
                                        </DropdownMenuCheckboxItem>
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="ml-4 focus-visible:ring-transparent">
                                <Button variant="outline" className="rounded-r-none">Containers
                                    <ChevronDown width={16} height={16} className="ml-2"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <Button variant="outline" className="rounded-l-none"
                                    onClick={() => containerCheckChanged("", false)}>
                                <Power width={16} height={16}/>
                            </Button>
                            <DropdownMenuContent className="">
                                {
                                    containerFilter.map((container, index) => {
                                        return <DropdownMenuCheckboxItem
                                            checked={container.checked}
                                            onCheckedChange={(e) => containerCheckChanged(container.name, e)}
                                            key={container.ID}
                                        >
                                            {container.name}
                                        </DropdownMenuCheckboxItem>
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="ml-4 focus-visible:ring-transparent">
                                <Button variant="outline" className="rounded-r-none">Categories
                                    <ChevronDown width={16} height={16} className="ml-2"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <Button variant="outline" className="rounded-l-none"
                                    onClick={() => categoryCheckChanged("", false)}>
                                <Power width={16} height={16}/>
                            </Button>
                            <DropdownMenuContent className="">
                                {
                                    categoryFilter.map((category, index) => {
                                        return <DropdownMenuCheckboxItem
                                            checked={category.checked}
                                            onCheckedChange={(e) => categoryCheckChanged(category.name, e)}
                                            key={category.ID}
                                        >
                                            {category.name}
                                        </DropdownMenuCheckboxItem>
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CollapsibleContent>
            </Collapsible>
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
        </div>
    )
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export type DropdownFilter = {
    ID: number,
    name: string,
    checked: Checked
}