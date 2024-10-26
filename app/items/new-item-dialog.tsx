'use client'
import {z} from "zod";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover-modal";
import {Button} from "@/components/ui/button";
import {CalendarIcon, LucideIndianRupee} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {userStore} from "@/lib/userStore";
import {
    addCategory, additem,
    getCategoriesForUser,
    getContainersForLocation,
    getLocations
} from "@/data/db-actions";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "sonner";
import {Item, ItemRow} from "@/models/item";
import {Container} from "@/models/container";
import {Category} from "@/models/category";
import {Location} from "@/models/location"

export default function NewItemDialog({onItemAdded}: {onItemAdded: (newItem: ItemRow) => void}) {
    const {user} = userStore()

    const [locations, setLocations] = useState<Location[]>([])
    const [containers, setContainers] = useState<Container[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState(-1)

    useEffect(() => {
        getLocationsForUser()
        getCategories()
    }, [user])

    async function getLocationsForUser() {
        let response = await getLocations(user?.id ?? "")
        if(response.success && response.data) {
            setLocations(response.data)
        }
        else {
            toast.error(response.message, {duration: 3000})
        }
    }

    async function getCategories() {
        let response = await getCategoriesForUser(user?.id ?? "")
        if(response.success && response.data) {
            setCategories(response.data)
        }
        else {
            toast.error(response.message, {duration: 3000})
        }
    }

    const itemFormSchema = z.object({
        name: z.string().min(1).max(50, "Name must be between 1 and 50 characters"),
        description: z.string().min(1).max(500).optional(),
        purchaseDate: z.date().optional().default(new Date()),
        originalPrice: z.coerce.number().min(0).optional(),
        warrantyInfo: z.string().min(0).max(500).optional(),
        categoryId: z.string().min(1).max(1000).optional(),
        locationId: z.string().min(1).max(1000),
        containerId: z.string().min(1).max(1000),
    })

    const itemForm = useForm<z.infer<typeof itemFormSchema>>({
        resolver: zodResolver(itemFormSchema)
    })

    const locationChanged = (e: any) => {
        getContainersForLocation(e, user?.id ?? "").then(response => {
            if(response.success && response.data) {
                setContainers(response.data)
            }
        })
    }

    const toggleCategory = (categoryName: number) => {
        if(selectedCategory === categoryName) {
            setSelectedCategory(-1)
        } else {
            setSelectedCategory(categoryName)
        }
    }

    const createNewCategory = async (categoryName: string) => {
        let response = await addCategory(categoryName, user?.id ?? "")

        if(response.success && response.data) {
            console.log(response.data)
            return response.data[0].id
        }
        else {
            toast.error(response.message, {duration: 3000})
            return -1
        }
    }

    async function onSubmit(values: z.infer<typeof itemFormSchema>) {
        let newCategoryID = -1
        if(values.categoryId && values.categoryId.length > 0) {
            newCategoryID = await createNewCategory(values.categoryId)
        }

        const newItem: Item = {
            name: values.name,
            description: values.description ? values.description : "",
            purchase_date: values.purchaseDate ? values.purchaseDate : new Date(),
            original_price: values.originalPrice ? values.originalPrice : 0,
            warranty_info: values.warrantyInfo ? values.warrantyInfo : "",
            category_id: newCategoryID >= 0 ? newCategoryID : selectedCategory,
            location_id: values.locationId ? parseInt(values.locationId) : -1,
            container_id: values.containerId ? parseInt(values.containerId) : -1
        }

        console.log("ITEM TO ADD: ")
        console.log(newItem)


        const response = await additem(newItem, user?.id ?? "")
        if(response.success && response.data) {
            // optimistically add the item to the table
            response.data[0].category_name = response.data[0].categories.name
            response.data[0].location_name = response.data[0].locations.name
            response.data[0].container_name = response.data[0].containers.name

            let newItemRow: ItemRow = response.data[0]
            onItemAdded(newItemRow)

            toast.success(response.message, {duration: 3000})
            itemForm.reset()
        }
        else {
            toast.error(response.message, {duration: 3000})
        }

    }
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return(
        <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={itemForm.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Item Name <span className="text-orange-500">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="bluetooth speakers" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={itemForm.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Item Description</FormLabel>
                            <FormControl>
                                <Input placeholder="wireless white speakers with bluetooth" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center w-full justify-between space-x-4">
                    <FormField
                        control={itemForm.control}
                        name="purchaseDate"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Purchase Date</FormLabel>
                                <br/>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" side="bottom" avoidCollisions={false}>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={itemForm.control}
                        name="originalPrice"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Original Cost</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row items-center gap-2">
                                        <LucideIndianRupee className="w-5 h-5"/>
                                        <Input type="number" placeholder="500" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                </div>


                <FormField
                    control={itemForm.control}
                    name="warrantyInfo"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Warranty Info</FormLabel>
                            <FormControl>
                                <Input placeholder="2 year warranty, free repairs" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center w-full justify-between space-x-4">

                    <FormField
                        control={itemForm.control}
                        name="locationId"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Location <span className="text-orange-500">*</span></FormLabel>
                                <Select onValueChange={(value) => {field.onChange(value); locationChanged(value);}} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the location to place your item"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            locations.map(location => {
                                                return (
                                                    <SelectItem key={location.id}
                                                                value={location.id.toString()}
                                                    >{location.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={itemForm.control}
                        name="containerId"
                        render={({field}) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Container <span className="text-orange-500">*</span></FormLabel>
                                {
                                    containers.length > 0 ?
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a container in your location"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    containers.map(container => {
                                                        return (
                                                            <SelectItem key={container.id}
                                                                        value={container.id.toString()}>{container.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        :
                                        <p className="text-sm">Please select a location first</p>
                                }
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={itemForm.control}
                    name="categoryId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category <span className="text-orange-500">*</span></FormLabel>
                                <div className="flex flex-row items-start gap-2 w-full">
                                    {
                                        categories.length > 0 ?
                                        <div className="w-1/2">
                                            <p className="text-sm font-medium mb-2">Select from existing categories:</p>
                                            <div>
                                            {
                                                categories.map(category => {
                                                return (
                                                <Badge key={category.id}
                                                 className="w-fit hover:bg-foreground hover:text-background hover:cursor-pointer px-2 py-1 mr-2 mb-2"
                                                 variant={selectedCategory === category.id ? "success" : "secondary"}
                                                 onClick={() => toggleCategory(category.id)}
                                                    >{category.name}</Badge>
                                                    )
                                                })
                                            }
                                            </div>
                                        </div>
                                        :
                                        <Skeleton className="w-1/2 h-20" />


                                    }
                                <div className="w-6 h-32 border-l"></div>
                                <FormControl>
                                    <div className="w-1/2">
                                        <p className="text-sm font-medium mb-2">Add a new category:</p>
                                        <Input placeholder="Enter one or more categories separated by commas" {...field}
                                            onFocus={() => setSelectedCategory(-1)}
                                        />
                                    </div>
                                </FormControl>

                            </div>
                            <FormDescription>
                                One item can have only one category, if you enter a new category, the existing category will be removed
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                    <Button variant="default" className="w-full" onClick={itemForm.handleSubmit(onSubmit)}>Add Item</Button>
            </form>
        </Form>
)
}